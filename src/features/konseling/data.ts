import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/fetch-all";
import { sapuSesiKedaluwarsa, tutupSesiKedaluwarsaJikaPerlu } from "./auto-close";
import type { KonselingSesiRow, KonselingSesiDetail } from "./types";

type SiswaEmbed = {
  nama_lengkap: string;
  siswa_kelas: { aktif: boolean; kelas: { nama_kelas: string; tingkat: number | null; id_jurusan: string | null } | null }[] | null;
};

function buildKelasLabel(siswa: SiswaEmbed | null) {
  const kelas = siswa?.siswa_kelas?.find((sk) => sk.aktif)?.kelas ?? null;
  if (!kelas) return "-";
  return kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas;
}

function getIdJurusan(siswa: SiswaEmbed | null) {
  return siswa?.siswa_kelas?.find((sk) => sk.aktif)?.kelas?.id_jurusan ?? null;
}

export async function getKonselingSesiList(opts?: { idJurusan?: string }): Promise<KonselingSesiRow[]> {
  const supabase = await createClient();

  await sapuSesiKedaluwarsa(supabase);

  const rows = await fetchAllRows((from, to) =>
    supabase
      .from("konseling_sesi")
      .select(
        "id_sesi, judul, status, tingkat_risiko, started_at, ended_at, siswa(nama_lengkap, siswa_kelas(aktif, kelas(nama_kelas, tingkat, id_jurusan)))",
      )
      .order("started_at", { ascending: false })
      .range(from, to),
  );

  return rows
    .filter((s) => {
      if (!opts?.idJurusan) return true;
      return getIdJurusan(s.siswa as unknown as SiswaEmbed | null) === opts.idJurusan;
    })
    .map((s) => {
      const siswa = s.siswa as unknown as SiswaEmbed | null;
      return {
        id_sesi: s.id_sesi,
        judul: s.judul,
        nama_siswa: siswa?.nama_lengkap ?? "-",
        kelas_label: buildKelasLabel(siswa),
        status: s.status,
        tingkat_risiko: s.tingkat_risiko,
        started_at: s.started_at,
        ended_at: s.ended_at,
      };
    });
}

export async function getKonselingSesiDetail(idSesi: string, opts?: { idJurusan?: string }): Promise<KonselingSesiDetail | null> {
  const supabase = await createClient();

  await tutupSesiKedaluwarsaJikaPerlu(supabase, idSesi);

  const { data: sesi } = await supabase
    .from("konseling_sesi")
    .select(
      "id_sesi, judul, status, ringkasan, tingkat_risiko, indikasi, started_at, ended_at, siswa(nama_lengkap, siswa_kelas(aktif, kelas(nama_kelas, tingkat, id_jurusan)))",
    )
    .eq("id_sesi", idSesi)
    .single();

  if (!sesi) return null;

  const siswa = sesi.siswa as unknown as SiswaEmbed | null;
  if (opts?.idJurusan && getIdJurusan(siswa) !== opts.idJurusan) return null;

  const { data: pesanList } = await supabase
    .from("konseling_pesan")
    .select("id_pesan, pengirim, isi, created_at")
    .eq("id_sesi", idSesi)
    .order("created_at", { ascending: true });

  return {
    id_sesi: sesi.id_sesi,
    judul: sesi.judul,
    nama_siswa: siswa?.nama_lengkap ?? "-",
    kelas_label: buildKelasLabel(siswa),
    status: sesi.status,
    tingkat_risiko: sesi.tingkat_risiko,
    ringkasan: sesi.ringkasan,
    indikasi: sesi.indikasi,
    started_at: sesi.started_at,
    ended_at: sesi.ended_at,
    pesan: (pesanList ?? []).map((p) => ({
      id_pesan: p.id_pesan,
      pengirim: p.pengirim as "siswa" | "ai",
      isi: p.isi,
    })),
  };
}
