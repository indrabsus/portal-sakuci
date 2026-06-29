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

  // Nonaktifkan penempatan lama siswa ini di tahun ajaran yang sama (kalau ada), lalu tambahkan ke kelas baru
  await supabase
    .from("siswa_kelas")
    .update({ aktif: false })
    .eq("id_siswa", idSiswa)
    .eq("id_tahun_ajaran", idTahunAjaran);

  const { error } = await supabase.from("siswa_kelas").insert({
    id_siswa: idSiswa,
    id_kelas: idKelas,
    id_tahun_ajaran: idTahunAjaran || null,
    aktif: true,
  });
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

  await supabase
    .from("siswa_kelas")
    .update({ aktif: false })
    .in("id_siswa", idSiswaList)
    .eq("id_tahun_ajaran", idTahunAjaran);

  const { error } = await supabase.from("siswa_kelas").insert(
    idSiswaList.map((idSiswa) => ({
      id_siswa: idSiswa,
      id_kelas: idKelas,
      id_tahun_ajaran: idTahunAjaran || null,
      aktif: true,
    })),
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

export type AnggotaKelasRow = {
  id_siswa_kelas: string;
  id_siswa: string;
  nama_lengkap: string;
  nisn: string | null;
  kelas_dapodik: string | null;
};
export type SiswaRow = { id_siswa: string; nama_lengkap: string; nisn: string | null; kelas_dapodik: string | null };

export async function getKelasSiswaData(
  idKelas: string,
): Promise<{ anggota: AnggotaKelasRow[]; semuaSiswa: SiswaRow[] }> {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const [anggotaRaw, siswaSemua] = await Promise.all([
    fetchAllRows((from, to) =>
      supabase
        .from("siswa_kelas")
        .select("id_siswa_kelas, id_siswa, siswa(nama_lengkap, nisn, kelas)")
        .eq("id_kelas", idKelas)
        .eq("aktif", true)
        .range(from, to),
    ),
    fetchAllRows((from, to) =>
      supabase.from("siswa").select("id_siswa, nama_lengkap, nisn, kelas").eq("aktif", true).order("nama_lengkap").range(from, to),
    ),
  ]);

  const anggota: AnggotaKelasRow[] = (anggotaRaw ?? []).map((a) => {
    const s = a.siswa as unknown as { nama_lengkap: string; nisn: string | null; kelas: string | null } | null;
    return {
      id_siswa_kelas: a.id_siswa_kelas,
      id_siswa: a.id_siswa,
      nama_lengkap: s?.nama_lengkap ?? "-",
      nisn: s?.nisn ?? null,
      kelas_dapodik: s?.kelas ?? null,
    };
  });

  const semuaSiswa: SiswaRow[] = (siswaSemua ?? []).map((s) => ({
    id_siswa: s.id_siswa,
    nama_lengkap: s.nama_lengkap,
    nisn: s.nisn,
    kelas_dapodik: s.kelas,
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
