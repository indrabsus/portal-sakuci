-- ============================================================
-- Portal Sakuci - Hapus kolom nis di tabel siswa (tidak terpakai)
-- view_user_login ikut select kolom ini secara pass-through (tidak untuk join/filter),
-- jadi di-recreate dulu tanpa kolom nis sebelum kolomnya di-drop.
-- Jalankan di Supabase SQL Editor.
-- ============================================================

drop view if exists public.view_user_login;

create view public.view_user_login as
SELECT p.id_profile,
    p.email,
    p.nama_lengkap,
    p.id_role,
    p.aktif,
    r.nama_role,
    ag.id_guru,
    g.uid_fp,
    g.no_hp AS no_hp_guru,
    aks.id_siswa,
    s.nisn,
    s.tanggal_lahir
   FROM profiles p
     JOIN roles r ON r.id_role = p.id_role
     LEFT JOIN akun_guru ag ON ag.id_profile = p.id_profile
     LEFT JOIN guru g ON g.id_guru = ag.id_guru
     LEFT JOIN akun_siswa aks ON aks.id_profile = p.id_profile
     LEFT JOIN siswa s ON s.id_siswa = aks.id_siswa;

alter table public.siswa drop column if exists nis;
