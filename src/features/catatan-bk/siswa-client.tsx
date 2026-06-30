"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SiswaCatatanSummary, TingkatPerhatian } from "./types";

function getTingkat(jumlah: number): TingkatPerhatian {
  if (jumlah === 0) return "aman";
  if (jumlah === 1) return "perhatian";
  if (jumlah <= 3) return "waspada";
  return "kritis";
}

const TINGKAT_CONFIG: Record<
  TingkatPerhatian,
  { label: string; className: string }
> = {
  aman: {
    label: "Aman",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
  },
  perhatian: {
    label: "Perhatian",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300",
  },
  waspada: {
    label: "Waspada",
    className: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300",
  },
  kritis: {
    label: "Kritis",
    className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
  },
};

export function SiswaBkClient({ rows }: { rows: SiswaCatatanSummary[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterTingkat, setFilterTingkat] = useState<TingkatPerhatian | "semua">("semua");

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return rows.filter((r) => {
      const matchSearch =
        !lower ||
        r.nama_lengkap.toLowerCase().includes(lower) ||
        r.kelas_label.toLowerCase().includes(lower) ||
        (r.nisn ?? "").includes(lower);
      const matchTingkat =
        filterTingkat === "semua" || getTingkat(r.jumlah_catatan) === filterTingkat;
      return matchSearch && matchTingkat;
    });
  }, [rows, search, filterTingkat]);

  const counts = useMemo(
    () => ({
      aman: rows.filter((r) => getTingkat(r.jumlah_catatan) === "aman").length,
      perhatian: rows.filter((r) => getTingkat(r.jumlah_catatan) === "perhatian").length,
      waspada: rows.filter((r) => getTingkat(r.jumlah_catatan) === "waspada").length,
      kritis: rows.filter((r) => getTingkat(r.jumlah_catatan) === "kritis").length,
    }),
    [rows],
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rekap Siswa</h1>
        <p className="text-sm text-muted-foreground">
          Seluruh siswa dan jumlah catatan BK yang tercatat.
        </p>
      </div>

      {/* Kartu ringkasan */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["aman", "perhatian", "waspada", "kritis"] as TingkatPerhatian[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilterTingkat(filterTingkat === t ? "semua" : t)}
            className={`rounded-xl border px-4 py-3 text-left transition-all hover:shadow-sm ${
              filterTingkat === t ? "ring-2 ring-primary shadow-sm" : ""
            } ${TINGKAT_CONFIG[t].className}`}
          >
            <p className="text-xs font-medium uppercase tracking-wide opacity-70">
              {TINGKAT_CONFIG[t].label}
            </p>
            <p className="mt-0.5 text-2xl font-bold">{counts[t]}</p>
            <p className="text-xs opacity-60">siswa</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari nama, kelas, atau NISN..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabel */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Nama Siswa</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>NISN</TableHead>
              <TableHead className="text-center">Jumlah Catatan</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-20 text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Users className="size-8 opacity-30" />
                    <p className="text-sm">Tidak ada data siswa.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row, idx) => {
                const tingkat = getTingkat(row.jumlah_catatan);
                const cfg = TINGKAT_CONFIG[tingkat];
                return (
                  <TableRow key={row.id_siswa}>
                    <TableCell className="text-muted-foreground text-xs">{idx + 1}</TableCell>
                    <TableCell className="font-medium">{row.nama_lengkap}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs font-normal">
                        {row.kelas_label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.nisn ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-semibold">
                        {row.jumlah_catatan === 0 ? (
                          <span className="text-muted-foreground font-normal">-</span>
                        ) : (
                          row.jumlah_catatan
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}
                      >
                        {cfg.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {row.jumlah_catatan > 0 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-muted-foreground hover:text-primary"
                          title="Lihat catatan siswa ini"
                          onClick={() =>
                            router.push(`/bk/catatan?siswa=${row.id_siswa}`)
                          }
                        >
                          <FileText className="size-3.5" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Menampilkan {filtered.length} dari {rows.length} siswa.
        {filterTingkat !== "semua" && (
          <button
            className="ml-1 underline hover:text-foreground"
            onClick={() => setFilterTingkat("semua")}
          >
            Tampilkan semua
          </button>
        )}
      </p>
    </div>
  );
}
