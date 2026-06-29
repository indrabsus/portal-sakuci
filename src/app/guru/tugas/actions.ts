"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

async function ensureOwnMengajar(idMengajar: string, idGuru: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("mengajar").select("id_guru").eq("id_mengajar", idMengajar).single();
  return data?.id_guru === idGuru;
}

export async function createTugas(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const idMengajar = String(formData.get("id_mengajar") ?? "");
  const judul = String(formData.get("judul") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim() || null;
  const deadline = String(formData.get("deadline") ?? "") || null;
  const status = String(formData.get("status") ?? "draft");
  const semester = String(formData.get("semester") ?? "ganjil");

  if (!idMengajar || !judul) return { success: false, message: "Kelas/mapel dan judul wajib diisi." };
  if (!(await ensureOwnMengajar(idMengajar, profile.id_guru ?? ""))) {
    return { success: false, message: "Anda tidak mengajar kelas/mapel ini." };
  }

  const { error } = await supabase.from("tugas").insert({ id_mengajar: idMengajar, judul, deskripsi, deadline, status, semester });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Tugas berhasil ditambahkan." };
}

export async function updateTugas(formData: FormData): Promise<ActionResult> {
  await requireRole(["guru"]);
  const supabase = await createClient();

  const id = String(formData.get("id_tugas") ?? "");
  const judul = String(formData.get("judul") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim() || null;
  const deadline = String(formData.get("deadline") ?? "") || null;
  const status = String(formData.get("status") ?? "draft");
  const semester = String(formData.get("semester") ?? "ganjil");

  if (!id || !judul) return { success: false, message: "Data tidak lengkap." };

  const { error } = await supabase.from("tugas").update({ judul, deskripsi, deadline, status, semester }).eq("id_tugas", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Tugas berhasil diubah." };
}

export async function deleteTugas(formData: FormData): Promise<ActionResult> {
  await requireRole(["guru"]);
  const supabase = await createClient();
  const id = String(formData.get("id_tugas") ?? "");

  await supabase.from("tugas_soal").delete().eq("id_tugas", id);
  const { error } = await supabase.from("tugas").delete().eq("id_tugas", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Tugas berhasil dihapus." };
}

export type SoalTugasRow = {
  id_tugas_soal: string;
  id_soal: string;
  nomor: number;
  bobot: number;
  pertanyaan: string;
  tipe_soal: string;
};

export async function getSoalTugasData(idTugas: string): Promise<{ terpilih: SoalTugasRow[] }> {
  await requireRole(["guru"]);
  const supabase = await createClient();

  const { data: terpilihRaw } = await supabase
    .from("tugas_soal")
    .select("id_tugas_soal, id_soal, nomor, bobot, bank_soal(pertanyaan, tipe_soal)")
    .eq("id_tugas", idTugas)
    .order("nomor");

  const terpilih: SoalTugasRow[] = (terpilihRaw ?? []).map((t) => {
    const s = t.bank_soal as unknown as { pertanyaan: string; tipe_soal: string } | null;
    return {
      id_tugas_soal: t.id_tugas_soal,
      id_soal: t.id_soal,
      nomor: t.nomor,
      bobot: t.bobot,
      pertanyaan: s?.pertanyaan ?? "-",
      tipe_soal: s?.tipe_soal ?? "-",
    };
  });

  return { terpilih };
}

export async function tambahSoalKeTugas(formData: FormData): Promise<ActionResult> {
  await requireRole(["guru"]);
  const supabase = await createClient();

  const idTugas = String(formData.get("id_tugas") ?? "");
  const idSoal = String(formData.get("id_soal") ?? "");
  if (!idTugas || !idSoal) return { success: false, message: "Pilih soal terlebih dahulu." };

  const { count } = await supabase
    .from("tugas_soal")
    .select("id_tugas_soal", { count: "exact", head: true })
    .eq("id_tugas", idTugas);

  const { error } = await supabase.from("tugas_soal").insert({
    id_tugas: idTugas,
    id_soal: idSoal,
    nomor: (count ?? 0) + 1,
    bobot: 1,
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Soal berhasil ditambahkan." };
}

export async function hapusSoalDariTugas(formData: FormData): Promise<ActionResult> {
  await requireRole(["guru"]);
  const supabase = await createClient();
  const id = String(formData.get("id_tugas_soal") ?? "");

  const { error } = await supabase.from("tugas_soal").delete().eq("id_tugas_soal", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Soal berhasil dihapus dari tugas." };
}
