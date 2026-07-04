import { db } from './supabase';
import { logSystemActivity } from './actions';
import { computeTotals, getSettings, nextInvoiceNumber } from './money';
import type { Retainer, RetainerTemplateItem } from './types';

export interface RunResult {
  invoicesCreated: number;
  deliverablesCreated: number;
  skipped: number;
}

function monthLabel(d = new Date()) {
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

function monthBounds(d = new Date()) {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const iso = (x: Date) =>
    `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(
      x.getDate(),
    ).padStart(2, '0')}`;
  return { first: iso(first), last: iso(last) };
}

/**
 * "Run the month": for every active retainer that hasn't been run this month,
 * draft the retainer invoice and schedule the month's deliverable set (in a
 * dedicated project). Safe to tap twice — already-run retainers are skipped.
 */
export async function runTheMonth(): Promise<RunResult> {
  const settings = await getSettings();
  const { first, last } = monthBounds();
  const label = monthLabel();

  const { data: retainers, error } = await db()
    .from('retainers')
    .select('*, account:accounts(name)')
    .eq('status', 'active');
  if (error) throw error;

  const result: RunResult = { invoicesCreated: 0, deliverablesCreated: 0, skipped: 0 };

  for (const retainer of (retainers ?? []) as Retainer[]) {
    // Idempotence: a retainer invoice for this account issued this month means done.
    const { data: existing } = await db()
      .from('invoices')
      .select('id')
      .eq('account_id', retainer.account_id)
      .eq('pricing_type', 'retainer')
      .gte('issue_date', first)
      .lte('issue_date', last)
      .limit(1);
    if (existing && existing.length > 0) {
      result.skipped += 1;
      continue;
    }

    // 1. The invoice.
    const items = [
      {
        description: `Monthly retainer — ${label}`,
        qty: 1,
        unit_price: Number(retainer.monthly_amount),
        line_total: Number(retainer.monthly_amount),
      },
    ];
    const totals = computeTotals(items, settings);
    const number = await nextInvoiceNumber();
    const { error: invError } = await db().from('invoices').insert({
      account_id: retainer.account_id,
      number,
      line_items: items,
      ...totals,
      status: 'draft',
      issue_date: first,
      due_date: last,
      pricing_type: 'retainer',
    });
    if (invError) throw invError;
    result.invoicesCreated += 1;

    // 2. The month's deliverable set, in its own project.
    const template = (retainer.deliverable_template ?? []) as RetainerTemplateItem[];
    if (template.length > 0) {
      const { data: project, error: prjError } = await db()
        .from('projects')
        .insert({
          account_id: retainer.account_id,
          name: `${retainer.account?.name ?? 'Retainer'} — ${label}`,
          status: 'active',
          start_date: first,
          due_date: last,
        })
        .select('id')
        .single();
      if (prjError) throw prjError;

      const { error: dlvError } = await db()
        .from('deliverables')
        .insert(
          template.map((t) => ({
            project_id: project.id,
            type: t.type,
            title: t.title,
            status: 'to_do',
            due_date: last,
          })),
        );
      if (dlvError) throw dlvError;
      result.deliverablesCreated += template.length;
    }

    await logSystemActivity(
      retainer.account_id,
      `Month run for ${label}: invoice ${number} drafted${
        template.length > 0 ? ` + ${template.length} deliverables scheduled` : ''
      }`,
    );
  }

  return result;
}
