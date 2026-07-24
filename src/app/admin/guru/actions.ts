"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeWaNumber, sendWaMessage } from "@/lib/wa";
import { namaKeUsername, resolveUsernameBentrok, USERNAME_REGEX } from "@/lib/username";

type ActionResult = { success: boolean; message: string };

const SAKUCI_DOMAIN = "sakuci.id";
const PASSWORD_DEFAULT_GURU = "123456";

export interface SaranAktivasiGuru {
  id_guru: string;
  nama_lengkap: string;
  username_saran: string;
}

/** Hitung saran username (hindari bentrok dgn akun @sakuci.id yang sudah ada & sesama guru di batch ini). */
export async function getUsernameSaranGuru(
  daftar: { id_guru: string; nama_lengkap: string }[]
): Promise<SaranAktivasiGuru[]> {
  await requireRole(["admin"]);
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("profiles")
    .select("email")
    .ilike("email", `%@${SAKUCI_DOMAIN}`);

  const usedUsernames = new Set(
    (existing ?? []).map((p) => p.email.replace(`@${SAKUCI_DOMAIN}`, ""))
  );
  const usedInBatch = new Set<string>();

  return daftar.map((g) => {
    const base = namaKeUsername(g.nama_lengkap, "guru");
    let candidate = base;
    let i = 1;
    while (usedUsernames.has(candidate) || usedInBatch.has(candidate)) {
      candidate = `${base}${i}`;
      i++;
    }
    usedInBatch.add(candidate);

    return { id_guru: g.id_guru, nama_lengkap: g.nama_lengkap, username_saran: candidate };
  });
}

export interface HasilAktivasiGuru {
  id_guru: string;
  nama_lengkap: string;
  username: string;
  status: "berhasil" | "gagal";
  pesan?: string;
}

/** Aktivasi massal: buat akun Supabase Auth (password default) + profiles + akun_guru untuk guru terpilih. */
export async function aktivasiMassalGuru(
  items: { id_guru: string; username: string }[]
): Promise<HasilAktivasiGuru[]> {
  await requireRole(["admin"]);
  const admin = createAdminClient();
  const hasil: HasilAktivasiGuru[] = [];

  const { data: guruRows } = await admin
    .from("guru")
    .select("id_guru, nama_lengkap")
    .in("id_guru", items.map((i) => i.id_guru));
  const guruMap = new Map((guruRows ?? []).map((g) => [g.id_guru, g]));

  const { data: roleRow } = await admin
    .from("roles")
    .select("id_role")
    .eq("nama_role", "guru")
    .single();

  if (!roleRow?.id_role) {
    return items.map((item) => ({
      id_guru: item.id_guru,
      nama_lengkap: guruMap.get(item.id_guru)?.nama_lengkap ?? "-",
      username: item.username,
      status: "gagal" as const,
      pesan: "Konfigurasi role guru tidak ditemukan.",
    }));
  }

  for (const item of items) {
    const guru = guruMap.get(item.id_guru);
    const nama = guru?.nama_lengkap ?? "-";
    let username = item.username.trim().toLowerCase();

    if (!guru) {
      hasil.push({ id_guru: item.id_guru, nama_lengkap: nama, username, status: "gagal", pesan: "Data guru tidak ditemukan." });
      continue;
    }

    if (!USERNAME_REGEX.test(username)) {
      hasil.push({ id_guru: item.id_guru, nama_lengkap: nama, username, status: "gagal", pesan: "Format username tidak valid." });
      continue;
    }

    const { data: existingAkun } = await admin
      .from("akun_guru")
      .select("id_akun_guru")
      .eq("id_guru", item.id_guru)
      .maybeSingle();

    if (existingAkun) {
      hasil.push({ id_guru: item.id_guru, nama_lengkap: nama, username, status: "gagal", pesan: "Akun sudah aktif sebelumnya." });
      continue;
    }

    const resolved = await resolveUsernameBentrok(username, SAKUCI_DOMAIN, async (email) => {
      const { data } = await admin.from("profiles").select("id_profile").eq("email", email).maybeSingle();
      return !!data;
    });

    if (!resolved) {
      hasil.push({ id_guru: item.id_guru, nama_lengkap: nama, username, status: "gagal", pesan: `Username "${username}" bentrok dan gagal dibuatkan alternatif.` });
      continue;
    }
    username = resolved;
    const email = `${username}@${SAKUCI_DOMAIN}`;

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password: PASSWORD_DEFAULT_GURU,
      email_confirm: true,
    });

    if (createError || !created.user) {
      hasil.push({ id_guru: item.id_guru, nama_lengkap: nama, username, status: "gagal", pesan: createError?.message ?? "Gagal membuat akun." });
      continue;
    }

    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id_profile: created.user.id,
        id_role: roleRow.id_role,
        nama_lengkap: nama,
        email,
      },
      { onConflict: "id_profile" }
    );

    if (profileError) {
      await admin.auth.admin.deleteUser(created.user.id);
      hasil.push({ id_guru: item.id_guru, nama_lengkap: nama, username, status: "gagal", pesan: "Gagal menyimpan profil: " + profileError.message });
      continue;
    }

    const { error: akunError } = await admin.from("akun_guru").insert({
      id_guru: item.id_guru,
      id_profile: created.user.id,
    });

    if (akunError) {
      await admin.auth.admin.deleteUser(created.user.id);
      hasil.push({ id_guru: item.id_guru, nama_lengkap: nama, username, status: "gagal", pesan: "Gagal menautkan akun guru: " + akunError.message });
      continue;
    }

    hasil.push({ id_guru: item.id_guru, nama_lengkap: nama, username, status: "berhasil" });
  }

  return hasil;
}

