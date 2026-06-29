"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

export async function createMapel(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const nama = String(formData.get("nama_mapel") ?? "").trim();
  if (!nama) return { success: false, message: "Nama mapel wajib diisi." };
  const { error } = await supabase.from("mapel").insert({ nama_mapel: nama });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil ditambahkan." };
}

export async function updateMapel(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id_mapel") ?? "");
  const nama = String(formData.get("nama_mapel") ?? "").trim();
  if (!id || !nama) return { success: false, message: "Data tidak lengkap." };
  const { error } = await supabase.from("mapel").update({ nama_mapel: nama }).eq("id_mapel", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil diubah." };
}

export async function deleteMapel(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id_mapel") ?? "");
  const { error } = await supabase.from("mapel").delete().eq("id_mapel", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil dihapus." };
}
