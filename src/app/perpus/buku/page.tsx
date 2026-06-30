import { requireRole } from "@/lib/auth";
import { getBukuList } from "@/features/perpus/data";
import { BukuClient } from "@/features/perpus/buku-client";

export default async function PerpusBukuPage() {
  await requireRole(["perpus"]);
  const rows = await getBukuList();
  return <BukuClient rows={rows} />;
}
