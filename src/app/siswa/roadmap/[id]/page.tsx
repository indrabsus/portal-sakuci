import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getKompetensiLockInfo } from "@/lib/kompetensi-progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle } from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  belum: "Belum Dikerjakan",
  dikerjakan: "Sedang Dikerjakan",
  selesai: "Selesai",
  menunggu_acc: "Menunggu Validasi",
  lulus: "Lulus",
  tidak_lulus: "Belum Lulus",
};

export default async function SiswaRoadmapDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireRole(["siswa"]);
  const { id } = await params;
  const supabase = await createClient();

  const { data: kompetensi } = await supabase
    .from("kompetensi")
    .select("id_kompetensi, judul, deskripsi, syarat_lulus")
    .eq("id_kompetensi", id)
    .single();

  if (!kompetensi) notFound();

  // Check if this kompetensi is locked
  const lockInfo = await getKompetensiLockInfo(supabase, profile.id_siswa ?? "", id);
  const isLocked = lockInfo?.isLocked ?? false;

  const { data: tesList } = await supabase
    .from("kompetensi_tugas")
    .select("id_kompetensi_tugas, judul, deadline, status")
    .eq("id_kompetensi", id)
    .eq("status", "aktif")
    .order("created_at");

  const idTesList = (tesList ?? []).map((t) => t.id_kompetensi_tugas);
  const { data: pengumpulanList } = await supabase
    .from("pengumpulan_kompetensi")
    .select("id_kompetensi_tugas, status, nilai")
    .eq("id_siswa", profile.id_siswa ?? "")
    .in("id_kompetensi_tugas", idTesList.length ? idTesList : [""]);

  const pengumpulanMap = new Map((pengumpulanList ?? []).map((p) => [p.id_kompetensi_tugas, p]));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{kompetensi.judul}</h1>
        {kompetensi.deskripsi && <p className="text-sm text-muted-foreground">{kompetensi.deskripsi}</p>}
        <p className="text-xs text-muted-foreground">Syarat lulus: nilai ≥ {kompetensi.syarat_lulus}</p>
      </div>

      {isLocked && lockInfo?.prevKompetensi && (
        <Card className="border-amber-200 bg-amber-50 p-4 shadow-sm">
          <div className="flex gap-3">
            <AlertCircle className="size-5 flex-shrink-0 text-amber-600 mt-0.5" />
            <div className="flex flex-col gap-1">
              <p className="font-medium text-amber-900">Kompetensi ini masih terkunci</p>
              <p className="text-sm text-amber-800">
                Anda harus menyelesaikan dan lulus kompetensi "<strong>{lockInfo.prevKompetensi.judul}</strong>" terlebih dahulu.
              </p>
              <p className="text-xs text-amber-700 mt-2">
                Status: <Badge variant="secondary">{lockInfo.prevKompetensi.status || "Belum Mulai"}</Badge>
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Judul Tes</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nilai</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(tesList ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Belum ada tes untuk kompetensi ini</TableCell>
                </TableRow>
              )}
              {(tesList ?? []).map((t) => {
                const p = pengumpulanMap.get(t.id_kompetensi_tugas);
                const status = p?.status ?? "belum";
                const sudahFinal = ["selesai", "menunggu_acc", "lulus", "tidak_lulus"].includes(status);
                return (
                  <TableRow key={t.id_kompetensi_tugas} className={`hover:bg-accent/40 ${isLocked ? "opacity-50" : ""}`}>
                    <TableCell>{t.judul}</TableCell>
                    <TableCell>{t.deadline ? new Date(t.deadline).toLocaleDateString("id-ID") : "-"}</TableCell>
                    <TableCell>
                      <Badge variant={status === "lulus" ? "default" : status === "tidak_lulus" ? "destructive" : "secondary"}>
                        {STATUS_LABEL[status] ?? status}
                      </Badge>
                    </TableCell>
                    <TableCell>{(status === "lulus" || status === "tidak_lulus") && p?.nilai ? p.nilai : "-"}</TableCell>
                    <TableCell className="text-right">
                      {isLocked ? (
                        <span className="text-xs text-muted-foreground cursor-not-allowed">Terkunci</span>
                      ) : (
                        <Link href={`/siswa/roadmap/${id}/${t.id_kompetensi_tugas}`} className="text-sm text-primary underline-offset-4 hover:underline">
                          {sudahFinal ? "Lihat" : "Kerjakan"}
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
