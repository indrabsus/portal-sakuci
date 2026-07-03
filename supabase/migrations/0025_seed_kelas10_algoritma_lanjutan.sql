-- ============================================================
-- Seed: Roadmap Kompetensi Kelas X
-- 1 Kompetensi: Algoritma dan Pemrograman Dasar Lanjutan
-- 4 Tes Kompetensi (5 PG 5-opsi + 2 Essay per tes)
-- Jalankan di Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  v_jur uuid;

  k1 uuid; -- kompetensi

  t1 uuid; -- Array dan Struktur Data Dasar
  t2 uuid; -- Fungsi dan Prosedur
  t3 uuid; -- Pemrograman Terstruktur
  t4 uuid; -- Pengantar OOP

  s uuid;  -- soal sementara

BEGIN
  SELECT id_jurusan INTO v_jur
  FROM public.jurusan
  WHERE lower(nama_jurusan) LIKE '%rpl%'
     OR lower(nama_jurusan) LIKE '%pplg%'
     OR lower(kode_jurusan)  LIKE '%rpl%'
     OR lower(kode_jurusan)  LIKE '%pplg%'
  LIMIT 1;

  IF v_jur IS NULL THEN
    RAISE EXCEPTION 'Jurusan PPLG/RPL tidak ditemukan. Buat dulu di menu Jurusan.';
  END IF;

  -- ----------------------------------------------------------
  -- 1. KOMPETENSI (1 sertifikat)
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi
    (id_jurusan, judul, deskripsi, tingkat, urutan, syarat_lulus, aktif)
  VALUES (v_jur,
    'Algoritma dan Pemrograman Dasar Lanjutan',
    'Memperdalam struktur data dasar dan pemrograman terstruktur. Mencakup array, fungsi & prosedur, dekomposisi masalah, dan pengantar konsep OOP.',
    10, 2, 70, true)
  RETURNING id_kompetensi INTO k1;

  -- ----------------------------------------------------------
  -- 2. KOMPETENSI_TUGAS (4 tes)
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Array dan Struktur Data Dasar',
    'Tes pemahaman array satu dimensi, multidimensi, dan operasi pengolahan data.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t1;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Fungsi dan Prosedur',
    'Tes pemahaman fungsi berparameter, return value, scope variabel, dan modularisasi program.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t2;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Pemrograman Terstruktur',
    'Tes kemampuan dekomposisi masalah dan pembuatan pseudocode kompleks.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t3;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Pengantar OOP',
    'Tes pemahaman konsep dasar Object-Oriented Programming: objek, kelas, atribut, dan method.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t4;

  -- ==========================================================
  -- TES 1: ARRAY DAN STRUKTUR DATA DASAR
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Diberikan array: nilai[] = {85, 92, 78, 90, 65}. Berapakah nilai yang tersimpan pada indeks ke-3?',
    'pg', 'mudah',
    'Indeks array dimulai dari 0. Indeks ke-3 adalah elemen keempat, yaitu 90.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','85',false),(s,'B','92',false),(s,'C','78',false),(s,'D','90',true),(s,'E','65',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Untuk menyimpan nilai ujian dari 30 siswa dalam satu variabel, struktur data yang paling tepat digunakan adalah...',
    'pg', 'mudah',
    'Array memungkinkan penyimpanan banyak nilai dengan tipe data yang sama menggunakan satu nama variabel dengan indeks.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','30 variabel integer terpisah (nilai1, nilai2, ... nilai30)',false),
    (s,'B','Satu variabel string panjang yang memuat semua nilai',false),
    (s,'C','Array integer berukuran 30',true),
    (s,'D','Variabel boolean',false),
    (s,'E','Satu variabel float',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Array dua dimensi matriks[4][3] memiliki berapa total elemen?',
    'pg', 'sedang',
    'Total elemen array dua dimensi = jumlah baris × jumlah kolom = 4 × 3 = 12 elemen.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','4',false),(s,'B','3',false),(s,'C','7',false),(s,'D','12',true),(s,'E','16',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perhatikan kode berikut:
int data[] = {10, 20, 30, 40, 50};
int hasil = 0;
for (int i = 0; i < 5; i++) {
    hasil = hasil + data[i];
}
Berapakah nilai variabel "hasil" setelah loop selesai?',
    'pg', 'sedang',
    '10 + 20 + 30 + 40 + 50 = 150. Loop menjumlahkan semua elemen array dari indeks 0 sampai 4.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','50',false),(s,'B','100',false),(s,'C','150',true),(s,'D','200',false),(s,'E','0',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Algoritma pencarian nilai terbesar (maximum) dari array berukuran n yang paling efisien memiliki kompleksitas waktu...',
    'pg', 'sulit',
    'Untuk mencari nilai maksimum, kita harus membandingkan setiap elemen satu per satu (satu kali pass), sehingga kompleksitasnya O(n) — linear.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','O(1) — konstan',false),
    (s,'B','O(log n) — logaritmik',false),
    (s,'C','O(n) — linear',true),
    (s,'D','O(n²) — kuadratik',false),
    (s,'E','O(n log n)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan apa yang dimaksud dengan array dan sebutkan perbedaan antara array satu dimensi dan array dua dimensi! Berikan contoh deklarasi dan penggunaan masing-masing dalam kehidupan nyata!',
    'essay', 'sedang',
    'Jawaban ideal:
Array adalah kumpulan elemen bertipe data sama yang disimpan secara berurutan dengan satu nama variabel dan diakses menggunakan indeks.

Array 1 dimensi: satu baris data. Contoh: int nilai[5] = {80,90,75,85,95} — menyimpan nilai 5 siswa.

Array 2 dimensi: tabel baris dan kolom. Contoh: int absensi[7][5] — menyimpan kehadiran 5 siswa selama 7 hari.

Nilai penuh jika: definisi array benar, perbedaan 1D vs 2D jelas, dan contoh nyata relevan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Tuliskan pseudocode atau kode program untuk:
(a) Mengisi array nilai[5] dengan input dari pengguna.
(b) Mencari dan mencetak nilai tertinggi dan nilai terendah dari array tersebut.',
    'essay', 'sedang',
    'Jawaban ideal:
// Bagian a - Input
FOR i ← 0 TO 4 DO
  INPUT nilai[i]
ENDFOR

// Bagian b - Cari maks & min
SET maks ← nilai[0]
SET min  ← nilai[0]
FOR i ← 1 TO 4 DO
  IF nilai[i] > maks THEN SET maks ← nilai[i] ENDIF
  IF nilai[i] < min  THEN SET min  ← nilai[i] ENDIF
ENDFOR
PRINT "Tertinggi: " + maks
PRINT "Terendah: " + min

Poin: inisialisasi maks/min dari elemen pertama, loop bandingkan, cetak keduanya.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 7, 25);

  -- ==========================================================
  -- TES 2: FUNGSI DAN PROSEDUR
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Apa perbedaan utama antara fungsi (function) dan prosedur (procedure)?',
    'pg', 'mudah',
    'Fungsi selalu mengembalikan sebuah nilai menggunakan return, sedangkan prosedur hanya menjalankan serangkaian instruksi tanpa mengembalikan nilai.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Fungsi tidak bisa dipanggil berkali-kali, prosedur bisa',false),
    (s,'B','Fungsi mengembalikan nilai (return value), prosedur tidak mengembalikan nilai',true),
    (s,'C','Prosedur lebih cepat dieksekusi dibanding fungsi',false),
    (s,'D','Fungsi hanya bisa menerima satu parameter',false),
    (s,'E','Prosedur tidak boleh memiliki parameter',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perhatikan fungsi berikut:
FUNCTION hitungLuas(panjang, lebar)
  RETURN panjang * lebar
ENDFUNCTION

Jika dipanggil dengan hitungLuas(5, 8), nilai yang dikembalikan adalah...',
    'pg', 'mudah',
    '5 × 8 = 40. Fungsi menerima dua parameter dan mengembalikan hasil perkaliannya.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','13',false),(s,'B','58',false),(s,'C','3',false),(s,'D','40',true),(s,'E','85',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Variabel yang dideklarasikan di dalam sebuah fungsi bersifat lokal. Apa artinya?',
    'pg', 'sedang',
    'Variabel lokal hanya eksis dan dapat diakses selama fungsi tersebut sedang dieksekusi. Di luar fungsi, variabel lokal tidak dikenali.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Variabel tersebut bisa diakses dari seluruh bagian program',false),
    (s,'B','Variabel tersebut nilainya tidak bisa diubah',false),
    (s,'C','Variabel tersebut hanya bisa diakses di dalam fungsi tempat ia dideklarasikan',true),
    (s,'D','Variabel tersebut otomatis bernilai 0',false),
    (s,'E','Variabel tersebut tersimpan permanen di memori',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Apa keuntungan utama menggunakan fungsi dalam pemrograman dibandingkan menulis kode yang sama berulang kali?',
    'pg', 'mudah',
    'Fungsi memungkinkan code reuse — kode ditulis sekali lalu dipanggil dari mana saja, membuat program lebih terstruktur dan mudah dirawat.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Program menjadi lebih lambat karena ada overhead pemanggilan',false),
    (s,'B','Kode tidak bisa diubah setelah fungsi didefinisikan',false),
    (s,'C','Kode dapat digunakan ulang (reuse) sehingga program lebih ringkas dan mudah dirawat',true),
    (s,'D','Variabel global tidak lagi diperlukan sama sekali',false),
    (s,'E','Fungsi hanya bisa dipanggil satu kali dalam program',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Fungsi rekursif adalah fungsi yang memanggil dirinya sendiri. Syarat penting yang HARUS ada dalam fungsi rekursif agar tidak terjadi infinite recursion adalah...',
    'pg', 'sedang',
    'Base case (kondisi berhenti) adalah syarat wajib dalam rekursi. Tanpa base case, fungsi akan memanggil dirinya sendiri tanpa henti hingga stack overflow.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Fungsi harus memiliki minimal 2 parameter',false),
    (s,'B','Fungsi tidak boleh menggunakan variabel lokal',false),
    (s,'C','Fungsi harus memiliki return type void',false),
    (s,'D','Harus ada base case (kondisi berhenti) yang menghentikan rekursi',true),
    (s,'E','Fungsi harus dipanggil dari fungsi main saja',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan konsep parameter dan return value dalam sebuah fungsi! Kemudian buatlah pseudocode fungsi untuk menghitung faktorial dari bilangan n (n!) secara iteratif (menggunakan loop, bukan rekursif)!',
    'essay', 'sedang',
    'Jawaban ideal:
Parameter: nilai yang dikirim ke fungsi saat dipanggil (input fungsi).
Return value: nilai yang dikembalikan fungsi ke pemanggil (output fungsi).

FUNCTION faktorial(n)
  SET hasil ← 1
  FOR i ← 1 TO n DO
    SET hasil ← hasil * i
  ENDFOR
  RETURN hasil
ENDFUNCTION

Contoh: faktorial(5) = 1×2×3×4×5 = 120.
Nilai penuh jika: penjelasan parameter & return value benar + pseudocode loop + RETURN.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Program kalkulator sebelumnya ditulis dalam satu blok kode panjang. Refaktorlah program tersebut dengan membuat fungsi terpisah untuk: tambah(a,b), kurang(a,b), kali(a,b), dan bagi(a,b). Tuliskan pseudocode semua fungsi tersebut beserta cara memanggilnya dari program utama!',
    'essay', 'sedang',
    'Jawaban ideal:
FUNCTION tambah(a, b)  RETURN a + b  ENDFUNCTION
FUNCTION kurang(a, b)  RETURN a - b  ENDFUNCTION
FUNCTION kali(a, b)    RETURN a * b  ENDFUNCTION
FUNCTION bagi(a, b)
  IF b ≠ 0 THEN RETURN a / b
  ELSE PRINT "Error: pembagi tidak boleh 0"
  ENDIF
ENDFUNCTION

// Program utama
INPUT x, y, operasi
IF operasi = "+" THEN PRINT tambah(x, y)
ELSE IF operasi = "-" THEN PRINT kurang(x, y) ... dst

Nilai penuh: 4 fungsi dengan parameter & return benar + penanganan bagi dengan 0.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 7, 25);

  -- ==========================================================
  -- TES 3: PEMROGRAMAN TERSTRUKTUR
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dekomposisi masalah dalam pemrograman terstruktur berarti...',
    'pg', 'mudah',
    'Dekomposisi adalah teknik memecah masalah besar menjadi sub-masalah yang lebih kecil dan lebih mudah diselesaikan secara terpisah.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Menghapus bagian kode yang tidak diperlukan',false),
    (s,'B','Memecah masalah besar menjadi sub-masalah yang lebih kecil dan mudah diselesaikan',true),
    (s,'C','Mengkompilasi program menjadi bahasa mesin',false),
    (s,'D','Menggabungkan beberapa program menjadi satu',false),
    (s,'E','Mengulang eksekusi program dari awal',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Program sistem antrian sederhana (antrian di klinik) perlu mengelola data pasien. Struktur data yang paling tepat untuk memodelkan antrian tersebut adalah...',
    'pg', 'sedang',
    'Queue (antrian) mengikuti prinsip FIFO (First In First Out) — pasien yang datang pertama dilayani pertama, sesuai konsep antrian nyata.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Stack (tumpukan) karena data ditumpuk dari atas',false),
    (s,'B','Array acak tanpa urutan',false),
    (s,'C','Queue (antrian) karena menggunakan prinsip FIFO — yang pertama masuk pertama dilayani',true),
    (s,'D','Binary Tree karena data pasien kompleks',false),
    (s,'E','Hash Table untuk pencarian cepat',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam pemrograman terstruktur, urutan tiga struktur kontrol dasar yang membentuk fondasi semua program adalah...',
    'pg', 'sedang',
    'Teorema Böhm-Jacopini: setiap program dapat dibangun dari tiga struktur: Sequence (urutan), Selection (percabangan), dan Iteration (perulangan).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Deklarasi, Inisialisasi, Terminasi',false),
    (s,'B','Input, Proses, Output',false),
    (s,'C','Sequence (urutan), Selection (percabangan), Iteration (perulangan)',true),
    (s,'D','Compile, Link, Execute',false),
    (s,'E','Variabel, Fungsi, Kelas',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Top-down design dalam pemrograman terstruktur adalah pendekatan di mana...',
    'pg', 'mudah',
    'Top-down dimulai dari masalah umum/besar di atas, lalu dipecah bertahap menjadi bagian yang lebih detail dan spesifik ke bawah.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Dimulai dari fungsi-fungsi kecil lalu digabung menjadi program besar',false),
    (s,'B','Dimulai dari masalah umum lalu dipecah secara bertahap menjadi bagian yang lebih detail',true),
    (s,'C','Dimulai dari penulisan kode tanpa perencanaan terlebih dahulu',false),
    (s,'D','Dimulai dari desain database lalu naik ke antarmuka pengguna',false),
    (s,'E','Dimulai dari pengujian lalu mundur ke implementasi',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Pseudocode berikut merepresentasikan sistem antrian klinik. Jika ada 3 pasien (A, B, C) mendaftar berurutan, lalu 2 pasien dipanggil, siapa yang masih menunggu?
ENQUEUE(A); ENQUEUE(B); ENQUEUE(C)
DEQUEUE(); DEQUEUE()',
    'pg', 'sulit',
    'Queue bersifat FIFO. A masuk pertama → A keluar pertama. B masuk kedua → B keluar kedua. Yang tersisa adalah C.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','A',false),
    (s,'B','B',false),
    (s,'C','C',true),
    (s,'D','A dan B',false),
    (s,'E','Antrian kosong',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Sebuah sistem informasi sekolah perlu dibuat. Gunakan teknik dekomposisi untuk memecah sistem tersebut menjadi modul-modul utama! Jelaskan fungsi setiap modul dan bagaimana modul-modul tersebut saling berhubungan!',
    'essay', 'sedang',
    'Jawaban ideal (contoh dekomposisi):
Sistem Informasi Sekolah:
1. Modul Manajemen Siswa → input/edit/hapus data siswa
2. Modul Manajemen Guru → data guru dan mata pelajaran
3. Modul Nilai → input nilai, hitung rata-rata, cetak rapor
4. Modul Absensi → catat kehadiran siswa per hari
5. Modul Laporan → rekap nilai, absensi, cetak laporan

Hubungan: Modul Nilai membutuhkan data dari Modul Siswa dan Guru. Modul Laporan mengambil data dari semua modul lain.

Nilai penuh: minimal 4 modul dengan fungsi jelas + relasi antar modul dijelaskan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Tuliskan pseudocode kompleks untuk sistem antrian klinik sederhana dengan fitur:
(a) Mendaftarkan pasien baru ke antrian (tambah ke belakang)
(b) Memanggil pasien berikutnya (ambil dari depan)
(c) Menampilkan semua pasien yang masih menunggu',
    'essay', 'sulit',
    'Jawaban ideal:
SET antrian[] // array kosong
SET depan ← 0; belakang ← 0

PROCEDURE daftarPasien(nama)
  SET antrian[belakang] ← nama
  SET belakang ← belakang + 1
  PRINT nama + " berhasil didaftarkan. Nomor antrian: " + belakang
ENDPROCEDURE

PROCEDURE panggilPasien()
  IF depan < belakang THEN
    PRINT "Memanggil: " + antrian[depan]
    SET depan ← depan + 1
  ELSE
    PRINT "Antrian kosong"
  ENDIF
ENDPROCEDURE

PROCEDURE lihatAntrian()
  IF depan = belakang THEN PRINT "Tidak ada pasien menunggu"
  ELSE
    FOR i ← depan TO belakang-1 DO
      PRINT (i - depan + 1) + ". " + antrian[i]
    ENDFOR
  ENDIF
ENDPROCEDURE')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 7, 25);

  -- ==========================================================
  -- TES 4: PENGANTAR OOP
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam konsep OOP, perbedaan antara "kelas" (class) dan "objek" (object) adalah...',
    'pg', 'mudah',
    'Kelas adalah cetak biru/template (definisi), sedangkan objek adalah wujud nyata (instance) yang dibuat dari kelas tersebut. Analogi: kelas = resep kue, objek = kue yang sudah jadi.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Kelas dan objek adalah hal yang sama persis',false),
    (s,'B','Kelas adalah cetak biru/template; objek adalah instance nyata yang dibuat dari kelas',true),
    (s,'C','Objek adalah template; kelas adalah instance yang dibuat dari objek',false),
    (s,'D','Kelas hanya bisa memiliki satu objek',false),
    (s,'E','Objek tidak memiliki atribut, hanya kelas yang punya',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam sistem perpustakaan, manakah yang paling tepat diidentifikasi sebagai sebuah KELAS?',
    'pg', 'mudah',
    '"Buku" adalah kelas karena merupakan kategori umum dengan atribut (judul, penulis, ISBN) dan method (pinjam, kembalikan). "Laskar Pelangi" adalah objek/instance dari kelas Buku.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','"Laskar Pelangi" — novel karya Andrea Hirata',false),
    (s,'B','"Ahmad Fulan" — anggota perpustakaan tertentu',false),
    (s,'C','"Rak A1" — lokasi penyimpanan spesifik',false),
    (s,'D','"Buku" — kategori dengan atribut judul, penulis, ISBN, dan method pinjam/kembalikan',true),
    (s,'E','"2024-01-15" — tanggal peminjaman tertentu',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Atribut dalam sebuah kelas OOP setara dengan konsep apa dalam pemrograman prosedural?',
    'pg', 'sedang',
    'Atribut kelas adalah data/properti yang dimiliki objek, setara dengan variabel dalam pemrograman prosedural.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Fungsi / prosedur',false),
    (s,'B','Tipe data primitif saja',false),
    (s,'C','Variabel yang menyimpan data',true),
    (s,'D','Perintah kondisional (if-else)',false),
    (s,'E','Perulangan (loop)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Empat pilar utama OOP adalah Enkapsulasi, Inheritance (Pewarisan), Polimorfisme, dan Abstraksi. Konsep "menyembunyikan detail implementasi dan hanya menampilkan antarmuka yang diperlukan" disebut...',
    'pg', 'sedang',
    'Enkapsulasi adalah menyembunyikan data internal dan hanya mengekspos method yang diperlukan melalui access modifier (public/private). Abstraksi adalah menyembunyikan kompleksitas dan hanya menampilkan fungsi esensial.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Inheritance — mewarisi sifat kelas induk',false),
    (s,'B','Polimorfisme — satu method berbeda perilaku',false),
    (s,'C','Enkapsulasi — membungkus data dan method, menyembunyikan detail internal',true),
    (s,'D','Kompilasi — mengubah kode ke bahasa mesin',false),
    (s,'E','Instansiasi — membuat objek dari kelas',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Di sebuah sistem sekolah terdapat: Siswa (nama, NISN, kelas, nilai[]), Guru (nama, NIP, mapel), dan Staf (nama, NIP, jabatan). Ketiga entitas tersebut memiliki atribut "nama" yang sama. Dalam OOP, cara terbaik memodelkan ini adalah...',
    'pg', 'sulit',
    'Inheritance tepat digunakan: buat kelas induk "Orang" dengan atribut nama, lalu Siswa/Guru/Staf mewarisi kelas Orang dan menambahkan atribut spesifik masing-masing.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Buat tiga kelas terpisah tanpa hubungan apapun',false),
    (s,'B','Buat satu kelas besar yang memuat semua atribut ketiga entitas',false),
    (s,'C','Buat kelas induk "Orang" dengan atribut nama, lalu Siswa/Guru/Staf mewarisi kelas Orang',true),
    (s,'D','Gunakan array untuk menyimpan semua data tanpa kelas',false),
    (s,'E','Buat fungsi terpisah untuk setiap entitas tanpa menggunakan kelas',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Identifikasi minimal 3 objek dari sistem informasi sekolah! Untuk setiap objek, sebutkan:
(a) Nama kelasnya
(b) Minimal 3 atribut yang dimiliki
(c) Minimal 2 method (perilaku/aksi) yang dapat dilakukan',
    'essay', 'sedang',
    'Jawaban ideal (contoh):

Kelas: Siswa
Atribut: nama, nisn, tanggalLahir, kelas, nilaiRata
Method: daftar(), lihatNilai(), cetakRapor()

Kelas: Guru
Atribut: nama, nip, mataPelajaran, email
Method: inputNilai(), absenSiswa(), buatSoal()

Kelas: Buku (Perpustakaan)
Atribut: judul, penulis, isbn, stok
Method: pinjam(), kembalikan(), cekKetersediaan()

Nilai penuh: 3 kelas lengkap dengan nama kelas + min 3 atribut + min 2 method yang logis.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan dengan kata-katamu sendiri apa yang dimaksud dengan INHERITANCE (pewarisan) dalam OOP! Kemudian berikan contoh nyata dari kehidupan sehari-hari yang menggambarkan konsep pewarisan tersebut, dan modelkan dalam bentuk diagram kelas sederhana (boleh dalam teks/deskripsi)!',
    'essay', 'sedang',
    'Jawaban ideal:
Inheritance adalah mekanisme di mana sebuah kelas (child/subclass) mewarisi atribut dan method dari kelas lain (parent/superclass), sehingga tidak perlu menulis ulang kode yang sama.

Contoh nyata:
Parent class: Kendaraan (atribut: merk, warna, kecepatan; method: jalan(), berhenti())
Child class 1: Mobil (mewarisi semua + atribut: jumlahPintu; method: pasangAC())
Child class 2: Motor (mewarisi semua + atribut: jenisStang; method: wheelie())
Child class 3: Truk (mewarisi semua + atribut: kapasitasMuatan; method: muat())

Keuntungan: kode reuse — Mobil tidak perlu mendefinisikan ulang method jalan() dan berhenti().

Nilai penuh: definisi inheritance benar + contoh hirarki parent-child yang logis + menyebut keuntungan reuse.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 7, 25);

  RAISE NOTICE 'Seed berhasil: 1 kompetensi "Algoritma dan Pemrograman Dasar Lanjutan", 4 tes, 28 soal (20 PG 5-opsi + 8 essay).';
END $$;
