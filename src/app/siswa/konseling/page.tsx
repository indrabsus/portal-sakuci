import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { sapuSesiKedaluwarsa } from "@/features/konseling/auto-close";
import { KonselingClient } from "./client";

export default async function SiswaKonselingPage() {
  const profile = await requireRole(["siswa"]);
  const supabase = await createClient();

  await sapuSesiKedaluwarsa(supabase, profile.id_siswa ?? undefined);

  const { data: sesiList } = await supabase
    .from("konseling_sesi")
    .select("id_sesi, judul, status, started_at, ended_at")
    .eq("id_siswa", profile.id_siswa ?? "")
    .order("started_at", { ascending: false });

  const rows = (sesiList ?? []).map((s) => ({
    id_sesi: s.id_sesi,
    judul: s.judul,
    status: s.status,
    started_at: s.started_at,
    ended_at: s.ended_at,
  }));

  return <KonselingClient rows={rows} />;
}
