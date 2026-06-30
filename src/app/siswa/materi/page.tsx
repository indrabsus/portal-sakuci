import { Video, FileText, AlignLeft, ExternalLink } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSiswaKelasInfo } from "@/lib/siswa";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YoutubeThumbnail } from "@/components/youtube-thumbnail";

function getTipe(isi: string | null, fileUrl: string | null): "teks" | "yt" | "file" {
  if (fileUrl) return "file";
  if (isi?.includes("youtube.com") || isi?.includes("youtu.be")) return "yt";
  return "teks";
}

function formatTanggal(tanggal: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(tanggal));
}

export default async function SiswaMateriPage() {
  const profile = await requireRole(["siswa"]);
  const supabase = await createClient();
  const kelasInfo = await getSiswaKelasInfo(profile.id_siswa ?? "");

  const { data: mengajarList } = kelasInfo.id_kelas
    ? await supabase.from("mengajar").select("id_mengajar, mapel(nama_mapel)").eq("id_kelas", kelasInfo.id_kelas)
    : { data: [] as { id_mengajar: string; mapel: unknown }[] };

  const mengajarLabelMap = new Map(
    (mengajarList ?? []).map((m) => [m.id_mengajar, (m.mapel as unknown as { nama_mapel: string } | null)?.nama_mapel ?? "-"]),
  );
  const idMengajarList = (mengajarList ?? []).map((m) => m.id_mengajar);

  const { data: materiList } = await supabase
    .from("materi")
    .select("id_materi, id_mengajar, judul, isi, file_url, created_at")
    .in("id_mengajar", idMengajarList.length ? idMengajarList : [""])
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Materi</h1>
        <p className="text-sm text-muted-foreground">Materi dari guru di kelas {kelasInfo.nama_kelas ?? "-"}</p>
      </div>

      {(materiList ?? []).length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada materi.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(materiList ?? []).map((m) => {
            const tipe = getTipe(m.isi, m.file_url);
            return (
              <Card key={m.id_materi} className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{m.judul}</CardTitle>
                    {tipe === "file" ? (
                      <Badge variant="secondary" className="gap-1"><FileText className="size-3" /> File</Badge>
                    ) : tipe === "yt" ? (
                      <Badge variant="secondary" className="gap-1"><Video className="size-3" /> Video</Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1"><AlignLeft className="size-3" /> Teks</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{mengajarLabelMap.get(m.id_mengajar) ?? "-"}</p>
                  <p className="text-xs text-muted-foreground">Dipublikasikan {formatTanggal(m.created_at)}</p>
                </CardHeader>
                <CardContent>
                  {tipe === "teks" && <p className="whitespace-pre-wrap text-sm">{m.isi}</p>}
                  {tipe === "yt" && <YoutubeThumbnail url={m.isi} />}
                  {tipe === "file" && (
                    <a href={m.file_url ?? "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline">
                      Buka File <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
