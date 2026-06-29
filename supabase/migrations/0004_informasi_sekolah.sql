-- ============================================================
-- Portal Sakuci - Informasi sekolah (untuk kop sertifikat, dsb.)
-- Jalankan di Supabase SQL Editor.
-- ============================================================

create table if not exists public.informasi_sekolah (
  id_sekolah uuid not null default gen_random_uuid(),
  nama_sekolah text not null,
  alamat text,
  email text,
  instagram text,
  no_telepon text,
  nama_kepala_sekolah text,
  created_at timestamp with time zone not null default now(),
  constraint informasi_sekolah_pkey primary key (id_sekolah)
);

alter table public.informasi_sekolah enable row level security;

drop policy if exists informasi_sekolah_read on public.informasi_sekolah;
create policy informasi_sekolah_read on public.informasi_sekolah for select using (auth.uid() is not null);
drop policy if exists informasi_sekolah_admin_write on public.informasi_sekolah;
create policy informasi_sekolah_admin_write on public.informasi_sekolah for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

insert into public.informasi_sekolah (nama_sekolah, alamat, email, instagram, no_telepon, nama_kepala_sekolah)
select 'SMK Sangkuriang 1 Cimahi', '', '', '', '', ''
where not exists (select 1 from public.informasi_sekolah);
