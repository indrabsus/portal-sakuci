import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { TesFormClient, type SoalForm } from "./tes-form";
import { HasilView, type HasilSoal } from "@/app/siswa/tugas/[id]/hasil-view";

export default async function SiswaTesKompetensiPage({ params }: { params: Promise<{ id: string; tesId: string }> }) {
  const profile = await requireRole(["siswa"]);
  const { tesId } = await params;
  const idSiswa = profile.id_siswa;
  if (!idSiswa) redirect("/login");

  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: tes } = await supabase
    .from("kompetensi_tugas")
    .select("id_kompetensi_tugas, judul, deskripsi")
    .eq("id_kompetensi_tugas", tesId)
    .single();

  if (!tes) notFound();

  const { data: pengumpulan } = await supabase
    .from("pengumpulan_kompetensi")
    .select("id_pengumpulan_kompetensi, status, nilai")
    .eq("id_kompetensi_tugas", tesId)
    .eq("id_siswa", idSiswa)
    .maybeSingle();

  const sudahFinal = pengumpulan && ["selesai", "menunggu_acc", "lulus", "tidak_lulus"].includes(pengumpulan.status);

  let body: React.ReactNode;

  if (sudahFinal && pengumpulan) {
    const { data: jawabanList } = await admin
      .from("jawaban_kompetensi_siswa")
      .select("id_soal, jawaban_text, is_benar, nilai, soal_kompetensi(pertanyaan, tipe_soal), opsi_jawaban_kompetensi(label)")
      .eq("id_pengumpulan_kompetensi", pengumpulan.id_pengumpulan_kompetensi);

    const hasil: HasilSoal[] = (jawabanList ?? []).map((j) => ({
      id_soal: j.id_soal,
      pertanyaan: (j.soal_kompetensi as unknown as { pertanyaan: string } | null)?.pertanyaan ?? "-",
      tipe_soal: (j.soal_kompetensi as unknown as { tipe_soal: string } | null)?.tipe_soal ?? "essay",
      jawaban_text: j.jawaban_text,
      opsi_label: (j.opsi_jawaban_kompetensi as unknown as { label: string } | null)?.label ?? null,
      is_benar: j.is_benar ?? false,
      nilai: j.nilai ?? 0,
    }));

    body = <HasilView nilaiAkhir={pengumpulan.nilai} hasil={hasil} />;
  } else {
    const { data: soalRaw } = await admin
      .from("kompetensi_tugas_soal")
      .select("id_soal, nomor, soal_kompetensi(pertanyaan, tipe_soal, gambar_url)")
      .eq("id_kompetensi_tugas", tesId)
      .order("nomor");

    const idSoalList = (soalRaw ?? []).map((s) => s.id_soal);
    const { data: opsiRaw } = await admin
      .from("opsi_jawaban_kompetensi")
      .select("id_opsi_kompetensi, id_soal_kompetensi, label, isi_opsi")
      .in("id_soal_kompetensi", idSoalList.length ? idSoalList : [""])
      .order("label");

    const soalList: SoalForm[] = (soalRaw ?? []).map((s) => {
      const soal = s.soal_kompetensi as unknown as { pertanyaan: string; tipe_soal: "pg" | "essay"; gambar_url: string | null } | null;
      return {
        id_soal: s.id_soal,
        pertanyaan: soal?.pertanyaan ?? "-",
        tipe_soal: soal?.tipe_soal ?? "essay",
        gambar_url: soal?.gambar_url ?? null,
        opsi: (opsiRaw ?? [])
          .filter((o) => o.id_soal_kompetensi === s.id_soal)
          .map((o) => ({ id_opsi: o.id_opsi_kompetensi, label: o.label, isi_opsi: o.isi_opsi, gambar_url: null })),
      };
    });

    body = <TesFormClient idKompetensiTugas={tesId} soalList={soalList} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{tes.judul}</h1>
        {tes.deskripsi && <p className="text-sm text-muted-foreground">{tes.deskripsi}</p>}
      </div>
      {body}
    </div>
  );
}
