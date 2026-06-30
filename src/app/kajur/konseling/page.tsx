import { requireKajurJurusan } from "@/lib/auth";
import { getKonselingSesiList } from "@/features/konseling/data";
import { KonselingListClient } from "@/features/konseling/list-client";

export default async function KajurKonselingPage() {
  const profile = await requireKajurJurusan();
  const rows = await getKonselingSesiList({ idJurusan: profile.id_jurusan });
  return <KonselingListClient rows={rows} basePath="/kajur/konseling" />;
}
