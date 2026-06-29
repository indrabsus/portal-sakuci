-- ============================================================
-- Portal Sakuci - BKK perlu baca status aktivasi akun siswa
-- untuk menampilkan Data Siswa (hanya yang sudah aktivasi).
-- Jalankan di Supabase SQL Editor.
-- ============================================================

drop policy if exists akun_siswa_select on public.akun_siswa;
create policy akun_siswa_select on public.akun_siswa for select
  using (id_profile = auth.uid() or public.current_role() in ('admin', 'bkk', 'kajur'));
