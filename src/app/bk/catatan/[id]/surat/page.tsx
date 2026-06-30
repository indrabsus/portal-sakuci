import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getCatatanBkById } from "@/features/catatan-bk/data";
import { createClient } from "@/lib/supabase/server";
import { PrintButton } from "@/components/print-button";
import { SuratPerjanjianView } from "@/features/catatan-bk/surat-view";

export default async function SuratPerjanjianPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["bk"]);
  const { id } = await params;

  const [catatan, { data: sekolah }] = await Promise.all([
    getCatatanBkById(id),
    (await createClient()).from("informasi_sekolah").select("nama_sekolah, alamat").limit(1).maybeSingle(),
  ]);

  if (!catatan) notFound();

  return (
    <div className="flex flex-col items-center gap-6 p-6 print:gap-0 print:p-0">
      <div className="no-print flex w-full max-w-3xl items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Surat Perjanjian</h1>
          <p className="text-sm text-muted-foreground">Pratinjau surat perjanjian — periksa sebelum mencetak</p>
        </div>
        <PrintButton />
      </div>
      <SuratPerjanjianView
        catatan={catatan}
        namaSekolah={sekolah?.nama_sekolah ?? "SMK Portal Sakuci"}
        alamatSekolah={sekolah?.alamat ?? ""}
      />
    </div>
  );
}
