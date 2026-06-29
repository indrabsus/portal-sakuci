"use server";

import { requireKajurJurusan } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

export async function reviewProjectSiswa(formData: FormData): Promise<ActionResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();

  const idProject = String(formData.get("id_project") ?? "");
  const status = String(formData.get("status") ?? "");
  const catatan = String(formData.get("catatan_kajur") ?? "").trim() || null;

  if (!idProject || !["approved", "rejected"].includes(status)) {
    return { success: false, message: "Data tidak valid." };
  }

  const { error } = await supabase
    .from("project_siswa")
    .update({
      status,
      catatan_kajur: catatan,
      direview_oleh: profile.id_profile,
      direview_at: new Date().toISOString(),
    })
    .eq("id_project", idProject);

  if (error) return { success: false, message: error.message };
  return { success: true, message: status === "approved" ? "Project disetujui dan akan tampil di halaman publik." : "Project ditolak." };
}
