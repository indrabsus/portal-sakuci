-- ============================================================
-- Seed: Roadmap Kompetensi Kelas XI
-- 1 Kompetensi: Basis Data (urutan 1)
-- 5 Tes Kompetensi (5 PG 5-opsi + 2 Essay per tes)
-- Jalankan di Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  v_jur uuid;

  k1 uuid; -- kompetensi

  t1 uuid; -- Konsep Basis Data
  t2 uuid; -- Perancangan ERD
  t3 uuid; -- Normalisasi
  t4 uuid; -- DDL & DML Dasar
  t5 uuid; -- Query Lanjutan

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
  -- 1. KOMPETENSI
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi
    (id_jurusan, judul, deskripsi, tingkat, urutan, syarat_lulus, aktif)
  VALUES (v_jur,
    'Basis Data',
    'Memahami konsep dan implementasi basis data relasional, mulai dari perancangan ERD, normalisasi, hingga penulisan query SQL tingkat lanjut untuk pengolahan data.',
    11, 1, 70, true)
  RETURNING id_kompetensi INTO k1;

  -- ----------------------------------------------------------
  -- 2. KOMPETENSI_TUGAS
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Konsep Basis Data',
    'Tes pemahaman konsep dasar basis data, DBMS, model data, dan komponen sistem basis data.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t1;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Perancangan ERD',
    'Tes kemampuan merancang Entity Relationship Diagram (ERD) beserta kardinalitas dan atributnya.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t2;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Normalisasi',
    'Tes pemahaman bentuk-bentuk normal (1NF, 2NF, 3NF, BCNF) dan proses normalisasi tabel.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t3;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'DDL & DML Dasar',
    'Tes kemampuan menulis perintah SQL DDL (CREATE, ALTER, DROP) dan DML (INSERT, UPDATE, DELETE, SELECT).', 'aktif')
  RETURNING id_kompetensi_tugas INTO t4;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Query Lanjutan',
    'Tes kemampuan menulis query SQL lanjutan: JOIN, subquery, agregasi, GROUP BY, HAVING, dan fungsi bawaan.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t5;

  -- ==========================================================
  -- TES 1: KONSEP BASIS DATA
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Software yang berfungsi sebagai perantara antara pengguna/aplikasi dengan basis data, mengelola penyimpanan, keamanan, dan integritas data disebut...',
    'pg', 'mudah',
    'DBMS (Database Management System) adalah perangkat lunak yang mengelola basis data secara keseluruhan. Contoh DBMS: MySQL, PostgreSQL, Oracle, SQL Server. DBMS memastikan data tersimpan secara konsisten, aman, dan dapat diakses secara efisien.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Sistem Operasi (OS)',false),
    (s,'B','DBMS (Database Management System)',true),
    (s,'C','Compiler',false),
    (s,'D','Web Server',false),
    (s,'E','IDE (Integrated Development Environment)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam model basis data relasional, satu baris data dalam sebuah tabel disebut...',
    'pg', 'mudah',
    'Dalam terminologi basis data relasional: baris = record/tuple, kolom = field/atribut, tabel = relasi/entitas. Satu baris mewakili satu data/instance entitas.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Atribut',false),
    (s,'B','Field',false),
    (s,'C','Kolom',false),
    (s,'D','Record/Tuple',true),
    (s,'E','Skema',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Sifat ACID dalam transaksi basis data yang memastikan transaksi dikerjakan sepenuhnya atau tidak sama sekali (tidak boleh setengah-setengah) adalah...',
    'pg', 'sedang',
    'ACID: Atomicity (semua atau tidak sama sekali), Consistency (data tetap konsisten), Isolation (transaksi tidak saling ganggu), Durability (data tersimpan permanen setelah commit). Atomicity menjamin tidak ada transaksi yang setengah jalan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Consistency',false),
    (s,'B','Isolation',false),
    (s,'C','Durability',false),
    (s,'D','Atomicity',true),
    (s,'E','Availability',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan utama antara basis data dan file biasa (seperti spreadsheet Excel) adalah...',
    'pg', 'sedang',
    'Basis data unggul dari file biasa karena: (1) bebas redundansi data (data tidak berulang), (2) integritas terjaga via constraint, (3) bisa diakses banyak pengguna bersamaan (concurrency), (4) keamanan dikelola DBMS, (5) data independen dari aplikasi.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Basis data hanya bisa menyimpan teks, file bisa menyimpan semua tipe data',false),
    (s,'B','File lebih cepat dan aman dibandingkan basis data untuk semua kebutuhan',false),
    (s,'C','Basis data meminimalkan redundansi, mendukung multi-user, dan menjaga integritas data secara terpusat',true),
    (s,'D','Basis data tidak bisa diakses oleh banyak pengguna secara bersamaan',false),
    (s,'E','File lebih cocok untuk data yang saling berkaitan antar kategori',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Bahasa yang digunakan untuk mendefinisikan struktur/skema basis data (membuat, mengubah, menghapus tabel) dalam SQL disebut...',
    'pg', 'mudah',
    'DDL (Data Definition Language) digunakan untuk mendefinisikan struktur: CREATE TABLE, ALTER TABLE, DROP TABLE. DML (Data Manipulation Language) untuk memanipulasi isi data: INSERT, UPDATE, DELETE, SELECT. DCL untuk kontrol akses: GRANT, REVOKE.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','DML (Data Manipulation Language)',false),
    (s,'B','DCL (Data Control Language)',false),
    (s,'C','DDL (Data Definition Language)',true),
    (s,'D','DQL (Data Query Language)',false),
    (s,'E','TCL (Transaction Control Language)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan apa yang dimaksud dengan "integritas data" dalam basis data! Sebutkan dan jelaskan minimal 3 jenis integritas data beserta contoh penerapannya dalam konteks sistem akademik sekolah (data siswa, kelas, nilai)!',
    'essay', 'sedang',
    'Jawaban ideal:
Integritas data = jaminan bahwa data dalam basis data akurat, konsisten, dan dapat dipercaya sepanjang waktu.

3 jenis integritas data:

1. Integritas Entitas (Entity Integrity)
   - Setiap baris dalam tabel harus memiliki Primary Key yang unik dan tidak NULL
   - Contoh: kolom NISN di tabel siswa harus unik dan tidak boleh kosong

2. Integritas Referensial (Referential Integrity)
   - Foreign Key harus merujuk ke nilai Primary Key yang ada, atau NULL
   - Contoh: id_kelas di tabel siswa harus merujuk ke id_kelas yang ada di tabel kelas; tidak boleh ada siswa dengan kelas yang tidak terdaftar

3. Integritas Domain (Domain Integrity)
   - Nilai dalam kolom harus sesuai dengan tipe/rentang yang diizinkan
   - Contoh: kolom nilai harus berupa angka 0–100, kolom jenis_kelamin hanya boleh "L" atau "P"

Bonus: Integritas User-Defined — aturan bisnis khusus, mis. nilai tidak boleh diinput jika siswa belum hadir.

Nilai penuh: definisi integritas + 3 jenis dengan penjelasan dan contoh konteks akademik.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Sebuah sekolah ingin membangun sistem informasi akademik. Identifikasi minimal 5 entitas (tabel) yang dibutuhkan, sebutkan atribut-atribut penting masing-masing (minimal 3 atribut per entitas termasuk Primary Key), dan jelaskan hubungan antar entitas tersebut!',
    'essay', 'sulit',
    'Jawaban ideal:
Entitas dan atribut (contoh):

1. SISWA: nisn (PK), nama_siswa, tanggal_lahir, alamat, jenis_kelamin
2. KELAS: id_kelas (PK), nama_kelas, tingkat, id_jurusan (FK)
3. GURU: nip (PK), nama_guru, mata_pelajaran, no_hp
4. MATA_PELAJARAN: id_mapel (PK), nama_mapel, kode_mapel, jam_pelajaran
5. NILAI: id_nilai (PK), nisn (FK→SISWA), id_mapel (FK→MAPEL), nilai_uts, nilai_uas, nilai_akhir

Hubungan antar entitas:
- SISWA berada di KELAS (many-to-one: banyak siswa dalam satu kelas)
- GURU mengajar MATA_PELAJARAN di KELAS (many-to-many via tabel MENGAJAR)
- SISWA mendapat NILAI untuk setiap MATA_PELAJARAN (via tabel NILAI)
- KELAS memiliki banyak SISWA, satu SISWA satu KELAS aktif

Nilai penuh: 5 entitas dengan min 3 atribut (PK jelas) + hubungan antar entitas dijelaskan (kardinalitas).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 7, 25);

  -- ==========================================================
  -- TES 2: PERANCANGAN ERD
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam notasi ERD (Chen), simbol yang digunakan untuk menggambarkan entitas adalah...',
    'pg', 'mudah',
    'Notasi Chen: Persegi panjang (Rectangle) = Entitas, Elips/Oval = Atribut, Belah ketupat (Diamond) = Relasi/Hubungan, Garis = penghubung. Entitas digambarkan sebagai persegi panjang.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Elips/Oval',false),
    (s,'B','Segitiga',false),
    (s,'C','Lingkaran',false),
    (s,'D','Belah ketupat (Diamond)',false),
    (s,'E','Persegi panjang (Rectangle)',true);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Relasi "satu siswa bisa memiliki banyak nilai, tapi satu nilai hanya milik satu siswa" menggambarkan kardinalitas...',
    'pg', 'mudah',
    'One-to-Many (1:N) artinya satu record di tabel A dapat berhubungan dengan banyak record di tabel B, tapi setiap record di tabel B hanya berhubungan dengan satu record di tabel A. Kebalikannya, Many-to-One dari sudut pandang nilai.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Many-to-Many (M:N)',false),
    (s,'B','One-to-One (1:1)',false),
    (s,'C','One-to-Many (1:N)',true),
    (s,'D','Zero-to-Many (0:N)',false),
    (s,'E','Many-to-One (N:1) dari sudut pandang siswa',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Hubungan "seorang guru bisa mengajar banyak mata pelajaran, dan satu mata pelajaran bisa diajarkan oleh banyak guru" membutuhkan penyelesaian dengan...',
    'pg', 'sedang',
    'Relasi Many-to-Many (M:N) tidak bisa langsung diimplementasikan dalam basis data relasional. Harus dibuat tabel junction/bridge (tabel antara) yang memiliki FK ke kedua tabel. Contoh: tabel MENGAJAR dengan kolom nip_guru dan id_mapel.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Menambahkan kolom id_guru di tabel mata_pelajaran saja',false),
    (s,'B','Menambahkan kolom id_mapel di tabel guru saja',false),
    (s,'C','Membuat tabel junction/bridge (mis. tabel MENGAJAR) yang menghubungkan keduanya',true),
    (s,'D','Menggabungkan tabel guru dan mata_pelajaran menjadi satu tabel besar',false),
    (s,'E','Relasi ini tidak bisa diimplementasikan dalam basis data relasional',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Atribut yang nilainya tidak dapat dibagi lagi menjadi komponen yang lebih kecil dan tidak ada duplikasi disebut atribut...',
    'pg', 'sedang',
    'Atribut atomik/sederhana = nilai tunggal yang tidak bisa dibagi lagi. Contoh: NISN, tanggal_lahir. Contoh NON-atomik: alamat_lengkap (bisa dipecah jadi jalan, kota, kode_pos); nama_lengkap (bisa dipecah jadi nama_depan, nama_belakang).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Atribut Komposit',false),
    (s,'B','Atribut Multivalued',false),
    (s,'C','Atribut Derivatif',false),
    (s,'D','Atribut Atomik/Sederhana',true),
    (s,'E','Atribut Kunci Kandidat',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam ERD, Primary Key sebuah entitas digambarkan dengan...',
    'pg', 'mudah',
    'Dalam notasi ERD Chen, Primary Key digambarkan sebagai atribut (oval) dengan nama yang digarisbawahi. Ini membedakannya dari atribut biasa.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Oval dengan warna merah',false),
    (s,'B','Persegi panjang dengan tanda bintang (*)',false),
    (s,'C','Oval dengan nama atribut yang digarisbawahi',true),
    (s,'D','Belah ketupat dengan garis tebal',false),
    (s,'E','Oval dengan garis putus-putus',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Sebuah toko online memiliki data: Pelanggan bisa melakukan banyak Pesanan, setiap Pesanan berisi banyak Produk, dan satu Produk bisa ada di banyak Pesanan. Buatlah ERD (deskripsikan dalam bentuk teks/tabel) yang mencakup: (a) entitas-entitas yang terlibat, (b) atribut masing-masing entitas (minimal 3, tandai PK), (c) relasi beserta kardinalitasnya, (d) jelaskan tabel junction yang diperlukan!',
    'essay', 'sedang',
    'Jawaban ideal:

(a) Entitas: PELANGGAN, PESANAN, PRODUK, DETAIL_PESANAN (junction)

(b) Atribut:
- PELANGGAN: id_pelanggan (PK), nama, email, no_hp, alamat
- PESANAN: id_pesanan (PK), id_pelanggan (FK), tanggal_pesan, status, total_harga
- PRODUK: id_produk (PK), nama_produk, harga, stok, deskripsi
- DETAIL_PESANAN: id_detail (PK), id_pesanan (FK), id_produk (FK), jumlah, subtotal

(c) Relasi dan kardinalitas:
- PELANGGAN → PESANAN: One-to-Many (1:N) — satu pelanggan punya banyak pesanan
- PESANAN → PRODUK: Many-to-Many (M:N) — diselesaikan via tabel DETAIL_PESANAN

(d) Tabel junction DETAIL_PESANAN diperlukan karena relasi Pesanan-Produk adalah M:N. Tabel ini menyimpan FK ke PESANAN dan PRODUK, plus atribut relasi (jumlah, subtotal) yang hanya bermakna dalam konteks relasi tersebut.

Nilai penuh: 3 entitas utama + junction benar + atribut PK jelas + kardinalitas tepat + penjelasan junction.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara "ERD Konseptual", "ERD Logikal", dan "ERD Fisikal"! Kemudian jelaskan langkah-langkah mengubah ERD konseptual sistem perpustakaan (Buku, Anggota, Peminjaman) menjadi skema tabel basis data yang siap diimplementasikan!',
    'essay', 'sulit',
    'Jawaban ideal:

ERD Konseptual: gambaran tingkat tinggi tentang entitas dan hubungannya tanpa detail teknis, untuk komunikasi dengan stakeholder. Tidak terikat DBMS tertentu.

ERD Logikal: mendetailkan atribut, tipe data, PK/FK, kardinalitas. Sudah terikat model relasional tapi belum ke DBMS spesifik.

ERD Fisikal: ERD yang sudah dioptimasi untuk DBMS tertentu (MySQL/PostgreSQL), termasuk tipe data spesifik (VARCHAR(50), INT, DATETIME), indeks, dan constraint.

Langkah ERD Konseptual → Skema Tabel (Perpustakaan):

1. Identifikasi entitas: BUKU, ANGGOTA, PEMINJAMAN
2. Tentukan PK: isbn (BUKU), id_anggota (ANGGOTA), id_pinjam (PEMINJAMAN)
3. Ubah relasi M:N menjadi tabel junction:
   - ANGGOTA ↔ BUKU (M:N) → tabel PEMINJAMAN sebagai junction
4. Tambahkan FK: PEMINJAMAN.id_anggota → ANGGOTA, PEMINJAMAN.isbn → BUKU
5. Tentukan atribut relasi di junction: tanggal_pinjam, tanggal_kembali, status, denda
6. Hasil skema:
   - BUKU(isbn PK, judul, pengarang, penerbit, tahun, stok)
   - ANGGOTA(id_anggota PK, nama, alamat, no_hp, email, tgl_daftar)
   - PEMINJAMAN(id_pinjam PK, id_anggota FK, isbn FK, tgl_pinjam, tgl_kembali, status)

Nilai penuh: 3 jenis ERD dijelaskan dengan benar + langkah-langkah konversi sistematis + skema tabel akhir yang lengkap.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 7, 25);

  -- ==========================================================
  -- TES 3: NORMALISASI
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Sebuah tabel dikatakan berada dalam bentuk normal pertama (1NF) apabila...',
    'pg', 'mudah',
    '1NF mensyaratkan: (1) setiap sel berisi nilai atomik (tidak ada grup berulang/array), (2) setiap baris unik (ada PK), (3) setiap kolom berisi data bertipe sama. Contoh pelanggaran: kolom "telepon" berisi "081234, 085678" (dua nilai).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Tidak ada atribut yang bergantung transitif pada primary key',false),
    (s,'B','Semua atribut non-kunci bergantung penuh pada seluruh primary key',false),
    (s,'C','Setiap atribut bernilai atomik (tidak ada grup berulang) dan setiap baris unik',true),
    (s,'D','Tidak ada ketergantungan fungsional parsial',false),
    (s,'E','Semua foreign key sudah didefinisikan dengan benar',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perhatikan tabel berikut:
NILAI(id_siswa, id_mapel, nama_siswa, nama_mapel, nilai)
PK: (id_siswa, id_mapel)

Masalah yang terdapat dalam tabel ini adalah...',
    'pg', 'sedang',
    'Tabel ini melanggar 2NF karena ada ketergantungan parsial: nama_siswa hanya bergantung pada id_siswa (bukan seluruh PK gabungan), dan nama_mapel hanya bergantung pada id_mapel. Solusi: pisahkan ke tabel SISWA(id_siswa, nama_siswa), MAPEL(id_mapel, nama_mapel), dan NILAI(id_siswa, id_mapel, nilai).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Tabel sudah memenuhi 3NF, tidak ada masalah',false),
    (s,'B','Melanggar 1NF karena ada nilai non-atomik',false),
    (s,'C','Melanggar 2NF: nama_siswa dan nama_mapel bergantung parsial pada sebagian PK, bukan seluruh PK',true),
    (s,'D','Melanggar 3NF karena ada ketergantungan transitif antara nilai dan nama_mapel',false),
    (s,'E','Primary key tidak tepat, seharusnya hanya id_siswa',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Ketergantungan transitif (transitive dependency) yang melanggar 3NF adalah kondisi di mana...',
    'pg', 'sedang',
    '3NF mensyaratkan tidak ada ketergantungan transitif: A → B → C (C bergantung pada B, B bergantung pada A, padahal C bukan kunci). Contoh: id_siswa → id_kelas → nama_wali_kelas. nama_wali_kelas bergantung pada id_kelas (bukan langsung pada id_siswa), sehingga melanggar 3NF.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Sebuah atribut bergantung pada sebagian dari primary key gabungan',false),
    (s,'B','Sebuah atribut non-kunci bergantung pada atribut non-kunci lain (bukan langsung pada PK)',true),
    (s,'C','Primary key terdiri dari lebih dari satu atribut',false),
    (s,'D','Ada dua atribut yang memiliki nilai identik di seluruh baris tabel',false),
    (s,'E','Atribut nullable ada di dalam primary key',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Tujuan utama dari proses normalisasi basis data adalah...',
    'pg', 'mudah',
    'Normalisasi bertujuan menghilangkan anomali data (insert, update, delete anomaly) dan redundansi dengan cara memecah tabel besar menjadi tabel-tabel lebih kecil yang terhubung via FK. Trade-off: banyak JOIN saat query, tapi integritas data terjaga.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Membuat query SQL menjadi lebih cepat dan sederhana',false),
    (s,'B','Mengurangi jumlah tabel agar basis data lebih mudah dikelola',false),
    (s,'C','Menghilangkan redundansi data dan anomali (insert, update, delete anomaly)',true),
    (s,'D','Meningkatkan kecepatan backup dan restore basis data',false),
    (s,'E','Memastikan semua data tersimpan dalam satu tabel besar',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Tabel ORDER(id_order, id_produk, nama_produk, id_supplier, nama_supplier, harga) mengalami anomali update karena...',
    'pg', 'sulit',
    'Jika nama_supplier disimpan di setiap baris order, maka mengubah nama supplier mengharuskan update di SEMUA baris yang berisi supplier tersebut. Jika ada baris yang terlewat → inkonsistensi data. Ini adalah update anomaly yang diselesaikan dengan normalisasi: pisahkan SUPPLIER(id_supplier, nama_supplier).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Primary key terdiri dari dua kolom sehingga query menjadi lambat',false),
    (s,'B','Jika nama supplier berubah, harus diupdate di semua baris yang berisi supplier tersebut — rawan inkonsistensi',true),
    (s,'C','Kolom harga memiliki tipe data yang tidak sesuai',false),
    (s,'D','Tabel ini sudah memenuhi 3NF sehingga tidak ada masalah',false),
    (s,'E','id_order tidak bisa dijadikan primary key karena bisa duplikat',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Diberikan tabel unnormalized berikut:
TRANSAKSI(id_transaksi, tgl_transaksi, id_pelanggan, nama_pelanggan, kota_pelanggan, id_produk, nama_produk, harga_satuan, jumlah, subtotal)
PK: id_transaksi

Lakukan normalisasi sampai 3NF! Tunjukkan langkah demi langkah (UNF → 1NF → 2NF → 3NF) dan tuliskan skema tabel akhirnya!',
    'essay', 'sulit',
    'Jawaban ideal:

UNF → 1NF: Tabel sudah 1NF jika tidak ada grup berulang (asumsikan satu baris = satu transaksi untuk satu produk). Jika satu transaksi bisa punya banyak produk, butuh PK gabungan (id_transaksi, id_produk).

1NF: TRANSAKSI(id_transaksi, id_produk, tgl_transaksi, id_pelanggan, nama_pelanggan, kota_pelanggan, nama_produk, harga_satuan, jumlah, subtotal)
PK: (id_transaksi, id_produk)

1NF → 2NF: Hilangkan ketergantungan parsial:
- tgl_transaksi, id_pelanggan → hanya bergantung id_transaksi (parsial)
- nama_pelanggan, kota_pelanggan → hanya bergantung id_pelanggan (transitif, selesaikan di 3NF)
- nama_produk, harga_satuan → hanya bergantung id_produk (parsial)
- jumlah, subtotal → bergantung pada (id_transaksi, id_produk) ✓

2NF:
- HEADER_TRANSAKSI(id_transaksi PK, tgl_transaksi, id_pelanggan FK)
- DETAIL_TRANSAKSI(id_transaksi FK, id_produk FK, jumlah, subtotal) PK: (id_transaksi, id_produk)
- PRODUK(id_produk PK, nama_produk, harga_satuan)
- (sementara) PELANGGAN(id_pelanggan, nama_pelanggan, kota_pelanggan)

2NF → 3NF: Hilangkan ketergantungan transitif di PELANGGAN:
- nama_pelanggan dan kota_pelanggan keduanya bergantung langsung pada id_pelanggan (sudah 3NF)
- Cek apakah kota_pelanggan bergantung pada nama_pelanggan? Tidak, karena banyak nama berbeda bisa di kota yang sama.

Skema akhir 3NF:
- PELANGGAN(id_pelanggan PK, nama_pelanggan, kota_pelanggan)
- PRODUK(id_produk PK, nama_produk, harga_satuan)
- TRANSAKSI(id_transaksi PK, tgl_transaksi, id_pelanggan FK)
- DETAIL_TRANSAKSI(id_transaksi FK, id_produk FK, jumlah, subtotal) PK: (id_transaksi, id_produk)

Nilai penuh: identifikasi masalah setiap tahap + pemisahan tabel benar + skema akhir 3NF lengkap dengan PK/FK.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan apa yang dimaksud dengan "anomali data" dalam konteks basis data yang belum dinormalisasi! Sebutkan dan berikan contoh konkret untuk ketiga jenis anomali (insert anomaly, update anomaly, delete anomaly) menggunakan skenario data guru yang mengajar di beberapa kelas!',
    'essay', 'sedang',
    'Jawaban ideal:
Anomali data = masalah/inkonsistensi yang terjadi saat melakukan operasi INSERT, UPDATE, atau DELETE pada tabel yang mengandung redundansi.

Skenario: tabel MENGAJAR(id_guru, nama_guru, id_kelas, nama_kelas, mapel)

1. Insert Anomaly: Tidak bisa memasukkan data guru baru jika belum ditugaskan ke kelas (karena id_kelas bagian dari kebutuhan).
   Contoh: Guru Budi baru saja diterima tapi belum ada jadwal → tidak bisa masuk tabel.

2. Update Anomaly: Jika nama guru "Ani" diubah menjadi "Siti", harus update di SEMUA baris yang berisi guru tersebut. Jika ada baris terlewat → inkonsistensi (satu guru, dua nama).
   Contoh: Guru Ani mengajar 5 kelas, namanya berganti — 5 baris harus diupdate semua.

3. Delete Anomaly: Menghapus data kelas akan menghapus data guru juga (jika guru hanya mengajar di satu kelas).
   Contoh: Kelas XII-A dibubarkan → data guru yang HANYA mengajar di XII-A ikut terhapus.

Solusi: normalisasi ke minimal 3NF: pisahkan GURU(id_guru, nama_guru) dan KELAS(id_kelas, nama_kelas).

Nilai penuh: definisi anomali + 3 jenis anomali dengan contoh konkret + solusi normalisasi disebutkan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 7, 25);

  -- ==========================================================
  -- TES 4: DDL & DML DASAR
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perintah SQL yang digunakan untuk membuat tabel baru bernama "siswa" adalah...',
    'pg', 'mudah',
    'CREATE TABLE adalah perintah DDL untuk membuat tabel baru. Sintaks dasar: CREATE TABLE nama_tabel (kolom1 tipedata CONSTRAINT, kolom2 tipedata, ...);')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','MAKE TABLE siswa (...)',false),
    (s,'B','ADD TABLE siswa (...)',false),
    (s,'C','INSERT TABLE siswa (...)',false),
    (s,'D','CREATE TABLE siswa (...)',true),
    (s,'E','BUILD TABLE siswa (...)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perhatikan query berikut:
SELECT * FROM siswa WHERE kelas = ''XII-RPL'' AND nilai > 75;
Hasil query ini akan menampilkan...',
    'pg', 'mudah',
    'Operator AND mensyaratkan KEDUA kondisi harus terpenuhi. Query ini menampilkan semua kolom (*) dari siswa yang berada di kelas XII-RPL DAN memiliki nilai lebih dari 75.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Semua siswa kelas XII-RPL, atau semua siswa dengan nilai > 75',false),
    (s,'B','Hanya siswa pertama yang memenuhi salah satu kondisi',false),
    (s,'C','Semua kolom siswa yang berada di kelas XII-RPL DAN memiliki nilai lebih dari 75',true),
    (s,'D','Semua siswa dengan nilai tepat 75 di kelas XII-RPL',false),
    (s,'E','Jumlah siswa kelas XII-RPL yang nilainya di atas 75',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perintah SQL untuk mengubah nilai kolom "status" menjadi "aktif" untuk semua siswa dengan id_kelas = 5 adalah...',
    'pg', 'sedang',
    'UPDATE tabel SET kolom=nilai WHERE kondisi adalah sintaks DML untuk mengubah data. PENTING: selalu sertakan WHERE untuk menghindari update seluruh tabel!')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','MODIFY siswa SET status = ''aktif'' WHERE id_kelas = 5',false),
    (s,'B','CHANGE siswa SET status = ''aktif'' WHERE id_kelas = 5',false),
    (s,'C','ALTER siswa SET status = ''aktif'' WHERE id_kelas = 5',false),
    (s,'D','UPDATE siswa SET status = ''aktif'' WHERE id_kelas = 5',true),
    (s,'E','EDIT siswa SET status = ''aktif'' WHERE id_kelas = 5',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan antara perintah DELETE dan TRUNCATE dalam SQL adalah...',
    'pg', 'sulit',
    'DELETE: menghapus baris tertentu (bisa dengan WHERE), bisa di-rollback (bagian transaksi), log setiap baris. TRUNCATE: menghapus SEMUA baris sekaligus, tidak bisa di-rollback (DDL, tidak ada WHERE), jauh lebih cepat untuk tabel besar karena tidak log per baris.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','DELETE menghapus tabel beserta strukturnya, TRUNCATE hanya menghapus isinya',false),
    (s,'B','Keduanya identik, hanya berbeda penulisan',false),
    (s,'C','TRUNCATE lebih cepat, tidak bisa pakai WHERE, dan tidak bisa di-rollback; DELETE bisa selektif dan bisa di-rollback',true),
    (s,'D','DELETE hanya bisa dipakai oleh admin, TRUNCATE bisa dipakai semua user',false),
    (s,'E','TRUNCATE bisa menggunakan WHERE untuk kondisi tertentu, DELETE tidak bisa',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Untuk menambahkan kolom "email" bertipe VARCHAR(100) pada tabel "guru" yang sudah ada, perintah SQL yang tepat adalah...',
    'pg', 'sedang',
    'ALTER TABLE digunakan untuk memodifikasi struktur tabel yang sudah ada: menambah kolom (ADD COLUMN), mengubah tipe kolom (MODIFY/ALTER COLUMN), menghapus kolom (DROP COLUMN), atau menambah constraint.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','UPDATE TABLE guru ADD email VARCHAR(100)',false),
    (s,'B','CREATE COLUMN email VARCHAR(100) IN guru',false),
    (s,'C','INSERT COLUMN email VARCHAR(100) INTO guru',false),
    (s,'D','ADD COLUMN guru.email VARCHAR(100)',false),
    (s,'E','ALTER TABLE guru ADD COLUMN email VARCHAR(100)',true);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah perintah SQL DDL untuk membuat struktur basis data sistem absensi sekolah yang terdiri dari: (a) tabel GURU dengan minimal 5 kolom termasuk PK dan constraint NOT NULL, (b) tabel KELAS dengan FK ke jurusan, (c) tabel ABSENSI dengan FK ke siswa dan kelas, beserta constraint yang sesuai!',
    'essay', 'sedang',
    'Jawaban ideal:

