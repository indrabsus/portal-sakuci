import { createClient } from "@/lib/supabase/server";

export async function getSiswaKelasInfo(idSiswa: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("siswa_kelas")
    .select("id_kelas, id_tahun_ajaran, kelas(nama_kelas, tingkat, id_jurusan)")
    .eq("id_siswa", idSiswa)
    .eq("aktif", true)
    .maybeSingle();

  const kelas = data?.kelas as unknown as { nama_kelas: string; tingkat: number | null; id_jurusan: string | null } | null;

  return {
    id_kelas: data?.id_kelas ?? null,
    id_tahun_ajaran: data?.id_tahun_ajaran ?? null,
    nama_kelas: kelas ? (kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas) : null,
    id_jurusan: kelas?.id_jurusan ?? null,
  };
}
