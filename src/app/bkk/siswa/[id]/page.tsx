import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, Printer, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { InitialsAvatar } from "@/components/initials-avatar";
import { YoutubeThumbnail } from "@/components/youtube-thumbnail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function BkkSiswaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: siswa } = await supabase
    .from("siswa")
    .select("id_siswa, nama_lengkap, nisn, jenkel, tempat_lahir, tanggal_lahir, agama, foto_url")
    .eq("id_siswa", id)
    .single();

  if (!siswa) notFound();

  const { data: siswaKelas } = await supabase
    .from("siswa_kelas")
    .select("kelas(nama_kelas, jurusan(nama_jurusan))")
    .eq("id_siswa", id)
    .eq("aktif", true)
    .maybeSingle();

  const kelas = siswaKelas?.kelas as unknown as { nama_kelas: string; jurusan: { nama_jurusan: string } | null } | null;

  const [{ data: sertifikatList }, { data: projectList }] = await Promise.all([
    supabase
      .from("sertifikat")
      .select("id_sertifikat, nomor_sertifikat, nilai, tanggal_terbit, kompetensi(judul)")
      .eq("id_siswa", id)
      .eq("status", "aktif")
      .order("tanggal_terbit", { ascending: false }),
    supabase
      .from("project_siswa")
      .select(
        "id_project, nama_project, deskripsi, link_youtube, created_at, kelas(nama_kelas, jurusan(nama_jurusan)), tahun_ajaran(nama_tahun_ajaran)",
      )
      .eq("id_siswa", id)
      .eq("status", "approved")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-sm">
        <CardContent className="flex flex-col items-start gap-4 pt-6 sm:flex-row sm:items-center">
          <InitialsAvatar name={siswa.nama_lengkap} fotoUrl={siswa.foto_url} className="size-20 text-2xl" />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">{siswa.nama_lengkap}</h1>
            <p className="text-sm text-muted-foreground">
              NISN: {siswa.nisn ?? "-"} &middot; {kelas?.nama_kelas ?? "-"} &middot; {kelas?.jurusan?.nama_jurusan ?? "-"}
            </p>
            <p className="text-sm text-muted-foreground">
              {siswa.jenkel === "L" ? "Laki-laki" : siswa.jenkel === "P" ? "Perempuan" : "-"}
              {siswa.tempat_lahir && `, ${siswa.tempat_lahir}`}
              {siswa.tanggal_lahir && ` (${new Date(siswa.tanggal_lahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })})`}
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-bold tracking-tight">Sertifikat Kompetensi ({(sertifikatList ?? []).length})</h2>

        {(sertifikatList ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Siswa ini belum memiliki sertifikat kompetensi.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(sertifikatList ?? []).map((s) => (
              <Card key={s.id_sertifikat} className="shadow-sm">
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Award className="size-5" />
                  </div>
                  <CardTitle className="text-base">{(s.kompetensi as unknown as { judul: string } | null)?.judul ?? "-"}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <p className="font-mono text-xs text-muted-foreground">{s.nomor_sertifikat}</p>
                  <p className="text-sm text-muted-foreground">Nilai: {s.nilai ?? "-"}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.tanggal_terbit ? new Date(s.tanggal_terbit).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                  </p>
                  <Link
                    href={`/bkk/siswa/${id}/sertifikat/${s.id_sertifikat}`}
                    target="_blank"
                    className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
                  >
                    <Printer className="size-3.5" />
                    Lihat Sertifikat
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold tracking-tight">Project & Inovasi ({(projectList ?? []).length})</h2>

        {(projectList ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Siswa ini belum membagikan project atau inovasi.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(projectList ?? []).map((p) => {
              const pKelas = p.kelas as unknown as { nama_kelas: string; jurusan: { nama_jurusan: string } | null } | null;
              const pTahunAjaran = p.tahun_ajaran as unknown as { nama_tahun_ajaran: string } | null;
              return (
              <Card key={p.id_project} className="overflow-hidden shadow-sm">
                {p.link_youtube && (
                  <div className="px-4 pt-4">
                    <YoutubeThumbnail url={p.link_youtube} />
                  </div>
                )}
                <CardHeader>
                  {!p.link_youtube && (
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Sparkles className="size-5" />
                    </div>
                  )}
                  <CardTitle className="text-base">{p.nama_project}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {pKelas?.nama_kelas ?? "-"} {pKelas?.jurusan?.nama_jurusan ? `${pKelas.jurusan.nama_jurusan} ` : ""}
                    &middot; TA {pTahunAjaran?.nama_tahun_ajaran ?? "-"}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <p className="line-clamp-3 text-sm text-muted-foreground">{p.deskripsi ?? "-"}</p>
                </CardContent>
              </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
