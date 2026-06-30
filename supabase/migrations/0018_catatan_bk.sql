-- ============================================================
-- Portal Sakuci - Catatan BK & Surat Perjanjian
-- Jalankan di Supabase SQL Editor.
-- ============================================================

create table if not exists public.catatan_bk (
  id_catatan      uuid not null default gen_random_uuid(),
  id_siswa        uuid not null references public.siswa(id_siswa) on delete cascade,
  tanggal         date not null default current_date,
  permasalahan    text not null,
  tindakan        text not null,
  kesepakatan     text,
  catatan_tambahan text,
  nama_koordinator_bk  text,
  nip_koordinator_bk   text,
  created_by      uuid references auth.users(id),
  created_at      timestamp with time zone not null default now(),
  updated_at      timestamp with time zone not null default now(),
  constraint catatan_bk_pkey primary key (id_catatan)
);

create index if not exists catatan_bk_id_siswa_idx on public.catatan_bk(id_siswa);

alter table public.catatan_bk enable row level security;

-- BK & admin bisa semua operasi
create policy catatan_bk_staff_all on public.catatan_bk for all
  using (public.current_role() in ('admin', 'bk'))
  with check (public.current_role() in ('admin', 'bk'));

-- Siswa hanya bisa lihat catatan miliknya sendiri
create policy catatan_bk_siswa_select on public.catatan_bk for select
  using (id_siswa = public.current_id_siswa());
