"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

export async function createGuru(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const nama = String(formData.get("nama_lengkap") ?? "").trim();
  const uidFp = String(formData.get("uid_fp") ?? "").trim();
  const noHp = String(formData.get("no_hp") ?? "").trim();
  const jenkel = String(formData.get("jenkel") ?? "");

  if (!nama || !uidFp || !noHp) return { success: false, message: "Nama, UID FP, dan No HP wajib diisi." };

  const { error } = await supabase
    .from("guru")
    .insert({ nama_lengkap: nama, uid_fp: uidFp, no_hp: noHp, jenkel: jenkel || null });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil ditambahkan." };
}

export async function updateGuru(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const id = String(formData.get("id_guru") ?? "");
  const nama = String(formData.get("nama_lengkap") ?? "").trim();
  const uidFp = String(formData.get("uid_fp") ?? "").trim();
  const noHp = String(formData.get("no_hp") ?? "").trim();
  const jenkel = String(formData.get("jenkel") ?? "");

  if (!id || !nama || !uidFp || !noHp) return { success: false, message: "Data tidak lengkap." };

  const { error } = await supabase
    .from("guru")
    .update({ nama_lengkap: nama, uid_fp: uidFp, no_hp: noHp, jenkel: jenkel || null })
    .eq("id_guru", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil diubah." };
}

export async function deleteGuru(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id_guru") ?? "");
  const { error } = await supabase.from("guru").delete().eq("id_guru", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil dihapus." };
}
