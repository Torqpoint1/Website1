import { db } from './supabase';
import type { Deal, LeadSource, PipelineStage } from './types';
import { STAGE_LABELS } from './types';

export interface NewLeadForm {
  name: string;
  niche: string;
  location: string;
  website: string;
  instagram: string;
  lead_source: LeadSource;
  contact_name: string;
  contact_role: string;
  contact_email: string;
  contact_phone: string;
  deal_title: string;
  deal_value: string;
}

/** Creates the account + its first open deal, and logs it. Returns account id. */
export async function createLead(form: NewLeadForm): Promise<string> {
  const clean = (v: string) => (v.trim() === '' ? null : v.trim());

  const { data: account, error } = await db()
    .from('accounts')
    .insert({
      name: form.name.trim(),
      niche: clean(form.niche),
      location: clean(form.location),
      website: clean(form.website),
      instagram: clean(form.instagram),
      lead_source: form.lead_source,
      pipeline_stage: 'new_lead',
      status: 'lead',
      primary_contact_name: clean(form.contact_name),
      primary_contact_role: clean(form.contact_role),
      primary_contact_email: clean(form.contact_email),
      primary_contact_phone: clean(form.contact_phone),
    })
    .select('id')
    .single();
  if (error) throw error;

  const value = form.deal_value.trim() === '' ? null : Number(form.deal_value);
  const { error: dealError } = await db()
    .from('deals')
    .insert({
      account_id: account.id,
      title: clean(form.deal_title) ?? `${form.name.trim()} — new opportunity`,
      pipeline_stage: 'new_lead',
      value: Number.isFinite(value as number) ? value : null,
      status: 'open',
    });
  if (dealError) throw dealError;

  await logSystemActivity(account.id, 'Lead created');
  return account.id;
}

/** Moves a deal through the pipeline, keeps the account in step, logs it. */
export async function moveDealStage(
  deal: Deal,
  stage: PipelineStage,
  lostReason?: string,
): Promise<void> {
  const status = stage === 'won' ? 'won' : stage === 'lost' ? 'lost' : 'open';
  const { error } = await db()
    .from('deals')
    .update({
      pipeline_stage: stage,
      status,
      lost_reason: stage === 'lost' ? (lostReason?.trim() || null) : null,
      stale_since: null,
    })
    .eq('id', deal.id);
  if (error) throw error;

  const accountPatch: Record<string, string> = { pipeline_stage: stage };
  if (stage === 'won') accountPatch.status = 'active';
  const { error: accountError } = await db()
    .from('accounts')
    .update(accountPatch)
    .eq('id', deal.account_id);
  if (accountError) throw accountError;

  const note =
    stage === 'lost'
      ? `Deal “${deal.title}” marked Lost${lostReason?.trim() ? ` — ${lostReason.trim()}` : ''}`
      : `Deal “${deal.title}” moved to ${STAGE_LABELS[stage]}`;
  await logSystemActivity(deal.account_id, note);
}

export async function logSystemActivity(accountId: string, body: string) {
  const { error } = await db()
    .from('activities')
    .insert({ account_id: accountId, type: 'system', body });
  if (error) throw error;
}

/**
 * Removes an account and everything under it. Contacts, deals, projects,
 * activities, quotes, invoices and retainers cascade in the database;
 * follow-up tasks reference by id without a foreign key, so they are
 * cleaned up explicitly first.
 */
export async function deleteAccount(accountId: string): Promise<void> {
  const [deals, projects] = await Promise.all([
    db().from('deals').select('id').eq('account_id', accountId),
    db().from('projects').select('id').eq('account_id', accountId),
  ]);
  if (deals.error) throw deals.error;
  if (projects.error) throw projects.error;

  const taskTargets: { type: string; ids: string[] }[] = [
    { type: 'account', ids: [accountId] },
    { type: 'deal', ids: (deals.data ?? []).map((d) => d.id) },
    { type: 'project', ids: (projects.data ?? []).map((p) => p.id) },
  ];
  for (const t of taskTargets) {
    if (t.ids.length === 0) continue;
    const { error } = await db()
      .from('tasks')
      .delete()
      .eq('related_type', t.type)
      .in('related_id', t.ids);
    if (error) throw error;
  }

  const { error } = await db().from('accounts').delete().eq('id', accountId);
  if (error) throw error;
}
