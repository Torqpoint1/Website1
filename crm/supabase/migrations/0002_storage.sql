-- Files per client: private storage bucket for uploaded assets.
-- (Links and location notes need no storage — this is only for real uploads.)

insert into storage.buckets (id, name, public)
values ('assets', 'assets', false)
on conflict (id) do nothing;

create policy "assets_bucket_all"
  on storage.objects for all to authenticated
  using (bucket_id = 'assets')
  with check (bucket_id = 'assets');
