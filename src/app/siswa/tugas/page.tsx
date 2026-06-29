import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSiswaKelasInfo } from "@/lib/siswa";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const STATUS_LABEL: Record<string, string> = {
  belum: "Belum Dikerjakan",
  dikerjakan: "Sedang Dikerjakan",
  selesai: "Menunggu Dinilai",
  dinilai: "Sudah Dinilai",
};

export default async function SiswaTugasPage() {
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

  const { data: tugasList } = await supabase
    .from("tugas")
    .select("id_tugas, judul, deadline, id_mengajar, status")
    .in("id_mengajar", idMengajarList.length ? idMengajarList : [""])
    .eq("status", "aktif")
    .order("deadline", { ascending: true });

  const idTugasList = (tugasList ?? []).map((t) => t.id_tugas);
  const { data: pengumpulanList } = await supabase
    .from("pengumpulan_tugas")
    .select("id_tugas, status, nilai")
    .eq("id_siswa", profile.id_siswa ?? "")
    .in("id_tugas", idTugasList.length ? idTugasList : [""]);

  const pengumpulanMap = new Map((pengumpulanList ?? []).map((p) => [p.id_tugas, p]));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tugas</h1>
        <p className="text-sm text-muted-foreground">Tugas aktif di kelas {kelasInfo.nama_kelas ?? "-"}</p>
      </div>

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Judul Tugas</TableHead>
                <TableHead>Mapel</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nilai</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(tugasList ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Belum ada tugas</TableCell>
                </TableRow>
              )}
              {(tugasList ?? []).map((t) => {
                const p = pengumpulanMap.get(t.id_tugas);
                const status = p?.status ?? "belum";
                return (
                  <TableRow key={t.id_tugas} className="hover:bg-accent/40">
                    <TableCell>{t.judul}</TableCell>
                    <TableCell>{mengajarLabelMap.get(t.id_mengajar) ?? "-"}</TableCell>
                    <TableCell>{t.deadline ? new Date(t.deadline).toLocaleDateString("id-ID") : "-"}</TableCell>
                    <TableCell>
                      <Badge variant={status === "dinilai" ? "default" : status === "belum" ? "secondary" : "secondary"}>
                        {STATUS_LABEL[status] ?? status}
                      </Badge>
                    </TableCell>
                    <TableCell>{p?.nilai ?? "-"}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/siswa/tugas/${t.id_tugas}`} className="text-sm text-primary underline-offset-4 hover:underline">
                        {status === "belum" || status === "dikerjakan" ? "Kerjakan" : "Lihat"}
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
