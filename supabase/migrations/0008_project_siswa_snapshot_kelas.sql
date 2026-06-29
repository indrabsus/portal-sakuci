-- ============================================================
-- Portal Sakuci - Snapshot kelas & tahun ajaran di project_siswa
-- Supaya project lama tetap menampilkan kelas/tahun ajaran saat
-- project itu dibuat, walau siswa sudah naik kelas/tahun ajaran baru.
-- Jalankan di Supabase SQL Editor.
-- ============================================================

alter table public.project_siswa
  add column if not exists id_kelas uuid references public.kelas(id_kelas),
  add column if not exists id_tahun_ajaran uuid references public.tahun_ajaran(id_tahun_ajaran);
