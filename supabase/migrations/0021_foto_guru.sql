-- ============================================================
-- Portal Sakuci - Foto profil guru
-- Jalankan di Supabase SQL Editor.
-- ============================================================

alter table public.guru
  add column if not exists foto_url text;

-- Guru boleh update baris dirinya sendiri (untuk foto profil)
drop policy if exists guru_self_update on public.guru;
create policy guru_self_update on public.guru for update
  using (id_guru = public.current_id_guru())
  with check (id_guru = public.current_id_guru());

insert into storage.buckets (id, name, public)
values ('guru-foto', 'guru-foto', true)
on conflict (id) do nothing;

drop policy if exists "guru_foto_read" on storage.objects;
create policy "guru_foto_read" on storage.objects for select
  using (bucket_id = 'guru-foto');

drop policy if exists "guru_foto_write" on storage.objects;
create policy "guru_foto_write" on storage.objects for insert
  with check (bucket_id = 'guru-foto' and public.current_role() in ('admin', 'guru'));

drop policy if exists "guru_foto_update" on storage.objects;
create policy "guru_foto_update" on storage.objects for update
  using (bucket_id = 'guru-foto' and public.current_role() in ('admin', 'guru'));

drop policy if exists "guru_foto_delete" on storage.objects;
create policy "guru_foto_delete" on storage.objects for delete
  using (bucket_id = 'guru-foto' and public.current_role() in ('admin', 'guru'));
