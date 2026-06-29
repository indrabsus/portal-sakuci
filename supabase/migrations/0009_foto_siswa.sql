-- ============================================================
-- Portal Sakuci - Foto profil siswa
-- Jalankan di Supabase SQL Editor.
-- ============================================================

alter table public.siswa
  add column if not exists foto_url text;

insert into storage.buckets (id, name, public)
values ('siswa-foto', 'siswa-foto', true)
on conflict (id) do nothing;

drop policy if exists "siswa_foto_read" on storage.objects;
create policy "siswa_foto_read" on storage.objects for select
  using (bucket_id = 'siswa-foto');

drop policy if exists "siswa_foto_write" on storage.objects;
create policy "siswa_foto_write" on storage.objects for insert
  with check (bucket_id = 'siswa-foto' and public.current_role() in ('admin', 'siswa'));

drop policy if exists "siswa_foto_update" on storage.objects;
create policy "siswa_foto_update" on storage.objects for update
  using (bucket_id = 'siswa-foto' and public.current_role() in ('admin', 'siswa'));

drop policy if exists "siswa_foto_delete" on storage.objects;
create policy "siswa_foto_delete" on storage.objects for delete
  using (bucket_id = 'siswa-foto' and public.current_role() in ('admin', 'siswa'));
