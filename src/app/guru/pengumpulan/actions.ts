"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

export async function simpanNilaiEssay(formData: FormData): Promise<ActionResult> {
  await requireRole(["guru"]);
  const supabase = await createClient();

  const idJawaban = String(formData.get("id_jawaban") ?? "");
  const nilai = Number(formData.get("nilai") ?? 0);

  if (!idJawaban) return { success: false, message: "Data tidak valid." };

  const { error } = await supabase.from("jawaban_tugas_siswa").update({ nilai }).eq("id_jawaban", idJawaban);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Nilai essay tersimpan." };
}

export async function finalisasiNilai(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const idPengumpulan = String(formData.get("id_pengumpulan") ?? "");
  if (!idPengumpulan) return { success: false, message: "Data tidak valid." };

  const { data: jawabanList } = await supabase
    .from("jawaban_tugas_siswa")
    .select("nilai")
    .eq("id_pengumpulan", idPengumpulan);

  const nilaiList = (jawabanList ?? []).map((j) => j.nilai ?? 0);
  const rataRata = nilaiList.length > 0 ? nilaiList.reduce((a, b) => a + b, 0) / nilaiList.length : 0;

  const { error } = await supabase
    .from("pengumpulan_tugas")
    .update({
      nilai: Math.round(rataRata * 100) / 100,
      status: "dinilai",
      dinilai_at: new Date().toISOString(),
      id_guru_penilai: profile.id_guru,
    })
    .eq("id_pengumpulan", idPengumpulan);

  if (error) return { success: false, message: error.message };
  return { success: true, message: "Nilai berhasil disimpan." };
}
