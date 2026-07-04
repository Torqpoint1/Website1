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

export type ProjectStatus = 'active' | 'paused' | 'done';
export type DeliverableStatus =
  | 'to_do'
  | 'in_progress'
  | 'ready_for_review'
  | 'approved'
  | 'live';
export type DeliverableType =
  | 'social_posts'
  | 'case_study'
  | 'email_newsletter'
  | 'blog_article'
  | 'google_business_post'
  | 'profiles_setup'
  | 'website'
  | 'other';

export interface Project {
  id: string;
  account_id: string;
  deal_id: string | null;
  name: string;
  status: ProjectStatus;
  start_date: string | null;
  due_date: string | null;
  ready_to_invoice: boolean;
  created_at: string;
  account?: { name: string } | null;
}

export interface Deliverable {
  id: string;
  project_id: string;
  type: DeliverableType;
  title: string;
  body: string | null;
  due_date: string | null;
  assignee_id: string | null;
  status: DeliverableStatus;
  created_at: string;
  project?: { name: string; account_id: string } | null;
}

export interface LineItem {
  description: string;
  qty: number;
  unit_price: number;
  line_total: number;
}

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Quote {
  id: string;
  account_id: string;
  deal_id: string | null;
  number: string;
  line_items: LineItem[];
  subtotal: number;
  vat_amount: number;
  total: number;
  status: QuoteStatus;
  sent_date: string | null;
  created_at: string;
  account?: { name: string } | null;
}

export interface Invoice {
  id: string;
  account_id: string;
  project_id: string | null;
  quote_id: string | null;
  number: string;
  line_items: LineItem[];
  subtotal: number;
  vat_amount: number;
  total: number;
  status: InvoiceStatus;
  issue_date: string | null;
  due_date: string | null;
  paid_date: string | null;
  pricing_type: PricingType;
  created_at: string;
  account?: { name: string } | null;
}

export interface RetainerTemplateItem {
  type: DeliverableType;
  title: string;
}

export interface Retainer {
  id: string;
  account_id: string;
  monthly_amount: number;
  start_date: string;
  end_date: string | null;
  status: 'active' | 'paused' | 'cancelled';
  deliverable_template: RetainerTemplateItem[];
  created_at: string;
  account?: { name: string } | null;
}

export type ExpenseCategory =
  | 'software'
  | 'equipment'
  | 'travel'
  | 'marketing'
  | 'subcontractors'
  | 'office'
  | 'phone_internet'
  | 'insurance'
  | 'training'
  | 'other';

export interface Expense {
  id: string;
  expense_date: string;
  supplier: string;
  description: string | null;
  category: ExpenseCategory;
  amount: number;
  receipt_path: string | null;
  created_at: string;
}

export const EXPENSE_CATEGORIES: { key: ExpenseCategory; label: string }[] = [
  { key: 'software', label: 'Software & subscriptions' },
  { key: 'equipment', label: 'Equipment' },
  { key: 'travel', label: 'Travel & mileage' },
  { key: 'marketing', label: 'Marketing & ads' },
  { key: 'subcontractors', label: 'Subcontractors' },
  { key: 'office', label: 'Office & supplies' },
  { key: 'phone_internet', label: 'Phone & internet' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'training', label: 'Training' },
  { key: 'other', label: 'Other' },
];

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> =
  Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c.key, c.label])) as Record<
    ExpenseCategory,
    string
  >;

export type AssetKind = 'file' | 'link' | 'location';

export interface Asset {
  id: string;
  account_id: string;
  project_id: string | null;
  name: string;
  storage_path: string;
  type: string | null; // 'link' · 'location' · a mime type for uploads
  uploaded_at: string;
}

export interface CompanySettings {
  id: string;
  business_name: string;
  address: string | null;
  logo: string | null;
  vat_registered: boolean;
  vat_number: string | null;
  vat_rate: number;
  bank_details: string | null;
  payment_link: string | null;
  invoice_prefix: string;
  next_invoice_number: number;
  quote_prefix: string;
  next_quote_number: number;
  payment_terms: string;
}

export const DELIVERABLE_TYPES: { key: DeliverableType; label: string }[] = [
  { key: 'social_posts', label: 'Social posts' },
  { key: 'case_study', label: 'Case study' },
  { key: 'email_newsletter', label: 'Email & newsletter' },
  { key: 'blog_article', label: 'Blog article' },
  { key: 'google_business_post', label: 'Google Business post' },
  { key: 'profiles_setup', label: 'Profiles & setup' },
  { key: 'website', label: 'Website design & build' },
  { key: 'other', label: 'Anything else' },
];

export const DELIVERABLE_TYPE_LABELS: Record<DeliverableType, string> =
  Object.fromEntries(DELIVERABLE_TYPES.map((t) => [t.key, t.label])) as Record<
    DeliverableType,
    string
  >;

export const DELIVERABLE_STATUSES: { key: DeliverableStatus; label: string }[] = [
  { key: 'to_do', label: 'To do' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'ready_for_review', label: 'Ready for review' },
  { key: 'approved', label: 'Approved' },
  { key: 'live', label: 'Live' },
];

export const DELIVERABLE_STATUS_LABELS: Record<DeliverableStatus, string> =
  Object.fromEntries(DELIVERABLE_STATUSES.map((s) => [s.key, s.label])) as Record<
    DeliverableStatus,
    string
  >;

export const PROJECT_STATUSES: { key: ProjectStatus; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'paused', label: 'Paused' },
  { key: 'done', label: 'Done' },
];

export const ACTIVITY_TYPES: { key: ActivityType; label: string }[] = [
  { key: 'note', label: 'Note' },
  { key: 'call', label: 'Call' },
  { key: 'email', label: 'Email' },
  { key: 'message', label: 'Message' },
];
