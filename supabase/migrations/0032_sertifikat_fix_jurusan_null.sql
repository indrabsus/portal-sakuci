-- Isi id_jurusan untuk sertifikat yang kompetensinya sudah dihapus
-- (id_jurusan masih NULL karena kompetensi sudah tidak ada saat migration 0031 dijalankan)
-- Ambil dari siswa_kelas aktif siswa tersebut → kelas → jurusan

UPDATE public.sertifikat s
SET id_jurusan = k.id_jurusan
FROM public.siswa_kelas sk
JOIN public.kelas k ON sk.id_kelas = k.id_kelas
WHERE s.id_siswa = sk.id_siswa
  AND sk.aktif = true
  AND s.id_jurusan IS NULL;
