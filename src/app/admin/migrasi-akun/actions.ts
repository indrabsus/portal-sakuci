"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface AkunLama {
  id_profile: string;
  nama_lengkap: string | null;
  email_lama: string;
  username_saran: string;
  konflik: boolean;
}

export interface HasilMigrasi {
  id_profile: string;
  nama_lengkap: string | null;
  email_lama: string;
  email_baru: string;
  status: "berhasil" | "gagal";
  pesan?: string;
}

/** Buat username dari nama_lengkap: huruf kecil, spasi → titik, buang karakter non [a-z0-9_.] */
function namaKeUsername(nama: string | null): string {
  if (!nama) return "user";
  return nama
    .toLowerCase()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9_.]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 30) || "user";
}

/** Ambil semua akun yang belum @sakuci.id beserta saran username */
export async function getAkunBelumMigrasi(): Promise<AkunLama[]> {
  const admin = createAdminClient();

  const { data: profiles } = await admin
    .from("profiles")
    .select("id_profile, nama_lengkap, email")
    .not("email", "ilike", "%@sakuci.id")
    .order("nama_lengkap");

  if (!profiles?.length) return [];

  // Kumpulkan semua username yang sudah dipakai (@sakuci.id)
  const { data: existing } = await admin
    .from("profiles")
    .select("email")
    .ilike("email", "%@sakuci.id");

  const usedUsernames = new Set(
    (existing ?? []).map((p) => p.email.replace("@sakuci.id", ""))
  );

  const result: AkunLama[] = [];
  const usedInBatch = new Set<string>();

  for (const p of profiles) {
    let base = namaKeUsername(p.nama_lengkap);
    let candidate = base;
    let i = 1;
    while (usedUsernames.has(candidate) || usedInBatch.has(candidate)) {
      candidate = `${base}${i}`;
      i++;
    }
    usedInBatch.add(candidate);

    result.push({
      id_profile: p.id_profile,
      nama_lengkap: p.nama_lengkap,
      email_lama: p.email ?? "",
      username_saran: candidate,
      konflik: false,
    });
  }

  return result;
}

/** Jalankan migrasi untuk akun-akun yang dipilih */
export async function jalankanMigrasi(
  items: { id_profile: string; username: string }[]
): Promise<HasilMigrasi[]> {
  const admin = createAdminClient();
  const hasil: HasilMigrasi[] = [];

  // Ambil email lama untuk laporan
  const { data: profiles } = await admin
    .from("profiles")
    .select("id_profile, nama_lengkap, email")
    .in("id_profile", items.map((i) => i.id_profile));

  const profileMap = new Map((profiles ?? []).map((p) => [p.id_profile, p]));

  for (const item of items) {
    const profile = profileMap.get(item.id_profile);
    const emailBaru = `${item.username}@sakuci.id`;
    const emailLama = profile?.email ?? "";

    // Validasi username
    if (!/^[a-z0-9_.]{3,30}$/.test(item.username)) {
      hasil.push({
        id_profile: item.id_profile,
        nama_lengkap: profile?.nama_lengkap ?? null,
        email_lama: emailLama,
        email_baru: emailBaru,
        status: "gagal",
        pesan: "Format username tidak valid.",
      });
      continue;
    }

    // Cek konflik
    const { data: cek } = await admin
      .from("profiles")
      .select("id_profile")
      .eq("email", emailBaru)
      .neq("id_profile", item.id_profile)
      .maybeSingle();

    if (cek) {
      hasil.push({
        id_profile: item.id_profile,
        nama_lengkap: profile?.nama_lengkap ?? null,
        email_lama: emailLama,
        email_baru: emailBaru,
        status: "gagal",
        pesan: `Username "${item.username}" sudah dipakai akun lain.`,
      });
      continue;
    }

    // Update di Supabase Auth
    const { error: authErr } = await admin.auth.admin.updateUserById(item.id_profile, {
      email: emailBaru,
      email_confirm: true,
    });

    if (authErr) {
      hasil.push({
        id_profile: item.id_profile,
        nama_lengkap: profile?.nama_lengkap ?? null,
        email_lama: emailLama,
        email_baru: emailBaru,
        status: "gagal",
        pesan: authErr.message,
      });
      continue;
    }

    // Update di profiles
    await admin
      .from("profiles")
      .update({ email: emailBaru })
      .eq("id_profile", item.id_profile);

    hasil.push({
      id_profile: item.id_profile,
      nama_lengkap: profile?.nama_lengkap ?? null,
      email_lama: emailLama,
      email_baru: emailBaru,
      status: "berhasil",
    });
  }

  return hasil;
}
