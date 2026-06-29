-- ============================================================
-- Portal Sakuci - RLS Policies untuk schema yang sudah berjalan
-- Jalankan di Supabase SQL Editor.
-- ============================================================

-- ---------- 0. Seed roles ----------
insert into public.roles (nama_role)
values ('admin'), ('kajur'), ('guru'), ('siswa'), ('bkk')
on conflict (nama_role) do nothing;

-- ---------- 1. Helper functions ----------

create or replace function public.current_role()
returns text
language sql
security definer
stable
as $$
  select r.nama_role
  from public.profiles p
  join public.roles r on r.id_role = p.id_role
  where p.id_profile = auth.uid()
  limit 1;
$$;

create or replace function public.current_id_guru()
returns uuid
language sql
security definer
stable
as $$
  select id_guru from public.akun_guru where id_profile = auth.uid() limit 1;
$$;

create or replace function public.current_id_siswa()
returns uuid
language sql
security definer
stable
as $$
  select id_siswa from public.akun_siswa where id_profile = auth.uid() limit 1;
$$;

-- ---------- 2. Enable RLS ----------

alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.jurusan enable row level security;
alter table public.tahun_ajaran enable row level security;
alter table public.kelas enable row level security;
alter table public.guru enable row level security;
alter table public.siswa enable row level security;
alter table public.akun_guru enable row level security;
alter table public.akun_siswa enable row level security;
alter table public.mapel enable row level security;
alter table public.mengajar enable row level security;
alter table public.kompetensi enable row level security;
alter table public.progres_kompetensi enable row level security;
alter table public.sertifikat enable row level security;
alter table public.materi enable row level security;
alter table public.tugas enable row level security;
alter table public.pengumpulan_tugas enable row level security;
alter table public.bank_soal enable row level security;
alter table public.pengumuman enable row level security;
alter table public.log_aktivitas enable row level security;
alter table public.siswa_kelas enable row level security;
alter table public.opsi_jawaban enable row level security;
alter table public.tugas_soal enable row level security;
alter table public.jawaban_tugas_siswa enable row level security;
alter table public.nilai_komponen enable row level security;
alter table public.nilai_siswa enable row level security;
alter table public.kompetensi_tugas enable row level security;
alter table public.kompetensi_tugas_soal enable row level security;
alter table public.pengumpulan_kompetensi enable row level security;
alter table public.jawaban_kompetensi_siswa enable row level security;

-- ---------- 3. Master data: baca semua yang login, tulis admin ----------

do $$
declare t text;
begin
  foreach t in array array['roles','jurusan','tahun_ajaran','kelas','mapel','siswa_kelas','pengumuman']
  loop
    execute format('drop policy if exists %I_read_all on public.%I;', t, t);
    execute format('create policy %I_read_all on public.%I for select using (auth.uid() is not null);', t, t);
    execute format('drop policy if exists %I_admin_write on public.%I;', t, t);
    execute format('create policy %I_admin_write on public.%I for all using (public.current_role() = ''admin'') with check (public.current_role() = ''admin'');', t, t);
  end loop;
end $$;

-- pengumuman: kajur juga boleh tulis
drop policy if exists pengumuman_kajur_write on public.pengumuman;
create policy pengumuman_kajur_write on public.pengumuman for all
  using (public.current_role() in ('admin','kajur')) with check (public.current_role() in ('admin','kajur'));

-- ---------- 4. profiles ----------
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (id_profile = auth.uid() or public.current_role() = 'admin');
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles for update
  using (id_profile = auth.uid()) with check (id_profile = auth.uid());
drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

-- ---------- 5. guru & siswa (data master, bisa dilihat staff, milik sendiri bisa dilihat ybs) ----------
drop policy if exists guru_read on public.guru;
create policy guru_read on public.guru for select
  using (public.current_role() in ('admin','kajur','guru','bkk') or id_guru = public.current_id_guru());
