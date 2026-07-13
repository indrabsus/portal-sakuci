import type { SupabaseClient } from "@supabase/supabase-js";

export async function getRincianTesKompetensi(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  idSiswa: string,
  idKompetensi: string,
): Promise<{ judul: string; nilai: number | null }[]> {
  const { data: tesList } = await supabase
    .from("kompetensi_tugas")
    .select("id_kompetensi_tugas, judul")
    .eq("id_kompetensi", idKompetensi)
    .eq("status", "aktif")
    .order("created_at");

  const idTesList = (tesList ?? []).map((t: { id_kompetensi_tugas: string }) => t.id_kompetensi_tugas);
  if (idTesList.length === 0) return [];

  const { data: pengumpulanList } = await supabase
    .from("pengumpulan_kompetensi")
    .select("id_kompetensi_tugas, nilai")
    .eq("id_siswa", idSiswa)
    .in("id_kompetensi_tugas", idTesList);

  const nilaiMap = new Map(
    (pengumpulanList ?? []).map((p: { id_kompetensi_tugas: string; nilai: number | null }) => [p.id_kompetensi_tugas, p.nilai]),
  );

  return (tesList ?? []).map((t: { id_kompetensi_tugas: string; judul: string }) => ({
    judul: t.judul,
    nilai: nilaiMap.get(t.id_kompetensi_tugas) ?? null,
  }));
}

/**
 * Nilai akhir dihitung ulang dari rata-rata tes yang SUDAH dikerjakan saja
 * (bukan nilai statis saat sertifikat diterbitkan), supaya kalau kajur
 * menambah tes baru ke kompetensi yang sertifikatnya sudah terbit, nilai
 * akhir tetap konsisten dengan rincian tes yang ditampilkan.
 */
export function hitungNilaiAkhir(rincianTes: { nilai: number | null }[]): number | null {
  const nilaiValid = rincianTes.map((t) => t.nilai).filter((n): n is number => n !== null);
  if (nilaiValid.length === 0) return null;
  return Math.round((nilaiValid.reduce((a, b) => a + b, 0) / nilaiValid.length) * 100) / 100;
}

/**
 * Status lulus dicek ulang setiap kali sertifikat ditampilkan/dicetak:
 * semua tes harus sudah dikerjakan DAN nilainya >= syarat lulus kompetensi.
 * Kalau ada tes yang nilainya turun di bawah syarat (misal soal diedit
 * setelah sertifikat terbit), sertifikat otomatis tampil watermark "TIDAK LULUS".
 */
export function cekStatusLulus(rincianTes: { nilai: number | null }[], syaratLulus: number): boolean {
  if (rincianTes.length === 0) return false;
  return rincianTes.every((t) => t.nilai !== null && t.nilai >= syaratLulus);
}

/**
 * Jabatan penandatangan sertifikat menyesuaikan jurusan, misal
 * "Ketua Program Keahlian PPLG". Kalau jurusan tidak ditemukan,
 * pakai sebutan generik "Kepala Jurusan".
 */
export async function getJabatanKajurByJurusan(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  idJurusan: string,
): Promise<string> {
  const { data: jurusan } = await supabase
    .from("jurusan")
    .select("kode_jurusan, nama_jurusan")
    .eq("id_jurusan", idJurusan)
    .single();

  if (!jurusan) return "Kepala Jurusan";

  return `Ketua Program Keahlian ${jurusan.kode_jurusan || jurusan.nama_jurusan}`;
}

/**
 * Jabatan penandatangan sertifikat menyesuaikan jurusan kompetensinya,
 * misal "Ketua Program Keahlian PPLG". Kalau kompetensi berlaku untuk
 * semua jurusan (id_jurusan kosong), pakai sebutan generik "Kepala Jurusan".
 */
export async function getJabatanKajur(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  idKompetensi: string,
): Promise<string> {
  const { data: kompetensi } = await supabase
    .from("kompetensi")
    .select("id_jurusan")
    .eq("id_kompetensi", idKompetensi)
    .single();

  if (!kompetensi?.id_jurusan) return "Kepala Jurusan";

  return getJabatanKajurByJurusan(supabase, kompetensi.id_jurusan);
}

/**
 * Progres kompetensi siswa dianggap "lulus" hanya jika SEMUA tes kompetensi
 * aktif di bawah kompetensi tersebut sudah berstatus lulus. Dipanggil setiap
 * kali ada tes yang baru selesai dinilai (oleh siswa sendiri untuk tes PG-only,
 * atau oleh kajur setelah validasi essay).
 */
