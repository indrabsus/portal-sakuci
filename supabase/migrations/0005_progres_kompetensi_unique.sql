-- ============================================================
-- Portal Sakuci - Unique constraint untuk progres_kompetensi
-- (dibutuhkan untuk upsert satu baris progres per siswa per kompetensi)
-- Jalankan di Supabase SQL Editor.
-- ============================================================

-- Bersihkan duplikat (kalau ada) sebelum menambahkan unique constraint,
-- simpan baris yang paling baru dibuat untuk tiap pasangan siswa+kompetensi.
delete from public.progres_kompetensi a
using public.progres_kompetensi b
where a.id_siswa = b.id_siswa
  and a.id_kompetensi = b.id_kompetensi
  and a.created_at < b.created_at;

alter table public.progres_kompetensi
  drop constraint if exists progres_kompetensi_siswa_kompetensi_unique;
alter table public.progres_kompetensi
  add constraint progres_kompetensi_siswa_kompetensi_unique unique (id_siswa, id_kompetensi);
