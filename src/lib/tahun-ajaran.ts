import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function getTahunAjaranAktifLabel(): Promise<string | null> {
  const cookieStore = await cookies();
  const idTahunAjaran = cookieStore.get("ta_aktif")?.value;
  if (!idTahunAjaran) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("tahun_ajaran")
    .select("nama_tahun_ajaran, semester")
    .eq("id_tahun_ajaran", idTahunAjaran)
    .single();

  if (!data) return null;
  return data.semester
    ? `${data.nama_tahun_ajaran} — ${data.semester}`
    : data.nama_tahun_ajaran;
}

export async function getTahunAjaranAktifId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("ta_aktif")?.value ?? null;
}
