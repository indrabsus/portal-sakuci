import { notFound } from "next/navigation";
import { requireKajurJurusan } from "@/lib/auth";
import { getKonselingSesiDetail } from "@/features/konseling/data";
import { KonselingDetailView } from "@/features/konseling/detail-view";

export default async function KajurKonselingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireKajurJurusan();
  const { id } = await params;
  const sesi = await getKonselingSesiDetail(id, { idJurusan: profile.id_jurusan });
  if (!sesi) notFound();
  return <KonselingDetailView sesi={sesi} />;
}
