import { Card } from "@/components/ui/card";

export type HasilSoal = {
  id_soal: string;
  pertanyaan: string;
  tipe_soal: string;
  jawaban_text: string | null;
  opsi_label: string | null;
  is_benar: boolean;
  nilai: number;
};

export function HasilView({ nilaiAkhir, hasil }: { nilaiAkhir: number | null; hasil: HasilSoal[] }) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">Nilai Akhir</p>
        <p className="text-3xl font-bold">{nilaiAkhir ?? "Menunggu dinilai"}</p>
      </Card>

      {hasil.map((h, idx) => (
        <Card key={h.id_soal} className="p-4 shadow-sm">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Soal {idx + 1}</p>
          <p className="mb-2 text-sm font-medium">{h.pertanyaan}</p>

          {h.tipe_soal === "pg" ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Jawaban Anda: {h.opsi_label ?? "-"}</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="rounded-md bg-muted/50 p-2 text-sm">{h.jawaban_text || "(tidak menjawab)"}</p>
              <p className="text-xs text-muted-foreground">Nilai: {h.nilai}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
