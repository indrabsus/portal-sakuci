import { requireKajurJurusan } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/fetch-all";
import { InovasiSiswaClient } from "./client";

export default async function InovasiSiswaPage() {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();

  const projectList = await fetchAllRows((from, to) =>
    supabase
      .from("project_siswa")
      .select(
        "id_project, nama_project, deskripsi, link_youtube, status, siswa(nama_lengkap, foto_url), kelas!inner(nama_kelas, id_jurusan, jurusan(nama_jurusan)), tahun_ajaran(nama_tahun_ajaran)",
      )
      .eq("kelas.id_jurusan", profile.id_jurusan)
      .order("created_at", { ascending: false })
      .range(from, to),
  );

  const rows = projectList.map((p) => {
    const kelas = p.kelas as unknown as { nama_kelas: string; jurusan: { nama_jurusan: string } | null } | null;
    const tahunAjaran = p.tahun_ajaran as unknown as { nama_tahun_ajaran: string } | null;
    return {
      id_project: p.id_project,
      nama_project: p.nama_project,
      deskripsi: p.deskripsi,
      link_youtube: p.link_youtube,
      status: p.status,
      nama_siswa: (p.siswa as unknown as { nama_lengkap: string } | null)?.nama_lengkap ?? "-",
      foto_siswa: (p.siswa as unknown as { foto_url: string | null } | null)?.foto_url ?? null,
      kelas_nama: kelas?.nama_kelas ?? null,
      jurusan_nama: kelas?.jurusan?.nama_jurusan ?? null,
      tahun_ajaran_nama: tahunAjaran?.nama_tahun_ajaran ?? null,
    };
  });

  return <InovasiSiswaClient rows={rows} />;
}
