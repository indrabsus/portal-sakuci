-- Sertifikat manual: kajur bisa terbitkan sertifikat dengan kompetensi & nilai
-- diisi bebas (tidak lewat progres_kompetensi/kompetensi_tugas), opsional
-- ditandatangani juga oleh Kepala Sekolah selain kajur.

ALTER TABLE public.sertifikat
  ALTER COLUMN id_kompetensi DROP NOT NULL;

ALTER TABLE public.sertifikat
  ADD COLUMN IF NOT EXISTS judul_manual text,
  ADD COLUMN IF NOT EXISTS tipe text NOT NULL DEFAULT 'otomatis',
  ADD COLUMN IF NOT EXISTS nama_kepsek text;

ALTER TABLE public.sertifikat DROP CONSTRAINT IF EXISTS sertifikat_tipe_check;
ALTER TABLE public.sertifikat ADD CONSTRAINT sertifikat_tipe_check
  CHECK (tipe IN ('otomatis', 'manual'));

-- Jaga konsistensi: manual harus punya judul_manual & tanpa id_kompetensi, dan
-- sebaliknya, supaya kode yang branch berdasarkan id_kompetensi IS NULL selalu benar.
ALTER TABLE public.sertifikat DROP CONSTRAINT IF EXISTS sertifikat_manual_consistency_check;
ALTER TABLE public.sertifikat ADD CONSTRAINT sertifikat_manual_consistency_check CHECK (
  (tipe = 'manual' AND id_kompetensi IS NULL AND judul_manual IS NOT NULL)
  OR
  (tipe = 'otomatis' AND id_kompetensi IS NOT NULL AND judul_manual IS NULL)
);
