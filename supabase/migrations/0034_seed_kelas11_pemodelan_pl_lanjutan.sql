-- ============================================================
-- Seed: Roadmap Kompetensi Kelas XI
-- 1 Kompetensi: Pemodelan Perangkat Lunak Lanjutan (urutan 2, lanjutan dari mapel Pemodelan PL)
-- 6 Tes Kompetensi (5 PG 5-opsi + 2 Essay per tes)
-- Jalankan di Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  v_jur uuid;

  k1 uuid; -- kompetensi

  t1 uuid; -- Sequence Diagram
  t2 uuid; -- Pemodelan Data Lanjutan
  t3 uuid; -- Dokumentasi Desain Sistem
  t4 uuid; -- Pemodelan Arsitektur MVC
  t5 uuid; -- Design Pattern Dasar
  t6 uuid; -- Pemodelan REST API

  s uuid;

BEGIN
  SELECT id_jurusan INTO v_jur
  FROM public.jurusan
  WHERE lower(nama_jurusan) LIKE '%rpl%'
     OR lower(nama_jurusan) LIKE '%pplg%'
     OR lower(kode_jurusan)  LIKE '%rpl%'
     OR lower(kode_jurusan)  LIKE '%pplg%'
  LIMIT 1;

  IF v_jur IS NULL THEN
    RAISE EXCEPTION 'Jurusan PPLG/RPL tidak ditemukan.';
  END IF;

  -- ----------------------------------------------------------
  -- KOMPETENSI
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi
    (id_jurusan, judul, deskripsi, tingkat, urutan, syarat_lulus, aktif)
  VALUES (v_jur,
    'Pemodelan Perangkat Lunak Lanjutan',
    'Pendalaman pemodelan perangkat lunak meliputi Sequence Diagram, pemodelan data lanjutan (ERD-ke-relasional), dokumentasi desain sistem, arsitektur MVC, design pattern dasar, dan pemodelan REST API menggunakan standar industri.',
    11, 2, 70, true)
  RETURNING id_kompetensi INTO k1;

  -- ----------------------------------------------------------
  -- KOMPETENSI_TUGAS
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Sequence Diagram',
    'Tes pemahaman dan pembuatan sequence diagram UML untuk memodelkan interaksi antar objek dalam urutan waktu.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t1;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Pemodelan Data Lanjutan',
    'Tes kemampuan memetakan ERD ke skema relasional, normalisasi lanjutan, dan pemodelan data untuk aplikasi nyata.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t2;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Dokumentasi Desain Sistem',
    'Tes kemampuan membuat Software Design Document (SDD), mendeskripsikan arsitektur, komponen, dan antarmuka sistem secara profesional.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t3;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Pemodelan Arsitektur MVC',
    'Tes pemahaman pola arsitektur MVC (Model-View-Controller) dan penerapannya dalam desain aplikasi web.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t4;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Design Pattern Dasar',
    'Tes pemahaman konsep design pattern GoF (Creational, Structural, Behavioral) dan penerapan pattern Singleton, Factory, dan Observer.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t5;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Pemodelan REST API',
    'Tes kemampuan merancang dan mendokumentasikan REST API menggunakan standar HTTP method, status code, dan format JSON.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t6;

  -- ==========================================================
  -- TES 1: SEQUENCE DIAGRAM
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam Sequence Diagram UML, elemen yang merepresentasikan objek atau aktor yang terlibat dalam interaksi disebut...',
    'pg', 'mudah',
    'Lifeline adalah elemen vertikal dalam sequence diagram yang merepresentasikan objek, aktor, atau komponen yang berpartisipasi dalam interaksi. Garis putus-putus ke bawah (garis hidup) menunjukkan keberadaan objek sepanjang waktu. Di atasnya ada kotak persegi panjang berisi nama objek/kelas.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Message',false),
    (s,'B','Lifeline',true),
    (s,'C','Fragment',false),
    (s,'D','Activation Bar',false),
    (s,'E','Guard',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Panah berujung tertutup (filled arrowhead) pada Sequence Diagram menunjukkan...',
    'pg', 'sedang',
    'Panah penuh (solid line + filled arrowhead) = synchronous message — pengirim menunggu (blocking) sampai penerima selesai memproses dan mengembalikan hasil. Panah terbuka (open arrowhead) = asynchronous message — pengirim tidak menunggu. Panah putus-putus = return message (kembalian dari panggilan sinkron).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Asynchronous message — pengirim tidak menunggu balasan',false),
    (s,'B','Return message — nilai kembalian dari pemanggilan method',false),
    (s,'C','Synchronous message — pengirim menunggu penerima selesai memproses',true),
    (s,'D','Self-message — objek memanggil method miliknya sendiri',false),
    (s,'E','Create message — membuat objek baru',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Pada Sequence Diagram, Combined Fragment dengan operator "alt" digunakan untuk memodelkan...',
    'pg', 'sedang',
    'Combined Fragment "alt" (alternative) digunakan untuk memodelkan percabangan kondisional — seperti if-else. Setiap partisi dipisahkan garis putus-putus dan punya guard condition dalam []. Hanya satu partisi yang dieksekusi sesuai kondisi yang true. "opt" = optional (jika kondisi true, "loop" = perulangan, "par" = paralel.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Perulangan seperti loop/while',false),
    (s,'B','Percabangan kondisional (if-else) — hanya satu jalur yang dieksekusi',true),
    (s,'C','Proses yang berjalan secara paralel',false),
    (s,'D','Bagian opsional yang dieksekusi hanya jika kondisi true',false),
    (s,'E','Pengecualian (exception handling)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan utama Sequence Diagram dengan Collaboration Diagram (Communication Diagram) adalah...',
    'pg', 'sulit',
    'Sequence Diagram menekankan urutan waktu (vertikal, top-to-bottom). Communication Diagram menekankan hubungan struktural antar objek (lebih seperti jaringan/graf, message diberi nomor urut). Keduanya memodelkan interaksi antar objek tapi dari sudut pandang berbeda. Sequence lebih intuitif untuk alur kronologis.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Sequence Diagram hanya untuk sistem web, Collaboration Diagram untuk desktop',false),
    (s,'B','Sequence Diagram menekankan urutan waktu; Collaboration Diagram menekankan hubungan struktural antar objek',true),
    (s,'C','Sequence Diagram lebih detail daripada Collaboration Diagram',false),
    (s,'D','Collaboration Diagram hanya dipakai di fase testing, bukan desain',false),
    (s,'E','Keduanya identik — hanya berbeda nama di versi UML yang berbeda',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Activation Bar (Execution Specification) pada Sequence Diagram berfungsi untuk menunjukkan...',
    'pg', 'mudah',
    'Activation Bar adalah kotak tipis di atas lifeline yang menunjukkan periode waktu di mana suatu objek sedang aktif memproses (mengeksekusi method/operasi). Saat ada panah masuk (message diterima), activation bar dimulai; saat ada return/selesai, bar berakhir.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Jumlah method yang dimiliki oleh suatu objek',false),
    (s,'B','Nama kelas dari objek yang berpartisipasi',false),
    (s,'C','Periode waktu di mana objek sedang aktif mengeksekusi operasi',true),
    (s,'D','Urutan pembuatan objek dalam sistem',false),
    (s,'E','Nilai return yang dikembalikan dari suatu method',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah Sequence Diagram (dalam bentuk deskripsi tertulis yang jelas) untuk skenario "Siswa Login ke Sistem E-Learning"! Skenario: (1) Siswa memasukkan username+password di halaman login, (2) Browser mengirim data ke Server, (3) Server memvalidasi ke Database, (4) Jika valid: Database kembalikan data user → Server buat session → Server redirect ke dashboard; (5) Jika tidak valid: Server tampilkan pesan error. Jelaskan lifeline, message (sinkron/asinkron), activation bar, dan combined fragment yang ada!',
    'essay', 'sulit',
    'Jawaban ideal:

LIFELINE yang terlibat (kiri ke kanan):
1. :Siswa (aktor)
2. :Browser (client)
3. :AuthController (server)
4. :Database (sistem)

ALUR SEQUENCE DIAGRAM:

1. Siswa → Browser: memasukkan(username, password) [synchronous]
2. Browser → AuthController: POST /login {username, password} [synchronous]
   [Activation bar AuthController mulai]

   Combined Fragment [alt]:
   --- Partisi 1: [kredensial valid] ---
   3. AuthController → Database: SELECT user WHERE username=? AND password=? [sync]
      [Activation bar Database mulai]
   4. Database → AuthController: <<return>> data_user [return message, panah putus-putus]
      [Activation bar Database selesai]
   5. AuthController → AuthController: createSession(data_user) [self-message]
   6. AuthController → Browser: <<return>> redirect /dashboard [return]

   --- Partisi 2: [kredensial tidak valid] ---
   3b. AuthController → Database: SELECT user WHERE username=? AND password=? [sync]
   4b. Database → AuthController: <<return>> null [return]
   5b. AuthController → Browser: <<return>> 401 {error: "Username/password salah"} [return]

7. Browser → Siswa: tampilkan dashboard / tampilkan pesan error [sync]
   [Activation bar AuthController selesai]

ELEMEN UML yang digunakan:
- Lifeline: 4 lifeline (Siswa, Browser, AuthController, Database)
- Synchronous message: panah penuh, pengirim menunggu
- Return message: panah putus-putus, membawa nilai kembalian
- Activation bar: pada AuthController (dari menerima POST sampai mengirim response) dan Database (saat query)
- Self-message: AuthController memanggil createSession() miliknya sendiri
- Combined Fragment [alt]: dua partisi kondisi (valid vs tidak valid)

Nilai penuh: 4 lifeline tepat + urutan message logis + combined fragment alt dua partisi + return message + self-message + activation bar disebutkan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara Sequence Diagram dan Use Case Diagram! Kapan lebih tepat menggunakan masing-masing? Kemudian, untuk fitur "Checkout Pembelian" pada aplikasi toko online (keranjang → pilih pembayaran → konfirmasi → notifikasi email), diagram mana yang lebih informatif dan mengapa? Gambarkan/deskripsikan diagram yang kamu pilih!',
    'essay', 'sedang',
    'Jawaban ideal:

Use Case Diagram:
- Menunjukkan APA yang bisa dilakukan sistem (fungsionalitas dari sudut pandang pengguna)
- Elemen: aktor, use case (elips), relasi (include, extend, generalization)
- Kapan: fase analisis kebutuhan (requirements), komunikasi dengan stakeholder non-teknis
- Tidak menunjukkan BAGAIMANA interaksi terjadi

Sequence Diagram:
- Menunjukkan BAGAIMANA objek berinteraksi dalam urutan waktu
- Elemen: lifeline, message, activation bar, fragment
- Kapan: fase desain, menjelaskan alur logika kepada developer, dasar pembuatan kode
- Lebih teknis dan detail

Untuk fitur Checkout — Sequence Diagram lebih informatif:
Karena checkout melibatkan interaksi antar komponen (Browser, CartController, PaymentGateway, EmailService, Database) dalam urutan yang kritis dan spesifik. Use Case hanya mengatakan "user bisa checkout" tanpa detail alur.

Deskripsi Sequence Diagram Checkout:
Lifeline: :User, :Browser, :CartController, :PaymentGateway, :EmailService, :Database

1. User → Browser: klik "Checkout"
2. Browser → CartController: GET /checkout (sinkron)
3. CartController → Database: SELECT keranjang WHERE id_user=? (sinkron)
4. Database → CartController: <<return>> item_keranjang
5. CartController → Browser: <<return>> halaman checkout + total

6. User → Browser: pilih metode pembayaran + klik "Bayar"
7. Browser → CartController: POST /payment {metode, total} (sinkron)
8. CartController → PaymentGateway: charge(total, metode) (sinkron)
9. PaymentGateway → CartController: <<return>> {status: "sukses", kode_transaksi}

Combined Fragment [alt]:
[sukses]:
10. CartController → Database: INSERT pesanan + UPDATE stok
11. CartController → EmailService: sendConfirmation(email, pesanan) (async)
12. CartController → Browser: <<return>> halaman sukses

[gagal]:
10b. CartController → Browser: <<return>> {error: "Pembayaran gagal"}

Nilai penuh: perbedaan 2 diagram + alasan pilih sequence + deskripsi lifeline + alur lengkap dengan combined fragment alt.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 7, 25);

  -- ==========================================================
  -- TES 2: PEMODELAN DATA LANJUTAN
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Pada pemetaan ERD ke skema relasional, relasi Many-to-Many antara dua entitas diimplementasikan dengan...',
    'pg', 'sedang',
    'Relasi M:N tidak bisa langsung diimplementasikan di tabel relasional (tidak ada kolom yang bisa menyimpan banyak nilai). Solusinya: buat tabel junction/pivot yang menyimpan dua FK (ke masing-masing tabel). Contoh: Mahasiswa M:N Mata_Kuliah → tabel KRS(id_mahasiswa FK, id_matkul FK, nilai).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Menambahkan kolom FK di kedua tabel yang berelasi',false),
    (s,'B','Membuat tabel junction/pivot baru yang menyimpan FK dari kedua entitas',true),
    (s,'C','Menggabungkan kedua tabel menjadi satu tabel besar',false),
    (s,'D','Menggunakan kolom bertipe array untuk menyimpan multiple FK',false),
    (s,'E','Menambahkan primary key gabungan di salah satu tabel',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Normalisasi Boyce-Codd Normal Form (BCNF) mensyaratkan bahwa...',
    'pg', 'sulit',
    'BCNF: untuk setiap functional dependency X → Y, X harus merupakan superkey (dapat menentukan seluruh baris secara unik). BCNF lebih ketat dari 3NF — menghilangkan anomali yang masih bisa ada di 3NF akibat candidate key yang overlapping. Jika tabel di 3NF namun ada FD di mana determinan bukan superkey, perlu decompose ke BCNF.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Tidak ada atribut non-prime yang bergantung transitif pada primary key',false),
    (s,'B','Setiap atribut bergantung penuh pada seluruh primary key (bukan sebagian)',false),
    (s,'C','Untuk setiap functional dependency X → Y, X harus merupakan superkey',true),
    (s,'D','Semua kolom harus berisi nilai atomik (tidak ada repeating group)',false),
    (s,'E','Tidak ada atribut yang bergantung pada atribut non-key lainnya',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Teknik pemodelan data yang memisahkan data historis/lama dari data aktif untuk meningkatkan performa query disebut...',
    'pg', 'sulit',
    'Partitioning membagi tabel besar menjadi bagian-bagian lebih kecil berdasarkan kriteria tertentu (range tanggal, kategori, dll). Data lama (arsip) masuk ke partisi historis, data aktif di partisi terbaru. Query hanya scan partisi relevan (partition pruning), jauh lebih cepat dari full table scan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Sharding',false),
    (s,'B','Replication',false),
    (s,'C','Partitioning',true),
    (s,'D','Archiving',false),
    (s,'E','Clustering',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam ERD, atribut yang nilainya diturunkan/dihitung dari atribut lain (bukan disimpan langsung) digambarkan dengan...',
    'pg', 'sedang',
    'Derived attribute (atribut turunan) digambar dengan elips bergaris putus-putus. Contoh: atribut "umur" yang dihitung dari "tanggal_lahir", atau "total_harga" yang dihitung dari "harga × jumlah". Nilainya tidak disimpan di database melainkan dihitung saat dibutuhkan. Berbeda dengan atribut multi-nilai (elips ganda) dan atribut biasa (elips tunggal).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Elips dengan garis ganda (double ellipse)',false),
    (s,'B','Elips dengan garis putus-putus (dashed ellipse)',true),
    (s,'C','Elips bergaris tebal (bold ellipse)',false),
    (s,'D','Persegi panjang dengan sudut melengkung',false),
    (s,'E','Elips dengan tanda bintang (*) di dalamnya',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Proses "denormalisasi" database dilakukan dengan tujuan...',
    'pg', 'sedang',
    'Denormalisasi: sengaja menambahkan redundansi (duplikasi data) ke dalam database yang sudah ternormalisasi untuk meningkatkan performa baca (READ). Trade-off: lebih cepat untuk query SELECT (kurang JOIN), tapi lebih lambat untuk UPDATE/INSERT (harus update di banyak tempat) dan lebih besar ukuran storage. Digunakan di sistem reporting, data warehouse, atau aplikasi read-heavy.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Menghapus semua data lama agar database lebih bersih',false),
    (s,'B','Memisahkan database menjadi beberapa server untuk distribusi beban',false),
    (s,'C','Sengaja menambahkan redundansi data untuk meningkatkan performa baca (SELECT)',true),
    (s,'D','Mengonversi database relasional ke format NoSQL',false),
    (s,'E','Menghapus index yang tidak terpakai agar INSERT lebih cepat',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Diberikan ERD sistem peminjaman buku perpustakaan dengan entitas: ANGGOTA (id_anggota, nama, email, no_hp, alamat), BUKU (id_buku, isbn, judul, pengarang, stok), KATEGORI (id_kategori, nama_kategori), PEMINJAMAN (tanggal_pinjam, tanggal_kembali, status, denda). Relasi: Anggota MEMINJAM Buku (M:N), Buku BER-KATEGORI (M:N). Ubah ERD ini ke skema relasional lengkap! Tentukan: primary key, foreign key, tabel junction yang diperlukan, dan sertakan minimal 3 constraint penting!',
    'essay', 'sulit',
    'Jawaban ideal:

SKEMA RELASIONAL:

1. ANGGOTA(id_anggota PK, nama NOT NULL, email UNIQUE NOT NULL, no_hp, alamat)

2. BUKU(id_buku PK, isbn UNIQUE NOT NULL, judul NOT NULL, pengarang, stok INT DEFAULT 0 CHECK(stok >= 0))

3. KATEGORI(id_kategori PK, nama_kategori UNIQUE NOT NULL)

4. BUKU_KATEGORI -- tabel junction M:N Buku ↔ Kategori
   (id_buku FK → BUKU.id_buku ON DELETE CASCADE,
    id_kategori FK → KATEGORI.id_kategori ON DELETE RESTRICT,
    PRIMARY KEY(id_buku, id_kategori))

5. PEMINJAMAN -- tabel junction M:N Anggota ↔ Buku + atribut relasi
   (id_peminjaman PK,
    id_anggota FK → ANGGOTA.id_anggota ON DELETE RESTRICT,
    id_buku FK → BUKU.id_buku ON DELETE RESTRICT,
    tanggal_pinjam DATE NOT NULL DEFAULT CURRENT_DATE,
    tanggal_kembali DATE,
    status ENUM(''dipinjam'', ''dikembalikan'', ''terlambat'') DEFAULT ''dipinjam'',
    denda DECIMAL(10,2) DEFAULT 0 CHECK(denda >= 0),
    CONSTRAINT chk_tanggal CHECK(tanggal_kembali IS NULL OR tanggal_kembali >= tanggal_pinjam))

3 CONSTRAINT penting:
1. stok INT CHECK(stok >= 0) → stok tidak boleh negatif
2. FOREIGN KEY ON DELETE RESTRICT pada PEMINJAMAN → buku/anggota tidak bisa dihapus jika masih ada peminjaman aktif (integritas referensial)
3. CONSTRAINT chk_tanggal → tanggal kembali tidak boleh sebelum tanggal pinjam

Nilai penuh: 5 tabel (2 junction) + PK semua tabel + FK tepat + atribut relasi di PEMINJAMAN + 3 constraint dengan penjelasan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Tabel berikut belum ternormalisasi:
PESANAN(id_pesanan, tgl_pesanan, nama_pelanggan, alamat_pelanggan, kode_produk, nama_produk, harga_satuan, jumlah, subtotal, total_pesanan)
Satu pesanan bisa punya banyak produk. Lakukan normalisasi dari UNF → 1NF → 2NF → 3NF! Jelaskan setiap anomali yang dihilangkan di setiap tahap!',
    'essay', 'sedang',
    'Jawaban ideal:

UNF (Unnormalized Form): satu baris bisa punya repeating group (banyak produk).

1NF — hilangkan repeating group:
Buat setiap kombinasi pesanan+produk jadi baris terpisah:
PESANAN_1NF(id_pesanan, tgl_pesanan, nama_pelanggan, alamat_pelanggan, kode_produk, nama_produk, harga_satuan, jumlah, subtotal, total_pesanan)
PK: (id_pesanan, kode_produk) — composite key
Anomali dihilangkan: tidak ada repeating group dalam satu sel.

2NF — hilangkan Partial Dependency (atribut non-key bergantung parsial pada PK composite):
Identifikasi FD:
- id_pesanan → tgl_pesanan, nama_pelanggan, alamat_pelanggan, total_pesanan (bergantung pada id_pesanan saja)
- kode_produk → nama_produk, harga_satuan (bergantung pada kode_produk saja)
- (id_pesanan, kode_produk) → jumlah, subtotal (bergantung pada keduanya)

Decompose:
PESANAN(id_pesanan PK, tgl_pesanan, nama_pelanggan, alamat_pelanggan, total_pesanan)
PRODUK(kode_produk PK, nama_produk, harga_satuan)
DETAIL_PESANAN(id_pesanan FK, kode_produk FK, jumlah, subtotal, PK(id_pesanan, kode_produk))
Anomali dihilangkan: update nama produk cukup di satu tempat (PRODUK), tidak perlu update semua baris pesanan.

3NF — hilangkan Transitive Dependency (atribut non-key bergantung pada atribut non-key lain):
Di tabel PESANAN: total_pesanan bisa dihitung dari DETAIL_PESANAN → ini derived attribute, sebaiknya dihapus atau pindah.
Di tabel DETAIL_PESANAN: subtotal = jumlah × harga_satuan (derived) → hapus kolom subtotal, hitung saat query.
Anomali dihilangkan: tidak ada inkonsistensi antara subtotal tersimpan dan hasil hitung aktual.

SKEMA FINAL 3NF:
PELANGGAN(id_pelanggan PK, nama_pelanggan, alamat_pelanggan) -- opsional jika ada master pelanggan
PESANAN(id_pesanan PK, tgl_pesanan, id_pelanggan FK)
PRODUK(kode_produk PK, nama_produk, harga_satuan)
DETAIL_PESANAN(id_pesanan FK, kode_produk FK, jumlah, PK(id_pesanan, kode_produk))

Nilai penuh: identifikasi anomali UNF + 1NF baris atomik + 2NF identifikasi partial dependency + decompose 3 tabel + 3NF hilangkan transitive dependency + skema final.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 7, 25);

  -- ==========================================================
  -- TES 3: DOKUMENTASI DESAIN SISTEM
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dokumen yang mendeskripsikan arsitektur sistem, komponen-komponen, antarmuka antar komponen, dan keputusan desain teknis disebut...',
    'pg', 'mudah',
    'Software Design Document (SDD) atau System Design Document adalah dokumen teknis yang menjelaskan BAGAIMANA sistem akan dibangun. Berbeda dengan SRS (Software Requirements Specification) yang menjelaskan APA yang harus dilakukan sistem. SDD berisi: arsitektur, komponen, antarmuka, algoritma kunci, keputusan desain dan alasannya.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Software Requirements Specification (SRS)',false),
    (s,'B','Software Design Document (SDD)',true),
    (s,'C','System Test Plan (STP)',false),
    (s,'D','User Manual (UM)',false),
    (s,'E','Project Charter (PC)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam dokumentasi desain, "Architecture Decision Record (ADR)" digunakan untuk...',
    'pg', 'sedang',
    'ADR adalah dokumen singkat yang merekam satu keputusan arsitektur: konteks masalah, pilihan-pilihan yang dipertimbangkan, keputusan yang diambil, dan alasannya. ADR penting agar tim di masa depan mengerti MENGAPA keputusan tertentu dibuat, bukan sekedar APA yang ada di kode.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Mendokumentasikan semua bug yang pernah terjadi dalam proyek',false),
    (s,'B','Merekam keputusan arsitektur penting beserta konteks dan alasan pengambilan keputusan tersebut',true),
    (s,'C','Membuat daftar semua class dan method dalam sistem',false),
    (s,'D','Menentukan jadwal deployment setiap versi aplikasi',false),
    (s,'E','Mendokumentasikan perubahan yang terjadi antar versi (changelog)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Diagram UML yang paling tepat untuk menggambarkan komponen-komponen fisik sistem dan hubungan ketergantungan antar komponen (modul, library, executable) adalah...',
    'pg', 'sedang',
    'Component Diagram menunjukkan komponen sistem (modul, library, service, database) dan hubungan ketergantungan (dependency) antar komponen — mana yang menggunakan/bergantung pada yang lain. Berbeda dengan Deployment Diagram yang menunjukkan penempatan fisik komponen pada hardware/server.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Class Diagram',false),
    (s,'B','Object Diagram',false),
    (s,'C','Component Diagram',true),
    (s,'D','Package Diagram',false),
    (s,'E','Activity Diagram',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Konsep "separation of concerns" dalam desain sistem berarti...',
    'pg', 'mudah',
    'Separation of Concerns: setiap modul/komponen bertanggung jawab hanya pada satu aspek/concern tertentu dan tidak bercampur dengan concern lain. Contoh: logika bisnis dipisah dari logika tampilan, koneksi database dipisah dari pemrosesan data. Ini menghasilkan kode yang lebih modular, mudah diubah, dan mudah di-test.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Sistem harus dibangun oleh tim yang berbeda agar tidak ada konflik',false),
    (s,'B','Setiap database harus dipisahkan ke server yang berbeda',false),
    (s,'C','Setiap modul/komponen bertanggung jawab hanya pada satu aspek tertentu dan tidak bercampur dengan aspek lain',true),
    (s,'D','Kode frontend dan backend harus selalu dijalankan di server yang terpisah',false),
    (s,'E','Setiap fitur harus didokumentasikan secara terpisah dalam dokumen tersendiri',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Bagian dari Software Design Document yang mendeskripsikan bagaimana dua komponen/sistem yang berbeda saling berkomunikasi (format data, protokol, method yang tersedia) disebut...',
    'pg', 'sedang',
    'Interface Design atau API Specification mendeskripsikan "kontrak" antara dua komponen: method/endpoint yang tersedia, format request/response, tipe data, error yang mungkin terjadi. Ini memungkinkan dua tim mengembangkan komponen berbeda secara paralel selama menyepakati interface-nya terlebih dahulu.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Data Design (Desain Data)',false),
    (s,'B','Architecture Overview (Ikhtisar Arsitektur)',false),
    (s,'C','Interface Design / API Specification',true),
    (s,'D','Component Design (Desain Komponen)',false),
    (s,'E','Deployment Specification (Spesifikasi Deployment)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah outline Software Design Document (SDD) untuk aplikasi "Sistem Presensi Sekolah Berbasis QR Code"! SDD harus mencakup: (a) Architecture Overview (jenis arsitektur yang dipilih dan alasannya), (b) deskripsi minimal 4 komponen utama sistem beserta tanggung jawabnya, (c) rancangan antarmuka antar komponen (interface design), (d) desain database (minimal 3 tabel utama), (e) pertimbangan keamanan (security considerations)!',
    'essay', 'sulit',
    'Jawaban ideal:

SISTEM PRESENSI SEKOLAH BERBASIS QR CODE — SDD

(a) Architecture Overview:
Arsitektur: Client-Server dengan pola MVC
- Client: aplikasi mobile (siswa) untuk scan QR + web (guru) untuk monitoring
- Server: backend REST API (Laravel)
- Database: MySQL
Alasan: MVC memisahkan logika bisnis (Model), tampilan (View), dan kontrol alur (Controller) — mudah dikembangkan tim paralel. REST API memungkinkan satu backend untuk multi-platform (web + mobile).

(b) 4 Komponen Utama:
1. QR Generator Service: membuat QR code unik per sesi kelas, berlaku limited time (15 menit), berisi token terenkripsi. Input: id_kelas, id_mapel, timestamp. Output: QR image.
2. Attendance Controller: menerima scan dari siswa, validasi token QR (belum expired, belum dipakai), simpan presensi. Mencegah scan ganda.
3. Report Module: mengolah data presensi menjadi laporan (per siswa, per kelas, per mapel, per periode). Ekspor PDF/Excel.
4. Notification Service: kirim notifikasi ke orang tua jika siswa tidak hadir. Integrasi dengan WhatsApp API atau email.

(c) Interface Design:
- Mobile App ↔ API Server: REST JSON, endpoint POST /api/attendance {token_qr, id_siswa}
- Web ↔ API Server: REST JSON, endpoint GET /api/attendance?kelas=X&tanggal=Y
- API Server ↔ Database: ORM (Eloquent)
- API Server ↔ Notification Service: asynchronous queue (Laravel Jobs)

(d) Database:
SESI_KELAS(id_sesi PK, id_kelas FK, id_mapel FK, token_qr UNIQUE, waktu_mulai, waktu_berakhir, dibuat_oleh FK)
PRESENSI(id_presensi PK, id_siswa FK, id_sesi FK, waktu_scan, status ENUM(hadir/terlambat/alpha), UNIQUE(id_siswa, id_sesi))
KELAS(id_kelas PK, nama_kelas, id_guru_wali FK)

(e) Security Considerations:
- Token QR menggunakan JWT dengan expiry 15 menit — cegah replay attack
- UNIQUE constraint di PRESENSI(id_siswa, id_sesi) — cegah scan ganda
- HTTPS untuk semua komunikasi
- Rate limiting di API endpoint scan — cegah spam request
- Validasi lokasi GPS opsional (siswa harus di area sekolah)

Nilai penuh: arsitektur dengan alasan + 4 komponen + tanggung jawab jelas + interface design + 3 tabel DB + minimal 3 security consideration.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan mengapa dokumentasi desain sistem (SDD) penting dalam proyek pengembangan perangkat lunak! Jelaskan minimal 4 manfaat konkret SDD bagi tim pengembang. Kemudian, bandingkan pendekatan "documentation-first" (buat dokumen lengkap sebelum coding) vs "code-first" (langsung coding, dokumentasi menyusul) — kapan masing-masing pendekatan lebih tepat?',
    'essay', 'sedang',
    'Jawaban ideal:

Pentingnya SDD dan 4 Manfaat Konkret:

1. Panduan bagi developer: SDD menjadi "blueprint" — developer tidak perlu menebak-nebak arsitektur atau keputusan desain. Bisa langsung memulai coding sesuai spesifikasi.

2. Komunikasi tim: tim frontend, backend, mobile, QA, dan database bisa bekerja paralel karena interface antar komponen sudah disepakati di SDD — tidak perlu menunggu satu tim selesai.

3. Onboarding developer baru: anggota tim baru bisa memahami sistem dari SDD tanpa harus membaca seluruh kode atau bertanya ke semua orang.

4. Dasar estimasi dan perencanaan: dari SDD, manajer proyek bisa memecah pekerjaan, memperkirakan waktu per komponen, dan mengidentifikasi risiko teknis lebih awal (sebelum coding dimulai).

5. Bahan review dan audit: reviewer teknis atau klien bisa memvalidasi desain sebelum diimplementasikan — jauh lebih murah mengubah dokumen daripada mengubah kode yang sudah jadi.

Perbandingan Pendekatan:

Documentation-First:
+ Cocok untuk: proyek besar/kompleks, tim besar, sistem kritis (perbankan, kesehatan, pemerintah), kontrak dengan klien, sistem yang dibangun bertahun-tahun
+ Keuntungan: desain matang, koordinasi mudah, mudah estimasi
- Kekurangan: lambat di awal, dokumen bisa tidak sync dengan kode jika tidak diupdate, over-engineering untuk proyek sederhana

Code-First (Agile/iteratif):
+ Cocok untuk: startup, produk baru (MVP), tim kecil, kebutuhan yang masih berubah-ubah, proyek eksperimental
+ Keuntungan: cepat menghasilkan produk yang bisa dicoba, fleksibel merespons perubahan
- Kekurangan: desain bisa tidak konsisten, technical debt menumpuk, onboarding sulit tanpa dokumentasi

Nilai penuh: 4 manfaat konkret + penjelasan per manfaat + perbandingan dua pendekatan + kapan masing-masing tepat.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 7, 25);

  -- ==========================================================
  -- TES 4: PEMODELAN ARSITEKTUR MVC
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam pola arsitektur MVC, komponen yang bertanggung jawab menangani logika bisnis dan akses data adalah...',
    'pg', 'mudah',
    'Model bertanggung jawab atas logika bisnis, validasi data, dan komunikasi dengan database. Model tidak peduli bagaimana data ditampilkan (itu urusan View) atau bagaimana request masuk (itu urusan Controller). Contoh: class SiswaModel menangani CRUD siswa, validasi, kalkulasi nilai rata-rata, dll.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','View',false),
    (s,'B','Controller',false),
    (s,'C','Model',true),
    (s,'D','Router',false),
    (s,'E','Middleware',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Alur request dalam arsitektur MVC yang benar adalah...',
    'pg', 'sedang',
    'Alur MVC: (1) User mengirim request → (2) Controller menerima dan menginterpretasi request → (3) Controller memanggil Model untuk data/logika bisnis → (4) Model mengembalikan data ke Controller → (5) Controller memilih View yang sesuai dan mengirim data → (6) View merender HTML dan dikirim ke user. Controller sebagai "traffic cop".')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','User → View → Model → Controller → User',false),
    (s,'B','User → Model → Controller → View → User',false),
    (s,'C','User → Controller → Model → Controller → View → User',true),
    (s,'D','User → Controller → View → Model → User',false),
    (s,'E','User → View → Controller → Model → View → User',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan utama antara MVC dan MVP (Model-View-Presenter) adalah...',
    'pg', 'sulit',
    'MVC: Controller mengontrol View secara langsung; View bisa langsung mengakses Model untuk binding data (di banyak implementasi). MVP: Presenter bertindak sebagai perantara penuh antara View dan Model — View hanya menampilkan data yang diberikan Presenter, tidak pernah langsung ke Model. MVP lebih testable karena View bisa di-mock. MVP populer di Android development.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','MVP tidak menggunakan database, sedangkan MVC menggunakan database',false),
    (s,'B','Dalam MVP, Presenter menjadi perantara penuh antara View dan Model — View tidak pernah langsung ke Model',true),
    (s,'C','MVC hanya untuk web, MVP hanya untuk aplikasi mobile',false),
    (s,'D','MVP menggabungkan Model dan View menjadi satu komponen',false),
    (s,'E','Keduanya identik — MVP hanya nama lain MVC di framework yang berbeda',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam MVC, kode validasi form (memastikan email valid, password minimal 8 karakter) sebaiknya ditempatkan di...',
    'pg', 'sulit',
    'Validasi logika bisnis (aturan bisnis seperti email unik, password minimum) sebaiknya di Model — ini bagian dari domain logic. Validasi format input dasar (field required, format email) bisa di Controller atau Form Request (Laravel) sebelum data masuk ke Model. JANGAN di View karena bisa di-bypass user.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','View — agar user langsung mendapat feedback tanpa round-trip ke server',false),
    (s,'B','Model — validasi adalah bagian dari logika bisnis dan aturan domain',true),
    (s,'C','Database — dengan menggunakan constraint CHECK di level SQL',false),
    (s,'D','JavaScript di sisi client — agar tidak membebani server',false),
    (s,'E','CSS — dengan atribut required dan pattern di HTML form',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Keuntungan utama penggunaan pola MVC dalam pengembangan aplikasi web adalah...',
    'pg', 'mudah',
    'MVC memisahkan tiga aspek berbeda (data/logika, tampilan, kontrol alur) — ini memungkinkan: (1) pengembangan paralel (tim UI dan backend bekerja terpisah), (2) perubahan tampilan tanpa mengubah logika bisnis, (3) unit testing lebih mudah (test Model tanpa perlu View), (4) kode lebih terorganisir dan mudah dipelihara.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Aplikasi MVC selalu lebih cepat dari aplikasi non-MVC karena memori lebih efisien',false),
    (s,'B','MVC menghilangkan kebutuhan untuk menulis kode SQL sama sekali',false),
    (s,'C','Memisahkan logika bisnis, tampilan, dan kontrol sehingga lebih mudah dikembangkan dan dipelihara secara terpisah',true),
    (s,'D','MVC hanya bisa digunakan dengan framework tertentu seperti Laravel atau Django',false),
    (s,'E','Dengan MVC, satu developer bisa mengerjakan seluruh aplikasi lebih cepat sendirian',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Rancanglah struktur direktori dan penjelasan peran setiap komponen MVC untuk aplikasi "Sistem Nilai Siswa" berbasis web! Sistem ini harus bisa: (a) menampilkan daftar siswa beserta nilai, (b) guru menginput/mengubah nilai, (c) generate laporan nilai per kelas. Jelaskan: file/class apa yang masuk ke Model, Controller, dan View masing-masing, beserta tanggung jawab spesifiknya!',
    'essay', 'sulit',
    'Jawaban ideal:

STRUKTUR DIREKTORI:
app/
  Models/
    Siswa.php         -- Model data siswa
    Nilai.php         -- Model data nilai
    Kelas.php         -- Model data kelas
    Mapel.php         -- Model mata pelajaran
  Controllers/
    SiswaController.php    -- handler request siswa
    NilaiController.php    -- handler input/ubah nilai
    LaporanController.php  -- handler generate laporan
resources/
  views/
    siswa/
      index.blade.php      -- daftar siswa
      show.blade.php       -- detail siswa + nilai
    nilai/
      input.blade.php      -- form input nilai
      edit.blade.php       -- form ubah nilai
    laporan/
      kelas.blade.php      -- laporan nilai per kelas
      print.blade.php      -- versi cetak laporan

PERAN MASING-MASING:

MODEL:
- Siswa.php: relasi ke Kelas (belongsTo), relasi ke Nilai (hasMany), method getNilaiRataRata(), scope aktif
- Nilai.php: relasi ke Siswa (belongsTo), relasi ke Mapel (belongsTo), validasi nilai 0-100, method getKategori() (A/B/C/D/E)
- Kelas.php: relasi ke Siswa (hasMany), method getRataRataKelas()

CONTROLLER:
- SiswaController@index: ambil semua siswa aktif dari Model, kirim ke view index
- SiswaController@show: ambil data 1 siswa + nilai via Model, kirim ke view show
- NilaiController@store: validasi input (0-100, mapel valid), simpan via Model, redirect+flash
- NilaiController@update: validasi + update via Model, catat log perubahan
- LaporanController@kelas: ambil data via Model, hitung agregasi, kirim ke view laporan

VIEW:
- index.blade.php: tabel daftar siswa dengan search/filter kelas, tombol "Lihat Detail"
- input.blade.php: form dengan select mapel, input nilai, tombol simpan, validasi frontend
- kelas.blade.php: tabel nilai semua siswa per kelas, rata-rata, statistik, tombol cetak

Nilai penuh: struktur direktori + 3 Model + 3 Controller + 3 View + tanggung jawab spesifik masing-masing dijelaskan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan apa yang dimaksud "Fat Model, Skinny Controller" dalam konteks MVC! Berikan contoh kode konkret yang menunjukkan: (a) anti-pattern "Fat Controller" yang salah, (b) refactoring yang benar menggunakan "Fat Model, Skinny Controller" untuk fitur yang sama. Gunakan contoh fitur menghitung nilai akhir siswa dari komponen UTS, UAS, dan tugas harian!',
    'essay', 'sedang',
    'Jawaban ideal:

"Fat Model, Skinny Controller" — prinsip bahwa logika bisnis sebaiknya berada di Model, bukan Controller. Controller hanya bertugas: menerima request, memanggil Model, dan mengirim response. "Skinny" = Controller sesimpel mungkin.

(a) ANTI-PATTERN — Fat Controller (SALAH):
// NilaiController.php
public function hitungNilaiAkhir(Request $request, $idSiswa) {
    $siswa = Siswa::find($idSiswa);
    $uts   = $request->uts;
    $uas   = $request->uas;
    $tugas = $request->tugas;

    // LOGIKA BISNIS di Controller — ini SALAH!
    if ($uts < 0 || $uts > 100) return response()->json(["error" => "UTS tidak valid"]);
    if ($uas < 0 || $uas > 100) return response()->json(["error" => "UAS tidak valid"]);
    if ($tugas < 0 || $tugas > 100) return response()->json(["error" => "Tugas tidak valid"]);

    $nilaiAkhir = ($uts * 0.30) + ($uas * 0.40) + ($tugas * 0.30);

    if ($nilaiAkhir >= 90)      $grade = "A";
    elseif ($nilaiAkhir >= 80)  $grade = "B";
    elseif ($nilaiAkhir >= 70)  $grade = "C";
    elseif ($nilaiAkhir >= 60)  $grade = "D";
    else                        $grade = "E";

    $siswa->nilai_akhir = $nilaiAkhir;
    $siswa->grade       = $grade;
    $siswa->save();

    return response()->json(["nilai_akhir" => $nilaiAkhir, "grade" => $grade]);
}

(b) REFACTORING BENAR — Fat Model, Skinny Controller:
// Nilai.php (Model) — logika bisnis di sini
class Nilai extends Model {
    const BOBOT = ["uts" => 0.30, "uas" => 0.40, "tugas" => 0.30];

    public function hitungNilaiAkhir(): float {
        return ($this->uts * self::BOBOT["uts"])
             + ($this->uas * self::BOBOT["uas"])
             + ($this->tugas * self::BOBOT["tugas"]);
    }

    public function getGrade(): string {
        $nilai = $this->hitungNilaiAkhir();
        return match(true) {
            $nilai >= 90 => "A",
            $nilai >= 80 => "B",
            $nilai >= 70 => "C",
            $nilai >= 60 => "D",
            default      => "E",
        };
    }

    protected static function booted() {
        static::saving(function ($model) {
            foreach (["uts","uas","tugas"] as $k)
                if ($model->$k < 0 || $model->$k > 100)
                    throw new \InvalidArgumentException("$k harus antara 0-100.");
        });
    }
}

// NilaiController.php (Skinny) — hanya orkestrasi
public function simpan(Request $request, $idSiswa) {
    $nilai = Nilai::updateOrCreate(
        ["id_siswa" => $idSiswa],
        $request->only(["uts","uas","tugas"])
    );
    return response()->json([
        "nilai_akhir" => $nilai->hitungNilaiAkhir(),
        "grade"       => $nilai->getGrade(),
    ]);
}

Keuntungan: logika di Model bisa di-test unit tanpa HTTP request, bisa dipakai dari mana saja (CLI, queue job, dll).

Nilai penuh: penjelasan prinsip + kode Fat Controller (anti-pattern) + kode refactoring dengan logika di Model + penjelasan keuntungan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 7, 25);

  -- ==========================================================
  -- TES 5: DESIGN PATTERN DASAR
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Design Pattern yang memastikan sebuah class hanya memiliki SATU instance di seluruh aplikasi dan menyediakan titik akses global ke instance tersebut adalah...',
    'pg', 'mudah',
    'Singleton Pattern: konstruktor dibuat private sehingga tidak bisa di-instantiate dari luar; disediakan static method (biasanya getInstance()) yang mengembalikan instance yang sama setiap kali dipanggil. Cocok untuk: koneksi database, konfigurasi aplikasi, logger. Hati-hati: Singleton membuat testing sulit karena state global.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Factory Pattern',false),
    (s,'B','Prototype Pattern',false),
    (s,'C','Singleton Pattern',true),
    (s,'D','Builder Pattern',false),
    (s,'E','Abstract Factory Pattern',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Design Pattern yang mendefinisikan interface untuk membuat objek, tapi membiarkan subclass menentukan class mana yang akan di-instantiate disebut...',
    'pg', 'sedang',
    'Factory Method Pattern: mendelegasikan pembuatan objek ke subclass. Contoh: class NotificationFactory dengan method create() yang di-override oleh EmailNotificationFactory, SMSNotificationFactory, PushNotificationFactory. Client hanya memanggil factory->create() tanpa perlu tahu class konkrit yang dibuat.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Singleton Pattern',false),
    (s,'B','Abstract Factory Pattern',false),
    (s,'C','Factory Method Pattern',true),
    (s,'D','Builder Pattern',false),
    (s,'E','Prototype Pattern',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Design Pattern yang mendefinisikan hubungan one-to-many di mana saat satu objek berubah state, semua dependen-nya diberi notifikasi otomatis adalah...',
    'pg', 'sedang',
    'Observer Pattern (juga dikenal sebagai Publish-Subscribe atau Event-Listener). Subject/Publisher menyimpan daftar Observer/Subscriber. Saat state berubah, Subject memanggil update() pada semua Observer. Contoh: event sistem (UserRegistered → kirim email, buat log, update statistik).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Mediator Pattern',false),
    (s,'B','Command Pattern',false),
    (s,'C','Observer Pattern',true),
    (s,'D','Strategy Pattern',false),
    (s,'E','Chain of Responsibility Pattern',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Pengelompokan Design Pattern menurut Gang of Four (GoF) terdiri dari 3 kategori. Singleton, Factory, Builder termasuk dalam kategori...',
    'pg', 'mudah',
    'GoF membagi 23 design pattern ke 3 kategori: (1) Creational — cara membuat objek (Singleton, Factory Method, Abstract Factory, Builder, Prototype), (2) Structural — cara menyusun class/objek (Adapter, Decorator, Facade, Proxy, Composite, Bridge, Flyweight), (3) Behavioral — cara objek berkomunikasi (Observer, Strategy, Command, Template Method, Iterator, dll).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Structural Patterns',false),
    (s,'B','Behavioral Patterns',false),
    (s,'C','Creational Patterns',true),
    (s,'D','Architectural Patterns',false),
    (s,'E','Concurrency Patterns',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Design Pattern yang menyediakan antarmuka sederhana (simplified interface) ke sistem yang kompleks atau sekumpulan subsistem adalah...',
    'pg', 'sedang',
    'Facade Pattern menyembunyikan kompleksitas subsistem di balik interface yang sederhana. Contoh: class EmailFacade yang menyederhanakan operasi yang melibatkan SMTP connection, template engine, queue, attachment handler — client cukup memanggil EmailFacade::send($to, $subject, $body).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Adapter Pattern',false),
    (s,'B','Proxy Pattern',false),
    (s,'C','Decorator Pattern',false),
    (s,'D','Facade Pattern',true),
    (s,'E','Bridge Pattern',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Implementasikan Singleton Pattern dalam PHP untuk class "DatabaseConnection" yang: (a) konstruktor private agar tidak bisa di-new dari luar, (b) static property untuk menyimpan instance, (c) static method getInstance() yang membuat instance baru jika belum ada atau mengembalikan yang sudah ada, (d) method query() untuk eksekusi SQL. Kemudian jelaskan: kapan Singleton tepat digunakan dan apa risikonya dalam aplikasi modern!',
    'essay', 'sulit',
    'Jawaban ideal:

<?php
class DatabaseConnection {
    private static ?DatabaseConnection $instance = null;
    private PDO $pdo;

    // (a) Konstruktor private
    private function __construct() {
        $this->pdo = new PDO(
            "mysql:host=localhost;dbname=sekolah;charset=utf8",
            "root", "password",
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
    }

    // Cegah clone dan unserialize
    private function __clone() {}
    public function __wakeup() { throw new \Exception("Singleton tidak bisa di-unserialize."); }

    // (c) Static method getInstance()
    public static function getInstance(): DatabaseConnection {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    // (d) Method query
    public function query(string $sql, array $params = []): \PDOStatement {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }
}

// Penggunaan:
$db1 = DatabaseConnection::getInstance();
$db2 = DatabaseConnection::getInstance();
var_dump($db1 === $db2); // true — instance yang sama!

$hasil = DatabaseConnection::getInstance()
    ->query("SELECT * FROM siswa WHERE kelas = ?", ["XI RPL"]);
?>

Kapan tepat digunakan:
- Koneksi database (hindari koneksi baru setiap request)
- Konfigurasi aplikasi (satu sumber kebenaran)
- Logger (satu file logger untuk seluruh aplikasi)
- Cache manager

Risiko dalam aplikasi modern:
1. Sulit di-test (unit test): Singleton menyimpan state global — test pertama bisa mempengaruhi test berikutnya. Susah mock.
2. Hidden dependency: code yang memanggil ::getInstance() tidak deklarasikan dependency secara eksplisit — dependency tersembunyi.
3. Masalah multi-threading: di lingkungan concurrent (multiple threads), bisa ada race condition saat pertama kali membuat instance.
4. Solusi modern: gunakan Dependency Injection Container (DI Container/IoC) yang me-manage lifecycle object — lebih testable.

Nilai penuh: kode lengkap (private constructor + static instance + getInstance() + query()) + __clone() private + kapan tepat + minimal 3 risiko.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Implementasikan Observer Pattern dalam PHP untuk sistem notifikasi pada aplikasi e-learning! Skenario: saat guru mem-publish tugas baru, sistem harus secara otomatis: (a) mengirim email ke semua siswa, (b) mencatat log aktivitas ke database, (c) mengirim push notification ke aplikasi mobile. Implementasikan interface Observer, Subject, minimal 3 ConcreteObserver, dan demonstrasikan penggunaannya!',
    'essay', 'sedang',
    'Jawaban ideal:

<?php
// Interface Observer — semua notifier harus implementasi ini
interface Observer {
    public function update(string $event, array $data): void;
}

// Interface Subject — object yang bisa di-observe
interface Subject {
    public function subscribe(Observer $observer): void;
    public function unsubscribe(Observer $observer): void;
    public function notify(string $event, array $data): void;
}

// Subject: TugasService
class TugasService implements Subject {
    private array $observers = [];

    public function subscribe(Observer $observer): void {
        $this->observers[] = $observer;
    }

    public function unsubscribe(Observer $observer): void {
        $this->observers = array_filter(
            $this->observers,
            fn($o) => $o !== $observer
        );
    }

    public function notify(string $event, array $data): void {
        foreach ($this->observers as $observer) {
            $observer->update($event, $data);
        }
    }

    public function publishTugas(array $tugas): void {
        // logika simpan tugas ke DB...
        echo "Tugas ''{$tugas[''judul'']}'' berhasil dipublish.\n";

        // Notifikasi semua observer
        $this->notify(''tugas.published'', $tugas);
    }
}

// (a) ConcreteObserver: Email
class EmailNotifier implements Observer {
    public function update(string $event, array $data): void {
        if ($event !== ''tugas.published'') return;
        // Kirim email ke semua siswa (simulasi)
        echo "[EMAIL] Mengirim email notifikasi tugas ''{$data[''judul'']}'' ke semua siswa kelas {$data[''kelas'']}.\n";
    }
}

// (b) ConcreteObserver: Log
class ActivityLogger implements Observer {
    public function update(string $event, array $data): void {
        // Catat ke database log_aktivitas
        echo "[LOG] Mencatat: Tugas ''{$data[''judul'']}'' dipublish oleh guru id={$data[''id_guru'']} pada " . date(''Y-m-d H:i:s'') . ".\n";
    }
}

// (c) ConcreteObserver: Push Notification
class PushNotifier implements Observer {
    public function update(string $event, array $data): void {
        if ($event !== ''tugas.published'') return;
        echo "[PUSH] Mengirim push notification: Tugas baru ''{$data[''judul'']}'' telah diterbitkan!\n";
    }
}

// Penggunaan:
$tugasService = new TugasService();
$tugasService->subscribe(new EmailNotifier());
$tugasService->subscribe(new ActivityLogger());
$tugasService->subscribe(new PushNotifier());

$tugasService->publishTugas([
    ''judul''   => ''UTS Pemrograman Web'',
    ''kelas''   => ''XI RPL'',
    ''id_guru'' => 42,
    ''deadline'' => ''2024-12-20'',
]);

// Output:
// Tugas ''UTS Pemrograman Web'' berhasil dipublish.
// [EMAIL] Mengirim email notifikasi tugas ''UTS Pemrograman Web'' ke semua siswa kelas XI RPL.
// [LOG] Mencatat: Tugas ''UTS Pemrograman Web'' dipublish oleh guru id=42 ...
// [PUSH] Mengirim push notification: Tugas baru ''UTS Pemrograman Web'' telah diterbitkan!
?>

Keuntungan: TugasService tidak tahu tentang email/log/push — loose coupling. Observer baru bisa ditambahkan tanpa mengubah TugasService (Open/Closed Principle).

Nilai penuh: interface Observer + interface Subject + TugasService sebagai Subject + 3 ConcreteObserver + demonstrasi + keuntungan loose coupling disebutkan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 7, 25);

  -- ==========================================================
  -- TES 6: PEMODELAN REST API
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'HTTP method yang tepat untuk membuat resource baru dalam REST API adalah...',
    'pg', 'mudah',
    'Konvensi REST: POST = membuat resource baru (server menentukan ID). PUT = mengganti resource secara penuh (idempotent). PATCH = mengupdate sebagian field. GET = membaca (idempotent, safe). DELETE = menghapus. POST ke /api/siswa akan membuat siswa baru dengan ID yang ditentukan server.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','GET',false),
    (s,'B','PUT',false),
    (s,'C','POST',true),
    (s,'D','PATCH',false),
    (s,'E','CREATE',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'HTTP Status Code yang menunjukkan resource berhasil dibuat (Created) adalah...',
    'pg', 'mudah',
    '201 Created = resource baru berhasil dibuat (response dari POST yang sukses). 200 OK = request sukses (GET/PUT/PATCH). 204 No Content = sukses tapi tidak ada body response (DELETE). 400 Bad Request = data request tidak valid. 404 Not Found = resource tidak ditemukan. 401 Unauthorized = belum autentikasi. 403 Forbidden = tidak punya izin.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','200 OK',false),
    (s,'B','201 Created',true),
    (s,'C','204 No Content',false),
    (s,'D','202 Accepted',false),
    (s,'E','200 Created',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Prinsip REST yang menyatakan server tidak boleh menyimpan state client di antara request disebut...',
    'pg', 'sedang',
    'Statelessness: setiap request dari client harus mengandung semua informasi yang dibutuhkan server untuk memproses request tersebut — server tidak menyimpan session/context dari request sebelumnya. Konsekuensi: token autentikasi (JWT) harus dikirim di setiap request di header Authorization, bukan di cookie session server.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Uniform Interface',false),
    (s,'B','Layered System',false),
    (s,'C','Statelessness',true),
    (s,'D','Cacheable',false),
    (s,'E','Code on Demand',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Desain endpoint REST API yang paling sesuai konvensi untuk mendapatkan semua nilai dari siswa dengan id=5 adalah...',
    'pg', 'sulit',
    'REST convention: gunakan URL hirarkis untuk resource yang bersarang. /api/siswa/5/nilai = "nilai milik siswa 5" — lebih ekspresif dari /api/nilai?id_siswa=5. Gunakan noun (kata benda) bukan verb di URL, gunakan plural (siswa bukan siswa), HTTP method menentukan aksi (GET=baca, POST=buat, dll).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','GET /api/getNilaiSiswa/5',false),
    (s,'B','POST /api/nilai/getSiswa',false),
    (s,'C','GET /api/siswa/5/nilai',true),
    (s,'D','GET /api/nilaiSiswa?id=5',false),
    (s,'E','GET /api/fetch-nilai-siswa-5',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan antara PUT dan PATCH dalam REST API adalah...',
    'pg', 'sedang',
    'PUT = replace/ganti resource secara penuh. Semua field harus dikirim, field yang tidak dikirim akan menjadi null/default. Idempotent. PATCH = update sebagian field saja. Hanya field yang dikirim yang diubah, field lain tetap. Lebih efisien untuk update parsial. Contoh: update email saja → PATCH lebih tepat daripada PUT yang mengharuskan kirim semua data.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','PUT untuk update data lama, PATCH untuk update data baru',false),
    (s,'B','PUT untuk mengganti resource secara penuh; PATCH untuk memperbarui sebagian field saja',true),
    (s,'C','Keduanya identik — pilih salah satu sesuai preferensi',false),
    (s,'D','PATCH lebih aman dari PUT karena selalu menggunakan enkripsi',false),
    (s,'E','PUT bisa dipakai di browser biasa, PATCH membutuhkan library khusus',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Rancanglah dokumentasi REST API untuk "Sistem Manajemen Tugas Siswa"! Dokumentasi harus mencakup minimal 5 endpoint dengan: method HTTP, URL, deskripsi, request body (JSON), response sukses (JSON + status code), dan response error (JSON + status code). Resource yang harus ada: Tugas (CRUD), Submit Jawaban, dan Lihat Nilai!',
    'essay', 'sulit',
    'Jawaban ideal:

BASE URL: https://api.sekolah.id/v1

1. GET /tugas
   Deskripsi: Ambil semua tugas aktif (untuk siswa yang sedang login)
   Headers: Authorization: Bearer {token}
   Response 200:
   { "data": [{ "id": 1, "judul": "UTS Web", "deadline": "2024-12-20", "status": "belum_dikerjakan" }], "total": 10 }

2. GET /tugas/{id}
   Deskripsi: Detail satu tugas beserta soal-soalnya
   Response 200: { "data": { "id": 1, "judul": "UTS Web", "soal": [...] } }
   Response 404: { "error": "Tugas tidak ditemukan", "code": "TUGAS_NOT_FOUND" }

3. POST /tugas  [GURU]
   Deskripsi: Buat tugas baru
   Request Body: { "judul": "UTS Web", "id_kelas": 3, "deadline": "2024-12-20", "soal": [...] }
   Response 201: { "data": { "id": 5, "judul": "UTS Web" }, "message": "Tugas berhasil dibuat" }
   Response 400: { "errors": { "judul": ["Judul wajib diisi"], "deadline": ["Deadline harus di masa depan"] } }

4. POST /tugas/{id}/submit  [SISWA]
   Deskripsi: Kirim jawaban tugas
   Request Body: { "jawaban": [{ "id_soal": 1, "jawaban": "B" }, { "id_soal": 2, "jawaban": "Penjelasan essay..." }] }
   Response 201: { "data": { "id_pengumpulan": 99, "status": "submitted", "nilai_pg": 50 }, "message": "Jawaban berhasil dikirim" }
   Response 409: { "error": "Tugas sudah pernah dikumpulkan", "code": "ALREADY_SUBMITTED" }

5. GET /tugas/{id}/nilai  [SISWA]
   Deskripsi: Lihat nilai tugas setelah semua soal selesai dinilai
   Response 200: { "data": { "nilai_akhir": 85, "nilai_pg": 50, "nilai_essay": 35, "status": "selesai" } }
   Response 403: { "error": "Nilai belum tersedia — masih ada essay yang belum dinilai", "code": "NILAI_BELUM_TERSEDIA" }

6. PATCH /tugas/{id}  [GURU]
   Deskripsi: Update sebagian field tugas (misal perpanjang deadline)
   Request Body: { "deadline": "2024-12-25" }
   Response 200: { "data": { "id": 1, "deadline": "2024-12-25" }, "message": "Tugas diperbarui" }

Konvensi:
- Semua response dalam JSON
- Error response selalu ada "error" dan "code" untuk handling di client
- Versioning di URL (/v1/) untuk backward compatibility
- HTTP status code sesuai semantik REST

Nilai penuh: 5+ endpoint + method + URL RESTful (noun, bukan verb) + request/response JSON + status code sukses DAN error untuk masing-masing.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan 6 prinsip/constraint REST (Representational State Transfer) menurut Roy Fielding! Kemudian bandingkan pendekatan REST vs GraphQL: apa kelebihan dan kekurangan masing-masing, dan kapan sebaiknya memilih GraphQL daripada REST?',
    'essay', 'sedang',
    'Jawaban ideal:

6 PRINSIP REST:

1. Client-Server: pemisahan antara UI (client) dan penyimpanan data (server). Keduanya bisa berkembang secara independen.

2. Statelessness: setiap request mengandung semua informasi yang dibutuhkan. Server tidak menyimpan state client. Lebih scalable karena request bisa ditangani server mana saja.

3. Cacheable: response harus menandai apakah bisa di-cache atau tidak (header Cache-Control). Cache mengurangi beban server dan mempercepat response.

4. Uniform Interface: antarmuka seragam antara client-server — identifikasi resource via URL, manipulasi via representasi, self-descriptive messages, HATEOAS (Hypermedia as the Engine of Application State).

5. Layered System: client tidak perlu tahu apakah berkomunikasi langsung ke server atau via proxy/load balancer/CDN. Memungkinkan keamanan dan skalabilitas.

6. Code on Demand (opsional): server boleh mengirim executable code ke client (misalnya JavaScript). Satu-satunya constraint opsional.

PERBANDINGAN REST vs GraphQL:

REST:
+ Sederhana, mudah dipahami, tooling mature (Postman, Swagger)
+ Caching HTTP native (GET requests bisa di-cache CDN)
+ Cocok untuk: API sederhana, public API, microservices
- Over-fetching (ambil banyak field yang tidak dipakai)
- Under-fetching (perlu banyak request untuk data yang terkait)
- Versi API (v1, v2) sering menjadi masalah

GraphQL:
+ Client menentukan persis data yang dibutuhkan — tidak ada over/under fetching
+ Single endpoint (/graphql) untuk semua operasi
+ Strongly typed schema = dokumentasi otomatis
+ Ideal untuk: frontend yang butuh data fleksibel, mobile app (bandwidth terbatas), dashboard kompleks
- Lebih kompleks di server (resolver, schema definition)
- Caching lebih sulit (query berbeda-beda)
- Overkill untuk API sederhana

Kapan pilih GraphQL:
- Mobile app yang harus hemat bandwidth
- Frontend berbeda (web, mobile, tablet) butuh shape data berbeda
- Dashboard dengan banyak widget yang masing-masing butuh data berbeda

Nilai penuh: 6 prinsip REST dijelaskan + REST vs GraphQL dengan kelebihan/kekurangan + kapan pilih GraphQL.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 7, 25);

  RAISE NOTICE 'Seed berhasil: 1 kompetensi "Pemodelan Perangkat Lunak Lanjutan" (tingkat=11, urutan=2), 6 tes, 42 soal (30 PG 5-opsi + 12 essay).';
END $$;
