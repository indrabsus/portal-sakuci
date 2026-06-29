import { createClient } from "@/lib/supabase/server";
import { KelasClient } from "./client";

export default async function KelasPage() {
  const supabase = await createClient();

  const [{ data: kelasList }, { data: jurusanList }, { data: tahunAjaranList }, { data: siswaKelasList }] =
    await Promise.all([
      supabase
        .from("kelas")
        .select("id_kelas, nama_kelas, tingkat, id_jurusan, id_tahun_ajaran, aktif, jurusan(nama_jurusan), tahun_ajaran(nama_tahun_ajaran)")
        .order("nama_kelas"),
      supabase.from("jurusan").select("id_jurusan, nama_jurusan").order("nama_jurusan"),
      supabase.from("tahun_ajaran").select("id_tahun_ajaran, nama_tahun_ajaran").order("nama_tahun_ajaran", { ascending: false }),
      supabase.from("siswa_kelas").select("id_kelas").eq("aktif", true),
    ]);

  const countMap = new Map<string, number>();
  for (const sk of siswaKelasList ?? []) {
    countMap.set(sk.id_kelas, (countMap.get(sk.id_kelas) ?? 0) + 1);
  }

  const rows = (kelasList ?? []).map((k) => ({
    id_kelas: k.id_kelas,
    nama_kelas: k.nama_kelas,
    tingkat: k.tingkat,
    id_jurusan: k.id_jurusan,
    id_tahun_ajaran: k.id_tahun_ajaran,
    aktif: k.aktif,
    jurusan_nama: (k.jurusan as unknown as { nama_jurusan: string } | null)?.nama_jurusan ?? null,
    tahun_ajaran_nama: (k.tahun_ajaran as unknown as { nama_tahun_ajaran: string } | null)?.nama_tahun_ajaran ?? null,
    jumlah_siswa: countMap.get(k.id_kelas) ?? 0,
  }));

  return (
    <KelasClient
      rows={rows}
      jurusanOptions={(jurusanList ?? []).map((j) => ({ value: j.id_jurusan, label: j.nama_jurusan }))}
      tahunAjaranOptions={(tahunAjaranList ?? []).map((t) => ({ value: t.id_tahun_ajaran, label: t.nama_tahun_ajaran }))}
    />
  );
}
