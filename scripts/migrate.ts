import fs from 'fs';
import path from 'path';
import pg from 'pg';

export interface MigrationResult {
  executed: boolean;
  migrated: boolean;
  tables: string[];
  message: string;
}

const FALLBACK_SCHEMA_SQL = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE user_tier_enum AS ENUM ('Novice', 'Practitioner', 'Specialist', 'Master', 'Architect');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_role_enum AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  role user_role_enum NOT NULL DEFAULT 'user',
  tier user_tier_enum NOT NULL DEFAULT 'Novice',
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
RETURNS TRIGGER LANGUAGE plpgsql AS $$
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

CREATE INDEX IF NOT EXISTS idx_users_leaderboard ON public.users (xp DESC, streak DESC, level DESC);
CREATE INDEX IF NOT EXISTS idx_users_tier ON public.users (tier);
CREATE INDEX IF NOT EXISTS idx_course_progress_user ON public.course_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_created ON public.bookmarks (user_id, created_at DESC);

CREATE OR REPLACE VIEW public.global_leaderboard_view AS
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
`;

export function normalizePostgresUrl(rawUrl: string): string {
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

export function resolveDatabaseUrl(): string {
  const direct = (
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.VITE_POSTGRES_URL ||
    process.env.VITE_DATABASE_URL ||
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

export async function executeSupabaseMigration(): Promise<MigrationResult> {
  const rawDbUrl = resolveDatabaseUrl();

  console.log('# ========================================================================');
  console.log('# VERCEL CI/CD PIPELINE — STAGE 1/3: SUPABASE POSTGRESQL AUTO-MIGRATION');
  console.log('# ========================================================================');

  if (!rawDbUrl) {
    const msg =
      'No POSTGRES_URL / DATABASE_URL detected in environment. Skipping build-time DDL migration (link Supabase in Vercel Storage or set POSTGRES_URL to auto-create tables on deploy).';
    console.log(`# [Supabase Migration] ${msg}`);
    return {
      executed: false,
      migrated: false,
      tables: [],
      message: msg,
    };
  }

  const migrationFile = path.join(
    process.cwd(),
    'supabase',
    'migrations',
    '20261105000000_init_schema.sql'
  );

  const sqlContent = fs.existsSync(migrationFile)
    ? fs.readFileSync(migrationFile, 'utf-8')
    : FALLBACK_SCHEMA_SQL;

  const cleanConnectionString = normalizePostgresUrl(rawDbUrl);

  const client = new pg.Client({
    connectionString: cleanConnectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log('# [Supabase Migration] Connected to Supabase PostgreSQL 16 (schema: public).');
    await client.query(sqlContent);

    await client.query(`
      INSERT INTO public.users (id, email, name, role, tier, xp, level, streak, primary_track)
      VALUES
        ('usr_seed_01', 'kavya.krishnan@codeitout.io', 'Dr. Kavya Krishnan', 'user', 'Architect', 7450, 15, 72, 'System Design & K8s'),
        ('usr_seed_02', 'marcus.vance@codeitout.io', 'Marcus Vance', 'user', 'Architect', 6980, 14, 65, 'Agentic Harness & AI'),
        ('usr_seed_03', 'kenji.takahashi@codeitout.io', 'Kenji Takahashi', 'user', 'Architect', 6640, 14, 61, 'Modern C++20/23 Systems'),
        ('usr_seed_10', 'aarav.sharma@codeitout.io', 'Aarav Sharma', 'user', 'Master', 4820, 10, 41, 'Modern C++20/23 Systems'),
        ('usr_seed_21', 'rohan.verma@codeitout.io', 'Rohan Verma', 'user', 'Specialist', 2920, 6, 25, 'SQL & Storage Engines')
      ON CONFLICT (id) DO NOTHING;
    `);

    const checkRes = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name ASC;
    `);
    const tables = checkRes.rows.map((r: any) => String(r.table_name));
    console.log(
      `# [Supabase Migration] ✓ SUCCESS — Verified ${tables.length} public tables/views: ${tables.join(', ')}`
    );
    return {
      executed: true,
      migrated: true,
      tables,
      message: `Executed schema & verified ${tables.length} tables/views in schema 'public' (${tables.join(', ')}).`,
    };
  } catch (err: any) {
    const errMsg = `Migration warning: ${err?.message || String(err)}`;
    console.warn(`# [Supabase Migration] ${errMsg}`);
    return {
      executed: false,
      migrated: false,
      tables: [],
      message: errMsg,
    };
  } finally {
    try {
      await client.end();
    } catch {
      // Ignore close error
    }
  }
}

const isDirectRun =
  typeof process !== 'undefined' &&
  Array.isArray(process.argv) &&
  process.argv[1] &&
  process.argv[1].includes('migrate');

if (isDirectRun) {
  executeSupabaseMigration().catch((err) => {
    console.warn('# [Supabase Migration] Unexpected error:', err);
  });
}
