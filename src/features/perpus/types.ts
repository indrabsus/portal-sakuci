export type BukuRow = {
  id_buku: string;
  judul: string;
  pengarang: string | null;
  penerbit: string | null;
  tahun_terbit: number | null;
  isbn: string | null;
  kategori: string | null;
  lokasi_lemari: string | null;
  stok: number;
  dipinjam: number;
};

export type PeminjamanRow = {
  id_peminjaman: string;
  id_buku: string;
  judul_buku: string;
  lokasi_lemari: string | null;
  id_siswa: string;
  nama_siswa: string;
  kelas_label: string;
  nisn: string | null;
  tanggal_pinjam: string;
  tanggal_kembali_rencana: string;
  tanggal_kembali_aktual: string | null;
  status: "dipinjam" | "dikembalikan" | "terlambat";
  catatan: string | null;
};

export type SiswaOption = {
  id_siswa: string;
  nama_lengkap: string;
  nisn: string | null;
  kelas_label: string;
};
