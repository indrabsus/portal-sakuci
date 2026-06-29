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

type NilaiRow = {
  id_siswa: string;
  nama_siswa: string;
  nisn: string | null;
  nilai_per_tugas: Record<string, number | null>;
};

type JudulTugas = { id_tugas: string; judul: string; semester: string };

type Mengajar = {
  id_mengajar: string;
  label: string;
  judul_tugas: JudulTugas[];
  rows: NilaiRow[];
};

const SEMESTER_OPTIONS = [
  { value: "ganjil", label: "Ganjil" },
  { value: "genap", label: "Genap" },
];

function hitungRataRata(nilaiPerTugas: Record<string, number | null>, tugasIds: string[]) {
  const nilaiValid = tugasIds.map((id) => nilaiPerTugas[id]).filter((n): n is number => n !== null && n !== undefined);
  if (nilaiValid.length === 0) return null;
  return Math.round((nilaiValid.reduce((a, b) => a + b, 0) / nilaiValid.length) * 100) / 100;
}

export function NilaiClient({ mengajarList }: { mengajarList: Mengajar[] }) {
  const [selected, setSelected] = useState(mengajarList[0]?.id_mengajar ?? "");
  const [semester, setSemester] = useState("ganjil");
  const current = mengajarList.find((m) => m.id_mengajar === selected) ?? mengajarList[0];

  const judulTugasFiltered = current?.judul_tugas.filter((t) => t.semester === semester) ?? [];
  const tugasIds = judulTugasFiltered.map((t) => t.id_tugas);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nilai Siswa</h1>
          <p className="text-sm text-muted-foreground">Rekap nilai tugas per kelas/mapel &amp; semester</p>
        </div>
        <Button variant="outline" className="gap-1.5" onClick={() => window.print()}>
          <Printer className="size-4" />
          Cetak PDF
        </Button>
      </div>

      {mengajarList.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada pembagian mengajar.</p>
      ) : (
        <>
          <div className="flex flex-col gap-3 no-print sm:flex-row">
            <Select value={selected} onValueChange={(v) => v && setSelected(v)}>
              <SelectTrigger className="w-full sm:w-72">
                <SelectValue>{current?.label}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {mengajarList.map((m) => (
                  <SelectItem key={m.id_mengajar} value={m.id_mengajar} label={m.label}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={semester} onValueChange={(v) => v && setSemester(v)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue>{SEMESTER_OPTIONS.find((s) => s.value === semester)?.label}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SEMESTER_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value} label={s.label}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {current && (
            <Card className="overflow-hidden p-0 shadow-sm">
              <div className="p-4 print:block">
                <p className="font-semibold">{current.label}</p>
                <p className="text-sm text-muted-foreground">Semester {SEMESTER_OPTIONS.find((s) => s.value === semester)?.label}</p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead>Nama Siswa</TableHead>
                      <TableHead>NISN</TableHead>
                      {judulTugasFiltered.map((t) => (
                        <TableHead key={t.id_tugas}>{t.judul}</TableHead>
                      ))}
                      <TableHead>Rata-rata</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {current.rows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={judulTugasFiltered.length + 3} className="h-24 text-center text-muted-foreground">
                          Belum ada data nilai
                        </TableCell>
                      </TableRow>
                    )}
                    {current.rows.map((row) => (
                      <TableRow key={row.id_siswa}>
                        <TableCell>{row.nama_siswa}</TableCell>
                        <TableCell>{row.nisn ?? "-"}</TableCell>
                        {judulTugasFiltered.map((t) => (
                          <TableCell key={t.id_tugas}>{row.nilai_per_tugas[t.id_tugas] ?? "-"}</TableCell>
                        ))}
                        <TableCell className="font-semibold">{hitungRataRata(row.nilai_per_tugas, tugasIds) ?? "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
