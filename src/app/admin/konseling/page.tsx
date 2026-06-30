import { requireRole } from "@/lib/auth";
import { getKonselingSesiList } from "@/features/konseling/data";
import { KonselingListClient } from "@/features/konseling/list-client";

export default async function AdminKonselingPage() {
  await requireRole(["admin"]);
  const rows = await getKonselingSesiList();
  return <KonselingListClient rows={rows} basePath="/admin/konseling" />;
}
