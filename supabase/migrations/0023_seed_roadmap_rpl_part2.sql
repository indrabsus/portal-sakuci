-- ============================================================
-- Seed Part 2: Kompetensi Tugas (1 tes per kompetensi)
-- Jalankan SETELAH Part 1
-- ============================================================

DO $$
DECLARE
  v_jur uuid;
  r record;
  v_judul_tes text;
BEGIN
  SELECT id_jurusan INTO v_jur FROM public.jurusan
  WHERE lower(nama_jurusan) LIKE '%rpl%'
     OR lower(nama_jurusan) LIKE '%pplg%'
     OR lower(kode_jurusan)  LIKE '%rpl%'
     OR lower(kode_jurusan)  LIKE '%pplg%'
  LIMIT 1;

  IF v_jur IS NULL THEN
    RAISE EXCEPTION 'Jurusan PPLG/RPL tidak ditemukan.';
  END IF;

  -- Buat satu kompetensi_tugas untuk tiap kompetensi yang belum punya tes
  FOR r IN
    SELECT id_kompetensi, judul FROM public.kompetensi
    WHERE id_jurusan = v_jur
    ORDER BY urutan
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM public.kompetensi_tugas WHERE id_kompetensi = r.id_kompetensi
    ) THEN
      v_judul_tes := 'Tes: ' || r.judul;
      INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
      VALUES (
        r.id_kompetensi,
        v_judul_tes,
        'Tes kompetensi untuk mengukur pemahaman materi ' || r.judul || '.',
        'aktif'
      );
    END IF;
  END LOOP;

  RAISE NOTICE 'Part 2 selesai: kompetensi_tugas berhasil dibuat untuk jurusan %', v_jur;
END $$;
