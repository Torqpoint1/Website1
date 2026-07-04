import { db } from './supabase';

const TABLES = [
  'accounts',
  'contacts',
  'deals',
  'projects',
  'deliverables',
  'tasks',
  'activities',
  'quotes',
  'invoices',
  'retainers',
  'expenses',
  'assets',
  'company_settings',
] as const;

/**
 * Pulls every row the signed-in user owns and hands it back as one object.
 * Runs entirely in the browser under row-level security — no server involved.
 */
export async function buildBackup() {
  const backup: Record<string, unknown> = {
    exported_at: new Date().toISOString(),
    app: 'Torqpoint CRM',
    format: 1,
  };
  for (const table of TABLES) {
    const { data, error } = await db().from(table).select('*');
    if (error) {
      // A table that doesn't exist yet (feature not switched on) is fine —
      // note it and keep going rather than failing the whole backup.
      if (error.code === '42P01') {
        backup[table] = [];
        continue;
      }
      throw new Error(`Could not export ${table}: ${error.message}`);
    }
    backup[table] = data ?? [];
  }
  return backup;
}

export async function downloadBackup(): Promise<{ rows: number }> {
  const backup = await buildBackup();
  const rows = TABLES.reduce(
    (sum, t) => sum + ((backup[t] as unknown[])?.length ?? 0),
    0,
  );

  const stamp = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `torqpoint-crm-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return { rows };
}
