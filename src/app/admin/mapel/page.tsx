import { createClient } from "@/lib/supabase/server";
import { MapelClient } from "./client";

export default async function MapelPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("mapel").select("id_mapel, nama_mapel").order("nama_mapel");

  return <MapelClient rows={data ?? []} />;
}
