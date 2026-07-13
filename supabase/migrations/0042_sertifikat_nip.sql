-- NIP/NUPTK penandatangan sertifikat (kajur & kepala sekolah), untuk dicantumkan
-- di kolom tanda tangan basah sertifikat.

ALTER TABLE public.informasi_sekolah
  ADD COLUMN IF NOT EXISTS nip_kepala_sekolah text;

UPDATE public.informasi_sekolah
SET nip_kepala_sekolah = '123456'
WHERE nip_kepala_sekolah IS NULL;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS nip_nuptk text;

ALTER TABLE public.sertifikat
  ADD COLUMN IF NOT EXISTS nip_kajur text,
  ADD COLUMN IF NOT EXISTS nip_kepsek text;
