export type OpsiJawaban = {
  id_opsi?: string;
  label: string;
  isi_opsi: string;
  is_benar: boolean;
  gambar_url: string | null;
};

export type BankSoalRow = {
  id_soal: string;
  pertanyaan: string;
  tipe_soal: "pg" | "essay";
  tingkat_kesulitan: string | null;
  pembahasan: string | null;
  gambar_url: string | null;
  audio_url: string | null;
  id_mapel: string | null;
  mapel_nama: string | null;
  jumlah_opsi: number;
};
