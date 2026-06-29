import Link from "next/link";
import { Award, Printer } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getRincianTesKompetensi, hitungNilaiAkhir } from "@/lib/kompetensi-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SiswaSertifikatPage() {
  const profile = await requireRole(["siswa"]);
  const supabase = await createClient();

  const { data: sertifikatRaw } = await supabase
    .from("sertifikat")
    .select("id_sertifikat, id_kompetensi, nomor_sertifikat, nilai, tanggal_terbit, kompetensi(judul)")
    .eq("id_siswa", profile.id_siswa ?? "")
    .eq("status", "aktif")
    .order("tanggal_terbit", { ascending: false });

  const sertifikatList = await Promise.all(
    (sertifikatRaw ?? []).map(async (s) => {
      const rincian = await getRincianTesKompetensi(supabase, profile.id_siswa ?? "", s.id_kompetensi);
      return { ...s, nilai: hitungNilaiAkhir(rincian) ?? s.nilai };
    }),
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sertifikat Saya</h1>
        <p className="text-sm text-muted-foreground">{(sertifikatList ?? []).length} sertifikat kompetensi diterima</p>
      </div>

      {(sertifikatList ?? []).length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada sertifikat. Selesaikan roadmap kompetensi untuk mendapatkannya.</p>
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
                <p className="text-xs text-muted-foreground font-mono">{s.nomor_sertifikat}</p>
                <p className="text-sm text-muted-foreground">Nilai: {s.nilai ?? "-"}</p>
                <p className="text-xs text-muted-foreground">
                  {s.tanggal_terbit ? new Date(s.tanggal_terbit).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                </p>
                <Link
                  href={`/siswa/sertifikat/cetak/${s.id_sertifikat}`}
                  target="_blank"
                  className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
                >
                  <Printer className="size-3.5" />
                  Cetak / Simpan PDF
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
