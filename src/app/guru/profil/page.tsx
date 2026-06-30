import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ProfilGuruClient } from "./client";

export default async function GuruProfilPage() {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const { data: guru } = await supabase
    .from("guru")
    .select("nama_lengkap, uid_fp, no_hp, jenkel, foto_url")
    .eq("id_guru", profile.id_guru ?? "")
    .single();

  const { data: mengajarList } = await supabase
    .from("mengajar")
    .select("id_mengajar, mapel(nama_mapel), kelas(nama_kelas, tingkat)")
    .eq("id_guru", profile.id_guru ?? "");

  const daftarMengajar = (mengajarList ?? []).map((m) => {
    const mapel = m.mapel as unknown as { nama_mapel: string } | null;
    const kelas = m.kelas as unknown as { nama_kelas: string; tingkat: number | null } | null;
    return {
      id_mengajar: m.id_mengajar,
      mapel: mapel?.nama_mapel ?? "-",
      kelas: kelas ? (kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas) : "-",
    };
  });

  return (
    <ProfilGuruClient
      idGuru={profile.id_guru ?? ""}
      namaLengkap={guru?.nama_lengkap ?? profile.nama_lengkap ?? "-"}
      email={profile.email}
      fotoUrl={guru?.foto_url ?? null}
      uidFp={guru?.uid_fp ?? null}
      noHp={guru?.no_hp ?? null}
      jenkel={guru?.jenkel ?? null}
      daftarMengajar={daftarMengajar}
    />
  );
}
