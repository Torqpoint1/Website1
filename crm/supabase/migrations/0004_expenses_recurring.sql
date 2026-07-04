-- Recurring expenses: mark an expense as repeating monthly; logged copies
-- point back at the template so each month is only offered once.

alter table public.expenses
  add column if not exists recurring boolean not null default false;

alter table public.expenses
  add column if not exists recurring_source uuid references public.expenses (id) on delete set null;
