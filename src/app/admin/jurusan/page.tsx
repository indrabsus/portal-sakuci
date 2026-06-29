import { createClient } from "@/lib/supabase/server";
import { JurusanClient } from "./client";

export default async function JurusanPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jurusan")
    .select("id_jurusan, kode_jurusan, nama_jurusan, deskripsi, aktif")
    .order("nama_jurusan");

  return <JurusanClient rows={data ?? []} />;
}
