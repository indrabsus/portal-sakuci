import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AbsenSiswaClient, type SesiRow } from "./client";

export default async function AbsenSiswaPage() {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const { data: mengajarList } = await supabase
    .from("mengajar")
    .select("id_mengajar, mapel(nama_mapel), kelas(nama_kelas, tingkat)")
    .eq("id_guru", profile.id_guru ?? "")
    .order("created_at", { ascending: false });

  const mengajarOptions = (mengajarList ?? []).map((m) => {
    const kelas = m.kelas as unknown as { nama_kelas: string; tingkat: number | null } | null;
    const kelasLabel = kelas ? (kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas) : "-";
    return {
      value: m.id_mengajar,
      label: `${(m.mapel as unknown as { nama_mapel: string } | null)?.nama_mapel ?? "-"} - ${kelasLabel}`,
      kelas_label: kelasLabel,
      mapel_label: (m.mapel as unknown as { nama_mapel: string } | null)?.nama_mapel ?? "-",
    };
  });

  const idMengajarList = mengajarOptions.map((m) => m.value);
  const mengajarLabelMap = new Map(mengajarOptions.map((m) => [m.value, m]));

  const { data: sesiList } = await supabase
    .from("absensi_sesi")
    .select("id_sesi, id_mengajar, tanggal")
    .in("id_mengajar", idMengajarList.length ? idMengajarList : [""])
    .order("tanggal", { ascending: false });

  const idSesiList = (sesiList ?? []).map((s) => s.id_sesi);
  const { data: absensiList } = await supabase
    .from("absensi_siswa")
    .select("id_sesi, status")
    .in("id_sesi", idSesiList.length ? idSesiList : [""]);

  const rows: SesiRow[] = (sesiList ?? []).map((s) => {
    const info = mengajarLabelMap.get(s.id_mengajar);
    const counts = { izin: 0, sakit: 0, dispen: 0, alpa: 0 };
    for (const a of absensiList ?? []) {
      if (a.id_sesi !== s.id_sesi) continue;
      const key = a.status as keyof typeof counts;
      if (key in counts) counts[key]++;
    }
    return {
      id_sesi: s.id_sesi,
      tanggal: s.tanggal,
      kelas_label: info?.kelas_label ?? "-",
      mapel_label: info?.mapel_label ?? "-",
      counts,
    };
  });

  return <AbsenSiswaClient rows={rows} mengajarOptions={mengajarOptions.map((m) => ({ value: m.value, label: m.label }))} />;
}
