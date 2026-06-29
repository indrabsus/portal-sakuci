import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NilaiClient } from "./client";

export default async function NilaiPage() {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const { data: mengajarList } = await supabase
    .from("mengajar")
    .select("id_mengajar, id_kelas, mapel(nama_mapel), kelas(nama_kelas)")
    .eq("id_guru", profile.id_guru ?? "");

  const result = [];

  for (const m of mengajarList ?? []) {
    const mapelNama = (m.mapel as unknown as { nama_mapel: string } | null)?.nama_mapel ?? "-";
    const kelasNama = (m.kelas as unknown as { nama_kelas: string } | null)?.nama_kelas ?? "-";

    const [{ data: tugasList }, { data: siswaKelasList }] = await Promise.all([
      supabase.from("tugas").select("id_tugas, judul, semester").eq("id_mengajar", m.id_mengajar),
      supabase
        .from("siswa_kelas")
        .select("id_siswa, siswa(nama_lengkap, nisn)")
        .eq("id_kelas", m.id_kelas)
        .eq("aktif", true),
    ]);

    const idTugasList = (tugasList ?? []).map((t) => t.id_tugas);
    const { data: pengumpulanList } = await supabase
      .from("pengumpulan_tugas")
      .select("id_siswa, id_tugas, nilai")
      .in("id_tugas", idTugasList.length ? idTugasList : [""]);

    const rows = (siswaKelasList ?? []).map((sk) => {
      const siswa = sk.siswa as unknown as { nama_lengkap: string; nisn: string | null } | null;
      const nilaiPerTugas: Record<string, number | null> = {};
      for (const tugas of tugasList ?? []) {
        const p = (pengumpulanList ?? []).find((pl) => pl.id_siswa === sk.id_siswa && pl.id_tugas === tugas.id_tugas);
        nilaiPerTugas[tugas.id_tugas] = p?.nilai ?? null;
      }
      return {
        id_siswa: sk.id_siswa,
        nama_siswa: siswa?.nama_lengkap ?? "-",
        nisn: siswa?.nisn ?? null,
        nilai_per_tugas: nilaiPerTugas,
      };
    });

    result.push({
      id_mengajar: m.id_mengajar,
      label: `${mapelNama} - ${kelasNama}`,
      judul_tugas: (tugasList ?? []).map((t) => ({ id_tugas: t.id_tugas, judul: t.judul, semester: t.semester })),
      rows,
    });
  }

  return <NilaiClient mengajarList={result} />;
}
