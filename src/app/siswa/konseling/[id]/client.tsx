"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { InitialsAvatar } from "@/components/initials-avatar";
import { kirimPesanKonseling, akhiriSesiKonseling } from "../actions";

type Pesan = { id_pesan: string; pengirim: "siswa" | "ai"; isi: string };

export function ChatClient({
  idSesi,
  statusAwal,
  pesanAwal,
}: {
  idSesi: string;
  statusAwal: string;
  pesanAwal: Pesan[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pesan, setPesan] = useState<Pesan[]>(pesanAwal);
  const [status, setStatus] = useState(statusAwal);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function handleKirim() {
    const isi = input.trim();
    if (!isi || status !== "aktif") return;
    setError(null);
    setPesan((prev) => [...prev, { id_pesan: `temp-${Date.now()}`, pengirim: "siswa", isi }]);
    setInput("");
    scrollToBottom();

    startTransition(async () => {
      const formData = new FormData();
      formData.set("id_sesi", idSesi);
      formData.set("isi", isi);
      const result = await kirimPesanKonseling(formData);
      if (!result.success) {
        setError(result.message);
        if (result.sesiBerakhir) setStatus("selesai");
        return;
      }
      if (result.balasan) {
        setPesan((prev) => [...prev, { id_pesan: `temp-ai-${Date.now()}`, pengirim: "ai", isi: result.balasan! }]);
        scrollToBottom();
      }
    });
  }

  function handleAkhiri() {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id_sesi", idSesi);
      const result = await akhiriSesiKonseling(formData);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setStatus("selesai");
      router.refresh();
    });
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Konseling AI</h1>
          <p className="text-xs text-muted-foreground">Percakapan ini bersifat pribadi dan akan diringkas untuk guru BK.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status === "aktif" ? "default" : "secondary"}>{status === "aktif" ? "Berlangsung" : "Selesai"}</Badge>
          {status === "aktif" && (
            <Button variant="outline" size="sm" className="gap-1.5" disabled={isPending} onClick={handleAkhiri}>
              <CheckCircle2 className="size-3.5" /> Akhiri Sesi
            </Button>
          )}
        </div>
      </div>

      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <Card className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {pesan.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Mulai ceritakan apa yang kamu rasakan. AI ini siap mendengarkan.
            </p>
          )}
          {pesan.map((p) => (
            <div key={p.id_pesan} className={`flex items-end gap-2 ${p.pengirim === "siswa" ? "justify-end" : "justify-start"}`}>
              {p.pengirim === "ai" && (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  AI
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  p.pengirim === "siswa" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {p.isi}
              </div>
              {p.pengirim === "siswa" && <InitialsAvatar name="Saya" className="size-7 text-[10px]" />}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </Card>

      {status === "aktif" ? (
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleKirim();
              }
            }}
            placeholder="Tulis ceritamu di sini..."
            className="min-h-[3rem] flex-1 resize-none"
            disabled={isPending}
          />
          <Button onClick={handleKirim} disabled={isPending || !input.trim()} className="gap-1.5">
            <Send className="size-4" />
          </Button>
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">Sesi ini telah diakhiri.</p>
      )}
    </div>
  );
}
