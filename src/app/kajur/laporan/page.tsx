import { requireKajurJurusan } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/fetch-all";
import { LaporanClient } from "./client";

export default async function LaporanPage() {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();

  const [
    guruList,
    akunGuruList,
    mengajarList,
    materiList,
    tugasList,
    siswaKelasJurusan,
    akunSiswaList,
    pengumpulanList,
    loginLog,
  ] = await Promise.all([
    fetchAllRows((from, to) => supabase.from("guru").select("id_guru, nama_lengkap").range(from, to)),
    fetchAllRows((from, to) => supabase.from("akun_guru").select("id_guru, id_profile").range(from, to)),
    fetchAllRows((from, to) => supabase.from("mengajar").select("id_mengajar, id_guru").range(from, to)),
    fetchAllRows((from, to) => supabase.from("materi").select("id_mengajar").range(from, to)),
    fetchAllRows((from, to) => supabase.from("tugas").select("id_mengajar").range(from, to)),
    // Hanya siswa di jurusan yang dikelola Kajur ini.
    fetchAllRows((from, to) =>
      supabase
        .from("siswa_kelas")
        .select("id_siswa, siswa(nama_lengkap), kelas!inner(id_jurusan)")
        .eq("aktif", true)
        .eq("kelas.id_jurusan", profile.id_jurusan)
        .range(from, to),
    ),
    fetchAllRows((from, to) => supabase.from("akun_siswa").select("id_siswa, id_profile").range(from, to)),
    fetchAllRows((from, to) => supabase.from("pengumpulan_tugas").select("id_siswa, status").range(from, to)),
    fetchAllRows((from, to) =>
      supabase
        .from("log_aktivitas")
        .select("id_user, created_at")
        .eq("aktivitas", "login")
        .order("created_at", { ascending: false })
        .range(from, to),
    ),
  ]);

  const siswaList = siswaKelasJurusan.map((sk) => ({
    id_siswa: sk.id_siswa,
    nama_lengkap: (sk.siswa as unknown as { nama_lengkap: string } | null)?.nama_lengkap ?? "-",
  }));

  const lastLoginMap = new Map<string, string>();
  for (const log of loginLog) {
    if (!lastLoginMap.has(log.id_user)) lastLoginMap.set(log.id_user, log.created_at);
  }

  const profileByGuru = new Map(akunGuruList.map((a) => [a.id_guru, a.id_profile]));
  const mengajarToGuru = new Map(mengajarList.map((m) => [m.id_mengajar, m.id_guru]));

  const materiCountByGuru = new Map<string, number>();
  for (const m of materiList) {
    const idGuru = m.id_mengajar ? mengajarToGuru.get(m.id_mengajar) : null;
    if (idGuru) materiCountByGuru.set(idGuru, (materiCountByGuru.get(idGuru) ?? 0) + 1);
  }

  const tugasCountByGuru = new Map<string, number>();
  for (const t of tugasList) {
    const idGuru = t.id_mengajar ? mengajarToGuru.get(t.id_mengajar) : null;
    if (idGuru) tugasCountByGuru.set(idGuru, (tugasCountByGuru.get(idGuru) ?? 0) + 1);
  }

  const guruActivity = guruList.map((g) => {
    const idProfile = profileByGuru.get(g.id_guru);
    return {
      id_guru: g.id_guru,
      nama_lengkap: g.nama_lengkap,
      jumlah_materi: materiCountByGuru.get(g.id_guru) ?? 0,
      jumlah_tugas: tugasCountByGuru.get(g.id_guru) ?? 0,
      login_terakhir: idProfile ? lastLoginMap.get(idProfile) ?? null : null,
    };
  });

  const profileBySiswa = new Map(akunSiswaList.map((a) => [a.id_siswa, a.id_profile]));

  const tugasCountBySiswa = new Map<string, number>();
  for (const p of pengumpulanList) {
    if (p.status && p.status !== "belum") {
      tugasCountBySiswa.set(p.id_siswa, (tugasCountBySiswa.get(p.id_siswa) ?? 0) + 1);
    }
  }

  const siswaActivity = siswaList.map((s) => {
    const idProfile = profileBySiswa.get(s.id_siswa);
    return {
      id_siswa: s.id_siswa,
      nama_lengkap: s.nama_lengkap,
      tugas_dikerjakan: tugasCountBySiswa.get(s.id_siswa) ?? 0,
      login_terakhir: idProfile ? lastLoginMap.get(idProfile) ?? null : null,
    };
  });

  return <LaporanClient guruActivity={guruActivity} siswaActivity={siswaActivity} />;
}
