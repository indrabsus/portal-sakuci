"use client";

import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useTableControls } from "@/components/use-table-controls";
import { SortableHead, TablePagination } from "@/components/table-pagination";

type RekapRow = {
  id_siswa: string;
  nama_siswa: string;
  kelas_nama: string | null;
  jumlah_sertifikat: number;
  jumlah_kompetensi_lulus: number;
  jumlah_kompetensi_proses: number;
};

export function RekapKompetensiClient({ rows }: { rows: RekapRow[] }) {
  const table = useTableControls<RekapRow>(rows);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rekap Kompetensi</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan sertifikat dan progres kompetensi setiap siswa ({rows.length} siswa)
        </p>
      </div>

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <SortableHead label="Nama Siswa" sortKey="nama_siswa" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Kelas" sortKey="kelas_nama" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Sertifikat Diterima" sortKey="jumlah_sertifikat" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Kompetensi Lulus" sortKey="jumlah_kompetensi_lulus" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Kompetensi Diproses" sortKey="jumlah_kompetensi_proses" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Belum ada data siswa
                  </TableCell>
                </TableRow>
              )}
              {table.rows.map((row) => (
                <TableRow key={row.id_siswa} className="hover:bg-accent/40">
                  <TableCell>{row.nama_siswa}</TableCell>
                  <TableCell>{row.kelas_nama ?? "-"}</TableCell>
                  <TableCell>
                    {row.jumlah_sertifikat > 0 ? (
                      <Badge className="gap-1">
                        <Award className="size-3" /> {row.jumlah_sertifikat}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">0</Badge>
                    )}
                  </TableCell>
                  <TableCell>{row.jumlah_kompetensi_lulus}</TableCell>
                  <TableCell>{row.jumlah_kompetensi_proses}</TableCell>
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
    </div>
  );
}
