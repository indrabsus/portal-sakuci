import { requireRole } from "@/lib/auth";
import { getSiswaCatatanSummary } from "@/features/catatan-bk/data";
import { SiswaBkClient } from "@/features/catatan-bk/siswa-client";

export default async function BkSiswaPage() {
  await requireRole(["bk"]);
  const rows = await getSiswaCatatanSummary();
  return <SiswaBkClient rows={rows} />;
}
