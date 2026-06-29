"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useTableControls } from "@/components/use-table-controls";
import { SortableHead, TablePagination } from "@/components/table-pagination";

type LaporanRow = {
  id_siswa: string;
  nama_siswa: string;
  kelas_mapel: string;
  tugas_selesai: number;
  total_tugas: number;
  rata_rata: number | null;
};

export function LaporanClient({ rows }: { rows: LaporanRow[] }) {
  const table = useTableControls<LaporanRow>(rows);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Laporan Belajar Siswa</h1>
        <p className="text-sm text-muted-foreground">Progres belajar siswa yang Anda ajar ({rows.length} siswa)</p>
      </div>

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <SortableHead label="Nama Siswa" sortKey="nama_siswa" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Kelas/Mapel" sortKey="kelas_mapel" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Tugas Selesai" sortKey="tugas_selesai" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Rata-rata Nilai" sortKey="rata_rata" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Tidak ada data</TableCell>
                </TableRow>
              )}
              {table.rows.map((row) => {
                const progres = row.total_tugas > 0 ? row.tugas_selesai / row.total_tugas : 0;
                return (
                  <TableRow key={`${row.id_siswa}-${row.kelas_mapel}`} className="hover:bg-accent/40">
                    <TableCell>{row.nama_siswa}</TableCell>
                    <TableCell>{row.kelas_mapel}</TableCell>
                    <TableCell>{row.tugas_selesai} / {row.total_tugas}</TableCell>
                    <TableCell>{row.rata_rata ?? "-"}</TableCell>
                    <TableCell>
                      {progres >= 0.8 ? (
                        <Badge>Baik</Badge>
                      ) : progres >= 0.4 ? (
                        <Badge variant="secondary">Cukup</Badge>
                      ) : (
                        <Badge variant="destructive">Perlu Perhatian</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
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
