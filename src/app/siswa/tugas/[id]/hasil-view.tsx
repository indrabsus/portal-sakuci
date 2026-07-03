import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type HasilSoal = {
  id_soal: string;
  pertanyaan: string;
  tipe_soal: string;
  jawaban_text: string | null;
  opsi_label: string | null;
  is_benar: boolean;
  nilai: number;
};

const STATUS_LABEL: Record<string, string> = {
  belum: "Belum Mulai",
  dikerjakan: "Sedang Dikerjakan",
  selesai: "Selesai",
  menunggu_acc: "Menunggu Validasi",
  lulus: "Lulus",
  tidak_lulus: "Belum Lulus",
};

export function HasilView({
  nilaiAkhir,
  hasil,
  status,
}: {
  nilaiAkhir: number | null;
  hasil: HasilSoal[];
  status?: string;
}) {
  const statusDisplay = status ? STATUS_LABEL[status] ?? status : undefined;
  const adaEssayBelumDinilai = hasil.some((h) => h.tipe_soal === "essay" && h.nilai === 0);
  // Nilai hanya ditampilkan setelah semua essay sudah dinilai kajur
  const nilaiTersedia = !adaEssayBelumDinilai;

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nilai Akhir</p>
            <p className="text-3xl font-bold">
              {nilaiTersedia ? (nilaiAkhir ?? "-") : "-"}
            </p>
          </div>
          {statusDisplay && (
            <Badge variant={status === "lulus" ? "default" : status === "tidak_lulus" ? "destructive" : "secondary"}>
              {statusDisplay}
            </Badge>
          )}
        </div>
        {adaEssayBelumDinilai && (
          <p className="mt-3 text-xs text-amber-600">⏳ Ada essay yang masih menunggu validasi kajur — nilai akan muncul setelah semua essay dinilai</p>
        )}
      </Card>

      {hasil.map((h, idx) => (
        <Card key={h.id_soal} className="p-4 shadow-sm">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Soal {idx + 1}</p>
          <p className="mb-2 text-sm font-medium">{h.pertanyaan}</p>

          {h.tipe_soal === "pg" ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Jawaban Anda: {h.opsi_label ?? "-"}</span>
              </div>
              {/* Nilai per soal PG boleh ditampilkan karena otomatis, bukan essay */}
              {nilaiTersedia && h.nilai > 0 && <p className="text-xs text-muted-foreground">Nilai: {h.nilai}</p>}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="rounded-md bg-muted/50 p-2 text-sm">{h.jawaban_text || "(tidak menjawab)"}</p>
              {h.nilai > 0
                ? <p className="text-xs text-green-600">Nilai: {h.nilai}</p>
                : <p className="text-xs text-amber-600">Menunggu penilaian kajur</p>
              }
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
