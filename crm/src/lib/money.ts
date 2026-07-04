import { db } from './supabase';
import { logSystemActivity } from './actions';
import type {
  CompanySettings,
  Deliverable,
  Invoice,
  LineItem,
  Project,
  Quote,
} from './types';

/** Fetches the settings row, creating the default one on first use. */
export async function getSettings(): Promise<CompanySettings> {
  const { data, error } = await db()
    .from('company_settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (data) return data as CompanySettings;

  const { data: created, error: insertError } = await db()
    .from('company_settings')
    .insert({})
    .select('*')
    .single();
  if (insertError) throw insertError;
  return created as CompanySettings;
}

export function computeTotals(
  items: LineItem[],
  settings: Pick<CompanySettings, 'vat_registered' | 'vat_rate'>,
) {
  const subtotal = round2(items.reduce((s, i) => s + i.line_total, 0));
  const vat_amount = settings.vat_registered
    ? round2((subtotal * Number(settings.vat_rate)) / 100)
    : 0;
  return { subtotal, vat_amount, total: round2(subtotal + vat_amount) };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function pad(n: number) {
  return String(n).padStart(4, '0');
}

/** Reserves the next invoice number (TP-INV-0001 style) and bumps the counter. */
export async function nextInvoiceNumber(): Promise<string> {
  const settings = await getSettings();
  const number = `${settings.invoice_prefix}${pad(settings.next_invoice_number)}`;
  const { error } = await db()
    .from('company_settings')
    .update({ next_invoice_number: settings.next_invoice_number + 1 })
    .eq('id', settings.id);
  if (error) throw error;
  return number;
}

export async function nextQuoteNumber(): Promise<string> {
  const settings = await getSettings();
  const number = `${settings.quote_prefix}${pad(settings.next_quote_number)}`;
  const { error } = await db()
    .from('company_settings')
    .update({ next_quote_number: settings.next_quote_number + 1 })
    .eq('id', settings.id);
  if (error) throw error;
  return number;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function defaultDueDate(days = 14) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * "Ready to invoice" → drafts an invoice from a project: agreed deal value if
 * the project came from a deal, otherwise one line per live/approved
 * deliverable to price up by hand.
 */
export async function createInvoiceFromProject(project: Project): Promise<string> {
  const settings = await getSettings();

  let items: LineItem[] = [];
  if (project.deal_id) {
    const { data: deal } = await db()
      .from('deals')
      .select('title, value')
      .eq('id', project.deal_id)
      .maybeSingle();
    if (deal?.value != null) {
      items = [
        {
          description: `${project.name} — as quoted (${deal.title})`,
          qty: 1,
          unit_price: Number(deal.value),
          line_total: Number(deal.value),
        },
      ];
    }
  }
  if (items.length === 0) {
    const { data: deliverables } = await db()
      .from('deliverables')
      .select('*')
      .eq('project_id', project.id)
      .in('status', ['approved', 'live']);
    items = ((deliverables ?? []) as Deliverable[]).map((d) => ({
      description: d.title,
      qty: 1,
      unit_price: 0,
      line_total: 0,
    }));
  }
  if (items.length === 0) {
    items = [{ description: project.name, qty: 1, unit_price: 0, line_total: 0 }];
  }

  const totals = computeTotals(items, settings);
  const number = await nextInvoiceNumber();
  const { data, error } = await db()
    .from('invoices')
    .insert({
      account_id: project.account_id,
      project_id: project.id,
      number,
      line_items: items,
      ...totals,
      status: 'draft',
      issue_date: todayISO(),
      due_date: defaultDueDate(),
      pricing_type: 'one_off',
    })
    .select('id')
    .single();
  if (error) throw error;

  await db()
    .from('projects')
    .update({ ready_to_invoice: false })
    .eq('id', project.id);
  await logSystemActivity(
    project.account_id,
    `Invoice ${number} drafted from project “${project.name}”`,
  );
  return data.id;
}

/** Accepted quote → invoice in one tap, zero re-entry. */
export async function convertQuoteToInvoice(quote: Quote): Promise<string> {
  const settings = await getSettings();
  const totals = computeTotals(quote.line_items, settings);
  const number = await nextInvoiceNumber();
  const { data, error } = await db()
    .from('invoices')
    .insert({
      account_id: quote.account_id,
      quote_id: quote.id,
      number,
      line_items: quote.line_items,
      ...totals,
      status: 'draft',
      issue_date: todayISO(),
      due_date: defaultDueDate(),
      pricing_type: 'one_off',
    })
    .select('id')
    .single();
  if (error) throw error;

  if (quote.status !== 'accepted') {
    await db().from('quotes').update({ status: 'accepted' }).eq('id', quote.id);
  }
  await logSystemActivity(
    quote.account_id,
    `Quote ${quote.number} converted to invoice ${number}`,
  );
  return data.id;
}

export async function markInvoicePaid(invoice: Invoice): Promise<void> {
  const { error } = await db()
    .from('invoices')
    .update({ status: 'paid', paid_date: todayISO() })
    .eq('id', invoice.id);
  if (error) throw error;
  await logSystemActivity(invoice.account_id, `Invoice ${invoice.number} paid`);
}

/** Flips sent invoices past their due date to overdue. Safe to run on load. */
export async function flagOverdueInvoices(): Promise<void> {
  await db()
    .from('invoices')
    .update({ status: 'overdue' })
    .eq('status', 'sent')
    .lt('due_date', todayISO());
}
