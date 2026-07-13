-- Nilai di sertifikat manual bersifat opsional: kalau tidak diisi, sertifikat
-- cukup menampilkan status LULUS tanpa angka nilai.

ALTER TABLE public.sertifikat
  ALTER COLUMN nilai DROP NOT NULL;
