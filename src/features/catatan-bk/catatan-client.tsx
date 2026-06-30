"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, FileText, Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createCatatanBk, updateCatatanBk, deleteCatatanBk } from "./actions";
import type { CatatanBkRow, SiswaOption } from "./types";

function formatTanggal(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

type FormState = {
  id_siswa: string;
  nama_siswa_display: string;
  kelas_display: string;
  tanggal: string;
  permasalahan: string;
  tindakan: string;
  kesepakatan: string;
  catatan_tambahan: string;
  nama_koordinator_bk: string;
  nip_koordinator_bk: string;
};

const emptyForm = (): FormState => ({
  id_siswa: "",
  nama_siswa_display: "",
  kelas_display: "",
  tanggal: new Date().toISOString().split("T")[0],
  permasalahan: "",
  tindakan: "",
  kesepakatan: "",
  catatan_tambahan: "",
  nama_koordinator_bk: "",
  nip_koordinator_bk: "",
});

function SiswaPicker({
  siswaOptions,
  onPick,
}: {
  siswaOptions: SiswaOption[];
  onPick: (s: SiswaOption) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const lower = q.toLowerCase();
    if (!lower) return siswaOptions.slice(0, 50);
    return siswaOptions
      .filter(
        (s) =>
          s.nama_lengkap.toLowerCase().includes(lower) ||
          s.kelas_label.toLowerCase().includes(lower) ||
          (s.nisn ?? "").includes(lower),
      )
      .slice(0, 50);
  }, [q, siswaOptions]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari nama, kelas, atau NISN..."
          className="pl-8 h-8 text-sm"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
      </div>
      <div className="max-h-52 overflow-y-auto rounded-md border text-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-1.5 text-xs">Nama</TableHead>
              <TableHead className="py-1.5 text-xs">Kelas</TableHead>
              <TableHead className="py-1.5 text-xs">NISN</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-4 text-xs">
                  Tidak ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow
                  key={s.id_siswa}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => onPick(s)}
                >
                  <TableCell className="py-1.5 font-medium">{s.nama_lengkap}</TableCell>
                  <TableCell className="py-1.5">{s.kelas_label}</TableCell>
                  <TableCell className="py-1.5 text-muted-foreground">{s.nisn ?? "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {filtered.length === 50 && (
        <p className="text-xs text-muted-foreground">Menampilkan 50 hasil pertama. Gunakan pencarian untuk mempersempit.</p>
      )}
    </div>
  );
}

