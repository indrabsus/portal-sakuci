import { notFound } from "next/navigation";
import { requireKajurJurusan } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ValidasiDetailClient } from "./client";
import type { JawabanDetail } from "./nilai-modal";

export default async function ValidasiKompetensiDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireKajurJurusan();
  const { id } = await params;
  const supabase = await createClient();

  const { data: tes } = await supabase
    .from("kompetensi_tugas")
    .select("id_kompetensi_tugas, judul, kompetensi(id_jurusan)")
    .eq("id_kompetensi_tugas", id)
    .single();

  const tesJurusan = (tes?.kompetensi as unknown as { id_jurusan: string } | null)?.id_jurusan;
  if (!tes || tesJurusan !== profile.id_jurusan) notFound();

  const { data: pengumpulanList } = await supabase
    .from("pengumpulan_kompetensi")
    .select("id_pengumpulan_kompetensi, status, nilai, siswa(nama_lengkap)")
    .eq("id_kompetensi_tugas", id)
    .neq("status", "belum");

  const idPengumpulanList = (pengumpulanList ?? []).map((p) => p.id_pengumpulan_kompetensi);

  const { data: jawabanList } = await supabase
    .from("jawaban_kompetensi_siswa")
    .select("id_jawaban_kompetensi, id_pengumpulan_kompetensi, jawaban_text, is_benar, nilai, soal_kompetensi(pertanyaan, tipe_soal), opsi_jawaban_kompetensi(label)")
    .in("id_pengumpulan_kompetensi", idPengumpulanList.length ? idPengumpulanList : [""]);

  const jawabanByPengumpulan = new Map<string, JawabanDetail[]>();
  for (const j of jawabanList ?? []) {
    const soal = j.soal_kompetensi as unknown as { pertanyaan: string; tipe_soal: string } | null;
    const opsi = j.opsi_jawaban_kompetensi as unknown as { label: string } | null;
    const detail: JawabanDetail = {
      id_jawaban: j.id_jawaban_kompetensi,
      pertanyaan: soal?.pertanyaan ?? "-",
      tipe_soal: soal?.tipe_soal ?? "essay",
      jawaban_text: j.jawaban_text,
      is_benar: j.is_benar ?? false,
      nilai: j.nilai ?? 0,
      opsi_dipilih: opsi?.label ?? null,
    };
    const list = jawabanByPengumpulan.get(j.id_pengumpulan_kompetensi) ?? [];
    list.push(detail);
    jawabanByPengumpulan.set(j.id_pengumpulan_kompetensi, list);
  }

  const rows = (pengumpulanList ?? []).map((p) => ({
    id_pengumpulan_kompetensi: p.id_pengumpulan_kompetensi,
    nama_siswa: (p.siswa as unknown as { nama_lengkap: string } | null)?.nama_lengkap ?? "-",
    status: p.status,
    nilai: p.nilai,
    jawaban: jawabanByPengumpulan.get(p.id_pengumpulan_kompetensi) ?? [],
  }));

  return <ValidasiDetailClient judulTes={tes.judul} rows={rows} />;
}
