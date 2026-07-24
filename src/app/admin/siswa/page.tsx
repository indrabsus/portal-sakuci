import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/fetch-all";
import { SiswaClient } from "./client";
import { getUsernameSaranSiswa } from "./actions";

export default async function SiswaPage() {
  const supabase = await createClient();

  const [siswaList, akunList, kelasList] = await Promise.all([
    fetchAllRows((from, to) =>
      supabase
        .from("siswa")
        .select("id_siswa, nama_lengkap, nisn, jenkel, tempat_lahir, tanggal_lahir, agama, no_hp, aktif")
        .order("nama_lengkap")
        .range(from, to),
    ),
    fetchAllRows((from, to) => supabase.from("akun_siswa").select("id_siswa, id_profile").range(from, to)),
    fetchAllRows((from, to) =>
      supabase.from("siswa_kelas").select("id_siswa, kelas(nama_kelas, tingkat), aktif").eq("aktif", true).range(from, to),
    ),
  ]);

  const idProfileList = akunList.map((a) => a.id_profile);
  const { data: profilList } = idProfileList.length
    ? await supabase.from("profiles").select("id_profile, email").in("id_profile", idProfileList)
    : { data: [] };

  const emailByProfile = new Map((profilList ?? []).map((p) => [p.id_profile, p.email]));
  const akunMap = new Map(akunList.map((a) => [a.id_siswa, a.id_profile]));
  const kelasMap = new Map(
    kelasList.map((k) => {
      const kelas = k.kelas as unknown as { nama_kelas: string; tingkat: number | null } | null;
      const label = kelas ? (kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas) : null;
      return [k.id_siswa, label];
    }),
  );

  const rows = siswaList.map((s) => {
    const idProfile = akunMap.get(s.id_siswa) ?? null;
    const email = idProfile ? emailByProfile.get(idProfile) ?? null : null;
    return {
      ...s,
      akun_aktif: akunMap.has(s.id_siswa),
      id_profile: idProfile,
      username: email ? email.replace(/@.*$/, "") : null,
      kelas_terkini: kelasMap.get(s.id_siswa) ?? null,
    };
  });

  const kelasOptions = Array.from(new Set(Array.from(kelasMap.values()).filter((k): k is string => !!k))).sort();

  const belumAktivasi = rows.filter((s) => !s.akun_aktif);
  const saran = belumAktivasi.length
    ? await getUsernameSaranSiswa(belumAktivasi.map((s) => ({ id_siswa: s.id_siswa, nama_lengkap: s.nama_lengkap })))
    : [];

  return <SiswaClient rows={rows} kelasOptions={kelasOptions} saran={saran} />;
}
