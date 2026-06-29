import { CheckCircle2, XCircle } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function VerifikasiPage({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params;
  const admin = createAdminClient();

  const { data: sertifikat } = await admin
    .from("sertifikat")
    .select("nomor_sertifikat, nilai, tanggal_terbit, status, siswa(nama_lengkap), kompetensi(judul)")
    .eq("kode_verifikasi", kode)
    .maybeSingle();

  const valid = !!sertifikat && sertifikat.status === "aktif";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/20 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card/90 p-8 text-center shadow-xl shadow-primary/5 backdrop-blur-sm">
        {valid ? (
          <CheckCircle2 className="mx-auto size-14 text-primary" />
        ) : (
          <XCircle className="mx-auto size-14 text-destructive" />
        )}

        <h1 className="mt-4 text-xl font-bold tracking-tight">
          {valid ? "Sertifikat Valid" : "Sertifikat Tidak Ditemukan"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {valid ? "Sertifikat ini terdaftar resmi di Portal Sakuci." : "Kode verifikasi tidak valid atau sertifikat telah dicabut."}
        </p>

        {sertifikat && (
          <div className="mt-6 flex flex-col gap-2 rounded-xl border bg-muted/30 p-4 text-left text-sm">
            <Row label="Nama Siswa" value={(sertifikat.siswa as unknown as { nama_lengkap: string } | null)?.nama_lengkap ?? "-"} />
            <Row label="Kompetensi" value={(sertifikat.kompetensi as unknown as { judul: string } | null)?.judul ?? "-"} />
            <Row label="Nilai" value={String(sertifikat.nilai ?? "-")} />
            <Row label="No. Sertifikat" value={sertifikat.nomor_sertifikat ?? "-"} mono />
            <Row
              label="Tanggal Terbit"
              value={sertifikat.tanggal_terbit ? new Date(sertifikat.tanggal_terbit).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-foreground" : "font-medium text-foreground"}>{value}</span>
    </div>
  );
}