drop policy if exists guru_admin_write on public.guru;
create policy guru_admin_write on public.guru for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

drop policy if exists siswa_read on public.siswa;
create policy siswa_read on public.siswa for select
  using (public.current_role() in ('admin','kajur','guru','bkk') or id_siswa = public.current_id_siswa());
drop policy if exists siswa_admin_write on public.siswa;
create policy siswa_admin_write on public.siswa for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

-- ---------- 6. akun_guru / akun_siswa (link aktivasi) ----------
drop policy if exists akun_guru_select on public.akun_guru;
create policy akun_guru_select on public.akun_guru for select
  using (id_profile = auth.uid() or public.current_role() = 'admin');
drop policy if exists akun_guru_admin_write on public.akun_guru;
create policy akun_guru_admin_write on public.akun_guru for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

drop policy if exists akun_siswa_select on public.akun_siswa;
create policy akun_siswa_select on public.akun_siswa for select
  using (id_profile = auth.uid() or public.current_role() = 'admin');
drop policy if exists akun_siswa_admin_write on public.akun_siswa;
create policy akun_siswa_admin_write on public.akun_siswa for all
  using (public.current_role() = 'admin') with check (public.current_role() = 'admin');
-- Catatan: proses aktivasi (insert akun_guru/akun_siswa baru) dilakukan lewat
-- server route memakai service role key, jadi tidak butuh policy insert untuk anon/user biasa.

-- ---------- 7. mengajar (pembagian mengajar) ----------
drop policy if exists mengajar_read on public.mengajar;
create policy mengajar_read on public.mengajar for select using (auth.uid() is not null);
drop policy if exists mengajar_guru_manage on public.mengajar;
create policy mengajar_guru_manage on public.mengajar for all
  using (public.current_role() in ('admin','kajur') or id_guru = public.current_id_guru())
  with check (public.current_role() in ('admin','kajur') or id_guru = public.current_id_guru());

-- ---------- 8. kompetensi & roadmap-related ----------
drop policy if exists kompetensi_read on public.kompetensi;
create policy kompetensi_read on public.kompetensi for select using (auth.uid() is not null);
drop policy if exists kompetensi_write on public.kompetensi;
create policy kompetensi_write on public.kompetensi for all
  using (public.current_role() in ('admin','kajur')) with check (public.current_role() in ('admin','kajur'));

drop policy if exists progres_kompetensi_select on public.progres_kompetensi;
create policy progres_kompetensi_select on public.progres_kompetensi for select
  using (public.current_role() in ('admin','kajur','guru','bkk') or id_siswa = public.current_id_siswa());
drop policy if exists progres_kompetensi_write on public.progres_kompetensi;
create policy progres_kompetensi_write on public.progres_kompetensi for all
  using (public.current_role() in ('admin','kajur')) with check (public.current_role() in ('admin','kajur'));

drop policy if exists sertifikat_select on public.sertifikat;
create policy sertifikat_select on public.sertifikat for select
  using (public.current_role() in ('admin','kajur','guru','bkk') or id_siswa = public.current_id_siswa());
drop policy if exists sertifikat_write on public.sertifikat;
create policy sertifikat_write on public.sertifikat for all
  using (public.current_role() in ('admin','kajur')) with check (public.current_role() in ('admin','kajur'));

drop policy if exists kompetensi_tugas_read on public.kompetensi_tugas;
create policy kompetensi_tugas_read on public.kompetensi_tugas for select using (auth.uid() is not null);
drop policy if exists kompetensi_tugas_write on public.kompetensi_tugas;
create policy kompetensi_tugas_write on public.kompetensi_tugas for all
  using (public.current_role() in ('admin','kajur')) with check (public.current_role() in ('admin','kajur'));

drop policy if exists kompetensi_tugas_soal_rw on public.kompetensi_tugas_soal;
create policy kompetensi_tugas_soal_rw on public.kompetensi_tugas_soal for all
  using (public.current_role() in ('admin','kajur')) with check (public.current_role() in ('admin','kajur'));

