import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function PengumpulanListPage() {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const { data: mengajarList } = await supabase
    .from("mengajar")
    .select("id_mengajar, mapel(nama_mapel), kelas(nama_kelas)")
    .eq("id_guru", profile.id_guru ?? "");

  const idMengajarList = (mengajarList ?? []).map((m) => m.id_mengajar);
  const mengajarLabelMap = new Map(
    (mengajarList ?? []).map((m) => [
      m.id_mengajar,
      `${(m.mapel as unknown as { nama_mapel: string } | null)?.nama_mapel ?? "-"} - ${(m.kelas as unknown as { nama_kelas: string } | null)?.nama_kelas ?? "-"}`,
    ]),
  );

  const { data: tugasList } = await supabase
    .from("tugas")
    .select("id_tugas, judul, id_mengajar, status")
    .in("id_mengajar", idMengajarList.length ? idMengajarList : [""])
    .order("created_at", { ascending: false });

  const idTugasList = (tugasList ?? []).map((t) => t.id_tugas);
  const { data: pengumpulanList } = await supabase
    .from("pengumpulan_tugas")
    .select("id_tugas, status")
    .in("id_tugas", idTugasList.length ? idTugasList : [""]);

  const selesaiMap = new Map<string, number>();
  const dinilaiMap = new Map<string, number>();
  for (const p of pengumpulanList ?? []) {
    if (p.status === "selesai" || p.status === "dinilai") selesaiMap.set(p.id_tugas, (selesaiMap.get(p.id_tugas) ?? 0) + 1);
    if (p.status === "dinilai") dinilaiMap.set(p.id_tugas, (dinilaiMap.get(p.id_tugas) ?? 0) + 1);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengumpulan Tugas</h1>
        <p className="text-sm text-muted-foreground">Pilih tugas untuk memeriksa dan menilai jawaban siswa</p>
      </div>

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Judul Tugas</TableHead>
                <TableHead>Kelas/Mapel</TableHead>
                <TableHead>Terkumpul</TableHead>
                <TableHead>Dinilai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(tugasList ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Belum ada tugas</TableCell>
                </TableRow>
              )}
              {(tugasList ?? []).map((t) => (
                <TableRow key={t.id_tugas} className="hover:bg-accent/40">
                  <TableCell>{t.judul}</TableCell>
                  <TableCell>{mengajarLabelMap.get(t.id_mengajar) ?? "-"}</TableCell>
                  <TableCell>{selesaiMap.get(t.id_tugas) ?? 0}</TableCell>
                  <TableCell>{dinilaiMap.get(t.id_tugas) ?? 0}</TableCell>
                  <TableCell>
                    <Badge variant={t.status === "aktif" ? "default" : "secondary"}>{t.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/guru/pengumpulan/${t.id_tugas}`} className="text-sm text-primary underline-offset-4 hover:underline">
                      Periksa
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
