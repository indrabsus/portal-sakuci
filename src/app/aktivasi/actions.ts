"use server";

import { createAdminClient } from "@/lib/supabase/admin";

type ActionResult = { success: boolean; message: string };

const USERNAME_REGEX = /^[a-z0-9_.]{3,30}$/;
const DOMAIN = "sakuci.id";

function usernameToEmail(username: string) {
  return `${username}@${DOMAIN}`;
}

function validateUsername(username: string): string | null {
  if (!username) return "Username wajib diisi.";
  if (!USERNAME_REGEX.test(username))
    return "Username hanya boleh huruf kecil, angka, titik, atau underscore (3–30 karakter).";
  return null;
}

async function isUsernameTaken(admin: ReturnType<typeof createAdminClient>, username: string) {
  const email = usernameToEmail(username);
  const { data } = await admin.from("profiles").select("id_profile").eq("email", email).maybeSingle();
  return !!data;
}

export async function cekUsernameAction(username: string): Promise<{ ok: boolean; message: string }> {
  const trimmed = username.trim().toLowerCase();
  const err = validateUsername(trimmed);
  if (err) return { ok: false, message: err };
  const admin = createAdminClient();
  const taken = await isUsernameTaken(admin, trimmed);
  if (taken) return { ok: false, message: "Username sudah digunakan." };
  return { ok: true, message: "Username tersedia." };
}

async function getRoleId(admin: ReturnType<typeof createAdminClient>, namaRole: string) {
  const { data } = await admin.from("roles").select("id_role").eq("nama_role", namaRole).single();
  return data?.id_role as number | undefined;
}

export async function aktivasiGuruAction(formData: FormData): Promise<ActionResult> {
  const uidFp = String(formData.get("uid_fp") ?? "").trim();
  const noHp = String(formData.get("no_hp") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!uidFp || !noHp || !username || !password) {
    return { success: false, message: "Semua field wajib diisi." };
  }
  if (password.length < 6) {
    return { success: false, message: "Password minimal 6 karakter." };
  }
  const usernameErr = validateUsername(username);
  if (usernameErr) return { success: false, message: usernameErr };

  const email = usernameToEmail(username);
  const admin = createAdminClient();

  if (await isUsernameTaken(admin, username)) {
    return { success: false, message: `Username "${username}" sudah digunakan. Pilih username lain.` };
  }

  const { data: guru, error: guruError } = await admin
    .from("guru")
    .select("id_guru, nama_lengkap, uid_fp, no_hp")
    .eq("uid_fp", uidFp)
    .eq("no_hp", noHp)
    .single();

  if (guruError || !guru) {
    return { success: false, message: "Data UID dan No HP tidak ditemukan. Hubungi admin." };
  }

  const { data: existingAkun } = await admin
    .from("akun_guru")
    .select("id_akun_guru")
    .eq("id_guru", guru.id_guru)
    .maybeSingle();

  if (existingAkun) {
    return { success: false, message: "Akun untuk guru ini sudah pernah diaktivasi. Silakan login." };
  }

  const idRoleGuru = await getRoleId(admin, "guru");
  if (!idRoleGuru) {
    return { success: false, message: "Konfigurasi role guru tidak ditemukan." };
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    return { success: false, message: "Gagal membuat akun. Coba username lain." };
  }

  const { error: profileError } = await admin.from("profiles").upsert(
    {
      id_profile: created.user.id,
      id_role: idRoleGuru,
      nama_lengkap: guru.nama_lengkap,
      email,
      no_hp: noHp,
    },
    { onConflict: "id_profile" }
  );

  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { success: false, message: "Gagal menyimpan profil: " + profileError.message };
  }

  const { error: akunError } = await admin.from("akun_guru").insert({
    id_guru: guru.id_guru,
    id_profile: created.user.id,
  });

  if (akunError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { success: false, message: "Gagal menautkan akun guru: " + akunError.message };
  }

  return { success: true, message: "Aktivasi berhasil. Silakan login." };
}

export async function aktivasiSiswaAction(formData: FormData): Promise<ActionResult> {
  const nisn = String(formData.get("nisn") ?? "").trim();
  const tanggalLahir = String(formData.get("tanggal_lahir") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!nisn || !tanggalLahir || !username || !password) {
    return { success: false, message: "Semua field wajib diisi." };
  }
  if (password.length < 6) {
    return { success: false, message: "Password minimal 6 karakter." };
  }
  const usernameErr = validateUsername(username);
  if (usernameErr) return { success: false, message: usernameErr };

  const email = usernameToEmail(username);
  const admin = createAdminClient();

  if (await isUsernameTaken(admin, username)) {
    return { success: false, message: `Username "${username}" sudah digunakan. Pilih username lain.` };
  }

  const { data: siswa, error: siswaError } = await admin
    .from("siswa")
    .select("id_siswa, nama_lengkap, nisn, tanggal_lahir, aktif")
    .eq("nisn", nisn)
    .eq("tanggal_lahir", tanggalLahir)
    .single();

  if (siswaError || !siswa) {
    return { success: false, message: "Data NISN dan Tanggal Lahir tidak ditemukan. Hubungi admin." };
  }

  if (siswa.aktif === false) {
    return { success: false, message: "Status siswa tidak aktif. Hubungi admin." };
  }

  const { data: existingAkun } = await admin
    .from("akun_siswa")
    .select("id_akun_siswa")
    .eq("id_siswa", siswa.id_siswa)
    .maybeSingle();

  if (existingAkun) {
    return { success: false, message: "Akun untuk siswa ini sudah pernah diaktivasi. Silakan login." };
  }

  const idRoleSiswa = await getRoleId(admin, "siswa");
  if (!idRoleSiswa) {
    return { success: false, message: "Konfigurasi role siswa tidak ditemukan." };
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    return { success: false, message: "Gagal membuat akun. Coba username lain." };
  }

  const { error: profileError } = await admin.from("profiles").upsert(
    {
      id_profile: created.user.id,
      id_role: idRoleSiswa,
      nama_lengkap: siswa.nama_lengkap,
      email,
    },
    { onConflict: "id_profile" }
  );

  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { success: false, message: "Gagal menyimpan profil: " + profileError.message };
  }

  const { error: akunError } = await admin.from("akun_siswa").insert({
    id_siswa: siswa.id_siswa,
    id_profile: created.user.id,
  });

  if (akunError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { success: false, message: "Gagal menautkan akun siswa: " + akunError.message };
  }

  return { success: true, message: "Aktivasi berhasil. Silakan login." };
}
