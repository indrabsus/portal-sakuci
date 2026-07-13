import { requireKajurJurusan } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/fetch-all";
import { SertifikatManualClient } from "./client";

export default async function SertifikatManualPage() {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();

  const [siswaJurusan, sertifikatManualList, { data: sekolah }] = await Promise.all([
    fetchAllRows((from, to) =>
      supabase
        .from("siswa_kelas")
        .select("id_siswa, siswa(nama_lengkap, nisn), kelas!inner(id_jurusan, nama_kelas, tingkat)")
        .eq("aktif", true)
        .eq("kelas.id_jurusan", profile.id_jurusan)
        .range(from, to),
    ),
    fetchAllRows((from, to) =>
      supabase
        .from("sertifikat")
        .select("id_sertifikat, nomor_sertifikat, judul_manual, nilai, tanggal_terbit, status, nama_kepsek, siswa(nama_lengkap)")
        .eq("id_jurusan", profile.id_jurusan)
        .is("id_kompetensi", null)
        .order("tanggal_terbit", { ascending: false })
        .range(from, to),
    ),
    supabase.from("informasi_sekolah").select("nama_kepala_sekolah").limit(1).maybeSingle(),
  ]);

  const siswaMap = new Map<string, { id_siswa: string; nama_lengkap: string; nisn: string | null; kelas: string }>();
  for (const sk of siswaJurusan) {
    const siswa = sk.siswa as unknown as { nama_lengkap: string; nisn: string | null } | null;
    const kelas = sk.kelas as unknown as { nama_kelas: string; tingkat: number | null } | null;
    const kelasLabel = kelas ? (kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas) : "-";
    siswaMap.set(sk.id_siswa, {
      id_siswa: sk.id_siswa,
      nama_lengkap: siswa?.nama_lengkap ?? "-",
      nisn: siswa?.nisn ?? null,
      kelas: kelasLabel,
    });
  }
  const siswaList = Array.from(siswaMap.values()).sort((a, b) => a.nama_lengkap.localeCompare(b.nama_lengkap));
  const kelasOptions = Array.from(new Set(siswaList.map((s) => s.kelas))).sort();

  const rows = sertifikatManualList.map((s) => ({
    id_sertifikat: s.id_sertifikat,
    nomor_sertifikat: s.nomor_sertifikat,
    nama_siswa: (s.siswa as unknown as { nama_lengkap: string } | null)?.nama_lengkap ?? "-",
    judul_manual: s.judul_manual ?? "-",
    nilai: s.nilai,
    tanggal_terbit: s.tanggal_terbit,
    status: s.status,
    adaTtdKepsek: !!s.nama_kepsek,
  }));

  return (
    <SertifikatManualClient
      siswaList={siswaList}
      kelasOptions={kelasOptions}
      rows={rows}
      namaKepalaSekolah={sekolah?.nama_kepala_sekolah ?? null}
    />
  );
}
