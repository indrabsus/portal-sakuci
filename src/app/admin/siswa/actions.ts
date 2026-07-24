"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getWaStatus, normalizeWaNumber, sendWaMessage } from "@/lib/wa";
import { namaKeUsername, resolveUsernameBentrok, USERNAME_REGEX } from "@/lib/username";

type ActionResult = { success: boolean; message: string };

const SAKUCI_DOMAIN = "sakuci.id";
const PASSWORD_DEFAULT_SISWA = "123456";

function buildSiswaPayload(formData: FormData) {
  return {
    nama_lengkap: String(formData.get("nama_lengkap") ?? "").trim(),
    nisn: String(formData.get("nisn") ?? "").trim(),
    jenkel: String(formData.get("jenkel") ?? "") || null,
    tempat_lahir: String(formData.get("tempat_lahir") ?? "").trim() || null,
    tanggal_lahir: String(formData.get("tanggal_lahir") ?? "") || null,
    agama: String(formData.get("agama") ?? "").trim() || null,
    aktif: formData.get("aktif") === "on",
  };
}

export async function createSiswa(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const payload = buildSiswaPayload(formData);

  if (!payload.nama_lengkap || !payload.nisn || !payload.tanggal_lahir) {
    return { success: false, message: "Nama, NISN, dan Tanggal Lahir wajib diisi." };
  }

  const { error } = await supabase.from("siswa").insert(payload);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil ditambahkan." };
}

