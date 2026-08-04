-- Nilai manual (tugas offline): guru pilih mapel+kelas lalu langsung menilai
-- siswa tanpa siswa perlu mengerjakan apa pun di portal. Direkam lewat tabel
-- tugas & pengumpulan_tugas yang sama supaya otomatis ikut masuk ke rekap
-- nilai guru (guru/nilai) berdampingan dengan tugas biasa.

ALTER TABLE public.tugas
  ADD COLUMN IF NOT EXISTS tipe text NOT NULL DEFAULT 'portal';

ALTER TABLE public.tugas DROP CONSTRAINT IF EXISTS tugas_tipe_check;
ALTER TABLE public.tugas ADD CONSTRAINT tugas_tipe_check
  CHECK (tipe IN ('portal', 'manual'));
