"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Video, FileText, AlignLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTableControls } from "@/components/use-table-controls";
import { SortableHead, TablePagination } from "@/components/table-pagination";
import { MateriFormDialog, type MateriRow } from "./materi-form-dialog";
import { deleteMateri } from "./actions";

type MateriListRow = MateriRow & { mengajar_label: string };

function getTipe(row: MateriListRow): "teks" | "yt" | "file" {
  if (row.file_url) return "file";
  if (row.isi?.includes("youtube.com") || row.isi?.includes("youtu.be")) return "yt";
  return "teks";
}

export function MateriClient({
  rows,
  mengajarOptions,
}: {
  rows: MateriListRow[];
  mengajarOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const table = useTableControls<MateriListRow>(rows);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MateriListRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MateriListRow | null>(null);

  function handleDelete() {
    if (!deleteTarget) return;
    const formData = new FormData();
    formData.set("id_materi", deleteTarget.id_materi);
    startTransition(async () => {
      await deleteMateri(formData);
      setDeleteTarget(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Materi</h1>
          <p className="text-sm text-muted-foreground">{rows.length} materi dibagikan</p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-1.5 shadow-sm">
          <Plus className="size-4" />
          Bagikan Materi
        </Button>
      </div>

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <SortableHead label="Judul" sortKey="judul" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <SortableHead label="Kelas/Mapel" sortKey="mengajar_label" activeKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tipe</th>
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Aksi</th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Belum ada materi</TableCell>
                </TableRow>
              )}
              {table.rows.map((row) => {
                const tipe = getTipe(row);
                return (
                  <TableRow key={row.id_materi} className="hover:bg-accent/40">
                    <TableCell>{row.judul}</TableCell>
                    <TableCell>{row.mengajar_label}</TableCell>
                    <TableCell>
                      {tipe === "file" ? (
                        <Badge variant="secondary" className="gap-1"><FileText className="size-3" /> File</Badge>
                      ) : tipe === "yt" ? (
                        <Badge variant="secondary" className="gap-1"><Video className="size-3" /> YouTube</Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1"><AlignLeft className="size-3" /> Teks</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {(tipe === "file" || tipe === "yt") && row.isi !== null && (
                          <a href={tipe === "file" ? row.file_url ?? "#" : row.isi ?? "#"} target="_blank" rel="noopener noreferrer" className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                            <ExternalLink className="size-3.5" />
                          </a>
                        )}
                        <Button variant="ghost" size="icon-sm" onClick={() => { setEditing(row); setDialogOpen(true); }} aria-label="Edit">
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(row)}
                          aria-label="Hapus"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
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

      <MateriFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        mengajarOptions={mengajarOptions}
        onSaved={() => router.refresh()}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus materi ini?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak bisa dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction disabled={isPending} onClick={handleDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
