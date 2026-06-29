export type OpsiJawabanKompetensi = {
  id_opsi_kompetensi?: string;
  label: string;
  isi_opsi: string;
  is_benar: boolean;
  gambar_url: string | null;
};

export type SoalKompetensiRow = {
  id_soal_kompetensi: string;
  pertanyaan: string;
  tipe_soal: "pg" | "essay";
  tingkat_kesulitan: string | null;
  pembahasan: string | null;
  gambar_url: string | null;
  file_url: string | null;
  id_jurusan: string | null;
  jurusan_nama: string | null;
};
