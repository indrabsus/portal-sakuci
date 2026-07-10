"use client";

import { useState, useTransition } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Image as ImageIcon, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { KopSuratPrint } from "@/components/kop-surat-print";
import { printPortraitA4 } from "@/lib/print-portrait";
import { cn } from "@/lib/utils";
import { SoalFormDialog } from "./soal-form-dialog";
import { deleteBankSoal } from "./actions";
import type { BankSoalRow } from "./types";

type PrintMode = "jawaban" | "soal" | null;

function SoalCetak({ row, index, withAnswer }: { row: BankSoalRow; index: number; withAnswer: boolean }) {
  return (
    <div className="mb-4">
      <p className="font-semibold">
        {index + 1}. {row.pertanyaan}
      </p>
      {row.gambar_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={row.gambar_url} alt="" className="my-2 max-h-56 max-w-full object-contain" />
      )}
      {row.tipe_soal === "pg" ? (
        <div className="mt-1 ml-4">
          {(row.opsi ?? []).map((o) => (
            <p key={o.label} className={cn("mb-0.5", withAnswer && o.is_benar && "font-bold underline")}>
              {o.label}. {o.isi_opsi}
            </p>
          ))}
        </div>
      ) : (
        <div className="mt-3 ml-4">
          <div className="mb-4 border-b border-black" />
          <div className="mb-4 border-b border-black" />
          <div className="mb-4 border-b border-black" />
        </div>
      )}
    </div>
  );
}

export function BankSoalPage({
  rows,
  mapelOptions,
  namaGuru,
}: {
  rows: BankSoalRow[];
  mapelOptions: { value: string; label: string }[];
  namaGuru: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const table = useTableControls<BankSoalRow>(rows);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BankSoalRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BankSoalRow | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [namaGuruCetak, setNamaGuruCetak] = useState(namaGuru);
  const [kelasCetak, setKelasCetak] = useState("");
  const [printMode, setPrintMode] = useState<PrintMode>(null);

  const selectedRows = rows.filter((r) => selected.has(r.id_soal));
  const pageAllSelected = table.rows.length > 0 && table.rows.every((r) => selected.has(r.id_soal));

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAllOnPage() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (pageAllSelected) {
        for (const r of table.rows) next.delete(r.id_soal);
      } else {
        for (const r of table.rows) next.add(r.id_soal);
      }
      return next;
    });
  }

  function handleCetak(mode: "jawaban" | "soal") {
    if (selectedRows.length === 0) return;
    flushSync(() => setPrintMode(mode));
    printPortraitA4();
    setPrintMode(null);
  }

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

  const mapelCetakLabel = Array.from(new Set(selectedRows.map((r) => r.mapel_nama ?? "-"))).join(", ");

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-col gap-4">
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

        <Card className="flex flex-col gap-3 p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-col gap-2">
              <Label>Nama Guru (untuk cetak)</Label>
              <Input
                value={namaGuruCetak}
                onChange={(e) => setNamaGuruCetak(e.target.value)}
                placeholder="mis. Indra Batara, S.Pd, Gr"
                className="sm:w-56"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Kelas (untuk cetak)</Label>
              <Input
                value={kelasCetak}
                onChange={(e) => setKelasCetak(e.target.value)}
                placeholder="mis. XII PPLG 1"
                className="sm:w-56"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-1.5"
              disabled={selectedRows.length === 0}
              onClick={() => handleCetak("soal")}
            >
              <Printer className="size-4" />
              Cetak Soal Saja ({selectedRows.length})
            </Button>
            <Button
              className="gap-1.5 shadow-sm"
              disabled={selectedRows.length === 0}
              onClick={() => handleCetak("jawaban")}
            >
              <Printer className="size-4" />
              Cetak Soal + Jawaban ({selectedRows.length})
            </Button>
          </div>
        </Card>

        <Card className="overflow-hidden p-0 shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <th className="w-10 px-4 py-2">
                    <Checkbox checked={pageAllSelected} onCheckedChange={toggleSelectAllOnPage} />
                  </th>
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
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Belum ada soal
                    </TableCell>
                  </TableRow>
                )}
                {table.rows.map((row) => (
                  <TableRow key={row.id_soal} className="transition-colors hover:bg-accent/40">
                    <TableCell>
                      <Checkbox checked={selected.has(row.id_soal)} onCheckedChange={() => toggleSelect(row.id_soal)} />
                    </TableCell>
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

      <div className="sr-only bg-white text-black print:not-sr-only">
        <KopSuratPrint />

        {printMode && (
          <>
            <p className="mt-4 text-center text-base font-bold uppercase">
              {printMode === "jawaban" ? "Naskah Soal & Kunci Jawaban" : "Naskah Soal"}
            </p>

            <div className="mt-4 mb-4 text-sm">
              <p>Nama Guru : {namaGuruCetak || "-"}</p>
              <p>Mata Pelajaran : {mapelCetakLabel || "-"}</p>
              <p>Kelas : {kelasCetak || "-"}</p>
            </div>

            <div className="text-sm">
              {selectedRows.map((row, idx) => (
                <SoalCetak key={row.id_soal} row={row} index={idx} withAnswer={printMode === "jawaban"} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
