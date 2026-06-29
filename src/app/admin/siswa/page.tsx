import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/fetch-all";
import { SiswaClient } from "./client";

export default async function SiswaPage() {
  const supabase = await createClient();

  const [siswaList, akunList, kelasList] = await Promise.all([
    fetchAllRows((from, to) =>
      supabase
        .from("siswa")
        .select("id_siswa, nama_lengkap, nisn, nis, jenkel, tempat_lahir, tanggal_lahir, agama, aktif")
        .order("nama_lengkap")
        .range(from, to),
    ),
    fetchAllRows((from, to) => supabase.from("akun_siswa").select("id_siswa").range(from, to)),
    fetchAllRows((from, to) =>
      supabase.from("siswa_kelas").select("id_siswa, kelas(nama_kelas), aktif").eq("aktif", true).range(from, to),
    ),
  ]);

  const aktifSet = new Set(akunList.map((a) => a.id_siswa));
  const kelasMap = new Map(
    kelasList.map((k) => [
      k.id_siswa,
      (k.kelas as unknown as { nama_kelas: string } | null)?.nama_kelas ?? null,
    ]),
  );

  const rows = siswaList.map((s) => ({
    ...s,
    akun_aktif: aktifSet.has(s.id_siswa),
    kelas_terkini: kelasMap.get(s.id_siswa) ?? null,
  }));

  return <SiswaClient rows={rows} />;
}
