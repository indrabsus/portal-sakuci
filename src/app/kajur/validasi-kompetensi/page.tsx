import Link from "next/link";
import { requireKajurJurusan } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function ValidasiKompetensiPage() {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();

  const { data: tesList } = await supabase
    .from("kompetensi_tugas")
    .select("id_kompetensi_tugas, judul, kompetensi!inner(judul, id_jurusan)")
    .eq("kompetensi.id_jurusan", profile.id_jurusan)
    .order("created_at", { ascending: false });

  const idTesList = (tesList ?? []).map((t) => t.id_kompetensi_tugas);
  const { data: pengumpulanList } = await supabase
    .from("pengumpulan_kompetensi")
    .select("id_kompetensi_tugas, status")
    .in("id_kompetensi_tugas", idTesList.length ? idTesList : [""]);

  const menungguMap = new Map<string, number>();
  const selesaiMap = new Map<string, number>();
  for (const p of pengumpulanList ?? []) {
    if (p.status === "menunggu_acc") menungguMap.set(p.id_kompetensi_tugas, (menungguMap.get(p.id_kompetensi_tugas) ?? 0) + 1);
    if (["lulus", "tidak_lulus", "selesai"].includes(p.status)) selesaiMap.set(p.id_kompetensi_tugas, (selesaiMap.get(p.id_kompetensi_tugas) ?? 0) + 1);
  }

  const relevantTes = (tesList ?? []).filter((t) => (menungguMap.get(t.id_kompetensi_tugas) ?? 0) > 0 || (selesaiMap.get(t.id_kompetensi_tugas) ?? 0) > 0);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Validasi Tes Kompetensi</h1>
        <p className="text-sm text-muted-foreground">Periksa dan nilai jawaban essay siswa pada tes roadmap kompetensi</p>
      </div>

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Judul Tes</TableHead>
                <TableHead>Kompetensi</TableHead>
                <TableHead>Menunggu Validasi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relevantTes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Belum ada jawaban siswa</TableCell>
                </TableRow>
              )}
              {relevantTes.map((t) => (
                <TableRow key={t.id_kompetensi_tugas} className="hover:bg-accent/40">
                  <TableCell>{t.judul}</TableCell>
                  <TableCell>{(t.kompetensi as unknown as { judul: string } | null)?.judul ?? "-"}</TableCell>
                  <TableCell>
                    {(menungguMap.get(t.id_kompetensi_tugas) ?? 0) > 0 ? (
                      <Badge>{menungguMap.get(t.id_kompetensi_tugas)}</Badge>
                    ) : (
                      <Badge variant="secondary">0</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/kajur/validasi-kompetensi/${t.id_kompetensi_tugas}`} className="text-sm text-primary underline-offset-4 hover:underline">
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