export async function updateSiswa(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id_siswa") ?? "");
  const payload = buildSiswaPayload(formData);

  if (!id || !payload.nama_lengkap || !payload.nisn || !payload.tanggal_lahir) {
    return { success: false, message: "Data tidak lengkap." };
  }

  const { error } = await supabase.from("siswa").update(payload).eq("id_siswa", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil diubah." };
}

export async function deleteSiswa(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id_siswa") ?? "");
  const { error } = await supabase.from("siswa").delete().eq("id_siswa", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil dihapus." };
}

export async function deleteSiswaBulk(ids: string[]): Promise<ActionResult> {
  await requireRole(["admin"]);
  if (!ids.length) return { success: false, message: "Tidak ada siswa dipilih." };

  const supabase = await createClient();
  const { error } = await supabase.from("siswa").delete().in("id_siswa", ids);
  if (error) return { success: false, message: error.message };
  return { success: true, message: `Berhasil menghapus ${ids.length} siswa.` };
}

export async function sendWaBulkSiswa(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);

  const ids = String(formData.get("ids") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const pesan = String(formData.get("message") ?? "").trim();

  if (!ids.length || !pesan) {
    return { success: false, message: "Pilih siswa dan isi pesan terlebih dahulu." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("siswa").select("id_siswa, no_hp").in("id_siswa", ids);
  if (error) return { success: false, message: error.message };

  const nomorList = (data ?? [])
    .map((row) => normalizeWaNumber(String(row.no_hp ?? "")))
    .filter((value): value is string => Boolean(value));

  if (!nomorList.length) {
    return { success: false, message: "Tidak ada nomor HP yang valid untuk siswa terpilih." };
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
      message: `Berhasil mengirim WhatsApp ke ${nomorList.length - failures.length} siswa. ${failures.length} gagal: ${failures.join(" | ")}`,
    };
  }

  return { success: true, message: `Berhasil mengirim WhatsApp ke ${nomorList.length} siswa.` };
}

export async function getWaStatusAction(): Promise<boolean> {
  await requireRole(["admin"]);
  return getWaStatus();
}

export async function updateStatusSiswaBulk(ids: string[], aktif: boolean): Promise<ActionResult> {
  await requireRole(["admin"]);
  if (!ids.length) return { success: false, message: "Tidak ada siswa dipilih." };

  const supabase = await createClient();
  const { error } = await supabase.from("siswa").update({ aktif }).in("id_siswa", ids);
  if (error) return { success: false, message: error.message };
  return {
    success: true,
    message: `Berhasil mengubah status ${ids.length} siswa menjadi ${aktif ? "Aktif" : "Tidak Aktif"}.`,
  };
}

export type ImportSiswaRow = {
  baris: number;
  nama_lengkap: string;
  nisn: string;
  tanggal_lahir: string;
  tempat_lahir: string | null;
  jenkel: string | null;
  agama: string | null;
  no_hp: string | null;
  aktif: boolean;
};

export interface HasilImportSiswa {
  baris: number;
  nama_lengkap: string;
  status: "berhasil" | "gagal";
  pesan?: string;
}

export async function importSiswaBulk(rows: ImportSiswaRow[]): Promise<HasilImportSiswa[]> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const hasil: HasilImportSiswa[] = [];

  for (const { baris, ...payload } of rows) {
    const { error } = await supabase.from("siswa").insert(payload);
    hasil.push({
      baris,
      nama_lengkap: payload.nama_lengkap,
      status: error ? "gagal" : "berhasil",
      pesan: error?.message,
    });
  }

  return hasil;
}

export async function resetPasswordSiswa(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const admin = createAdminClient();

  const idProfile = String(formData.get("id_profile") ?? "");
  const nisn = String(formData.get("nisn") ?? "").trim();

  if (!idProfile || !nisn) return { success: false, message: "Data tidak lengkap." };
  if (nisn.length < 6) return { success: false, message: "NISN terlalu pendek untuk dijadikan password (min. 6 karakter)." };

  const { error } = await admin.auth.admin.updateUserById(idProfile, { password: nisn });
  if (error) return { success: false, message: error.message };
  return { success: true, message: `Password berhasil direset ke NISN (${nisn}).` };
}

export interface SaranAktivasiSiswa {
  id_siswa: string;
  nama_lengkap: string;
  username_saran: string;
}

/** Hitung saran username (hindari bentrok dgn akun @sakuci.id yang sudah ada & sesama siswa di batch ini). */
export async function getUsernameSaranSiswa(
  daftar: { id_siswa: string; nama_lengkap: string }[]
): Promise<SaranAktivasiSiswa[]> {
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

  return daftar.map((s) => {
    const base = namaKeUsername(s.nama_lengkap, "sis");
    let candidate = base;
    let i = 1;
    while (usedUsernames.has(candidate) || usedInBatch.has(candidate)) {
      candidate = `${base}${i}`;
      i++;
    }
    usedInBatch.add(candidate);

    return { id_siswa: s.id_siswa, nama_lengkap: s.nama_lengkap, username_saran: candidate };
  });
}

export interface HasilAktivasiSiswa {
  id_siswa: string;
  nama_lengkap: string;
  username: string;
  status: "berhasil" | "gagal";
  pesan?: string;
}

/** Aktivasi massal: buat akun Supabase Auth (password default) + profiles + akun_siswa untuk siswa terpilih. */
export async function aktivasiMassalSiswa(
  items: { id_siswa: string; username: string }[]
): Promise<HasilAktivasiSiswa[]> {
  await requireRole(["admin"]);
  const admin = createAdminClient();
  const hasil: HasilAktivasiSiswa[] = [];

  const { data: siswaRows } = await admin
    .from("siswa")
    .select("id_siswa, nama_lengkap")
    .in("id_siswa", items.map((i) => i.id_siswa));
  const siswaMap = new Map((siswaRows ?? []).map((s) => [s.id_siswa, s]));

  const { data: roleRow } = await admin
    .from("roles")
    .select("id_role")
    .eq("nama_role", "siswa")
    .single();

  if (!roleRow?.id_role) {
    return items.map((item) => ({
      id_siswa: item.id_siswa,
      nama_lengkap: siswaMap.get(item.id_siswa)?.nama_lengkap ?? "-",
      username: item.username,
      status: "gagal" as const,
      pesan: "Konfigurasi role siswa tidak ditemukan.",
    }));
  }

  for (const item of items) {
    const siswa = siswaMap.get(item.id_siswa);
    const nama = siswa?.nama_lengkap ?? "-";
    let username = item.username.trim().toLowerCase();

    if (!siswa) {
      hasil.push({ id_siswa: item.id_siswa, nama_lengkap: nama, username, status: "gagal", pesan: "Data siswa tidak ditemukan." });
      continue;
    }

    if (!USERNAME_REGEX.test(username)) {
      hasil.push({ id_siswa: item.id_siswa, nama_lengkap: nama, username, status: "gagal", pesan: "Format username tidak valid." });
      continue;
    }

    const { data: existingAkun } = await admin
      .from("akun_siswa")
      .select("id_akun_siswa")
      .eq("id_siswa", item.id_siswa)
      .maybeSingle();

    if (existingAkun) {
      hasil.push({ id_siswa: item.id_siswa, nama_lengkap: nama, username, status: "gagal", pesan: "Akun sudah aktif sebelumnya." });
      continue;
    }

    const resolved = await resolveUsernameBentrok(username, SAKUCI_DOMAIN, async (email) => {
      const { data } = await admin.from("profiles").select("id_profile").eq("email", email).maybeSingle();
      return !!data;
    });

    if (!resolved) {
      hasil.push({ id_siswa: item.id_siswa, nama_lengkap: nama, username, status: "gagal", pesan: `Username "${username}" bentrok dan gagal dibuatkan alternatif.` });
      continue;
    }
    username = resolved;
    const email = `${username}@${SAKUCI_DOMAIN}`;

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password: PASSWORD_DEFAULT_SISWA,
      email_confirm: true,
    });

    if (createError || !created.user) {
      hasil.push({ id_siswa: item.id_siswa, nama_lengkap: nama, username, status: "gagal", pesan: createError?.message ?? "Gagal membuat akun." });
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
      hasil.push({ id_siswa: item.id_siswa, nama_lengkap: nama, username, status: "gagal", pesan: "Gagal menyimpan profil: " + profileError.message });
      continue;
    }

    const { error: akunError } = await admin.from("akun_siswa").insert({
      id_siswa: item.id_siswa,
      id_profile: created.user.id,
    });

    if (akunError) {
      await admin.auth.admin.deleteUser(created.user.id);
      hasil.push({ id_siswa: item.id_siswa, nama_lengkap: nama, username, status: "gagal", pesan: "Gagal menautkan akun siswa: " + akunError.message });
      continue;
    }

    hasil.push({ id_siswa: item.id_siswa, nama_lengkap: nama, username, status: "berhasil" });
  }

  return hasil;
}
