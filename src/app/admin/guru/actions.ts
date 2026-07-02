"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

function normalizeWaNumber(value: string | null) {
  const digits = value?.replace(/\D/g, "") ?? "";
  if (!digits) return null;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  return digits;
}

async function sendWaMessage(nomor: string, pesan: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_WA?.trim();
  if (!apiBase) {
    throw new Error("Variabel NEXT_PUBLIC_API_WA belum diatur.");
  }

  const endpoint = `${apiBase.replace(/\/$/, "")}/notifuser`;
  const attempts = 2;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomor, pesan }),
        signal: controller.signal,
        cache: "no-store",
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`${response.status}${detail ? ` ${detail}` : ""}`.trim());
      }

      return;
    } catch (error) {
      if (attempt === attempts) {
        const message = error instanceof Error ? error.message : "Tidak diketahui";
        throw new Error(`Gagal mengirim ke ${nomor}: ${message}`);
      }
    } finally {
      clearTimeout(timeout);
    }
  }
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