export async function createGuru(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const nama = String(formData.get("nama_lengkap") ?? "").trim();
  const uidFp = String(formData.get("uid_fp") ?? "").trim();
  const noHp = String(formData.get("no_hp") ?? "").trim();
  const jenkel = String(formData.get("jenkel") ?? "");

  if (!nama || !uidFp || !noHp) return { success: false, message: "Nama, UID FP, dan No HP wajib diisi." };

  const { error } = await supabase
    .from("guru")
    .insert({ nama_lengkap: nama, uid_fp: uidFp, no_hp: noHp, jenkel: jenkel || null });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil ditambahkan." };
}

export async function updateGuru(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const id = String(formData.get("id_guru") ?? "");
  const nama = String(formData.get("nama_lengkap") ?? "").trim();
  const uidFp = String(formData.get("uid_fp") ?? "").trim();
  const noHp = String(formData.get("no_hp") ?? "").trim();
  const jenkel = String(formData.get("jenkel") ?? "");

  if (!id || !nama || !uidFp || !noHp) return { success: false, message: "Data tidak lengkap." };

  const { error } = await supabase
    .from("guru")
    .update({ nama_lengkap: nama, uid_fp: uidFp, no_hp: noHp, jenkel: jenkel || null })
    .eq("id_guru", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil diubah." };
}

export async function deleteGuru(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id_guru") ?? "");
  const { error } = await supabase.from("guru").delete().eq("id_guru", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil dihapus." };
}

export async function sendWaBulkGuru(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);

  const ids = String(formData.get("ids") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const pesan = String(formData.get("message") ?? "").trim();

  if (!ids.length || !pesan) {
    return { success: false, message: "Pilih guru dan isi pesan terlebih dahulu." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("guru").select("id_guru, no_hp").in("id_guru", ids);
  if (error) return { success: false, message: error.message };

  const nomorList = (data ?? [])
    .map((row) => normalizeWaNumber(String(row.no_hp ?? "")))
    .filter((value): value is string => Boolean(value));

  if (!nomorList.length) {
    return { success: false, message: "Tidak ada nomor HP yang valid untuk guru terpilih." };
  }

  const failures: string[] = [];

  for (const nomor of nomorList) {
    try {
      await sendWaMessage(nomor, pesan);
    } catch (error) {
      failures.push(error instanceof Error ? error.message : "Tidak diketahui");
    }
  }

  if (failures.length === nomorList.length) {
    return { success: false, message: failures.join(" | ") };
  }

  if (failures.length > 0) {
    return {
      success: true,
      message: `Berhasil mengirim WhatsApp ke ${nomorList.length - failures.length} guru. ${failures.length} gagal: ${failures.join(" | ")}`,
    };
  }

  return { success: true, message: `Berhasil mengirim WhatsApp ke ${nomorList.length} guru.` };
}
