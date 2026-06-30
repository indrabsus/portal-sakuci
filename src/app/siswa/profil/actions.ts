"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

export async function updateFotoSiswa(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(["siswa"]);
  if (!profile.id_siswa) return { success: false, message: "Akun siswa tidak ditemukan." };
  const supabase = await createClient();

  const fotoUrl = String(formData.get("foto_url") ?? "").trim();
  if (!fotoUrl) return { success: false, message: "URL foto tidak valid." };

  const { error } = await supabase.from("siswa").update({ foto_url: fotoUrl }).eq("id_siswa", profile.id_siswa);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Foto profil berhasil diperbarui." };
}

export async function updateNoHpSiswa(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(["siswa"]);
  if (!profile.id_siswa) return { success: false, message: "Akun siswa tidak ditemukan." };
  const supabase = await createClient();

  const noHp = String(formData.get("no_hp") ?? "").trim();
  if (noHp && !/^[0-9+\-\s]{8,15}$/.test(noHp)) {
    return { success: false, message: "Format nomor HP tidak valid." };
  }

  const { error } = await supabase.from("siswa").update({ no_hp: noHp || null }).eq("id_siswa", profile.id_siswa);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Nomor HP berhasil diperbarui." };
}
