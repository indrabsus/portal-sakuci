"use server";

import { requireRole, type Role } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { OpsiJawaban } from "./types";

type ActionResult = { success: boolean; message: string };

const STAFF_ROLES: Role[] = ["admin", "kajur", "guru"];

function parseOpsi(formData: FormData): OpsiJawaban[] {
  const raw = String(formData.get("opsi_json") ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export async function createBankSoal(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(STAFF_ROLES);
  const supabase = await createClient();

  const pertanyaan = String(formData.get("pertanyaan") ?? "").trim();
  const tipeSoal = String(formData.get("tipe_soal") ?? "pg");
  const idMapel = String(formData.get("id_mapel") ?? "") || null;
  const tingkatKesulitan = String(formData.get("tingkat_kesulitan") ?? "") || null;
  const pembahasan = String(formData.get("pembahasan") ?? "").trim() || null;
  const gambarUrl = String(formData.get("gambar_url") ?? "").trim() || null;
  const audioUrl = String(formData.get("audio_url") ?? "").trim() || null;

  if (!pertanyaan) return { success: false, message: "Pertanyaan wajib diisi." };

  const idGuru = profile.role === "guru" ? profile.id_guru : null;

  const { data: soal, error } = await supabase
    .from("bank_soal")
    .insert({
      pertanyaan,
      tipe_soal: tipeSoal,
      id_mapel: idMapel,
      tingkat_kesulitan: tingkatKesulitan,
      pembahasan,
      gambar_url: gambarUrl,
      audio_url: audioUrl,
      id_guru: idGuru,
    })
    .select("id_soal")
    .single();

  if (error || !soal) return { success: false, message: error?.message ?? "Gagal menyimpan soal." };

  if (tipeSoal === "pg") {
    const opsi = parseOpsi(formData);
    if (opsi.length < 2) {
      await supabase.from("bank_soal").delete().eq("id_soal", soal.id_soal);
      return { success: false, message: "Soal pilihan ganda butuh minimal 2 opsi jawaban." };
    }
    if (!opsi.some((o) => o.is_benar)) {
      await supabase.from("bank_soal").delete().eq("id_soal", soal.id_soal);
      return { success: false, message: "Tentukan satu opsi jawaban yang benar." };
    }

    const { error: opsiError } = await supabase.from("opsi_jawaban").insert(
      opsi.map((o) => ({
        id_soal: soal.id_soal,
        label: o.label,
        isi_opsi: o.isi_opsi,
        is_benar: o.is_benar,
        gambar_url: o.gambar_url || null,
      })),
    );
    if (opsiError) {
      await supabase.from("bank_soal").delete().eq("id_soal", soal.id_soal);
      return { success: false, message: opsiError.message };
    }
  }

  return { success: true, message: "Soal berhasil ditambahkan." };
}

export async function updateBankSoal(formData: FormData): Promise<ActionResult> {
  await requireRole(STAFF_ROLES);
  const supabase = await createClient();

  const idSoal = String(formData.get("id_soal") ?? "");
  const pertanyaan = String(formData.get("pertanyaan") ?? "").trim();
  const tipeSoal = String(formData.get("tipe_soal") ?? "pg");
  const idMapel = String(formData.get("id_mapel") ?? "") || null;
  const tingkatKesulitan = String(formData.get("tingkat_kesulitan") ?? "") || null;
  const pembahasan = String(formData.get("pembahasan") ?? "").trim() || null;
  const gambarUrl = String(formData.get("gambar_url") ?? "").trim() || null;
  const audioUrl = String(formData.get("audio_url") ?? "").trim() || null;

  if (!idSoal || !pertanyaan) return { success: false, message: "Data tidak lengkap." };

  if (tipeSoal === "pg") {
    const opsi = parseOpsi(formData);
    if (opsi.length < 2) return { success: false, message: "Soal pilihan ganda butuh minimal 2 opsi jawaban." };
    if (!opsi.some((o) => o.is_benar)) return { success: false, message: "Tentukan satu opsi jawaban yang benar." };
  }

  const { error } = await supabase
    .from("bank_soal")
    .update({
      pertanyaan,
      tipe_soal: tipeSoal,
      id_mapel: idMapel,
      tingkat_kesulitan: tingkatKesulitan,
      pembahasan,
      gambar_url: gambarUrl,
      audio_url: audioUrl,
    })
    .eq("id_soal", idSoal);

  if (error) return { success: false, message: error.message };

  await supabase.from("opsi_jawaban").delete().eq("id_soal", idSoal);

  if (tipeSoal === "pg") {
    const opsi = parseOpsi(formData);
    const { error: opsiError } = await supabase.from("opsi_jawaban").insert(
      opsi.map((o) => ({
        id_soal: idSoal,
        label: o.label,
        isi_opsi: o.isi_opsi,
        is_benar: o.is_benar,
        gambar_url: o.gambar_url || null,
      })),
    );
    if (opsiError) return { success: false, message: opsiError.message };
  }

  return { success: true, message: "Soal berhasil diubah." };
}

export async function deleteBankSoal(formData: FormData): Promise<ActionResult> {
  await requireRole(STAFF_ROLES);
  const supabase = await createClient();
  const idSoal = String(formData.get("id_soal") ?? "");

  await supabase.from("opsi_jawaban").delete().eq("id_soal", idSoal);
  const { error } = await supabase.from("bank_soal").delete().eq("id_soal", idSoal);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Soal berhasil dihapus." };
}

export async function getOpsiForSoal(idSoal: string): Promise<OpsiJawaban[]> {
  await requireRole(STAFF_ROLES);
  const supabase = await createClient();
  const { data } = await supabase
    .from("opsi_jawaban")
    .select("id_opsi, label, isi_opsi, is_benar, gambar_url")
    .eq("id_soal", idSoal)
    .order("label");
  return data ?? [];
}