CREATE TABLE guru (
  nip VARCHAR(20) PRIMARY KEY,
  nama_guru VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  no_hp VARCHAR(15),
  mata_pelajaran VARCHAR(50) NOT NULL,
  tgl_masuk DATE
);

CREATE TABLE jurusan (
  id_jurusan SERIAL PRIMARY KEY,
  kode_jurusan VARCHAR(10) UNIQUE NOT NULL,
  nama_jurusan VARCHAR(100) NOT NULL
);

CREATE TABLE kelas (
  id_kelas SERIAL PRIMARY KEY,
  nama_kelas VARCHAR(20) NOT NULL,
  tingkat INT CHECK (tingkat IN (10, 11, 12)),
  id_jurusan INT NOT NULL REFERENCES jurusan(id_jurusan)
);

CREATE TABLE siswa (
  nisn VARCHAR(10) PRIMARY KEY,
  nama_siswa VARCHAR(100) NOT NULL,
  id_kelas INT REFERENCES kelas(id_kelas)
);

CREATE TABLE absensi (
  id_absensi SERIAL PRIMARY KEY,
  nisn VARCHAR(10) NOT NULL REFERENCES siswa(nisn),
  id_kelas INT NOT NULL REFERENCES kelas(id_kelas),
  tanggal DATE NOT NULL,
  status VARCHAR(10) CHECK (status IN (''hadir'', ''izin'', ''sakit'', ''alpha'')),
  keterangan TEXT
);

