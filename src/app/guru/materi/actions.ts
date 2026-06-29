"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

async function ensureOwnMengajar(idMengajar: string, idGuru: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("mengajar").select("id_guru").eq("id_mengajar", idMengajar).single();
  return data?.id_guru === idGuru;
}

export async function createMateri(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const idMengajar = String(formData.get("id_mengajar") ?? "");
  const judul = String(formData.get("judul") ?? "").trim();
  const isi = String(formData.get("isi") ?? "").trim() || null;
  const fileUrl = String(formData.get("file_url") ?? "").trim() || null;

  if (!idMengajar || !judul) return { success: false, message: "Kelas/mapel dan judul wajib diisi." };
  if (!(await ensureOwnMengajar(idMengajar, profile.id_guru ?? ""))) {
    return { success: false, message: "Anda tidak mengajar kelas/mapel ini." };
  }

  const { error } = await supabase.from("materi").insert({ id_mengajar: idMengajar, judul, isi, file_url: fileUrl });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Materi berhasil dibagikan." };
}

export async function updateMateri(formData: FormData): Promise<ActionResult> {
  await requireRole(["guru"]);
  const supabase = await createClient();

  const id = String(formData.get("id_materi") ?? "");
  const judul = String(formData.get("judul") ?? "").trim();
  const isi = String(formData.get("isi") ?? "").trim() || null;
  const fileUrl = String(formData.get("file_url") ?? "").trim() || null;

  if (!id || !judul) return { success: false, message: "Data tidak lengkap." };

  const { error } = await supabase.from("materi").update({ judul, isi, file_url: fileUrl }).eq("id_materi", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Materi berhasil diubah." };
}

export async function deleteMateri(formData: FormData): Promise<ActionResult> {
  await requireRole(["guru"]);
  const supabase = await createClient();
  const id = String(formData.get("id_materi") ?? "");
  const { error } = await supabase.from("materi").delete().eq("id_materi", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Materi berhasil dihapus." };
}
