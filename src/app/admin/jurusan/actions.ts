"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

export async function createJurusan(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const kode = String(formData.get("kode_jurusan") ?? "").trim();
  const nama = String(formData.get("nama_jurusan") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim() || null;
  const aktif = formData.get("aktif") === "on";

  if (!kode || !nama) return { success: false, message: "Kode dan nama wajib diisi." };

  const { error } = await supabase.from("jurusan").insert({ kode_jurusan: kode, nama_jurusan: nama, deskripsi, aktif });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil ditambahkan." };
}

export async function updateJurusan(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const id = String(formData.get("id_jurusan") ?? "");
  const kode = String(formData.get("kode_jurusan") ?? "").trim();
  const nama = String(formData.get("nama_jurusan") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim() || null;
  const aktif = formData.get("aktif") === "on";

  if (!id || !kode || !nama) return { success: false, message: "Data tidak lengkap." };

  const { error } = await supabase
    .from("jurusan")
    .update({ kode_jurusan: kode, nama_jurusan: nama, deskripsi, aktif })
    .eq("id_jurusan", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil diubah." };
}

export async function deleteJurusan(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id_jurusan") ?? "");
  const { error } = await supabase.from("jurusan").delete().eq("id_jurusan", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil dihapus." };
}
