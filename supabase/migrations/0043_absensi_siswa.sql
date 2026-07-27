-- ============================================================
-- Absen Siswa (guru) — presensi harian per pembagian mengajar (kelas+mapel)
-- "Hadir" tidak disimpan sebagai baris (default), hanya status selain hadir.
-- ============================================================

-- Sesi absen: 1 baris per (mengajar, tanggal) — dibuat guru saat klik "Absen Baru"
CREATE TABLE public.absensi_sesi (
  id_sesi     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_mengajar uuid NOT NULL REFERENCES public.mengajar(id_mengajar) ON DELETE CASCADE,
  tanggal     date NOT NULL DEFAULT current_date,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id_mengajar, tanggal)
);

-- Detail per siswa, hanya untuk status selain hadir (izin/sakit/dispen/tanpa keterangan)
CREATE TABLE public.absensi_siswa (
  id_absensi uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_sesi    uuid NOT NULL REFERENCES public.absensi_sesi(id_sesi) ON DELETE CASCADE,
  id_siswa   uuid NOT NULL REFERENCES public.siswa(id_siswa) ON DELETE CASCADE,
  status     text NOT NULL CHECK (status IN ('izin','sakit','dispen','alpa')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id_sesi, id_siswa)
);

CREATE INDEX idx_absensi_sesi_mengajar  ON public.absensi_sesi (id_mengajar, tanggal);
CREATE INDEX idx_absensi_siswa_sesi     ON public.absensi_siswa (id_sesi);
CREATE INDEX idx_absensi_siswa_siswa    ON public.absensi_siswa (id_siswa);

-- RLS
ALTER TABLE public.absensi_sesi  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absensi_siswa ENABLE ROW LEVEL SECURITY;

-- absensi_sesi: staff bisa lihat semua, guru hanya kelola milik mengajar sendiri
CREATE POLICY "absensi_sesi_select" ON public.absensi_sesi
  FOR SELECT USING (public.current_role() IN ('admin','kajur','guru'));

CREATE POLICY "absensi_sesi_write" ON public.absensi_sesi
  FOR ALL USING (
    public.current_role() IN ('admin','kajur') OR
    id_mengajar IN (SELECT id_mengajar FROM public.mengajar WHERE id_guru = public.current_id_guru())
  )
  WITH CHECK (
    public.current_role() IN ('admin','kajur') OR
    id_mengajar IN (SELECT id_mengajar FROM public.mengajar WHERE id_guru = public.current_id_guru())
  );

-- absensi_siswa: staff bisa lihat semua, siswa hanya lihat milik sendiri; tulis oleh guru pemilik mengajar
CREATE POLICY "absensi_siswa_select" ON public.absensi_siswa
  FOR SELECT USING (
    public.current_role() IN ('admin','kajur','guru') OR
    id_siswa = public.current_id_siswa()
  );

CREATE POLICY "absensi_siswa_write" ON public.absensi_siswa
  FOR ALL USING (
    public.current_role() IN ('admin','kajur') OR
    id_sesi IN (
      SELECT s.id_sesi FROM public.absensi_sesi s
      JOIN public.mengajar m ON m.id_mengajar = s.id_mengajar
      WHERE m.id_guru = public.current_id_guru()
    )
  )
  WITH CHECK (
    public.current_role() IN ('admin','kajur') OR
    id_sesi IN (
      SELECT s.id_sesi FROM public.absensi_sesi s
      JOIN public.mengajar m ON m.id_mengajar = s.id_mengajar
      WHERE m.id_guru = public.current_id_guru()
    )
  );
