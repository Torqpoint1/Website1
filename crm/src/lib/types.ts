export type PipelineStage = 'new_lead' | 'call' | 'quote_sent' | 'won' | 'lost';
export type AccountStatus = 'lead' | 'active' | 'paused' | 'one_off' | 'churned';
export type LeadSource = 'inbound' | 'outbound' | 'referral' | 'social';
export type DealStatus = 'open' | 'won' | 'lost';
export type PricingType = 'one_off' | 'retainer';
export type ActivityType = 'email' | 'call' | 'message' | 'note' | 'system';

export interface Account {
  id: string;
  name: string;
  niche: string | null;
  location: string | null;
  website: string | null;
  instagram: string | null;
  tiktok: string | null;
  other_socials: string | null;
  lead_source: LeadSource;
  pipeline_stage: PipelineStage;
  status: AccountStatus;
  primary_contact_name: string | null;
  primary_contact_role: string | null;
  primary_contact_email: string | null;
  primary_contact_phone: string | null;
  research_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  account_id: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  socials: string | null;
}

export interface Deal {
  id: string;
  account_id: string;
  title: string;
  pipeline_stage: PipelineStage;
  value: number | null;
  pricing_type: PricingType;
  monthly_amount: number | null;
  expected_close_date: string | null;
  status: DealStatus;
  lost_reason: string | null;
  stale_since: string | null;
  created_at: string;
  account?: { name: string } | null;
}

export interface Activity {
  id: string;
  account_id: string;
  type: ActivityType;
  body: string;
  occurred_at: string;
  account?: { name: string } | null;
}

export interface FollowUpTask {
  id: string;
  related_type: 'account' | 'deal' | 'project';
  related_id: string;
  title: string;
  due_date: string | null;
  done: boolean;
  auto_generated: boolean;
  created_at: string;
}

export const PIPELINE_STAGES: { key: PipelineStage; label: string }[] = [
  { key: 'new_lead', label: 'New lead' },
  { key: 'call', label: 'Call' },
  { key: 'quote_sent', label: 'Quote sent' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
];

export const STAGE_LABELS: Record<PipelineStage, string> = Object.fromEntries(
  PIPELINE_STAGES.map((s) => [s.key, s.label]),
) as Record<PipelineStage, string>;

export const ACCOUNT_STATUSES: { key: AccountStatus; label: string }[] = [
  { key: 'lead', label: 'Lead' },
  { key: 'active', label: 'Active' },
  { key: 'paused', label: 'Paused' },
  { key: 'one_off', label: 'One-off' },
  { key: 'churned', label: 'Churned' },
];

export const LEAD_SOURCES: { key: LeadSource; label: string }[] = [
  { key: 'inbound', label: 'Inbound' },
  { key: 'outbound', label: 'Outbound' },
  { key: 'referral', label: 'Referral' },
  { key: 'social', label: 'Social' },
];

export const ACTIVITY_TYPES: { key: ActivityType; label: string }[] = [
  { key: 'note', label: 'Note' },
  { key: 'call', label: 'Call' },
  { key: 'email', label: 'Email' },
  { key: 'message', label: 'Message' },
];
