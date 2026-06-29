import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSiswaKelasInfo } from "@/lib/siswa";
import { NilaiClient } from "./client";

export default async function SiswaNilaiPage() {
  const profile = await requireRole(["siswa"]);
  const supabase = await createClient();
  const kelasInfo = await getSiswaKelasInfo(profile.id_siswa ?? "");

  const { data: pengumpulanList } = await supabase
    .from("pengumpulan_tugas")
    .select("nilai, tugas(judul, semester, mengajar(mapel(nama_mapel)))")
    .eq("id_siswa", profile.id_siswa ?? "")
    .eq("status", "dinilai");

  const rows = (pengumpulanList ?? []).map((p) => {
    const tugas = p.tugas as unknown as { judul: string; semester: string; mengajar: { mapel: { nama_mapel: string } | null } | null } | null;
    return {
      mapel_nama: tugas?.mengajar?.mapel?.nama_mapel ?? "-",
      judul_tugas: tugas?.judul ?? "-",
      semester: tugas?.semester ?? "ganjil",
      nilai: p.nilai,
    };
  });

  return <NilaiClient namaSiswa={profile.nama_lengkap ?? "-"} kelasNama={kelasInfo.nama_kelas} rows={rows} />;
}
