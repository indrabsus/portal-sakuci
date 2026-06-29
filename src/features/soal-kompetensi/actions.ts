"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { OpsiJawabanKompetensi, SoalKompetensiRow } from "./types";

type ActionResult = { success: boolean; message: string };

function parseOpsi(formData: FormData): OpsiJawabanKompetensi[] {
  const raw = String(formData.get("opsi_json") ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function createSoalKompetensi(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(["kajur"]);
  const supabase = await createClient();

  const pertanyaan = String(formData.get("pertanyaan") ?? "").trim();
  const tipeSoal = String(formData.get("tipe_soal") ?? "pg");
  const idJurusan = String(formData.get("id_jurusan") ?? "") || null;
  const tingkatKesulitan = String(formData.get("tingkat_kesulitan") ?? "") || null;
  const pembahasan = String(formData.get("pembahasan") ?? "").trim() || null;
  const gambarUrl = String(formData.get("gambar_url") ?? "").trim() || null;
  const fileUrl = String(formData.get("file_url") ?? "").trim() || null;

  if (!pertanyaan) return { success: false, message: "Pertanyaan wajib diisi." };

  const { data: soal, error } = await supabase
    .from("soal_kompetensi")
    .insert({
      pertanyaan,
      tipe_soal: tipeSoal,
      id_jurusan: idJurusan,
      tingkat_kesulitan: tingkatKesulitan,
      pembahasan,
      gambar_url: gambarUrl,
      file_url: fileUrl,
      dibuat_oleh: profile.id_profile,
    })
    .select("id_soal_kompetensi")
    .single();

  if (error || !soal) return { success: false, message: error?.message ?? "Gagal menyimpan soal." };

  if (tipeSoal === "pg") {
    const opsi = parseOpsi(formData);
    if (opsi.length < 2 || !opsi.some((o) => o.is_benar)) {
      await supabase.from("soal_kompetensi").delete().eq("id_soal_kompetensi", soal.id_soal_kompetensi);
      return { success: false, message: "Soal pilihan ganda butuh minimal 2 opsi dan satu jawaban benar." };
    }
    const { error: opsiError } = await supabase.from("opsi_jawaban_kompetensi").insert(
      opsi.map((o) => ({
        id_soal_kompetensi: soal.id_soal_kompetensi,
        label: o.label,
        isi_opsi: o.isi_opsi,
        is_benar: o.is_benar,
        gambar_url: o.gambar_url || null,
      })),
    );
    if (opsiError) {
      await supabase.from("soal_kompetensi").delete().eq("id_soal_kompetensi", soal.id_soal_kompetensi);
      return { success: false, message: opsiError.message };
    }
  }

  return { success: true, message: "Soal kompetensi berhasil ditambahkan." };
}

export async function updateSoalKompetensi(formData: FormData): Promise<ActionResult> {
  await requireRole(["kajur"]);
  const supabase = await createClient();

  const id = String(formData.get("id_soal_kompetensi") ?? "");
  const pertanyaan = String(formData.get("pertanyaan") ?? "").trim();
  const tipeSoal = String(formData.get("tipe_soal") ?? "pg");
  const idJurusan = String(formData.get("id_jurusan") ?? "") || null;
  const tingkatKesulitan = String(formData.get("tingkat_kesulitan") ?? "") || null;
  const pembahasan = String(formData.get("pembahasan") ?? "").trim() || null;
  const gambarUrl = String(formData.get("gambar_url") ?? "").trim() || null;
  const fileUrl = String(formData.get("file_url") ?? "").trim() || null;

  if (!id || !pertanyaan) return { success: false, message: "Data tidak lengkap." };

  if (tipeSoal === "pg") {
    const opsi = parseOpsi(formData);
    if (opsi.length < 2 || !opsi.some((o) => o.is_benar)) {
      return { success: false, message: "Soal pilihan ganda butuh minimal 2 opsi dan satu jawaban benar." };
    }
  }

  const { error } = await supabase
    .from("soal_kompetensi")
    .update({
      pertanyaan,
      tipe_soal: tipeSoal,
      id_jurusan: idJurusan,
      tingkat_kesulitan: tingkatKesulitan,
      pembahasan,
      gambar_url: gambarUrl,
      file_url: fileUrl,
    })
    .eq("id_soal_kompetensi", id);

  if (error) return { success: false, message: error.message };

  await supabase.from("opsi_jawaban_kompetensi").delete().eq("id_soal_kompetensi", id);

  if (tipeSoal === "pg") {
    const opsi = parseOpsi(formData);
    const { error: opsiError } = await supabase.from("opsi_jawaban_kompetensi").insert(
      opsi.map((o) => ({
        id_soal_kompetensi: id,
        label: o.label,
        isi_opsi: o.isi_opsi,
        is_benar: o.is_benar,
        gambar_url: o.gambar_url || null,
      })),
    );
    if (opsiError) return { success: false, message: opsiError.message };
  }

  return { success: true, message: "Soal kompetensi berhasil diubah." };
}

export async function deleteSoalKompetensi(formData: FormData): Promise<ActionResult> {
  await requireRole(["kajur"]);
  const supabase = await createClient();
  const id = String(formData.get("id_soal_kompetensi") ?? "");

  await supabase.from("opsi_jawaban_kompetensi").delete().eq("id_soal_kompetensi", id);
  const { error } = await supabase.from("soal_kompetensi").delete().eq("id_soal_kompetensi", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Soal kompetensi berhasil dihapus." };
}

export async function listSoalKompetensi(): Promise<SoalKompetensiRow[]> {
  await requireRole(["kajur"]);
  const supabase = await createClient();
  const { data } = await supabase
    .from("soal_kompetensi")
    .select("id_soal_kompetensi, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan, gambar_url, file_url, id_jurusan, jurusan(nama_jurusan)")
    .order("created_at", { ascending: false });

  return (data ?? []).map((s) => ({
    id_soal_kompetensi: s.id_soal_kompetensi,
    pertanyaan: s.pertanyaan,
    tipe_soal: s.tipe_soal,
    tingkat_kesulitan: s.tingkat_kesulitan,
    pembahasan: s.pembahasan,
    gambar_url: s.gambar_url,
    file_url: s.file_url,
    id_jurusan: s.id_jurusan,
    jurusan_nama: (s.jurusan as unknown as { nama_jurusan: string } | null)?.nama_jurusan ?? null,
  }));
}

export async function getOpsiForSoalKompetensi(idSoal: string): Promise<OpsiJawabanKompetensi[]> {
  await requireRole(["kajur"]);
  const supabase = await createClient();
  const { data } = await supabase
    .from("opsi_jawaban_kompetensi")
    .select("id_opsi_kompetensi, label, isi_opsi, is_benar, gambar_url")
    .eq("id_soal_kompetensi", idSoal)
    .order("label");
  return data ?? [];
}
