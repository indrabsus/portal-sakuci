export type KonselingSesiRow = {
  id_sesi: string;
  judul: string | null;
  nama_siswa: string;
  kelas_label: string;
  status: string;
  tingkat_risiko: "rendah" | "sedang" | "tinggi" | null;
  started_at: string;
  ended_at: string | null;
};

export type KonselingPesanRow = {
  id_pesan: string;
  pengirim: "siswa" | "ai";
  isi: string;
};

export type KonselingSesiDetail = {
  id_sesi: string;
  judul: string | null;
  nama_siswa: string;
  kelas_label: string;
  status: string;
  tingkat_risiko: "rendah" | "sedang" | "tinggi" | null;
  ringkasan: string | null;
  indikasi: string | null;
  started_at: string;
  ended_at: string | null;
  pesan: KonselingPesanRow[];
};
