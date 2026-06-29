import { requireKajurJurusan } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/fetch-all";
import { RekapKompetensiClient } from "./client";

export default async function RekapKompetensiPage() {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();

  const siswaList = await fetchAllRows((from, to) =>
    supabase
      .from("siswa")
      .select("id_siswa, nama_lengkap, siswa_kelas(aktif, kelas(nama_kelas, id_jurusan))")
      .eq("aktif", true)
      .order("nama_lengkap")
      .range(from, to),
  );

  const siswaJurusan = siswaList.filter((s) => {
    const siswaKelas = (s.siswa_kelas as unknown as { aktif: boolean; kelas: { id_jurusan: string | null } | null }[]) ?? [];
    const aktifSk = siswaKelas.find((sk) => sk.aktif) ?? siswaKelas[0];
    return aktifSk?.kelas?.id_jurusan === profile.id_jurusan;
  });

  const idSiswaList = siswaJurusan.map((s) => s.id_siswa);
  const safeIds = idSiswaList.length ? idSiswaList : [""];

  const sertifikatList = await fetchAllRows((from, to) =>
    supabase.from("sertifikat").select("id_siswa").eq("status", "aktif").in("id_siswa", safeIds).range(from, to),
  );

  const progresList = await fetchAllRows((from, to) =>
    supabase.from("progres_kompetensi").select("id_siswa, status").in("id_siswa", safeIds).range(from, to),
  );

  const sertifikatCountMap = new Map<string, number>();
  for (const s of sertifikatList) {
    sertifikatCountMap.set(s.id_siswa, (sertifikatCountMap.get(s.id_siswa) ?? 0) + 1);
  }

  const lulusCountMap = new Map<string, number>();
  const prosesCountMap = new Map<string, number>();
  for (const p of progresList) {
    if (p.status === "lulus") lulusCountMap.set(p.id_siswa, (lulusCountMap.get(p.id_siswa) ?? 0) + 1);
    if (p.status === "proses") prosesCountMap.set(p.id_siswa, (prosesCountMap.get(p.id_siswa) ?? 0) + 1);
  }

  const rows = siswaJurusan.map((s) => {
    const siswaKelas = (s.siswa_kelas as unknown as { aktif: boolean; kelas: { nama_kelas: string } | null }[]) ?? [];
    const aktifSk = siswaKelas.find((sk) => sk.aktif) ?? siswaKelas[0];
    const kelasNama = aktifSk?.kelas?.nama_kelas ?? null;

    return {
      id_siswa: s.id_siswa,
      nama_siswa: s.nama_lengkap,
      kelas_nama: kelasNama,
      jumlah_sertifikat: sertifikatCountMap.get(s.id_siswa) ?? 0,
      jumlah_kompetensi_lulus: lulusCountMap.get(s.id_siswa) ?? 0,
      jumlah_kompetensi_proses: prosesCountMap.get(s.id_siswa) ?? 0,
    };
  });

  return <RekapKompetensiClient rows={rows} />;
}