drop policy if exists pengumpulan_kompetensi_select on public.pengumpulan_kompetensi;
create policy pengumpulan_kompetensi_select on public.pengumpulan_kompetensi for select
  using (public.current_role() in ('admin','kajur','guru','bkk') or id_siswa = public.current_id_siswa());
drop policy if exists pengumpulan_kompetensi_siswa_update on public.pengumpulan_kompetensi;
create policy pengumpulan_kompetensi_siswa_update on public.pengumpulan_kompetensi for update
  using (id_siswa = public.current_id_siswa()) with check (id_siswa = public.current_id_siswa());
drop policy if exists pengumpulan_kompetensi_kajur_write on public.pengumpulan_kompetensi;
create policy pengumpulan_kompetensi_kajur_write on public.pengumpulan_kompetensi for all
  using (public.current_role() in ('admin','kajur')) with check (public.current_role() in ('admin','kajur'));

drop policy if exists jawaban_kompetensi_siswa_select on public.jawaban_kompetensi_siswa;
create policy jawaban_kompetensi_siswa_select on public.jawaban_kompetensi_siswa for select
  using (public.current_role() in ('admin','kajur') or
         id_pengumpulan_kompetensi in (select id_pengumpulan_kompetensi from public.pengumpulan_kompetensi where id_siswa = public.current_id_siswa()));
drop policy if exists jawaban_kompetensi_siswa_insert on public.jawaban_kompetensi_siswa;
create policy jawaban_kompetensi_siswa_insert on public.jawaban_kompetensi_siswa for insert
  with check (public.current_role() in ('admin','kajur') or
         id_pengumpulan_kompetensi in (select id_pengumpulan_kompetensi from public.pengumpulan_kompetensi where id_siswa = public.current_id_siswa()));
drop policy if exists jawaban_kompetensi_siswa_kajur_update on public.jawaban_kompetensi_siswa;
create policy jawaban_kompetensi_siswa_kajur_update on public.jawaban_kompetensi_siswa for update
  using (public.current_role() in ('admin','kajur')) with check (public.current_role() in ('admin','kajur'));

-- ---------- 9. materi & tugas (pembelajaran harian) ----------
drop policy if exists materi_read on public.materi;
create policy materi_read on public.materi for select using (auth.uid() is not null);
drop policy if exists materi_write on public.materi;
create policy materi_write on public.materi for all
  using (public.current_role() in ('admin','kajur') or
         id_mengajar in (select id_mengajar from public.mengajar where id_guru = public.current_id_guru()))
  with check (public.current_role() in ('admin','kajur') or
         id_mengajar in (select id_mengajar from public.mengajar where id_guru = public.current_id_guru()));

drop policy if exists tugas_read on public.tugas;
create policy tugas_read on public.tugas for select using (auth.uid() is not null);
drop policy if exists tugas_write on public.tugas;
create policy tugas_write on public.tugas for all
  using (public.current_role() in ('admin','kajur') or
         id_mengajar in (select id_mengajar from public.mengajar where id_guru = public.current_id_guru()))
  with check (public.current_role() in ('admin','kajur') or
         id_mengajar in (select id_mengajar from public.mengajar where id_guru = public.current_id_guru()));

-- ---------- 10. bank_soal, opsi_jawaban, tugas_soal: hanya staff (guru/kajur/admin) ----------
drop policy if exists bank_soal_rw on public.bank_soal;
create policy bank_soal_rw on public.bank_soal for all
  using (public.current_role() in ('admin','kajur','guru')) with check (public.current_role() in ('admin','kajur','guru'));
drop policy if exists opsi_jawaban_rw on public.opsi_jawaban;
create policy opsi_jawaban_rw on public.opsi_jawaban for all
  using (public.current_role() in ('admin','kajur','guru')) with check (public.current_role() in ('admin','kajur','guru'));
