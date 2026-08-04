import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NilaiManualClient, type BatchRow } from "./client";

export default async function NilaiManualPage() {
  const profile = await requireRole(["guru"]);
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
      id_kelas: m.id_kelas,
      label: `${(m.mapel as unknown as { nama_mapel: string } | null)?.nama_mapel ?? "-"} - ${kelasLabel}`,
      kelas_label: kelasLabel,
      mapel_label: (m.mapel as unknown as { nama_mapel: string } | null)?.nama_mapel ?? "-",
    };
  });

  const idMengajarList = mengajarOptions.map((m) => m.value);
  const mengajarMap = new Map(mengajarOptions.map((m) => [m.value, m]));

  const { data: tugasList } = await supabase
    .from("tugas")
    .select("id_tugas, id_mengajar, judul, semester, created_at")
    .in("id_mengajar", idMengajarList.length ? idMengajarList : [""])
    .eq("tipe", "manual")
    .order("created_at", { ascending: false });

  const idTugasList = (tugasList ?? []).map((t) => t.id_tugas);
  const [{ data: pengumpulanList }, { data: siswaKelasList }] = await Promise.all([
    supabase.from("pengumpulan_tugas").select("id_tugas, nilai").in("id_tugas", idTugasList.length ? idTugasList : [""]),
    supabase
      .from("siswa_kelas")
      .select("id_kelas, id_siswa")
      .in("id_kelas", [...new Set(mengajarOptions.map((m) => m.id_kelas))])
      .eq("aktif", true),
  ]);

  const jumlahSiswaMap = new Map<string, number>();
  for (const sk of siswaKelasList ?? []) {
    jumlahSiswaMap.set(sk.id_kelas, (jumlahSiswaMap.get(sk.id_kelas) ?? 0) + 1);
  }

  const rows: BatchRow[] = (tugasList ?? []).map((t) => {
    const info = mengajarMap.get(t.id_mengajar);
    const nilaiTugas = (pengumpulanList ?? []).filter((p) => p.id_tugas === t.id_tugas).map((p) => p.nilai as number | null).filter((n): n is number => n !== null);
    const rataRata = nilaiTugas.length > 0 ? Math.round((nilaiTugas.reduce((a, b) => a + b, 0) / nilaiTugas.length) * 100) / 100 : null;
    return {
      id_tugas: t.id_tugas,
      judul: t.judul,
      semester: t.semester,
      tanggal: t.created_at,
      kelas_label: info?.kelas_label ?? "-",
      mapel_label: info?.mapel_label ?? "-",
      jumlah_dinilai: nilaiTugas.length,
      jumlah_siswa: (info ? jumlahSiswaMap.get(info.id_kelas) : 0) ?? 0,
      rata_rata: rataRata,
    };
  });

  return (
    <NilaiManualClient
      rows={rows}
      mengajarOptions={mengajarOptions.map((m) => ({ value: m.value, label: m.label }))}
    />
  );
}
