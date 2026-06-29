"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTableControls } from "@/components/use-table-controls";
import { SortableHead, TablePagination } from "@/components/table-pagination";

type GuruActivity = {
  id_guru: string;
  nama_lengkap: string;
  jumlah_materi: number;
  jumlah_tugas: number;
  login_terakhir: string | null;
};

type SiswaActivity = {
  id_siswa: string;
  nama_lengkap: string;
  tugas_dikerjakan: number;
  login_terakhir: string | null;
};

function formatTanggal(value: string | null) {
  if (!value) return "Belum pernah login";
  return new Date(value).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

function isAktifBaruBaru(value: string | null) {
  if (!value) return false;
  const diffDays = (Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

export function LaporanClient({
  guruActivity,
  siswaActivity,
}: {
  guruActivity: GuruActivity[];
  siswaActivity: SiswaActivity[];
}) {
  const guruTable = useTableControls<GuruActivity>(guruActivity);
  const siswaTable = useTableControls<SiswaActivity>(siswaActivity);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Laporan Keaktifan</h1>
        <p className="text-sm text-muted-foreground">Pantau keaktifan guru dan siswa menggunakan e-learning</p>
      </div>

      <Tabs defaultValue="guru">
        <TabsList>
          <TabsTrigger value="guru">Guru ({guruActivity.length})</TabsTrigger>
          <TabsTrigger value="siswa">Siswa ({siswaActivity.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="guru" className="pt-3">
          <Card className="overflow-hidden p-0 shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <SortableHead label="Nama Guru" sortKey="nama_lengkap" activeKey={guruTable.sortKey} sortDir={guruTable.sortDir} onSort={guruTable.toggleSort} />
                    <SortableHead label="Materi Dibuat" sortKey="jumlah_materi" activeKey={guruTable.sortKey} sortDir={guruTable.sortDir} onSort={guruTable.toggleSort} />
                    <SortableHead label="Tugas Dibuat" sortKey="jumlah_tugas" activeKey={guruTable.sortKey} sortDir={guruTable.sortDir} onSort={guruTable.toggleSort} />
                    <SortableHead label="Login Terakhir" sortKey="login_terakhir" activeKey={guruTable.sortKey} sortDir={guruTable.sortDir} onSort={guruTable.toggleSort} />
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guruTable.rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Tidak ada data</TableCell>
                    </TableRow>
                  )}
                  {guruTable.rows.map((g) => (
                    <TableRow key={g.id_guru} className="hover:bg-accent/40">
                      <TableCell>{g.nama_lengkap}</TableCell>
                      <TableCell>{g.jumlah_materi}</TableCell>
                      <TableCell>{g.jumlah_tugas}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatTanggal(g.login_terakhir)}</TableCell>
                      <TableCell>
                        {isAktifBaruBaru(g.login_terakhir) ? <Badge>Aktif</Badge> : <Badge variant="secondary">Kurang Aktif</Badge>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              page={guruTable.page}
              totalPages={guruTable.totalPages}
              totalRows={guruTable.totalRows}
              pageSize={guruTable.pageSize}
              onPageChange={guruTable.setPage}
              onPageSizeChange={guruTable.setPageSize}
            />
          </Card>
        </TabsContent>

        <TabsContent value="siswa" className="pt-3">
          <Card className="overflow-hidden p-0 shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <SortableHead label="Nama Siswa" sortKey="nama_lengkap" activeKey={siswaTable.sortKey} sortDir={siswaTable.sortDir} onSort={siswaTable.toggleSort} />
                    <SortableHead label="Tugas Dikerjakan" sortKey="tugas_dikerjakan" activeKey={siswaTable.sortKey} sortDir={siswaTable.sortDir} onSort={siswaTable.toggleSort} />
                    <SortableHead label="Login Terakhir" sortKey="login_terakhir" activeKey={siswaTable.sortKey} sortDir={siswaTable.sortDir} onSort={siswaTable.toggleSort} />
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {siswaTable.rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Tidak ada data</TableCell>
                    </TableRow>
                  )}
                  {siswaTable.rows.map((s) => (
                    <TableRow key={s.id_siswa} className="hover:bg-accent/40">
                      <TableCell>{s.nama_lengkap}</TableCell>
                      <TableCell>{s.tugas_dikerjakan}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatTanggal(s.login_terakhir)}</TableCell>
                      <TableCell>
                        {isAktifBaruBaru(s.login_terakhir) ? <Badge>Aktif</Badge> : <Badge variant="secondary">Kurang Aktif</Badge>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              page={siswaTable.page}
              totalPages={siswaTable.totalPages}
              totalRows={siswaTable.totalRows}
              pageSize={siswaTable.pageSize}
              onPageChange={siswaTable.setPage}
              onPageSizeChange={siswaTable.setPageSize}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
