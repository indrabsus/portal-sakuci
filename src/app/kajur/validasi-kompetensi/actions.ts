"use server";

import { requireKajurJurusan } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { recomputeProgresKompetensi } from "@/lib/kompetensi-progress";
import { koreksiEssayAI } from "@/lib/ai-koreksi";

type ActionResult = { success: boolean; message: string };
type KoreksiAIResult = { success: boolean; message: string; nilai?: number; alasan?: string };

async function verifyJawabanOwnership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  idJawaban: string,
  idJurusan: string,
) {
  const { data } = await supabase
    .from("jawaban_kompetensi_siswa")
    .select("pengumpulan_kompetensi(kompetensi_tugas(kompetensi(id_jurusan)))")
    .eq("id_jawaban_kompetensi", idJawaban)
    .single();
  const nested = data?.pengumpulan_kompetensi as unknown as {
    kompetensi_tugas: { kompetensi: { id_jurusan: string } | null } | null;
  } | null;
  return nested?.kompetensi_tugas?.kompetensi?.id_jurusan === idJurusan;
}

export async function simpanNilaiEssayKompetensi(formData: FormData): Promise<ActionResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();

  const idJawaban = String(formData.get("id_jawaban") ?? "");
  const nilai = Number(formData.get("nilai") ?? 0);

  if (!idJawaban) return { success: false, message: "Data tidak valid." };
  if (!(await verifyJawabanOwnership(supabase, idJawaban, profile.id_jurusan))) {
    return { success: false, message: "Jawaban ini bukan dari jurusan Anda." };
  }

  const { error } = await supabase.from("jawaban_kompetensi_siswa").update({ nilai }).eq("id_jawaban_kompetensi", idJawaban);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Nilai essay tersimpan." };
}

export async function koreksiEssayKompetensiAI(formData: FormData): Promise<KoreksiAIResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();

  const idJawaban = String(formData.get("id_jawaban") ?? "");
  if (!idJawaban) return { success: false, message: "Data tidak valid." };
  if (!(await verifyJawabanOwnership(supabase, idJawaban, profile.id_jurusan))) {
    return { success: false, message: "Jawaban ini bukan dari jurusan Anda." };
  }

  const { data: jawaban } = await supabase
    .from("jawaban_kompetensi_siswa")
    .select("jawaban_text, soal_kompetensi(pertanyaan, pembahasan, tipe_soal)")
    .eq("id_jawaban_kompetensi", idJawaban)
    .single();

  const soal = jawaban?.soal_kompetensi as unknown as { pertanyaan: string; pembahasan: string | null; tipe_soal: string } | null;
  if (!jawaban || soal?.tipe_soal !== "essay") {
    return { success: false, message: "Soal ini bukan tipe essay." };
  }

  try {
    const hasil = await koreksiEssayAI({
      pertanyaan: soal.pertanyaan,
      pembahasan: soal.pembahasan,
      jawabanSiswa: jawaban.jawaban_text ?? "",
    });

    const { error } = await supabase
      .from("jawaban_kompetensi_siswa")
      .update({ nilai: hasil.nilai })
      .eq("id_jawaban_kompetensi", idJawaban);
    if (error) return { success: false, message: error.message };

    return { success: true, message: "Koreksi AI berhasil.", nilai: hasil.nilai, alasan: hasil.alasan };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal menghubungi layanan AI." };
  }
}

export async function finalisasiNilaiKompetensi(formData: FormData): Promise<ActionResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();

  const idPengumpulan = String(formData.get("id_pengumpulan_kompetensi") ?? "");
  if (!idPengumpulan) return { success: false, message: "Data tidak valid." };

  const { data: pengumpulan } = await supabase
    .from("pengumpulan_kompetensi")
    .select("id_siswa, kompetensi_tugas(id_kompetensi, kompetensi(syarat_lulus, id_jurusan))")
    .eq("id_pengumpulan_kompetensi", idPengumpulan)
    .single();

  if (!pengumpulan) return { success: false, message: "Data pengumpulan tidak ditemukan." };

  const kompetensiTugas = pengumpulan.kompetensi_tugas as unknown as {
    id_kompetensi: string;
    kompetensi: { syarat_lulus: number; id_jurusan: string } | null;
  } | null;
  const idKompetensi = kompetensiTugas?.id_kompetensi;
  const syaratLulus = kompetensiTugas?.kompetensi?.syarat_lulus ?? 75;

  if (!idKompetensi) return { success: false, message: "Data kompetensi tidak ditemukan." };
  if (kompetensiTugas?.kompetensi?.id_jurusan !== profile.id_jurusan) {
    return { success: false, message: "Tes ini bukan dari jurusan Anda." };
  }

  const { data: jawabanList } = await supabase
    .from("jawaban_kompetensi_siswa")
    .select("nilai")
    .eq("id_pengumpulan_kompetensi", idPengumpulan);

  const nilaiList = (jawabanList ?? []).map((j) => j.nilai ?? 0);
  const rataRata = nilaiList.length > 0 ? Math.round((nilaiList.reduce((a, b) => a + b, 0) / nilaiList.length) * 100) / 100 : 0;
  const statusAkhir = rataRata >= syaratLulus ? "lulus" : "tidak_lulus";

  const { error: updateError } = await supabase
    .from("pengumpulan_kompetensi")
    .update({ nilai: rataRata, status: statusAkhir })
    .eq("id_pengumpulan_kompetensi", idPengumpulan);

  if (updateError) return { success: false, message: updateError.message };

  await recomputeProgresKompetensi(supabase, pengumpulan.id_siswa, idKompetensi);

  return { success: true, message: `Nilai disimpan. Status tes: ${statusAkhir === "lulus" ? "Lulus" : "Belum Lulus"}.` };
}
