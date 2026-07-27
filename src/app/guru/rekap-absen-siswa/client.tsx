"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type RekapRow = {
  id_siswa: string;
  nama_lengkap: string;
  nisn: string | null;
  hadir: number;
  izin: number;
  sakit: number;
  dispen: number;
  alpa: number;
};

const BULAN_OPTIONS = [
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Maret" },
  { value: "4", label: "April" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Juni" },
  { value: "7", label: "Juli" },
  { value: "8", label: "Agustus" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

function tahunOptions() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear + 1; y >= currentYear - 3; y--) years.push(y);
  return years;
}

export function RekapAbsenSiswaClient({
  mengajarOptions,
  selectedIdMengajar,
  bulan,
  tahun,
  totalSesi,
  rows,
}: {
  mengajarOptions: { value: string; label: string }[];
  selectedIdMengajar: string;
  bulan: number;
  tahun: number;
  totalSesi: number;
  rows: RekapRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function updateFilter(next: { id_mengajar?: string; bulan?: number; tahun?: number }) {
    const params = new URLSearchParams({
      id_mengajar: next.id_mengajar ?? selectedIdMengajar,
      bulan: String(next.bulan ?? bulan),
      tahun: String(next.tahun ?? tahun),
    });
    startTransition(() => {
      router.push(`/guru/rekap-absen-siswa?${params.toString()}`);
    });
  }

  const mengajarLabel = mengajarOptions.find((m) => m.value === selectedIdMengajar)?.label ?? "";
  const bulanLabel = BULAN_OPTIONS.find((b) => b.value === String(bulan))?.label ?? "";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rekap Absen Siswa</h1>
        <p className="text-sm text-muted-foreground">Rekap kehadiran siswa per kelas/mapel &amp; bulan</p>
      </div>

      {mengajarOptions.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Anda belum punya pembagian mengajar.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="shadow-sm">
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Select disabled={isPending} value={selectedIdMengajar} onValueChange={(v) => v && updateFilter({ id_mengajar: v })}>
                <SelectTrigger className="w-full sm:w-72">
                  <SelectValue placeholder="Pilih kelas/mapel">
                    {() => mengajarLabel || "Pilih kelas/mapel"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {mengajarOptions.map((m) => (
                    <SelectItem key={m.value} value={m.value} label={m.label}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select disabled={isPending} value={String(bulan)} onValueChange={(v) => v && updateFilter({ bulan: Number(v) })}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue>{bulanLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {BULAN_OPTIONS.map((b) => (
                    <SelectItem key={b.value} value={b.value} label={b.label}>{b.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select disabled={isPending} value={String(tahun)} onValueChange={(v) => v && updateFilter({ tahun: Number(v) })}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue>{tahun}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {tahunOptions().map((y) => (
                    <SelectItem key={y} value={String(y)} label={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {isPending && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Memuat data...
                </span>
              )}
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground">
            Total sesi absen dibuka bulan ini: <span className="font-medium text-foreground">{totalSesi}</span>
          </p>

          <Card className="overflow-hidden p-0 shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nama</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">NISN</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hadir</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Izin</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sakit</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dispen</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tanpa Ket.</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">% Hadir</th>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">Belum ada data siswa</TableCell>
                    </TableRow>
                  )}
                  {rows.map((row) => {
                    const persen = totalSesi > 0 ? Math.round((row.hadir / totalSesi) * 100) : 0;
                    return (
                      <TableRow key={row.id_siswa} className="hover:bg-accent/40">
                        <TableCell>{row.nama_lengkap}</TableCell>
                        <TableCell>{row.nisn ?? "-"}</TableCell>
                        <TableCell className="text-center">{row.hadir}</TableCell>
                        <TableCell className="text-center">{row.izin}</TableCell>
                        <TableCell className="text-center">{row.sakit}</TableCell>
                        <TableCell className="text-center">{row.dispen}</TableCell>
                        <TableCell className="text-center">{row.alpa}</TableCell>
                        <TableCell className="text-center">{totalSesi > 0 ? `${persen}%` : "-"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
