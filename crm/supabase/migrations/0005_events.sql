-- Work events on the calendar: calls, shoots, meetings — anything with a date
-- that isn't a deliverable or follow-up.

create table public.events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id),
  title text not null,
  event_date date not null,
  start_time time,
  notes text,
  created_at timestamptz not null default now()
);

create index events_date_idx on public.events (event_date);

alter table public.events enable row level security;

create policy "events_owner_all" on public.events
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
