"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CopyPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { duplicateKelas } from "./actions";

type Kelas = {
  id_kelas: string;
  nama_kelas: string;
  tingkat: number | null;
  id_jurusan: string | null;
  id_tahun_ajaran: string | null;
  aktif: boolean;
  jurusan_nama: string | null;
  tahun_ajaran_nama: string | null;
  jumlah_siswa: number;
};

export function DuplikatKelasModal({
  open,
  onOpenChange,
  rows,
  tahunAjaranOptions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rows: Kelas[];
  tahunAjaranOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [idTahunAjaranAsal, setIdTahunAjaranAsal] = useState("");
  const [idTahunAjaranTujuan, setIdTahunAjaranTujuan] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [naikkanTingkat, setNaikkanTingkat] = useState(true);
  const [sertakanSiswa, setSertakanSiswa] = useState(true);

  const kelasSumber = useMemo(
    () => rows.filter((r) => r.id_tahun_ajaran === idTahunAjaranAsal),
    [rows, idTahunAjaranAsal],
  );

  function resetState() {
    setError(null);
    setResult(null);
    setIdTahunAjaranAsal("");
    setIdTahunAjaranTujuan("");
    setSelected(new Set());
    setNaikkanTingkat(true);
    setSertakanSiswa(true);
  }

  function handleClose(next: boolean) {
    if (!next) resetState();
    onOpenChange(next);
  }

  function handleTahunAsalChange(v: string) {
    setIdTahunAjaranAsal(v);
    setSelected(new Set());
    setResult(null);
  }

  function toggleKelas(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === kelasSumber.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(kelasSumber.map((k) => k.id_kelas)));
    }
  }

  function handleSubmit() {
    setError(null);
    setResult(null);
    if (!idTahunAjaranTujuan) {
      setError("Pilih tahun ajaran tujuan.");
      return;
    }
    if (idTahunAjaranTujuan === idTahunAjaranAsal) {
      setError("Tahun ajaran tujuan harus berbeda dari tahun ajaran sumber.");
      return;
    }
    if (selected.size === 0) {
      setError("Pilih minimal satu kelas untuk diduplikat.");
      return;
    }

    const formData = new FormData();
    formData.set("id_tahun_ajaran_tujuan", idTahunAjaranTujuan);
    formData.set("id_kelas_list", JSON.stringify(Array.from(selected)));
    if (naikkanTingkat) formData.set("naikkan_tingkat", "on");
    if (sertakanSiswa) formData.set("sertakan_siswa", "on");

    setIsPending(true);
    duplicateKelas(formData).then((res) => {
      setIsPending(false);
      if (!res.success) {
        setError(res.message);
        return;
      }
      setResult(res.message);
      setSelected(new Set());
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Duplikat Kelas ke Tahun Ajaran Lain</DialogTitle>
        </DialogHeader>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
        {result && (
          <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{result}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Dari Tahun Ajaran</Label>
            <Select value={idTahunAjaranAsal} onValueChange={(v) => handleTahunAsalChange(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih tahun ajaran">
                  {() => tahunAjaranOptions.find((t) => t.value === idTahunAjaranAsal)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tahunAjaranOptions.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Ke Tahun Ajaran</Label>
            <Select value={idTahunAjaranTujuan} onValueChange={(v) => setIdTahunAjaranTujuan(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih tahun ajaran">
                  {() => tahunAjaranOptions.find((t) => t.value === idTahunAjaranTujuan)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tahunAjaranOptions.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              Pilih Kelas {kelasSumber.length > 0 && `(${selected.size}/${kelasSumber.length})`}
            </p>
          </div>
          <div className="h-64 overflow-y-auto rounded-lg border">
            {!idTahunAjaranAsal ? (
              <p className="p-4 text-center text-sm text-muted-foreground">Pilih tahun ajaran sumber dulu.</p>
            ) : kelasSumber.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">Belum ada kelas di tahun ajaran ini.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="w-8 px-3 py-2">
                      <Checkbox
                        checked={kelasSumber.length > 0 && selected.size === kelasSumber.length}
                        onCheckedChange={toggleAll}
                      />
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">Nama Kelas</th>
                    <th className="px-3 py-2 text-left font-semibold">Tingkat</th>
                    <th className="px-3 py-2 text-left font-semibold">Jurusan</th>
                    <th className="px-3 py-2 text-left font-semibold">Siswa</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {kelasSumber.map((k) => (
                    <tr
                      key={k.id_kelas}
                      className="cursor-pointer hover:bg-accent/30"
                      onClick={() => toggleKelas(k.id_kelas)}
                    >
                      <td className="px-3 py-2">
                        <Checkbox
                          checked={selected.has(k.id_kelas)}
                          onCheckedChange={() => toggleKelas(k.id_kelas)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-3 py-2 font-medium">{k.nama_kelas}</td>
                      <td className="px-3 py-2 text-muted-foreground">{k.tingkat ?? "-"}</td>
                      <td className="px-3 py-2 text-muted-foreground">{k.jurusan_nama ?? "-"}</td>
                      <td className="px-3 py-2 text-muted-foreground">{k.jumlah_siswa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox checked={naikkanTingkat} onCheckedChange={(v) => setNaikkanTingkat(v === true)} id="naikkan-tingkat" />
            <Label htmlFor="naikkan-tingkat">Naikkan tingkat +1 (cth: 11 → 12)</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={sertakanSiswa} onCheckedChange={(v) => setSertakanSiswa(v === true)} id="sertakan-siswa" />
            <Label htmlFor="sertakan-siswa">Sertakan siswa yang ada di kelas tersebut</Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Kalau kelas dengan nama yang sama sudah ada di tahun ajaran tujuan, kelas itu akan dipakai ulang
            (tidak dibuat dobel).
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)} disabled={isPending}>
            Tutup
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            <CopyPlus className="size-4" />
            {isPending ? "Menduplikat..." : `Duplikat ${selected.size} Kelas`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
