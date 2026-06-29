"use server";

import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

export async function changePassword(formData: FormData): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile || !profile.email) return { success: false, message: "Sesi tidak valid. Silakan login ulang." };

  const passwordLama = String(formData.get("password_lama") ?? "");
  const passwordBaru = String(formData.get("password_baru") ?? "");
  const konfirmasiPassword = String(formData.get("konfirmasi_password") ?? "");

  if (!passwordLama || !passwordBaru || !konfirmasiPassword) {
    return { success: false, message: "Semua field wajib diisi." };
  }
  if (passwordBaru.length < 6) {
    return { success: false, message: "Password baru minimal 6 karakter." };
  }
  if (passwordBaru !== konfirmasiPassword) {
    return { success: false, message: "Konfirmasi password tidak sama." };
  }

  const supabase = await createClient();

  // Verifikasi password lama dengan re-autentikasi, supaya sesi yang dibajak
  // tidak bisa ganti password tanpa tahu password saat ini.
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password: passwordLama,
  });

  if (signInError) {
    return { success: false, message: "Password saat ini salah." };
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: passwordBaru });
  if (updateError) return { success: false, message: updateError.message };

  return { success: true, message: "Password berhasil diubah." };
}