export function CatatanBkClient({
  rows,
  siswaOptions,
  filterSiswaId,
}: {
  rows: CatatanBkRow[];
  siswaOptions: SiswaOption[];
  filterSiswaId?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(() => {
    if (!filterSiswaId) return "";
    const s = siswaOptions.find((o) => o.id_siswa === filterSiswaId);
    return s ? s.nama_lengkap : "";
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<CatatanBkRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [siswaPickerOpen, setSiswaPickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    if (!lower) return rows;
    return rows.filter(
      (r) =>
        r.nama_siswa.toLowerCase().includes(lower) ||
        r.kelas_label.toLowerCase().includes(lower) ||
        (r.nisn ?? "").includes(lower) ||
        r.permasalahan.toLowerCase().includes(lower),
    );
  }, [rows, search]);

  function openCreate() {
    setEditTarget(null);
    setForm(emptyForm());
    setError(null);
    setSiswaPickerOpen(false);
    setDialogOpen(true);
  }

  function openEdit(row: CatatanBkRow) {
    setEditTarget(row);
    setForm({
      id_siswa: row.id_siswa,
      nama_siswa_display: row.nama_siswa,
      kelas_display: row.kelas_label,
      tanggal: row.tanggal,
      permasalahan: row.permasalahan,
      tindakan: row.tindakan,
      kesepakatan: row.kesepakatan ?? "",
      catatan_tambahan: row.catatan_tambahan ?? "",
      nama_koordinator_bk: row.nama_koordinator_bk ?? "",
      nip_koordinator_bk: row.nip_koordinator_bk ?? "",
    });
    setError(null);
    setSiswaPickerOpen(false);
    setDialogOpen(true);
  }

  function handleSubmit() {
    if (!form.id_siswa || !form.tanggal || !form.permasalahan || !form.tindakan) {
      setError("Siswa, tanggal, permasalahan, dan tindakan wajib diisi.");
      return;
    }
    startTransition(async () => {
      const payload = {
        id_siswa: form.id_siswa,
        tanggal: form.tanggal,
        permasalahan: form.permasalahan,
        tindakan: form.tindakan,
        kesepakatan: form.kesepakatan,
        catatan_tambahan: form.catatan_tambahan,
        nama_koordinator_bk: form.nama_koordinator_bk,
        nip_koordinator_bk: form.nip_koordinator_bk,
      };
      const result = editTarget
        ? await updateCatatanBk(editTarget.id_catatan, payload)
        : await createCatatanBk(payload);
      if (result.success) {
        setDialogOpen(false);
        router.refresh();
      } else {
        setError(result.message ?? "Terjadi kesalahan.");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteCatatanBk(id);
      setDeleteId(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catatan Siswa</h1>
          <p className="text-sm text-muted-foreground">
            Catatan konseling manual BK — permasalahan, tindakan, dan kesepakatan.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-1.5 shadow-sm">
          <Plus className="size-4" />
          Tambah Catatan
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari nama, kelas, NISN, atau permasalahan..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabel Catatan */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Nama Siswa</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>NISN</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Permasalahan</TableHead>
              <TableHead className="w-28 text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <BookOpen className="size-8 opacity-30" />
                    <p className="text-sm">Belum ada catatan siswa.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row, idx) => (
                <TableRow key={row.id_catatan}>
                  <TableCell className="text-muted-foreground text-xs">{idx + 1}</TableCell>
                  <TableCell className="font-medium">{row.nama_siswa}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {row.kelas_label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{row.nisn ?? "-"}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap">{formatTanggal(row.tanggal)}</TableCell>
                  <TableCell className="text-sm max-w-xs">
                    <p className="line-clamp-2 text-foreground/80">{row.permasalahan}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7 text-muted-foreground hover:text-primary"
                        title="Surat Perjanjian"
                        onClick={() => router.push(`/bk/catatan/${row.id_catatan}/surat`)}
                      >
                        <FileText className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7 text-muted-foreground hover:text-foreground"
                        title="Edit"
                        onClick={() => openEdit(row)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7 text-destructive hover:bg-destructive/10"
                        title="Hapus"
                        onClick={() => setDeleteId(row.id_catatan)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Tambah/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Catatan" : "Tambah Catatan Siswa"}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            {/* Pilih Siswa */}
            <div className="flex flex-col gap-1.5">
              <Label>
                Siswa <span className="text-destructive">*</span>
              </Label>
              {form.id_siswa && !siswaPickerOpen ? (
                <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{form.nama_siswa_display}</p>
                    <p className="text-xs text-muted-foreground">{form.kelas_display}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={() => setSiswaPickerOpen(true)}
                  >
                    Ganti
                  </Button>
                </div>
              ) : (
                <SiswaPicker
                  siswaOptions={siswaOptions}
                  onPick={(s) => {
                    setForm((f) => ({
                      ...f,
                      id_siswa: s.id_siswa,
                      nama_siswa_display: s.nama_lengkap,
                      kelas_display: s.kelas_label,
                    }));
                    setSiswaPickerOpen(false);
                  }}
                />
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>
                Tanggal <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={form.tanggal}
                className="w-48"
                onChange={(e) => setForm((f) => ({ ...f, tanggal: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>
                Permasalahan <span className="text-destructive">*</span>
              </Label>
              <Textarea
                rows={3}
                placeholder="Uraikan permasalahan siswa..."
                value={form.permasalahan}
                onChange={(e) => setForm((f) => ({ ...f, permasalahan: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>
                Tindakan / Solusi <span className="text-destructive">*</span>
              </Label>
              <Textarea
                rows={3}
                placeholder="Tindakan atau solusi yang diberikan BK..."
                value={form.tindakan}
                onChange={(e) => setForm((f) => ({ ...f, tindakan: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Kesepakatan</Label>
              <Textarea
                rows={2}
                placeholder="Kesepakatan antara siswa dan BK (untuk surat perjanjian)..."
                value={form.kesepakatan}
                onChange={(e) => setForm((f) => ({ ...f, kesepakatan: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Catatan Tambahan</Label>
              <Textarea
                rows={2}
                placeholder="Catatan atau rekomendasi lanjutan..."
                value={form.catatan_tambahan}
                onChange={(e) => setForm((f) => ({ ...f, catatan_tambahan: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Nama Koordinator BK</Label>
                <Input
                  placeholder="Nama lengkap..."
                  value={form.nama_koordinator_bk}
                  onChange={(e) => setForm((f) => ({ ...f, nama_koordinator_bk: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>NIP Koordinator BK</Label>
                <Input
                  placeholder="NIP..."
                  value={form.nip_koordinator_bk}
                  onChange={(e) => setForm((f) => ({ ...f, nip_koordinator_bk: e.target.value }))}
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Menyimpan..." : editTarget ? "Simpan Perubahan" : "Simpan Catatan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Catatan?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              {isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
