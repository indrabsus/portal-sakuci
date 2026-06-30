import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/fetch-all";
import type { CatatanBkRow, SiswaOption, SiswaCatatanSummary } from "./types";

type SiswaEmbed = {
  nama_lengkap: string;
  nisn: string | null;
  siswa_kelas: { aktif: boolean; kelas: { nama_kelas: string; tingkat: number | null } | null }[] | null;
};

function buildKelasLabel(siswa: SiswaEmbed | null) {
  const kelas = siswa?.siswa_kelas?.find((sk) => sk.aktif)?.kelas ?? null;
  if (!kelas) return "-";
  return kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas;
}

export async function getCatatanBkList(): Promise<CatatanBkRow[]> {
  const supabase = await createClient();
  const rows = await fetchAllRows((from, to) =>
    supabase
      .from("catatan_bk")
      .select(
        "id_catatan, id_siswa, tanggal, permasalahan, tindakan, kesepakatan, catatan_tambahan, nama_koordinator_bk, nip_koordinator_bk, created_at, siswa(nama_lengkap, nisn, siswa_kelas(aktif, kelas(nama_kelas, tingkat)))",
      )
      .order("tanggal", { ascending: false })
      .range(from, to),
  );

  return rows.map((r) => {
    const siswa = r.siswa as unknown as SiswaEmbed | null;
    return {
      id_catatan: r.id_catatan,
      id_siswa: r.id_siswa,
      tanggal: r.tanggal,
      permasalahan: r.permasalahan,
      tindakan: r.tindakan,
      kesepakatan: r.kesepakatan,
      catatan_tambahan: r.catatan_tambahan,
      nama_koordinator_bk: r.nama_koordinator_bk,
      nip_koordinator_bk: r.nip_koordinator_bk,
      nama_siswa: siswa?.nama_lengkap ?? "-",
      kelas_label: buildKelasLabel(siswa),
      nisn: siswa?.nisn ?? null,
      created_at: r.created_at,
    };
  });
}

export async function getCatatanBkById(idCatatan: string): Promise<CatatanBkRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("catatan_bk")
    .select(
      "id_catatan, id_siswa, tanggal, permasalahan, tindakan, kesepakatan, catatan_tambahan, nama_koordinator_bk, nip_koordinator_bk, created_at, siswa(nama_lengkap, nisn, siswa_kelas(aktif, kelas(nama_kelas, tingkat)))",
    )
    .eq("id_catatan", idCatatan)
    .single();

  if (!data) return null;

  const siswa = data.siswa as unknown as SiswaEmbed | null;
  return {
    id_catatan: data.id_catatan,
    id_siswa: data.id_siswa,
    tanggal: data.tanggal,
    permasalahan: data.permasalahan,
    tindakan: data.tindakan,
    kesepakatan: data.kesepakatan,
    catatan_tambahan: data.catatan_tambahan,
    nama_koordinator_bk: data.nama_koordinator_bk,
    nip_koordinator_bk: data.nip_koordinator_bk,
    nama_siswa: siswa?.nama_lengkap ?? "-",
    kelas_label: buildKelasLabel(siswa),
    nisn: siswa?.nisn ?? null,
    created_at: data.created_at,
  };
}

export async function getSiswaOptions(): Promise<SiswaOption[]> {
  const supabase = await createClient();
  const rows = await fetchAllRows((from, to) =>
    supabase
      .from("siswa")
      .select("id_siswa, nama_lengkap, nisn, siswa_kelas(aktif, kelas(nama_kelas, tingkat))")
      .order("nama_lengkap", { ascending: true })
      .range(from, to),
  );

  return rows.map((r) => {
    const siswaKelas = r.siswa_kelas as unknown as { aktif: boolean; kelas: { nama_kelas: string; tingkat: number | null } | null }[] | null;
    const kelas = siswaKelas?.find((sk) => sk.aktif)?.kelas ?? null;
    const kelas_label = kelas ? (kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas) : "-";
    return {
      id_siswa: r.id_siswa,
      nama_lengkap: r.nama_lengkap,
      nisn: r.nisn ?? null,
      kelas_label,
    };
  });
}

export async function getSiswaCatatanSummary(): Promise<SiswaCatatanSummary[]> {
  const supabase = await createClient();

  // Ambil semua siswa aktif beserta jumlah catatan BK-nya
  const rows = await fetchAllRows((from, to) =>
    supabase
      .from("siswa")
      .select("id_siswa, nama_lengkap, nisn, siswa_kelas(aktif, kelas(nama_kelas, tingkat))")
      .order("nama_lengkap", { ascending: true })
      .range(from, to),
  );

  // Hitung catatan per siswa
  const { data: catatanCounts } = await supabase
    .from("catatan_bk")
    .select("id_siswa");

  const countMap: Record<string, number> = {};
  for (const c of catatanCounts ?? []) {
    countMap[c.id_siswa] = (countMap[c.id_siswa] ?? 0) + 1;
  }

  return rows.map((r) => {
    const siswaKelas = r.siswa_kelas as unknown as { aktif: boolean; kelas: { nama_kelas: string; tingkat: number | null } | null }[] | null;
    const kelas = siswaKelas?.find((sk) => sk.aktif)?.kelas ?? null;
    const kelas_label = kelas ? (kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas) : "-";
    return {
      id_siswa: r.id_siswa,
      nama_lengkap: r.nama_lengkap,
      nisn: r.nisn ?? null,
      kelas_label,
      jumlah_catatan: countMap[r.id_siswa] ?? 0,
    };
  });
}
