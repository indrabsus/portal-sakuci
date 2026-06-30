import { requireRole } from "@/lib/auth";
import { getCatatanBkList, getSiswaOptions } from "@/features/catatan-bk/data";
import { CatatanBkClient } from "@/features/catatan-bk/catatan-client";

export default async function BkCatatanPage({
  searchParams,
}: {
  searchParams: Promise<{ siswa?: string }>;
}) {
  await requireRole(["bk"]);
  const { siswa } = await searchParams;
  const [rows, siswaOptions] = await Promise.all([getCatatanBkList(), getSiswaOptions()]);
  return <CatatanBkClient rows={rows} siswaOptions={siswaOptions} filterSiswaId={siswa} />;
}
