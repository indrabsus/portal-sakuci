import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getKonselingSesiDetail } from "@/features/konseling/data";
import { KonselingDetailView } from "@/features/konseling/detail-view";

export default async function BkKonselingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["bk"]);
  const { id } = await params;
  const sesi = await getKonselingSesiDetail(id);
  if (!sesi) notFound();
  return <KonselingDetailView sesi={sesi} />;
}