Nilai penuh: CREATE TABLE benar + PK dideklarasikan + minimal 5 kolom guru + FK ke tabel lain + CHECK constraint logis.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Diberikan tabel PRODUK(id_produk, nama_produk, harga, stok, id_kategori) dan tabel PENJUALAN(id_jual, id_produk, jumlah, tgl_jual). Tuliskan perintah SQL DML untuk: (a) menambahkan 3 produk baru, (b) memperbarui harga semua produk kategori 2 naik 10%, (c) menghapus produk yang stoknya 0, (d) menampilkan 5 produk terlaris berdasarkan total jumlah terjual!',
    'essay', 'sulit',
    'Jawaban ideal:

(a) INSERT 3 produk:
INSERT INTO produk (nama_produk, harga, stok, id_kategori) VALUES
  (''Keyboard Mechanical'', 450000, 50, 1),
  (''Mouse Wireless'', 275000, 75, 1),
  (''Monitor 24 inch'', 1800000, 20, 2);

(b) UPDATE harga kategori 2 naik 10%:
UPDATE produk
SET harga = harga * 1.10
WHERE id_kategori = 2;

(c) DELETE produk stok 0:
DELETE FROM produk
WHERE stok = 0;

(d) 5 produk terlaris:
SELECT p.nama_produk, SUM(pj.jumlah) AS total_terjual
FROM produk p
JOIN penjualan pj ON p.id_produk = pj.id_produk
GROUP BY p.id_produk, p.nama_produk
ORDER BY total_terjual DESC
LIMIT 5;

