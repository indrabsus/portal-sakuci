"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useTableControls } from "@/components/use-table-controls";
import { SortableHead, TablePagination } from "@/components/table-pagination";
import { NilaiModal, type JawabanDetail } from "./nilai-modal";

type PengumpulanRow = {
  id_pengumpulan_kompetensi: string;
  nama_siswa: string;
  status: string;
  nilai: number | null;
  jawaban: JawabanDetail[];
};

const STATUS_LABEL: Record<string, string> = {
  belum: "Belum Mengerjakan",
  dikerjakan: "Sedang Dikerjakan",
  selesai: "Selesai",
  menunggu_acc: "Menunggu Validasi",
  lulus: "Lulus",
  tidak_lulus: "Belum Lulus",
};

export function ValidasiDetailClient({ judulTes, rows }: { judulTes: string; rows: PengumpulanRow[] }) {
  const table = useTableControls<PengumpulanRow>(rows);
  const [selected, setSelected] = useState<PengumpulanRow | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{judulTes}</h1>
        <p className="text-sm text-muted-foreground">{rows.length} siswa</p>
      </div>

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <SortableHead label="Nama Siswa" sortKey="nama_siswa" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Status" sortKey="status" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Nilai" sortKey="nilai" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Aksi</th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Belum ada siswa mengerjakan</TableCell>
                </TableRow>
              )}
              {table.rows.map((row) => (
                <TableRow key={row.id_pengumpulan_kompetensi} className="hover:bg-accent/40">
                  <TableCell>{row.nama_siswa}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === "lulus" ? "default" : row.status === "tidak_lulus" ? "destructive" : "secondary"}>
                      {STATUS_LABEL[row.status] ?? row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.nilai ?? "-"}</TableCell>
                  <TableCell className="text-right">
                    <button
                      type="button"
                      onClick={() => setSelected(row)}
                      disabled={row.status === "belum" || row.status === "dikerjakan"}
                      aria-label="Lihat & nilai"
                      className="inline-flex size-7 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary/10 disabled:opacity-30"
                    >
                      <Eye className="size-3.5" />
                    </button>
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

      {selected && (
        <NilaiModal
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
          idPengumpulan={selected.id_pengumpulan_kompetensi}
          namaSiswa={selected.nama_siswa}
          jawaban={selected.jawaban}
        />
      )}
    </div>
  );
}
