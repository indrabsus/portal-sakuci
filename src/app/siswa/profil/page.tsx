import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSiswaKelasInfo } from "@/lib/siswa";
import { ProfilClient } from "./client";

export default async function SiswaProfilPage() {
  const profile = await requireRole(["siswa"]);
  const supabase = await createClient();

  const [{ data: siswa }, kelasInfo, { data: sertifikatRaw }, { data: proyekRaw }] = await Promise.all([
    supabase
      .from("siswa")
      .select("nisn, jenkel, tempat_lahir, tanggal_lahir, agama, foto_url")
      .eq("id_siswa", profile.id_siswa ?? "")
      .single(),
    getSiswaKelasInfo(profile.id_siswa ?? ""),
    supabase
      .from("sertifikat")
      .select("id_sertifikat, nilai, tanggal_terbit, kompetensi(judul)")
      .eq("id_siswa", profile.id_siswa ?? "")
      .eq("status", "aktif")
      .order("tanggal_terbit", { ascending: false }),
    supabase
      .from("project_siswa")
      .select("id_project, nama_project, status, link_youtube")
      .eq("id_siswa", profile.id_siswa ?? "")
      .order("created_at", { ascending: false }),
  ]);

  const { data: jurusanData } = kelasInfo.id_jurusan
    ? await supabase.from("jurusan").select("nama_jurusan").eq("id_jurusan", kelasInfo.id_jurusan).single()
    : { data: null };

  const sertifikatList = (sertifikatRaw ?? []).map((s) => ({
    id_sertifikat: s.id_sertifikat,
    judul: (s.kompetensi as unknown as { judul: string } | null)?.judul ?? "-",
    nilai: s.nilai,
    tanggal_terbit: s.tanggal_terbit,
  }));

  const proyekList = (proyekRaw ?? []).map((p) => ({
    id_project: p.id_project,
    nama_project: p.nama_project,
    status: p.status,
    link_youtube: p.link_youtube,
  }));

  return (
    <ProfilClient
      idSiswa={profile.id_siswa ?? ""}
      namaLengkap={profile.nama_lengkap ?? "-"}
      email={profile.email}
      fotoUrl={siswa?.foto_url ?? null}
      nisn={siswa?.nisn ?? null}
      jenkel={siswa?.jenkel ?? null}
      tempatLahir={siswa?.tempat_lahir ?? null}
      tanggalLahir={siswa?.tanggal_lahir ?? null}
      agama={siswa?.agama ?? null}
      kelasNama={kelasInfo.nama_kelas}
      jurusanNama={jurusanData?.nama_jurusan ?? null}
      sertifikatList={sertifikatList}
      proyekList={proyekList}
    />
  );
}
