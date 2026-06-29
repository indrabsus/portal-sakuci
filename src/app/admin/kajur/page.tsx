import { createClient } from "@/lib/supabase/server";
import { KajurJurusanClient } from "./client";

export default async function AdminKajurPage() {
  const supabase = await createClient();

  const [{ data: kajurList }, { data: jurusanList }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id_profile, nama_lengkap, email, id_jurusan, roles!inner(nama_role)")
      .eq("roles.nama_role", "kajur")
      .order("nama_lengkap"),
    supabase.from("jurusan").select("id_jurusan, nama_jurusan").order("nama_jurusan"),
  ]);

  return (
    <KajurJurusanClient
      rows={(kajurList ?? []).map((k) => ({
        id_profile: k.id_profile,
        nama_lengkap: k.nama_lengkap,
        email: k.email,
        id_jurusan: k.id_jurusan,
      }))}
      jurusanOptions={(jurusanList ?? []).map((j) => ({ value: j.id_jurusan, label: j.nama_jurusan }))}
    />
  );
}
