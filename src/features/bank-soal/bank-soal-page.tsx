"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
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
import { SoalFormDialog } from "./soal-form-dialog";
import { deleteBankSoal } from "./actions";
import type { BankSoalRow } from "./types";

export function BankSoalPage({
  rows,
  mapelOptions,
}: {
  rows: BankSoalRow[];
  mapelOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const table = useTableControls<BankSoalRow>(rows);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BankSoalRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BankSoalRow | null>(null);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(row: BankSoalRow) {
    setEditing(row);
    setDialogOpen(true);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const formData = new FormData();
    formData.set("id_soal", deleteTarget.id_soal);
    startTransition(async () => {
      await deleteBankSoal(formData);
      setDeleteTarget(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bank Soal</h1>
          <p className="text-sm text-muted-foreground">{rows.length} soal tersimpan</p>
        </div>
        <Button onClick={openCreate} className="gap-1.5 shadow-sm">
          <Plus className="size-4" />
          Tambah Soal
        </Button>
      </div>

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <SortableHead label="Pertanyaan" sortKey="pertanyaan" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Mapel" sortKey="mapel_nama" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Tipe" sortKey="tipe_soal" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Kesulitan" sortKey="tingkat_kesulitan" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Aksi</th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Belum ada soal
                  </TableCell>
                </TableRow>
              )}
              {table.rows.map((row) => (
                <TableRow key={row.id_soal} className="transition-colors hover:bg-accent/40">
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2 text-sm">{row.pertanyaan}</p>
                    {row.gambar_url && (
                      <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <ImageIcon className="size-3" /> ada gambar
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{row.mapel_nama ?? "-"}</TableCell>
                  <TableCell>
                    <Badge variant={row.tipe_soal === "pg" ? "default" : "secondary"}>
                      {row.tipe_soal === "pg" ? `PG (${row.jumlah_opsi})` : "Essay"}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{row.tingkat_kesulitan ?? "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(row)} aria-label="Edit">
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10"
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
          page={table.page}
          totalPages={table.totalPages}
          totalRows={table.totalRows}
          pageSize={table.pageSize}
          onPageChange={table.setPage}
          onPageSizeChange={table.setPageSize}
        />
      </Card>

      <SoalFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        mapelOptions={mapelOptions}
        onSaved={() => router.refresh()}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus soal ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Opsi jawaban terkait juga akan terhapus. Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction disabled={isPending} onClick={handleDelete}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
