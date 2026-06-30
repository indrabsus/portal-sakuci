"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, CheckCircle2, Trash2, BookOpen, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createPeminjaman, kembalikanBuku, deletePeminjaman } from "./actions";
import type { BukuRow, PeminjamanRow, SiswaOption } from "./types";

function formatTanggal(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function isTerlambat(tanggalRencana: string, status: string) {
  if (status !== "dipinjam") return false;
  return new Date(tanggalRencana) < new Date();
}

const STATUS_CONFIG = {
  dipinjam: { label: "Dipinjam", className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300" },
  dikembalikan: { label: "Dikembalikan", className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300" },
  terlambat: { label: "Terlambat", className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300" },
} as const;

function SiswaPicker({ siswaOptions, onPick }: { siswaOptions: SiswaOption[]; onPick: (s: SiswaOption) => void }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const lower = q.toLowerCase();
    if (!lower) return siswaOptions.slice(0, 50);
    return siswaOptions.filter(
      (s) => s.nama_lengkap.toLowerCase().includes(lower) || s.kelas_label.toLowerCase().includes(lower) || (s.nisn ?? "").includes(lower),
    ).slice(0, 50);
  }, [q, siswaOptions]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Cari nama, kelas, atau NISN..." className="pl-8 h-8 text-sm" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
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
              <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-4 text-xs">Tidak ditemukan</TableCell></TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id_siswa} className="cursor-pointer hover:bg-accent" onClick={() => onPick(s)}>
                  <TableCell className="py-1.5 font-medium">{s.nama_lengkap}</TableCell>
                  <TableCell className="py-1.5">{s.kelas_label}</TableCell>
                  <TableCell className="py-1.5 text-muted-foreground">{s.nisn ?? "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {filtered.length === 50 && <p className="text-xs text-muted-foreground">Menampilkan 50 hasil pertama.</p>}
    </div>
  );
}

function BukuPicker({ bukuOptions, onPick }: { bukuOptions: BukuRow[]; onPick: (b: BukuRow) => void }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const lower = q.toLowerCase();
    if (!lower) return bukuOptions.slice(0, 50);
    return bukuOptions.filter(
      (b) => b.judul.toLowerCase().includes(lower) || (b.pengarang ?? "").toLowerCase().includes(lower) || (b.lokasi_lemari ?? "").toLowerCase().includes(lower),
    ).slice(0, 50);
  }, [q, bukuOptions]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Cari judul atau pengarang..." className="pl-8 h-8 text-sm" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
      </div>
      <div className="max-h-52 overflow-y-auto rounded-md border text-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-1.5 text-xs">Judul</TableHead>
              <TableHead className="py-1.5 text-xs">Pengarang</TableHead>
              <TableHead className="py-1.5 text-xs">Lokasi</TableHead>
              <TableHead className="py-1.5 text-xs text-center">Tersedia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-4 text-xs">Tidak ditemukan</TableCell></TableRow>
            ) : (
              filtered.map((b) => {
                const tersedia = b.stok - b.dipinjam;
                return (
                  <TableRow
                    key={b.id_buku}
                    className={tersedia > 0 ? "cursor-pointer hover:bg-accent" : "opacity-40 cursor-not-allowed"}
                    onClick={() => tersedia > 0 && onPick(b)}
                  >
                    <TableCell className="py-1.5 font-medium">{b.judul}</TableCell>
                    <TableCell className="py-1.5 text-muted-foreground">{b.pengarang ?? "-"}</TableCell>
                    <TableCell className="py-1.5">
                      {b.lokasi_lemari ? (
                        <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {b.lokasi_lemari}
                        </span>
                      ) : "-"}
                    </TableCell>
                    <TableCell className={`py-1.5 text-center font-semibold ${tersedia === 0 ? "text-destructive" : "text-emerald-600"}`}>{tersedia}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

type FilterStatus = "semua" | "dipinjam" | "dikembalikan" | "terlambat";

export function PeminjamanClient({
  rows,
  siswaOptions,
  bukuOptions,
}: {
  rows: PeminjamanRow[];
  siswaOptions: SiswaOption[];
  bukuOptions: BukuRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("semua");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [kembalikanId, setKembalikanId] = useState<string | null>(null);

  // Form state
  const [siswa, setSiswa] = useState<SiswaOption | null>(null);
  const [siswaPickerOpen, setSiswaPickerOpen] = useState(false);
  const [buku, setBuku] = useState<BukuRow | null>(null);
  const [bukuPickerOpen, setBukuPickerOpen] = useState(false);
  const [tanggalPinjam, setTanggalPinjam] = useState(new Date().toISOString().split("T")[0]);
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [catatan, setCatatan] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const rowsWithStatus = useMemo<PeminjamanRow[]>(() =>
    rows.map((r) => ({
      ...r,
      status: isTerlambat(r.tanggal_kembali_rencana, r.status) ? "terlambat" : r.status,
    })),
    [rows],
  );

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return rowsWithStatus.filter((r) => {
      const matchSearch = !lower ||
        r.nama_siswa.toLowerCase().includes(lower) ||
        r.judul_buku.toLowerCase().includes(lower) ||
        r.kelas_label.toLowerCase().includes(lower) ||
        (r.nisn ?? "").includes(lower);
      const matchStatus = filterStatus === "semua" || r.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [rowsWithStatus, search, filterStatus]);

  const counts = useMemo(() => ({
    dipinjam: rowsWithStatus.filter((r) => r.status === "dipinjam").length,
    dikembalikan: rowsWithStatus.filter((r) => r.status === "dikembalikan").length,
    terlambat: rowsWithStatus.filter((r) => r.status === "terlambat").length,
  }), [rowsWithStatus]);

  function openCreate() {
    setSiswa(null); setBuku(null); setSiswaPickerOpen(false); setBukuPickerOpen(false);
    setTanggalPinjam(new Date().toISOString().split("T")[0]); setTanggalKembali(""); setCatatan(""); setFormError(null);
    setDialogOpen(true);
  }

  function handleSubmit() {
    if (!siswa) { setFormError("Pilih siswa terlebih dahulu."); return; }
    if (!buku) { setFormError("Pilih buku terlebih dahulu."); return; }
    if (!tanggalPinjam || !tanggalKembali) { setFormError("Tanggal pinjam dan kembali wajib diisi."); return; }
    if (tanggalKembali <= tanggalPinjam) { setFormError("Tanggal kembali harus setelah tanggal pinjam."); return; }
    startTransition(async () => {
      const result = await createPeminjaman({
        id_siswa: siswa.id_siswa,
        id_buku: buku.id_buku,
        tanggal_pinjam: tanggalPinjam,
        tanggal_kembali_rencana: tanggalKembali,
        catatan,
      });
      if (result.success) { setDialogOpen(false); router.refresh(); }
      else setFormError(result.message ?? "Terjadi kesalahan.");
    });
  }

  function handleKembalikan(id: string) {
    startTransition(async () => {
      await kembalikanBuku(id);
      setKembalikanId(null);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deletePeminjaman(id);
      setDeleteId(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Peminjaman Buku</h1>
          <p className="text-sm text-muted-foreground">Catat dan kelola peminjaman buku siswa.</p>
        </div>
        <Button onClick={openCreate} className="gap-1.5 shadow-sm">
          <Plus className="size-4" /> Catat Peminjaman
        </Button>
      </div>

      {/* Kartu ringkasan */}
      <div className="grid grid-cols-3 gap-3">
        {([
          { key: "dipinjam", label: "Sedang Dipinjam", icon: BookOpen, color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300" },
          { key: "terlambat", label: "Terlambat", icon: AlertCircle, color: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300" },
          { key: "dikembalikan", label: "Dikembalikan", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300" },
        ] as const).map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? "semua" : key)}
            className={`rounded-xl border px-4 py-3 text-left transition-all hover:shadow-sm ${color} ${filterStatus === key ? "ring-2 ring-primary" : ""}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</p>
              <Icon className="size-4 opacity-60" />
            </div>
            <p className="mt-1 text-2xl font-bold">{counts[key]}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Cari nama siswa, judul buku, kelas, atau NISN..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Tabel */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Siswa</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Judul Buku</TableHead>
              <TableHead>Lokasi Lemari</TableHead>
              <TableHead>Tgl Pinjam</TableHead>
              <TableHead>Tgl Kembali</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-24 text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Clock className="size-8 opacity-30" />
                    <p className="text-sm">Belum ada data peminjaman.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row, idx) => {
                const cfg = STATUS_CONFIG[row.status];
                return (
                  <TableRow key={row.id_peminjaman}>
                    <TableCell className="text-muted-foreground text-xs">{idx + 1}</TableCell>
                    <TableCell className="font-medium text-sm">{row.nama_siswa}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs font-normal">{row.kelas_label}</Badge>
                    </TableCell>
                    <TableCell className="text-sm max-w-[180px]">
                      <p className="line-clamp-2">{row.judul_buku}</p>
                    </TableCell>
                    <TableCell>
                      {row.lokasi_lemari ? (
                        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {row.lokasi_lemari}
                        </span>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{formatTanggal(row.tanggal_pinjam)}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {row.tanggal_kembali_aktual
                        ? formatTanggal(row.tanggal_kembali_aktual)
                        : formatTanggal(row.tanggal_kembali_rencana)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
                        {cfg.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        {row.status !== "dikembalikan" && (
                          <Button size="icon" variant="ghost" className="size-7 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950" title="Tandai Dikembalikan" onClick={() => setKembalikanId(row.id_peminjaman)}>
                            <CheckCircle2 className="size-3.5" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" className="size-7 text-destructive hover:bg-destructive/10" title="Hapus" onClick={() => setDeleteId(row.id_peminjaman)}>
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
      <p className="text-xs text-muted-foreground">
        {filtered.length} dari {rows.length} peminjaman.
        {filterStatus !== "semua" && (
          <button className="ml-1 underline hover:text-foreground" onClick={() => setFilterStatus("semua")}>Tampilkan semua</button>
        )}
      </p>

      {/* Dialog Catat Peminjaman */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Catat Peminjaman Buku</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            {/* Pilih Siswa */}
            <div className="flex flex-col gap-1.5">
              <Label>Siswa <span className="text-destructive">*</span></Label>
              {siswa && !siswaPickerOpen ? (
                <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{siswa.nama_lengkap}</p>
                    <p className="text-xs text-muted-foreground">{siswa.kelas_label}{siswa.nisn ? ` · ${siswa.nisn}` : ""}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setSiswaPickerOpen(true)}>Ganti</Button>
                </div>
              ) : (
                <SiswaPicker siswaOptions={siswaOptions} onPick={(s) => { setSiswa(s); setSiswaPickerOpen(false); }} />
              )}
            </div>

            {/* Pilih Buku */}
            <div className="flex flex-col gap-1.5">
              <Label>Buku <span className="text-destructive">*</span></Label>
              {buku && !bukuPickerOpen ? (
                <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{buku.judul}</p>
                    <p className="text-xs text-muted-foreground">
                      {buku.pengarang ?? ""}
                      {buku.lokasi_lemari ? ` · Lemari ${buku.lokasi_lemari}` : ""}
                      {` · Tersedia: ${buku.stok - buku.dipinjam}`}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setBukuPickerOpen(true)}>Ganti</Button>
                </div>
              ) : (
                <BukuPicker bukuOptions={bukuOptions} onPick={(b) => { setBuku(b); setBukuPickerOpen(false); }} />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Tanggal Pinjam <span className="text-destructive">*</span></Label>
                <Input type="date" value={tanggalPinjam} onChange={(e) => setTanggalPinjam(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Tanggal Kembali <span className="text-destructive">*</span></Label>
                <Input type="date" value={tanggalKembali} onChange={(e) => setTanggalKembali(e.target.value)} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Catatan</Label>
              <Input placeholder="Catatan opsional..." value={catatan} onChange={(e) => setCatatan(e.target.value)} />
            </div>

            {formError && <p className="text-sm text-destructive">{formError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Menyimpan..." : "Catat Peminjaman"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Kembalikan */}
      <Dialog open={!!kembalikanId} onOpenChange={(o) => { if (!o) setKembalikanId(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Tandai Dikembalikan?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Tanggal kembali akan diisi hari ini.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setKembalikanId(null)}>Batal</Button>
            <Button disabled={isPending} onClick={() => kembalikanId && handleKembalikan(kembalikanId)}>
              {isPending ? "Menyimpan..." : "Konfirmasi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Hapus */}
      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Hapus Peminjaman?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Data peminjaman ini akan dihapus permanen.</p>
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
