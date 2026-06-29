"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSiswaKelasInfo } from "@/lib/siswa";

type ActionResult = { success: boolean; message: string };

export async function createProject(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(["siswa"]);
  if (!profile.id_siswa) return { success: false, message: "Akun siswa tidak ditemukan." };
  const supabase = await createClient();

  const namaProject = String(formData.get("nama_project") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim() || null;
  const linkYoutube = String(formData.get("link_youtube") ?? "").trim() || null;

  if (!namaProject) return { success: false, message: "Nama project wajib diisi." };

  // Simpan kelas & tahun ajaran siswa saat ini sebagai snapshot, supaya
  // project lama tetap menampilkan kelas/tahun ajaran saat dibuat.
  const kelasInfo = await getSiswaKelasInfo(profile.id_siswa);

  const { error } = await supabase.from("project_siswa").insert({
    id_siswa: profile.id_siswa,
    nama_project: namaProject,
    deskripsi,
    link_youtube: linkYoutube,
    id_kelas: kelasInfo.id_kelas,
    id_tahun_ajaran: kelasInfo.id_tahun_ajaran,
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Project berhasil ditambahkan." };
}

export async function updateProject(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(["siswa"]);
  const supabase = await createClient();

  const id = String(formData.get("id_project") ?? "");
  const namaProject = String(formData.get("nama_project") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim() || null;
  const linkYoutube = String(formData.get("link_youtube") ?? "").trim() || null;

  if (!id || !namaProject) return { success: false, message: "Data tidak lengkap." };

  // Project yang diedit perlu di-ACC ulang oleh Kajur sebelum tampil di halaman publik.
  const { error } = await supabase
    .from("project_siswa")
    .update({ nama_project: namaProject, deskripsi, link_youtube: linkYoutube, status: "pending", catatan_kajur: null })
    .eq("id_project", id)
    .eq("id_siswa", profile.id_siswa ?? "");
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Project berhasil diubah dan menunggu ACC Kajur kembali." };
}

export async function deleteProject(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(["siswa"]);
  const supabase = await createClient();
  const id = String(formData.get("id_project") ?? "");

  const { error } = await supabase.from("project_siswa").delete().eq("id_project", id).eq("id_siswa", profile.id_siswa ?? "");
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Project berhasil dihapus." };
}
