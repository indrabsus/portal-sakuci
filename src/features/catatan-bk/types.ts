export type CatatanBkRow = {
  id_catatan: string;
  id_siswa: string;
  tanggal: string;
  permasalahan: string;
  tindakan: string;
  kesepakatan: string | null;
  catatan_tambahan: string | null;
  nama_koordinator_bk: string | null;
  nip_koordinator_bk: string | null;
  nama_siswa: string;
  kelas_label: string;
  nisn: string | null;
  created_at: string;
};

export type SiswaOption = {
  id_siswa: string;
  nama_lengkap: string;
  nisn: string | null;
  kelas_label: string;
};

export type SiswaCatatanSummary = {
  id_siswa: string;
  nama_lengkap: string;
  nisn: string | null;
  kelas_label: string;
  jumlah_catatan: number;
};

export type TingkatPerhatian = "aman" | "perhatian" | "waspada" | "kritis";
