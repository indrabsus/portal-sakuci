"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { createKelasMasal } from "./actions";

export function KelasMasalModal({
  open,
  onOpenChange,
  jurusanOptions,
  tahunAjaranOptions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jurusanOptions: { value: string; label: string }[];
  tahunAjaranOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [prefix, setPrefix] = useState("PPLG");
  const [awal, setAwal] = useState("1");
  const [akhir, setAkhir] = useState("10");
  const [tingkat, setTingkat] = useState("");
  const [idJurusan, setIdJurusan] = useState("");
  const [idTahunAjaran, setIdTahunAjaran] = useState("");
  const [aktif, setAktif] = useState(true);

  const jumlah = Math.max(0, (Number(akhir) || 0) - (Number(awal) || 0) + 1);

  function handleSubmit() {
    setError(null);
    const formData = new FormData();
    formData.set("prefix", prefix);
    formData.set("awal", awal);
    formData.set("akhir", akhir);
    formData.set("tingkat", tingkat);
    formData.set("id_jurusan", idJurusan);
    formData.set("id_tahun_ajaran", idTahunAjaran);
    if (aktif) formData.set("aktif", "on");

    startTransition(async () => {
      const result = await createKelasMasal(formData);
      if (!result.success) {
        setError(result.message);
        return;
      }
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Buat Kelas Massal</DialogTitle>
        </DialogHeader>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5">
            <Label>Prefix Nama Kelas (cth: PPLG)</Label>
            <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="PPLG" />
          </div>
          <div className="space-y-1.5">
            <Label>Nomor Awal</Label>
            <Input type="number" value={awal} onChange={(e) => setAwal(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Nomor Akhir</Label>
            <Input type="number" value={akhir} onChange={(e) => setAkhir(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Tingkat (cth: 10)</Label>
            <Input type="number" value={tingkat} onChange={(e) => setTingkat(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Jurusan</Label>
            <Select value={idJurusan} onValueChange={(v) => setIdJurusan(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jurusan">
                  {() => jurusanOptions.find((j) => j.value === idJurusan)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {jurusanOptions.map((j) => (
                  <SelectItem key={j.value} value={j.value}>
                    {j.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>Tahun Ajaran</Label>
            <Select value={idTahunAjaran} onValueChange={(v) => setIdTahunAjaran(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih tahun ajaran">
                  {() => tahunAjaranOptions.find((t) => t.value === idTahunAjaran)?.label}
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
          <div className="col-span-2 flex items-center gap-2">
            <Checkbox checked={aktif} onCheckedChange={(v) => setAktif(v === true)} id="kelas-masal-aktif" />
            <Label htmlFor="kelas-masal-aktif">Aktif</Label>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Akan membuat {jumlah} kelas: {prefix} {awal} sampai {prefix} {akhir}.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Membuat..." : `Buat ${jumlah} Kelas`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