drop policy if exists tugas_soal_rw on public.tugas_soal;
create policy tugas_soal_rw on public.tugas_soal for all
  using (public.current_role() in ('admin','kajur','guru')) with check (public.current_role() in ('admin','kajur','guru'));

-- ---------- 11. pengumpulan_tugas & jawaban_tugas_siswa ----------
drop policy if exists pengumpulan_tugas_select on public.pengumpulan_tugas;
create policy pengumpulan_tugas_select on public.pengumpulan_tugas for select
  using (public.current_role() in ('admin','kajur','guru') or id_siswa = public.current_id_siswa());
drop policy if exists pengumpulan_tugas_siswa_update on public.pengumpulan_tugas;
create policy pengumpulan_tugas_siswa_update on public.pengumpulan_tugas for update
  using (id_siswa = public.current_id_siswa()) with check (id_siswa = public.current_id_siswa());
drop policy if exists pengumpulan_tugas_guru_write on public.pengumpulan_tugas;
create policy pengumpulan_tugas_guru_write on public.pengumpulan_tugas for all
  using (public.current_role() in ('admin','kajur','guru')) with check (public.current_role() in ('admin','kajur','guru'));

drop policy if exists jawaban_tugas_siswa_select on public.jawaban_tugas_siswa;
create policy jawaban_tugas_siswa_select on public.jawaban_tugas_siswa for select
  using (public.current_role() in ('admin','kajur','guru') or
         id_pengumpulan in (select id_pengumpulan from public.pengumpulan_tugas where id_siswa = public.current_id_siswa()));
drop policy if exists jawaban_tugas_siswa_insert on public.jawaban_tugas_siswa;
create policy jawaban_tugas_siswa_insert on public.jawaban_tugas_siswa for insert
  with check (public.current_role() in ('admin','kajur','guru') or
         id_pengumpulan in (select id_pengumpulan from public.pengumpulan_tugas where id_siswa = public.current_id_siswa()));
drop policy if exists jawaban_tugas_siswa_guru_update on public.jawaban_tugas_siswa;
create policy jawaban_tugas_siswa_guru_update on public.jawaban_tugas_siswa for update
  using (public.current_role() in ('admin','kajur','guru')) with check (public.current_role() in ('admin','kajur','guru'));

-- ---------- 12. nilai_komponen & nilai_siswa ----------
drop policy if exists nilai_komponen_read on public.nilai_komponen;
create policy nilai_komponen_read on public.nilai_komponen for select using (auth.uid() is not null);
drop policy if exists nilai_komponen_write on public.nilai_komponen;
create policy nilai_komponen_write on public.nilai_komponen for all
  using (public.current_role() in ('admin','kajur') or
         id_mengajar in (select id_mengajar from public.mengajar where id_guru = public.current_id_guru()))
  with check (public.current_role() in ('admin','kajur') or
         id_mengajar in (select id_mengajar from public.mengajar where id_guru = public.current_id_guru()));

drop policy if exists nilai_siswa_select on public.nilai_siswa;
create policy nilai_siswa_select on public.nilai_siswa for select
  using (public.current_role() in ('admin','kajur','guru') or id_siswa = public.current_id_siswa());
drop policy if exists nilai_siswa_write on public.nilai_siswa;
create policy nilai_siswa_write on public.nilai_siswa for all
  using (public.current_role() in ('admin','kajur','guru')) with check (public.current_role() in ('admin','kajur','guru'));

-- ---------- 13. log_aktivitas ----------
drop policy if exists log_aktivitas_insert on public.log_aktivitas;
create policy log_aktivitas_insert on public.log_aktivitas for insert
  with check (id_user = auth.uid());
drop policy if exists log_aktivitas_select on public.log_aktivitas;
create policy log_aktivitas_select on public.log_aktivitas for select
  using (id_user = auth.uid() or public.current_role() in ('admin','kajur'));
