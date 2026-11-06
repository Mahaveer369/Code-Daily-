-- ============================================================================
-- CODE IT OUT — SUPABASE AUTO-MIGRATION SCHEMA (PostgreSQL 16 + RLS)
-- Zero-Warning Hardened for Supabase Security & Performance Advisor:
-- 1. View uses `WITH (security_invoker = true)` (Fixes CRITICAL Security Definer View)
-- 2. All RLS policies wrap `((select auth.jwt() ->> 'sub'))` (Fixes Auth RLS InitPlan)
-- 3. All Functions enforce `SET search_path = ''` (Fixes Function Search Path Mutable)
-- 4. Revokes PUBLIC/anon/authenticated execute on `public.rls_auto_enable()` if present
-- 5. Eliminates redundant indexes duplicating PK leading columns
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUMERATED TYPES FOR GAMIFIED TIER PROGRESSION & ROLES
DO $$ BEGIN
  CREATE TYPE public.user_tier_enum AS ENUM ('Novice', 'Practitioner', 'Specialist', 'Master', 'Architect');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.user_role_enum AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. USERS TABLE (Primary Key = Firebase Auth UID)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY, -- Matches Firebase Auth UID ((select auth.jwt() ->> 'sub'))
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  role public.user_role_enum NOT NULL DEFAULT 'user',
  tier public.user_tier_enum NOT NULL DEFAULT 'Novice',
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
  streak INTEGER NOT NULL DEFAULT 1 CHECK (streak >= 0),
  solved_problem_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  badges JSONB NOT NULL DEFAULT '[]'::jsonb,
  primary_track TEXT NOT NULL DEFAULT 'Full-Stack & Systems',
  last_login TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. AUTOMATIC PL/pgSQL TRIGGER WITH IMMUTABLE SEARCH_PATH = ''
CREATE OR REPLACE FUNCTION public.fn_sync_user_tier_and_level()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.level := FLOOR(GREATEST(0, NEW.xp) / 500.0) + 1;
  IF NEW.xp >= 5000 THEN
    NEW.tier := 'Architect';
  ELSIF NEW.xp >= 3000 THEN
    NEW.tier := 'Master';
  ELSIF NEW.xp >= 1500 THEN
    NEW.tier := 'Specialist';
  ELSIF NEW.xp >= 500 THEN
    NEW.tier := 'Practitioner';
  ELSE
    NEW.tier := 'Novice';
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_user_tier_and_level ON public.users;
CREATE TRIGGER trg_sync_user_tier_and_level
BEFORE INSERT OR UPDATE OF xp ON public.users
FOR EACH ROW EXECUTE FUNCTION public.fn_sync_user_tier_and_level();

-- 4. COURSE PROGRESS TABLE (Composite PK: user_id + course_id, 25 Modules/Track)
CREATE TABLE IF NOT EXISTS public.course_progress (
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  completed_module_ids TEXT[] NOT NULL DEFAULT '{}',
  total_modules INTEGER NOT NULL DEFAULT 25 CHECK (total_modules > 0),
  quiz_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_accessed_module_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, course_id)
);

-- 5. GRANULAR MODULE COMPLETIONS AUDIT TABLE (3NF Milestone Tracking)
CREATE TABLE IF NOT EXISTS public.module_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  quiz_score INTEGER NOT NULL DEFAULT 100 CHECK (quiz_score BETWEEN 0 AND 100),
  xp_awarded INTEGER NOT NULL DEFAULT 50 CHECK (xp_awarded >= 0),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id, module_id)
);

