"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type ActionResult = { success: boolean; message: string };

export async function submitTugas(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(["siswa"]);
  const idSiswa = profile.id_siswa;
  if (!idSiswa) return { success: false, message: "Akun siswa tidak ditemukan." };

  const idTugas = String(formData.get("id_tugas") ?? "");
  if (!idTugas) return { success: false, message: "Tugas tidak valid." };

  const supabase = await createClient();
  const admin = createAdminClient();

  // Pastikan tugas ini memang untuk kelas siswa yang bersangkutan
  const { data: tugas } = await supabase
    .from("tugas")
    .select("id_tugas, status, mengajar(id_kelas)")
    .eq("id_tugas", idTugas)
    .single();

  if (!tugas || tugas.status !== "aktif") {
    return { success: false, message: "Tugas tidak ditemukan atau sudah ditutup." };
  }

  const { data: siswaKelas } = await supabase
    .from("siswa_kelas")
    .select("id_kelas")
    .eq("id_siswa", idSiswa)
    .eq("aktif", true)
    .maybeSingle();

  const idKelasTugas = (tugas.mengajar as unknown as { id_kelas: string } | null)?.id_kelas;
  if (!siswaKelas || siswaKelas.id_kelas !== idKelasTugas) {
    return { success: false, message: "Anda tidak terdaftar di kelas untuk tugas ini." };
  }

  let { data: pengumpulan } = await admin
    .from("pengumpulan_tugas")
    .select("id_pengumpulan, status")
    .eq("id_tugas", idTugas)
    .eq("id_siswa", idSiswa)
    .maybeSingle();

  if (pengumpulan && (pengumpulan.status === "selesai" || pengumpulan.status === "dinilai")) {
    return { success: false, message: "Tugas ini sudah Anda kumpulkan." };
  }

  if (!pengumpulan) {
    const { data: created, error: createError } = await admin
      .from("pengumpulan_tugas")
      .insert({ id_tugas: idTugas, id_siswa: idSiswa, status: "dikerjakan", mulai_at: new Date().toISOString() })
      .select("id_pengumpulan, status")
      .single();
    if (createError || !created) return { success: false, message: createError?.message ?? "Gagal memulai tugas." };
    pengumpulan = created;
  }

  const { data: soalList } = await admin
    .from("tugas_soal")
    .select("id_soal, bank_soal(tipe_soal)")
    .eq("id_tugas", idTugas);

  const jawabanRows = [];
  for (const soal of soalList ?? []) {
    const tipeSoal = (soal.bank_soal as unknown as { tipe_soal: string } | null)?.tipe_soal;
    if (tipeSoal === "pg") {
      const idOpsi = String(formData.get(`opsi_${soal.id_soal}`) ?? "") || null;
      let isBenar = false;
      if (idOpsi) {
        const { data: opsi } = await admin.from("opsi_jawaban").select("is_benar").eq("id_opsi", idOpsi).single();
        isBenar = opsi?.is_benar ?? false;
      }
      jawabanRows.push({
        id_pengumpulan: pengumpulan.id_pengumpulan,
        id_soal: soal.id_soal,
        id_opsi: idOpsi,
        is_benar: isBenar,
        nilai: isBenar ? 100 : 0,
      });
    } else {
      const jawabanText = String(formData.get(`essay_${soal.id_soal}`) ?? "").trim();
      jawabanRows.push({
        id_pengumpulan: pengumpulan.id_pengumpulan,
        id_soal: soal.id_soal,
        jawaban_text: jawabanText,
        is_benar: false,
        nilai: 0,
      });
    }
  }

  await admin.from("jawaban_tugas_siswa").delete().eq("id_pengumpulan", pengumpulan.id_pengumpulan);
  if (jawabanRows.length > 0) {
    const { error: insertError } = await admin.from("jawaban_tugas_siswa").insert(jawabanRows);
    if (insertError) return { success: false, message: insertError.message };
  }

  const { error: updateError } = await admin
    .from("pengumpulan_tugas")
    .update({ status: "selesai", selesai_at: new Date().toISOString() })
    .eq("id_pengumpulan", pengumpulan.id_pengumpulan);

  if (updateError) return { success: false, message: updateError.message };

  return { success: true, message: "Tugas berhasil dikumpulkan." };
}
