import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PengumpulanDetailClient } from "./client";
import type { JawabanDetail } from "./nilai-modal";

export default async function PengumpulanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: tugas } = await supabase.from("tugas").select("id_tugas, judul").eq("id_tugas", id).single();
  if (!tugas) notFound();

  const { data: pengumpulanList } = await supabase
    .from("pengumpulan_tugas")
    .select("id_pengumpulan, status, nilai, siswa(nama_lengkap)")
    .eq("id_tugas", id);

  const idPengumpulanList = (pengumpulanList ?? []).map((p) => p.id_pengumpulan);

  const { data: jawabanList } = await supabase
    .from("jawaban_tugas_siswa")
    .select("id_jawaban, id_pengumpulan, id_soal, jawaban_text, is_benar, nilai, id_opsi, bank_soal(pertanyaan, tipe_soal), opsi_jawaban(label)")
    .in("id_pengumpulan", idPengumpulanList.length ? idPengumpulanList : [""]);

  const jawabanByPengumpulan = new Map<string, JawabanDetail[]>();
  for (const j of jawabanList ?? []) {
    const soal = j.bank_soal as unknown as { pertanyaan: string; tipe_soal: string } | null;
    const opsi = j.opsi_jawaban as unknown as { label: string } | null;
    const detail: JawabanDetail = {
      id_jawaban: j.id_jawaban,
      id_soal: j.id_soal,
      pertanyaan: soal?.pertanyaan ?? "-",
      tipe_soal: soal?.tipe_soal ?? "essay",
      jawaban_text: j.jawaban_text,
      is_benar: j.is_benar ?? false,
      nilai: j.nilai ?? 0,
      opsi_dipilih: opsi?.label ?? null,
    };
    const list = jawabanByPengumpulan.get(j.id_pengumpulan) ?? [];
    list.push(detail);
    jawabanByPengumpulan.set(j.id_pengumpulan, list);
  }

  const rows = (pengumpulanList ?? []).map((p) => ({
    id_pengumpulan: p.id_pengumpulan,
    nama_siswa: (p.siswa as unknown as { nama_lengkap: string } | null)?.nama_lengkap ?? "-",
    status: p.status,
    nilai: p.nilai,
    jawaban: jawabanByPengumpulan.get(p.id_pengumpulan) ?? [],
  }));

  return <PengumpulanDetailClient judulTugas={tugas.judul} rows={rows} />;
}
