import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSiswaKelasInfo } from "@/lib/siswa";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const STATUS_LABEL: Record<string, string> = {
  belum: "Belum Mulai",
  proses: "Sedang Diproses",
  lulus: "Lulus",
  tidak_lulus: "Belum Lulus",
};

export default async function SiswaRoadmapPage() {
  const profile = await requireRole(["siswa"]);
  const supabase = await createClient();
  const kelasInfo = await getSiswaKelasInfo(profile.id_siswa ?? "");

  const { data: kompetensiList } = await supabase
    .from("kompetensi")
    .select("id_kompetensi, judul, tingkat, urutan, syarat_lulus, id_jurusan")
    .eq("aktif", true)
    .order("urutan");

  const relevan = (kompetensiList ?? []).filter((k) => !k.id_jurusan || k.id_jurusan === kelasInfo.id_jurusan);

  const { data: progresList } = await supabase
    .from("progres_kompetensi")
    .select("id_kompetensi, status, nilai")
    .eq("id_siswa", profile.id_siswa ?? "");

  const progresMap = new Map((progresList ?? []).map((p) => [p.id_kompetensi, p]));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Roadmap Belajar</h1>
        <p className="text-sm text-muted-foreground">Capai kompetensi untuk mendapatkan sertifikat</p>
      </div>

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Urutan</TableHead>
                <TableHead>Kompetensi</TableHead>
                <TableHead>Syarat Lulus</TableHead>
                <TableHead>Nilai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relevan.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Belum ada roadmap kompetensi</TableCell>
                </TableRow>
              )}
              {relevan.map((k) => {
                const p = progresMap.get(k.id_kompetensi);
                const status = p?.status ?? "belum";
                return (
                  <TableRow key={k.id_kompetensi} className="hover:bg-accent/40">
                    <TableCell>{k.urutan}</TableCell>
                    <TableCell>{k.judul}</TableCell>
                    <TableCell>{k.syarat_lulus}</TableCell>
                    <TableCell>{p?.nilai ?? "-"}</TableCell>
                    <TableCell>
                      <Badge variant={status === "lulus" ? "default" : status === "tidak_lulus" ? "destructive" : "secondary"}>
                        {STATUS_LABEL[status] ?? status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/siswa/roadmap/${k.id_kompetensi}`} className="text-sm text-primary underline-offset-4 hover:underline">
                        Lihat
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
