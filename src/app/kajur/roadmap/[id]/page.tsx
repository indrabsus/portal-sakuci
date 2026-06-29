import { notFound } from "next/navigation";
import { requireKajurJurusan } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { KompetensiTugasClient } from "./client";

export default async function KompetensiDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireKajurJurusan();
  const { id } = await params;
  const supabase = await createClient();

  const { data: kompetensi } = await supabase
    .from("kompetensi")
    .select("id_kompetensi, judul, id_jurusan")
    .eq("id_kompetensi", id)
    .single();

  if (!kompetensi || kompetensi.id_jurusan !== profile.id_jurusan) notFound();

  const [{ data: tugasList }, { data: soalCountList }, { data: jurusanList }] = await Promise.all([
    supabase
      .from("kompetensi_tugas")
      .select("id_kompetensi_tugas, judul, deskripsi, deadline, status")
      .eq("id_kompetensi", id)
      .order("created_at", { ascending: false }),
    supabase.from("kompetensi_tugas_soal").select("id_kompetensi_tugas"),
    supabase.from("jurusan").select("id_jurusan, nama_jurusan").order("nama_jurusan"),
  ]);

  const countMap = new Map<string, number>();
  for (const s of soalCountList ?? []) {
    countMap.set(s.id_kompetensi_tugas, (countMap.get(s.id_kompetensi_tugas) ?? 0) + 1);
  }

  const rows = (tugasList ?? []).map((t) => ({
    id_kompetensi_tugas: t.id_kompetensi_tugas,
    judul: t.judul,
    deskripsi: t.deskripsi,
    deadline: t.deadline,
    status: t.status,
    jumlah_soal: countMap.get(t.id_kompetensi_tugas) ?? 0,
  }));

  return (
    <KompetensiTugasClient
      idKompetensi={kompetensi.id_kompetensi}
      judulKompetensi={kompetensi.judul}
      idJurusan={kompetensi.id_jurusan}
      jurusanOptions={(jurusanList ?? []).map((j) => ({ value: j.id_jurusan, label: j.nama_jurusan }))}
      rows={rows}
    />
  );
}