-- 6. BOOKMARKS & PERSONAL REVISION NOTES TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  module_title TEXT NOT NULL,
  note TEXT NOT NULL CHECK (char_length(note) <= 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. VERIFIED COURSE CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  course_title TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  verification_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

-- 8. CLEAN UP REDUNDANT/UNUSED INDEXES & KEEP COMPOSITE LEADERBOARD INDEX
DROP INDEX IF EXISTS public.idx_users_tier;
DROP INDEX IF EXISTS public.idx_course_progress_user;
CREATE INDEX IF NOT EXISTS idx_users_leaderboard ON public.users (xp DESC, streak DESC, level DESC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_created ON public.bookmarks (user_id, created_at DESC);

-- 9. GLOBAL LEADERBOARD VIEW WITH SECURITY INVOKER = TRUE (Fixes CRITICAL Security Definer View)
CREATE OR REPLACE VIEW public.global_leaderboard_view
WITH (security_invoker = true)
AS
SELECT
  DENSE_RANK() OVER (ORDER BY u.xp DESC, u.streak DESC, u.created_at ASC) AS rank,
  u.id,
  u.name,
  u.tier,
  u.xp,
  u.level,
  u.streak,
  u.primary_track,
  COALESCE(jsonb_array_length(u.solved_problem_ids), 0) AS solved_problems,
  COALESCE(
    (SELECT SUM( COALESCE(array_length(cp.completed_module_ids, 1), 0) )
     FROM public.course_progress cp WHERE cp.user_id = u.id),
    0
  )::INTEGER AS completed_modules
FROM public.users u;

ALTER VIEW public.global_leaderboard_view SET (security_invoker = true);

-- 10. ZERO-TRUST ROW-LEVEL SECURITY (RLS) WITH CACHED INITPLAN ((select auth.jwt() ->> 'sub'))
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Users Table Policies (Cached InitPlan evaluation)
DROP POLICY IF EXISTS "Users can read leaderboard profiles" ON public.users;
CREATE POLICY "Users can read leaderboard profiles"
  ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own Firebase UID profile" ON public.users;
CREATE POLICY "Users can insert own Firebase UID profile"
  ON public.users FOR INSERT WITH CHECK (((select auth.jwt() ->> 'sub')) = id);

DROP POLICY IF EXISTS "Users can update own Firebase UID profile" ON public.users;
CREATE POLICY "Users can update own Firebase UID profile"
  ON public.users FOR UPDATE USING (((select auth.jwt() ->> 'sub')) = id)
  WITH CHECK (((select auth.jwt() ->> 'sub')) = id);

DROP POLICY IF EXISTS "Users can delete own Firebase UID profile" ON public.users;
CREATE POLICY "Users can delete own Firebase UID profile"
  ON public.users FOR DELETE USING (((select auth.jwt() ->> 'sub')) = id);

-- Course Progress Policies (Split SELECT vs write or cached InitPlan FOR ALL)
DROP POLICY IF EXISTS "Users manage own course_progress" ON public.course_progress;
CREATE POLICY "Users manage own course_progress"
  ON public.course_progress FOR ALL
  USING (((select auth.jwt() ->> 'sub')) = user_id)
  WITH CHECK (((select auth.jwt() ->> 'sub')) = user_id);

-- Module Completions Policies
DROP POLICY IF EXISTS "Users manage own module_completions" ON public.module_completions;
CREATE POLICY "Users manage own module_completions"
  ON public.module_completions FOR ALL
  USING (((select auth.jwt() ->> 'sub')) = user_id)
  WITH CHECK (((select auth.jwt() ->> 'sub')) = user_id);

-- Bookmarks Policies
DROP POLICY IF EXISTS "Users manage own bookmarks" ON public.bookmarks;
CREATE POLICY "Users manage own bookmarks"
  ON public.bookmarks FOR ALL
  USING (((select auth.jwt() ->> 'sub')) = user_id)
  WITH CHECK (((select auth.jwt() ->> 'sub')) = user_id);

-- Certificates Policies
DROP POLICY IF EXISTS "Users manage own certificates" ON public.certificates;
CREATE POLICY "Users manage own certificates"
  ON public.certificates FOR ALL
  USING (((select auth.jwt() ->> 'sub')) = user_id)
  WITH CHECK (((select auth.jwt() ->> 'sub')) = user_id);

-- 11. HARDEN SUPABASE DEFAULT `public.rls_auto_enable()` IF PRESENT IN PROJECT
DO $$
DECLARE
  fn_oid OID;
BEGIN
  FOR fn_oid IN
    SELECT p.oid
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'rls_auto_enable'
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET search_path = ''''', fn_oid::regprocedure);
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', fn_oid::regprocedure);
  END LOOP;
END $$;
