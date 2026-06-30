"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mulaiSesiKonseling } from "./actions";

type SesiRow = { id_sesi: string; judul: string | null; status: string; started_at: string; ended_at: string | null };

export function KonselingClient({ rows }: { rows: SesiRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleMulai() {
    startTransition(async () => {
      const result = await mulaiSesiKonseling();
      if (result.success && result.idSesi) {
        router.push(`/siswa/konseling/${result.idSesi}`);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Konseling AI</h1>
          <p className="text-sm text-muted-foreground">
            Tempat aman untuk curhat. Percakapanmu akan diringkas untuk membantu guru BK memahami kondisimu.
          </p>
        </div>
        <Button onClick={handleMulai} disabled={isPending} className="gap-1.5">
          <Plus className="size-4" /> Mulai Sesi Baru
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada riwayat sesi konseling.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((s) => (
            <Card
              key={s.id_sesi}
              className="cursor-pointer shadow-sm transition-shadow hover:shadow-md"
              onClick={() => router.push(`/siswa/konseling/${s.id_sesi}`)}
            >
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MessageCircle className="size-4.5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    {s.judul ?? `Sesi ${new Date(s.started_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(s.started_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} &middot;{" "}
                    {new Date(s.started_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <Badge variant={s.status === "aktif" ? "default" : "secondary"}>
                  {s.status === "aktif" ? "Berlangsung" : "Selesai"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
