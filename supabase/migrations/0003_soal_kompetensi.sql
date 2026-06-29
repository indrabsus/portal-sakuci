-- ============================================================
-- Portal Sakuci - Tabel soal terpisah untuk Roadmap Kompetensi
-- (sebelumnya kompetensi_tugas_soal menumpang ke bank_soal milik guru,
-- sekarang dipisah ke tabel sendiri: soal_kompetensi + opsi_jawaban_kompetensi)
-- Jalankan di Supabase SQL Editor.
-- ============================================================

create table if not exists public.soal_kompetensi (
  id_soal_kompetensi uuid not null default gen_random_uuid(),
  id_jurusan uuid references public.jurusan(id_jurusan),
  dibuat_oleh uuid references public.profiles(id_profile),
  pertanyaan text not null,
  tipe_soal text not null default 'pg' check (tipe_soal = any (array['pg', 'essay'])),
  tingkat_kesulitan text check (tingkat_kesulitan = any (array['mudah', 'sedang', 'sulit'])),
  pembahasan text,
  gambar_url text,
  file_url text,
  created_at timestamp with time zone not null default now(),
  constraint soal_kompetensi_pkey primary key (id_soal_kompetensi)
);

create table if not exists public.opsi_jawaban_kompetensi (
  id_opsi_kompetensi uuid not null default gen_random_uuid(),
  id_soal_kompetensi uuid not null references public.soal_kompetensi(id_soal_kompetensi),
  label text not null check (label = any (array['A', 'B', 'C', 'D', 'E'])),
  isi_opsi text not null,
  is_benar boolean default false,
  gambar_url text,
  created_at timestamp with time zone not null default now(),
  constraint opsi_jawaban_kompetensi_pkey primary key (id_opsi_kompetensi)
);

-- Lepas FK lama yang menumpang ke bank_soal/opsi_jawaban, lalu arahkan ke tabel baru.
-- Data lama dikosongkan karena fitur ini baru dibuat (belum ada data produksi nyata).
truncate table public.jawaban_kompetensi_siswa, public.kompetensi_tugas_soal;

alter table public.kompetensi_tugas_soal drop constraint if exists kompetensi_tugas_soal_id_soal_fkey;
alter table public.kompetensi_tugas_soal
  add constraint kompetensi_tugas_soal_id_soal_fkey
  foreign key (id_soal) references public.soal_kompetensi(id_soal_kompetensi);

alter table public.jawaban_kompetensi_siswa drop constraint if exists jawaban_kompetensi_id_soal_fkey;
alter table public.jawaban_kompetensi_siswa drop constraint if exists jawaban_kompetensi_id_opsi_fkey;
alter table public.jawaban_kompetensi_siswa
  add constraint jawaban_kompetensi_id_soal_fkey
  foreign key (id_soal) references public.soal_kompetensi(id_soal_kompetensi),
  add constraint jawaban_kompetensi_id_opsi_fkey
  foreign key (id_opsi) references public.opsi_jawaban_kompetensi(id_opsi_kompetensi);

alter table public.soal_kompetensi enable row level security;
alter table public.opsi_jawaban_kompetensi enable row level security;

drop policy if exists soal_kompetensi_read on public.soal_kompetensi;
create policy soal_kompetensi_read on public.soal_kompetensi for select using (auth.uid() is not null);
drop policy if exists soal_kompetensi_write on public.soal_kompetensi;
create policy soal_kompetensi_write on public.soal_kompetensi for all
  using (public.current_role() in ('admin', 'kajur')) with check (public.current_role() in ('admin', 'kajur'));

drop policy if exists opsi_jawaban_kompetensi_read on public.opsi_jawaban_kompetensi;
create policy opsi_jawaban_kompetensi_read on public.opsi_jawaban_kompetensi for select using (auth.uid() is not null);
drop policy if exists opsi_jawaban_kompetensi_write on public.opsi_jawaban_kompetensi;
create policy opsi_jawaban_kompetensi_write on public.opsi_jawaban_kompetensi for all
  using (public.current_role() in ('admin', 'kajur')) with check (public.current_role() in ('admin', 'kajur'));
