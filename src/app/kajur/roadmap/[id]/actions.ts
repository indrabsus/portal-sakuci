"use server";

import { requireKajurJurusan } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

async function verifyKompetensiOwnership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  idKompetensi: string,
  idJurusan: string,
) {
  const { data } = await supabase.from("kompetensi").select("id_jurusan").eq("id_kompetensi", idKompetensi).single();
  return data?.id_jurusan === idJurusan;
}

async function verifyTesOwnership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  idKompetensiTugas: string,
  idJurusan: string,
) {
  const { data } = await supabase
    .from("kompetensi_tugas")
    .select("kompetensi(id_jurusan)")
    .eq("id_kompetensi_tugas", idKompetensiTugas)
    .single();
  return (data?.kompetensi as unknown as { id_jurusan: string } | null)?.id_jurusan === idJurusan;
}

export async function createKompetensiTugas(formData: FormData): Promise<ActionResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();

  const idKompetensi = String(formData.get("id_kompetensi") ?? "");
  const judul = String(formData.get("judul") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim() || null;
  const deadline = String(formData.get("deadline") ?? "") || null;
  const status = String(formData.get("status") ?? "draft");

  if (!idKompetensi || !judul) return { success: false, message: "Judul tes wajib diisi." };
  if (!(await verifyKompetensiOwnership(supabase, idKompetensi, profile.id_jurusan))) {
    return { success: false, message: "Kompetensi ini bukan milik jurusan Anda." };
  }

  const { error } = await supabase.from("kompetensi_tugas").insert({
    id_kompetensi: idKompetensi,
    judul,
    deskripsi,
    deadline,
    status,
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Tes kompetensi berhasil ditambahkan." };
}

export async function updateKompetensiTugas(formData: FormData): Promise<ActionResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();

  const id = String(formData.get("id_kompetensi_tugas") ?? "");
  const judul = String(formData.get("judul") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim() || null;
  const deadline = String(formData.get("deadline") ?? "") || null;
  const status = String(formData.get("status") ?? "draft");

  if (!id || !judul) return { success: false, message: "Data tidak lengkap." };
  if (!(await verifyTesOwnership(supabase, id, profile.id_jurusan))) {
    return { success: false, message: "Tes ini bukan milik jurusan Anda." };
  }

  const { error } = await supabase
    .from("kompetensi_tugas")
    .update({ judul, deskripsi, deadline, status })
    .eq("id_kompetensi_tugas", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Tes kompetensi berhasil diubah." };
}

export async function deleteKompetensiTugas(formData: FormData): Promise<ActionResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();
  const id = String(formData.get("id_kompetensi_tugas") ?? "");

  if (!(await verifyTesOwnership(supabase, id, profile.id_jurusan))) {
    return { success: false, message: "Tes ini bukan milik jurusan Anda." };
  }

  await supabase.from("kompetensi_tugas_soal").delete().eq("id_kompetensi_tugas", id);
  const { error } = await supabase.from("kompetensi_tugas").delete().eq("id_kompetensi_tugas", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Tes kompetensi berhasil dihapus." };
}

export type SoalTesRow = {
  id_kompetensi_tugas_soal: string;
  id_soal: string;
  nomor: number;
  bobot: number;
  pertanyaan: string;
  tipe_soal: string;
};

export async function getSoalTesData(
  idKompetensiTugas: string,
): Promise<{ terpilih: SoalTesRow[] }> {
  await requireKajurJurusan();
  const supabase = await createClient();

  const { data: terpilihRaw } = await supabase
    .from("kompetensi_tugas_soal")
    .select("id_kompetensi_tugas_soal, id_soal, nomor, bobot, soal_kompetensi(pertanyaan, tipe_soal)")
    .eq("id_kompetensi_tugas", idKompetensiTugas)
    .order("nomor");

  const terpilih: SoalTesRow[] = (terpilihRaw ?? []).map((t) => {
    const s = t.soal_kompetensi as unknown as { pertanyaan: string; tipe_soal: string } | null;
    return {
      id_kompetensi_tugas_soal: t.id_kompetensi_tugas_soal,
      id_soal: t.id_soal,
      nomor: t.nomor,
      bobot: t.bobot,
      pertanyaan: s?.pertanyaan ?? "-",
      tipe_soal: s?.tipe_soal ?? "-",
    };
  });

  return { terpilih };
}

export async function tambahSoalKeTes(formData: FormData): Promise<ActionResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();

  const idKompetensiTugas = String(formData.get("id_kompetensi_tugas") ?? "");
  const idSoal = String(formData.get("id_soal") ?? "");
  if (!idKompetensiTugas || !idSoal) return { success: false, message: "Pilih soal terlebih dahulu." };
  if (!(await verifyTesOwnership(supabase, idKompetensiTugas, profile.id_jurusan))) {
    return { success: false, message: "Tes ini bukan milik jurusan Anda." };
  }

  const { count } = await supabase
    .from("kompetensi_tugas_soal")
    .select("id_kompetensi_tugas_soal", { count: "exact", head: true })
    .eq("id_kompetensi_tugas", idKompetensiTugas);

  const { error } = await supabase.from("kompetensi_tugas_soal").insert({
    id_kompetensi_tugas: idKompetensiTugas,
    id_soal: idSoal,
    nomor: (count ?? 0) + 1,
    bobot: 1,
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Soal berhasil ditambahkan." };
}

export async function hapusSoalDariTes(formData: FormData): Promise<ActionResult> {
  await requireKajurJurusan();
  const supabase = await createClient();
  const id = String(formData.get("id_kompetensi_tugas_soal") ?? "");

  const { error } = await supabase.from("kompetensi_tugas_soal").delete().eq("id_kompetensi_tugas_soal", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Soal berhasil dihapus dari tes." };
}
