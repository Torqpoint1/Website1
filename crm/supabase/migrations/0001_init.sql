-- Torqpoint CRM — initial schema (full data model from torqpoint-crm-spec v2 §5)
-- Single operator today; every table carries owner_id so row-level security is
-- scoped to the owner from day one and a team can be added later without a rebuild.

-- ---------- profiles (users, linked to Supabase Auth) ----------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  role text default 'owner',
  avatar text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- accounts — the business (lead or client) ----------

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id),
  name text not null,
  niche text,
  location text,
  website text,
  instagram text,
  tiktok text,
  other_socials text,
  lead_source text not null default 'outbound'
    check (lead_source in ('inbound', 'outbound', 'referral', 'social')),
  pipeline_stage text not null default 'new_lead'
    check (pipeline_stage in ('new_lead', 'call', 'quote_sent', 'won', 'lost')),
  status text not null default 'lead'
    check (status in ('lead', 'active', 'paused', 'one_off', 'churned')),
  primary_contact_name text,
  primary_contact_role text,
  primary_contact_email text,
  primary_contact_phone text,
  research_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger accounts_touch_updated_at
  before update on public.accounts
  for each row execute function public.touch_updated_at();

-- ---------- contacts — extra people at an account ----------

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id),
  account_id uuid not null references public.accounts (id) on delete cascade,
  name text not null,
  role text,
  email text,
  phone text,
  socials text,
  created_at timestamptz not null default now()
);

-- ---------- deals — an opportunity / pitch ----------

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id),
  account_id uuid not null references public.accounts (id) on delete cascade,
  title text not null,
  pipeline_stage text not null default 'new_lead'
    check (pipeline_stage in ('new_lead', 'call', 'quote_sent', 'won', 'lost')),
  value numeric(10, 2),
  pricing_type text not null default 'one_off'
    check (pricing_type in ('one_off', 'retainer')),
  monthly_amount numeric(10, 2),
  expected_close_date date,
  status text not null default 'open'
    check (status in ('open', 'won', 'lost')),
  lost_reason text,
  stale_since timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- projects — delivery work ----------

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id),
  account_id uuid not null references public.accounts (id) on delete cascade,
  deal_id uuid references public.deals (id) on delete set null,
  name text not null,
  status text not null default 'active'
    check (status in ('active', 'paused', 'done')),
  start_date date,
  due_date date,
  ready_to_invoice boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- deliverables — items within a project ----------

create table public.deliverables (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id),
  project_id uuid not null references public.projects (id) on delete cascade,
  type text not null
    check (type in (
      'social_posts', 'case_study', 'email_newsletter', 'blog_article',
      'google_business_post', 'profiles_setup', 'website', 'other'
    )),
  title text not null,
  body text,
  due_date date,
  assignee_id uuid references auth.users (id),
  status text not null default 'to_do'
    check (status in ('to_do', 'in_progress', 'ready_for_review', 'approved', 'live')),
  created_at timestamptz not null default now()
);

-- ---------- tasks — follow-ups & to-dos ----------

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id),
  related_type text not null
    check (related_type in ('account', 'deal', 'project')),
  related_id uuid not null,
  title text not null,
  due_date date,
  done boolean not null default false,
  auto_generated boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- activities — comms + timeline log ("log everything") ----------

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id),
  account_id uuid not null references public.accounts (id) on delete cascade,
  type text not null default 'note'
    check (type in ('email', 'call', 'message', 'note', 'system')),
  body text not null,
  occurred_at timestamptz not null default now(),
  created_by uuid default auth.uid() references auth.users (id)
);

-- ---------- quotes ----------

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id),
  account_id uuid not null references public.accounts (id) on delete cascade,
  deal_id uuid references public.deals (id) on delete set null,
  number text not null,
  line_items jsonb not null default '[]',
  subtotal numeric(10, 2) not null default 0,
  vat_amount numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'accepted', 'declined')),
  sent_date date,
  created_at timestamptz not null default now()
);

-- ---------- invoices ----------

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id),
  account_id uuid not null references public.accounts (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  quote_id uuid references public.quotes (id) on delete set null,
  number text not null,
  line_items jsonb not null default '[]',
  subtotal numeric(10, 2) not null default 0,
  vat_amount numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'paid', 'overdue')),
  issue_date date,
  due_date date,
  paid_date date,
  pricing_type text not null default 'one_off'
    check (pricing_type in ('one_off', 'retainer')),
  created_at timestamptz not null default now()
);

-- ---------- retainers — recurring revenue engine ----------
-- MRR = sum of monthly_amount where status = 'active' — the north-star number.

create table public.retainers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id),
  account_id uuid not null references public.accounts (id) on delete cascade,
  monthly_amount numeric(10, 2) not null,
  start_date date not null default current_date,
  end_date date,
  status text not null default 'active'
    check (status in ('active', 'paused', 'cancelled')),
  deliverable_template jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- ---------- assets — files per client (Supabase Storage) ----------

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id),
  account_id uuid not null references public.accounts (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  name text not null,
  storage_path text not null,
  type text,
  uploaded_at timestamptz not null default now()
);

-- ---------- company_settings — Torqpoint's own details (drives the PDFs) ----------

create table public.company_settings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id),
  business_name text not null default 'Torqpoint',
  address text,
  logo text,
  vat_registered boolean not null default false,
  vat_number text,
  vat_rate numeric(5, 2) not null default 20,
  bank_details text,
  payment_link text,
  invoice_prefix text not null default 'TP-INV-',
  next_invoice_number integer not null default 1,
  quote_prefix text not null default 'TP-Q-',
  next_quote_number integer not null default 1,
  payment_terms text not null default 'Payment due within 14 days',
  created_at timestamptz not null default now()
);

-- ---------- indexes ----------

create index accounts_owner_idx on public.accounts (owner_id);
create index contacts_account_idx on public.contacts (account_id);
create index deals_account_idx on public.deals (account_id);
create index deals_stage_idx on public.deals (pipeline_stage) where status = 'open';
create index projects_account_idx on public.projects (account_id);
create index deliverables_project_idx on public.deliverables (project_id);
create index tasks_related_idx on public.tasks (related_type, related_id);
create index tasks_due_idx on public.tasks (due_date) where done = false;
create index activities_account_idx on public.activities (account_id, occurred_at desc);
create index quotes_account_idx on public.quotes (account_id);
create index invoices_account_idx on public.invoices (account_id);
create index invoices_status_idx on public.invoices (status);
create index retainers_status_idx on public.retainers (status);
create index assets_account_idx on public.assets (account_id);

-- ---------- row-level security: owner-scoped from day one ----------

do $$
declare
  t text;
begin
  foreach t in array array[
    'accounts', 'contacts', 'deals', 'projects', 'deliverables', 'tasks',
    'activities', 'quotes', 'invoices', 'retainers', 'assets', 'company_settings'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "%s_owner_all" on public.%I for all to authenticated
         using (owner_id = auth.uid()) with check (owner_id = auth.uid())',
      t, t
    );
  end loop;
end;
$$;

alter table public.profiles enable row level security;

create policy "profiles_own_read" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "profiles_own_update" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
