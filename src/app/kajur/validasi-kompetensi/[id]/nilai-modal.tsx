"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { simpanNilaiEssayKompetensi, finalisasiNilaiKompetensi, koreksiEssayKompetensiAI } from "../actions";

export type JawabanDetail = {
  id_jawaban: string;
  pertanyaan: string;
  tipe_soal: string;
  jawaban_text: string | null;
  is_benar: boolean;
  nilai: number;
  opsi_dipilih: string | null;
};

export function NilaiModal({
  open,
  onOpenChange,
  idPengumpulan,
  namaSiswa,
  jawaban,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idPengumpulan: string;
  namaSiswa: string;
  jawaban: JawabanDetail[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [nilaiEssay, setNilaiEssay] = useState<Record<string, number>>(
    Object.fromEntries(jawaban.filter((j) => j.tipe_soal === "essay").map((j) => [j.id_jawaban, j.nilai])),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [alasanAI, setAlasanAI] = useState<Record<string, string>>({});
  const [koreksiPendingId, setKoreksiPendingId] = useState<string | null>(null);

  function handleKoreksiAI(idJawaban: string) {
    setMessage(null);
    setKoreksiPendingId(idJawaban);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id_jawaban", idJawaban);
      const result = await koreksiEssayKompetensiAI(formData);
      setKoreksiPendingId(null);
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      setNilaiEssay((prev) => ({ ...prev, [idJawaban]: result.nilai ?? 0 }));
      setAlasanAI((prev) => ({ ...prev, [idJawaban]: result.alasan ?? "-" }));
    });
  }

  function handleSimpan() {
    setMessage(null);
    startTransition(async () => {
      for (const j of jawaban.filter((x) => x.tipe_soal === "essay")) {
        const formData = new FormData();
        formData.set("id_jawaban", j.id_jawaban);
        formData.set("nilai", String(nilaiEssay[j.id_jawaban] ?? 0));
        await simpanNilaiEssayKompetensi(formData);
      }
      const formData = new FormData();
      formData.set("id_pengumpulan_kompetensi", idPengumpulan);
      const result = await finalisasiNilaiKompetensi(formData);
      setMessage(result.message);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nilai Jawaban - {namaSiswa}</DialogTitle>
        </DialogHeader>

        {message && <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{message}</p>}

        <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-1">
          {jawaban.map((j, idx) => (
            <div key={j.id_jawaban} className="rounded-lg border p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Soal {idx + 1}</p>
                <Badge variant={j.tipe_soal === "pg" ? "default" : "secondary"}>{j.tipe_soal === "pg" ? "PG" : "Essay"}</Badge>
              </div>
              <p className="text-sm">{j.pertanyaan}</p>

              {j.tipe_soal === "pg" ? (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Jawaban: {j.opsi_dipilih ?? "-"}</span>
                  {j.is_benar ? (
                    <Badge className="gap-1"><Check className="size-3" /> Benar</Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1"><X className="size-3" /> Salah</Badge>
                  )}
                </div>
              ) : (
                <div className="mt-2 flex flex-col gap-2">
                  <p className="rounded-md bg-muted/50 p-2 text-sm">{j.jawaban_text || "(tidak menjawab)"}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Nilai:</span>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      className="w-24"
                      value={nilaiEssay[j.id_jawaban] ?? 0}
                      onChange={(e) => setNilaiEssay((prev) => ({ ...prev, [j.id_jawaban]: Number(e.target.value) }))}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      disabled={isPending}
                      onClick={() => handleKoreksiAI(j.id_jawaban)}
                    >
                      <Sparkles className="size-3.5" />
                      {koreksiPendingId === j.id_jawaban ? "Mengoreksi..." : "Koreksi AI"}
                    </Button>
                  </div>
                  {alasanAI[j.id_jawaban] && (
                    <p className="rounded-md bg-primary/5 p-2 text-xs text-muted-foreground">
                      <span className="font-medium text-primary">Alasan AI: </span>
                      {alasanAI[j.id_jawaban]}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={handleSimpan} disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan & Finalisasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
