"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, MessageCircle, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteKonselingSesiAdmin } from "./actions";
import type { KonselingSesiRow } from "./types";

const RISIKO_LABEL: Record<string, string> = { rendah: "Risiko Rendah", sedang: "Risiko Sedang", tinggi: "Risiko Tinggi" };
const RISIKO_VARIANT: Record<string, "secondary" | "default" | "destructive"> = {
  rendah: "secondary",
  sedang: "default",
  tinggi: "destructive",
};

export function KonselingListClient({ rows, basePath, canDelete = false }: { rows: KonselingSesiRow[]; basePath: string; canDelete?: boolean }) {
  const router = useRouter();

  const sorted = [...rows].sort((a, b) => {
    const order = { tinggi: 0, sedang: 1, rendah: 2 } as Record<string, number>;
    const ra = a.tingkat_risiko ? order[a.tingkat_risiko] : 3;
    const rb = b.tingkat_risiko ? order[b.tingkat_risiko] : 3;
    if (ra !== rb) return ra - rb;
    return new Date(b.started_at).getTime() - new Date(a.started_at).getTime();
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Konseling Siswa</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan & indikasi hasil sesi konseling AI siswa. Diurutkan berdasarkan tingkat risiko.
        </p>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada sesi konseling.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((s) => (
            <Card
              key={s.id_sesi}
              className={`cursor-pointer shadow-sm transition-shadow hover:shadow-md ${
                s.tingkat_risiko === "tinggi" ? "border-destructive/40 bg-destructive/3" : ""
              }`}
              onClick={() => router.push(`${basePath}/${s.id_sesi}`)}
            >
              <CardContent className="flex items-center gap-3 pt-6">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                    s.tingkat_risiko === "tinggi" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                  }`}
                >
                  {s.tingkat_risiko === "tinggi" ? <AlertTriangle className="size-4.5" /> : <MessageCircle className="size-4.5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{s.judul ?? "Sesi Konseling"}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.nama_siswa} &middot; {s.kelas_label} &middot;{" "}
                    {new Date(s.started_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge variant={s.tingkat_risiko ? RISIKO_VARIANT[s.tingkat_risiko] : "secondary"}>
                    {s.tingkat_risiko ? RISIKO_LABEL[s.tingkat_risiko] : "Belum Diringkas"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{s.status === "aktif" ? "Berlangsung" : "Selesai"}</span>
                  {canDelete && (
                    <form
                      action={deleteKonselingSesiAdmin}
                      onClick={(event) => event.stopPropagation()}
                      onSubmit={(event) => {
                        if (!window.confirm("Hapus sesi konseling ini?")) {
                          event.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id_sesi" value={s.id_sesi} />
                      <Button type="submit" size="sm" variant="destructive" className="h-8 px-2.5">
                        <Trash2 className="mr-1 size-3.5" />
                        Hapus
                      </Button>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
