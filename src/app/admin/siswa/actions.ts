"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getWaStatus, normalizeWaNumber, sendWaMessage } from "@/lib/wa";

type ActionResult = { success: boolean; message: string };

function buildSiswaPayload(formData: FormData) {
  return {
    nama_lengkap: String(formData.get("nama_lengkap") ?? "").trim(),
    nisn: String(formData.get("nisn") ?? "").trim(),
    jenkel: String(formData.get("jenkel") ?? "") || null,
    tempat_lahir: String(formData.get("tempat_lahir") ?? "").trim() || null,
    tanggal_lahir: String(formData.get("tanggal_lahir") ?? "") || null,
    agama: String(formData.get("agama") ?? "").trim() || null,
    aktif: formData.get("aktif") === "on",
  };
}

export async function createSiswa(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const payload = buildSiswaPayload(formData);

  if (!payload.nama_lengkap || !payload.nisn || !payload.tanggal_lahir) {
    return { success: false, message: "Nama, NISN, dan Tanggal Lahir wajib diisi." };
  }

  const { error } = await supabase.from("siswa").insert(payload);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil ditambahkan." };
}

export async function updateSiswa(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id_siswa") ?? "");
  const payload = buildSiswaPayload(formData);

  if (!id || !payload.nama_lengkap || !payload.nisn || !payload.tanggal_lahir) {
    return { success: false, message: "Data tidak lengkap." };
  }

  const { error } = await supabase.from("siswa").update(payload).eq("id_siswa", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil diubah." };
}

export async function deleteSiswa(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id_siswa") ?? "");
  const { error } = await supabase.from("siswa").delete().eq("id_siswa", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil dihapus." };
}

export async function deleteSiswaBulk(ids: string[]): Promise<ActionResult> {
  await requireRole(["admin"]);
  if (!ids.length) return { success: false, message: "Tidak ada siswa dipilih." };

  const supabase = await createClient();
  const { error } = await supabase.from("siswa").delete().in("id_siswa", ids);
  if (error) return { success: false, message: error.message };
  return { success: true, message: `Berhasil menghapus ${ids.length} siswa.` };
}

export async function sendWaBulkSiswa(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);

  const ids = String(formData.get("ids") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const pesan = String(formData.get("message") ?? "").trim();

  if (!ids.length || !pesan) {
    return { success: false, message: "Pilih siswa dan isi pesan terlebih dahulu." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("siswa").select("id_siswa, no_hp").in("id_siswa", ids);
  if (error) return { success: false, message: error.message };

  const nomorList = (data ?? [])
    .map((row) => normalizeWaNumber(String(row.no_hp ?? "")))
    .filter((value): value is string => Boolean(value));

  if (!nomorList.length) {
    return { success: false, message: "Tidak ada nomor HP yang valid untuk siswa terpilih." };
  }

  const failures: string[] = [];

  for (const nomor of nomorList) {
    try {
      await sendWaMessage(nomor, pesan);
    } catch (error) {
      failures.push(error instanceof Error ? error.message : "Tidak diketahui");
    }
  }

  if (failures.length === nomorList.length) {
    return { success: false, message: failures.join(" | ") };
  }

  if (failures.length > 0) {
    return {
      success: true,
      message: `Berhasil mengirim WhatsApp ke ${nomorList.length - failures.length} siswa. ${failures.length} gagal: ${failures.join(" | ")}`,
    };
  }

  return { success: true, message: `Berhasil mengirim WhatsApp ke ${nomorList.length} siswa.` };
}

export async function getWaStatusAction(): Promise<boolean> {
  await requireRole(["admin"]);
  return getWaStatus();
}

export async function updateStatusSiswaBulk(ids: string[], aktif: boolean): Promise<ActionResult> {
  await requireRole(["admin"]);
  if (!ids.length) return { success: false, message: "Tidak ada siswa dipilih." };

  const supabase = await createClient();
  const { error } = await supabase.from("siswa").update({ aktif }).in("id_siswa", ids);
  if (error) return { success: false, message: error.message };
  return {
    success: true,
    message: `Berhasil mengubah status ${ids.length} siswa menjadi ${aktif ? "Aktif" : "Tidak Aktif"}.`,
  };
}

export type ImportSiswaRow = {
  baris: number;
  nama_lengkap: string;
  nisn: string;
  tanggal_lahir: string;
  tempat_lahir: string | null;
  jenkel: string | null;
  agama: string | null;
  no_hp: string | null;
  aktif: boolean;
};

export interface HasilImportSiswa {
  baris: number;
  nama_lengkap: string;
  status: "berhasil" | "gagal";
  pesan?: string;
}

export async function importSiswaBulk(rows: ImportSiswaRow[]): Promise<HasilImportSiswa[]> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const hasil: HasilImportSiswa[] = [];

  for (const { baris, ...payload } of rows) {
    const { error } = await supabase.from("siswa").insert(payload);
    hasil.push({
      baris,
      nama_lengkap: payload.nama_lengkap,
      status: error ? "gagal" : "berhasil",
      pesan: error?.message,
    });
  }

  return hasil;
}

export async function resetPasswordSiswa(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const admin = createAdminClient();

  const idProfile = String(formData.get("id_profile") ?? "");
  const nisn = String(formData.get("nisn") ?? "").trim();

  if (!idProfile || !nisn) return { success: false, message: "Data tidak lengkap." };
  if (nisn.length < 6) return { success: false, message: "NISN terlalu pendek untuk dijadikan password (min. 6 karakter)." };

  const { error } = await admin.auth.admin.updateUserById(idProfile, { password: nisn });
  if (error) return { success: false, message: error.message };
  return { success: true, message: `Password berhasil direset ke NISN (${nisn}).` };
}
