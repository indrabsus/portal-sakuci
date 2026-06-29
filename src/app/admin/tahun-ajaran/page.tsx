import { createClient } from "@/lib/supabase/server";
import { TahunAjaranClient } from "./client";

export default async function TahunAjaranPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tahun_ajaran")
    .select("id_tahun_ajaran, nama_tahun_ajaran, semester, aktif")
    .order("nama_tahun_ajaran", { ascending: false });

  return <TahunAjaranClient rows={data ?? []} />;
}
