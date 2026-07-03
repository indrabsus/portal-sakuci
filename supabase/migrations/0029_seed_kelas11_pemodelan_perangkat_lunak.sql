-- ============================================================
-- Seed: Roadmap Kompetensi Kelas XI
-- 1 Kompetensi: Pemodelan Perangkat Lunak (urutan 2)
-- 5 Tes Kompetensi (5 PG 5-opsi + 2 Essay per tes)
-- Jalankan di Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  v_jur uuid;

  k1 uuid; -- kompetensi

  t1 uuid; -- Rekayasa Kebutuhan
  t2 uuid; -- UML Dasar (Use Case Diagram)
  t3 uuid; -- Activity Diagram
  t4 uuid; -- Dokumentasi Kebutuhan
  t5 uuid; -- Class Diagram

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
    'Pemodelan Perangkat Lunak',
    'Memahami dan menerapkan teknik pemodelan perangkat lunak menggunakan UML (Unified Modeling Language) mulai dari rekayasa kebutuhan, use case, activity diagram, class diagram, hingga dokumentasi kebutuhan perangkat lunak.',
    11, 2, 70, true)
  RETURNING id_kompetensi INTO k1;

  -- ----------------------------------------------------------
  -- 2. KOMPETENSI_TUGAS
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Rekayasa Kebutuhan',
    'Tes pemahaman konsep rekayasa kebutuhan perangkat lunak, jenis-jenis kebutuhan, dan teknik elisitasi.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t1;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'UML Dasar (Use Case Diagram)',
    'Tes kemampuan membaca dan membuat use case diagram beserta komponen-komponennya.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t2;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Activity Diagram',
    'Tes kemampuan membuat activity diagram untuk memodelkan alur kerja/proses bisnis suatu sistem.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t3;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Dokumentasi Kebutuhan',
    'Tes kemampuan menyusun dokumen Software Requirements Specification (SRS) dan user story.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t4;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Class Diagram',
    'Tes kemampuan membuat class diagram beserta atribut, method, dan relasi antar kelas (asosiasi, agregasi, komposisi, generalisasi).', 'aktif')
  RETURNING id_kompetensi_tugas INTO t5;

  -- ==========================================================
  -- TES 1: REKAYASA KEBUTUHAN
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Kebutuhan yang mendeskripsikan LAYANAN/FUNGSI yang harus disediakan oleh sistem (apa yang sistem lakukan) disebut...',
    'pg', 'mudah',
    'Functional Requirements = kebutuhan fungsional, mendefinisikan fungsi/layanan yang harus disediakan sistem. Contoh: "sistem harus bisa menyimpan data siswa", "sistem harus bisa mencetak laporan nilai". Non-functional Requirements = kualitas sistem (kecepatan, keamanan, ketersediaan).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Non-Functional Requirements',false),
    (s,'B','System Requirements',false),
    (s,'C','Functional Requirements',true),
    (s,'D','User Requirements',false),
    (s,'E','Domain Requirements',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Kebutuhan non-fungsional yang berkaitan dengan berapa banyak pengguna yang dapat mengakses sistem secara bersamaan tanpa penurunan performa disebut...',
    'pg', 'sedang',
    'Scalability/Capacity adalah kebutuhan non-fungsional yang menentukan kapasitas sistem dalam menangani beban pengguna. Performance = kecepatan respons. Availability = waktu aktif sistem. Security = keamanan data. Usability = kemudahan penggunaan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Reliability',false),
    (s,'B','Security',false),
    (s,'C','Usability',false),
    (s,'D','Scalability / Capacity',true),
    (s,'E','Maintainability',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Teknik pengumpulan kebutuhan dengan cara mewawancarai pengguna/stakeholder secara langsung disebut...',
    'pg', 'mudah',
    'Elisitasi kebutuhan dapat dilakukan dengan: Wawancara (interview) — bertanya langsung ke stakeholder; Kuesioner — angket tertulis; Observasi — mengamati cara kerja pengguna; FGD (Focus Group Discussion); Prototyping — membuat prototipe untuk mendapat feedback.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Brainstorming',false),
    (s,'B','Prototyping',false),
    (s,'C','Observasi',false),
    (s,'D','Kuesioner',false),
    (s,'E','Wawancara (Interview)',true);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Masalah yang sering terjadi dalam rekayasa kebutuhan di mana pengguna dan developer memiliki pemahaman berbeda tentang kebutuhan yang sama disebut...',
    'pg', 'sedang',
    'Ambiguitas kebutuhan terjadi karena bahasa alami memiliki makna ganda. Solusi: gunakan bahasa formal, diagram, prototipe, atau glosarium. Ini adalah salah satu tantangan terbesar dalam rekayasa kebutuhan karena menjadi akar penyebab kegagalan proyek.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Kebutuhan yang berkonflik (conflicting requirements)',false),
    (s,'B','Kebutuhan yang tidak lengkap (incomplete requirements)',false),
    (s,'C','Ambiguitas kebutuhan (ambiguous requirements)',true),
    (s,'D','Kebutuhan yang berubah-ubah (volatile requirements)',false),
    (s,'E','Kebutuhan yang tidak terukur (unmeasurable requirements)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Proses memastikan bahwa sistem yang dibangun sudah sesuai dengan kebutuhan yang telah didefinisikan sebelumnya disebut...',
    'pg', 'sedang',
    'Validasi kebutuhan = memastikan kebutuhan yang terdokumentasi mencerminkan keinginan sesungguhnya dari stakeholder (membangun sistem yang BENAR). Verifikasi = memastikan sistem dibangun sesuai spesifikasi (membangun sistem DENGAN BENAR). Keduanya berbeda tapi saling melengkapi.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Verifikasi Kebutuhan',false),
    (s,'B','Analisis Kebutuhan',false),
    (s,'C','Elisitasi Kebutuhan',false),
    (s,'D','Validasi Kebutuhan',true),
    (s,'E','Dokumentasi Kebutuhan',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Sebuah SMK ingin membangun Sistem Informasi Perpustakaan Digital. Sebagai analis sistem, jelaskan: (a) apa yang dimaksud rekayasa kebutuhan dan mengapa penting, (b) identifikasi minimal 5 kebutuhan FUNGSIONAL sistem tersebut, (c) identifikasi minimal 3 kebutuhan NON-FUNGSIONAL, dan (d) sebutkan teknik elisitasi yang akan kamu gunakan beserta alasannya!',
    'essay', 'sedang',
    'Jawaban ideal:

(a) Rekayasa Kebutuhan = proses sistematis untuk mengidentifikasi, mendokumentasikan, dan mengelola kebutuhan suatu sistem perangkat lunak sebelum dikembangkan. Penting karena: kesalahan kebutuhan di awal jauh lebih mahal diperbaiki daripada di tahap akhir; meminimalkan risiko kegagalan proyek.

(b) 5 Kebutuhan Fungsional Perpustakaan Digital:
1. Sistem harus dapat mendaftarkan anggota perpustakaan baru
2. Sistem harus dapat mencari buku berdasarkan judul, pengarang, atau kategori
3. Sistem harus dapat mencatat peminjaman dan pengembalian buku
4. Sistem harus dapat menghitung dan menampilkan denda keterlambatan
5. Sistem harus dapat membuat laporan data peminjaman per periode
6. Sistem harus menampilkan stok buku yang tersedia secara real-time

(c) 3 Kebutuhan Non-Fungsional:
1. Performance: sistem harus merespons pencarian buku dalam < 2 detik
2. Security: hanya admin yang dapat mengubah data buku dan anggota
3. Availability: sistem harus dapat diakses 24 jam sehari, 7 hari seminggu

(d) Teknik Elisitasi:
- Wawancara: mewawancarai petugas perpustakaan dan siswa untuk memahami proses kerja nyata
- Observasi: mengamati langsung proses peminjaman manual untuk memahami alurnya
- Kuesioner: menyebarkan angket ke siswa tentang fitur yang diinginkan

Nilai penuh: definisi + alasan (a) + min 5 kebutuhan fungsional (b) + min 3 non-fungsional (c) + teknik dengan alasan (d).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara "kebutuhan pengguna" (user requirements) dan "kebutuhan sistem" (system requirements)! Kemudian berikan contoh masing-masing untuk sistem kasir toko, dan jelaskan mengapa keduanya perlu didokumentasikan secara terpisah!',
    'essay', 'sulit',
    'Jawaban ideal:

User Requirements = pernyataan tingkat tinggi dari sudut pandang pengguna tentang apa yang harus dilakukan sistem, ditulis dalam bahasa alami tanpa detail teknis. Ditujukan untuk stakeholder non-teknis.

System Requirements = deskripsi teknis dan rinci tentang layanan dan batasan sistem. Ditujukan untuk developer/engineer. Merupakan turunan dari user requirements.

Contoh Sistem Kasir:
User Requirement: "Kasir harus bisa memproses transaksi pembayaran dengan cepat dan mencetak struk."
System Requirements (turunannya):
1. Sistem harus menghitung total belanja secara otomatis saat item di-scan
2. Sistem harus mendukung pembayaran tunai, kartu debit, dan QRIS
3. Sistem harus mencetak struk dalam format tertentu dalam < 3 detik
4. Sistem harus memperbarui stok produk secara otomatis setiap transaksi
5. Sistem harus menyimpan log setiap transaksi dengan timestamp

Mengapa dipisahkan:
- User requirements ditulis untuk komunikasi dengan stakeholder/klien (non-teknis)
- System requirements ditulis sebagai panduan teknis untuk developer
- Memisahkan keduanya mencegah stakeholder terbebani detail teknis
- Memudahkan traceability: setiap system requirement dapat ditelusuri ke user requirement asal

Nilai penuh: definisi keduanya berbeda jelas + contoh user req kasir + min 3 system req turunan + alasan pemisahan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 7, 25);

  -- ==========================================================
  -- TES 2: UML DASAR (USE CASE DIAGRAM)
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam use case diagram, simbol orang (stick figure) yang berinteraksi dengan sistem disebut...',
    'pg', 'mudah',
    'Actor adalah pengguna atau sistem eksternal yang berinteraksi dengan sistem yang dimodelkan. Aktor bisa berupa manusia (kasir, admin, siswa) atau sistem lain (payment gateway, email server). Aktor digambarkan sebagai stick figure di luar batas sistem.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Use Case',false),
    (s,'B','Actor',true),
    (s,'C','Association',false),
    (s,'D','System Boundary',false),
    (s,'E','Stakeholder',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Relasi «include» dalam use case diagram berarti...',
    'pg', 'sedang',
    '«include» = use case A SELALU memanggil use case B (B wajib dijalankan saat A dijalankan). Contoh: "Bayar Tagihan" selalu include "Autentikasi Pengguna". «extend» = use case B OPSIONAL menambah perilaku ke use case A (hanya dalam kondisi tertentu).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Use case yang satu merupakan pilihan opsional dari use case yang lain',false),
    (s,'B','Satu aktor mewarisi peran dari aktor lain',false),
    (s,'C','Use case yang satu secara wajib menyertakan (memanggil) use case yang lain',true),
    (s,'D','Use case yang satu memperluas fungsionalitas use case lain secara opsional',false),
    (s,'E','Dua use case yang tidak bisa dijalankan bersamaan',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam use case diagram, kotak persegi panjang yang mengelilingi semua use case menggambarkan...',
    'pg', 'mudah',
    'System Boundary (batas sistem) = kotak persegi panjang yang memisahkan apa yang ada DI DALAM sistem (use case) dengan apa yang ada DI LUAR sistem (actor). Semua use case berada di dalam kotak, semua aktor berada di luar.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Package',false),
    (s,'B','Module',false),
    (s,'C','System Boundary (Batas Sistem)',true),
    (s,'D','Database',false),
    (s,'E','Interface',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Pada sistem e-commerce, "Admin" bisa melakukan semua hal yang bisa dilakukan "Pelanggan" ditambah fitur manajemen produk. Relasi yang tepat antara aktor Admin dan Pelanggan adalah...',
    'pg', 'sedang',
    'Generalisasi/Inheritance aktor: Admin mewarisi (generalize) semua kemampuan Pelanggan dan menambahkan kemampuan lebih. Arah panah dari aktor anak (Admin) ke aktor induk (Pelanggan). Ini sama seperti konsep inheritance dalam OOP.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','«include»',false),
    (s,'B','«extend»',false),
    (s,'C','Asosiasi biasa',false),
    (s,'D','Generalisasi (Inheritance)',true),
    (s,'E','Dependensi',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan utama antara relasi «include» dan «extend» dalam use case diagram adalah...',
    'pg', 'sulit',
    'Kunci perbedaan: INCLUDE = wajib selalu dieksekusi (mandatory), arah panah dari use case pemanggil KE use case yang dipanggil. EXTEND = kondisional/opsional, arah panah dari use case tambahan KE use case utama. Contoh include: Login wajib saat Bayar. Contoh extend: Tampilkan Pesan Error opsional saat Login Gagal.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','«include» opsional sedangkan «extend» wajib dilakukan',false),
    (s,'B','«include» dan «extend» keduanya opsional, hanya berbeda arah panah',false),
    (s,'C','«include» wajib dilakukan setiap saat; «extend» hanya dilakukan pada kondisi tertentu (opsional)',true),
    (s,'D','«include» dipakai untuk aktor, «extend» dipakai untuk use case',false),
    (s,'E','Keduanya identik, hanya beda istilah saja',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah use case diagram (dalam bentuk deskripsi teks terstruktur) untuk Sistem Peminjaman Buku Perpustakaan dengan ketentuan: (a) identifikasi minimal 3 aktor, (b) identifikasi minimal 6 use case, (c) tunjukkan minimal 1 relasi «include» dan 1 relasi «extend» beserta alasannya, (d) tuliskan skenario lengkap (basic flow + alternative flow) untuk use case "Pinjam Buku"!',
    'essay', 'sulit',
    'Jawaban ideal:

(a) Aktor:
- Anggota (siswa/pengguna perpustakaan)
- Petugas Perpustakaan
- Admin (mewarisi semua akses Petugas)

(b) Use Case:
1. Login
2. Cari Buku
3. Pinjam Buku
4. Kembalikan Buku
5. Lihat Riwayat Peminjaman
6. Kelola Data Buku (Admin/Petugas)
7. Cetak Kartu Anggota
8. Bayar Denda

(c) Relasi:
- «include»: "Pinjam Buku" include "Login" → karena setiap kali meminjam, pengguna WAJIB sudah login terlebih dahulu.
- «extend»: "Bayar Denda" extend "Kembalikan Buku" → karena pembayaran denda hanya terjadi JIKA buku terlambat dikembalikan (kondisional).

(d) Skenario "Pinjam Buku":
Aktor: Anggota, Petugas
Prasyarat: Anggota sudah login, buku tersedia

Basic Flow:
1. Anggota memilih buku yang ingin dipinjam
2. Sistem menampilkan detail buku dan status ketersediaan
3. Anggota mengklik "Pinjam"
4. Sistem mengecek status keanggotaan dan batas peminjaman
5. Sistem mencatat peminjaman dan mengubah status buku menjadi "dipinjam"
6. Sistem menampilkan konfirmasi peminjaman dan batas tanggal kembali

Alternative Flow:
- Jika buku tidak tersedia: sistem menampilkan pesan "Buku sedang dipinjam" dan menawarkan fitur reservasi
- Jika anggota sudah mencapai batas peminjaman: sistem menolak dan menampilkan pesan error

Nilai penuh: 3 aktor + 6 use case + include & extend dengan alasan + skenario basic + alternative flow.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan tujuan dan kegunaan use case diagram dalam pengembangan perangkat lunak! Kemudian identifikasi aktor-aktor dan use case untuk Sistem Informasi Akademik Sekolah (SIAS), kelompokkan berdasarkan aktornya, dan jelaskan mengapa use case "Login" sebaiknya dijadikan «include» dari hampir semua use case!',
    'essay', 'sedang',
    'Jawaban ideal:

Tujuan Use Case Diagram:
1. Menggambarkan fungsionalitas sistem dari perspektif pengguna
2. Mendefinisikan batasan sistem (apa yang ada di dalam dan di luar sistem)
3. Menjadi alat komunikasi antara developer dan stakeholder non-teknis
4. Dasar untuk menyusun skenario pengujian (test case)

Aktor dan Use Case SIAS:
Siswa: Login, Lihat Jadwal, Lihat Nilai, Download Materi, Submit Tugas, Lihat Absensi
Guru: Login, Input Nilai, Unggah Materi, Buat Tugas, Kelola Absensi, Lihat Data Siswa
Admin: Login, Kelola Data Siswa, Kelola Data Guru, Atur Jadwal, Buat Laporan
Orang Tua (opsional): Login, Pantau Nilai Anak, Lihat Absensi Anak

Mengapa Login dijadikan «include»:
- Setiap aksi di sistem memerlukan identifikasi pengguna agar sistem tahu siapa yang mengakses dan level aksesnya
- Tanpa login, sistem tidak bisa menampilkan data yang sesuai (nilai siswa A tidak boleh dilihat siswa B)
- Login menjadi prasyarat wajib (mandatory) untuk semua fungsi utama sistem
- Ini memastikan keamanan dan integritas data (authentication)

Nilai penuh: 4 tujuan use case + aktor SIAS lengkap + use case per aktor logis + penjelasan login sebagai include.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 7, 25);

  -- ==========================================================
  -- TES 3: ACTIVITY DIAGRAM
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Simbol titik hitam bulat (filled circle) pada activity diagram menandakan...',
    'pg', 'mudah',
    'Initial Node (titik hitam penuh) = titik mulai aktivitas. Final Node (lingkaran dengan titik hitam di dalam / bullseye) = titik akhir aktivitas. Activity = persegi panjang berujung bulat. Decision = belah ketupat. Fork/Join = garis tebal horizontal/vertikal.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Akhir dari seluruh aktivitas (Final Node)',false),
    (s,'B','Titik keputusan (Decision Node)',false),
    (s,'C','Awal dari aktivitas (Initial Node)',true),
    (s,'D','Penggabungan alur (Merge Node)',false),
    (s,'E','Aktivitas yang sedang berjalan',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam activity diagram, simbol belah ketupat (diamond) digunakan untuk menggambarkan...',
    'pg', 'mudah',
    'Decision Node (belah ketupat) = titik percabangan alur berdasarkan kondisi. Ada satu alur masuk dan beberapa alur keluar dengan kondisi (guard condition) pada tiap jalur. Contoh: [stok tersedia] → lanjut pesan; [stok habis] → tampilkan pesan error.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Aktivitas paralel yang berjalan bersamaan',false),
    (s,'B','Titik mulai aktivitas',false),
    (s,'C','Percabangan alur berdasarkan kondisi (Decision/Branch)',true),
    (s,'D','Penggabungan beberapa alur menjadi satu',false),
    (s,'E','Akhir dari sebuah alur (bukan seluruh aktivitas)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Komponen activity diagram yang digunakan untuk memisahkan aktivitas berdasarkan siapa yang bertanggung jawab mengerjakannya disebut...',
    'pg', 'sedang',
    'Swimlane (jalur renang) = partisi vertikal atau horizontal yang mengelompokkan aktivitas berdasarkan aktor/pihak yang bertanggung jawab. Contoh: swimlane "Pelanggan", "Kasir", "Sistem" — memperjelas siapa melakukan apa dalam proses bisnis.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Fork Node',false),
    (s,'B','Partition / Swimlane',true),
    (s,'C','Object Node',false),
    (s,'D','Signal Node',false),
    (s,'E','Guard Condition',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Garis tebal horizontal/vertikal dalam activity diagram yang memecah satu alur menjadi beberapa alur yang berjalan BERSAMAAN disebut...',
    'pg', 'sedang',
    'Fork Node = garis tebal yang memecah satu alur menjadi beberapa alur paralel (concurrent). Join Node = garis tebal yang menggabungkan kembali beberapa alur paralel menjadi satu. Keduanya memungkinkan pemodelan aktivitas yang berjalan secara bersamaan (paralel).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Decision Node',false),
    (s,'B','Merge Node',false),
    (s,'C','Initial Node',false),
    (s,'D','Fork Node',true),
    (s,'E','Flow Final Node',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan utama antara Activity Diagram dan Flowchart adalah...',
    'pg', 'sulit',
    'Activity Diagram (UML): mendukung aktivitas paralel (fork/join), swimlane (per aktor), object flow, signal; lebih cocok untuk pemodelan proses bisnis berorientasi objek. Flowchart: lebih sederhana, fokus pada alur logika/algoritma prosedural, tidak mendukung paralelisme dan swimlane secara bawaan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Flowchart lebih cocok untuk sistem berorientasi objek, Activity Diagram untuk sistem prosedural',false),
    (s,'B','Activity Diagram hanya digunakan untuk menggambarkan algoritma pemrograman',false),
    (s,'C','Activity Diagram mendukung paralelisme dan swimlane; flowchart lebih cocok untuk alur logika/algoritma sederhana',true),
    (s,'D','Keduanya identik, Activity Diagram hanya versi UML dari flowchart',false),
    (s,'E','Flowchart bisa menggambarkan aktivitas paralel, Activity Diagram tidak bisa',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah activity diagram (deskripsikan dalam teks berurutan) untuk proses "Pemesanan Makanan Online" dari aplikasi food delivery! Diagram harus mencakup: (a) minimal 2 swimlane (Pelanggan dan Sistem), (b) titik awal dan akhir, (c) minimal 1 decision node dengan kondisi dan alternatifnya, (d) minimal 1 aktivitas paralel (fork dan join), (e) minimal 7 aktivitas total!',
    'essay', 'sulit',
    'Jawaban ideal:

Swimlane: PELANGGAN | SISTEM | RESTORAN

Alur:
● (Initial Node)
↓
[PELANGGAN] Buka Aplikasi
↓
[SISTEM] Tampilkan Daftar Restoran
↓
[PELANGGAN] Pilih Restoran & Menu
↓
[PELANGGAN] Tambahkan ke Keranjang
↓
[PELANGGAN] Checkout & Pilih Pembayaran
↓
◇ (Decision) Saldo/Limit Cukup?
  [Ya] →
  FORK ══════════════════
  [SISTEM] Proses Pembayaran  |  [SISTEM] Kirim Notifikasi ke Restoran
  JOIN ══════════════════
  ↓
  [RESTORAN] Terima & Proses Pesanan
  ↓
  [SISTEM] Update Status "Sedang Dimasak"
  ↓
  [SISTEM] Update Status "Dalam Pengiriman"
  ↓
  [PELANGGAN] Terima Pesanan & Konfirmasi
  ↓
  ⊗ (Final Node)

  [Tidak] → [SISTEM] Tampilkan Pesan Gagal → [PELANGGAN] Ganti Metode Pembayaran → kembali ke Decision

Nilai penuh: 2 swimlane + initial/final node + decision dengan 2 kondisi + fork/join paralel + min 7 aktivitas.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan fungsi dan kegunaan Activity Diagram dalam pengembangan perangkat lunak! Kemudian buatlah activity diagram (dalam teks) untuk proses "Registrasi dan Aktivasi Akun" pada aplikasi web sekolah, termasuk: proses mengisi form, validasi data, konfirmasi email, dan aktivasi akun!',
    'essay', 'sedang',
    'Jawaban ideal:

Fungsi Activity Diagram:
1. Memodelkan alur kerja (workflow) atau proses bisnis
2. Menggambarkan logika proses yang kompleks termasuk percabangan dan paralelisme
3. Memodelkan algoritma dari operasi yang rumit
4. Menjelaskan use case yang memiliki alur kompleks
5. Membantu komunikasi alur proses kepada stakeholder non-teknis

Alur Registrasi & Aktivasi Akun:
● (Initial Node)
[PENGGUNA] Buka Halaman Registrasi
[PENGGUNA] Isi Form (Nama, Email, Password, No HP)
[PENGGUNA] Submit Form
◇ Data Lengkap & Valid?
  [Tidak] → [SISTEM] Tampilkan Pesan Error Validasi → kembali ke Isi Form
  [Ya] →
[SISTEM] Cek Email Sudah Terdaftar?
◇ Email Sudah Ada?
  [Ya] → [SISTEM] Tampilkan "Email sudah digunakan" → kembali ke Isi Form
  [Tidak] →
[SISTEM] Simpan Data Sementara (belum aktif)
[SISTEM] Kirim Email Konfirmasi dengan Link Aktivasi
[PENGGUNA] Buka Email & Klik Link Aktivasi
◇ Link Valid & Belum Kadaluarsa?
  [Tidak] → [SISTEM] Tampilkan "Link kadaluarsa, minta link baru" → kembali
  [Ya] →
[SISTEM] Ubah Status Akun Menjadi Aktif
[SISTEM] Tampilkan "Registrasi Berhasil"
[PENGGUNA] Login dengan Akun Baru
⊗ (Final Node)

Nilai penuh: 5 fungsi activity diagram + alur registrasi dengan min 3 decision node + proses email konfirmasi + aktivasi akun.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 7, 25);

  -- ==========================================================
  -- TES 4: DOKUMENTASI KEBUTUHAN
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dokumen standar yang berisi deskripsi lengkap tentang kebutuhan fungsional dan non-fungsional suatu perangkat lunak yang akan dikembangkan disebut...',
    'pg', 'mudah',
    'SRS (Software Requirements Specification) adalah dokumen formal yang mendefinisikan secara lengkap dan tidak ambigu semua kebutuhan sistem. Standar IEEE 830 mendefinisikan struktur SRS yang baku. SRS menjadi kontrak antara developer dan klien.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','SAD (Software Architecture Document)',false),
    (s,'B','TDD (Technical Design Document)',false),
    (s,'C','BRD (Business Requirements Document)',false),
    (s,'D','SRS (Software Requirements Specification)',true),
    (s,'E','FRD (Functional Requirements Document)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Format penulisan user story yang standar dalam metode Agile adalah...',
    'pg', 'sedang',
    'Format standar user story Agile: "As a [role], I want [feature], so that [benefit/reason]." Contoh: "Sebagai siswa, saya ingin dapat melihat nilai ujian saya, sehingga saya bisa mengetahui perkembangan belajar saya." Format ini memastikan kebutuhan ditulis dari perspektif pengguna dengan alasan yang jelas.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','"The system shall [action] when [condition]"',false),
    (s,'B','"Given [context], When [action], Then [result]"',false),
    (s,'C','"As a [role], I want [feature], so that [benefit]"',true),
    (s,'D','"Function [name]: Input [x], Process [y], Output [z]"',false),
    (s,'E','"IF [condition] THEN [action] ELSE [alternative]"',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Kriteria SMART dalam penulisan kebutuhan perangkat lunak berarti kebutuhan harus...',
    'pg', 'sedang',
    'SMART = Specific (spesifik, tidak ambigu), Measurable (terukur, ada kriteria pengukuran), Achievable (dapat dicapai secara teknis), Relevant (relevan dengan tujuan proyek), Time-bound (ada batasan waktu). Contoh SMART: "Sistem harus merespons pencarian dalam < 2 detik untuk 95% request."')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Simple, Modular, Adaptable, Reusable, Testable',false),
    (s,'B','Specific, Measurable, Achievable, Relevant, Time-bound',true),
    (s,'C','Structured, Maintainable, Accurate, Readable, Traceable',false),
    (s,'D','Sequential, Manageable, Atomic, Reliable, Testable',false),
    (s,'E','Systematic, Meaningful, Abstract, Repeatable, Traceable',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Kemampuan untuk menelusuri hubungan antara kebutuhan dengan komponen sistem, kode, atau test case yang mengimplementasikannya disebut...',
    'pg', 'sulit',
    'Traceability (keterlacakan) memungkinkan tim untuk mengetahui: kebutuhan mana yang sudah diimplementasikan, kode mana yang mengimplementasikan kebutuhan tertentu, test case mana yang memverifikasi kebutuhan tersebut. Penting untuk change management dan audit.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Modularity',false),
    (s,'B','Consistency',false),
    (s,'C','Completeness',false),
    (s,'D','Traceability (Keterlacakan)',true),
    (s,'E','Verifiability',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam dokumen SRS, bagian yang menjelaskan batasan-batasan yang tidak bisa diubah karena faktor eksternal (hukum, teknologi, platform) disebut...',
    'pg', 'sulit',
    'Constraints (batasan) = batasan yang dipaksakan dari luar dan tidak bisa dinegosiasikan. Contoh: "Sistem harus berjalan di browser Chrome v100+", "Data siswa harus disimpan sesuai regulasi PDPA", "Sistem harus kompatibel dengan hardware yang sudah dimiliki sekolah". Berbeda dengan assumptions yang bisa berubah.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Assumptions (Asumsi)',false),
    (s,'B','Dependencies (Ketergantungan)',false),
    (s,'C','Constraints (Batasan)',true),
    (s,'D','Risks (Risiko)',false),
    (s,'E','Scope (Ruang Lingkup)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah mini-SRS (Software Requirements Specification) untuk fitur "Sistem Absensi Digital Sekolah"! SRS harus mencakup: (a) Deskripsi Umum Sistem, (b) minimal 5 Kebutuhan Fungsional dengan format "Sistem harus...", (c) minimal 3 Kebutuhan Non-Fungsional dengan kriteria terukur, (d) minimal 2 Batasan Sistem (constraints), (e) minimal 3 User Story dalam format Agile!',
    'essay', 'sulit',
    'Jawaban ideal:

(a) Deskripsi Umum:
Sistem Absensi Digital adalah aplikasi berbasis web yang memungkinkan guru mencatat kehadiran siswa secara digital menggunakan QR code atau input manual. Data absensi tersimpan secara real-time dan dapat diakses oleh wali kelas, BK, dan orang tua.

(b) Kebutuhan Fungsional:
FR-01: Sistem harus dapat menampilkan daftar siswa per kelas setiap hari
FR-02: Sistem harus dapat mencatat status kehadiran (hadir/izin/sakit/alpha) per siswa per mata pelajaran
FR-03: Sistem harus dapat menghitung persentase kehadiran setiap siswa secara otomatis
FR-04: Sistem harus mengirimkan notifikasi kepada orang tua jika siswa tidak hadir
FR-05: Sistem harus dapat menghasilkan laporan absensi per siswa, per kelas, dan per periode

(c) Kebutuhan Non-Fungsional:
NFR-01 (Performance): Sistem harus merespons input absensi dalam < 1 detik
NFR-02 (Availability): Sistem harus tersedia 99% selama jam sekolah (07.00–17.00)
NFR-03 (Security): Hanya guru/wali kelas yang dapat mengubah data absensi; orang tua hanya bisa melihat

(d) Batasan Sistem:
1. Sistem harus berjalan di browser modern (Chrome, Firefox, Edge terbaru)
2. Sistem harus mengikuti regulasi perlindungan data pribadi siswa

(e) User Stories:
US-01: Sebagai Guru, saya ingin dapat menandai kehadiran siswa dari smartphone, sehingga proses absensi lebih cepat tanpa perlu kertas
US-02: Sebagai Orang Tua, saya ingin mendapat notifikasi WhatsApp jika anak saya tidak hadir, sehingga saya bisa segera menghubungi pihak sekolah
US-03: Sebagai Wali Kelas, saya ingin melihat laporan absensi bulanan seluruh siswa di kelas saya, sehingga saya bisa menindaklanjuti siswa dengan kehadiran rendah

Nilai penuh: deskripsi umum + min 5 FR format "Sistem harus" + min 3 NFR terukur + 2 constraints + 3 user story format benar.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara metode pengumpulan kebutuhan Waterfall dan Agile (User Story)! Kemudian buat 5 User Story untuk fitur-fitur Aplikasi Kantin Sekolah Digital dalam format Agile yang lengkap, masing-masing disertai dengan minimal 2 Acceptance Criteria (kriteria penerimaan)!',
    'essay', 'sedang',
    'Jawaban ideal:

Perbedaan Waterfall vs Agile dalam pengumpulan kebutuhan:
Waterfall: kebutuhan dikumpulkan SEKALI di awal, didokumentasikan lengkap dalam SRS sebelum development dimulai, sulit berubah di tengah jalan.
Agile: kebutuhan dikumpulkan secara iteratif dalam bentuk User Story, disusun dalam Product Backlog, diprioritaskan dan diperbarui secara berkala mengikuti perubahan kebutuhan bisnis.

5 User Story Kantin Sekolah Digital:

US-01: Sebagai Siswa, saya ingin melihat menu kantin hari ini, sehingga saya bisa memesan sebelum istirahat.
AC: Menu tampil dengan foto, nama, harga, dan status ketersediaan. Menu diperbarui setiap pagi hari.

US-02: Sebagai Siswa, saya ingin memesan makanan dari kelas, sehingga saya tidak perlu antri panjang di kantin.
AC: Pesanan berhasil tersimpan dan muncul di dapur kantin. Siswa menerima nomor antrian.

US-03: Sebagai Penjaga Kantin, saya ingin melihat daftar pesanan masuk secara real-time, sehingga saya bisa menyiapkan makanan dengan urutan yang benar.
AC: Pesanan muncul dalam < 5 detik. Status pesanan dapat diubah (proses/siap/selesai).

US-04: Sebagai Siswa, saya ingin membayar pesanan menggunakan saldo dompet digital, sehingga transaksi lebih cepat tanpa uang tunai.
AC: Saldo terpotong otomatis. Riwayat transaksi tersimpan dan bisa dilihat siswa.

US-05: Sebagai Orang Tua, saya ingin mengisi saldo dompet digital anak saya via transfer bank, sehingga anak saya bisa jajan di kantin tanpa membawa uang tunai.
AC: Top-up berhasil dalam < 1 menit. Notifikasi dikirim ke orang tua dan siswa.

Nilai penuh: perbedaan waterfall vs agile jelas + 5 user story format benar + 2 acceptance criteria per user story yang terukur.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 7, 25);

  -- ==========================================================
  -- TES 5: CLASS DIAGRAM
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam class diagram UML, sebuah kelas digambarkan sebagai kotak yang dibagi menjadi tiga bagian. Urutan dari atas ke bawah yang benar adalah...',
    'pg', 'mudah',
    'Struktur kotak kelas UML (atas ke bawah): (1) Nama Kelas, (2) Atribut (variabel/properti), (3) Method/Operasi (fungsi). Bagian kedua dan ketiga bisa dikosongkan jika tidak ada atau tidak perlu ditampilkan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Method → Atribut → Nama Kelas',false),
    (s,'B','Nama Kelas → Method → Atribut',false),
    (s,'C','Atribut → Nama Kelas → Method',false),
    (s,'D','Nama Kelas → Atribut → Method',true),
    (s,'E','Nama Kelas → Relasi → Atribut',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam notasi UML, visibility marker "+" pada atribut atau method sebuah kelas berarti...',
    'pg', 'mudah',
    'Visibility markers UML: + = public (bisa diakses dari mana saja), - = private (hanya dalam kelas itu sendiri), # = protected (kelas itu dan turunannya), ~ = package (dalam package yang sama). Prinsip enkapsulasi OOP: atribut sebaiknya private (-), method akses sebaiknya public (+).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Private — hanya bisa diakses dari dalam kelas itu sendiri',false),
    (s,'B','Protected — bisa diakses dari kelas itu dan kelas turunannya',false),
    (s,'C','Public — bisa diakses dari mana saja',true),
    (s,'D','Package — hanya bisa diakses dalam package yang sama',false),
    (s,'E','Abstract — tidak memiliki implementasi',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Relasi dalam class diagram di mana kelas "Sekolah" memiliki banyak "Kelas" dan jika "Sekolah" dihapus maka semua "Kelas" juga ikut terhapus disebut...',
    'pg', 'sulit',
    'Komposisi (Composition) = relasi "bagian dari" yang KUAT. Kelas anak tidak bisa hidup tanpa kelas induk. Digambar dengan belah ketupat TERISI di sisi induk. Berbeda dengan Agregasi (belah ketupat kosong) di mana bagian bisa hidup mandiri meski induk dihapus.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Asosiasi (Association)',false),
    (s,'B','Agregasi (Aggregation)',false),
    (s,'C','Generalisasi (Generalization)',false),
    (s,'D','Realisasi (Realization)',false),
    (s,'E','Komposisi (Composition)',true);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam class diagram, relasi "Guru" mewarisi semua atribut dan method dari kelas "Pegawai" disebut...',
    'pg', 'sedang',
    'Generalisasi/Inheritance = hubungan "is-a" (adalah sebuah). Guru IS-A Pegawai. Digambar dengan panah segitiga kosong dari kelas anak (Guru) ke kelas induk (Pegawai). Kelas anak mewarisi semua atribut dan method kelas induk dan bisa menambahkan yang baru.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Asosiasi (Association)',false),
    (s,'B','Agregasi (Aggregation)',false),
    (s,'C','Generalisasi / Inheritance',true),
    (s,'D','Komposisi (Composition)',false),
    (s,'E','Dependensi (Dependency)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Notasi multiplicity "1..*" pada ujung relasi class diagram berarti...',
    'pg', 'sedang',
    'Multiplicity UML: 1 = tepat satu, 0..1 = nol atau satu (opsional), * atau 0..* = nol atau lebih, 1..* = satu atau lebih (minimal satu, maksimal tak terbatas), n..m = antara n dan m. Contoh: Kelas 1..* Siswa berarti satu kelas minimal punya 1 siswa, maksimal tak terbatas.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Nol atau lebih (tidak wajib ada)',false),
    (s,'B','Tepat satu',false),
    (s,'C','Nol atau satu (opsional)',false),
    (s,'D','Satu atau lebih (minimal satu, maksimal tidak terbatas)',true),
    (s,'E','Antara satu sampai dua saja',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah class diagram (dalam deskripsi teks terstruktur) untuk Sistem Toko Online yang terdiri dari kelas: Produk, Pelanggan, Pesanan, dan DetailPesanan! Untuk setiap kelas, sertakan: (a) minimal 3 atribut dengan tipe data dan visibility, (b) minimal 2 method dengan visibility, (c) relasi antar kelas dengan multiplicity yang tepat, (d) identifikasi jenis relasi yang digunakan (asosiasi/agregasi/komposisi/generalisasi)!',
    'essay', 'sulit',
    'Jawaban ideal:

CLASS Produk
- id_produk: int {private}
- nama_produk: String {private}
- harga: double {private}
- stok: int {private}
+ getId(): int
+ getNama(): String
+ updateStok(jumlah: int): void
+ getHarga(): double

CLASS Pelanggan
- id_pelanggan: int {private}
- nama: String {private}
- email: String {private}
- alamat: String {private}
+ login(email: String, password: String): boolean
+ lihatRiwayat(): List<Pesanan>
+ updateProfil(): void

CLASS Pesanan
- id_pesanan: int {private}
- tanggal_pesan: Date {private}
- status: String {private}
- total_harga: double {private}
+ hitungTotal(): double
+ batalPesanan(): void
+ updateStatus(status: String): void

CLASS DetailPesanan
- id_detail: int {private}
- jumlah: int {private}
- subtotal: double {private}
+ hitungSubtotal(): double

RELASI:
1. Pelanggan → Pesanan: Asosiasi 1..* (satu pelanggan punya banyak pesanan)
2. Pesanan ◆→ DetailPesanan: Komposisi 1..* (pesanan terdiri dari detail; detail tidak ada tanpa pesanan)
3. DetailPesanan → Produk: Asosiasi * ke 1 (banyak detail bisa merujuk satu produk)

Nilai penuh: 4 kelas + min 3 atribut per kelas dengan visibility + min 2 method + relasi dengan multiplicity + identifikasi jenis relasi.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara Asosiasi, Agregasi, dan Komposisi dalam class diagram UML! Berikan contoh nyata masing-masing dalam konteks sistem sekolah, dan gambarkan (deskripsikan) notasi yang digunakan untuk masing-masing relasi tersebut!',
    'essay', 'sedang',
    'Jawaban ideal:

1. ASOSIASI (Association)
Definisi: hubungan umum antar kelas di mana satu kelas mengetahui/menggunakan kelas lain. Hubungan longgar.
Notasi: garis lurus dengan panah (atau tanpa panah jika dua arah)
Contoh Sekolah: Guru ←→ Mapel (guru mengajar mata pelajaran; keduanya bisa ada secara independen)
Multiplicity: Guru (1..*) mengajar Mapel (1..*)

2. AGREGASI (Aggregation)
Definisi: hubungan "has-a" yang LEMAH. Bagian bisa hidup mandiri meski keseluruhan dihapus.
Notasi: garis dengan belah ketupat KOSONG (◇) di sisi kelas "keseluruhan"
Contoh Sekolah: Kelas ◇—Siswa (siswa tergabung dalam kelas; jika kelas dibubarkan, data siswa tetap ada)
Multiplicity: Kelas (1) ◇— Siswa (1..*)

3. KOMPOSISI (Composition)
Definisi: hubungan "part-of" yang KUAT. Bagian tidak bisa hidup tanpa keseluruhan.
Notasi: garis dengan belah ketupat TERISI (◆) di sisi kelas "keseluruhan"
Contoh Sekolah: Sekolah ◆— Jurusan (jika sekolah dihapus, semua jurusan ikut hilang)
Contoh lain: Pesanan ◆— DetailPesanan (detail tidak ada tanpa pesanan)
Multiplicity: Sekolah (1) ◆— Jurusan (1..*)

Perbedaan kunci: Asosiasi = tahu satu sama lain; Agregasi = bagian dari tapi bisa mandiri; Komposisi = bagian dari dan bergantung penuh.

Nilai penuh: definisi 3 relasi berbeda + notasi dijelaskan (diamond kosong/terisi) + contoh konteks sekolah + perbedaan kunci disimpulkan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 7, 25);

  RAISE NOTICE 'Seed berhasil: 1 kompetensi "Pemodelan Perangkat Lunak" (tingkat=11, urutan=2), 5 tes, 35 soal (25 PG 5-opsi + 10 essay).';
END $$;
