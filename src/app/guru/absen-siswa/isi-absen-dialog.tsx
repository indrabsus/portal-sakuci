"use client";

import { useEffect, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getDetailSesi, simpanAbsen, type DetailSesi, type SiswaAbsenRow } from "./actions";

const STATUS_OPTIONS: { value: SiswaAbsenRow["status"]; label: string }[] = [
  { value: "hadir", label: "Hadir" },
  { value: "izin", label: "Izin" },
  { value: "sakit", label: "Sakit" },
  { value: "dispen", label: "Dispen" },
  { value: "alpa", label: "Tanpa Keterangan" },
];

export function IsiAbsenDialog({
  idSesi,
  onOpenChange,
  onSaved,
}: {
  idSesi: string | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [detail, setDetail] = useState<DetailSesi | null>(null);
  const [notFoundForId, setNotFoundForId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, SiswaAbsenRow["status"]>>({});

  useEffect(() => {
    if (!idSesi) return;
    let cancelled = false;
    getDetailSesi(idSesi).then((result) => {
      if (cancelled) return;
      if (!result) {
        setNotFoundForId(idSesi);
        return;
      }
      setDetail(result);
      setStatuses(Object.fromEntries(result.siswa_list.map((s) => [s.id_siswa, s.status])));
    });
    return () => {
      cancelled = true;
    };
  }, [idSesi]);

  const loading = !!idSesi && detail?.id_sesi !== idSesi && notFoundForId !== idSesi;
  const notFound = !!idSesi && notFoundForId === idSesi;
  const siswaList = detail?.id_sesi === idSesi ? detail.siswa_list : [];

  function handleSubmit() {
    if (!idSesi) return;
    setSaveError(null);
    const payload = Object.entries(statuses).map(([id_siswa, status]) => ({ id_siswa, status }));
    startTransition(async () => {
      const result = await simpanAbsen(idSesi, payload);
      if (!result.success) {
        setSaveError(result.message);
        return;
      }
      onOpenChange(false);
      onSaved();
    });
  }

  const showDetail = detail?.id_sesi === idSesi ? detail : null;
  const tanggalLabel = showDetail
    ? new Date(showDetail.tanggal).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <Dialog open={!!idSesi} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Isi Absen Siswa</DialogTitle>
          {showDetail && <DialogDescription>{showDetail.mapel_label} - {showDetail.kelas_label} · {tanggalLabel}</DialogDescription>}
        </DialogHeader>

        {(saveError || notFound) && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {saveError ?? "Sesi tidak ditemukan."}
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
                <RadioGroup
                  value={statuses[siswa.id_siswa] ?? "hadir"}
                  onValueChange={(v) => v && setStatuses((prev) => ({ ...prev, [siswa.id_siswa]: v as SiswaAbsenRow["status"] }))}
                  className="flex flex-row flex-wrap gap-x-4 gap-y-1.5"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <Label key={opt.value} className="flex items-center gap-1.5 text-sm font-normal">
                      <RadioGroupItem value={opt.value} />
                      {opt.label}
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending || loading || notFound || siswaList.length === 0}>
            {isPending ? "Menyimpan..." : "Simpan Absen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
