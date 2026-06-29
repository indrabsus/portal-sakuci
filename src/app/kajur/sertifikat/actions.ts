"use server";

import { requireKajurJurusan } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getJabatanKajur } from "@/lib/kompetensi-progress";

type ActionResult = { success: boolean; message: string };

function generateKode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

async function verifyKompetensiOwnership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  idKompetensi: string,
  idJurusan: string,
) {
  const { data } = await supabase.from("kompetensi").select("id_jurusan").eq("id_kompetensi", idKompetensi).single();
  return data?.id_jurusan === idJurusan;
}

async function verifySertifikatOwnership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  idSertifikat: string,
  idJurusan: string,
) {
  const { data } = await supabase
    .from("sertifikat")
    .select("kompetensi(id_jurusan)")
    .eq("id_sertifikat", idSertifikat)
    .single();
  return (data?.kompetensi as unknown as { id_jurusan: string } | null)?.id_jurusan === idJurusan;
}

export async function terbitkanSertifikat(formData: FormData): Promise<ActionResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();

  const idSiswa = String(formData.get("id_siswa") ?? "");
  const idKompetensi = String(formData.get("id_kompetensi") ?? "");
  const idProgres = String(formData.get("id_progres") ?? "");
  const nilai = Number(formData.get("nilai") ?? 0);

  if (!idSiswa || !idKompetensi || !idProgres) {
    return { success: false, message: "Data tidak lengkap." };
  }
  if (!(await verifyKompetensiOwnership(supabase, idKompetensi, profile.id_jurusan))) {
    return { success: false, message: "Kompetensi ini bukan milik jurusan Anda." };
  }

  const tahun = new Date().getFullYear();
  const nomorSertifikat = `CERT-${tahun}-${generateKode()}`;
  const kodeVerifikasi = generateKode();
  const jabatanKajur = await getJabatanKajur(supabase, idKompetensi);

  const { error: sertifikatError } = await supabase.from("sertifikat").insert({
    nomor_sertifikat: nomorSertifikat,
    id_siswa: idSiswa,
    id_kompetensi: idKompetensi,
    nilai,
    kode_verifikasi: kodeVerifikasi,
    diterbitkan_oleh: profile.id_profile,
    status: "aktif",
    nama_kajur: profile.nama_lengkap,
    jabatan_kajur: jabatanKajur,
    qr_code: `/verifikasi/${kodeVerifikasi}`,
  });

  if (sertifikatError) return { success: false, message: sertifikatError.message };

  await supabase
    .from("progres_kompetensi")
    .update({ divalidasi_oleh: profile.id_profile, tanggal_validasi: new Date().toISOString() })
    .eq("id_progres", idProgres);

  return { success: true, message: "Sertifikat berhasil diterbitkan." };
}

export async function cabutSertifikat(formData: FormData): Promise<ActionResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();
  const idSertifikat = String(formData.get("id_sertifikat") ?? "");

  if (!(await verifySertifikatOwnership(supabase, idSertifikat, profile.id_jurusan))) {
    return { success: false, message: "Sertifikat ini bukan milik jurusan Anda." };
  }

  const { error } = await supabase.from("sertifikat").update({ status: "dicabut" }).eq("id_sertifikat", idSertifikat);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Sertifikat berhasil dicabut." };
}

export async function aktifkanKembaliSertifikat(formData: FormData): Promise<ActionResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();
  const idSertifikat = String(formData.get("id_sertifikat") ?? "");

  if (!(await verifySertifikatOwnership(supabase, idSertifikat, profile.id_jurusan))) {
    return { success: false, message: "Sertifikat ini bukan milik jurusan Anda." };
  }

  const { error } = await supabase.from("sertifikat").update({ status: "aktif" }).eq("id_sertifikat", idSertifikat);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Sertifikat berhasil diaktifkan kembali." };
}

export async function hapusSertifikat(formData: FormData): Promise<ActionResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();
  const idSertifikat = String(formData.get("id_sertifikat") ?? "");
  if (!idSertifikat) return { success: false, message: "Data tidak valid." };

  if (!(await verifySertifikatOwnership(supabase, idSertifikat, profile.id_jurusan))) {
    return { success: false, message: "Sertifikat ini bukan milik jurusan Anda." };
  }

  const admin = createAdminClient();

  const { data: sertifikat } = await admin
    .from("sertifikat")
    .select("id_siswa, id_kompetensi")
    .eq("id_sertifikat", idSertifikat)
    .single();

  if (!sertifikat) return { success: false, message: "Sertifikat tidak ditemukan." };

  const { data: tesList } = await admin
    .from("kompetensi_tugas")
    .select("id_kompetensi_tugas")
    .eq("id_kompetensi", sertifikat.id_kompetensi);

  const idTesList = (tesList ?? []).map((t) => t.id_kompetensi_tugas);

  if (idTesList.length > 0) {
    const { data: pengumpulanList } = await admin
      .from("pengumpulan_kompetensi")
      .select("id_pengumpulan_kompetensi")
      .eq("id_siswa", sertifikat.id_siswa)
      .in("id_kompetensi_tugas", idTesList);

    const idPengumpulanList = (pengumpulanList ?? []).map((p) => p.id_pengumpulan_kompetensi);

    if (idPengumpulanList.length > 0) {
      await admin.from("jawaban_kompetensi_siswa").delete().in("id_pengumpulan_kompetensi", idPengumpulanList);
      await admin.from("pengumpulan_kompetensi").delete().in("id_pengumpulan_kompetensi", idPengumpulanList);
    }
  }

  await admin
    .from("progres_kompetensi")
    .delete()
    .eq("id_siswa", sertifikat.id_siswa)
    .eq("id_kompetensi", sertifikat.id_kompetensi);

  const { error } = await admin.from("sertifikat").delete().eq("id_sertifikat", idSertifikat);
  if (error) return { success: false, message: error.message };

  return { success: true, message: "Sertifikat dan seluruh progres tes kompetensi siswa berhasil dihapus. Siswa harus mengulang dari awal." };
}
