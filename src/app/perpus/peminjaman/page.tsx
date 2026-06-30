import { requireRole } from "@/lib/auth";
import { getPeminjamanList, getSiswaOptions, getBukuList } from "@/features/perpus/data";
import { PeminjamanClient } from "@/features/perpus/peminjaman-client";

export default async function PerpusPeminjamanPage() {
  await requireRole(["perpus"]);
  const [rows, siswaOptions, bukuOptions] = await Promise.all([
    getPeminjamanList(),
    getSiswaOptions(),
    getBukuList(),
  ]);
  return <PeminjamanClient rows={rows} siswaOptions={siswaOptions} bukuOptions={bukuOptions} />;
}
