import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { TugasFormClient, type SoalForm } from "./tugas-form";
import { HasilView, type HasilSoal } from "./hasil-view";

export default async function SiswaTugasDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireRole(["siswa"]);
  const { id } = await params;
  const idSiswa = profile.id_siswa;
  if (!idSiswa) redirect("/login");

  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: tugas } = await supabase
    .from("tugas")
    .select("id_tugas, judul, deskripsi, mengajar(id_kelas, mapel(nama_mapel))")
    .eq("id_tugas", id)
    .single();

  if (!tugas) notFound();

  const { data: pengumpulan } = await supabase
    .from("pengumpulan_tugas")
    .select("id_pengumpulan, status, nilai")
    .eq("id_tugas", id)
    .eq("id_siswa", idSiswa)
    .maybeSingle();

  const sudahSelesai = pengumpulan?.status === "selesai" || pengumpulan?.status === "dinilai";

  let body: React.ReactNode;

  if (sudahSelesai && pengumpulan) {
    const { data: jawabanList } = await admin
      .from("jawaban_tugas_siswa")
      .select("id_soal, jawaban_text, is_benar, nilai, bank_soal(pertanyaan, tipe_soal), opsi_jawaban(label)")
      .eq("id_pengumpulan", pengumpulan.id_pengumpulan);

    const hasil: HasilSoal[] = (jawabanList ?? []).map((j) => ({
      id_soal: j.id_soal,
      pertanyaan: (j.bank_soal as unknown as { pertanyaan: string } | null)?.pertanyaan ?? "-",
      tipe_soal: (j.bank_soal as unknown as { tipe_soal: string } | null)?.tipe_soal ?? "essay",
      jawaban_text: j.jawaban_text,
      opsi_label: (j.opsi_jawaban as unknown as { label: string } | null)?.label ?? null,
      is_benar: j.is_benar ?? false,
      nilai: j.nilai ?? 0,
    }));

    body = <HasilView nilaiAkhir={pengumpulan.nilai} hasil={hasil} />;
  } else {
    const { data: soalRaw } = await admin
      .from("tugas_soal")
      .select("id_soal, nomor, bank_soal(pertanyaan, tipe_soal, gambar_url)")
      .eq("id_tugas", id)
      .order("nomor");

    const { data: opsiRaw } = await admin
      .from("opsi_jawaban")
      .select("id_opsi, id_soal, label, isi_opsi, gambar_url")
      .in("id_soal", (soalRaw ?? []).map((s) => s.id_soal).length ? (soalRaw ?? []).map((s) => s.id_soal) : [""])
      .order("label");

    const soalList: SoalForm[] = (soalRaw ?? []).map((s) => {
      const soal = s.bank_soal as unknown as { pertanyaan: string; tipe_soal: "pg" | "essay"; gambar_url: string | null } | null;
      return {
        id_soal: s.id_soal,
        nomor: s.nomor,
        pertanyaan: soal?.pertanyaan ?? "-",
        tipe_soal: soal?.tipe_soal ?? "essay",
        gambar_url: soal?.gambar_url ?? null,
        opsi: (opsiRaw ?? [])
          .filter((o) => o.id_soal === s.id_soal)
          .map((o) => ({ id_opsi: o.id_opsi, label: o.label, isi_opsi: o.isi_opsi, gambar_url: o.gambar_url })),
      };
    });

    body = <TugasFormClient idTugas={id} soalList={soalList} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{tugas.judul}</h1>
        <p className="text-sm text-muted-foreground">
          {(tugas.mengajar as unknown as { mapel: { nama_mapel: string } | null } | null)?.mapel?.nama_mapel ?? "-"}
        </p>
        {tugas.deskripsi && <p className="mt-1 text-sm text-muted-foreground">{tugas.deskripsi}</p>}
      </div>
      {body}
    </div>
  );
}
