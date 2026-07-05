-- Standard price list: reusable line items for building quotes/invoices fast.

alter table public.company_settings
  add column if not exists price_list jsonb not null default '[]';
