"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
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
import { buatNilaiManual, hapusNilaiManual } from "./actions";
import { IsiNilaiDialog } from "./isi-nilai-dialog";

export type BatchRow = {
  id_tugas: string;
  judul: string;
  semester: string;
  tanggal: string;
  kelas_label: string;
  mapel_label: string;
  jumlah_dinilai: number;
  jumlah_siswa: number;
  rata_rata: number | null;
};

const SEMESTER_OPTIONS = [
  { value: "ganjil", label: "Ganjil" },
  { value: "genap", label: "Genap" },
];

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function NilaiManualClient({
  rows,
  mengajarOptions,
}: {
  rows: BatchRow[];
  mengajarOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [idMengajar, setIdMengajar] = useState(mengajarOptions[0]?.value ?? "");
  const [judul, setJudul] = useState("");
  const [semester, setSemester] = useState("ganjil");
  const [error, setError] = useState<string | null>(null);
  const [fillTugasId, setFillTugasId] = useState<string | null>(null);

  function openNewDialog() {
    setError(null);
    setIdMengajar(mengajarOptions[0]?.value ?? "");
    setJudul("");
    setSemester("ganjil");
    setNewDialogOpen(true);
  }

  function handleBuat() {
    setError(null);
    if (!idMengajar || !judul.trim()) {
      setError("Kelas/mapel dan judul penilaian wajib diisi.");
      return;
    }
    const formData = new FormData();
    formData.set("id_mengajar", idMengajar);
    formData.set("judul", judul.trim());
    formData.set("semester", semester);
    startTransition(async () => {
      const result = await buatNilaiManual(formData);
      if (!result.success || !result.id_tugas) {
        setError(result.message);
        return;
      }
      setNewDialogOpen(false);
      setFillTugasId(result.id_tugas);
    });
  }

  function handleHapus(row: BatchRow) {
    if (!confirm(`Hapus penilaian "${row.judul}"? Semua nilai siswa di dalamnya akan ikut terhapus.`)) return;
    const formData = new FormData();
    formData.set("id_tugas", row.id_tugas);
    startTransition(async () => {
      const result = await hapusNilaiManual(formData);
      if (!result.success) {
        alert(result.message);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nilai Manual</h1>
          <p className="text-sm text-muted-foreground">Penilaian langsung untuk tugas offline, tanpa siswa mengerjakan di portal</p>
        </div>
        <Button onClick={openNewDialog} disabled={mengajarOptions.length === 0} className="gap-1.5 shadow-sm">
          <Plus className="size-4" />
          Nilai Manual Baru
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
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Judul</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kelas</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mapel</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tanggal</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dinilai</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rata-rata</th>
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Aksi</th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Belum ada penilaian manual</TableCell>
                </TableRow>
              )}
              {rows.map((row) => (
                <TableRow key={row.id_tugas} className="hover:bg-accent/40">
                  <TableCell className="font-medium">{row.judul}</TableCell>
                  <TableCell>{row.kelas_label}</TableCell>
                  <TableCell>{row.mapel_label}</TableCell>
                  <TableCell>{formatTanggal(row.tanggal)}</TableCell>
                  <TableCell>
                    <Badge variant={row.jumlah_dinilai >= row.jumlah_siswa && row.jumlah_siswa > 0 ? "default" : "secondary"}>
                      {row.jumlah_dinilai}/{row.jumlah_siswa}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.rata_rata ?? "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setFillTugasId(row.id_tugas)}>
                        <Pencil className="size-3.5" />
                        Isi Nilai
                      </Button>
                      <Button variant="ghost" size="icon" disabled={isPending} onClick={() => handleHapus(row)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nilai Manual Baru</DialogTitle>
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
            </div>
            <div className="flex flex-col gap-2">
              <Label>Judul Penilaian</Label>
              <Input
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Mis. Ulangan Harian 1, Praktik Offline"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Semester</Label>
              <Select value={semester} onValueChange={(v) => v && setSemester(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue>{SEMESTER_OPTIONS.find((s) => s.value === semester)?.label}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SEMESTER_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value} label={s.label}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleBuat} disabled={isPending}>
              {isPending ? "Membuat..." : "Lanjutkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <IsiNilaiDialog
        idTugas={fillTugasId}
        onOpenChange={(open) => !open && setFillTugasId(null)}
        onSaved={() => router.refresh()}
      />
    </div>
  );
}
