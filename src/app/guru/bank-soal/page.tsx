import { createClient } from "@/lib/supabase/server";
import { BankSoalPage } from "@/features/bank-soal/bank-soal-page";
import type { BankSoalRow } from "@/features/bank-soal/types";

export default async function GuruBankSoalPage() {
  const supabase = await createClient();

  const [{ data: soalList }, { data: mapelList }, { data: opsiList }] = await Promise.all([
    supabase
      .from("bank_soal")
      .select("id_soal, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan, gambar_url, audio_url, id_mapel, mapel(nama_mapel)")
      .order("created_at", { ascending: false }),
    supabase.from("mapel").select("id_mapel, nama_mapel").order("nama_mapel"),
    supabase.from("opsi_jawaban").select("id_soal"),
  ]);

  const opsiCountMap = new Map<string, number>();
  for (const o of opsiList ?? []) {
    opsiCountMap.set(o.id_soal, (opsiCountMap.get(o.id_soal) ?? 0) + 1);
  }

  const rows: BankSoalRow[] = (soalList ?? []).map((s) => ({
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

  return (
    <BankSoalPage
      rows={rows}
      mapelOptions={(mapelList ?? []).map((m) => ({ value: m.id_mapel, label: m.nama_mapel }))}
    />
  );
}
