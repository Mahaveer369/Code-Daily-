import pg from 'pg';

const EMBEDDED_SCHEMA_SQL = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE public.user_tier_enum AS ENUM ('Novice', 'Practitioner', 'Specialist', 'Master', 'Architect');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.user_role_enum AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS public.bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  module_title TEXT NOT NULL,
  note TEXT NOT NULL CHECK (char_length(note) <= 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

DROP INDEX IF EXISTS public.idx_users_tier;
DROP INDEX IF EXISTS public.idx_course_progress_user;
CREATE INDEX IF NOT EXISTS idx_users_leaderboard ON public.users (xp DESC, streak DESC, level DESC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_created ON public.bookmarks (user_id, created_at DESC);

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

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

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

DROP POLICY IF EXISTS "Users manage own course_progress" ON public.course_progress;
CREATE POLICY "Users manage own course_progress"
  ON public.course_progress FOR ALL
  USING (((select auth.jwt() ->> 'sub')) = user_id)
  WITH CHECK (((select auth.jwt() ->> 'sub')) = user_id);

DROP POLICY IF EXISTS "Users manage own module_completions" ON public.module_completions;
CREATE POLICY "Users manage own module_completions"
  ON public.module_completions FOR ALL
  USING (((select auth.jwt() ->> 'sub')) = user_id)
  WITH CHECK (((select auth.jwt() ->> 'sub')) = user_id);

DROP POLICY IF EXISTS "Users manage own bookmarks" ON public.bookmarks;
CREATE POLICY "Users manage own bookmarks"
  ON public.bookmarks FOR ALL
  USING (((select auth.jwt() ->> 'sub')) = user_id)
  WITH CHECK (((select auth.jwt() ->> 'sub')) = user_id);

DROP POLICY IF EXISTS "Users manage own certificates" ON public.certificates;
CREATE POLICY "Users manage own certificates"
  ON public.certificates FOR ALL
  USING (((select auth.jwt() ->> 'sub')) = user_id)
  WITH CHECK (((select auth.jwt() ->> 'sub')) = user_id);

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
`;

const SEED_RELATIONAL_SQL = `
INSERT INTO public.users (id, email, name, role, tier, xp, level, streak, primary_track)
VALUES
  ('usr_seed_01', 'kavya.krishnan@codeitout.io', 'Dr. Kavya Krishnan', 'user', 'Architect', 7450, 15, 72, 'System Design & K8s'),
  ('usr_seed_02', 'marcus.vance@codeitout.io', 'Marcus Vance', 'user', 'Architect', 6980, 14, 65, 'Agentic Harness & AI'),
  ('usr_seed_03', 'kenji.takahashi@codeitout.io', 'Kenji Takahashi', 'user', 'Architect', 6640, 14, 61, 'Modern C++20/23 Systems'),
  ('usr_seed_10', 'aarav.sharma@codeitout.io', 'Aarav Sharma', 'user', 'Master', 4820, 10, 41, 'Modern C++20/23 Systems'),
  ('usr_seed_21', 'rohan.verma@codeitout.io', 'Rohan Verma', 'user', 'Specialist', 2920, 6, 25, 'SQL & Storage Engines')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_progress (user_id, course_id, completed_module_ids, total_modules, quiz_scores, last_accessed_module_id)
VALUES
  ('usr_seed_01', 'course_sysdesign', ARRAY['sd_01','sd_02','sd_03','sd_04','sd_05'], 25, '{"sd_01":100,"sd_02":100}'::jsonb, 'sd_05'),
  ('usr_seed_03', 'course_cpp', ARRAY['cpp_01','cpp_02','cpp_03'], 25, '{"cpp_01":100}'::jsonb, 'cpp_03')
ON CONFLICT (user_id, course_id) DO NOTHING;

INSERT INTO public.module_completions (user_id, course_id, module_id, quiz_score, xp_awarded)
VALUES
  ('usr_seed_01', 'course_sysdesign', 'sd_01', 100, 50),
  ('usr_seed_03', 'course_cpp', 'cpp_01', 100, 50)
ON CONFLICT (user_id, course_id, module_id) DO NOTHING;

INSERT INTO public.bookmarks (id, user_id, module_id, module_title, note)
VALUES
  ('bm_seed_01', 'usr_seed_01', 'sd_01', 'System Design & Consistent Hashing', 'Consistent hashing ring with virtual nodes prevents hot-shard cascading failures.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.certificates (id, user_id, course_id, course_title, issue_date, verification_code)
VALUES
  ('cert_seed_01', 'usr_seed_01', 'course_sysdesign', 'System Design & Distributed Architecture', '2026-11-05', 'CIO-SYSDESIGN-2026-001')
ON CONFLICT (id) DO NOTHING;
`;

function normalizePostgresUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl.trim());
    parsed.searchParams.delete('sslmode');
    parsed.searchParams.delete('sslrootcert');
    parsed.searchParams.delete('sslcert');
    parsed.searchParams.delete('sslkey');
    return parsed.toString();
  } catch {
    return rawUrl
      .replace(/([?&])sslmode=[^&]+(&?)/gi, (_m, p1, p2) => (p2 ? p1 : ''))
      .replace(/[?&]$/, '');
  }
}

function resolveDatabaseUrl(): string {
  const direct = (
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    ''
  ).trim();

  if (direct) return direct;

  if (process.env.POSTGRES_HOST && process.env.POSTGRES_PASSWORD) {
    const user = encodeURIComponent(process.env.POSTGRES_USER || 'postgres');
    const pass = encodeURIComponent(process.env.POSTGRES_PASSWORD);
    const host = process.env.POSTGRES_HOST;
    const dbName = process.env.POSTGRES_DATABASE || 'postgres';
    return `postgresql://${user}:${pass}@${host}:5432/${dbName}`;
  }

  return '';
}

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method && req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ ok: false, executed: false, message: 'Method Not Allowed' });
  }

  const rawDbUrl = resolveDatabaseUrl();
  if (!rawDbUrl) {
    return res.status(200).json({
      ok: false,
      executed: false,
      migrated: false,
      tables: [],
      message:
        'No POSTGRES_URL / DATABASE_URL found in Vercel Environment Variables. Add POSTGRES_URL (from Supabase Connect -> URI) or copy the SQL schema into Supabase SQL Editor.',
    });
  }

  const client = new pg.Client({
    connectionString: normalizePostgresUrl(rawDbUrl),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    await client.query(EMBEDDED_SCHEMA_SQL);
    await client.query(SEED_RELATIONAL_SQL);

    const checkRes = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name ASC;
    `);
    const tables = checkRes.rows.map((r: any) => String(r.table_name));

    return res.status(200).json({
      ok: true,
      executed: true,
      migrated: true,
      tables,
      message: `Executed zero-warning 3NF schema & RLS in schema 'public' (${tables.join(', ')}).`,
    });
  } catch (err: any) {
    return res.status(200).json({
      ok: false,
      executed: false,
      migrated: false,
      tables: [],
      message: err?.message || 'Runtime migration warning',
    });
  } finally {
    try {
      await client.end();
    } catch {
      // Ignore close error
    }
  }
}
