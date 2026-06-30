import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/fetch-all";
import type { BukuRow, PeminjamanRow, SiswaOption } from "./types";

export async function getBukuList(): Promise<BukuRow[]> {
  const supabase = await createClient();

  const [bukuRows, { data: peminjamanRows }] = await Promise.all([
    fetchAllRows((from, to) =>
      supabase
        .from("buku")
        .select("id_buku, judul, pengarang, penerbit, tahun_terbit, isbn, kategori, lokasi_lemari, stok")
        .order("judul", { ascending: true })
        .range(from, to),
    ),
    supabase
      .from("peminjaman_buku")
      .select("id_buku")
      .eq("status", "dipinjam"),
  ]);

  const dipinjamMap: Record<string, number> = {};
  for (const p of peminjamanRows ?? []) {
    dipinjamMap[p.id_buku] = (dipinjamMap[p.id_buku] ?? 0) + 1;
  }

  return bukuRows.map((b) => ({
    id_buku: b.id_buku,
    judul: b.judul,
    pengarang: b.pengarang ?? null,
    penerbit: b.penerbit ?? null,
    tahun_terbit: b.tahun_terbit ?? null,
    isbn: b.isbn ?? null,
    kategori: b.kategori ?? null,
    lokasi_lemari: b.lokasi_lemari ?? null,
    stok: b.stok,
    dipinjam: dipinjamMap[b.id_buku] ?? 0,
  }));
}

export async function getPeminjamanList(): Promise<PeminjamanRow[]> {
  const supabase = await createClient();

  type SiswaEmbed = {
    nama_lengkap: string;
    nisn: string | null;
    siswa_kelas: { aktif: boolean; kelas: { nama_kelas: string; tingkat: number | null } | null }[] | null;
  };
  type BukuEmbed = { judul: string; lokasi_lemari: string | null };

  const rows = await fetchAllRows((from, to) =>
    supabase
      .from("peminjaman_buku")
      .select(
        "id_peminjaman, id_buku, id_siswa, tanggal_pinjam, tanggal_kembali_rencana, tanggal_kembali_aktual, status, catatan, buku(judul, lokasi_lemari), siswa(nama_lengkap, nisn, siswa_kelas(aktif, kelas(nama_kelas, tingkat)))",
      )
      .order("tanggal_pinjam", { ascending: false })
      .range(from, to),
  );

  return rows.map((r) => {
    const siswa = r.siswa as unknown as SiswaEmbed | null;
    const buku = r.buku as unknown as BukuEmbed | null;
    const kelas = siswa?.siswa_kelas?.find((sk) => sk.aktif)?.kelas ?? null;
    const kelas_label = kelas ? (kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas) : "-";
    return {
      id_peminjaman: r.id_peminjaman,
      id_buku: r.id_buku,
      judul_buku: buku?.judul ?? "-",
      lokasi_lemari: buku?.lokasi_lemari ?? null,
      id_siswa: r.id_siswa,
      nama_siswa: siswa?.nama_lengkap ?? "-",
      kelas_label,
      nisn: siswa?.nisn ?? null,
      tanggal_pinjam: r.tanggal_pinjam,
      tanggal_kembali_rencana: r.tanggal_kembali_rencana,
      tanggal_kembali_aktual: r.tanggal_kembali_aktual ?? null,
      status: r.status as "dipinjam" | "dikembalikan" | "terlambat",
      catatan: r.catatan ?? null,
    };
  });
}

export async function getSiswaOptions(): Promise<SiswaOption[]> {
  const supabase = await createClient();
  const rows = await fetchAllRows((from, to) =>
    supabase
      .from("siswa")
      .select("id_siswa, nama_lengkap, nisn, siswa_kelas(aktif, kelas(nama_kelas, tingkat))")
      .order("nama_lengkap", { ascending: true })
      .range(from, to),
  );
  return rows.map((r) => {
    const siswaKelas = r.siswa_kelas as unknown as { aktif: boolean; kelas: { nama_kelas: string; tingkat: number | null } | null }[] | null;
    const kelas = siswaKelas?.find((sk) => sk.aktif)?.kelas ?? null;
    const kelas_label = kelas ? (kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas) : "-";
    return { id_siswa: r.id_siswa, nama_lengkap: r.nama_lengkap, nisn: r.nisn ?? null, kelas_label };
  });
}

export async function getDashboardStats() {
  const supabase = await createClient();
  const [{ count: totalBuku }, { count: totalDipinjam }, { count: totalTerlambat }] = await Promise.all([
    supabase.from("buku").select("*", { count: "exact", head: true }),
    supabase.from("peminjaman_buku").select("*", { count: "exact", head: true }).eq("status", "dipinjam"),
    supabase.from("peminjaman_buku").select("*", { count: "exact", head: true }).eq("status", "terlambat"),
  ]);
  return {
    totalBuku: totalBuku ?? 0,
    totalDipinjam: totalDipinjam ?? 0,
    totalTerlambat: totalTerlambat ?? 0,
  };
}
