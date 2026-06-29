import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LaporanClient } from "./client";

export default async function LaporanPage() {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const { data: mengajarList } = await supabase
    .from("mengajar")
    .select("id_mengajar, id_kelas, mapel(nama_mapel), kelas(nama_kelas)")
    .eq("id_guru", profile.id_guru ?? "");

  const rows: {
    id_siswa: string;
    nama_siswa: string;
    kelas_mapel: string;
    tugas_selesai: number;
    total_tugas: number;
    rata_rata: number | null;
  }[] = [];

  for (const m of mengajarList ?? []) {
    const mapelNama = (m.mapel as unknown as { nama_mapel: string } | null)?.nama_mapel ?? "-";
    const kelasNama = (m.kelas as unknown as { nama_kelas: string } | null)?.nama_kelas ?? "-";
    const label = `${mapelNama} - ${kelasNama}`;

    const [{ data: tugasList }, { data: siswaKelasList }] = await Promise.all([
      supabase.from("tugas").select("id_tugas").eq("id_mengajar", m.id_mengajar),
      supabase.from("siswa_kelas").select("id_siswa, siswa(nama_lengkap)").eq("id_kelas", m.id_kelas).eq("aktif", true),
    ]);

    const idTugasList = (tugasList ?? []).map((t) => t.id_tugas);
    const totalTugas = idTugasList.length;

    const { data: pengumpulanList } = await supabase
      .from("pengumpulan_tugas")
      .select("id_siswa, status, nilai")
      .in("id_tugas", idTugasList.length ? idTugasList : [""]);

    for (const sk of siswaKelasList ?? []) {
      const siswa = sk.siswa as unknown as { nama_lengkap: string } | null;
      const milikSiswa = (pengumpulanList ?? []).filter((p) => p.id_siswa === sk.id_siswa);
      const selesai = milikSiswa.filter((p) => p.status === "selesai" || p.status === "dinilai").length;
      const nilaiValid = milikSiswa.map((p) => p.nilai).filter((n): n is number => n !== null);
      const rataRata = nilaiValid.length > 0 ? Math.round((nilaiValid.reduce((a, b) => a + b, 0) / nilaiValid.length) * 100) / 100 : null;

      rows.push({
        id_siswa: sk.id_siswa,
        nama_siswa: siswa?.nama_lengkap ?? "-",
        kelas_mapel: label,
        tugas_selesai: selesai,
        total_tugas: totalTugas,
        rata_rata: rataRata,
      });
    }
  }

  return <LaporanClient rows={rows} />;
}
