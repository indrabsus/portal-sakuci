"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

export async function updateFotoGuru(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(["guru"]);
  if (!profile.id_guru) return { success: false, message: "Akun guru tidak ditemukan." };
  const supabase = await createClient();

  const fotoUrl = String(formData.get("foto_url") ?? "").trim();
  if (!fotoUrl) return { success: false, message: "URL foto tidak valid." };

  const { error } = await supabase.from("guru").update({ foto_url: fotoUrl }).eq("id_guru", profile.id_guru);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Foto profil berhasil diperbarui." };
}
