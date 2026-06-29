"use server";

import { requireKajurJurusan } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

function buildPayload(formData: FormData) {
  return {
    judul: String(formData.get("judul") ?? "").trim(),
    deskripsi: String(formData.get("deskripsi") ?? "").trim() || null,
    tingkat: Number(formData.get("tingkat") ?? 0) || null,
    urutan: Number(formData.get("urutan") ?? 0) || null,
    syarat_lulus: Number(formData.get("syarat_lulus") ?? 75) || 75,
    aktif: formData.get("aktif") === "on",
  };
}

export async function createKompetensi(formData: FormData): Promise<ActionResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();
  const payload = buildPayload(formData);

  if (!payload.judul) return { success: false, message: "Judul kompetensi wajib diisi." };

  const { error } = await supabase
    .from("kompetensi")
    .insert({ ...payload, id_jurusan: profile.id_jurusan, dibuat_oleh: profile.id_profile });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil ditambahkan." };
}

export async function updateKompetensi(formData: FormData): Promise<ActionResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();
  const id = String(formData.get("id_kompetensi") ?? "");
  const payload = buildPayload(formData);

  if (!id || !payload.judul) return { success: false, message: "Data tidak lengkap." };

  const { error } = await supabase
    .from("kompetensi")
    .update(payload)
    .eq("id_kompetensi", id)
    .eq("id_jurusan", profile.id_jurusan);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil diubah." };
}

export async function deleteKompetensi(formData: FormData): Promise<ActionResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();
  const id = String(formData.get("id_kompetensi") ?? "");
  const { error } = await supabase
    .from("kompetensi")
    .delete()
    .eq("id_kompetensi", id)
    .eq("id_jurusan", profile.id_jurusan);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil dihapus." };
}
