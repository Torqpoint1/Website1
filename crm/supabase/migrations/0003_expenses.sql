-- Business expenses — for running costs and the tax return.

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id),
  expense_date date not null default current_date,
  supplier text not null,
  description text,
  category text not null default 'other'
    check (category in (
      'software', 'equipment', 'travel', 'marketing', 'subcontractors',
      'office', 'phone_internet', 'insurance', 'training', 'other'
    )),
  amount numeric(10, 2) not null,
  receipt_path text,
  created_at timestamptz not null default now()
);

create index expenses_date_idx on public.expenses (expense_date desc);

alter table public.expenses enable row level security;

create policy "expenses_owner_all" on public.expenses
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
