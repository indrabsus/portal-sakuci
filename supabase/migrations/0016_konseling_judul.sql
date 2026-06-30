-- ============================================================
-- Portal Sakuci - Tambah kolom judul sesi konseling (dibuat otomatis oleh AI saat sesi diakhiri)
-- Jalankan di Supabase SQL Editor.
-- ============================================================

alter table public.konseling_sesi add column if not exists judul text;
