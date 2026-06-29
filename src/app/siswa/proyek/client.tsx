"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import { YoutubeThumbnail } from "@/components/youtube-thumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { createProject, updateProject, deleteProject } from "./actions";

type ProjectRow = {
  id_project: string;
  nama_project: string;
  deskripsi: string | null;
  link_youtube: string | null;
  status: string;
  catatan_kajur: string | null;
  kelas_nama: string | null;
  jurusan_nama: string | null;
  tahun_ajaran_nama: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu ACC Kajur",
  approved: "Disetujui",
  rejected: "Ditolak",
};

export function ProyekClient({ rows }: { rows: ProjectRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setError(null);
    setDialogOpen(true);
  }

  function openEdit(row: ProjectRow) {
    setEditing(row);
    setError(null);
    setDialogOpen(true);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    const action = editing ? updateProject : createProject;
    if (editing) formData.set("id_project", editing.id_project);
    startTransition(async () => {
      const result = await action(formData);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setDialogOpen(false);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const formData = new FormData();
    formData.set("id_project", deleteTarget.id_project);
    startTransition(async () => {
      await deleteProject(formData);
      setDeleteTarget(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project & Inovasi Saya</h1>
          <p className="text-sm text-muted-foreground">{rows.length} project dibagikan</p>
        </div>
        <Button onClick={openCreate} className="gap-1.5 shadow-sm">
          <Plus className="size-4" />
          Tambah Project
        </Button>
      </div>

      {rows.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground shadow-sm">
          Belum ada project. Klik &quot;Tambah Project&quot; untuk membagikan karya Anda.
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <Card key={row.id_project} className="flex flex-col gap-3 overflow-hidden shadow-sm transition-shadow hover:shadow-md">
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
              <CardContent className="flex flex-1 flex-col gap-3">
                <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">{row.deskripsi ?? "-"}</p>
                {row.status === "rejected" && row.catatan_kajur && (
                  <p className="rounded-md bg-destructive/10 px-2 py-1.5 text-xs text-destructive">
                    Catatan Kajur: {row.catatan_kajur}
                  </p>
                )}

                <div className="flex justify-end gap-1 border-t pt-2">
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(row)} aria-label="Edit">
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Project" : "Tambah Project"}</DialogTitle>
          </DialogHeader>
          <form action={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

            <div className="flex flex-col gap-2">
              <Label htmlFor="nama_project">Nama Project / Inovasi</Label>
              <Input id="nama_project" name="nama_project" required defaultValue={editing?.nama_project ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea id="deskripsi" name="deskripsi" rows={4} defaultValue={editing?.deskripsi ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="link_youtube">Link YouTube</Label>
              <Input id="link_youtube" name="link_youtube" placeholder="https://youtube.com/watch?v=..." defaultValue={editing?.link_youtube ?? ""} />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus project ini?</AlertDialogTitle>
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