export async function recomputeProgresKompetensi(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  idSiswa: string,
  idKompetensi: string,
) {
  const { data: tesList } = await supabase
    .from("kompetensi_tugas")
    .select("id_kompetensi_tugas")
    .eq("id_kompetensi", idKompetensi)
    .eq("status", "aktif");

  const idTesList = (tesList ?? []).map((t: { id_kompetensi_tugas: string }) => t.id_kompetensi_tugas);
  if (idTesList.length === 0) return;

  const { data: pengumpulanList } = await supabase
    .from("pengumpulan_kompetensi")
    .select("id_kompetensi_tugas, status, nilai")
    .eq("id_siswa", idSiswa)
    .in("id_kompetensi_tugas", idTesList);

  const rows = pengumpulanList ?? [];
  const allLulus = idTesList.every(
    (idTes: string) => rows.find((p: { id_kompetensi_tugas: string; status: string }) => p.id_kompetensi_tugas === idTes)?.status === "lulus",
  );

  const nilaiList = rows.map((p: { nilai: number | null }) => p.nilai).filter((n: number | null): n is number => n !== null);
  const rataRata = nilaiList.length > 0 ? Math.round((nilaiList.reduce((a: number, b: number) => a + b, 0) / nilaiList.length) * 100) / 100 : 0;

  if (allLulus) {
    await supabase.from("progres_kompetensi").upsert(
      { id_siswa: idSiswa, id_kompetensi: idKompetensi, status: "lulus", nilai: rataRata, tanggal_validasi: new Date().toISOString() },
      { onConflict: "id_siswa,id_kompetensi" },
    );
    return;
  }

  const { data: existing } = await supabase
    .from("progres_kompetensi")
    .select("status")
    .eq("id_siswa", idSiswa)
    .eq("id_kompetensi", idKompetensi)
    .maybeSingle();

  if (!existing || existing.status !== "lulus") {
    await supabase
      .from("progres_kompetensi")
      .upsert({ id_siswa: idSiswa, id_kompetensi: idKompetensi, status: "proses", nilai: rataRata }, { onConflict: "id_siswa,id_kompetensi" });
  }
}

/**
 * Check if a kompetensi is locked for a student. A kompetensi is locked if
 * there are any previous kompetensi (lower urutan) that are not yet "lulus".
 * The first kompetensi (urutan = 1 or minimum) is never locked.
 */
export async function isKompetensiLocked(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  idSiswa: string,
  idKompetensi: string,
): Promise<boolean> {
  // Get the urutan of the target kompetensi
  const { data: targetKompetensi } = await supabase
    .from("kompetensi")
    .select("urutan")
    .eq("id_kompetensi", idKompetensi)
    .single();

  if (!targetKompetensi || targetKompetensi.urutan === 1) return false;

  // Get all previous kompetensi (lower urutan) that are active
  const { data: prevKompetensiList } = await supabase
    .from("kompetensi")
    .select("id_kompetensi")
    .lt("urutan", targetKompetensi.urutan)
    .eq("aktif", true);

  if (!prevKompetensiList || prevKompetensiList.length === 0) return false;

  const prevIdList = prevKompetensiList.map((k: { id_kompetensi: string }) => k.id_kompetensi);

  // Check progress of all previous kompetensi
  const { data: progresSebelumnya } = await supabase
    .from("progres_kompetensi")
    .select("id_kompetensi, status")
    .eq("id_siswa", idSiswa)
    .in("id_kompetensi", prevIdList);

  const progresMap = new Map((progresSebelumnya ?? []).map((p) => [p.id_kompetensi, p.status]));

  // Kompetensi is locked if ANY previous kompetensi is NOT "lulus"
  return prevIdList.some((id: string) => progresMap.get(id) !== "lulus");
}

/**
 * Get info about locked status and required previous kompetensi
 */
export async function getKompetensiLockInfo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  idSiswa: string,
  idKompetensi: string,
): Promise<{ isLocked: boolean; prevKompetensi?: { id_kompetensi: string; judul: string; status: string } } | null> {
  // Get target kompetensi
  const { data: targetKompetensi } = await supabase
    .from("kompetensi")
    .select("urutan")
    .eq("id_kompetensi", idKompetensi)
    .single();

  if (!targetKompetensi) return null;

  if (targetKompetensi.urutan === 1) {
    return { isLocked: false };
  }

  // Get immediate previous kompetensi (urutan - 1)
  const { data: prevKompetensi } = await supabase
    .from("kompetensi")
    .select("id_kompetensi, judul")
    .eq("urutan", targetKompetensi.urutan - 1)
    .eq("aktif", true)
    .single();

  if (!prevKompetensi) {
    return { isLocked: false };
  }

  // Get progress of previous kompetensi
  const { data: progres } = await supabase
    .from("progres_kompetensi")
    .select("status")
    .eq("id_siswa", idSiswa)
    .eq("id_kompetensi", prevKompetensi.id_kompetensi)
    .maybeSingle();

  const status = progres?.status ?? "belum";
  const isLocked = status !== "lulus";

  if (isLocked) {
    return {
      isLocked: true,
      prevKompetensi: {
        id_kompetensi: prevKompetensi.id_kompetensi,
        judul: prevKompetensi.judul,
        status,
      },
    };
  }

  return { isLocked: false };
}
