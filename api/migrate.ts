import { executeSupabaseMigration } from '../scripts/migrate';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method && req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  try {
    const result = await executeSupabaseMigration();
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(200).json({
      ok: false,
      migrated: false,
      tablesVerified: [],
      message: err?.message || 'Runtime migration error',
    });
  }
}
