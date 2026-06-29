"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { BankSoalRow } from "@/features/bank-soal/types";
import { getSoalTugasData, tambahSoalKeTugas, hapusSoalDariTugas, type SoalTugasRow } from "./actions";

export function SoalTugasModal({
  open,
  onOpenChange,
  idTugas,
  judulTugas,
  bankSoal,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idTugas: string;
  judulTugas: string;
  bankSoal: BankSoalRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [terpilih, setTerpilih] = useState<SoalTugasRow[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  function loadData() {
    setLoading(true);
    startTransition(async () => {
      const data = await getSoalTugasData(idTugas);
      setTerpilih(data.terpilih);
      setLoading(false);
    });
  }

  useEffect(() => {
    if (open) {
      setSearch("");
      setError(null);
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idTugas]);

  const terpilihIdSet = new Set(terpilih.map((t) => t.id_soal));
  const filteredSoal = bankSoal.filter((s) =>
    s.pertanyaan.toLowerCase().includes(search.toLowerCase()) ||
    (s.mapel_nama ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  function handleAdd(idSoal: string) {
    setError(null);
    const formData = new FormData();
    formData.set("id_tugas", idTugas);
    formData.set("id_soal", idSoal);
    startTransition(async () => {
      const result = await tambahSoalKeTugas(formData);
      if (!result.success) {
        setError(result.message);
        return;
      }
      loadData();
      router.refresh();
    });
  }

  function handleRemove(id: string) {
    const formData = new FormData();
    formData.set("id_tugas_soal", id);
    startTransition(async () => {
      await hapusSoalDariTugas(formData);
      loadData();
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Kelola Soal - {judulTugas}</DialogTitle>
        </DialogHeader>

        {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">Soal Terpilih ({terpilih.length})</p>
            <div className="h-[26rem] overflow-y-auto rounded-lg border">
              {loading ? (
                <p className="p-4 text-center text-sm text-muted-foreground">Memuat...</p>
              ) : terpilih.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">Belum ada soal</p>
              ) : (
                <ul className="divide-y">
                  {terpilih.map((t) => (
                    <li key={t.id_tugas_soal} className="flex items-start justify-between gap-2 px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">No. {t.nomor}</p>
                        <p className="line-clamp-2 text-sm">{t.pertanyaan}</p>
                        <Badge variant={t.tipe_soal === "pg" ? "default" : "secondary"} className="mt-1">
                          {t.tipe_soal === "pg" ? "PG" : "Essay"}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0 text-destructive hover:bg-destructive/10"
                        disabled={isPending}
                        onClick={() => handleRemove(t.id_tugas_soal)}
                        aria-label="Hapus dari tugas"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">Bank Soal</p>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari pertanyaan atau mapel..."
                className="pl-8"
              />
            </div>
            <div className="h-[22rem] overflow-y-auto rounded-lg border">
              {filteredSoal.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">Tidak ditemukan. Buat soal di Bank Soal dulu.</p>
              ) : (
                <ul className="divide-y">
                  {filteredSoal.map((s) => {
                    const isSelected = terpilihIdSet.has(s.id_soal);
                    return (
                      <li key={s.id_soal} className="flex items-start justify-between gap-2 px-3 py-2">
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm">{s.pertanyaan}</p>
                          <p className="text-xs text-muted-foreground">{s.mapel_nama ?? "-"}</p>
                        </div>
                        {isSelected ? (
                          <Badge variant="secondary" className="shrink-0">Terpilih</Badge>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0 text-primary hover:bg-primary/10"
                            disabled={isPending}
                            onClick={() => handleAdd(s.id_soal)}
                            aria-label="Tambahkan"
                          >
                            <Plus className="size-3.5" />
                          </Button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
