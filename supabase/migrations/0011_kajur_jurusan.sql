-- ============================================================
-- Portal Sakuci - Kajur dibatasi ke satu jurusan
-- Jalankan di Supabase SQL Editor.
-- ============================================================

alter table public.profiles
  add column if not exists id_jurusan uuid references public.jurusan(id_jurusan);
