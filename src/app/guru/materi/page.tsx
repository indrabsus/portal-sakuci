import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { MateriClient } from "./client";

export default async function MateriPage() {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const { data: mengajarList } = await supabase
    .from("mengajar")
    .select("id_mengajar, mapel(nama_mapel), kelas(nama_kelas)")
    .eq("id_guru", profile.id_guru ?? "");

  const mengajarOptions = (mengajarList ?? []).map((m) => ({
    value: m.id_mengajar,
    label: `${(m.mapel as unknown as { nama_mapel: string } | null)?.nama_mapel ?? "-"} - ${(m.kelas as unknown as { nama_kelas: string } | null)?.nama_kelas ?? "-"}`,
  }));

  const idMengajarList = mengajarOptions.map((m) => m.value);
  const mengajarLabelMap = new Map(mengajarOptions.map((m) => [m.value, m.label]));

  const { data: materiList } = await supabase
    .from("materi")
    .select("id_materi, id_mengajar, judul, isi, file_url")
    .in("id_mengajar", idMengajarList.length ? idMengajarList : [""])
    .order("created_at", { ascending: false });

  const rows = (materiList ?? []).map((m) => ({
    ...m,
    mengajar_label: mengajarLabelMap.get(m.id_mengajar) ?? "-",
  }));

  return <MateriClient rows={rows} mengajarOptions={mengajarOptions} />;
}
