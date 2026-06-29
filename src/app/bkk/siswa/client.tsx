"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InitialsAvatar } from "@/components/initials-avatar";
import { useTableControls } from "@/components/use-table-controls";
import { TablePagination } from "@/components/table-pagination";

type SiswaRow = {
  id_siswa: string;
  nama_lengkap: string;
  nisn: string | null;
  foto_url: string | null;
  kelas_nama: string | null;
  jurusan_nama: string | null;
  jumlah_sertifikat: number;
};

const SORT_OPTIONS = [
  { value: "nama_lengkap", label: "Nama (A-Z)" },
  { value: "jumlah_sertifikat", label: "Jumlah Sertifikat" },
  { value: "kelas_nama", label: "Kelas" },
];

export function BkkSiswaClient({ rows }: { rows: SiswaRow[] }) {
  const [search, setSearch] = useState("");

  const filtered = rows.filter(
    (r) =>
      r.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
      (r.nisn ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (r.kelas_nama ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (r.jurusan_nama ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const table = useTableControls<SiswaRow>(filtered, 12);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Data Siswa</h1>
        <p className="text-sm text-muted-foreground">{rows.length} siswa sudah aktivasi akun</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NISN, kelas, atau jurusan..."
            className="pl-8"
          />
        </div>

        <Select value={table.sortKey ?? "nama_lengkap"} onValueChange={(v) => v && table.toggleSort(v)}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue>{SORT_OPTIONS.find((o) => o.value === table.sortKey)?.label ?? "Urutkan: Nama (A-Z)"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} label={o.label}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {table.rows.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground shadow-sm">Tidak ada siswa ditemukan</Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {table.rows.map((row) => (
            <Card key={row.id_siswa} className="flex flex-col gap-3 p-4 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3">
                <InitialsAvatar name={row.nama_lengkap} fotoUrl={row.foto_url} className="size-12 text-base" />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{row.nama_lengkap}</p>
                  <p className="truncate text-xs text-muted-foreground">NISN: {row.nisn ?? "-"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <p>Kelas: <span className="text-foreground">{row.kelas_nama ?? "-"}</span></p>
                <p>Jurusan: <span className="text-foreground">{row.jurusan_nama ?? "-"}</span></p>
              </div>

              <div className="flex items-center justify-between">
                {row.jumlah_sertifikat > 0 ? (
                  <Badge className="gap-1"><Award className="size-3" /> {row.jumlah_sertifikat} Sertifikat</Badge>
                ) : (
                  <Badge variant="secondary">Belum ada sertifikat</Badge>
                )}
                <Link href={`/bkk/siswa/${row.id_siswa}`} className="text-sm text-primary underline-offset-4 hover:underline">
                  Lihat Portofolio
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="overflow-hidden p-0 shadow-sm">
        <TablePagination
          page={table.page}
          totalPages={table.totalPages}
          totalRows={table.totalRows}
          pageSize={table.pageSize}
          onPageChange={table.setPage}
          onPageSizeChange={table.setPageSize}
        />
      </Card>
    </div>
  );
}
