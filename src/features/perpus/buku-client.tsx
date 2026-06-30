"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createBuku, updateBuku, deleteBuku } from "./actions";
import type { BukuRow } from "./types";

type FormState = {
  judul: string;
  pengarang: string;
  penerbit: string;
  tahun_terbit: string;
  isbn: string;
  kategori: string;
  lokasi_lemari: string;
  stok: string;
};

const emptyForm = (): FormState => ({
  judul: "",
  pengarang: "",
  penerbit: "",
  tahun_terbit: "",
  isbn: "",
  kategori: "",
  lokasi_lemari: "",
  stok: "1",
});

export function BukuClient({ rows }: { rows: BukuRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<BukuRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    if (!lower) return rows;
    return rows.filter(
      (r) =>
        r.judul.toLowerCase().includes(lower) ||
        (r.pengarang ?? "").toLowerCase().includes(lower) ||
        (r.kategori ?? "").toLowerCase().includes(lower) ||
        (r.lokasi_lemari ?? "").toLowerCase().includes(lower) ||
        (r.isbn ?? "").includes(lower),
    );
  }, [rows, search]);

  function openCreate() {
    setEditTarget(null);
    setForm(emptyForm());
    setError(null);
    setDialogOpen(true);
  }

  function openEdit(row: BukuRow) {
    setEditTarget(row);
    setForm({
      judul: row.judul,
      pengarang: row.pengarang ?? "",
      penerbit: row.penerbit ?? "",
      tahun_terbit: row.tahun_terbit?.toString() ?? "",
      isbn: row.isbn ?? "",
      kategori: row.kategori ?? "",
      lokasi_lemari: row.lokasi_lemari ?? "",
      stok: row.stok.toString(),
    });
    setError(null);
    setDialogOpen(true);
  }

  function f(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    if (!form.judul.trim()) { setError("Judul wajib diisi."); return; }
    const stok = parseInt(form.stok);
    if (isNaN(stok) || stok < 0) { setError("Stok harus berupa angka ≥ 0."); return; }
    startTransition(async () => {
      const payload = {
        judul: form.judul.trim(),
        pengarang: form.pengarang,
        penerbit: form.penerbit,
        tahun_terbit: form.tahun_terbit ? parseInt(form.tahun_terbit) : null,
        isbn: form.isbn,
        kategori: form.kategori,
        lokasi_lemari: form.lokasi_lemari,
        stok,
      };
      const result = editTarget
        ? await updateBuku(editTarget.id_buku, payload)
        : await createBuku(payload);
      if (result.success) { setDialogOpen(false); router.refresh(); }
      else setError(result.message ?? "Terjadi kesalahan.");
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteBuku(id);
      if (!result.success) alert(result.message);
      setDeleteId(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daftar Buku</h1>
          <p className="text-sm text-muted-foreground">Koleksi buku perpustakaan beserta lokasi dan stok.</p>
        </div>
        <Button onClick={openCreate} className="gap-1.5 shadow-sm">
          <Plus className="size-4" /> Tambah Buku
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari judul, pengarang, kategori, lokasi, atau ISBN..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Pengarang</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Lokasi Lemari</TableHead>
              <TableHead className="text-center">Stok</TableHead>
              <TableHead className="text-center">Dipinjam</TableHead>
              <TableHead className="text-center">Tersedia</TableHead>
              <TableHead className="w-24 text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <BookOpen className="size-8 opacity-30" />
                    <p className="text-sm">Belum ada data buku.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row, idx) => {
                const tersedia = row.stok - row.dipinjam;
                return (
                  <TableRow key={row.id_buku}>
                    <TableCell className="text-muted-foreground text-xs">{idx + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{row.judul}</p>
                        {row.isbn && <p className="text-xs text-muted-foreground">ISBN: {row.isbn}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{row.pengarang ?? "-"}</TableCell>
                    <TableCell>
                      {row.kategori ? (
                        <Badge variant="secondary" className="text-xs font-normal">{row.kategori}</Badge>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {row.lokasi_lemari ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {row.lokasi_lemari}
                        </span>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="text-center text-sm">{row.stok}</TableCell>
                    <TableCell className="text-center text-sm text-amber-600 dark:text-amber-400">
                      {row.dipinjam > 0 ? row.dipinjam : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`text-sm font-semibold ${tersedia === 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {tersedia}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button size="icon" variant="ghost" className="size-7 text-muted-foreground hover:text-foreground" onClick={() => openEdit(row)}>
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="size-7 text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(row.id_buku)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} dari {rows.length} buku.</p>

      {/* Dialog Tambah/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Buku" : "Tambah Buku"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label>Judul <span className="text-destructive">*</span></Label>
              <Input placeholder="Judul buku..." value={form.judul} onChange={(e) => f("judul", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Pengarang</Label>
                <Input placeholder="Nama pengarang..." value={form.pengarang} onChange={(e) => f("pengarang", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Penerbit</Label>
                <Input placeholder="Nama penerbit..." value={form.penerbit} onChange={(e) => f("penerbit", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Tahun Terbit</Label>
                <Input type="number" placeholder="2024" value={form.tahun_terbit} onChange={(e) => f("tahun_terbit", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>ISBN</Label>
                <Input placeholder="978-xxx-xxx..." value={form.isbn} onChange={(e) => f("isbn", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Kategori</Label>
                <Input placeholder="Novel, Sains, dll..." value={form.kategori} onChange={(e) => f("kategori", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Lokasi Lemari</Label>
                <Input placeholder="A-01, B-03, dll..." value={form.lokasi_lemari} onChange={(e) => f("lokasi_lemari", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Stok <span className="text-destructive">*</span></Label>
                <Input type="number" min={0} value={form.stok} onChange={(e) => f("stok", e.target.value)} />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Menyimpan..." : editTarget ? "Simpan Perubahan" : "Simpan Buku"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Hapus */}
      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Hapus Buku?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Buku tidak dapat dihapus jika masih ada peminjaman aktif.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Batal</Button>
            <Button variant="destructive" disabled={isPending} onClick={() => deleteId && handleDelete(deleteId)}>
              {isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
