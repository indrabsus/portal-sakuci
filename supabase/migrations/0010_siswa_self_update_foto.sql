-- ============================================================
-- Portal Sakuci - Siswa boleh update baris sendiri (untuk foto profil)
-- Jalankan di Supabase SQL Editor.
-- ============================================================

drop policy if exists siswa_self_update on public.siswa;
create policy siswa_self_update on public.siswa for update
  using (id_siswa = public.current_id_siswa())
  with check (id_siswa = public.current_id_siswa());
