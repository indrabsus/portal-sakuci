"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Award, Ban, RotateCcw, Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTableControls } from "@/components/use-table-controls";
import { SortableHead, TablePagination } from "@/components/table-pagination";
import { terbitkanSertifikat, cabutSertifikat, aktifkanKembaliSertifikat, hapusSertifikat } from "./actions";

type PendingRow = {
  id_progres: string;
  id_siswa: string;
  id_kompetensi: string;
  nama_siswa: string;
  judul_kompetensi: string;
  nilai: number | null;
};

type SertifikatRow = {
  id_sertifikat: string;
  nomor_sertifikat: string | null;
  nama_siswa: string;
  judul_kompetensi: string;
  nilai: number | null;
  tanggal_terbit: string | null;
  status: string;
};

export function SertifikatClient({
  pending,
  terbit,
}: {
  pending: PendingRow[];
  terbit: SertifikatRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const pendingTable = useTableControls<PendingRow>(pending);
  const terbitTable = useTableControls<SertifikatRow>(terbit);
  const [deleteTarget, setDeleteTarget] = useState<SertifikatRow | null>(null);

  function handleTerbitkan(row: PendingRow) {
    setMessage(null);
    const formData = new FormData();
    formData.set("id_siswa", row.id_siswa);
    formData.set("id_kompetensi", row.id_kompetensi);
    formData.set("id_progres", row.id_progres);
    formData.set("nilai", String(row.nilai ?? 0));
    startTransition(async () => {
      const result = await terbitkanSertifikat(formData);
      setMessage(result.message);
      router.refresh();
    });
  }

  function handleCabut(idSertifikat: string) {
    const formData = new FormData();
    formData.set("id_sertifikat", idSertifikat);
    startTransition(async () => {
      await cabutSertifikat(formData);
      router.refresh();
    });
  }

  function handleAktifkan(idSertifikat: string) {
    const formData = new FormData();
    formData.set("id_sertifikat", idSertifikat);
    startTransition(async () => {
      await aktifkanKembaliSertifikat(formData);
      router.refresh();
    });
  }

  function handleHapus() {
    if (!deleteTarget) return;
    const formData = new FormData();
    formData.set("id_sertifikat", deleteTarget.id_sertifikat);
    startTransition(async () => {
      const result = await hapusSertifikat(formData);
      setMessage(result.message);
      setDeleteTarget(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sertifikat Siswa</h1>
        <p className="text-sm text-muted-foreground">Terbitkan dan kelola sertifikat kompetensi siswa</p>
      </div>

      {message && (
        <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{message}</p>
      )}

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Menunggu Penerbitan ({pending.length})</TabsTrigger>
          <TabsTrigger value="terbit">Sertifikat Terbit ({terbit.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="pt-3">
          <Card className="overflow-hidden p-0 shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <SortableHead label="Siswa" sortKey="nama_siswa" activeKey={pendingTable.sortKey} sortDir={pendingTable.sortDir} onSort={pendingTable.toggleSort} />
                    <SortableHead label="Kompetensi" sortKey="judul_kompetensi" activeKey={pendingTable.sortKey} sortDir={pendingTable.sortDir} onSort={pendingTable.toggleSort} />
                    <SortableHead label="Nilai" sortKey="nilai" activeKey={pendingTable.sortKey} sortDir={pendingTable.sortDir} onSort={pendingTable.toggleSort} />
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Aksi</th>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTable.rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        Tidak ada yang menunggu penerbitan
                      </TableCell>
                    </TableRow>
                  )}
                  {pendingTable.rows.map((row) => (
                    <TableRow key={row.id_progres} className="hover:bg-accent/40">
                      <TableCell>{row.nama_siswa}</TableCell>
                      <TableCell>{row.judul_kompetensi}</TableCell>
                      <TableCell>{row.nilai ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" className="gap-1.5" disabled={isPending} onClick={() => handleTerbitkan(row)}>
                          <Award className="size-3.5" />
                          Terbitkan
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              page={pendingTable.page}
              totalPages={pendingTable.totalPages}
              totalRows={pendingTable.totalRows}
              pageSize={pendingTable.pageSize}
              onPageChange={pendingTable.setPage}
              onPageSizeChange={pendingTable.setPageSize}
            />
          </Card>
        </TabsContent>

        <TabsContent value="terbit" className="pt-3">
          <Card className="overflow-hidden p-0 shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <SortableHead label="No. Sertifikat" sortKey="nomor_sertifikat" activeKey={terbitTable.sortKey} sortDir={terbitTable.sortDir} onSort={terbitTable.toggleSort} />
                    <SortableHead label="Siswa" sortKey="nama_siswa" activeKey={terbitTable.sortKey} sortDir={terbitTable.sortDir} onSort={terbitTable.toggleSort} />
                    <SortableHead label="Kompetensi" sortKey="judul_kompetensi" activeKey={terbitTable.sortKey} sortDir={terbitTable.sortDir} onSort={terbitTable.toggleSort} />
                    <SortableHead label="Status" sortKey="status" activeKey={terbitTable.sortKey} sortDir={terbitTable.sortDir} onSort={terbitTable.toggleSort} />
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Aksi</th>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {terbitTable.rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        Belum ada sertifikat terbit
                      </TableCell>
                    </TableRow>
                  )}
                  {terbitTable.rows.map((row) => (
                    <TableRow key={row.id_sertifikat} className="hover:bg-accent/40">
                      <TableCell className="font-mono text-xs">{row.nomor_sertifikat}</TableCell>
                      <TableCell>{row.nama_siswa}</TableCell>
                      <TableCell>{row.judul_kompetensi}</TableCell>
                      <TableCell>
                        {row.status === "aktif" ? <Badge>Aktif</Badge> : <Badge variant="secondary">Dicabut</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {row.status === "aktif" && (
                            <Link
                              href={`/kajur/sertifikat/cetak/${row.id_sertifikat}`}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-primary hover:bg-primary/10"
                            >
                              <Printer className="size-3.5" />
                              Cetak
                            </Link>
                          )}
                          {row.status === "aktif" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 text-destructive hover:bg-destructive/10"
                              disabled={isPending}
                              onClick={() => handleCabut(row.id_sertifikat)}
                            >
                              <Ban className="size-3.5" />
                              Cabut
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" className="gap-1.5" disabled={isPending} onClick={() => handleAktifkan(row.id_sertifikat)}>
                              <RotateCcw className="size-3.5" />
                              Aktifkan
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            disabled={isPending}
                            onClick={() => setDeleteTarget(row)}
                            aria-label="Hapus"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              page={terbitTable.page}
              totalPages={terbitTable.totalPages}
              totalRows={terbitTable.totalRows}
              pageSize={terbitTable.pageSize}
              onPageChange={terbitTable.setPage}
              onPageSizeChange={terbitTable.setPageSize}
            />
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus sertifikat ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Seluruh progres dan jawaban tes kompetensi <strong>{deleteTarget?.judul_kompetensi}</strong> milik{" "}
              <strong>{deleteTarget?.nama_siswa}</strong> akan ikut terhapus. Siswa harus mengerjakan ulang semua tes
              kompetensi ini dari awal untuk mendapatkan sertifikat baru. Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction disabled={isPending} onClick={handleHapus}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
