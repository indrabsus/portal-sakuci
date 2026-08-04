"use client";

import { useEffect, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getDetailNilaiManual, simpanNilaiManual, type DetailNilaiManual } from "./actions";

export function IsiNilaiDialog({
  idTugas,
  onOpenChange,
  onSaved,
}: {
  idTugas: string | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [detail, setDetail] = useState<DetailNilaiManual | null>(null);
  const [notFoundForId, setNotFoundForId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [nilaiText, setNilaiText] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!idTugas) return;
    let cancelled = false;
    getDetailNilaiManual(idTugas).then((result) => {
      if (cancelled) return;
      if (!result) {
        setNotFoundForId(idTugas);
        return;
      }
      setDetail(result);
      setNilaiText(Object.fromEntries(result.siswa_list.map((s) => [s.id_siswa, s.nilai === null ? "" : String(s.nilai)])));
    });
    return () => {
      cancelled = true;
    };
  }, [idTugas]);

  const loading = !!idTugas && detail?.id_tugas !== idTugas && notFoundForId !== idTugas;
  const notFound = !!idTugas && notFoundForId === idTugas;
  const siswaList = detail?.id_tugas === idTugas ? detail.siswa_list : [];

  function handleSubmit() {
    if (!idTugas) return;
    setSaveError(null);
    const payload = siswaList.map((s) => {
      const raw = nilaiText[s.id_siswa] ?? "";
      const parsed = raw.trim() === "" ? null : Number(raw);
      return { id_siswa: s.id_siswa, nilai: parsed !== null && !Number.isNaN(parsed) ? parsed : null };
    });
    startTransition(async () => {
      const result = await simpanNilaiManual(idTugas, payload);
      if (!result.success) {
        setSaveError(result.message);
        return;
      }
      onOpenChange(false);
      onSaved();
    });
  }

  const showDetail = detail?.id_tugas === idTugas ? detail : null;

  return (
    <Dialog open={!!idTugas} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Isi Nilai Manual</DialogTitle>
          {showDetail && (
            <DialogDescription>
              {showDetail.judul} · {showDetail.mapel_label} - {showDetail.kelas_label}
            </DialogDescription>
          )}
        </DialogHeader>

        {(saveError || notFound) && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {saveError ?? "Penilaian tidak ditemukan."}
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Memuat data siswa...
          </div>
        ) : notFound ? null : siswaList.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Belum ada siswa aktif di kelas ini.</p>
        ) : (
          <div className="flex max-h-[55vh] flex-col divide-y overflow-y-auto rounded-md border">
            {siswaList.map((siswa, idx) => (
              <div key={siswa.id_siswa} className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">{idx + 1}. {siswa.nama_lengkap}</p>
                  {siswa.nisn && <p className="text-xs text-muted-foreground">NISN: {siswa.nisn}</p>}
                </div>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  inputMode="decimal"
                  placeholder="0-100"
                  value={nilaiText[siswa.id_siswa] ?? ""}
                  onChange={(e) => setNilaiText((prev) => ({ ...prev, [siswa.id_siswa]: e.target.value }))}
                  className="w-full sm:w-28"
                />
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending || loading || notFound || siswaList.length === 0}>
            {isPending ? "Menyimpan..." : "Simpan Nilai"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
