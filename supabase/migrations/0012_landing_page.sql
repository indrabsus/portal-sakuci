-- ============================================================
-- Portal Sakuci - Approval inovasi siswa + data untuk landing page
-- Jalankan di Supabase SQL Editor.
-- ============================================================

-- Inovasi siswa perlu di-ACC kajur sebelum tampil di landing page publik
alter table public.project_siswa
  add column if not exists status text not null default 'pending' check (status = any (array['pending', 'approved', 'rejected'])),
  add column if not exists catatan_kajur text,
  add column if not exists direview_oleh uuid references public.profiles(id_profile),
  add column if not exists direview_at timestamp with time zone;

drop policy if exists project_siswa_kajur_review on public.project_siswa;
create policy project_siswa_kajur_review on public.project_siswa for update
  using (
    public.current_role() = 'kajur'
    and exists (
      select 1 from public.kelas k
      join public.profiles p on p.id_jurusan = k.id_jurusan
      where k.id_kelas = project_siswa.id_kelas and p.id_profile = auth.uid()
    )
  );

-- Jurusan butuh deskripsi untuk landing page
alter table public.jurusan
  add column if not exists deskripsi text;

-- Informasi sekolah butuh visi & misi untuk landing page
alter table public.informasi_sekolah
  add column if not exists visi text,
  add column if not exists misi text;
