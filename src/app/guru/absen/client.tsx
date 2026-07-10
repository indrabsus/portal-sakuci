"use client";

import { useRouter } from "next/navigation";
import { CalendarClock, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PrintButton } from "@/components/print-button";
import { KopSuratPrint } from "@/components/kop-surat-print";
import { printPortraitA4 } from "@/lib/print-portrait";
import { cn } from "@/lib/utils";

export type RekapKehadiranRow = {
  tanggal: string;
  hari: string;
  status: string;
  jam_datang: string | null;
  jam_pulang: string | null;
  terlambat: boolean;
  keterangan: string | null;
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

const STATUS_STYLE: Record<string, string> = {
  hadir: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  izin: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  sakit: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  alpa: "bg-destructive/10 text-destructive",
  tidak_ada_data: "bg-muted text-muted-foreground",
};

const STATUS_LABEL: Record<string, string> = {
  hadir: "Hadir",
  izin: "Izin",
  sakit: "Sakit",
  alpa: "Alpa",
  tidak_ada_data: "Tidak Ada Data",
};

const KOORDINATOR_PKG_NAMA = "Moch Nafsir S.PdI";
const KOTA_SEKOLAH = "Cimahi";

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={STATUS_STYLE[status] ?? "bg-muted text-muted-foreground"}>
      {STATUS_LABEL[status] ?? status}
    </Badge>
  );
}

function tahunOptions() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear + 1; y >= currentYear - 3; y--) years.push(y);
  return years;
}

function formatTanggalCetak(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

function jamCellCetak(row: RekapKehadiranRow, field: "jam_datang" | "jam_pulang") {
  const value = row[field];
  if (value) return value;
  if (row.status === "tidak_ada_data") return "-";
  return row.status.replace(/_/g, " ").toUpperCase();
}

export function AbsenClient({
  rows,
  error,
  bulan,
  tahun,
  namaLengkap,
}: {
  rows: RekapKehadiranRow[];
  error: string | null;
  bulan: number;
  tahun: number;
  namaLengkap: string;
}) {
  const router = useRouter();

  function updateFilter(nextBulan: number, nextTahun: number) {
    router.push(`/guru/absen?bulan=${nextBulan}&tahun=${nextTahun}`);
  }

  const bulanLabel = BULAN_OPTIONS.find((b) => b.value === String(bulan))?.label ?? "";

  const totalHadir = rows.filter((r) => r.status === "hadir").length;
  const totalTerlambat = rows.filter((r) => r.terlambat).length;
  const totalIzin = rows.filter((r) => r.status === "izin" || r.status === "sakit").length;
  const totalTanpaKeterangan = rows.filter((r) => r.status === "alpa" || r.status === "tidak_ada_data").length;

  const summaryCards = [
    { label: "Hadir", value: totalHadir, icon: CheckCircle2 },
    { label: "Terlambat", value: totalTerlambat, icon: Clock },
    { label: "Izin/Sakit", value: totalIzin, icon: CalendarClock },
    { label: "Tanpa Keterangan", value: totalTanpaKeterangan, icon: XCircle },
  ];

  const tanggalCetak = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Absen</h1>
            <p className="text-sm text-muted-foreground">Rekap kehadiran fingerprint Anda per bulan</p>
          </div>
          {!error && <PrintButton label="Cetak PDF" onPrint={printPortraitA4} />}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Select value={String(bulan)} onValueChange={(v) => v && updateFilter(Number(v), tahun)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue>{bulanLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {BULAN_OPTIONS.map((b) => (
                <SelectItem key={b.value} value={b.value} label={b.label}>{b.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(tahun)} onValueChange={(v) => v && updateFilter(bulan, Number(v))}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue>{tahun}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {tahunOptions().map((y) => (
                <SelectItem key={y} value={String(y)} label={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error ? (
          <Card className="shadow-sm">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">{error}</CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {summaryCards.map((card) => (
                <Card key={card.label} className="shadow-sm">
                  <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <card.icon className="size-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold tracking-tight">{card.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="overflow-hidden p-0 shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Hari</TableHead>
                      <TableHead>Jam Datang</TableHead>
                      <TableHead>Jam Pulang</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Keterangan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          Belum ada data absensi
                        </TableCell>
                      </TableRow>
                    )}
                    {rows.map((row) => (
                      <TableRow key={row.tanggal} className="hover:bg-accent/40">
                        <TableCell>{row.tanggal}</TableCell>
                        <TableCell>{row.hari}</TableCell>
                        <TableCell className={cn(row.terlambat && "font-semibold text-red-600 dark:text-red-500")}>
                          {row.jam_datang ?? "-"}
                        </TableCell>
                        <TableCell>{row.jam_pulang ?? "-"}</TableCell>
                        <TableCell><StatusBadge status={row.status} /></TableCell>
                        <TableCell>{row.keterangan ?? "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </>
        )}
      </div>

      {!error && (
        <div className="sr-only bg-white text-black print:not-sr-only">
          <KopSuratPrint />

          <p className="mt-4 text-center text-base font-bold">Rekap Kehadiran Guru</p>

          <div className="mt-4 mb-3 text-sm">
            <p>Nama : {namaLengkap}</p>
            <p>Bulan : {bulanLabel} {tahun}</p>
          </div>

          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-black px-2 py-1">Tanggal</th>
                <th className="border border-black px-2 py-1">Hari</th>
                <th className="border border-black px-2 py-1">Jam Datang</th>
                <th className="border border-black px-2 py-1">Jam Pulang</th>
                <th className="border border-black px-2 py-1">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.tanggal}>
                  <td className="border border-black px-2 py-1 text-center">{formatTanggalCetak(row.tanggal)}</td>
                  <td className="border border-black px-2 py-1 text-center">{row.hari}</td>
                  <td
                    className={cn(
                      "border border-black px-2 py-1 text-center",
                      row.terlambat && "font-bold text-red-600",
                    )}
                  >
                    {jamCellCetak(row, "jam_datang")}
                  </td>
                  <td className="border border-black px-2 py-1 text-center">{jamCellCetak(row, "jam_pulang")}</td>
                  <td className="border border-black px-2 py-1">{row.keterangan ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-10 flex justify-end">
            <div className="text-center text-sm">
              <p>{KOTA_SEKOLAH}, {tanggalCetak}</p>
              <p>Koordinator PKG</p>
              <div className="h-16" />
              <p className="font-semibold">{KOORDINATOR_PKG_NAMA}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
