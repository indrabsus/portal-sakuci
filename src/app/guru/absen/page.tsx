import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AbsenClient, type RekapKehadiranRow } from "./client";

type RekapKehadiranResponse = {
  status: string;
  data?: RekapKehadiranRow[];
  message?: string;
};

export default async function GuruAbsenPage({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string; tahun?: string }>;
}) {
  const profile = await requireRole(["guru"]);
  const { bulan, tahun } = await searchParams;

  const now = new Date();
  const bulanAktif = Number(bulan) || now.getMonth() + 1;
  const tahunAktif = Number(tahun) || now.getFullYear();

  const supabase = await createClient();
  const { data: guru } = await supabase
    .from("guru")
    .select("uid_fp")
    .eq("id_guru", profile.id_guru ?? "")
    .single();

  const uidFp = guru?.uid_fp ?? null;

  let rows: RekapKehadiranRow[] = [];
  let error: string | null = null;

  if (!uidFp) {
    error = "UID fingerprint belum diatur untuk akun Anda. Hubungi admin untuk melengkapi data ini.";
  } else {
    const apiServer = process.env.NEXT_PUBLIC_API_SERVER;
    if (!apiServer) {
      error = "NEXT_PUBLIC_API_SERVER belum dikonfigurasi.";
    } else {
      try {
        const res = await fetch(
          `${apiServer}/presensi/rekap-kehadiran/${uidFp}?bulan=${bulanAktif}&tahun=${tahunAktif}`,
          { cache: "no-store" },
        );
        const json: RekapKehadiranResponse = await res.json();
        if (!res.ok || json.status !== "success") {
          error = json.message ?? "Gagal mengambil data absensi dari server.";
        } else {
          rows = json.data ?? [];
        }
      } catch {
        error = "Tidak dapat terhubung ke server absensi. Pastikan server berjalan.";
      }
    }
  }

  return (
    <AbsenClient
      rows={rows}
      error={error}
      bulan={bulanAktif}
      tahun={tahunAktif}
      namaLengkap={profile.nama_lengkap ?? "-"}
    />
  );
}
