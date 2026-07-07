"use server";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/fetch-all";

type ActionResult = { success: boolean; message: string };

function buildKelasPayload(formData: FormData) {
  return {
    nama_kelas: String(formData.get("nama_kelas") ?? "").trim(),
    tingkat: Number(formData.get("tingkat") ?? 0) || null,
    id_jurusan: String(formData.get("id_jurusan") ?? "") || null,
    id_tahun_ajaran: String(formData.get("id_tahun_ajaran") ?? "") || null,
    aktif: formData.get("aktif") === "on",
  };
}

export async function createKelas(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const payload = buildKelasPayload(formData);

  if (!payload.nama_kelas || !payload.id_tahun_ajaran) {
    return { success: false, message: "Nama kelas dan tahun ajaran wajib diisi." };
  }

  const { error } = await supabase.from("kelas").insert(payload);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil ditambahkan." };
}

export async function updateKelas(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id_kelas") ?? "");
  const payload = buildKelasPayload(formData);

  if (!id || !payload.nama_kelas || !payload.id_tahun_ajaran) {
    return { success: false, message: "Data tidak lengkap." };
  }

  const { error } = await supabase.from("kelas").update(payload).eq("id_kelas", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil diubah." };
}

export async function createKelasMasal(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const prefix = String(formData.get("prefix") ?? "").trim();
  const awal = Number(formData.get("awal") ?? 0);
  const akhir = Number(formData.get("akhir") ?? 0);
  const tingkat = Number(formData.get("tingkat") ?? 0) || null;
  const idJurusan = String(formData.get("id_jurusan") ?? "") || null;
  const idTahunAjaran = String(formData.get("id_tahun_ajaran") ?? "") || null;
  const aktif = formData.get("aktif") === "on";

  if (!prefix || !idTahunAjaran || !awal || !akhir) {
    return { success: false, message: "Prefix nama kelas, nomor awal-akhir, dan tahun ajaran wajib diisi." };
  }
  if (akhir < awal) {
    return { success: false, message: "Nomor akhir harus lebih besar atau sama dengan nomor awal." };
  }
  if (akhir - awal > 200) {
    return { success: false, message: "Maksimal 200 kelas sekali buat." };
  }

  const payloads = [];
  for (let i = awal; i <= akhir; i++) {
    payloads.push({
      nama_kelas: `${prefix} ${i}`,
      tingkat,
      id_jurusan: idJurusan,
      id_tahun_ajaran: idTahunAjaran,
      aktif,
    });
  }

  const { error } = await supabase.from("kelas").insert(payloads);
  if (error) return { success: false, message: error.message };
  return { success: true, message: `Berhasil membuat ${payloads.length} kelas.` };
}

export async function deleteKelas(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id_kelas") ?? "");
  const { error } = await supabase.from("kelas").delete().eq("id_kelas", id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Berhasil dihapus." };
}

export async function addSiswaToKelas(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const idKelas = String(formData.get("id_kelas") ?? "");
  const idSiswa = String(formData.get("id_siswa") ?? "");
  const idTahunAjaran = String(formData.get("id_tahun_ajaran") ?? "");

  if (!idKelas || !idSiswa) return { success: false, message: "Pilih siswa terlebih dahulu." };

  const { error } = await supabase.from("siswa_kelas").upsert(
    { id_siswa: idSiswa, id_kelas: idKelas, id_tahun_ajaran: idTahunAjaran || null, aktif: true },
    { onConflict: "id_siswa,id_tahun_ajaran" },
  );
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Siswa berhasil ditambahkan ke kelas." };
}

export async function addSiswaToKelasMasal(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const idKelas = String(formData.get("id_kelas") ?? "");
  const idTahunAjaran = String(formData.get("id_tahun_ajaran") ?? "");
  const idSiswaList = JSON.parse(String(formData.get("id_siswa_list") ?? "[]")) as string[];

  if (!idKelas || idSiswaList.length === 0) return { success: false, message: "Pilih siswa terlebih dahulu." };

  const { error } = await supabase.from("siswa_kelas").upsert(
    idSiswaList.map((idSiswa) => ({
      id_siswa: idSiswa,
      id_kelas: idKelas,
      id_tahun_ajaran: idTahunAjaran || null,
      aktif: true,
    })),
    { onConflict: "id_siswa,id_tahun_ajaran" },
  );
  if (error) return { success: false, message: error.message };
  return { success: true, message: `${idSiswaList.length} siswa berhasil ditambahkan ke kelas.` };
}

export async function removeSiswaFromKelasMasal(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const idSiswaKelasList = JSON.parse(String(formData.get("id_siswa_kelas_list") ?? "[]")) as string[];
  if (idSiswaKelasList.length === 0) return { success: false, message: "Pilih siswa terlebih dahulu." };

  const { error } = await supabase.from("siswa_kelas").delete().in("id_siswa_kelas", idSiswaKelasList);
  if (error) return { success: false, message: error.message };
  return { success: true, message: `${idSiswaKelasList.length} siswa berhasil dikeluarkan dari kelas.` };
}

export async function duplicateKelas(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const idTahunAjaranTujuan = String(formData.get("id_tahun_ajaran_tujuan") ?? "");
  const idKelasList = JSON.parse(String(formData.get("id_kelas_list") ?? "[]")) as string[];
  const naikkanTingkat = formData.get("naikkan_tingkat") === "on";
  const sertakanSiswa = formData.get("sertakan_siswa") === "on";

  if (!idTahunAjaranTujuan || idKelasList.length === 0) {
    return { success: false, message: "Pilih tahun ajaran tujuan dan minimal satu kelas." };
  }

  const { data: kelasSumber, error: kelasSumberError } = await supabase
    .from("kelas")
    .select("id_kelas, nama_kelas, tingkat, id_jurusan, id_tahun_ajaran")
    .in("id_kelas", idKelasList);
  if (kelasSumberError) return { success: false, message: kelasSumberError.message };
  if (!kelasSumber || kelasSumber.length === 0) return { success: false, message: "Kelas sumber tidak ditemukan." };

  if (kelasSumber.some((k) => k.id_tahun_ajaran === idTahunAjaranTujuan)) {
    return { success: false, message: "Tahun ajaran tujuan harus berbeda dari tahun ajaran kelas sumber." };
  }

  const { data: kelasTujuanAda } = await supabase
    .from("kelas")
    .select("id_kelas, nama_kelas")
    .eq("id_tahun_ajaran", idTahunAjaranTujuan);
  const kelasTujuanMap = new Map((kelasTujuanAda ?? []).map((k) => [k.nama_kelas.trim().toLowerCase(), k.id_kelas]));

  let jumlahKelasDibuat = 0;
  let jumlahKelasDipakaiUlang = 0;
  let jumlahSiswaDipindah = 0;

  for (const k of kelasSumber) {
    const namaKey = k.nama_kelas.trim().toLowerCase();
    let idKelasBaru = kelasTujuanMap.get(namaKey);

    if (!idKelasBaru) {
      const tingkatBaru = naikkanTingkat && k.tingkat ? k.tingkat + 1 : k.tingkat;
      const { data: created, error: createError } = await supabase
        .from("kelas")
        .insert({
          nama_kelas: k.nama_kelas,
          tingkat: tingkatBaru,
          id_jurusan: k.id_jurusan,
          id_tahun_ajaran: idTahunAjaranTujuan,
          aktif: true,
        })
        .select("id_kelas")
        .single();
      if (createError || !created) return { success: false, message: createError?.message ?? "Gagal membuat kelas." };
      idKelasBaru = created.id_kelas;
      kelasTujuanMap.set(namaKey, idKelasBaru);
      jumlahKelasDibuat++;
    } else {
      jumlahKelasDipakaiUlang++;
    }

    if (sertakanSiswa) {
      const anggotaSumber = await fetchAllRows((from, to) =>
        supabase
          .from("siswa_kelas")
          .select("id_siswa")
          .eq("id_kelas", k.id_kelas)
          .eq("aktif", true)
          .range(from, to),
      );
      if (anggotaSumber.length > 0) {
        const { error: upsertError } = await supabase.from("siswa_kelas").upsert(
          anggotaSumber.map((a) => ({
            id_siswa: a.id_siswa,
            id_kelas: idKelasBaru,
            id_tahun_ajaran: idTahunAjaranTujuan,
            aktif: true,
          })),
          { onConflict: "id_siswa,id_tahun_ajaran" },
        );
        if (upsertError) return { success: false, message: upsertError.message };
        jumlahSiswaDipindah += anggotaSumber.length;
      }
    }
  }

  const bagianKelas =
    jumlahKelasDipakaiUlang > 0
      ? `${jumlahKelasDibuat} kelas baru dibuat, ${jumlahKelasDipakaiUlang} kelas sudah ada dipakai ulang`
      : `${jumlahKelasDibuat} kelas berhasil diduplikat`;
  const bagianSiswa = sertakanSiswa ? `, ${jumlahSiswaDipindah} siswa disalin` : "";
  return { success: true, message: `${bagianKelas}${bagianSiswa}.` };
}

export type AnggotaKelasRow = {
  id_siswa_kelas: string;
  id_siswa: string;
  nama_lengkap: string;
  nisn: string | null;
  kelas_dapodik: string | null;
};
export type SiswaRow = {
  id_siswa: string;
  nama_lengkap: string;
  nisn: string | null;
  kelas_dapodik: string | null;
  kelas_lain: string | null;
};

export async function getKelasSiswaData(
  idKelas: string,
  idTahunAjaran: string,
): Promise<{ anggota: AnggotaKelasRow[]; semuaSiswa: SiswaRow[] }> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const [siswaKelasRaw, siswaSemua] = await Promise.all([
    fetchAllRows((from, to) =>
      supabase
        .from("siswa_kelas")
        .select("id_siswa_kelas, id_siswa, id_kelas, siswa(nama_lengkap, nisn, kelas), kelas(nama_kelas)")
        .eq("id_tahun_ajaran", idTahunAjaran)
        .eq("aktif", true)
        .range(from, to),
    ),
    fetchAllRows((from, to) =>
      supabase.from("siswa").select("id_siswa, nama_lengkap, nisn, kelas").eq("aktif", true).order("nama_lengkap").range(from, to),
    ),
  ]);

  const anggota: AnggotaKelasRow[] = (siswaKelasRaw ?? [])
    .filter((a) => a.id_kelas === idKelas)
    .map((a) => {
      const s = a.siswa as unknown as { nama_lengkap: string; nisn: string | null; kelas: string | null } | null;
      return {
        id_siswa_kelas: a.id_siswa_kelas,
        id_siswa: a.id_siswa,
        nama_lengkap: s?.nama_lengkap ?? "-",
        nisn: s?.nisn ?? null,
        kelas_dapodik: s?.kelas ?? null,
      };
    });

  const kelasLainMap = new Map<string, string>();
  for (const a of siswaKelasRaw ?? []) {
    if (a.id_kelas === idKelas) continue;
    const k = a.kelas as unknown as { nama_kelas: string } | null;
    if (k?.nama_kelas) kelasLainMap.set(a.id_siswa, k.nama_kelas);
  }

  const semuaSiswa: SiswaRow[] = (siswaSemua ?? []).map((s) => ({
    id_siswa: s.id_siswa,
    nama_lengkap: s.nama_lengkap,
    nisn: s.nisn,
    kelas_dapodik: s.kelas,
    kelas_lain: kelasLainMap.get(s.id_siswa) ?? null,
  }));

  return { anggota, semuaSiswa };
}

export async function removeSiswaFromKelas(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const idSiswaKelas = String(formData.get("id_siswa_kelas") ?? "");
  if (!idSiswaKelas) return { success: false, message: "Data tidak valid." };

  const { error } = await supabase.from("siswa_kelas").delete().eq("id_siswa_kelas", idSiswaKelas);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Siswa berhasil dikeluarkan dari kelas." };
}
