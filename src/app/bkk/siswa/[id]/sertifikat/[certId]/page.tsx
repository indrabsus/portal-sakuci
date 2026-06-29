import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { generateQrDataUrl } from "@/lib/qr";
import { getRincianTesKompetensi, hitungNilaiAkhir, cekStatusLulus, getJabatanKajur } from "@/lib/kompetensi-progress";
import { CertificateView } from "@/components/certificate-view";
import { PrintButton } from "@/components/print-button";

export default async function BkkLihatSertifikatPage({ params }: { params: Promise<{ id: string; certId: string }> }) {
  const { id, certId } = await params;
  const supabase = await createClient();

  const [{ data: sertifikat }, { data: sekolah }] = await Promise.all([
    supabase
      .from("sertifikat")
      .select(
        "id_sertifikat, id_siswa, id_kompetensi, nomor_sertifikat, nilai, tanggal_terbit, kode_verifikasi, nama_kajur, jabatan_kajur, status, siswa(nama_lengkap), kompetensi(judul, syarat_lulus)",
      )
      .eq("id_sertifikat", certId)
      .single(),
    supabase.from("informasi_sekolah").select("nama_sekolah").limit(1).maybeSingle(),
  ]);

  if (!sertifikat || sertifikat.id_siswa !== id || sertifikat.status !== "aktif") {
    notFound();
  }

  const headerList = await headers();
  const origin = `${headerList.get("x-forwarded-proto") ?? "https"}://${headerList.get("host") ?? ""}`;
  const kodeVerifikasi = sertifikat.kode_verifikasi ?? "";

  const [qrDataUrl, rincianTes, jabatanKajur] = await Promise.all([
    generateQrDataUrl(`${origin}/verifikasi/${kodeVerifikasi}`),
    getRincianTesKompetensi(supabase, sertifikat.id_siswa, sertifikat.id_kompetensi),
    getJabatanKajur(supabase, sertifikat.id_kompetensi),
  ]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 print:gap-0 print:p-0">
      <div className="no-print flex w-full max-w-[1100px] items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Sertifikat Siswa</h1>
          <p className="text-sm text-muted-foreground">Dilihat oleh BKK</p>
        </div>
        <PrintButton />
      </div>

      <CertificateView
        data={{
          namaSiswa: (sertifikat.siswa as unknown as { nama_lengkap: string } | null)?.nama_lengkap ?? "-",
          judulKompetensi: (sertifikat.kompetensi as unknown as { judul: string } | null)?.judul ?? "-",
          nilai: hitungNilaiAkhir(rincianTes) ?? sertifikat.nilai,
          nomorSertifikat: sertifikat.nomor_sertifikat,
          kodeVerifikasi: sertifikat.kode_verifikasi,
          tanggalTerbit: sertifikat.tanggal_terbit,
          namaKajur: sertifikat.nama_kajur,
          jabatanKajur,
          qrDataUrl,
          namaSekolah: sekolah?.nama_sekolah ?? "Portal Sakuci",
          rincianTes,
          statusLulus: cekStatusLulus(
            rincianTes,
            (sertifikat.kompetensi as unknown as { syarat_lulus: number } | null)?.syarat_lulus ?? 75,
          ),
        }}
      />
    </div>
  );
}
