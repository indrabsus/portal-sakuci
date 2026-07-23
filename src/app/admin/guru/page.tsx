import { createClient } from "@/lib/supabase/server";
import { GuruClient } from "./client";
import { getUsernameSaranGuru } from "./actions";

export default async function GuruPage() {
  const supabase = await createClient();
  const [{ data: guruList }, { data: akunList }] = await Promise.all([
    supabase
      .from("guru")
      .select("id_guru, nama_lengkap, uid_fp, no_hp, jenkel, foto_url")
      .order("nama_lengkap"),
    supabase.from("akun_guru").select("id_guru, id_profile"),
  ]);

  const idProfileList = (akunList ?? []).map((a) => a.id_profile);
  const { data: profilList } = idProfileList.length
    ? await supabase.from("profiles").select("id_profile, email").in("id_profile", idProfileList)
    : { data: [] };

  const emailByProfile = new Map((profilList ?? []).map((p) => [p.id_profile, p.email]));
  const profileByGuru = new Map((akunList ?? []).map((a) => [a.id_guru, a.id_profile]));

  const rows = (guruList ?? []).map((g) => {
    const idProfile = profileByGuru.get(g.id_guru) ?? null;
    const email = idProfile ? emailByProfile.get(idProfile) ?? null : null;
    return {
      ...g,
      akun_aktif: profileByGuru.has(g.id_guru),
      username: email ? email.replace(/@.*$/, "") : null,
    };
  });

  const belumAktivasi = rows.filter((g) => !g.akun_aktif);
  const saran = belumAktivasi.length
    ? await getUsernameSaranGuru(
        belumAktivasi.map((g) => ({ id_guru: g.id_guru, nama_lengkap: g.nama_lengkap }))
      )
    : [];

  return <GuruClient rows={rows} saran={saran} />;
}
