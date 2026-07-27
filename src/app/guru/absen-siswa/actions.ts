"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

const STATUS_VALID = ["izin", "sakit", "dispen", "alpa"] as const;
type StatusValid = (typeof STATUS_VALID)[number];

async function ensureOwnMengajar(idMengajar: string, idGuru: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("mengajar").select("id_guru").eq("id_mengajar", idMengajar).single();
  return data?.id_guru === idGuru;
}

export async function bukaSesiAbsen(formData: FormData): Promise<ActionResult & { id_sesi?: string }> {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const idMengajar = String(formData.get("id_mengajar") ?? "");
  if (!idMengajar) return { success: false, message: "Kelas/mapel wajib dipilih." };
  if (!(await ensureOwnMengajar(idMengajar, profile.id_guru ?? ""))) {
    return { success: false, message: "Anda tidak mengajar kelas/mapel ini." };
  }

  const { data, error } = await supabase
    .from("absensi_sesi")
    .upsert({ id_mengajar: idMengajar }, { onConflict: "id_mengajar,tanggal" })
    .select("id_sesi")
    .single();

  if (error || !data) return { success: false, message: error?.message ?? "Gagal membuka sesi absen." };
  return { success: true, message: "Sesi absen siap diisi.", id_sesi: data.id_sesi };
}

export type SiswaAbsenRow = {
  id_siswa: string;
  nama_lengkap: string;
  nisn: string | null;
  status: "hadir" | StatusValid;
};

export type DetailSesi = {
  id_sesi: string;
  tanggal: string;
  kelas_label: string;
  mapel_label: string;
  siswa_list: SiswaAbsenRow[];
};

export async function getDetailSesi(idSesi: string): Promise<DetailSesi | null> {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const { data: sesi } = await supabase
    .from("absensi_sesi")
    .select("id_sesi, tanggal, id_mengajar, mengajar(id_guru, id_kelas, mapel(nama_mapel), kelas(nama_kelas, tingkat))")
    .eq("id_sesi", idSesi)
    .single();

  const mengajar = sesi?.mengajar as unknown as {
    id_guru: string;
    id_kelas: string;
    mapel: { nama_mapel: string } | null;
    kelas: { nama_kelas: string; tingkat: number | null } | null;
  } | null;

  if (!sesi || !mengajar || mengajar.id_guru !== profile.id_guru) return null;

  const [{ data: siswaKelasList }, { data: absensiList }] = await Promise.all([
    supabase
      .from("siswa_kelas")
      .select("id_siswa, siswa(nama_lengkap, nisn)")
      .eq("id_kelas", mengajar.id_kelas)
      .eq("aktif", true),
    supabase.from("absensi_siswa").select("id_siswa, status").eq("id_sesi", idSesi),
  ]);

  const statusMap = new Map<string, StatusValid>((absensiList ?? []).map((a) => [a.id_siswa as string, a.status as StatusValid]));

  const siswaList: SiswaAbsenRow[] = (siswaKelasList ?? [])
    .map((sk): SiswaAbsenRow => {
      const siswa = sk.siswa as unknown as { nama_lengkap: string; nisn: string | null } | null;
      return {
        id_siswa: sk.id_siswa,
        nama_lengkap: siswa?.nama_lengkap ?? "-",
        nisn: siswa?.nisn ?? null,
        status: statusMap.get(sk.id_siswa) ?? "hadir",
      };
    })
    .sort((a, b) => a.nama_lengkap.localeCompare(b.nama_lengkap));

  return {
    id_sesi: sesi.id_sesi,
    tanggal: sesi.tanggal,
    kelas_label: mengajar.kelas ? (mengajar.kelas.tingkat ? `${mengajar.kelas.tingkat} ${mengajar.kelas.nama_kelas}` : mengajar.kelas.nama_kelas) : "-",
    mapel_label: mengajar.mapel?.nama_mapel ?? "-",
    siswa_list: siswaList,
  };
}

export async function simpanAbsen(
  idSesi: string,
  statuses: { id_siswa: string; status: string }[],
): Promise<ActionResult> {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const { data: sesi } = await supabase
    .from("absensi_sesi")
    .select("id_sesi, mengajar(id_guru)")
    .eq("id_sesi", idSesi)
    .single();
  const idGuruSesi = (sesi?.mengajar as unknown as { id_guru: string } | null)?.id_guru;
  if (!sesi || idGuruSesi !== profile.id_guru) {
    return { success: false, message: "Sesi tidak ditemukan atau bukan milik Anda." };
  }

  const rows = statuses
    .filter((s): s is { id_siswa: string; status: StatusValid } => (STATUS_VALID as readonly string[]).includes(s.status))
    .map((s) => ({ id_sesi: idSesi, id_siswa: s.id_siswa, status: s.status }));

  const { error: delError } = await supabase.from("absensi_siswa").delete().eq("id_sesi", idSesi);
  if (delError) return { success: false, message: delError.message };

  if (rows.length > 0) {
    const { error: insError } = await supabase.from("absensi_siswa").insert(rows);
    if (insError) return { success: false, message: insError.message };
  }

  return { success: true, message: "Absensi berhasil disimpan." };
}
