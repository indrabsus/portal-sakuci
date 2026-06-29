import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { MengajarClient } from "./client";

export default async function MengajarPage() {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const [{ data: mengajarList }, { data: mapelList }, { data: kelasList }, { data: tahunAjaranList }] =
    await Promise.all([
      supabase
        .from("mengajar")
        .select("id_mengajar, mapel(nama_mapel), kelas(nama_kelas, tingkat), tahun_ajaran(nama_tahun_ajaran)")
        .eq("id_guru", profile.id_guru ?? "")
        .order("created_at", { ascending: false }),
      supabase.from("mapel").select("id_mapel, nama_mapel").order("nama_mapel"),
      supabase.from("kelas").select("id_kelas, nama_kelas, tingkat").order("nama_kelas"),
      supabase.from("tahun_ajaran").select("id_tahun_ajaran, nama_tahun_ajaran").order("nama_tahun_ajaran", { ascending: false }),
    ]);

  const rows = (mengajarList ?? []).map((m) => {
    const kelas = m.kelas as unknown as { nama_kelas: string; tingkat: number | null } | null;
    return {
      id_mengajar: m.id_mengajar,
      mapel_nama: (m.mapel as unknown as { nama_mapel: string } | null)?.nama_mapel ?? "-",
      kelas_nama: kelas ? (kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas) : "-",
      tahun_ajaran_nama: (m.tahun_ajaran as unknown as { nama_tahun_ajaran: string } | null)?.nama_tahun_ajaran ?? "-",
    };
  });

  return (
    <MengajarClient
      rows={rows}
      mapelOptions={(mapelList ?? []).map((m) => ({ value: m.id_mapel, label: m.nama_mapel }))}
      kelasOptions={(kelasList ?? []).map((k) => ({ value: k.id_kelas, label: k.tingkat ? `${k.tingkat} ${k.nama_kelas}` : k.nama_kelas }))}
      tahunAjaranOptions={(tahunAjaranList ?? []).map((t) => ({ value: t.id_tahun_ajaran, label: t.nama_tahun_ajaran }))}
    />
  );
}
