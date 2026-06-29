-- ============================================================
-- Portal Sakuci - Storage bucket untuk gambar bank soal
-- Jalankan di Supabase SQL Editor.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('bank-soal', 'bank-soal', true)
on conflict (id) do nothing;

drop policy if exists "bank_soal_images_read" on storage.objects;
create policy "bank_soal_images_read" on storage.objects for select
  using (bucket_id = 'bank-soal');

drop policy if exists "bank_soal_images_write" on storage.objects;
create policy "bank_soal_images_write" on storage.objects for insert
  with check (bucket_id = 'bank-soal' and public.current_role() in ('admin', 'kajur', 'guru'));

drop policy if exists "bank_soal_images_delete" on storage.objects;
create policy "bank_soal_images_delete" on storage.objects for delete
  using (bucket_id = 'bank-soal' and public.current_role() in ('admin', 'kajur', 'guru'));
