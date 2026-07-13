"use server";

import { requireKajurJurusan } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { generateKode } from "@/lib/sertifikat-kode";
import { getJabatanKajurByJurusan } from "@/lib/kompetensi-progress";
import { verifySertifikatOwnership } from "../sertifikat/actions";

type ActionResult = { success: boolean; message: string };

export async function buatSertifikatManual(formData: FormData): Promise<ActionResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();

  let idSiswaList: string[] = [];
  try {
    idSiswaList = JSON.parse(String(formData.get("id_siswa_list") ?? "[]"));
  } catch {
    return { success: false, message: "Data siswa tidak valid." };
  }
  const judulManual = String(formData.get("judul_manual") ?? "").trim();
  const nilaiRaw = String(formData.get("nilai") ?? "").trim();
  const nilai = nilaiRaw === "" ? null : Number(nilaiRaw);
  const sertakanKepsek = formData.get("sertakan_kepsek") === "on";

  if (idSiswaList.length === 0 || !judulManual) {
    return { success: false, message: "Minimal satu siswa dan judul kompetensi wajib diisi." };
  }
  if (nilai !== null && (!Number.isFinite(nilai) || nilai < 0 || nilai > 100)) {
    return { success: false, message: "Nilai harus berupa angka 0-100, atau kosongkan jika tidak perlu." };
  }

  const { data: siswaKelasList } = await supabase
    .from("siswa_kelas")
    .select("id_siswa, kelas!inner(id_jurusan)")
    .in("id_siswa", idSiswaList)
    .eq("aktif", true)
    .eq("kelas.id_jurusan", profile.id_jurusan);

  const idSiswaValidSet = new Set((siswaKelasList ?? []).map((sk) => sk.id_siswa));
  const idSiswaValid = idSiswaList.filter((id) => idSiswaValidSet.has(id));

  if (idSiswaValid.length === 0) {
    return { success: false, message: "Tidak ada siswa terpilih yang merupakan siswa aktif di jurusan Anda." };
  }

  let namaKepsek: string | null = null;
  let nipKepsek: string | null = null;
  if (sertakanKepsek) {
    const { data: sekolah } = await supabase
      .from("informasi_sekolah")
      .select("nama_kepala_sekolah, nip_kepala_sekolah")
      .limit(1)
      .maybeSingle();
    namaKepsek = sekolah?.nama_kepala_sekolah ?? null;
    nipKepsek = sekolah?.nip_kepala_sekolah ?? null;
    if (!namaKepsek) {
      return { success: false, message: "Nama Kepala Sekolah belum diatur di menu Informasi Sekolah." };
    }
  }

  const jabatanKajur = await getJabatanKajurByJurusan(supabase, profile.id_jurusan);
  const tahun = new Date().getFullYear();

  const payload = idSiswaValid.map((idSiswa) => {
    const kodeVerifikasi = generateKode();
    return {
      nomor_sertifikat: `CERT-${tahun}-${generateKode()}`,
      id_siswa: idSiswa,
      id_kompetensi: null,
      tipe: "manual",
      judul_manual: judulManual,
      id_jurusan: profile.id_jurusan,
      nilai,
      kode_verifikasi: kodeVerifikasi,
      diterbitkan_oleh: profile.id_profile,
      status: "aktif",
      nama_kajur: profile.nama_lengkap,
      jabatan_kajur: jabatanKajur,
      nip_kajur: profile.nip_nuptk,
      nama_kepsek: namaKepsek,
      nip_kepsek: nipKepsek,
      qr_code: `/verifikasi/${kodeVerifikasi}`,
    };
  });

  const { error } = await supabase.from("sertifikat").insert(payload);
  if (error) return { success: false, message: error.message };

  const skipped = idSiswaList.length - idSiswaValid.length;
  return {
    success: true,
    message: `Sertifikat manual berhasil diterbitkan untuk ${idSiswaValid.length} siswa.${skipped > 0 ? ` (${skipped} siswa dilewati karena bukan siswa aktif di jurusan Anda)` : ""}`,
  };
}

export async function hapusSertifikatManual(formData: FormData): Promise<ActionResult> {
  const profile = await requireKajurJurusan();
  const supabase = await createClient();
  const idSertifikat = String(formData.get("id_sertifikat") ?? "");
  if (!idSertifikat) return { success: false, message: "Data tidak valid." };

  if (!(await verifySertifikatOwnership(supabase, idSertifikat, profile.id_jurusan))) {
    return { success: false, message: "Sertifikat ini bukan milik jurusan Anda." };
  }

  const { error } = await supabase.from("sertifikat").delete().eq("id_sertifikat", idSertifikat);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Sertifikat manual berhasil dihapus." };
}
