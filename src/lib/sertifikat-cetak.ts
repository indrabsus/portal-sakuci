import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "./supabase/admin";
import { getRincianTesKompetensi, hitungNilaiAkhir, cekStatusLulus, getJabatanKajur } from "./kompetensi-progress";

export type SertifikatCetakRow = {
  id_siswa: string;
  id_kompetensi: string | null;
  judul_manual: string | null;
  nilai: number | null;
  jabatan_kajur: string | null;
  nip_kajur: string | null;
  diterbitkan_oleh: string | null;
  kompetensi: { judul: string; syarat_lulus: number } | null;
};

export type SertifikatCetakResolved = {
  judulKompetensi: string;
  nilai: number | null;
  jabatanKajur: string;
  nipKajur: string | null;
  rincianTes: { judul: string; nilai: number | null }[];
  statusLulus: boolean;
};

/**
 * Sertifikat lama (dibuat sebelum kolom nip_kajur ada, atau sebelum NIP/NUPTK
 * kajur diisi di profil) punya snapshot nip_kajur kosong - fallback ambil
 * nip_nuptk terkini dari profil kajur yang menerbitkan, supaya tetap tampil.
 * Pakai admin client karena RLS profiles hanya izinkan baca profil sendiri
 * atau admin - siswa/kajur lain yang buka halaman cetak ini akan diblokir
 * RLS kalau pakai client biasa.
 */
async function resolveNipKajur(sertifikat: Pick<SertifikatCetakRow, "nip_kajur" | "diterbitkan_oleh">): Promise<string | null> {
  if (sertifikat.nip_kajur) return sertifikat.nip_kajur;
  if (!sertifikat.diterbitkan_oleh) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("nip_nuptk")
    .eq("id_profile", sertifikat.diterbitkan_oleh)
    .maybeSingle();
  return data?.nip_nuptk ?? null;
}

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
      nipKajur: await resolveNipKajur(sertifikat),
      rincianTes: [],
      statusLulus: true,
    };
  }

  const [rincianTes, jabatanKajur, nipKajur] = await Promise.all([
    getRincianTesKompetensi(supabase, sertifikat.id_siswa, sertifikat.id_kompetensi),
    getJabatanKajur(supabase, sertifikat.id_kompetensi),
    resolveNipKajur(sertifikat),
  ]);

  return {
    judulKompetensi: sertifikat.kompetensi?.judul ?? "-",
    nilai: hitungNilaiAkhir(rincianTes) ?? sertifikat.nilai,
    jabatanKajur,
    nipKajur,
    rincianTes,
    statusLulus: cekStatusLulus(rincianTes, sertifikat.kompetensi?.syarat_lulus ?? 75),
  };
}
