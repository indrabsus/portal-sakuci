import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { RekapAbsenSiswaClient, type RekapRow } from "./client";

export default async function RekapAbsenSiswaPage({
  searchParams,
}: {
  searchParams: Promise<{ id_mengajar?: string; bulan?: string; tahun?: string }>;
}) {
  const profile = await requireRole(["guru"]);
  const { id_mengajar, bulan, tahun } = await searchParams;

  const now = new Date();
  const bulanAktif = Number(bulan) || now.getMonth() + 1;
  const tahunAktif = Number(tahun) || now.getFullYear();

  const supabase = await createClient();
  const { data: mengajarList } = await supabase
    .from("mengajar")
    .select("id_mengajar, id_kelas, mapel(nama_mapel), kelas(nama_kelas, tingkat)")
    .eq("id_guru", profile.id_guru ?? "")
    .order("created_at", { ascending: false });

  const mengajarOptions = (mengajarList ?? []).map((m) => {
    const kelas = m.kelas as unknown as { nama_kelas: string; tingkat: number | null } | null;
    const kelasLabel = kelas ? (kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas) : "-";
    return {
      value: m.id_mengajar,
      label: `${(m.mapel as unknown as { nama_mapel: string } | null)?.nama_mapel ?? "-"} - ${kelasLabel}`,
    };
  });

  const selectedIdMengajar =
    id_mengajar && mengajarOptions.some((m) => m.value === id_mengajar) ? id_mengajar : mengajarOptions[0]?.value ?? "";
  const selectedMengajar = (mengajarList ?? []).find((m) => m.id_mengajar === selectedIdMengajar) ?? null;

  let rows: RekapRow[] = [];
  let totalSesi = 0;

  if (selectedMengajar) {
    const bulanStr = String(bulanAktif).padStart(2, "0");
    const startDate = `${tahunAktif}-${bulanStr}-01`;
    const lastDay = new Date(tahunAktif, bulanAktif, 0).getDate();
    const endDate = `${tahunAktif}-${bulanStr}-${String(lastDay).padStart(2, "0")}`;

    const [{ data: sesiList }, { data: siswaKelasList }] = await Promise.all([
      supabase.from("absensi_sesi").select("id_sesi").eq("id_mengajar", selectedIdMengajar).gte("tanggal", startDate).lte("tanggal", endDate),
      supabase
        .from("siswa_kelas")
        .select("id_siswa, siswa(nama_lengkap, nisn)")
        .eq("id_kelas", selectedMengajar.id_kelas)
        .eq("aktif", true),
    ]);

    totalSesi = sesiList?.length ?? 0;
    const idSesiList = (sesiList ?? []).map((s) => s.id_sesi);

    const { data: absensiList } = await supabase
      .from("absensi_siswa")
      .select("id_siswa, status")
      .in("id_sesi", idSesiList.length ? idSesiList : [""]);

    rows = (siswaKelasList ?? [])
      .map((sk) => {
        const siswa = sk.siswa as unknown as { nama_lengkap: string; nisn: string | null } | null;
        const milik = (absensiList ?? []).filter((a) => a.id_siswa === sk.id_siswa);
        const izin = milik.filter((a) => a.status === "izin").length;
        const sakit = milik.filter((a) => a.status === "sakit").length;
        const dispen = milik.filter((a) => a.status === "dispen").length;
        const alpa = milik.filter((a) => a.status === "alpa").length;
        const hadir = Math.max(0, totalSesi - izin - sakit - dispen - alpa);
        return {
          id_siswa: sk.id_siswa,
          nama_lengkap: siswa?.nama_lengkap ?? "-",
          nisn: siswa?.nisn ?? null,
          hadir,
          izin,
          sakit,
          dispen,
          alpa,
        };
      })
      .sort((a, b) => a.nama_lengkap.localeCompare(b.nama_lengkap));
  }

  return (
    <RekapAbsenSiswaClient
      mengajarOptions={mengajarOptions}
      selectedIdMengajar={selectedIdMengajar}
      bulan={bulanAktif}
      tahun={tahunAktif}
      totalSesi={totalSesi}
      rows={rows}
    />
  );
}
