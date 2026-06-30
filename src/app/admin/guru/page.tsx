import { createClient } from "@/lib/supabase/server";
import { GuruClient } from "./client";

export default async function GuruPage() {
  const supabase = await createClient();
  const [{ data: guruList }, { data: akunList }] = await Promise.all([
    supabase
      .from("guru")
      .select("id_guru, nama_lengkap, uid_fp, no_hp, jenkel, foto_url")
      .order("nama_lengkap"),
    supabase.from("akun_guru").select("id_guru"),
  ]);

  const aktifSet = new Set((akunList ?? []).map((a) => a.id_guru));
  const rows = (guruList ?? []).map((g) => ({ ...g, akun_aktif: aktifSet.has(g.id_guru) }));

  return <GuruClient rows={rows} />;
}
