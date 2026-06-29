import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/fetch-all";
import { BkkSiswaClient } from "./client";

export default async function BkkSiswaPage() {
  const supabase = await createClient();

  const [siswaList, akunSiswaList, siswaKelasList, sertifikatList] = await Promise.all([
    fetchAllRows((from, to) =>
      supabase.from("siswa").select("id_siswa, nama_lengkap, nisn, foto_url").order("nama_lengkap").range(from, to),
    ),
    fetchAllRows((from, to) => supabase.from("akun_siswa").select("id_siswa").range(from, to)),
    // "Siswa aktif" = siswa yang sudah masuk ke suatu kelas pada tahun ajaran berjalan,
    // bukan dari kolom siswa.aktif yang tidak selalu konsisten diisi.
    fetchAllRows((from, to) =>
      supabase
        .from("siswa_kelas")
        .select("id_siswa, kelas(nama_kelas, jurusan(nama_jurusan))")
        .eq("aktif", true)
        .range(from, to),
    ),
    fetchAllRows((from, to) => supabase.from("sertifikat").select("id_siswa").eq("status", "aktif").range(from, to)),
  ]);

  const aktivasiSet = new Set(akunSiswaList.map((a) => a.id_siswa));

  const kelasMap = new Map(
    siswaKelasList.map((sk) => {
      const kelas = sk.kelas as unknown as { nama_kelas: string; jurusan: { nama_jurusan: string } | null } | null;
      return [sk.id_siswa, { kelas_nama: kelas?.nama_kelas ?? null, jurusan_nama: kelas?.jurusan?.nama_jurusan ?? null }];
    }),
  );

  const sertifikatCountMap = new Map<string, number>();
  for (const s of sertifikatList) {
    sertifikatCountMap.set(s.id_siswa, (sertifikatCountMap.get(s.id_siswa) ?? 0) + 1);
  }

  const rows = siswaList
    .filter((s) => aktivasiSet.has(s.id_siswa) && kelasMap.has(s.id_siswa))
    .map((s) => ({
      id_siswa: s.id_siswa,
      nama_lengkap: s.nama_lengkap,
      nisn: s.nisn,
      foto_url: s.foto_url,
      kelas_nama: kelasMap.get(s.id_siswa)?.kelas_nama ?? null,
      jurusan_nama: kelasMap.get(s.id_siswa)?.jurusan_nama ?? null,
      jumlah_sertifikat: sertifikatCountMap.get(s.id_siswa) ?? 0,
    }));

  return <BkkSiswaClient rows={rows} />;
}
