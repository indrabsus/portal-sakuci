"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, KeyRound, Trash2, RefreshCcw, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SimpleCrud } from "@/components/simple-crud";
import { printPortraitA4 } from "@/lib/print-portrait";
import {
  createSiswa,
  updateSiswa,
  deleteSiswa,
  deleteSiswaBulk,
  updateStatusSiswaBulk,
  resetPasswordSiswa,
  type SaranAktivasiSiswa,
} from "./actions";
import { ImportExcelDialog } from "./import-excel";
import { AktivasiMassalSiswaDialog } from "./aktivasi-massal";

type Siswa = {
  id_siswa: string;
  nama_lengkap: string;
  nisn: string | null;
  jenkel: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  agama: string | null;
  no_hp: string | null;
  aktif: boolean;
  akun_aktif: boolean;
  id_profile: string | null;
  username: string | null;
  kelas_terkini: string | null;
};

function formatTtl(tempat: string | null, tanggal: string | null) {
  const tgl = tanggal
    ? new Date(tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : null;
  if (tempat && tgl) return `${tempat}, ${tgl}`;
  if (tgl) return tgl;
  if (tempat) return tempat;
  return "-";
}

const SEMUA_KELAS = "__semua__";
const BELUM_KELAS = "__belum__";

export function SiswaClient({
  rows,
  kelasOptions,
  saran,
}: {
  rows: Siswa[];
  kelasOptions: string[];
  saran: SaranAktivasiSiswa[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState(SEMUA_KELAS);
  const [resetTarget, setResetTarget] = useState<Siswa | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [isBulkPending, startBulkTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return rows.filter((r) => {
      const matchKelas =
        filterKelas === SEMUA_KELAS ||
        (filterKelas === BELUM_KELAS ? r.kelas_terkini === null : r.kelas_terkini === filterKelas);
      const matchSearch =
        !q ||
        r.nama_lengkap.toLowerCase().includes(q) ||
        (r.nisn ?? "").toLowerCase().includes(q) ||
        (r.kelas_terkini ?? "").toLowerCase().includes(q);
      return matchKelas && matchSearch;
    });
  }, [rows, search, filterKelas]);

  const belumAktivasi = useMemo(
    () => filtered.filter((r) => !r.akun_aktif).map((r) => ({ id_siswa: r.id_siswa, nama_lengkap: r.nama_lengkap })),
    [filtered],
  );
  const belumAktivasiIds = useMemo(() => new Set(belumAktivasi.map((s) => s.id_siswa)), [belumAktivasi]);
  const saranFiltered = useMemo(() => saran.filter((s) => belumAktivasiIds.has(s.id_siswa)), [saran, belumAktivasiIds]);

  function handleReset() {
    if (!resetTarget?.id_profile || !resetTarget.nisn) return;
    setMessage(null);
    const formData = new FormData();
    formData.set("id_profile", resetTarget.id_profile);
    formData.set("nisn", resetTarget.nisn);
    startTransition(async () => {
      const result = await resetPasswordSiswa(formData);
      setMessage(result.message);
      if (result.success) router.refresh();
    });
  }

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectedAll(ids: string[], checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }

  function handleBulkDelete() {
    const ids = [...selectedIds];
    startBulkTransition(async () => {
      const result = await deleteSiswaBulk(ids);
      setMessage(result.message);
      setBulkDeleteOpen(false);
      if (result.success) {
        setSelectedIds(new Set());
        router.refresh();
      }
    });
  }

  function handleBulkStatus(aktif: boolean) {
    const ids = [...selectedIds];
    startBulkTransition(async () => {
      const result = await updateStatusSiswaBulk(ids, aktif);
      setMessage(result.message);
      setStatusModalOpen(false);
      if (result.success) {
        setSelectedIds(new Set());
        router.refresh();
      }
    });
  }

  const filterLabel =
    filterKelas === SEMUA_KELAS ? "Semua Kelas" : filterKelas === BELUM_KELAS ? "Belum Masuk Kelas" : filterKelas;
  const printTitle =
    filterKelas === SEMUA_KELAS
      ? "Data Siswa"
      : filterKelas === BELUM_KELAS
        ? "Data Siswa Belum Masuk Kelas"
        : `Data Siswa Kelas ${filterKelas}`;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="no-print flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Import Data Siswa</p>
          <p className="text-sm text-muted-foreground">Tambahkan banyak siswa sekaligus dari file Excel.</p>
        </div>
        <ImportExcelDialog onSelesai={() => router.refresh()} />
      </div>

      <div className="no-print flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Aksi Massal Siswa</p>
          <p className="text-sm text-muted-foreground">
            Aktivasi akun, atau centang siswa di tabel untuk mengubah status atau menghapus sekaligus (mengikuti
            filter kelas &amp; pencarian saat ini).
            {selectedIds.size > 0 ? ` ${selectedIds.size} siswa dipilih.` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AktivasiMassalSiswaDialog
            siswaBelumAktivasi={belumAktivasi}
            saran={saranFiltered}
            onSelesai={() => router.refresh()}
          />
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => setStatusModalOpen(true)}
            disabled={selectedIds.size === 0}
          >
            <RefreshCcw className="size-4" />
            Ubah Status {selectedIds.size > 0 ? `(${selectedIds.size})` : ""}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2 text-destructive hover:bg-destructive/10"
            onClick={() => setBulkDeleteOpen(true)}
            disabled={selectedIds.size === 0}
          >
            <Trash2 className="size-4" />
            Hapus {selectedIds.size > 0 ? `(${selectedIds.size})` : ""}
          </Button>
        </div>
      </div>

      <div className="no-print flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NISN, atau kelas..."
            className="pl-8"
          />
        </div>
        <Select value={filterKelas} onValueChange={(v) => setFilterKelas(v ?? SEMUA_KELAS)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue>{filterLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SEMUA_KELAS} label="Semua Kelas">
              Semua Kelas
            </SelectItem>
            <SelectItem value={BELUM_KELAS} label="Belum Masuk Kelas">
              Belum Masuk Kelas
            </SelectItem>
            {kelasOptions.map((k) => (
              <SelectItem key={k} value={k} label={k}>
                {k}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" className="w-full gap-2 sm:ml-auto sm:w-auto" onClick={printPortraitA4}>
          <Printer className="size-4" />
          Cetak PDF
        </Button>
      </div>

      {message && (
        <p className="no-print rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{message}</p>
      )}

      <div className="no-print">
      <SimpleCrud<Siswa>
        title="Siswa"
        idKey="id_siswa"
        rows={filtered}
        selection={{ selectedIds, onToggle: toggleSelected, onToggleAll: toggleSelectedAll }}
        columns={[
          { key: "nama_lengkap", label: "Nama Lengkap" },
          { key: "nisn", label: "NISN" },
          {
            key: "tanggal_lahir",
            label: "Tempat, Tanggal Lahir",
            render: (r) => formatTtl(r.tempat_lahir, r.tanggal_lahir),
          },
          { key: "no_hp", label: "No. HP", render: (r) => r.no_hp ?? "-" },
          { key: "kelas_terkini", label: "Kelas", render: (r) => r.kelas_terkini ?? "-" },
          { key: "aktif", label: "Status", render: (r) => (r.aktif ? "Aktif" : "Nonaktif") },
          {
            key: "akun_aktif",
            label: "Akun",
            render: (r) =>
              r.akun_aktif ? <Badge>Aktif</Badge> : <Badge variant="secondary">Belum aktivasi</Badge>,
          },
        ]}
        fields={[
          { name: "nama_lengkap", label: "Nama Lengkap", required: true },
          { name: "nisn", label: "NISN", required: true },
          { name: "tanggal_lahir", label: "Tanggal Lahir (untuk aktivasi akun)", type: "date", required: true },
          { name: "tempat_lahir", label: "Tempat Lahir" },
          {
            name: "jenkel",
            label: "Jenis Kelamin",
            type: "select",
            options: [
              { value: "L", label: "Laki-laki" },
              { value: "P", label: "Perempuan" },
            ],
          },
          { name: "agama", label: "Agama" },
          { name: "aktif", label: "Aktif", type: "checkbox" },
        ]}
        createAction={createSiswa}
        updateAction={updateSiswa}
        deleteAction={deleteSiswa}
        renderExtraActions={(row) =>
          row.akun_aktif ? (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-primary hover:bg-primary/10"
              onClick={() => {
                setMessage(null);
                setResetTarget(row);
              }}
              aria-label="Reset password"
            >
              <KeyRound className="size-3.5" />
            </Button>
          ) : null
        }
      />
      </div>

      <div className="hidden print:block p-6">
        <h1 className="mb-3 text-lg font-bold">{printTitle}</h1>
        <Table>
          <TableHeader className="print:table-header-group">
            <TableRow className="print:break-inside-avoid">
              <TableHead className="border">Nama Lengkap</TableHead>
              <TableHead className="border">Username</TableHead>
              <TableHead className="border">No HP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id_siswa} className="print:break-inside-avoid">
                <TableCell className="border">{r.nama_lengkap}</TableCell>
                <TableCell className="border">{r.username ?? "-"}</TableCell>
                <TableCell className="border">{r.no_hp ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!resetTarget} onOpenChange={(open) => !open && setResetTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password - {resetTarget?.nama_lengkap}</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Password akan direset ke NISN siswa: <span className="font-mono font-medium text-foreground">{resetTarget?.nisn}</span>
          </p>

          {message && (
            <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{message}</p>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setResetTarget(null)} disabled={isPending}>
              Tutup
            </Button>
            <Button onClick={handleReset} disabled={isPending}>
              {isPending ? "Memproses..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {selectedIds.size} siswa terpilih?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkPending}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} disabled={isBulkPending}>
              {isBulkPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah status {selectedIds.size} siswa terpilih</DialogTitle>
            <DialogDescription>Pilih status baru untuk seluruh siswa yang dicentang.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setStatusModalOpen(false)} disabled={isBulkPending}>
              Batal
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleBulkStatus(false)}
              disabled={isBulkPending}
            >
              {isBulkPending ? "Memproses..." : "Jadikan Tidak Aktif"}
            </Button>
            <Button type="button" onClick={() => handleBulkStatus(true)} disabled={isBulkPending}>
              {isBulkPending ? "Memproses..." : "Jadikan Aktif"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
