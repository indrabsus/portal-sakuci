"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, UserPlus, UserMinus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getKelasSiswaData,
  addSiswaToKelasMasal,
  removeSiswaFromKelasMasal,
  type AnggotaKelasRow,
  type SiswaRow,
} from "./actions";

export function KelasSiswaModal({
  open,
  onOpenChange,
  idKelas,
  idTahunAjaran,
  namaKelas,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idKelas: string;
  idTahunAjaran: string;
  namaKelas: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [anggota, setAnggota] = useState<AnggotaKelasRow[]>([]);
  const [semuaSiswa, setSemuaSiswa] = useState<SiswaRow[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedAnggota, setSelectedAnggota] = useState<Set<string>>(new Set());
  const [selectedSiswa, setSelectedSiswa] = useState<Set<string>>(new Set());

  function loadData() {
    setLoading(true);
    setError(null);
    startTransition(async () => {
      const data = await getKelasSiswaData(idKelas);
      setAnggota(data.anggota);
      setSemuaSiswa(data.semuaSiswa);
      setLoading(false);
    });
  }

  useEffect(() => {
    if (open) {
      setSearch("");
      setSelectedAnggota(new Set());
      setSelectedSiswa(new Set());
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idKelas]);

  const anggotaIdSet = new Set(anggota.map((a) => a.id_siswa));
  const filteredSiswa = semuaSiswa.filter((s) =>
    s.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
    (s.nisn ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (s.kelas_dapodik ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  function toggleSiswa(idSiswa: string) {
    setSelectedSiswa((prev) => {
      const next = new Set(prev);
      if (next.has(idSiswa)) next.delete(idSiswa);
      else next.add(idSiswa);
      return next;
    });
  }

  function toggleAnggota(idSiswaKelas: string) {
    setSelectedAnggota((prev) => {
      const next = new Set(prev);
      if (next.has(idSiswaKelas)) next.delete(idSiswaKelas);
      else next.add(idSiswaKelas);
      return next;
    });
  }

  function handleAddSelected() {
    setError(null);
    if (selectedSiswa.size === 0) return;
    const formData = new FormData();
    formData.set("id_kelas", idKelas);
    formData.set("id_siswa_list", JSON.stringify(Array.from(selectedSiswa)));
    formData.set("id_tahun_ajaran", idTahunAjaran);
    startTransition(async () => {
      const result = await addSiswaToKelasMasal(formData);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setSelectedSiswa(new Set());
      loadData();
      router.refresh();
    });
  }

  function handleRemoveSelected() {
    setError(null);
    if (selectedAnggota.size === 0) return;
    const formData = new FormData();
    formData.set("id_siswa_kelas_list", JSON.stringify(Array.from(selectedAnggota)));
    startTransition(async () => {
      const result = await removeSiswaFromKelasMasal(formData);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setSelectedAnggota(new Set());
      loadData();
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Kelola Siswa - Kelas {namaKelas}</DialogTitle>
        </DialogHeader>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Anggota kelas */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Anggota Kelas ({anggota.length})</p>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
                disabled={isPending || selectedAnggota.size === 0}
                onClick={handleRemoveSelected}
              >
                <UserMinus className="size-3.5" />
                Keluarkan ({selectedAnggota.size})
              </Button>
            </div>
            <div className="h-[28rem] overflow-y-auto rounded-lg border">
              {loading ? (
                <p className="p-4 text-center text-sm text-muted-foreground">Memuat...</p>
              ) : anggota.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">Belum ada siswa</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="w-8 px-3 py-2"></th>
                      <th className="px-3 py-2 text-left font-semibold">Nama</th>
                      <th className="px-3 py-2 text-left font-semibold">NISN</th>
                      <th className="px-3 py-2 text-left font-semibold">Kelas Dapodik</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {anggota.map((a) => (
                      <tr
                        key={a.id_siswa_kelas}
                        className="cursor-pointer hover:bg-accent/30"
                        onClick={() => toggleAnggota(a.id_siswa_kelas)}
                      >
                        <td className="px-3 py-2">
                          <Checkbox
                            checked={selectedAnggota.has(a.id_siswa_kelas)}
                            onCheckedChange={() => toggleAnggota(a.id_siswa_kelas)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="px-3 py-2 font-medium">{a.nama_lengkap}</td>
                        <td className="px-3 py-2 text-muted-foreground">{a.nisn ?? "-"}</td>
                        <td className="px-3 py-2">
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {a.kelas_dapodik ?? "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Semua siswa */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Semua Siswa</p>
              <Button
                variant="outline"
                size="sm"
                className="text-primary hover:bg-primary/10"
                disabled={isPending || selectedSiswa.size === 0}
                onClick={handleAddSelected}
              >
                <UserPlus className="size-3.5" />
                Tambahkan ({selectedSiswa.size})
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, NISN, atau kelas dapodik..."
                className="pl-8"
              />
            </div>
            <div className="h-[25rem] overflow-y-auto rounded-lg border">
              {loading ? (
                <p className="p-4 text-center text-sm text-muted-foreground">Memuat...</p>
              ) : filteredSiswa.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">Tidak ditemukan</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="w-8 px-3 py-2"></th>
                      <th className="px-3 py-2 text-left font-semibold">Nama</th>
                      <th className="px-3 py-2 text-left font-semibold">NISN</th>
                      <th className="px-3 py-2 text-left font-semibold">Kelas Dapodik</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredSiswa.map((s) => {
                      const isMember = anggotaIdSet.has(s.id_siswa);
                      return (
                        <tr
                          key={s.id_siswa}
                          className={isMember ? "opacity-60" : "cursor-pointer hover:bg-accent/30"}
                          onClick={() => !isMember && toggleSiswa(s.id_siswa)}
                        >
                          <td className="px-3 py-2">
                            {!isMember && (
                              <Checkbox
                                checked={selectedSiswa.has(s.id_siswa)}
                                onCheckedChange={() => toggleSiswa(s.id_siswa)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            )}
                          </td>
                          <td className="px-3 py-2 font-medium">{s.nama_lengkap}</td>
                          <td className="px-3 py-2 text-muted-foreground">{s.nisn ?? "-"}</td>
                          <td className="px-3 py-2">
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              {s.kelas_dapodik ?? "-"}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right">
                            {isMember && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                                <Check className="size-3" />
                                Sudah ada
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
