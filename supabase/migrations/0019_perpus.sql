-- ============================================================
-- Portal Sakuci - Role Perpustakaan + Daftar Buku + Peminjaman
-- Jalankan di Supabase SQL Editor.
-- ============================================================

-- ---------- 0. Role baru: perpus ----------
insert into public.roles (nama_role)
values ('perpus')
on conflict (nama_role) do nothing;

-- ---------- 1. Tabel buku ----------
create table if not exists public.buku (
  id_buku           uuid not null default gen_random_uuid(),
  judul             text not null,
  pengarang         text,
  penerbit          text,
  tahun_terbit      int,
  isbn              text,
  kategori          text,
  lokasi_lemari     text,
  stok              int not null default 1 check (stok >= 0),
  created_at        timestamp with time zone not null default now(),
  updated_at        timestamp with time zone not null default now(),
  constraint buku_pkey primary key (id_buku)
);

create index if not exists buku_judul_idx on public.buku using gin(to_tsvector('indonesian', judul));

-- ---------- 2. Tabel peminjaman ----------
create table if not exists public.peminjaman_buku (
  id_peminjaman           uuid not null default gen_random_uuid(),
  id_buku                 uuid not null references public.buku(id_buku) on delete restrict,
  id_siswa                uuid not null references public.siswa(id_siswa) on delete restrict,
  tanggal_pinjam          date not null default current_date,
  tanggal_kembali_rencana date not null,
  tanggal_kembali_aktual  date,
  status                  text not null default 'dipinjam'
                            check (status in ('dipinjam', 'dikembalikan', 'terlambat')),
  catatan                 text,
  created_at              timestamp with time zone not null default now(),
  constraint peminjaman_buku_pkey primary key (id_peminjaman)
);

create index if not exists peminjaman_buku_id_siswa_idx on public.peminjaman_buku(id_siswa);
create index if not exists peminjaman_buku_id_buku_idx  on public.peminjaman_buku(id_buku);

-- ---------- 3. RLS ----------
alter table public.buku          enable row level security;
alter table public.peminjaman_buku enable row level security;

-- Buku: admin & perpus kelola, semua role lain bisa lihat
create policy buku_staff_all on public.buku for all
  using  (public.current_role() in ('admin', 'perpus'))
  with check (public.current_role() in ('admin', 'perpus'));

create policy buku_public_select on public.buku for select
  using (true);

-- Peminjaman: admin & perpus kelola, siswa hanya lihat miliknya
create policy peminjaman_staff_all on public.peminjaman_buku for all
  using  (public.current_role() in ('admin', 'perpus'))
  with check (public.current_role() in ('admin', 'perpus'));

create policy peminjaman_siswa_select on public.peminjaman_buku for select
  using (id_siswa = public.current_id_siswa());
