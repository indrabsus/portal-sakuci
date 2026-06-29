"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NilaiRow = { mapel_nama: string; judul_tugas: string; semester: string; nilai: number | null };

const SEMESTER_OPTIONS = [
  { value: "ganjil", label: "Ganjil" },
  { value: "genap", label: "Genap" },
];

export function NilaiClient({ namaSiswa, kelasNama, rows }: { namaSiswa: string; kelasNama: string | null; rows: NilaiRow[] }) {
  const [semester, setSemester] = useState("ganjil");
  const filtered = rows.filter((r) => r.semester === semester);

  const nilaiValid = filtered.map((r) => r.nilai).filter((n): n is number => n !== null);
  const rataRata = nilaiValid.length > 0 ? Math.round((nilaiValid.reduce((a, b) => a + b, 0) / nilaiValid.length) * 100) / 100 : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nilai Saya</h1>
          <p className="text-sm text-muted-foreground">Rekap nilai tugas per semester</p>
        </div>
        <Button variant="outline" className="gap-1.5" onClick={() => window.print()}>
          <Printer className="size-4" />
          Cetak PDF
        </Button>
      </div>

      <div className="no-print">
        <Select value={semester} onValueChange={(v) => v && setSemester(v)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue>{SEMESTER_OPTIONS.find((s) => s.value === semester)?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SEMESTER_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value} label={s.label}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="p-4">
          <p className="font-semibold">{namaSiswa}</p>
          <p className="text-sm text-muted-foreground">
            Kelas {kelasNama ?? "-"} &middot; Semester {SEMESTER_OPTIONS.find((s) => s.value === semester)?.label}
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Tugas</TableHead>
                <TableHead>Nilai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">Belum ada nilai</TableCell>
                </TableRow>
              )}
              {filtered.map((r, idx) => (
                <TableRow key={idx}>
                  <TableCell>{r.mapel_nama}</TableCell>
                  <TableCell>{r.judul_tugas}</TableCell>
                  <TableCell>{r.nilai ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rataRata !== null && (
          <div className="border-t p-4 text-right font-semibold">Rata-rata: {rataRata}</div>
        )}
      </Card>
    </div>
  );
}
