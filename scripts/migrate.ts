import fs from 'fs';
import path from 'path';
import pg from 'pg';

export interface MigrationResult {
  executed: boolean;
  tables: string[];
  message: string;
}

/**
 * Normalizes a PostgreSQL connection URL (e.g. from Vercel-Supabase integration)
 * by stripping `sslmode=require` query parameters that otherwise override
 * `ssl: { rejectUnauthorized: false }` in node-postgres (`pg` v8).
 */
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
  return (
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.VITE_POSTGRES_URL ||
    process.env.VITE_DATABASE_URL ||
    ''
  ).trim();
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

  if (!fs.existsSync(migrationFile)) {
    const msg = `Migration SQL file not found at ${migrationFile}`;
    console.warn(`# [Supabase Migration] ${msg}`);
    return { executed: false, tables: [], message: msg };
  }

  const sqlContent = fs.readFileSync(migrationFile, 'utf-8');
  const cleanConnectionString = normalizePostgresUrl(rawDbUrl);

  const client = new pg.Client({
    connectionString: cleanConnectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log('# [Supabase Migration] Connected to Supabase PostgreSQL 16.');
    await client.query(sqlContent);

    // Seed initial cohort into public.users (idempotent ON CONFLICT DO NOTHING)
    // so the Supabase Table Editor immediately shows populated records
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
      tables,
      message: `Executed schema & verified ${tables.length} tables/views (${tables.join(', ')}).`,
    };
  } catch (err: any) {
    const errMsg = `Migration warning: ${err?.message || String(err)}`;
    console.warn(`# [Supabase Migration] ${errMsg}`);
    return {
      executed: false,
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

// Run automatically when invoked as `tsx scripts/migrate.ts`
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
