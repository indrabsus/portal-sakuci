"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Trash2, FilePlus2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SoalKompetensiFormDialog } from "@/features/soal-kompetensi/soal-kompetensi-form-dialog";
import { listSoalKompetensi } from "@/features/soal-kompetensi/actions";
import type { SoalKompetensiRow } from "@/features/soal-kompetensi/types";
import { getSoalTesData, tambahSoalKeTes, hapusSoalDariTes, type SoalTesRow } from "./actions";

export function SoalTesModal({
  open,
  onOpenChange,
  idKompetensiTugas,
  judulTes,
  idJurusanDefault,
  jurusanOptions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idKompetensiTugas: string;
  judulTes: string;
  idJurusanDefault?: string;
  jurusanOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [terpilih, setTerpilih] = useState<SoalTesRow[]>([]);
  const [bankSoal, setBankSoal] = useState<SoalKompetensiRow[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  function loadData() {
    setLoading(true);
    startTransition(async () => {
      const [tesData, bank] = await Promise.all([getSoalTesData(idKompetensiTugas), listSoalKompetensi()]);
      setTerpilih(tesData.terpilih);
      setBankSoal(bank);
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
  }, [open, idKompetensiTugas]);

  const terpilihIdSet = new Set(terpilih.map((t) => t.id_soal));
  const filteredSoal = bankSoal.filter((s) =>
    s.pertanyaan.toLowerCase().includes(search.toLowerCase()) ||
    (s.jurusan_nama ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  function handleAdd(idSoal: string) {
    setError(null);
    const formData = new FormData();
    formData.set("id_kompetensi_tugas", idKompetensiTugas);
    formData.set("id_soal", idSoal);
    startTransition(async () => {
      const result = await tambahSoalKeTes(formData);
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
    formData.set("id_kompetensi_tugas_soal", id);
    startTransition(async () => {
      await hapusSoalDariTes(formData);
      loadData();
      router.refresh();
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Kelola Soal - {judulTes}</DialogTitle>
          </DialogHeader>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

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
                      <li key={t.id_kompetensi_tugas_soal} className="flex items-start justify-between gap-2 px-3 py-2">
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
                          onClick={() => handleRemove(t.id_kompetensi_tugas_soal)}
                          aria-label="Hapus dari tes"
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
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Bank Soal Kompetensi</p>
                <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => setFormOpen(true)}>
                  <FilePlus2 className="size-3.5" />
                  Buat Soal Baru
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari pertanyaan atau jurusan..."
                  className="pl-8"
                />
              </div>
              <div className="h-[19rem] overflow-y-auto rounded-lg border">
                {loading ? (
                  <p className="p-4 text-center text-sm text-muted-foreground">Memuat...</p>
                ) : filteredSoal.length === 0 ? (
                  <p className="p-4 text-center text-sm text-muted-foreground">Belum ada soal di bank. Buat soal baru dulu.</p>
                ) : (
                  <ul className="divide-y">
                    {filteredSoal.map((s) => {
                      const isSelected = terpilihIdSet.has(s.id_soal_kompetensi);
                      return (
                        <li key={s.id_soal_kompetensi} className="flex items-start justify-between gap-2 px-3 py-2">
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm">{s.pertanyaan}</p>
                            <p className="text-xs text-muted-foreground">{s.jurusan_nama ?? "Semua jurusan"}</p>
                          </div>
                          {isSelected ? (
                            <Badge variant="secondary" className="shrink-0">Terpilih</Badge>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="shrink-0 text-primary hover:bg-primary/10"
                              disabled={isPending}
                              onClick={() => handleAdd(s.id_soal_kompetensi)}
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

      <SoalKompetensiFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={null}
        idJurusanDefault={idJurusanDefault}
        jurusanOptions={jurusanOptions}
        onSaved={loadData}
      />
    </>
  );
}
