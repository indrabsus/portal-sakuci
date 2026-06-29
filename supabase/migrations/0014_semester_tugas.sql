-- ============================================================
-- Portal Sakuci - Semester dipakai khusus untuk Tugas (laporan nilai),
-- bukan untuk kelas/mengajar/kompetensi (tetap berlaku 1 tahun ajaran penuh).
--
-- Migration ini juga memastikan kolom tahun_ajaran.semester tetap ada
-- (jaga-jaga kalau migration 0013 yang lama sempat dijalankan).
-- Jalankan di Supabase SQL Editor.
-- ============================================================

alter table public.tahun_ajaran
  add column if not exists semester text check (semester = any (array['ganjil', 'genap']));

alter table public.tugas
  add column if not exists semester text not null default 'ganjil' check (semester = any (array['ganjil', 'genap']));
