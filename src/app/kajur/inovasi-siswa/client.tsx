"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InitialsAvatar } from "@/components/initials-avatar";
import { YoutubeThumbnail } from "@/components/youtube-thumbnail";
import { useTableControls } from "@/components/use-table-controls";
import { TablePagination } from "@/components/table-pagination";
import { reviewProjectSiswa } from "./actions";

type ProjectRow = {
  id_project: string;
  nama_project: string;
  deskripsi: string | null;
  link_youtube: string | null;
  status: string;
  nama_siswa: string;
  foto_siswa: string | null;
  kelas_nama: string | null;
  jurusan_nama: string | null;
  tahun_ajaran_nama: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu ACC",
  approved: "Disetujui",
  rejected: "Ditolak",
};

const FILTER_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "pending", label: "Menunggu ACC" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
];

export function InovasiSiswaClient({ rows }: { rows: ProjectRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = rows.filter(
    (r) =>
      (statusFilter === "all" || r.status === statusFilter) &&
      (r.nama_project.toLowerCase().includes(search.toLowerCase()) ||
        r.nama_siswa.toLowerCase().includes(search.toLowerCase()) ||
        (r.kelas_nama ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (r.jurusan_nama ?? "").toLowerCase().includes(search.toLowerCase())),
  );

  const table = useTableControls<ProjectRow>(filtered, 12);

  function handleReview(idProject: string, status: "approved" | "rejected") {
    const formData = new FormData();
    formData.set("id_project", idProject);
    formData.set("status", status);
    startTransition(async () => {
      await reviewProjectSiswa(formData);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Project & Inovasi Siswa</h1>
        <p className="text-sm text-muted-foreground">
          {rows.length} project/inovasi dibagikan siswa &middot; ACC project agar tampil di halaman publik sekolah
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari project, siswa, kelas, atau jurusan..."
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue>{FILTER_OPTIONS.find((o) => o.value === statusFilter)?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} label={o.label}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {table.rows.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground shadow-sm">Belum ada project/inovasi siswa</Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {table.rows.map((row) => (
            <Card key={row.id_project} className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
              {row.link_youtube && (
                <div className="px-4 pt-4">
                  <YoutubeThumbnail url={row.link_youtube} />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  {!row.link_youtube ? (
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Sparkles className="size-5" />
                    </div>
                  ) : (
                    <span />
                  )}
                  <Badge variant={row.status === "approved" ? "default" : row.status === "rejected" ? "destructive" : "secondary"}>
                    {STATUS_LABEL[row.status] ?? row.status}
                  </Badge>
                </div>
                <CardTitle className="text-base">{row.nama_project}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {row.kelas_nama ?? "-"} {row.jurusan_nama ? `${row.jurusan_nama} ` : ""}
                  &middot; TA {row.tahun_ajaran_nama ?? "-"}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <InitialsAvatar name={row.nama_siswa} fotoUrl={row.foto_siswa} className="size-7 text-xs" />
                  <span className="text-sm font-medium">{row.nama_siswa}</span>
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">{row.deskripsi ?? "-"}</p>

                <div className="flex justify-end gap-2 border-t pt-3">
                  {row.status !== "approved" && (
                    <Button size="sm" className="gap-1.5" disabled={isPending} onClick={() => handleReview(row.id_project, "approved")}>
                      <Check className="size-3.5" />
                      ACC
                    </Button>
                  )}
                  {row.status !== "rejected" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-destructive hover:bg-destructive/10"
                      disabled={isPending}
                      onClick={() => handleReview(row.id_project, "rejected")}
                    >
                      <X className="size-3.5" />
                      Tolak
                    </Button>
                  )}
                </div>
              </CardContent>
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
