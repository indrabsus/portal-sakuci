import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ProyekClient } from "./client";

export default async function SiswaProyekPage() {
  const profile = await requireRole(["siswa"]);
  const supabase = await createClient();

  const { data } = await supabase
    .from("project_siswa")
    .select(
      "id_project, nama_project, deskripsi, link_youtube, status, catatan_kajur, kelas(nama_kelas, tingkat, jurusan(nama_jurusan)), tahun_ajaran(nama_tahun_ajaran)",
    )
    .eq("id_siswa", profile.id_siswa ?? "")
    .order("created_at", { ascending: false });

  const rows = (data ?? []).map((p) => {
    const kelas = p.kelas as unknown as { nama_kelas: string; tingkat: number | null; jurusan: { nama_jurusan: string } | null } | null;
    const tahunAjaran = p.tahun_ajaran as unknown as { nama_tahun_ajaran: string } | null;
    return {
      id_project: p.id_project,
      nama_project: p.nama_project,
      deskripsi: p.deskripsi,
      link_youtube: p.link_youtube,
      status: p.status,
      catatan_kajur: p.catatan_kajur,
      kelas_nama: kelas ? (kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas) : null,
      jurusan_nama: kelas?.jurusan?.nama_jurusan ?? null,
      tahun_ajaran_nama: tahunAjaran?.nama_tahun_ajaran ?? null,
    };
  });

  return <ProyekClient rows={rows} />;
}
