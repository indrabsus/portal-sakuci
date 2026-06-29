import { requireKajurJurusan } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { RoadmapClient } from "./client";

export default async function RoadmapPage() {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();

  const { data: kompetensiList } = await supabase
    .from("kompetensi")
    .select("id_kompetensi, judul, deskripsi, tingkat, urutan, syarat_lulus, aktif")
    .eq("id_jurusan", profile.id_jurusan)
    .order("urutan");

  const rows = (kompetensiList ?? []).map((k) => ({
    id_kompetensi: k.id_kompetensi,
    judul: k.judul,
    deskripsi: k.deskripsi,
    tingkat: k.tingkat,
    urutan: k.urutan,
    syarat_lulus: k.syarat_lulus,
    aktif: k.aktif,
  }));

  return <RoadmapClient rows={rows} />;
}