Nilai penuh: INSERT multi-row benar + UPDATE dengan kalkulasi + DELETE dengan kondisi + SELECT dengan JOIN + GROUP BY + ORDER BY + LIMIT.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 7, 25);

  -- ==========================================================
  -- TES 5: QUERY LANJUTAN
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan antara INNER JOIN dan LEFT JOIN adalah...',
    'pg', 'sedang',
    'INNER JOIN hanya menampilkan baris yang ada pasangannya di KEDUA tabel. LEFT JOIN menampilkan SEMUA baris dari tabel kiri, ditambah data dari tabel kanan (NULL jika tidak ada pasangan). RIGHT JOIN = kebalikan LEFT JOIN.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','INNER JOIN lebih lambat dari LEFT JOIN',false),
    (s,'B','LEFT JOIN hanya menampilkan baris yang cocok di kedua tabel, INNER JOIN menampilkan semua dari tabel kiri',false),
    (s,'C','INNER JOIN hanya menampilkan baris yang cocok di kedua tabel; LEFT JOIN menampilkan semua baris tabel kiri meskipun tidak ada pasangan di tabel kanan',true),
    (s,'D','Keduanya identik, hanya berbeda nama',false),
    (s,'E','LEFT JOIN tidak bisa digunakan dengan lebih dari dua tabel',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Fungsi agregasi SQL yang menghitung jumlah baris/nilai dalam sebuah kolom adalah...',
    'pg', 'mudah',
    'COUNT() menghitung jumlah baris. COUNT(*) = semua baris, COUNT(kolom) = baris yang tidak NULL. Fungsi agregasi lain: SUM (total), AVG (rata-rata), MAX (nilai terbesar), MIN (nilai terkecil).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','SUM()',false),
    (s,'B','TOTAL()',false),
    (s,'C','COUNT()',true),
    (s,'D','NUMBER()',false),
    (s,'E','QUANTITY()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Klausa SQL yang digunakan untuk memfilter hasil GROUP BY (bukan memfilter baris individual seperti WHERE) adalah...',
    'pg', 'sedang',
    'HAVING digunakan untuk memfilter HASIL AGREGASI setelah GROUP BY. WHERE memfilter baris SEBELUM dikelompokkan. Contoh: HAVING COUNT(*) > 5 (hanya tampilkan kelompok dengan lebih dari 5 anggota).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','WHERE',false),
    (s,'B','FILTER',false),
    (s,'C','CONDITION',false),
    (s,'D','HAVING',true),
    (s,'E','AGGREGATE WHERE',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Query berikut menghasilkan apa?
SELECT id_kelas, AVG(nilai) as rata_nilai
FROM nilai_siswa
GROUP BY id_kelas
HAVING AVG(nilai) >= 75
ORDER BY rata_nilai DESC;',
    'pg', 'sulit',
    'Query ini: (1) mengelompokkan data nilai per kelas (GROUP BY id_kelas), (2) menghitung rata-rata nilai tiap kelas (AVG), (3) hanya menampilkan kelas yang rata-ratanya >= 75 (HAVING), (4) diurutkan dari rata-rata tertinggi (ORDER BY DESC).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Semua nilai siswa yang di atas 75, diurutkan dari terbesar',false),
    (s,'B','Rata-rata nilai seluruh sekolah jika nilainya >= 75',false),
    (s,'C','Daftar kelas beserta rata-rata nilainya, hanya kelas dengan rata-rata >= 75, diurutkan dari rata-rata tertinggi',true),
    (s,'D','Semua siswa dengan nilai rata-rata di atas 75, dikelompokkan per kelas',false),
    (s,'E','Id kelas dan rata-rata nilai semua kelas tanpa filter, diurutkan menurun',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Subquery (query bersarang) pada klausa WHERE berikut ini menghasilkan apa?
SELECT nama_siswa FROM siswa
WHERE nisn IN (SELECT nisn FROM nilai WHERE nilai_akhir < 60);',
    'pg', 'sulit',
    'Subquery berjalan lebih dulu: SELECT nisn FROM nilai WHERE nilai_akhir < 60 menghasilkan daftar NISN siswa dengan nilai di bawah 60. Lalu query luar mengambil nama_siswa yang NISN-nya ada dalam daftar tersebut. Operator IN cocok untuk membandingkan dengan daftar nilai.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Nama semua siswa beserta nilai akhirnya yang di bawah 60',false),
    (s,'B','Jumlah siswa yang memiliki nilai akhir di bawah 60',false),
    (s,'C','Nama-nama siswa yang memiliki nilai akhir di bawah 60',true),
    (s,'D','Error karena tidak bisa menggunakan subquery di dalam WHERE',false),
    (s,'E','Nama siswa yang TIDAK memiliki nilai akhir di bawah 60',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Diberikan dua tabel: SISWA(nisn, nama_siswa, id_kelas) dan NILAI(id_nilai, nisn, id_mapel, nilai_akhir). Tuliskan query SQL untuk: (a) menampilkan nama siswa beserta nilai rata-rata mereka, (b) menampilkan siswa yang belum memiliki nilai (menggunakan LEFT JOIN), (c) menampilkan 3 siswa dengan nilai rata-rata tertinggi, (d) menampilkan rata-rata nilai per kelas hanya untuk kelas dengan rata-rata di atas 70!',
    'essay', 'sulit',
    'Jawaban ideal:

(a) Nama siswa + rata-rata nilai:
SELECT s.nama_siswa, AVG(n.nilai_akhir) AS rata_nilai
FROM siswa s
JOIN nilai n ON s.nisn = n.nisn
GROUP BY s.nisn, s.nama_siswa;

(b) Siswa tanpa nilai (LEFT JOIN):
SELECT s.nama_siswa
FROM siswa s
LEFT JOIN nilai n ON s.nisn = n.nisn
WHERE n.id_nilai IS NULL;

(c) 3 siswa nilai rata-rata tertinggi:
SELECT s.nama_siswa, AVG(n.nilai_akhir) AS rata_nilai
FROM siswa s
JOIN nilai n ON s.nisn = n.nisn
GROUP BY s.nisn, s.nama_siswa
ORDER BY rata_nilai DESC
LIMIT 3;

(d) Rata-rata per kelas, hanya kelas rata-rata > 70:
SELECT s.id_kelas, AVG(n.nilai_akhir) AS rata_kelas
FROM siswa s
JOIN nilai n ON s.nisn = n.nisn
GROUP BY s.id_kelas
HAVING AVG(n.nilai_akhir) > 70;

Nilai penuh: 4 query benar — JOIN (a), LEFT JOIN + IS NULL (b), LIMIT (c), HAVING (d).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara INNER JOIN, LEFT JOIN, RIGHT JOIN, dan FULL OUTER JOIN! Berikan contoh kasus nyata yang cocok untuk masing-masing jenis JOIN, kemudian tuliskan query SQL lengkapnya menggunakan tabel GURU dan JADWAL_MENGAJAR!',
    'essay', 'sulit',
    'Jawaban ideal:

INNER JOIN: hanya baris yang ada pasangan di KEDUA tabel.
Kasus: guru yang memiliki jadwal mengajar.
SELECT g.nama_guru, j.hari, j.jam
FROM guru g INNER JOIN jadwal_mengajar j ON g.nip = j.nip;

LEFT JOIN: semua baris tabel kiri + data tabel kanan (NULL jika tidak ada).
Kasus: semua guru termasuk yang belum punya jadwal.
SELECT g.nama_guru, j.hari
FROM guru g LEFT JOIN jadwal_mengajar j ON g.nip = j.nip;
-- Guru tanpa jadwal tetap muncul, kolom hari = NULL

RIGHT JOIN: semua baris tabel kanan + data tabel kiri (NULL jika tidak ada).
Kasus: semua jadwal termasuk yang gurunya belum terdaftar.
SELECT g.nama_guru, j.hari
FROM guru g RIGHT JOIN jadwal_mengajar j ON g.nip = j.nip;

FULL OUTER JOIN: semua baris dari KEDUA tabel.
Kasus: laporan lengkap guru dan jadwal termasuk yang tidak berpasangan.
SELECT g.nama_guru, j.hari
FROM guru g FULL OUTER JOIN jadwal_mengajar j ON g.nip = j.nip;
(catatan: MySQL tidak support FULL OUTER JOIN, bisa disimulasikan dengan UNION dari LEFT dan RIGHT JOIN)

Nilai penuh: 4 jenis JOIN dijelaskan dengan benar + kasus yang tepat + query SQL lengkap + catatan FULL OUTER JOIN di MySQL.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 7, 25);

  RAISE NOTICE 'Seed berhasil: 1 kompetensi "Basis Data" (tingkat=11, urutan=1), 5 tes, 35 soal (25 PG 5-opsi + 10 essay).';
END $$;
