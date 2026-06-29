"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

function buildSiswaPayload(formData: FormData) {
  return {
    nama_lengkap: String(formData.get("nama_lengkap") ?? "").trim(),
    nisn: String(formData.get("nisn") ?? "").trim(),
    nis: String(formData.get("nis") ?? "").trim() || null,
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
