"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

export async function updateJurusanKajur(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const idProfile = String(formData.get("id_profile") ?? "");
  const idJurusan = String(formData.get("id_jurusan") ?? "") || null;

  if (!idProfile) return { success: false, message: "Data tidak valid." };

  const { error } = await supabase.from("profiles").update({ id_jurusan: idJurusan }).eq("id_profile", idProfile);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Jurusan Kajur berhasil diperbarui." };
}
