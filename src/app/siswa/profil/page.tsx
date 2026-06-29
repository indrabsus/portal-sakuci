import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSiswaKelasInfo } from "@/lib/siswa";
import { ProfilClient } from "./client";

export default async function SiswaProfilPage() {
  const profile = await requireRole(["siswa"]);
  const supabase = await createClient();

  const [{ data: siswa }, kelasInfo] = await Promise.all([
    supabase.from("siswa").select("nisn, foto_url").eq("id_siswa", profile.id_siswa ?? "").single(),
    getSiswaKelasInfo(profile.id_siswa ?? ""),
  ]);

  const { data: jurusanData } = kelasInfo.id_jurusan
    ? await supabase.from("jurusan").select("nama_jurusan").eq("id_jurusan", kelasInfo.id_jurusan).single()
    : { data: null };

  return (
    <ProfilClient
      idSiswa={profile.id_siswa ?? ""}
      namaLengkap={profile.nama_lengkap ?? "-"}
      fotoUrl={siswa?.foto_url ?? null}
      nisn={siswa?.nisn ?? null}
      kelasNama={kelasInfo.nama_kelas}
      jurusanNama={jurusanData?.nama_jurusan ?? null}
    />
  );
}
