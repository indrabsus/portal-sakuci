import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { TugasClient } from "./client";
import type { BankSoalRow } from "@/features/bank-soal/types";

export default async function TugasPage() {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const { data: mengajarList } = await supabase
    .from("mengajar")
    .select("id_mengajar, mapel(nama_mapel), kelas(nama_kelas, tingkat)")
    .eq("id_guru", profile.id_guru ?? "");

  const mengajarOptions = (mengajarList ?? []).map((m) => {
    const kelas = m.kelas as unknown as { nama_kelas: string; tingkat: number | null } | null;
    const kelasLabel = kelas ? (kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas) : "-";
    return {
      value: m.id_mengajar,
      label: `${(m.mapel as unknown as { nama_mapel: string } | null)?.nama_mapel ?? "-"} - ${kelasLabel}`,
    };
  });
  const idMengajarList = mengajarOptions.map((m) => m.value);
  const mengajarLabelMap = new Map(mengajarOptions.map((m) => [m.value, m.label]));

  const [{ data: tugasList }, { data: tugasSoalList }, { data: soalList }, { data: opsiList }] = await Promise.all([
    supabase
      .from("tugas")
      .select("id_tugas, id_mengajar, judul, deskripsi, deadline, status, semester")
      .in("id_mengajar", idMengajarList.length ? idMengajarList : [""])
      .order("created_at", { ascending: false }),
    supabase.from("tugas_soal").select("id_tugas"),
    supabase
      .from("bank_soal")
      .select("id_soal, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan, gambar_url, audio_url, id_mapel, mapel(nama_mapel)")
      .order("created_at", { ascending: false }),
    supabase.from("opsi_jawaban").select("id_soal"),
  ]);

  const soalCountMap = new Map<string, number>();
  for (const ts of tugasSoalList ?? []) {
    soalCountMap.set(ts.id_tugas, (soalCountMap.get(ts.id_tugas) ?? 0) + 1);
  }

  const rows = (tugasList ?? []).map((t) => ({
    id_tugas: t.id_tugas,
    id_mengajar: t.id_mengajar,
    judul: t.judul,
    deskripsi: t.deskripsi,
    deadline: t.deadline,
    status: t.status,
    semester: t.semester,
    mengajar_label: mengajarLabelMap.get(t.id_mengajar) ?? "-",
    jumlah_soal: soalCountMap.get(t.id_tugas) ?? 0,
  }));

  const opsiCountMap = new Map<string, number>();
  for (const o of opsiList ?? []) {
    opsiCountMap.set(o.id_soal, (opsiCountMap.get(o.id_soal) ?? 0) + 1);
  }

  const bankSoal: BankSoalRow[] = (soalList ?? []).map((s) => ({
    id_soal: s.id_soal,
    pertanyaan: s.pertanyaan,
    tipe_soal: s.tipe_soal,
    tingkat_kesulitan: s.tingkat_kesulitan,
    pembahasan: s.pembahasan,
    gambar_url: s.gambar_url,
    audio_url: s.audio_url,
    id_mapel: s.id_mapel,
    mapel_nama: (s.mapel as unknown as { nama_mapel: string } | null)?.nama_mapel ?? null,
    jumlah_opsi: opsiCountMap.get(s.id_soal) ?? 0,
  }));

  return <TugasClient rows={rows} mengajarOptions={mengajarOptions} bankSoal={bankSoal} />;
}
