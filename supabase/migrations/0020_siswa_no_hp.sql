-- ============================================================
-- Portal Sakuci - Nomor HP siswa (diisi siswa sendiri di halaman profil)
-- Jalankan di Supabase SQL Editor.
-- ============================================================

alter table public.siswa
  add column if not exists no_hp text;
