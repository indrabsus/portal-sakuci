"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function deleteKonselingSesiAdmin(formData: FormData) {
  await requireRole(["admin"]);

  const idSesi = String(formData.get("id_sesi") ?? "").trim();
  if (!idSesi) {
    throw new Error("ID sesi tidak valid.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("konseling_sesi").delete().eq("id_sesi", idSesi);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/konseling");
  redirect("/admin/konseling");
}
