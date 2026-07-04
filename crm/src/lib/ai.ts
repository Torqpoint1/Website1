import { db } from './supabase';

export type AIAction =
  | 'draft_outreach'
  | 'draft_followup'
  | 'summarise'
  | 'next_move'
  | 'chase_draft'
  | 'draft_deliverable'
  | 'lead_research'
  | 'run_my_week';

export async function runAI(
  action: AIAction,
  context: Record<string, unknown>,
): Promise<string> {
  const { data } = await db().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Not signed in.');

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action, context }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error ?? `AI call failed (${response.status})`);
  }
  return body.text as string;
}

/** Everything the AI needs to know about one account, in one payload. */
export async function buildAccountContext(accountId: string) {
  const [account, deals, activities, tasks, projects] = await Promise.all([
    db().from('accounts').select('*').eq('id', accountId).single(),
    db().from('deals').select('*').eq('account_id', accountId),
    db()
      .from('activities')
      .select('type, body, occurred_at')
      .eq('account_id', accountId)
      .order('occurred_at', { ascending: false })
      .limit(25),
    db()
      .from('tasks')
      .select('title, due_date, done')
      .eq('related_type', 'account')
      .eq('related_id', accountId),
    db()
      .from('projects')
      .select('name, status, due_date, ready_to_invoice')
      .eq('account_id', accountId),
  ]);
  return {
    today: new Date().toISOString().slice(0, 10),
    account: account.data,
    deals: deals.data,
    recent_activity: activities.data,
    follow_ups: tasks.data,
    projects: projects.data,
  };
}

/** Whole-business snapshot for the "Run my week" briefing. */
export async function buildWeekContext() {
  const [deals, tasks, invoices, retainers, deliverables, activities] =
    await Promise.all([
      db()
        .from('deals')
        .select('title, pipeline_stage, value, created_at, account:accounts(name)')
        .eq('status', 'open'),
      db()
        .from('tasks')
        .select('title, due_date, related_type')
        .eq('done', false),
      db()
        .from('invoices')
        .select('number, total, status, due_date, account:accounts(name)')
        .in('status', ['draft', 'sent', 'overdue']),
      db()
        .from('retainers')
        .select('monthly_amount, status, account:accounts(name)'),
      db()
        .from('deliverables')
        .select('title, status, due_date, project:projects(name)')
        .neq('status', 'live'),
      db()
        .from('activities')
        .select('body, occurred_at, account:accounts(name)')
        .order('occurred_at', { ascending: false })
        .limit(30),
    ]);
  return {
    today: new Date().toISOString().slice(0, 10),
    open_deals: deals.data,
    open_follow_ups: tasks.data,
    unpaid_invoices: invoices.data,
    retainers: retainers.data,
    deliverables_in_flight: deliverables.data,
    recent_activity: activities.data,
  };
}
