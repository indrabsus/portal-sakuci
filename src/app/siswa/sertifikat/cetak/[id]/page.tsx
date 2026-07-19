import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { generateQrDataUrl } from "@/lib/qr";
import { resolveSertifikatCetak } from "@/lib/sertifikat-cetak";
import { CertificateView } from "@/components/certificate-view";
import { PrintButton } from "@/components/print-button";

export default async function CetakSertifikatSiswaPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireRole(["siswa"]);
  const { id } = await params;
  const supabase = await createClient();
  const headerList = await headers();
  const origin = `${headerList.get("x-forwarded-proto") ?? "https"}://${headerList.get("host") ?? ""}`;

  const [{ data: sertifikat }, { data: sekolah }] = await Promise.all([
    supabase
      .from("sertifikat")
      .select(
        "id_sertifikat, id_siswa, id_kompetensi, judul_manual, nomor_sertifikat, nilai, tanggal_terbit, kode_verifikasi, nama_kajur, jabatan_kajur, nip_kajur, diterbitkan_oleh, nama_kepsek, nip_kepsek, status, siswa(nama_lengkap), kompetensi(judul, syarat_lulus)",
      )
      .eq("id_sertifikat", id)
      .single(),
    supabase.from("informasi_sekolah").select("nama_sekolah").limit(1).maybeSingle(),
  ]);

  if (!sertifikat || sertifikat.id_siswa !== profile.id_siswa || sertifikat.status !== "aktif") {
    notFound();
  }

  const kodeVerifikasi = sertifikat.kode_verifikasi ?? "";
  const [qrDataUrl, resolved] = await Promise.all([
    generateQrDataUrl(`${origin}/verifikasi/${kodeVerifikasi}`),
    resolveSertifikatCetak(supabase, {
      id_siswa: sertifikat.id_siswa,
      id_kompetensi: sertifikat.id_kompetensi,
      judul_manual: sertifikat.judul_manual,
      nilai: sertifikat.nilai,
      jabatan_kajur: sertifikat.jabatan_kajur,
      nip_kajur: sertifikat.nip_kajur,
      diterbitkan_oleh: sertifikat.diterbitkan_oleh,
      kompetensi: sertifikat.kompetensi as unknown as { judul: string; syarat_lulus: number } | null,
    }),
  ]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 print:gap-0 print:p-0">
      <div className="no-print flex w-full max-w-[1100px] items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Sertifikat Saya</h1>
          <p className="text-sm text-muted-foreground">Periksa tampilan sebelum mencetak</p>
        </div>
        <PrintButton />
      </div>

      <CertificateView
        data={{
          namaSiswa: (sertifikat.siswa as unknown as { nama_lengkap: string } | null)?.nama_lengkap ?? "-",
          judulKompetensi: resolved.judulKompetensi,
          nilai: resolved.nilai,
          nomorSertifikat: sertifikat.nomor_sertifikat,
          kodeVerifikasi: sertifikat.kode_verifikasi,
          tanggalTerbit: sertifikat.tanggal_terbit,
          namaKajur: sertifikat.nama_kajur,
          jabatanKajur: resolved.jabatanKajur,
          nipKajur: resolved.nipKajur,
          namaKepsek: sertifikat.nama_kepsek,
          nipKepsek: sertifikat.nip_kepsek,
          qrDataUrl,
          namaSekolah: sekolah?.nama_sekolah ?? "Portal Sakuci",
          rincianTes: resolved.rincianTes,
          statusLulus: resolved.statusLulus,
        }}
      />
    </div>
  );
}
