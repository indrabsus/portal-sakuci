"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTableControls } from "@/components/use-table-controls";
import { SortableHead, TablePagination } from "@/components/table-pagination";
import { createMengajar, hapusMengajar } from "./actions";

type MengajarRow = {
  id_mengajar: string;
  mapel_nama: string;
  kelas_nama: string;
  tahun_ajaran_nama: string;
};

type Opsi = { value: string; label: string };

export function MengajarClient({
  rows,
  mapelOptions,
  kelasOptions,
  tahunAjaranOptions,
}: {
  rows: MengajarRow[];
  mapelOptions: Opsi[];
  kelasOptions: Opsi[];
  tahunAjaranOptions: Opsi[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const table = useTableControls<MengajarRow>(rows);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [idMapel, setIdMapel] = useState("");
  const [idKelas, setIdKelas] = useState("");
  const [idTahunAjaran, setIdTahunAjaran] = useState(tahunAjaranOptions[0]?.value ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleAdd() {
    if (!idMapel || !idKelas || !idTahunAjaran) {
      setError("Mapel, kelas, dan tahun ajaran wajib dipilih.");
      return;
    }
    setError(null);
    const formData = new FormData();
    formData.set("id_mapel", idMapel);
    formData.set("id_kelas", idKelas);
    formData.set("id_tahun_ajaran", idTahunAjaran);
    startTransition(async () => {
      const result = await createMengajar(formData);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setDialogOpen(false);
      setIdMapel("");
      setIdKelas("");
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    const formData = new FormData();
    formData.set("id_mengajar", id);
    startTransition(async () => {
      await hapusMengajar(formData);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pembagian Mengajar</h1>
          <p className="text-sm text-muted-foreground">Mapel dan kelas yang Anda ajar</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-1.5 shadow-sm">
          <Plus className="size-4" />
          Tambah
        </Button>
      </div>

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <SortableHead label="Mata Pelajaran" sortKey="mapel_nama" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Kelas" sortKey="kelas_nama" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Tahun Ajaran" sortKey="tahun_ajaran_nama" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Aksi</th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Belum ada pembagian mengajar</TableCell>
                </TableRow>
              )}
              {table.rows.map((row) => (
                <TableRow key={row.id_mengajar} className="hover:bg-accent/40">
                  <TableCell>{row.mapel_nama}</TableCell>
                  <TableCell>{row.kelas_nama}</TableCell>
                  <TableCell>{row.tahun_ajaran_nama}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:bg-destructive/10"
                      disabled={isPending}
                      onClick={() => handleDelete(row.id_mengajar)}
                      aria-label="Hapus"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Pembagian Mengajar</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

            <Select value={idMapel} onValueChange={(v) => setIdMapel(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih mata pelajaran">
                  {(v: unknown) => mapelOptions.find((m) => m.value === v)?.label ?? "Pilih mata pelajaran"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {mapelOptions.map((m) => (
                  <SelectItem key={m.value} value={m.value} label={m.label}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={idKelas} onValueChange={(v) => setIdKelas(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kelas">
                  {(v: unknown) => kelasOptions.find((k) => k.value === v)?.label ?? "Pilih kelas"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {kelasOptions.map((k) => (
                  <SelectItem key={k.value} value={k.value} label={k.label}>{k.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={idTahunAjaran} onValueChange={(v) => setIdTahunAjaran(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih tahun ajaran">
                  {(v: unknown) => tahunAjaranOptions.find((t) => t.value === v)?.label ?? "Pilih tahun ajaran"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tahunAjaranOptions.map((t) => (
                  <SelectItem key={t.value} value={t.value} label={t.label}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DialogFooter>
              <Button onClick={handleAdd} disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
