"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

export async function updateInformasiSekolah(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const id = String(formData.get("id_sekolah") ?? "");
  const payload = {
    nama_sekolah: String(formData.get("nama_sekolah") ?? "").trim(),
    alamat: String(formData.get("alamat") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    instagram: String(formData.get("instagram") ?? "").trim() || null,
    no_telepon: String(formData.get("no_telepon") ?? "").trim() || null,
    nama_kepala_sekolah: String(formData.get("nama_kepala_sekolah") ?? "").trim() || null,
    visi: String(formData.get("visi") ?? "").trim() || null,
    misi: String(formData.get("misi") ?? "").trim() || null,
  };

  if (!payload.nama_sekolah) return { success: false, message: "Nama sekolah wajib diisi." };

  const { error } = id
    ? await supabase.from("informasi_sekolah").update(payload).eq("id_sekolah", id)
    : await supabase.from("informasi_sekolah").insert(payload);

  if (error) return { success: false, message: error.message };
  return { success: true, message: "Informasi sekolah berhasil disimpan." };
}
