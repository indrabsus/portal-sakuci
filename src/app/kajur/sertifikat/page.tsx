import { requireKajurJurusan } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/fetch-all";
import { SertifikatClient } from "./client";

export default async function SertifikatPage() {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();

  const { data: kompetensiJurusan } = await supabase
    .from("kompetensi")
    .select("id_kompetensi")
    .eq("id_jurusan", profile.id_jurusan);
  const idKompetensiList = (kompetensiJurusan ?? []).map((k) => k.id_kompetensi);
  const safeIds = idKompetensiList.length ? idKompetensiList : [""];

  const [progresLulus, sertifikatList] = await Promise.all([
    fetchAllRows((from, to) =>
      supabase
        .from("progres_kompetensi")
        .select("id_progres, id_siswa, id_kompetensi, nilai, siswa(nama_lengkap), kompetensi(judul)")
        .eq("status", "lulus")
        .in("id_kompetensi", safeIds)
        .range(from, to),
    ),
    fetchAllRows((from, to) =>
      supabase
        .from("sertifikat")
        .select("id_sertifikat, nomor_sertifikat, nilai, tanggal_terbit, status, id_siswa, id_kompetensi, siswa(nama_lengkap), kompetensi(judul)")
        .in("id_kompetensi", safeIds)
        .order("tanggal_terbit", { ascending: false })
        .range(from, to),
    ),
  ]);

  const sudahTerbitSet = new Set(
    sertifikatList.map((s) => `${s.id_siswa}__${s.id_kompetensi}`),
  );

  const pending = progresLulus
    .filter((p) => !sudahTerbitSet.has(`${p.id_siswa}__${p.id_kompetensi}`))
    .map((p) => ({
      id_progres: p.id_progres,
      id_siswa: p.id_siswa,
      id_kompetensi: p.id_kompetensi,
      nama_siswa: (p.siswa as unknown as { nama_lengkap: string } | null)?.nama_lengkap ?? "-",
      judul_kompetensi: (p.kompetensi as unknown as { judul: string } | null)?.judul ?? "-",
      nilai: p.nilai,
    }));

  const terbit = sertifikatList.map((s) => ({
    id_sertifikat: s.id_sertifikat,
    nomor_sertifikat: s.nomor_sertifikat,
    nama_siswa: (s.siswa as unknown as { nama_lengkap: string } | null)?.nama_lengkap ?? "-",
    judul_kompetensi: (s.kompetensi as unknown as { judul: string } | null)?.judul ?? "-",
    nilai: s.nilai,
    tanggal_terbit: s.tanggal_terbit,
    status: s.status,
  }));

  return <SertifikatClient pending={pending} terbit={terbit} />;
}
