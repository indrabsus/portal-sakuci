-- ============================================================
-- Portal Sakuci - Konseling AI (siswa) + role baru "bk"
-- Jalankan di Supabase SQL Editor.
-- ============================================================

-- ---------- 0. Role baru: bk ----------
insert into public.roles (nama_role)
values ('bk')
on conflict (nama_role) do nothing;

-- ---------- 1. Tabel sesi konseling ----------
create table if not exists public.konseling_sesi (
  id_sesi uuid not null default gen_random_uuid(),
  id_siswa uuid not null references public.siswa(id_siswa),
  status text not null default 'aktif' check (status = any (array['aktif', 'selesai'])),
  ringkasan text,
  tingkat_risiko text check (tingkat_risiko = any (array['rendah', 'sedang', 'tinggi'])),
  indikasi text,
  started_at timestamp with time zone not null default now(),
  ended_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  constraint konseling_sesi_pkey primary key (id_sesi)
);

-- ---------- 2. Tabel pesan chat ----------
create table if not exists public.konseling_pesan (
  id_pesan uuid not null default gen_random_uuid(),
  id_sesi uuid not null references public.konseling_sesi(id_sesi) on delete cascade,
  pengirim text not null check (pengirim = any (array['siswa', 'ai'])),
  isi text not null,
  created_at timestamp with time zone not null default now(),
  constraint konseling_pesan_pkey primary key (id_pesan)
);

create index if not exists konseling_pesan_id_sesi_idx on public.konseling_pesan(id_sesi);
create index if not exists konseling_sesi_id_siswa_idx on public.konseling_sesi(id_siswa);

-- ---------- 3. RLS ----------
alter table public.konseling_sesi enable row level security;
alter table public.konseling_pesan enable row level security;

drop policy if exists konseling_sesi_select on public.konseling_sesi;
create policy konseling_sesi_select on public.konseling_sesi for select
  using (public.current_role() in ('admin', 'kajur', 'bk') or id_siswa = public.current_id_siswa());

drop policy if exists konseling_sesi_siswa_write on public.konseling_sesi;
create policy konseling_sesi_siswa_write on public.konseling_sesi for all
  using (id_siswa = public.current_id_siswa()) with check (id_siswa = public.current_id_siswa());

drop policy if exists konseling_sesi_staff_all on public.konseling_sesi;
create policy konseling_sesi_staff_all on public.konseling_sesi for all
  using (public.current_role() in ('admin', 'kajur', 'bk')) with check (public.current_role() in ('admin', 'kajur', 'bk'));

drop policy if exists konseling_pesan_select on public.konseling_pesan;
create policy konseling_pesan_select on public.konseling_pesan for select
  using (
    public.current_role() in ('admin', 'kajur', 'bk') or
    id_sesi in (select id_sesi from public.konseling_sesi where id_siswa = public.current_id_siswa())
  );

drop policy if exists konseling_pesan_siswa_insert on public.konseling_pesan;
create policy konseling_pesan_siswa_insert on public.konseling_pesan for insert
  with check (id_sesi in (select id_sesi from public.konseling_sesi where id_siswa = public.current_id_siswa()));

drop policy if exists konseling_pesan_staff_all on public.konseling_pesan;
create policy konseling_pesan_staff_all on public.konseling_pesan for all
  using (public.current_role() in ('admin', 'kajur', 'bk')) with check (public.current_role() in ('admin', 'kajur', 'bk'));
