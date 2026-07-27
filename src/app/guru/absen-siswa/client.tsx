"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
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
import { bukaSesiAbsen } from "./actions";
import { IsiAbsenDialog } from "./isi-absen-dialog";

export type SesiRow = {
  id_sesi: string;
  tanggal: string;
  kelas_label: string;
  mapel_label: string;
  counts: { izin: number; sakit: number; dispen: number; alpa: number };
};

const STATUS_LABEL: Record<keyof SesiRow["counts"], string> = {
  izin: "Izin",
  sakit: "Sakit",
  dispen: "Dispen",
  alpa: "Tanpa Keterangan",
};

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function AbsenSiswaClient({
  rows,
  mengajarOptions,
}: {
  rows: SesiRow[];
  mengajarOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [idMengajar, setIdMengajar] = useState(mengajarOptions[0]?.value ?? "");
  const [error, setError] = useState<string | null>(null);
  const [fillSesiId, setFillSesiId] = useState<string | null>(null);

  function handleBuka() {
    setError(null);
    if (!idMengajar) {
      setError("Pilih kelas/mapel terlebih dahulu.");
      return;
    }
    const formData = new FormData();
    formData.set("id_mengajar", idMengajar);
    startTransition(async () => {
      const result = await bukaSesiAbsen(formData);
      if (!result.success || !result.id_sesi) {
        setError(result.message);
        return;
      }
      setNewDialogOpen(false);
      setFillSesiId(result.id_sesi);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Absen Siswa</h1>
          <p className="text-sm text-muted-foreground">Presensi harian siswa berdasarkan pembagian mengajar</p>
        </div>
        <Button
          onClick={() => { setError(null); setIdMengajar(mengajarOptions[0]?.value ?? ""); setNewDialogOpen(true); }}
          disabled={mengajarOptions.length === 0}
          className="gap-1.5 shadow-sm"
        >
          <Plus className="size-4" />
          Absen Baru
        </Button>
      </div>

      {mengajarOptions.length === 0 && (
        <Card className="shadow-sm">
          <div className="py-8 text-center text-sm text-muted-foreground">
            Anda belum punya pembagian mengajar. Hubungi admin/kajur untuk mengatur ini.
          </div>
        </Card>
      )}

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tanggal</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kelas</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mapel</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ringkasan</th>
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Aksi</th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Belum ada sesi absen</TableCell>
                </TableRow>
              )}
              {rows.map((row) => {
                const nonZero = (Object.keys(row.counts) as (keyof SesiRow["counts"])[]).filter((k) => row.counts[k] > 0);
                return (
                  <TableRow key={row.id_sesi} className="hover:bg-accent/40">
                    <TableCell>{formatTanggal(row.tanggal)}</TableCell>
                    <TableCell>{row.kelas_label}</TableCell>
                    <TableCell>{row.mapel_label}</TableCell>
                    <TableCell>
                      {nonZero.length === 0 ? (
                        <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">Semua Hadir</Badge>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {nonZero.map((k) => (
                            <Badge key={k} variant="secondary">{STATUS_LABEL[k]} {row.counts[k]}</Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setFillSesiId(row.id_sesi)}>
                        <ClipboardList className="size-3.5" />
                        Isi Absen
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Absen Baru</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
            <div className="flex flex-col gap-2">
              <Label>Kelas / Mapel</Label>
              <Select value={idMengajar} onValueChange={(v) => setIdMengajar(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kelas/mapel">
                    {(v: unknown) => mengajarOptions.find((m) => m.value === v)?.label ?? "Pilih kelas/mapel"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {mengajarOptions.map((m) => (
                    <SelectItem key={m.value} value={m.value} label={m.label}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Absen akan dibuat untuk tanggal hari ini.</p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleBuka} disabled={isPending}>
              {isPending ? "Membuka..." : "Lanjutkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <IsiAbsenDialog
        idSesi={fillSesiId}
        onOpenChange={(open) => !open && setFillSesiId(null)}
        onSaved={() => router.refresh()}
      />
    </div>
  );
}
