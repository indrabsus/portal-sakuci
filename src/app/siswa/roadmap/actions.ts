"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { recomputeProgresKompetensi } from "@/lib/kompetensi-progress";

type ActionResult = { success: boolean; message: string };

export async function submitTesKompetensi(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(["siswa"]);
  const idSiswa = profile.id_siswa;
  if (!idSiswa) return { success: false, message: "Akun siswa tidak ditemukan." };

  const idKompetensiTugas = String(formData.get("id_kompetensi_tugas") ?? "");
  if (!idKompetensiTugas) return { success: false, message: "Tes tidak valid." };

  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: tes } = await supabase
    .from("kompetensi_tugas")
    .select("id_kompetensi_tugas, status, kompetensi(id_kompetensi, syarat_lulus)")
    .eq("id_kompetensi_tugas", idKompetensiTugas)
    .single();

  if (!tes || tes.status !== "aktif") {
    return { success: false, message: "Tes tidak ditemukan atau sudah ditutup." };
  }

  const kompetensi = tes.kompetensi as unknown as { id_kompetensi: string; syarat_lulus: number } | null;
  if (!kompetensi) return { success: false, message: "Data kompetensi tidak valid." };

  let { data: pengumpulan } = await admin
    .from("pengumpulan_kompetensi")
    .select("id_pengumpulan_kompetensi, status")
    .eq("id_kompetensi_tugas", idKompetensiTugas)
    .eq("id_siswa", idSiswa)
    .maybeSingle();

  if (pengumpulan && ["selesai", "lulus", "tidak_lulus", "menunggu_acc"].includes(pengumpulan.status)) {
    return { success: false, message: "Tes ini sudah Anda kumpulkan." };
  }

  if (!pengumpulan) {
    const { data: created, error: createError } = await admin
      .from("pengumpulan_kompetensi")
      .insert({ id_kompetensi_tugas: idKompetensiTugas, id_siswa: idSiswa, status: "dikerjakan", mulai_at: new Date().toISOString() })
      .select("id_pengumpulan_kompetensi, status")
      .single();
    if (createError || !created) return { success: false, message: createError?.message ?? "Gagal memulai tes." };
    pengumpulan = created;
  }

  const { data: soalList } = await admin
    .from("kompetensi_tugas_soal")
    .select("id_soal, soal_kompetensi(tipe_soal)")
    .eq("id_kompetensi_tugas", idKompetensiTugas);

  const jawabanRows = [];
  let adaEssay = false;

  for (const soal of soalList ?? []) {
    const tipeSoal = (soal.soal_kompetensi as unknown as { tipe_soal: string } | null)?.tipe_soal;
    if (tipeSoal === "pg") {
      const idOpsi = String(formData.get(`opsi_${soal.id_soal}`) ?? "") || null;
      let isBenar = false;
      if (idOpsi) {
        const { data: opsi } = await admin.from("opsi_jawaban_kompetensi").select("is_benar").eq("id_opsi_kompetensi", idOpsi).single();
        isBenar = opsi?.is_benar ?? false;
      }
      jawabanRows.push({
        id_pengumpulan_kompetensi: pengumpulan.id_pengumpulan_kompetensi,
        id_soal: soal.id_soal,
        id_opsi: idOpsi,
        is_benar: isBenar,
        nilai: isBenar ? 100 : 0,
      });
    } else {
      adaEssay = true;
      const jawabanText = String(formData.get(`essay_${soal.id_soal}`) ?? "").trim();
      jawabanRows.push({
        id_pengumpulan_kompetensi: pengumpulan.id_pengumpulan_kompetensi,
        id_soal: soal.id_soal,
        jawaban_text: jawabanText,
        is_benar: false,
        nilai: 0,
      });
    }
  }

  await admin.from("jawaban_kompetensi_siswa").delete().eq("id_pengumpulan_kompetensi", pengumpulan.id_pengumpulan_kompetensi);
  if (jawabanRows.length > 0) {
    const { error: insertError } = await admin.from("jawaban_kompetensi_siswa").insert(jawabanRows);
    if (insertError) return { success: false, message: insertError.message };
  }

  const nilaiList = jawabanRows.map((j) => j.nilai);
  const rataRata = nilaiList.length > 0 ? Math.round((nilaiList.reduce((a, b) => a + b, 0) / nilaiList.length) * 100) / 100 : 0;

  let statusAkhir: string;
  if (adaEssay) {
    statusAkhir = "menunggu_acc";
  } else {
    statusAkhir = rataRata >= kompetensi.syarat_lulus ? "lulus" : "tidak_lulus";
  }

  await admin
    .from("pengumpulan_kompetensi")
    .update({ status: statusAkhir, selesai_at: new Date().toISOString(), nilai: rataRata })
    .eq("id_pengumpulan_kompetensi", pengumpulan.id_pengumpulan_kompetensi);

  await recomputeProgresKompetensi(admin, idSiswa, kompetensi.id_kompetensi);

  return {
    success: true,
    message:
      statusAkhir === "lulus"
        ? "Selamat! Anda lulus tes ini."
        : statusAkhir === "menunggu_acc"
          ? "Jawaban essay Anda menunggu validasi Kajur."
          : "Tes selesai. Nilai Anda belum memenuhi syarat lulus, silakan coba lagi.",
  };
}
