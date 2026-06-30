"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const idTahunAjaran = String(formData.get("id_tahun_ajaran") ?? "");

  if (!email || !password || !idTahunAjaran) {
    redirect("/login?error=field_kosong");
  }

  const supabase = await createClient();
  const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/login?error=login_gagal");
  }

  if (signInData.user) {
    await supabase.from("log_aktivitas").insert({
      id_user: signInData.user.id,
      aktivitas: "login",
    });
  }

  const cookieStore = await cookies();
  cookieStore.set("ta_aktif", idTahunAjaran, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  const profile = await getCurrentProfile();
  redirect(profile ? `/${profile.role}/dashboard` : "/");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
