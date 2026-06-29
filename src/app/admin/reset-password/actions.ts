"use server";

import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

type ActionResult = { success: boolean; message: string };

export async function searchUserByEmail(formData: FormData) {
  await requireRole(["admin"]);
  const admin = createAdminClient();
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { found: false as const };

  const { data: profile } = await admin
    .from("profiles")
    .select("id_profile, nama_lengkap, email, roles(nama_role)")
    .eq("email", email)
    .single();

  if (!profile) return { found: false as const };

  return {
    found: true as const,
    id_profile: profile.id_profile as string,
    nama_lengkap: profile.nama_lengkap as string | null,
    email: profile.email as string | null,
    role: (profile.roles as unknown as { nama_role: string } | null)?.nama_role ?? "-",
  };
}

export async function resetPasswordAction(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const admin = createAdminClient();

  const idProfile = String(formData.get("id_profile") ?? "");
  const newPassword = String(formData.get("new_password") ?? "");

  if (!idProfile || !newPassword) return { success: false, message: "Data tidak lengkap." };
  if (newPassword.length < 6) return { success: false, message: "Password minimal 6 karakter." };

  const { error } = await admin.auth.admin.updateUserById(idProfile, { password: newPassword });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Password berhasil direset." };
}
