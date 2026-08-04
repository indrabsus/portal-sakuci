"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

async function ensureOwnMengajar(idMengajar: string, idGuru: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("mengajar").select("id_guru").eq("id_mengajar", idMengajar).single();
  return data?.id_guru === idGuru;
}

export async function buatNilaiManual(formData: FormData): Promise<ActionResult & { id_tugas?: string }> {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const idMengajar = String(formData.get("id_mengajar") ?? "");
  const judul = String(formData.get("judul") ?? "").trim();
  const semester = String(formData.get("semester") ?? "ganjil");

  if (!idMengajar || !judul) return { success: false, message: "Kelas/mapel dan judul penilaian wajib diisi." };
  if (!(await ensureOwnMengajar(idMengajar, profile.id_guru ?? ""))) {
    return { success: false, message: "Anda tidak mengajar kelas/mapel ini." };
  }

  const { data, error } = await supabase
    .from("tugas")
    .insert({ id_mengajar: idMengajar, judul, status: "ditutup", semester, tipe: "manual" })
    .select("id_tugas")
    .single();

  if (error || !data) return { success: false, message: error?.message ?? "Gagal membuat penilaian manual." };
  return { success: true, message: "Penilaian manual siap diisi.", id_tugas: data.id_tugas };
}

export type SiswaNilaiRow = {
  id_siswa: string;
  nama_lengkap: string;
  nisn: string | null;
  nilai: number | null;
};

export type DetailNilaiManual = {
  id_tugas: string;
  judul: string;
  kelas_label: string;
  mapel_label: string;
  siswa_list: SiswaNilaiRow[];
};

export async function getDetailNilaiManual(idTugas: string): Promise<DetailNilaiManual | null> {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const { data: tugas } = await supabase
    .from("tugas")
    .select("id_tugas, judul, tipe, id_mengajar, mengajar(id_guru, id_kelas, mapel(nama_mapel), kelas(nama_kelas, tingkat))")
    .eq("id_tugas", idTugas)
    .single();

  const mengajar = tugas?.mengajar as unknown as {
    id_guru: string;
    id_kelas: string;
    mapel: { nama_mapel: string } | null;
    kelas: { nama_kelas: string; tingkat: number | null } | null;
  } | null;

  if (!tugas || tugas.tipe !== "manual" || !mengajar || mengajar.id_guru !== profile.id_guru) return null;

  const [{ data: siswaKelasList }, { data: pengumpulanList }] = await Promise.all([
    supabase
      .from("siswa_kelas")
      .select("id_siswa, siswa(nama_lengkap, nisn)")
      .eq("id_kelas", mengajar.id_kelas)
      .eq("aktif", true),
    supabase.from("pengumpulan_tugas").select("id_siswa, nilai").eq("id_tugas", idTugas),
  ]);

  const nilaiMap = new Map<string, number | null>((pengumpulanList ?? []).map((p) => [p.id_siswa as string, p.nilai as number | null]));

  const siswaList: SiswaNilaiRow[] = (siswaKelasList ?? [])
    .map((sk): SiswaNilaiRow => {
      const siswa = sk.siswa as unknown as { nama_lengkap: string; nisn: string | null } | null;
      return {
        id_siswa: sk.id_siswa,
        nama_lengkap: siswa?.nama_lengkap ?? "-",
        nisn: siswa?.nisn ?? null,
        nilai: nilaiMap.get(sk.id_siswa) ?? null,
      };
    })
    .sort((a, b) => a.nama_lengkap.localeCompare(b.nama_lengkap));

  return {
    id_tugas: tugas.id_tugas,
    judul: tugas.judul,
    kelas_label: mengajar.kelas ? (mengajar.kelas.tingkat ? `${mengajar.kelas.tingkat} ${mengajar.kelas.nama_kelas}` : mengajar.kelas.nama_kelas) : "-",
    mapel_label: mengajar.mapel?.nama_mapel ?? "-",
    siswa_list: siswaList,
  };
}

export async function simpanNilaiManual(
  idTugas: string,
  nilaiList: { id_siswa: string; nilai: number | null }[],
): Promise<ActionResult> {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const { data: tugas } = await supabase
    .from("tugas")
    .select("id_tugas, tipe, mengajar(id_guru)")
    .eq("id_tugas", idTugas)
    .single();
  const idGuruTugas = (tugas?.mengajar as unknown as { id_guru: string } | null)?.id_guru;
  if (!tugas || tugas.tipe !== "manual" || idGuruTugas !== profile.id_guru) {
    return { success: false, message: "Penilaian tidak ditemukan atau bukan milik Anda." };
  }

  const rows = nilaiList
    .filter((n): n is { id_siswa: string; nilai: number } => n.nilai !== null && !Number.isNaN(n.nilai))
    .map((n) => ({
      id_tugas: idTugas,
      id_siswa: n.id_siswa,
      nilai: Math.max(0, Math.min(100, n.nilai)),
      status: "dinilai",
      dinilai_at: new Date().toISOString(),
      id_guru_penilai: profile.id_guru,
    }));

  if (rows.length === 0) return { success: true, message: "Tidak ada nilai untuk disimpan." };

  const { error } = await supabase.from("pengumpulan_tugas").upsert(rows, { onConflict: "id_tugas,id_siswa" });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Nilai berhasil disimpan." };
}

export async function hapusNilaiManual(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();
  const id = String(formData.get("id_tugas") ?? "");

  const { data: tugas } = await supabase
    .from("tugas")
    .select("id_tugas, tipe, mengajar(id_guru)")
    .eq("id_tugas", id)
    .single();
  const idGuruTugas = (tugas?.mengajar as unknown as { id_guru: string } | null)?.id_guru;
  if (!tugas || tugas.tipe !== "manual" || idGuruTugas !== profile.id_guru) {
    return { success: false, message: "Penilaian tidak ditemukan atau bukan milik Anda." };
  }

  const { error } = await supabase.from("tugas").delete().eq("id_tugas", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Penilaian manual berhasil dihapus." };
}
