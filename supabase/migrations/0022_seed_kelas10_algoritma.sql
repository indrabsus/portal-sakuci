-- ============================================================
-- Seed: Roadmap Kompetensi Kelas X
-- 1 Kompetensi: Algoritma dan Pemrograman Dasar
-- 5 Tes Kompetensi di dalamnya (PG + Essay per tes)
-- Jalankan di Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  v_jur uuid;

  -- 1 kompetensi saja
  k1 uuid;

  -- 5 tes kompetensi (kompetensi_tugas)
  t1 uuid; -- Konsep Algoritma
  t2 uuid; -- Flowchart
  t3 uuid; -- Pseudocode
  t4 uuid; -- Dasar Bahasa Pemrograman
  t5 uuid; -- Struktur Kontrol

  -- soal id sementara
  s uuid;

BEGIN
  -- ----------------------------------------------------------
  -- Ambil id_jurusan PPLG / RPL
  -- ----------------------------------------------------------
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
  -- 1. INSERT 1 KOMPETENSI (untuk sertifikat)
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi
    (id_jurusan, judul, deskripsi, tingkat, urutan, syarat_lulus, aktif)
  VALUES
    (v_jur,
     'Algoritma dan Pemrograman Dasar',
     'Membangun nalar logika sebagai fondasi sebelum menulis kode. Mencakup konsep algoritma, flowchart, pseudocode, dasar bahasa pemrograman, dan struktur kontrol.',
     10, 1, 70, true)
  RETURNING id_kompetensi INTO k1;

  -- ----------------------------------------------------------
  -- 2. INSERT 5 KOMPETENSI_TUGAS (tes dalam kompetensi ini)
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Konsep Algoritma',
    'Tes pemahaman pengertian, ciri-ciri, dan penyusunan algoritma.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t1;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Flowchart',
    'Tes kemampuan membaca dan membuat flowchart dengan simbol standar.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t2;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Pseudocode',
    'Tes kemampuan menulis dan membaca pseudocode terstruktur.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t3;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Dasar Bahasa Pemrograman',
    'Tes pemahaman variabel, tipe data, dan operator dalam bahasa pemrograman.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t4;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Struktur Kontrol',
    'Tes kemampuan menggunakan percabangan dan perulangan dalam program.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t5;

  -- ==========================================================
  -- 3. SOAL — TES KONSEP ALGORITMA (t1)
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Manakah yang BUKAN merupakan ciri-ciri algoritma yang baik?',
    'pg', 'mudah',
    'Algoritma yang baik harus jelas (tidak ambigu), terbatas langkahnya, dan menghasilkan output. Berjalan tanpa batas waktu bukan ciri algoritma yang baik.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Setiap langkah memiliki instruksi yang jelas dan tidak ambigu',false),
    (s,'B','Menghasilkan output yang benar untuk setiap input yang valid',false),
    (s,'C','Harus berjalan tanpa batas waktu agar hasil selalu akurat',true),
    (s,'D','Dapat diselesaikan dalam jumlah langkah yang terbatas',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Urutan langkah yang benar dalam sebuah algoritma untuk menghitung luas persegi panjang adalah...',
    'pg', 'mudah',
    'Alur logis algoritma selalu: Input (terima data) → Proses (olah data) → Output (tampilkan hasil).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Proses → Input → Output',false),
    (s,'B','Output → Input → Proses',false),
    (s,'C','Input → Proses → Output',true),
    (s,'D','Input → Output → Proses',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dedi ingin membuat algoritma menghitung kembalian uang. Langkah pertama yang paling tepat adalah...',
    'pg', 'mudah',
    'Setiap algoritma dimulai dengan menerima input yang dibutuhkan sebelum melakukan proses apapun.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Cetak jumlah kembalian',false),
    (s,'B','Kurangi harga dari uang bayar',false),
    (s,'C','Tampilkan pesan terima kasih',false),
    (s,'D','Baca harga barang dan jumlah uang yang dibayarkan',true);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Sifat algoritma yang menyatakan bahwa algoritma harus berhenti setelah sejumlah langkah tertentu disebut...',
    'pg', 'sedang',
    'Finiteness (keterbatasan) adalah sifat algoritma yang mengharuskan algoritma berhenti setelah langkah yang terbatas.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Definiteness (kepastian)',false),
    (s,'B','Effectiveness (efektivitas)',false),
    (s,'C','Finiteness (keterbatasan)',true),
    (s,'D','Input (masukan)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Sebuah algoritma memiliki 2 input (panjang dan lebar) dan menghasilkan 1 output (luas). Pernyataan yang BENAR tentang algoritma ini adalah...',
    'pg', 'mudah',
    'Algoritma yang memiliki input, proses, dan output yang terdefinisi jelas adalah algoritma yang valid.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Tidak valid karena output lebih sedikit dari input',false),
    (s,'B','Valid, karena memiliki input, proses, dan output yang terdefinisi',true),
    (s,'C','Tidak valid karena algoritma tidak boleh memiliki lebih dari 1 input',false),
    (s,'D','Tidak valid karena output harus sama banyak dengan input',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan apa yang dimaksud dengan algoritma dan sebutkan minimal 4 ciri-ciri algoritma yang baik beserta penjelasan singkatnya!',
    'essay', 'sedang',
    'Jawaban ideal: Algoritma adalah urutan langkah-langkah logis untuk menyelesaikan suatu masalah. Ciri-ciri: (1) Input — nol atau lebih masukan; (2) Output — minimal satu keluaran; (3) Definiteness — setiap langkah jelas; (4) Finiteness — berhenti setelah langkah terbatas; (5) Effectiveness — setiap langkah dapat dikerjakan dengan benar.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Tuliskan algoritma dalam bentuk langkah bernomor untuk menentukan apakah sebuah bilangan yang diinputkan pengguna adalah bilangan GENAP atau GANJIL!',
    'essay', 'mudah',
    'Jawaban ideal: 1. Mulai. 2. Baca bilangan N. 3. Hitung sisa bagi N dengan 2 (N mod 2). 4. Jika sisa = 0 → tampilkan "GENAP". 5. Jika sisa ≠ 0 → tampilkan "GANJIL". 6. Selesai.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 7, 25);

  -- ==========================================================
  -- 4. SOAL — TES FLOWCHART (t2)
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Simbol belah ketupat (diamond) pada flowchart digunakan untuk melambangkan...',
    'pg', 'mudah',
    'Simbol diamond adalah simbol Decision (keputusan) yang merepresentasikan percabangan berdasarkan kondisi ya/tidak.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Awal atau akhir program',false),
    (s,'B','Proses atau operasi',false),
    (s,'C','Input atau output data',false),
    (s,'D','Kondisi atau keputusan (decision)',true);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Simbol oval atau elips pada flowchart digunakan untuk...',
    'pg', 'mudah',
    'Simbol oval/elips adalah Terminator yang menandai titik awal (Start) dan akhir (End) program.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Menyimpan data ke memori',false),
    (s,'B','Awal atau akhir program (terminator)',true),
    (s,'C','Menghubungkan dua bagian flowchart di halaman berbeda',false),
    (s,'D','Proses perhitungan matematika',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Simbol jajar genjang (parallelogram) pada flowchart digunakan untuk...',
    'pg', 'mudah',
    'Jajar genjang merepresentasikan operasi Input (membaca data) atau Output (menampilkan data).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Percabangan logika',false),
    (s,'B','Awal atau akhir program',false),
    (s,'C','Operasi input atau output',true),
    (s,'D','Memanggil subroutine/prosedur',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Pada flowchart, simbol persegi panjang (rectangle) digunakan untuk...',
    'pg', 'mudah',
    'Persegi panjang adalah simbol Process yang merepresentasikan langkah pemrosesan atau perhitungan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Keputusan atau percabangan kondisi',false),
    (s,'B','Proses atau operasi (perhitungan, penugasan)',true),
    (s,'C','Input data dari pengguna',false),
    (s,'D','Titik awal program',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Flowchart program kalkulator sederhana (input A dan B, hitung A+B, tampilkan hasil) membutuhkan berapa simbol minimal (tidak termasuk panah)?',
    'pg', 'sedang',
    'Simbol: (1) Start → (2) Input A,B → (3) Hitung A+B → (4) Output hasil → (5) End. Total = 5 simbol.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','3 simbol',false),
    (s,'B','4 simbol',false),
    (s,'C','5 simbol',true),
    (s,'D','7 simbol',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Sebutkan dan jelaskan minimal 4 simbol flowchart yang kamu ketahui beserta fungsinya masing-masing!',
    'essay', 'mudah',
    'Jawaban ideal: (1) Oval/Elips = Terminator (Start/End); (2) Jajar Genjang = Input/Output; (3) Persegi Panjang = Proses; (4) Belah Ketupat = Decision/percabangan; (5) Panah = Alur proses. Nilai penuh jika minimal 4 benar.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Deskripsikan dalam teks alur flowchart untuk program yang meminta pengguna memasukkan nilai ujian (0–100), lalu mencetak "LULUS" jika nilai ≥ 75, dan "TIDAK LULUS" jika sebaliknya!',
    'essay', 'sedang',
    'Jawaban ideal: Start → Input Nilai → [Decision: Nilai ≥ 75?] → YA: Output "LULUS" → End; TIDAK: Output "TIDAK LULUS" → End. Perlu ada: Start, Input, Decision (2 cabang), 2 Output berbeda, End.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 7, 25);

  -- ==========================================================
  -- 5. SOAL — TES PSEUDOCODE (t3)
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Pseudocode berikut menghasilkan output apa?
SET x ← 10
IF x > 5 THEN
  PRINT "Besar"
ELSE
  PRINT "Kecil"
ENDIF',
    'pg', 'mudah',
    'x = 10 dan 10 > 5 bernilai TRUE, maka blok IF dieksekusi dan output adalah "Besar".')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Kecil',false),
    (s,'B','Besar',true),
    (s,'C','Error karena sintaks salah',false),
    (s,'D','Tidak ada output',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Pseudocode berikut mencetak berapa baris output?
FOR i ← 1 TO 5 DO
  PRINT i
ENDFOR',
    'pg', 'mudah',
    'Loop berjalan dari i=1 hingga i=5, tiap iterasi cetak 1 baris. Total = 5 baris.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','4 baris',false),
    (s,'B','5 baris',true),
    (s,'C','6 baris',false),
    (s,'D','1 baris',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Pseudocode berikut menghitung apa?
SET total ← 0
FOR i ← 1 TO 10 DO
  SET total ← total + i
ENDFOR
PRINT total',
    'pg', 'sedang',
    'Program menjumlahkan 1+2+...+10 = 55.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Rata-rata bilangan 1 sampai 10',false),
    (s,'B','Nilai terbesar dari 1 sampai 10',false),
    (s,'C','Jumlah bilangan 1 sampai 10 (hasilnya 55)',true),
    (s,'D','Jumlah bilangan genap dari 1 sampai 10',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Manakah pseudocode yang benar untuk mencari nilai MAKSIMUM dari dua bilangan A dan B?',
    'pg', 'sedang',
    'Jika A > B maka maks = A, selain itu maks = B.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','IF A < B THEN maks ← A ELSE maks ← B',false),
    (s,'B','IF A > B THEN maks ← A ELSE maks ← B',true),
    (s,'C','IF A = B THEN maks ← A ELSE maks ← 0',false),
    (s,'D','maks ← A + B',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam pseudocode terstruktur, kata kunci ENDWHILE digunakan untuk...',
    'pg', 'mudah',
    'ENDWHILE menandai akhir blok perulangan WHILE...DO...ENDWHILE.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Mengakhiri seluruh program',false),
    (s,'B','Menutup blok percabangan IF',false),
    (s,'C','Menutup blok perulangan WHILE',true),
    (s,'D','Mendeklarasikan akhir sebuah fungsi',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Tuliskan pseudocode untuk program yang membaca 5 nilai ujian dari pengguna satu per satu, kemudian menghitung dan mencetak nilai rata-ratanya!',
    'essay', 'sedang',
    'Jawaban ideal:
START
SET total ← 0
FOR i ← 1 TO 5 DO
  INPUT nilai
  SET total ← total + nilai
ENDFOR
SET rata ← total / 5
PRINT "Nilai rata-rata: " + rata
END')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Tuliskan pseudocode untuk mencari nilai TERBESAR dari 3 bilangan yang diinputkan pengguna (A, B, dan C)!',
    'essay', 'sedang',
    'Jawaban ideal:
START
INPUT A, B, C
SET maks ← A
IF B > maks THEN SET maks ← B ENDIF
IF C > maks THEN SET maks ← C ENDIF
PRINT "Nilai terbesar: " + maks
END')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 7, 25);

  -- ==========================================================
  -- 6. SOAL — TES DASAR BAHASA PEMROGRAMAN (t4)
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Tipe data yang paling tepat untuk menyimpan nilai rata-rata ujian (misalnya 87.5) adalah...',
    'pg', 'mudah',
    'Nilai desimal membutuhkan tipe float/double. Integer hanya menyimpan bilangan bulat.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','integer (int)',false),
    (s,'B','boolean',false),
    (s,'C','float / double',true),
    (s,'D','char',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Apa hasil dari ekspresi: 17 % 5 dalam bahasa pemrograman?',
    'pg', 'sedang',
    'Operator % adalah modulo (sisa bagi). 17 ÷ 5 = 3 sisa 2. Jadi hasilnya 2.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','3',false),
    (s,'B','2',true),
    (s,'C','3.4',false),
    (s,'D','12',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Operator yang digunakan untuk memeriksa apakah dua nilai TIDAK SAMA adalah...',
    'pg', 'mudah',
    'Operator != (atau <>) adalah operator "tidak sama dengan" yang menghasilkan true jika dua nilai berbeda.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','== (sama dengan)',false),
    (s,'B','!= atau <> (tidak sama dengan)',true),
    (s,'C','>= (lebih besar atau sama dengan)',false),
    (s,'D','&& (dan / AND)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Program konversi suhu menggunakan rumus F = (C × 9/5) + 32. Jika suhu Celsius = 0°, maka suhu Fahrenheit adalah...',
    'pg', 'mudah',
    'F = (0 × 9/5) + 32 = 0 + 32 = 32°F. Titik beku air adalah 0°C = 32°F.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','0°F',false),
    (s,'B','32°F',true),
    (s,'C','100°F',false),
    (s,'D','212°F',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Variabel yang dideklarasikan di dalam sebuah fungsi dan hanya dapat diakses dari dalam fungsi tersebut disebut variabel...',
    'pg', 'sedang',
    'Variabel yang hanya bisa diakses di dalam blok/fungsi tempat ia dideklarasikan disebut variabel lokal.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Global',false),
    (s,'B','Statis',false),
    (s,'C','Lokal',true),
    (s,'D','Konstan',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara tipe data int, float, boolean, dan String! Berikan satu contoh penggunaan nyata masing-masing dalam sebuah program!',
    'essay', 'sedang',
    'Jawaban ideal:
- int: bilangan bulat → jumlah_siswa = 30
- float/double: bilangan desimal → nilai_rata = 87.5
- boolean: true/false → is_lulus = true
- String: teks → nama_siswa = "Budi"')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Pelanggan membeli 3 item: Rp 15.000, Rp 25.000, dan Rp 10.000. Pelanggan membayar Rp 100.000. Tuliskan kode program (pseudocode atau bahasa apapun) untuk menghitung total belanja dan kembalian!',
    'essay', 'mudah',
    'Jawaban ideal:
harga1 = 15000; harga2 = 25000; harga3 = 10000; bayar = 100000
total = harga1 + harga2 + harga3  // = 50000
kembalian = bayar - total           // = 50000
PRINT "Total: " + total
PRINT "Kembalian: " + kembalian')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 7, 25);

  -- ==========================================================
  -- 7. SOAL — TES STRUKTUR KONTROL (t5)
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perulangan FOR paling tepat digunakan ketika...',
    'pg', 'mudah',
    'FOR loop digunakan saat jumlah iterasi sudah diketahui di awal program.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Jumlah perulangan tidak diketahui dan tergantung kondisi',false),
    (s,'B','Jumlah perulangan sudah diketahui sejak awal',true),
    (s,'C','Perulangan harus berjalan minimal satu kali',false),
    (s,'D','Kondisi diperiksa di akhir perulangan',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan utama antara while loop dan do-while loop adalah...',
    'pg', 'sedang',
    'do-while memeriksa kondisi SETELAH eksekusi, sehingga body pasti berjalan minimal satu kali meski kondisi awal false.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','While loop tidak bisa menggunakan variabel counter',false),
    (s,'B','Do-while selalu lebih cepat dari while',false),
    (s,'C','Do-while memeriksa kondisi setelah eksekusi sehingga body pasti jalan minimal sekali',true),
    (s,'D','While loop hanya bisa digunakan untuk perulangan mundur',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Seorang siswa mendapat nilai 82. Berdasarkan ketentuan A (90–100), B (80–89), C (70–79), D (60–69), kategori nilai siswa tersebut adalah...',
    'pg', 'mudah',
    'Nilai 82 berada di rentang 80–89, sehingga kategorinya adalah B.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','A',false),
    (s,'B','B',true),
    (s,'C','C',false),
    (s,'D','D',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Apa yang terjadi jika kondisi pada while loop tidak pernah berubah menjadi false?',
    'pg', 'mudah',
    'Jika kondisi selalu true, program tidak pernah keluar dari loop — disebut infinite loop yang menyebabkan program macet.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Loop otomatis berhenti setelah 1000 iterasi',false),
    (s,'B','Program langsung melanjutkan ke baris berikutnya',false),
    (s,'C','Terjadi infinite loop — program macet/berjalan tanpa henti',true),
    (s,'D','Program menghasilkan syntax error',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Pernyataan switch-case paling cocok digunakan untuk situasi...',
    'pg', 'sedang',
    'switch-case efisien ketika satu variabel dibandingkan terhadap banyak nilai diskret. Untuk kondisi range, if-else lebih tepat.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Mengecek apakah nilai variabel berada dalam suatu rentang (misal: 70–80)',false),
    (s,'B','Membandingkan satu variabel terhadap banyak nilai diskret yang mungkin',true),
    (s,'C','Melakukan perulangan sebanyak n kali',false),
    (s,'D','Menggabungkan dua kondisi boolean dengan AND/OR',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah program (pseudocode atau kode) yang membaca nilai ujian siswa berulang kali hingga pengguna mengetik -1 sebagai tanda selesai. Program harus mencetak jumlah siswa yang diinput dan nilai rata-ratanya!',
    'essay', 'sulit',
    'Jawaban ideal:
SET total ← 0; SET jumlah ← 0
INPUT nilai
WHILE nilai ≠ -1 DO
  SET total ← total + nilai
  SET jumlah ← jumlah + 1
  INPUT nilai
ENDWHILE
IF jumlah > 0 THEN
  PRINT "Jumlah siswa: " + jumlah
  PRINT "Rata-rata: " + (total / jumlah)
ELSE PRINT "Tidak ada data" ENDIF')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara struktur percabangan if-else dan switch-case! Kapan sebaiknya menggunakan masing-masing? Berikan contoh kasus nyata untuk setiap struktur!',
    'essay', 'sedang',
    'Jawaban ideal:
IF-ELSE: untuk kondisi range atau ekspresi boolean kompleks. Contoh: if nilai >= 75 → "LULUS".
SWITCH-CASE: untuk satu variabel dengan banyak nilai diskret. Contoh: case 1: "Senin", case 2: "Selasa", dst.
Nilai penuh jika ada penjelasan perbedaan + contoh nyata keduanya.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 7, 25);

  RAISE NOTICE 'Seed berhasil: 1 kompetensi "Algoritma dan Pemrograman Dasar", 5 tes, 35 soal (25 PG + 10 essay).';
END $$;
