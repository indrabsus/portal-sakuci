"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Ban, RotateCcw, Printer, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { cabutSertifikat, aktifkanKembaliSertifikat } from "../sertifikat/actions";
import { buatSertifikatManual, hapusSertifikatManual } from "./actions";

type SiswaOption = { id_siswa: string; nama_lengkap: string; nisn: string | null; kelas: string };

type SertifikatManualRow = {
  id_sertifikat: string;
  nomor_sertifikat: string | null;
  nama_siswa: string;
  judul_manual: string;
  nilai: number | null;
  tanggal_terbit: string | null;
  status: string;
  adaTtdKepsek: boolean;
};

const SEMUA_KELAS = "__semua__";

export function SertifikatManualClient({
  siswaList,
  kelasOptions,
  rows,
  namaKepalaSekolah,
}: {
  siswaList: SiswaOption[];
  kelasOptions: string[];
  rows: SertifikatManualRow[];
  namaKepalaSekolah: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const table = useTableControls<SertifikatManualRow>(rows);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SertifikatManualRow | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [selectedSiswa, setSelectedSiswa] = useState<Set<string>>(new Set());
  const [filterKelas, setFilterKelas] = useState(SEMUA_KELAS);
  const [filterNama, setFilterNama] = useState("");
  const [judulManual, setJudulManual] = useState("");
  const [nilai, setNilai] = useState("");
  const [sertakanKepsek, setSertakanKepsek] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredSiswa = siswaList.filter(
    (s) =>
      (filterKelas === SEMUA_KELAS || s.kelas === filterKelas) &&
      s.nama_lengkap.toLowerCase().includes(filterNama.toLowerCase()),
  );
  const allFilteredSelected = filteredSiswa.length > 0 && filteredSiswa.every((s) => selectedSiswa.has(s.id_siswa));

  function resetForm() {
    setSelectedSiswa(new Set());
    setFilterKelas(SEMUA_KELAS);
    setFilterNama("");
    setJudulManual("");
    setNilai("");
    setSertakanKepsek(false);
    setFormError(null);
  }

  function toggleSiswa(idSiswa: string) {
    setSelectedSiswa((prev) => {
      const next = new Set(prev);
      if (next.has(idSiswa)) next.delete(idSiswa);
      else next.add(idSiswa);
      return next;
    });
  }

  function toggleAllFiltered() {
    setSelectedSiswa((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        for (const s of filteredSiswa) next.delete(s.id_siswa);
      } else {
        for (const s of filteredSiswa) next.add(s.id_siswa);
      }
      return next;
    });
  }

  function handleSubmit() {
    setFormError(null);
    if (selectedSiswa.size === 0 || !judulManual.trim()) {
      setFormError("Pilih minimal satu siswa dan isi judul kompetensi.");
      return;
    }
    if (nilai.trim() !== "") {
      const nilaiNum = Number(nilai);
      if (!Number.isFinite(nilaiNum) || nilaiNum < 0 || nilaiNum > 100) {
        setFormError("Nilai harus berupa angka 0-100, atau kosongkan jika tidak perlu.");
        return;
      }
    }

    const formData = new FormData();
    formData.set("id_siswa_list", JSON.stringify(Array.from(selectedSiswa)));
    formData.set("judul_manual", judulManual.trim());
    formData.set("nilai", nilai.trim());
    if (sertakanKepsek) formData.set("sertakan_kepsek", "on");

    startTransition(async () => {
      const result = await buatSertifikatManual(formData);
      if (!result.success) {
        setFormError(result.message);
        return;
      }
      setDialogOpen(false);
      setMessage(result.message);
      resetForm();
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
      const result = await hapusSertifikatManual(formData);
      setMessage(result.message);
      setDeleteTarget(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sertifikat Manual</h1>
          <p className="text-sm text-muted-foreground">
            Terbitkan sertifikat dengan kompetensi dan nilai yang diisi manual
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-1.5 shadow-sm">
          <Plus className="size-4" />
          Buat Sertifikat Manual
        </Button>
      </div>

      {message && <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{message}</p>}

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <SortableHead label="No. Sertifikat" sortKey="nomor_sertifikat" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Siswa" sortKey="nama_siswa" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Judul Kompetensi" sortKey="judul_manual" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Nilai" sortKey="nilai" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Status" sortKey="status" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Aksi</th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Belum ada sertifikat manual
                  </TableCell>
                </TableRow>
              )}
              {table.rows.map((row) => (
                <TableRow key={row.id_sertifikat} className="hover:bg-accent/40">
                  <TableCell className="font-mono text-xs">{row.nomor_sertifikat}</TableCell>
                  <TableCell>{row.nama_siswa}</TableCell>
                  <TableCell>
                    {row.judul_manual}
                    {row.adaTtdKepsek && (
                      <Badge variant="outline" className="ml-1.5 align-middle text-[10px]">
                        + TTD Kepsek
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{row.nilai ?? "-"}</TableCell>
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
          page={table.page}
          totalPages={table.totalPages}
          totalRows={table.totalRows}
          pageSize={table.pageSize}
          onPageChange={table.setPage}
          onPageSizeChange={table.setPageSize}
        />
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Buat Sertifikat Manual</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {formError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</p>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Pilih Siswa ({selectedSiswa.size} terpilih)</Label>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={filterNama}
                    onChange={(e) => setFilterNama(e.target.value)}
                    placeholder="Cari nama siswa..."
                    className="pl-8"
                  />
                </div>
                <Select value={filterKelas} onValueChange={(v) => setFilterKelas(v ?? SEMUA_KELAS)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue>{filterKelas === SEMUA_KELAS ? "Semua Kelas" : filterKelas}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SEMUA_KELAS} label="Semua Kelas">Semua Kelas</SelectItem>
                    {kelasOptions.map((k) => (
                      <SelectItem key={k} value={k} label={k}>{k}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="h-64 overflow-y-auto rounded-lg border">
                {filteredSiswa.length === 0 ? (
                  <p className="p-4 text-center text-sm text-muted-foreground">Tidak ditemukan</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="w-8 px-3 py-2">
                          <Checkbox checked={allFilteredSelected} onCheckedChange={toggleAllFiltered} />
                        </th>
                        <th className="px-3 py-2 text-left font-semibold">Nama</th>
                        <th className="px-3 py-2 text-left font-semibold">Kelas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredSiswa.map((s) => (
                        <tr
                          key={s.id_siswa}
                          className="cursor-pointer hover:bg-accent/30"
                          onClick={() => toggleSiswa(s.id_siswa)}
                        >
                          <td className="px-3 py-2">
                            <Checkbox
                              checked={selectedSiswa.has(s.id_siswa)}
                              onCheckedChange={() => toggleSiswa(s.id_siswa)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td className="px-3 py-2 font-medium">{s.nama_lengkap}</td>
                          <td className="px-3 py-2 text-muted-foreground">{s.kelas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Judul Kompetensi</Label>
              <Input value={judulManual} onChange={(e) => setJudulManual(e.target.value)} placeholder="mis. Pelatihan Jaringan Dasar" />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Nilai (opsional, 0-100)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={nilai}
                onChange={(e) => setNilai(e.target.value)}
                placeholder="Kosongkan jika tidak perlu - sertifikat cukup tampilkan LULUS"
              />
            </div>

            <div className="flex flex-col gap-2 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <Checkbox checked={sertakanKepsek} onCheckedChange={(v) => setSertakanKepsek(!!v)} />
                <Label className="cursor-pointer" onClick={() => setSertakanKepsek((v) => !v)}>
                  Sertakan tanda tangan Kepala Sekolah
                </Label>
              </div>
              {sertakanKepsek && (
                <p className="text-xs text-muted-foreground">
                  {namaKepalaSekolah
                    ? `Akan ditandatangani juga oleh: ${namaKepalaSekolah}`
                    : "Nama Kepala Sekolah belum diatur di menu Informasi Sekolah (Admin)."}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Menyimpan..." : `Terbitkan untuk ${selectedSiswa.size} Siswa`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus sertifikat ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Sertifikat manual <strong>{deleteTarget?.judul_manual}</strong> milik <strong>{deleteTarget?.nama_siswa}</strong>{" "}
              akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
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
