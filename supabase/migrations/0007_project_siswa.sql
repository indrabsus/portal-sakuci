-- ============================================================
-- Portal Sakuci - Project / Inovasi Siswa
-- Jalankan di Supabase SQL Editor.
-- ============================================================

create table if not exists public.project_siswa (
  id_project uuid not null default gen_random_uuid(),
  id_siswa uuid not null references public.siswa(id_siswa),
  nama_project text not null,
  deskripsi text,
  link_youtube text,
  created_at timestamp with time zone not null default now(),
  constraint project_siswa_pkey primary key (id_project)
);

alter table public.project_siswa enable row level security;

drop policy if exists project_siswa_select on public.project_siswa;
create policy project_siswa_select on public.project_siswa for select
  using (
    public.current_role() in ('admin', 'kajur', 'guru', 'bkk')
    or id_siswa = public.current_id_siswa()
  );

drop policy if exists project_siswa_siswa_write on public.project_siswa;
create policy project_siswa_siswa_write on public.project_siswa for all
  using (id_siswa = public.current_id_siswa())
  with check (id_siswa = public.current_id_siswa());

drop policy if exists project_siswa_admin_write on public.project_siswa;
create policy project_siswa_admin_write on public.project_siswa for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');
