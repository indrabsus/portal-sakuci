"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { submitTesKompetensi } from "../../actions";

export type SoalForm = {
  id_soal: string;
  pertanyaan: string;
  tipe_soal: "pg" | "essay";
  gambar_url: string | null;
  opsi: { id_opsi: string; label: string; isi_opsi: string; gambar_url: string | null }[];
};

export function TesFormClient({ idKompetensiTugas, soalList }: { idKompetensiTugas: string; soalList: SoalForm[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [jawabanPg, setJawabanPg] = useState<Record<string, string>>({});

  function handleSubmit(formData: FormData) {
    setError(null);
    setMessage(null);
    formData.set("id_kompetensi_tugas", idKompetensiTugas);
    for (const [idSoal, idOpsi] of Object.entries(jawabanPg)) {
      formData.set(`opsi_${idSoal}`, idOpsi);
    }
    startTransition(async () => {
      const result = await submitTesKompetensi(formData);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setMessage(result.message);
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      {message && <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{message}</p>}

      {soalList.map((soal, idx) => (
        <Card key={soal.id_soal} className="p-4 shadow-sm">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Soal {idx + 1}</p>
          <p className="mb-3 text-sm font-medium">{soal.pertanyaan}</p>
          {soal.gambar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={soal.gambar_url} alt="Gambar soal" className="mb-3 max-h-48 rounded-lg border object-contain" />
          )}

          {soal.tipe_soal === "pg" ? (
            <div className="flex flex-col gap-2">
              {soal.opsi.map((o) => (
                <label key={o.id_opsi} className="flex items-center gap-2 rounded-lg border p-2.5 text-sm hover:bg-accent/40">
                  <input
                    type="radio"
                    name={`opsi_${soal.id_soal}`}
                    value={o.id_opsi}
                    checked={jawabanPg[soal.id_soal] === o.id_opsi}
                    onChange={() => setJawabanPg((prev) => ({ ...prev, [soal.id_soal]: o.id_opsi }))}
                    className="size-4"
                  />
                  <span className="font-semibold">{o.label}.</span>
                  <span>{o.isi_opsi}</span>
                </label>
              ))}
            </div>
          ) : (
            <Textarea name={`essay_${soal.id_soal}`} rows={4} placeholder="Tulis jawaban Anda..." />
          )}
        </Card>
      ))}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Mengumpulkan..." : "Kumpulkan Jawaban"}
      </Button>
    </form>
  );
}
