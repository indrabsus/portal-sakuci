"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

export async function createTahunAjaran(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const nama = String(formData.get("nama_tahun_ajaran") ?? "").trim();
  const semester = String(formData.get("semester") ?? "");
  const aktif = formData.get("aktif") === "on";

  if (!nama || !semester) return { success: false, message: "Nama dan semester wajib diisi." };

  if (aktif) {
    await supabase.from("tahun_ajaran").update({ aktif: false }).eq("aktif", true);
  }

  const { error } = await supabase.from("tahun_ajaran").insert({ nama_tahun_ajaran: nama, semester, aktif });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil ditambahkan." };
}

export async function updateTahunAjaran(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const id = String(formData.get("id_tahun_ajaran") ?? "");
  const nama = String(formData.get("nama_tahun_ajaran") ?? "").trim();
  const semester = String(formData.get("semester") ?? "");
  const aktif = formData.get("aktif") === "on";

  if (!id || !nama || !semester) return { success: false, message: "Data tidak lengkap." };

  if (aktif) {
    await supabase.from("tahun_ajaran").update({ aktif: false }).neq("id_tahun_ajaran", id);
  }

  const { error } = await supabase
    .from("tahun_ajaran")
    .update({ nama_tahun_ajaran: nama, semester, aktif })
    .eq("id_tahun_ajaran", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil diubah." };
}

export async function deleteTahunAjaran(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id_tahun_ajaran") ?? "");
  const { error } = await supabase.from("tahun_ajaran").delete().eq("id_tahun_ajaran", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil dihapus." };
}
