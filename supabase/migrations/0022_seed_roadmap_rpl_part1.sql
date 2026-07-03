-- ============================================================
-- Seed Part 1: Kompetensi Roadmap PPLG/RPL
-- Berdasarkan Roadmap Kompetensi RPL Revisi 2 (Fokus Web Dev + PKL)
-- Jalankan SETELAH jurusan PPLG/RPL sudah ada di tabel jurusan.
-- ============================================================

DO $$
DECLARE
  v_jur uuid;
BEGIN
  SELECT id_jurusan INTO v_jur FROM public.jurusan
  WHERE lower(nama_jurusan) LIKE '%rpl%'
     OR lower(nama_jurusan) LIKE '%pplg%'
     OR lower(kode_jurusan)  LIKE '%rpl%'
     OR lower(kode_jurusan)  LIKE '%pplg%'
  LIMIT 1;

  IF v_jur IS NULL THEN
    RAISE EXCEPTION 'Jurusan PPLG/RPL tidak ditemukan. Buat dulu di menu Jurusan.';
  END IF;

  -- ===========================================================
  -- KELAS X — Semester Ganjil | Algoritma & Pemrograman Dasar
  -- ===========================================================
  INSERT INTO public.kompetensi (id_jurusan, judul, deskripsi, tingkat, urutan, syarat_lulus, aktif) VALUES
  (v_jur, 'Konsep Algoritma',
   'Memahami pengertian algoritma, ciri-ciri algoritma yang baik, dan menyusun algoritma untuk kasus sehari-hari.',
   'Kelas X Ganjil', 1, 70, true),
  (v_jur, 'Flowchart',
   'Mengenal simbol-simbol flowchart standar dan membuat flowchart untuk alur sequence, branching, dan looping.',
   'Kelas X Ganjil', 2, 70, true),
  (v_jur, 'Pseudocode',
   'Menulis pseudocode terstruktur menggunakan notasi baku untuk menggambarkan logika program.',
   'Kelas X Ganjil', 3, 70, true),
  (v_jur, 'Dasar Bahasa Pemrograman',
   'Memahami variabel, tipe data, dan operator (aritmatika, logika, perbandingan) dalam bahasa pemrograman.',
   'Kelas X Ganjil', 4, 70, true),
  (v_jur, 'Struktur Kontrol',
   'Mengimplementasikan percabangan (if-else, switch) dan perulangan (for, while) dalam program.',
   'Kelas X Ganjil', 5, 70, true),

  -- ===========================================================
  -- KELAS X — Semester Genap | Algoritma & Pemrograman Dasar
  -- ===========================================================
  (v_jur, 'Array & Struktur Data Dasar',
   'Mengelola array satu dimensi dan multidimensi untuk pengolahan data seperti nilai siswa.',
   'Kelas X Genap', 6, 70, true),
  (v_jur, 'Fungsi & Prosedur',
   'Membuat fungsi berparameter dengan return value dan memahami scope variabel dalam modularisasi program.',
   'Kelas X Genap', 7, 70, true),
  (v_jur, 'Pemrograman Terstruktur',
   'Menerapkan dekomposisi masalah dan pseudocode kompleks dalam studi kasus seperti sistem antrian.',
   'Kelas X Genap', 8, 70, true),
  (v_jur, 'Pengantar OOP',
   'Memahami konsep dasar objek dan kelas secara konseptual melalui identifikasi objek dari studi kasus nyata.',
   'Kelas X Genap', 9, 70, true),

  -- ===========================================================
  -- KELAS X — Semester Ganjil | Pemrograman Komputer
  -- ===========================================================
  (v_jur, 'Perakitan Komputer',
   'Mengenal komponen hardware komputer dan melakukan prosedur perakitan/instalasi unit komputer.',
   'Kelas X Ganjil', 10, 70, true),
  (v_jur, 'Sistem Operasi',
   'Menginstal sistem operasi, mengelola file & folder, dan menggunakan command line dasar.',
   'Kelas X Ganjil', 11, 70, true),
  (v_jur, 'Jaringan Komputer Dasar',
   'Memahami jenis jaringan LAN/MAN/WAN, perangkat jaringan, dan konfigurasi IP Address.',
   'Kelas X Ganjil', 12, 70, true),
  (v_jur, 'K3LH & Etika Kerja',
   'Menerapkan keselamatan kerja (K3LH), etika digital, dan memahami HAKI dalam lingkungan laboratorium komputer.',
   'Kelas X Ganjil', 13, 70, true),

  -- ===========================================================
  -- KELAS X — Semester Genap | Pemrograman Komputer
  -- ===========================================================
  (v_jur, 'HTML5',
   'Membuat struktur dokumen web menggunakan tag semantik HTML5 termasuk form dan elemen multimedia.',
   'Kelas X Genap', 14, 70, true),
  (v_jur, 'CSS3',
   'Menerapkan selector, box model, flexbox, grid, dan responsive design untuk styling halaman web.',
   'Kelas X Genap', 15, 70, true),
  (v_jur, 'JavaScript Dasar',
   'Memanipulasi DOM, menangani event, dan melakukan validasi form menggunakan JavaScript.',
   'Kelas X Genap', 16, 70, true),
  (v_jur, 'Version Control (Git & GitHub)',
   'Menggunakan Git untuk version control: instalasi, commit, push, branching, dan publikasi proyek ke GitHub.',
   'Kelas X Genap', 17, 70, true),

  -- ===========================================================
  -- KELAS XI — Semester Ganjil | Basis Data
  -- ===========================================================
  (v_jur, 'Konsep Basis Data',
   'Memahami konsep DBMS dan RDBMS, serta menginstal dan mengkonfigurasi XAMPP dan phpMyAdmin.',
   'Kelas XI Ganjil', 18, 70, true),
  (v_jur, 'Perancangan ERD',
   'Merancang Entity Relationship Diagram (ERD) dengan entitas, atribut, relasi, dan kardinalitas.',
   'Kelas XI Ganjil', 19, 70, true),
  (v_jur, 'Normalisasi',
   'Menerapkan normalisasi 1NF, 2NF, dan 3NF untuk menghasilkan tabel basis data yang optimal.',
   'Kelas XI Ganjil', 20, 70, true),
  (v_jur, 'DDL & DML Dasar',
   'Menulis perintah SQL untuk DDL (CREATE, ALTER) dan DML (INSERT, UPDATE, DELETE) sesuai ERD.',
   'Kelas XI Ganjil', 21, 70, true),
  (v_jur, 'Query Lanjutan',
   'Menggunakan JOIN, subquery, dan fungsi agregat untuk menghasilkan laporan dari beberapa tabel.',
   'Kelas XI Ganjil', 22, 70, true),

  -- ===========================================================
  -- KELAS XI — Semester Genap | Basis Data
  -- ===========================================================
  (v_jur, 'Indexing & Optimasi Dasar',
   'Menerapkan primary key, foreign key, index, dan constraint untuk mengoptimalkan performa basis data.',
   'Kelas XI Genap', 23, 70, true),
  (v_jur, 'Integrasi PHP–MySQL',
   'Menghubungkan PHP dengan MySQL menggunakan PDO dan prepared statement untuk operasi CRUD.',
   'Kelas XI Genap', 24, 70, true),
  (v_jur, 'Keamanan Data Dasar',
   'Mencegah SQL Injection dan mengimplementasikan hashing password untuk keamanan aplikasi.',
   'Kelas XI Genap', 25, 70, true),
  (v_jur, 'Migration & Seeder Laravel',
   'Membuat migration, seeder, dan factory di Laravel untuk manajemen struktur dan data tabel.',
   'Kelas XI Genap', 26, 70, true),
  (v_jur, 'Eloquent ORM',
   'Menggunakan Eloquent Model beserta relasi hasOne, hasMany, dan belongsToMany di Laravel.',
   'Kelas XI Genap', 27, 70, true),
  (v_jur, 'Query Builder Lanjutan',
   'Menerapkan eager loading, query scope, dan pagination untuk optimasi query data relasional di Laravel.',
   'Kelas XI Genap', 28, 70, true),

  -- ===========================================================
  -- KELAS XI — Semester Ganjil | Pemodelan Perangkat Lunak
  -- ===========================================================
  (v_jur, 'Rekayasa Kebutuhan',
   'Mengidentifikasi dan mendokumentasikan kebutuhan fungsional dan non-fungsional sebuah sistem informasi.',
   'Kelas XI Ganjil', 29, 70, true),
  (v_jur, 'UML Use Case Diagram',
   'Membuat use case diagram dengan aktor, use case, relasi include/extend menggunakan tools UML.',
   'Kelas XI Ganjil', 30, 70, true),
  (v_jur, 'Activity Diagram',
   'Memodelkan alur proses bisnis menggunakan activity diagram dengan swimlane.',
   'Kelas XI Ganjil', 31, 70, true),
  (v_jur, 'Dokumentasi Kebutuhan (SRS)',
   'Menyusun dokumen Software Requirements Specification (SRS) sederhana untuk sistem informasi.',
   'Kelas XI Ganjil', 32, 70, true),
  (v_jur, 'Class Diagram',
   'Membuat class diagram dengan atribut, method, visibility, dan relasi antar kelas.',
   'Kelas XI Ganjil', 33, 70, true),

  -- ===========================================================
  -- KELAS XI — Semester Genap | Pemodelan Perangkat Lunak
  -- ===========================================================
  (v_jur, 'Sequence Diagram',
   'Membuat sequence diagram dengan lifeline, message, dan activation bar untuk alur proses login/transaksi.',
   'Kelas XI Genap', 34, 70, true),
  (v_jur, 'Pemodelan Data Lanjutan',
   'Menyinkronkan ERD dengan class diagram untuk konsistensi desain data dan objek.',
   'Kelas XI Genap', 35, 70, true),
  (v_jur, 'Dokumentasi Desain Sistem',
   'Menyusun dokumen desain sistem mencakup arsitektur, class diagram, dan sequence diagram.',
   'Kelas XI Genap', 36, 70, true),
  (v_jur, 'Pemodelan Arsitektur MVC',
   'Memetakan komponen Model-View-Controller dan memodelkan arsitektur aplikasi Laravel.',
   'Kelas XI Genap', 37, 70, true),
  (v_jur, 'Design Pattern Dasar',
   'Menerapkan Repository Pattern dan Service Pattern dalam pengembangan aplikasi Laravel.',
   'Kelas XI Genap', 38, 70, true),
  (v_jur, 'Pemodelan REST API',
   'Merancang resource model dan dokumentasi endpoint API menggunakan standar RESTful.',
   'Kelas XI Genap', 39, 70, true),

  -- ===========================================================
  -- KELAS XI — Semester Ganjil | Pemrograman Web
  -- ===========================================================
  (v_jur, 'HTML/CSS Lanjutan & Framework CSS',
   'Menggunakan framework CSS (Bootstrap/Tailwind) untuk membangun UI sistem informasi yang responsif.',
   'Kelas XI Ganjil', 40, 70, true),
  (v_jur, 'Dasar PHP',
   'Menguasai sintaks dasar PHP: variabel, struktur kontrol, fungsi, dan pengolahan data.',
   'Kelas XI Ganjil', 41, 70, true),
  (v_jur, 'PHP Form Handling',
   'Menangani data form menggunakan GET/POST, validasi server-side, session, dan cookie.',
   'Kelas XI Ganjil', 42, 70, true),
  (v_jur, 'Studi Kasus CRUD PHP-MySQL',
   'Membangun aplikasi CRUD sederhana dengan integrasi form PHP dan basis data MySQL.',
   'Kelas XI Ganjil', 43, 70, true),
  (v_jur, 'OOP PHP Dasar & Lanjutan',
   'Menerapkan class, inheritance, polymorphism, dan interface dalam refactoring aplikasi ke pendekatan OOP.',
   'Kelas XI Ganjil', 44, 70, true),

  -- ===========================================================
  -- KELAS XI — Semester Genap | Pemrograman Web
  -- ===========================================================
  (v_jur, 'Keamanan Web',
   'Mencegah serangan XSS dan CSRF menggunakan htmlspecialchars, token CSRF, dan validasi input.',
   'Kelas XI Genap', 45, 70, true),
  (v_jur, 'Autentikasi & Otorisasi Web',
   'Membangun sistem login multi-role dengan middleware dan Role-Based Access Control (RBAC).',
   'Kelas XI Genap', 46, 70, true),
  (v_jur, 'UI Lanjutan (Modal, Card, Flash Message)',
   'Mengintegrasikan komponen UI lanjutan (modal, card, navbar, flash message) dengan data dinamis.',
   'Kelas XI Genap', 47, 70, true),
  (v_jur, 'Pengenalan Laravel',
   'Menginstal Laravel, memahami struktur folder, dan membuat routing dasar menggunakan Laravel.',
   'Kelas XI Genap', 48, 70, true),
  (v_jur, 'Blade Templating',
   'Menggunakan Blade untuk layout master, komponen, dan directive dalam halaman dinamis Laravel.',
   'Kelas XI Genap', 49, 70, true),
  (v_jur, 'CRUD dengan Laravel',
   'Membangun CRUD menggunakan Resource Controller dan Form Request Validation di Laravel.',
   'Kelas XI Genap', 50, 70, true),

  -- ===========================================================
  -- KELAS XII Ganjil | Basis Data
  -- ===========================================================
  (v_jur, 'Backup & Restore Basis Data',
   'Melakukan backup menggunakan mysqldump dan restore basis data melalui phpMyAdmin untuk proyek kapstone.',
   'Kelas XII Ganjil', 51, 75, true),
  (v_jur, 'Stored Procedure & Trigger',
   'Membuat stored procedure dan trigger untuk otomatisasi logika bisnis di level database.',
   'Kelas XII Ganjil', 52, 75, true),
  (v_jur, 'Optimasi Query Lanjutan',
   'Menggunakan EXPLAIN, composite index, dan mendeteksi N+1 query untuk optimasi performa basis data.',
   'Kelas XII Ganjil', 53, 75, true),
  (v_jur, 'Pengantar NoSQL',
   'Memahami perbedaan Document DB dan key-value store (Redis) dengan RDBMS melalui studi kasus.',
   'Kelas XII Ganjil', 54, 75, true),
  (v_jur, 'Keamanan Basis Data Lanjutan',
   'Menerapkan enkripsi data sensitif dan pembatasan hak akses user database (least privilege).',
   'Kelas XII Ganjil', 55, 75, true),

  -- ===========================================================
  -- KELAS XII Ganjil | Pemodelan Perangkat Lunak
  -- ===========================================================
  (v_jur, 'Component Diagram',
   'Membuat component diagram yang menggambarkan komponen sistem dan dependency aplikasi kapstone.',
   'Kelas XII Ganjil', 56, 75, true),
  (v_jur, 'Pemodelan Sistem Skala Penuh',
   'Mengintegrasikan seluruh diagram UML untuk konsistensi pemodelan proyek kapstone.',
   'Kelas XII Ganjil', 57, 75, true),
  (v_jur, 'Dokumentasi Teknis Kapstone',
   'Menyusun dokumentasi teknis lengkap: arsitektur sistem, desain DB, desain API, dan panduan instalasi.',
   'Kelas XII Ganjil', 58, 75, true),
  (v_jur, 'Evaluasi & Pengujian Model (UAT)',
   'Melakukan User Acceptance Testing (UAT) dan menelusuri pemenuhan kebutuhan (requirements traceability).',
   'Kelas XII Ganjil', 59, 75, true),
  (v_jur, 'Presentasi Rancangan Sistem',
   'Mempresentasikan rancangan sistem kapstone secara profesional dengan struktur dan teknik presentasi yang tepat.',
   'Kelas XII Ganjil', 60, 75, true),

  -- ===========================================================
  -- KELAS XII Ganjil | Pemrograman Web (Laravel Penuh)
  -- ===========================================================
  (v_jur, 'Autentikasi Laravel (Breeze & Policy)',
   'Mengimplementasikan Laravel Breeze, middleware, dan Policy untuk sistem login multi-role.',
   'Kelas XII Ganjil', 61, 75, true),
  (v_jur, 'REST API dengan Laravel',
   'Membangun REST API menggunakan API Resource Laravel dan mengujinya menggunakan Postman.',
   'Kelas XII Ganjil', 62, 75, true),
  (v_jur, 'Integrasi Layanan Pihak Ketiga',
   'Mengimplementasikan upload file dan integrasi Maps API dalam aplikasi Laravel.',
   'Kelas XII Ganjil', 63, 75, true),
  (v_jur, 'Testing & Debugging Laravel',
   'Menulis unit test menggunakan PHPUnit dan melakukan debugging dengan Telescope/Debugbar.',
   'Kelas XII Ganjil', 64, 75, true),
  (v_jur, 'Deployment Aplikasi Web',
   'Mengkonfigurasi environment production dan men-deploy aplikasi Laravel ke hosting/VPS dengan domain dan SSL.',
   'Kelas XII Ganjil', 65, 75, true),

  -- ===========================================================
  -- KELAS XII Genap | PKL (Praktik Kerja Lapangan)
  -- ===========================================================
  (v_jur, 'Pembekalan Pra-PKL',
   'Memahami etika kerja industri, tata tertib PKL, dan K3 di lingkungan kerja nyata.',
   'Kelas XII Genap', 66, 70, true),
  (v_jur, 'Jurnal Kegiatan PKL',
   'Mengisi logbook harian PKL secara tertib dan sesuai teknik dokumentasi kegiatan yang benar.',
   'Kelas XII Genap', 67, 70, true),
  (v_jur, 'Laporan Akhir PKL',
   'Menyusun laporan akhir PKL sesuai sistematika penulisan yang ditetapkan sekolah.',
   'Kelas XII Genap', 68, 70, true),
  (v_jur, 'Evaluasi & Presentasi Hasil PKL',
   'Mempresentasikan hasil kegiatan PKL di industri dalam sidang evaluasi dengan teknik yang profesional.',
   'Kelas XII Genap', 69, 70, true);

  RAISE NOTICE 'Part 1 selesai: 69 kompetensi berhasil di-insert untuk jurusan %', v_jur;
END $$;
