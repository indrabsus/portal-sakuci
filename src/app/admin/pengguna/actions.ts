"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export type UserRow = {
  id_profile: string;
  nama_lengkap: string | null;
  email: string | null;
  role: string;
  aktif: boolean;
};

const EXCLUDED_ROLES = ["guru", "siswa"]; // punya halaman sendiri

export async function getUsers(): Promise<UserRow[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id_profile, nama_lengkap, email, aktif, roles(nama_role)")
    .order("nama_lengkap");

  return (data ?? [])
    .map((p) => ({
      id_profile: p.id_profile,
      nama_lengkap: p.nama_lengkap,
      email: p.email,
      role: (p.roles as unknown as { nama_role: string } | null)?.nama_role ?? "",
      aktif: p.aktif ?? true,
    }))
    .filter((p) => !EXCLUDED_ROLES.includes(p.role));
}

export async function getRoles(): Promise<{ id_role: number; nama_role: string }[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("roles")
    .select("id_role, nama_role")
    .not("nama_role", "in", `(${EXCLUDED_ROLES.map((r) => `"${r}"`).join(",")})`)
    .order("nama_role");
  return data ?? [];
}

function validateUsername(username: string) {
  if (!username || username.length < 3) return "Username minimal 3 karakter.";
  if (!/^[a-z0-9_.]{3,30}$/.test(username))
    return "Username hanya boleh huruf kecil, angka, titik, atau underscore.";
  return null;
}

export async function createUserAction(formData: FormData) {
  const nama = String(formData.get("nama_lengkap") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const idRole = Number(formData.get("id_role"));
  const password = String(formData.get("password") ?? "");

  if (!nama || !username || !idRole || !password)
    return { success: false, message: "Semua field wajib diisi." };
  if (password.length < 6)
    return { success: false, message: "Password minimal 6 karakter." };
  const errU = validateUsername(username);
  if (errU) return { success: false, message: errU };

  const email = `${username}@sakuci.id`;
  const admin = createAdminClient();

  // Cek username sudah dipakai
  const { data: exist } = await admin
    .from("profiles")
    .select("id_profile")
    .eq("email", email)
    .maybeSingle();
  if (exist) return { success: false, message: `Username "${username}" sudah digunakan.` };

  const { data: created, error: authErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authErr || !created.user)
    return { success: false, message: "Gagal membuat akun. Coba username lain." };

  const { error: profileErr } = await admin.from("profiles").upsert(
    { id_profile: created.user.id, id_role: idRole, nama_lengkap: nama, email, aktif: true },
    { onConflict: "id_profile" }
  );
  if (profileErr) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { success: false, message: "Gagal simpan profil: " + profileErr.message };
  }

  revalidatePath("/admin/pengguna");
  return { success: true, message: `Akun ${nama} berhasil dibuat.` };
}

export async function updateUserAction(formData: FormData) {
  const id = String(formData.get("id_profile") ?? "");
  const nama = String(formData.get("nama_lengkap") ?? "").trim();
  const idRole = Number(formData.get("id_role"));

  if (!id || !nama || !idRole)
    return { success: false, message: "Data tidak lengkap." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ nama_lengkap: nama, id_role: idRole })
    .eq("id_profile", id);

  if (error) return { success: false, message: error.message };
  revalidatePath("/admin/pengguna");
  return { success: true, message: "Profil diperbarui." };
}

export async function resetPasswordAction(formData: FormData) {
  const id = String(formData.get("id_profile") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!id || !password) return { success: false, message: "Data tidak lengkap." };
  if (password.length < 6) return { success: false, message: "Password minimal 6 karakter." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(id, { password });
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin/pengguna");
  return { success: true, message: "Password berhasil direset." };
}

export async function toggleAktifAction(id: string, aktif: boolean) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ aktif })
    .eq("id_profile", id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin/pengguna");
  return { success: true, message: aktif ? "Akun diaktifkan." : "Akun dinonaktifkan." };
}

export async function deleteUserAction(id: string) {
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin/pengguna");
  return { success: true, message: "Akun dihapus permanen." };
}
