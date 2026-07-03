import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSiswaKelasInfo } from "@/lib/siswa";
import { isKompetensiLocked } from "@/lib/kompetensi-progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lock } from "lucide-react";

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

  const kompetensiQuery = supabase
    .from("kompetensi")
    .select("id_kompetensi, judul, tingkat, urutan, syarat_lulus, id_jurusan")
    .eq("aktif", true)
    .order("tingkat")
    .order("urutan");

  if (kelasInfo.tingkat) kompetensiQuery.lte("tingkat", kelasInfo.tingkat);
  if (kelasInfo.id_jurusan) kompetensiQuery.eq("id_jurusan", kelasInfo.id_jurusan);

  const { data: kompetensiList } = await kompetensiQuery;
  const relevan = kompetensiList ?? [];

  const { data: progresList } = await supabase
    .from("progres_kompetensi")
    .select("id_kompetensi, status, nilai")
    .eq("id_siswa", profile.id_siswa ?? "");

  const progresMap = new Map((progresList ?? []).map((p) => [p.id_kompetensi, p]));

  // Check lock status for each kompetensi
  const lockStatusMap = new Map<string, boolean>();
  for (const k of relevan) {
    const isLocked = await isKompetensiLocked(supabase, profile.id_siswa ?? "", k.id_kompetensi);
    lockStatusMap.set(k.id_kompetensi, isLocked);
  }

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
                const isLocked = lockStatusMap.get(k.id_kompetensi) ?? false;
                return (
                  <TableRow key={k.id_kompetensi} className={`hover:bg-accent/40 ${isLocked ? "opacity-60" : ""}`}>
                    <TableCell>{k.urutan}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {k.judul}
                        {isLocked && <Lock className="size-4 text-muted-foreground" />}
                      </div>
                    </TableCell>
                    <TableCell>{k.syarat_lulus}</TableCell>
                    <TableCell>{(status === "lulus" || status === "tidak_lulus") && p?.nilai ? p.nilai : "-"}</TableCell>
                    <TableCell>
                      <Badge variant={status === "lulus" ? "default" : status === "tidak_lulus" ? "destructive" : "secondary"}>
                        {STATUS_LABEL[status] ?? status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {isLocked ? (
                        <span className="text-xs text-muted-foreground">Terkunci</span>
                      ) : (
                        <Link href={`/siswa/roadmap/${k.id_kompetensi}`} className="text-sm text-primary underline-offset-4 hover:underline">
                          Lihat
                        </Link>
                      )}
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
