-- Tambah kolom id_jurusan ke tabel sertifikat sebagai snapshot
-- Agar sertifikat tetap bisa diidentifikasi kepemilikan jurusannya
-- meski kompetensi asalnya sudah dihapus.

ALTER TABLE public.sertifikat
  ADD COLUMN IF NOT EXISTS id_jurusan uuid REFERENCES public.jurusan(id_jurusan);

-- Isi id_jurusan dari kompetensi yang masih ada
UPDATE public.sertifikat s
SET id_jurusan = k.id_jurusan
FROM public.kompetensi k
WHERE s.id_kompetensi = k.id_kompetensi
  AND s.id_jurusan IS NULL;
