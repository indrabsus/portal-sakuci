import { createClient } from "@/lib/supabase/server";
import { InformasiSekolahClient } from "./client";

export default async function InformasiSekolahPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("informasi_sekolah").select("*").limit(1).maybeSingle();

  return <InformasiSekolahClient data={data} />;
}
