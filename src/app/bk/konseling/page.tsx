import { requireRole } from "@/lib/auth";
import { getKonselingSesiList } from "@/features/konseling/data";
import { KonselingListClient } from "@/features/konseling/list-client";

export default async function BkKonselingPage() {
  await requireRole(["bk"]);
  const rows = await getKonselingSesiList();
  return <KonselingListClient rows={rows} basePath="/bk/konseling" />;
}
