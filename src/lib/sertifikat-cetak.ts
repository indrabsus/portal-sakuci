import type { SupabaseClient } from "@supabase/supabase-js";
import { getRincianTesKompetensi, hitungNilaiAkhir, cekStatusLulus, getJabatanKajur } from "./kompetensi-progress";

export type SertifikatCetakRow = {
  id_siswa: string;
  id_kompetensi: string | null;
  judul_manual: string | null;
  nilai: number | null;
  jabatan_kajur: string | null;
  kompetensi: { judul: string; syarat_lulus: number } | null;
};

export type SertifikatCetakResolved = {
  judulKompetensi: string;
  nilai: number | null;
  jabatanKajur: string;
  rincianTes: { judul: string; nilai: number | null }[];
  statusLulus: boolean;
};

/**
 * Sertifikat manual (id_kompetensi null) tidak punya kompetensi_tugas/progres
 * untuk dihitung ulang - nilai & status lulus dibekukan persis seperti saat
 * dibuat. Sertifikat otomatis tetap dihitung ulang live seperti sebelumnya.
 */
export async function resolveSertifikatCetak(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  sertifikat: SertifikatCetakRow,
): Promise<SertifikatCetakResolved> {
  if (sertifikat.id_kompetensi == null) {
    return {
      judulKompetensi: sertifikat.judul_manual ?? "-",
      nilai: sertifikat.nilai,
      jabatanKajur: sertifikat.jabatan_kajur ?? "-",
      rincianTes: [],
      statusLulus: true,
    };
  }

  const [rincianTes, jabatanKajur] = await Promise.all([
    getRincianTesKompetensi(supabase, sertifikat.id_siswa, sertifikat.id_kompetensi),
    getJabatanKajur(supabase, sertifikat.id_kompetensi),
  ]);

  return {
    judulKompetensi: sertifikat.kompetensi?.judul ?? "-",
    nilai: hitungNilaiAkhir(rincianTes) ?? sertifikat.nilai,
    jabatanKajur,
    rincianTes,
    statusLulus: cekStatusLulus(rincianTes, sertifikat.kompetensi?.syarat_lulus ?? 75),
  };
}
