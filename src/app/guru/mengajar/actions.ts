"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

export async function createMengajar(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(["guru"]);
  if (!profile.id_guru) return { success: false, message: "Akun guru tidak ditemukan." };
  const supabase = await createClient();

  const idMapel = String(formData.get("id_mapel") ?? "");
  const idKelas = String(formData.get("id_kelas") ?? "");
  const idTahunAjaran = String(formData.get("id_tahun_ajaran") ?? "");

  if (!idMapel || !idKelas || !idTahunAjaran) {
    return { success: false, message: "Mapel, kelas, dan tahun ajaran wajib dipilih." };
  }

  const { data: existing } = await supabase
    .from("mengajar")
    .select("id_mengajar")
    .eq("id_guru", profile.id_guru)
    .eq("id_mapel", idMapel)
    .eq("id_kelas", idKelas)
    .eq("id_tahun_ajaran", idTahunAjaran)
    .maybeSingle();

  if (existing) return { success: false, message: "Anda sudah mengajar mapel ini di kelas tersebut pada tahun ajaran ini." };

  const { error } = await supabase.from("mengajar").insert({
    id_guru: profile.id_guru,
    id_mapel: idMapel,
    id_kelas: idKelas,
    id_tahun_ajaran: idTahunAjaran,
    aktif: true,
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil ditambahkan." };
}

export async function hapusMengajar(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();
  const id = String(formData.get("id_mengajar") ?? "");

  const { error } = await supabase.from("mengajar").delete().eq("id_mengajar", id).eq("id_guru", profile.id_guru ?? "");
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil dihapus." };
}
