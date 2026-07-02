import { AlertTriangle, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteKonselingSesiAdmin } from "./actions";
import type { KonselingSesiDetail } from "./types";

const RISIKO_LABEL: Record<string, string> = { rendah: "Risiko Rendah", sedang: "Risiko Sedang", tinggi: "Risiko Tinggi" };
const RISIKO_VARIANT: Record<string, "secondary" | "default" | "destructive"> = {
  rendah: "secondary",
  sedang: "default",
  tinggi: "destructive",
};

export function KonselingDetailView({ sesi, canDelete = false }: { sesi: KonselingSesiDetail; canDelete?: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{sesi.judul ?? "Sesi Konseling"}</h1>
          <p className="text-sm text-muted-foreground">
            {sesi.nama_siswa} &middot;{" "}
            {sesi.kelas_label} &middot; {new Date(sesi.started_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        {canDelete && (
          <form
            action={deleteKonselingSesiAdmin}
            onSubmit={(event) => {
              if (!window.confirm("Hapus sesi konseling ini?")) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id_sesi" value={sesi.id_sesi} />
            <Button type="submit" variant="destructive" size="sm">
              <Trash2 className="mr-1 size-4" />
              Hapus
            </Button>
          </form>
        )}
      </div>

      <Card className={sesi.tingkat_risiko === "tinggi" ? "border-destructive/40" : ""}>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Ringkasan AI</CardTitle>
          <Badge variant={sesi.tingkat_risiko ? RISIKO_VARIANT[sesi.tingkat_risiko] : "secondary"}>
            {sesi.tingkat_risiko ? RISIKO_LABEL[sesi.tingkat_risiko] : "Belum Diringkas"}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {sesi.tingkat_risiko === "tinggi" && (
            <p className="flex items-center gap-1.5 text-sm font-medium text-destructive">
              <AlertTriangle className="size-4" /> Indikasi risiko tinggi — disarankan tindak lanjut langsung.
            </p>
          )}
          <p className="text-sm leading-relaxed">{sesi.ringkasan ?? "Sesi belum diringkas (masih berlangsung atau tidak ada percakapan)."}</p>
          {sesi.indikasi && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Indikasi:</p>
              <p className="text-sm leading-relaxed">{sesi.indikasi}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transkrip Percakapan</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {sesi.pesan.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada percakapan.</p>
          ) : (
            sesi.pesan.map((p) => (
              <div key={p.id_pesan} className={`flex ${p.pengirim === "siswa" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    p.pengirim === "siswa" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {p.isi}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
