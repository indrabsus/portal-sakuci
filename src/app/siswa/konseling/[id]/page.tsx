import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { tutupSesiKedaluwarsaJikaPerlu } from "@/features/konseling/auto-close";
import { ChatClient } from "./client";

export default async function SesiKonselingPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireRole(["siswa"]);
  const { id } = await params;
  const supabase = await createClient();

  const { data: sesiAwal } = await supabase
    .from("konseling_sesi")
    .select("id_siswa")
    .eq("id_sesi", id)
    .single();

  if (!sesiAwal || sesiAwal.id_siswa !== profile.id_siswa) notFound();

  await tutupSesiKedaluwarsaJikaPerlu(supabase, id);

  const { data: sesi } = await supabase
    .from("konseling_sesi")
    .select("id_sesi, id_siswa, status")
    .eq("id_sesi", id)
    .single();

  if (!sesi) notFound();

  const { data: pesanList } = await supabase
    .from("konseling_pesan")
    .select("id_pesan, pengirim, isi, created_at")
    .eq("id_sesi", id)
    .order("created_at", { ascending: true });

  return (
    <ChatClient
      idSesi={sesi.id_sesi}
      statusAwal={sesi.status}
      pesanAwal={(pesanList ?? []).map((p) => ({
        id_pesan: p.id_pesan,
        pengirim: p.pengirim as "siswa" | "ai",
        isi: p.isi,
      }))}
    />
  );
}
