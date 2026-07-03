-- ============================================================
-- Seed: Roadmap Kompetensi Kelas X
-- 1 Kompetensi: Pemrograman Komputer (urutan 1, mapel berbeda)
-- 4 Tes Kompetensi (5 PG 5-opsi + 2 Essay per tes)
-- Jalankan di Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  v_jur uuid;

  k1 uuid; -- kompetensi

  t1 uuid; -- Perakitan Komputer
  t2 uuid; -- Sistem Operasi
  t3 uuid; -- Jaringan Komputer Dasar
  t4 uuid; -- K3LH & Etika Kerja

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
  -- 1. KOMPETENSI (1 sertifikat, urutan 1 karena mapel beda)
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi
    (id_jurusan, judul, deskripsi, tingkat, urutan, syarat_lulus, aktif)
  VALUES (v_jur,
    'Pemrograman Komputer',
    'Memahami fondasi perangkat keras, sistem operasi, dan jaringan sebagai dasar lingkungan kerja pengembang. Mencakup perakitan komputer, sistem operasi, jaringan dasar, serta K3LH dan etika kerja.',
    10, 1, 70, true)
  RETURNING id_kompetensi INTO k1;

  -- ----------------------------------------------------------
  -- 2. KOMPETENSI_TUGAS (4 tes)
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Perakitan Komputer',
    'Tes pemahaman komponen hardware dan prosedur perakitan unit komputer.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t1;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Sistem Operasi',
    'Tes pemahaman instalasi OS, manajemen file, dan penggunaan command line dasar.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t2;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Jaringan Komputer Dasar',
    'Tes pemahaman jenis jaringan LAN/MAN/WAN, perangkat jaringan, dan konfigurasi IP Address.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t3;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'K3LH & Etika Kerja',
    'Tes pemahaman keselamatan kerja, etika digital, dan HAKI di laboratorium komputer.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t4;

  -- ==========================================================
  -- TES 1: PERAKITAN KOMPUTER
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Komponen komputer yang berfungsi sebagai "otak" utama untuk memproses seluruh instruksi program disebut...',
    'pg', 'mudah',
    'CPU (Central Processing Unit) adalah komponen utama yang mengeksekusi instruksi program. Terdiri dari ALU (Arithmetic Logic Unit) dan CU (Control Unit).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','RAM (Random Access Memory)',false),
    (s,'B','HDD (Hard Disk Drive)',false),
    (s,'C','CPU (Central Processing Unit)',true),
    (s,'D','GPU (Graphics Processing Unit)',false),
    (s,'E','PSU (Power Supply Unit)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan utama antara RAM dan ROM adalah...',
    'pg', 'sedang',
    'RAM bersifat volatile (data hilang saat listrik mati) dan dapat dibaca/ditulis. ROM bersifat non-volatile (data tetap ada meski listrik mati) dan umumnya hanya bisa dibaca.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','RAM lebih lambat dari ROM',false),
    (s,'B','RAM bersifat volatile (data hilang saat mati), ROM non-volatile dan hanya baca',true),
    (s,'C','ROM digunakan untuk menyimpan data sementara, RAM untuk data permanen',false),
    (s,'D','RAM dan ROM memiliki fungsi yang sama persis',false),
    (s,'E','ROM dapat diisi ulang oleh pengguna seperti RAM',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Komponen yang berfungsi sebagai "papan induk" tempat semua komponen utama komputer terhubung adalah...',
    'pg', 'mudah',
    'Motherboard (papan induk) adalah PCB utama yang menyediakan slot dan konektor untuk CPU, RAM, kartu grafis, storage, dan semua komponen lainnya.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Power Supply Unit (PSU)',false),
    (s,'B','Hard Disk Drive (HDD)',false),
    (s,'C','Video Card / GPU',false),
    (s,'D','Motherboard (papan induk)',true),
    (s,'E','Casing / chassis',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Urutan yang benar dalam proses perakitan komputer adalah...',
    'pg', 'sedang',
    'Urutan standar: pasang CPU ke soket motherboard → pasang RAM → pasang motherboard ke casing → pasang PSU → hubungkan kabel power/data → pasang storage → nyalakan dan uji. CPU dipasang pertama karena berada langsung di motherboard.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Pasang PSU → Pasang HDD → Pasang CPU → Pasang RAM → Pasang Motherboard',false),
    (s,'B','Pasang CPU ke motherboard → Pasang RAM → Pasang motherboard ke casing → Hubungkan kabel → Uji',true),
    (s,'C','Pasang casing → Pasang PSU → Pasang RAM → Pasang CPU → Pasang HDD',false),
    (s,'D','Pasang HDD → Pasang GPU → Pasang CPU → Pasang motherboard',false),
    (s,'E','Urutan tidak penting, semua komponen bisa dipasang dalam urutan apapun',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Saat merakit komputer, teknisi harus menggunakan gelang anti-statis (antistatic wrist strap). Tujuannya adalah...',
    'pg', 'mudah',
    'Listrik statis dari tubuh manusia dapat merusak komponen elektronik sensitif seperti CPU, RAM, dan motherboard. Gelang anti-statis membuang muatan listrik statis ke ground sebelum menyentuh komponen.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Agar tangan teknisi tidak kotor saat memegang komponen',false),
    (s,'B','Untuk mengukur tegangan listrik komponen',false),
    (s,'C','Mencegah kerusakan komponen akibat listrik statis dari tubuh manusia',true),
    (s,'D','Mempercepat proses perakitan',false),
    (s,'E','Memastikan komponen terpasang dengan kencang',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Sebutkan dan jelaskan minimal 6 komponen utama dalam sebuah unit komputer! Untuk setiap komponen, tuliskan fungsinya secara singkat dan jelas!',
    'essay', 'mudah',
    'Jawaban ideal (minimal 6 dari):
1. CPU — memproses instruksi program (otak komputer)
2. RAM — menyimpan data sementara yang sedang diproses
3. Motherboard — papan induk penghubung semua komponen
4. HDD/SSD — penyimpanan data permanen
5. PSU (Power Supply) — mengubah listrik AC ke DC untuk komponen
6. GPU — memproses dan menampilkan grafis ke monitor
7. Optical Drive — membaca/menulis CD/DVD
8. Casing — pelindung dan tempat semua komponen terpasang
9. Monitor — menampilkan output visual
10. Keyboard/Mouse — perangkat input

Nilai penuh: 6 komponen + fungsi masing-masing tepat.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara HDD (Hard Disk Drive) dan SSD (Solid State Drive) dari segi: (a) cara kerja/teknologi, (b) kecepatan baca/tulis, (c) ketahanan fisik, dan (d) harga. Berikan rekomendasimu: untuk laptop sekolah yang sering dibawa-bawa, mana yang lebih baik? Jelaskan alasannya!',
    'essay', 'sedang',
    'Jawaban ideal:
(a) Cara kerja: HDD menggunakan piringan magnetik berputar + head baca/tulis mekanis. SSD menggunakan chip flash memory tanpa komponen bergerak.
(b) Kecepatan: SSD jauh lebih cepat (500MB/s+) vs HDD (80-160MB/s).
(c) Ketahanan: SSD lebih tahan banting (tanpa komponen bergerak), HDD rentan rusak jika terjatuh.
(d) Harga: HDD lebih murah per GB, SSD lebih mahal tapi semakin terjangkau.

Rekomendasi: SSD lebih baik untuk laptop sekolah karena lebih tahan banting (sering dibawa), lebih ringan, lebih cepat boot, dan lebih hemat baterai.

Nilai penuh: 4 poin perbandingan + rekomendasi dengan alasan yang logis.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 7, 25);

  -- ==========================================================
  -- TES 2: SISTEM OPERASI
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Fungsi utama sistem operasi dalam sebuah komputer adalah...',
    'pg', 'mudah',
    'Sistem operasi berperan sebagai perantara antara pengguna/aplikasi dengan hardware, mengelola resource (CPU, memori, storage, I/O), dan menyediakan layanan untuk program aplikasi.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Membuat dokumen teks dan spreadsheet',false),
    (s,'B','Mengelola hardware dan menyediakan layanan untuk aplikasi yang berjalan di atasnya',true),
    (s,'C','Menghubungkan komputer ke internet',false),
    (s,'D','Menyimpan data ke cloud secara otomatis',false),
    (s,'E','Merancang antarmuka grafis website',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perintah command line yang digunakan untuk berpindah direktori di Linux/macOS adalah...',
    'pg', 'mudah',
    'cd (change directory) adalah perintah universal untuk berpindah direktori di Linux, macOS, maupun Windows.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','ls',false),
    (s,'B','mv',false),
    (s,'C','cd',true),
    (s,'D','cp',false),
    (s,'E','pwd',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perintah "ls -la" di terminal Linux berfungsi untuk...',
    'pg', 'sedang',
    'ls -la menampilkan semua file (termasuk yang tersembunyi dengan prefix titik) secara lengkap (long format) dengan info permission, ukuran, pemilik, dan tanggal modifikasi.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Menghapus semua file di direktori saat ini',false),
    (s,'B','Membuat direktori baru dengan nama "la"',false),
    (s,'C','Menampilkan semua file termasuk tersembunyi dengan informasi lengkap (permission, ukuran, tanggal)',true),
    (s,'D','Memindahkan file ke direktori lain',false),
    (s,'E','Mengubah hak akses file',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Di Windows, perintah command prompt untuk melihat daftar file dan folder dalam direktori aktif adalah...',
    'pg', 'mudah',
    'dir adalah perintah di Windows Command Prompt untuk menampilkan isi direktori. Setara dengan ls di Linux/macOS.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','ls',false),
    (s,'B','list',false),
    (s,'C','show',false),
    (s,'D','dir',true),
    (s,'E','files',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Sistem operasi melakukan "multitasking" yang artinya...',
    'pg', 'sedang',
    'Multitasking adalah kemampuan OS menjalankan beberapa proses/program secara bersamaan dengan cara membagi waktu CPU (time-sharing) antar proses dengan sangat cepat sehingga terkesan berjalan paralel.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Komputer memiliki lebih dari satu CPU',false),
    (s,'B','OS dapat menjalankan beberapa program secara bersamaan dengan membagi waktu CPU',true),
    (s,'C','Pengguna bisa login ke beberapa komputer sekaligus',false),
    (s,'D','Program harus diinstall lebih dari sekali',false),
    (s,'E','Komputer bisa digunakan oleh banyak orang dalam satu waktu tanpa jaringan',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan langkah-langkah instalasi sistem operasi Windows secara umum dari awal hingga selesai! Sebutkan juga hal-hal yang perlu dipersiapkan sebelum melakukan instalasi!',
    'essay', 'sedang',
    'Jawaban ideal:
Persiapan: media instalasi (USB bootable/DVD), product key Windows, backup data penting, pastikan spesifikasi hardware memenuhi syarat minimum.

Langkah instalasi:
1. Setting BIOS/UEFI agar boot dari USB/DVD
2. Masukkan media instalasi dan restart
3. Pilih bahasa, zona waktu, dan layout keyboard
4. Klik "Install Now" dan masukkan product key (jika ada)
5. Pilih tipe instalasi (Custom untuk bersih)
6. Pilih partisi untuk instalasi OS
7. Tunggu proses copy file dan instalasi komponen
8. Restart dan lakukan konfigurasi awal (nama user, password, jaringan)
9. Instalasi driver hardware (VGA, audio, network)
10. Selesai dan siap digunakan

Nilai penuh: persiapan disebut + minimal 8 langkah urut dan benar.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Bandingkan sistem operasi Windows, Linux, dan macOS dari segi: (a) lisensi dan harga, (b) kemudahan penggunaan, (c) penggunaan di dunia pemrograman/development. Menurutmu, OS mana yang paling cocok digunakan untuk belajar pemrograman web? Berikan alasanmu!',
    'essay', 'sedang',
    'Jawaban ideal:
(a) Lisensi: Windows = berbayar (tapi bisa gratis versi student), Linux = open source gratis, macOS = gratis tapi hanya untuk perangkat Apple.
(b) Kemudahan: Windows paling familier untuk pengguna umum, macOS intuitif, Linux butuh adaptasi lebih tapi sangat powerful via terminal.
(c) Development: Linux/macOS lebih populer untuk web dev (server production umumnya Linux, terminal lebih powerful, tool dev lebih mudah dikonfigurasi). Windows kini mendukung WSL (Windows Subsystem for Linux).

Rekomendasi: Linux (Ubuntu/Debian) atau macOS karena environment-nya paling mirip dengan server production, terminal lebih powerful, dan banyak tutorial web dev menggunakan Unix-based OS.

Nilai penuh: 3 poin perbandingan + rekomendasi dengan alasan teknis yang relevan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 7, 25);

  -- ==========================================================
  -- TES 3: JARINGAN KOMPUTER DASAR
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jaringan komputer yang mencakup area dalam satu gedung atau kampus disebut...',
    'pg', 'mudah',
    'LAN (Local Area Network) adalah jaringan yang mencakup area terbatas seperti satu gedung, kampus, atau rumah. MAN untuk kota, WAN untuk antar kota/negara.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','WAN (Wide Area Network)',false),
    (s,'B','MAN (Metropolitan Area Network)',false),
    (s,'C','LAN (Local Area Network)',true),
    (s,'D','VPN (Virtual Private Network)',false),
    (s,'E','PAN (Personal Area Network)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'IP Address 192.168.10.5 dengan subnet mask 255.255.255.0 berada dalam kelas...',
    'pg', 'sedang',
    'Range IP Kelas C: 192.0.0.0 – 223.255.255.255. IP 192.168.x.x termasuk IP privat Kelas C yang umum digunakan di jaringan lokal.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Kelas A (1.0.0.0 – 126.255.255.255)',false),
    (s,'B','Kelas B (128.0.0.0 – 191.255.255.255)',false),
    (s,'C','Kelas C (192.0.0.0 – 223.255.255.255)',true),
    (s,'D','Kelas D (224.0.0.0 – 239.255.255.255)',false),
    (s,'E','Kelas E (240.0.0.0 – 255.255.255.255)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perangkat jaringan yang menghubungkan beberapa komputer dalam LAN dan meneruskan data hanya ke komputer tujuan berdasarkan MAC address adalah...',
    'pg', 'sedang',
    'Switch bekerja di Layer 2 (Data Link) dan meneruskan frame berdasarkan MAC address ke port yang tepat. Hub meneruskan ke semua port. Router bekerja di Layer 3 berdasarkan IP address.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Hub — meneruskan data ke semua port tanpa seleksi',false),
    (s,'B','Router — menghubungkan antar jaringan berbeda berdasarkan IP',false),
    (s,'C','Switch — meneruskan data hanya ke port tujuan berdasarkan MAC address',true),
    (s,'D','Modem — mengubah sinyal digital ke analog',false),
    (s,'E','Access Point — memancarkan sinyal WiFi',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Protokol yang digunakan untuk mengakses halaman web (HTTP) menggunakan port default nomor...',
    'pg', 'sedang',
    'HTTP menggunakan port 80 secara default. HTTPS (HTTP aman) menggunakan port 443. Port adalah nomor logika untuk membedakan layanan yang berjalan di satu IP address.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Port 21 (FTP)',false),
    (s,'B','Port 22 (SSH)',false),
    (s,'C','Port 25 (SMTP)',false),
    (s,'D','Port 80 (HTTP)',true),
    (s,'E','Port 443 (HTTPS)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perintah "ping 192.168.1.1" pada command prompt/terminal digunakan untuk...',
    'pg', 'mudah',
    'Ping mengirimkan paket ICMP Echo Request ke alamat IP tujuan untuk menguji apakah perangkat tersebut dapat dicapai di jaringan dan mengukur latensi (waktu respons).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Mengirimkan file ke IP 192.168.1.1',false),
    (s,'B','Menghapus koneksi ke IP 192.168.1.1',false),
    (s,'C','Menguji konektivitas jaringan ke alamat IP 192.168.1.1 dan mengukur latensi',true),
    (s,'D','Mengubah IP address komputer menjadi 192.168.1.1',false),
    (s,'E','Memblokir akses dari IP 192.168.1.1',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara LAN, MAN, dan WAN dari segi jangkauan area, contoh penggunaan nyata, dan kecepatan transfer data yang umum! Berikan masing-masing 1 contoh implementasi di kehidupan nyata!',
    'essay', 'sedang',
    'Jawaban ideal:
LAN (Local Area Network):
- Jangkauan: satu gedung/kampus (< 1 km)
- Kecepatan: 100 Mbps – 10 Gbps
- Contoh: jaringan lab komputer sekolah, jaringan kantor satu lantai

MAN (Metropolitan Area Network):
- Jangkauan: satu kota/kabupaten (1–100 km)
- Kecepatan: 10 Mbps – 1 Gbps
- Contoh: jaringan antar cabang bank dalam satu kota, jaringan CCTV kota

WAN (Wide Area Network):
- Jangkauan: antar kota, provinsi, negara, benua
- Kecepatan: bervariasi, umumnya lebih lambat dan mahal
- Contoh: internet global, jaringan ATM antar kota, VPN perusahaan multinasional

Nilai penuh: 3 jenis jaringan + jangkauan + kecepatan + contoh nyata masing-masing.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Lab komputer sekolahmu memiliki 20 komputer yang perlu dihubungkan dalam jaringan LAN. Rancanglah konfigurasi jaringan sederhana tersebut dengan menjelaskan: (a) perangkat jaringan yang dibutuhkan, (b) skema IP address yang akan digunakan, (c) topologi jaringan yang dipilih dan alasannya!',
    'essay', 'sulit',
    'Jawaban ideal:
(a) Perangkat yang dibutuhkan:
- 1 buah Switch 24-port (untuk 20 komputer + cadangan)
- Kabel UTP Cat5e/Cat6 + konektor RJ45
- 1 buah Router (jika perlu akses internet)
- NIC (Network Interface Card) di tiap komputer

(b) Skema IP address:
- Network: 192.168.1.0/24
- Gateway/Router: 192.168.1.1
- Komputer 1–20: 192.168.1.10 s/d 192.168.1.29 (atau DHCP otomatis)
- Subnet mask: 255.255.255.0
- DNS: 8.8.8.8 (Google) atau DNS sekolah

(c) Topologi Star:
- Semua komputer terhubung ke switch pusat
- Alasan: mudah dikelola, jika satu kabel rusak hanya 1 komputer terdampak, mudah ditambah perangkat baru

Nilai penuh: 3 poin terjawab dengan detail teknis yang logis.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 7, 25);

  -- ==========================================================
  -- TES 4: K3LH & ETIKA KERJA
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'K3LH dalam konteks laboratorium komputer singkatan dari...',
    'pg', 'mudah',
    'K3LH = Kesehatan, Keselamatan Kerja, dan Lingkungan Hidup. Merupakan standar prosedur untuk menjamin keamanan dan kesehatan di lingkungan kerja/laboratorium.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Keamanan, Ketertiban, Kebersihan, dan Lingkungan Hidup',false),
    (s,'B','Kesehatan, Keselamatan Kerja, dan Lingkungan Hidup',true),
    (s,'C','Kompetensi, Keterampilan, Kerja, dan Lingkungan Hidup',false),
    (s,'D','Keselamatan, Kesejahteraan, Kerja, dan Lingkungan Hidup',false),
    (s,'E','Kebersihan, Kerapian, Ketertiban, dan Lingkungan Hidup',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'HAKI (Hak Atas Kekayaan Intelektual) dalam konteks digital melindungi...',
    'pg', 'mudah',
    'HAKI melindungi karya cipta intelektual seperti software, desain, musik, tulisan, dan konten digital dari penggunaan/penyalinan tanpa izin pemilik hak.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Hak pengguna untuk mengakses internet secara gratis',false),
    (s,'B','Hak pemilik atas karya cipta digital seperti software, desain, dan konten',true),
    (s,'C','Hak privasi data pribadi pengguna di media sosial',false),
    (s,'D','Hak penggunaan komputer di laboratorium sekolah',false),
    (s,'E','Hak untuk mengunduh apapun dari internet',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Saat bekerja di laboratorium komputer, posisi duduk yang ergonomis dan benar adalah...',
    'pg', 'sedang',
    'Posisi ergonomis: monitor sejajar/sedikit di bawah mata, punggung tegak, siku membentuk 90°, kaki menapak lantai. Ini mencegah kelelahan mata, nyeri leher, dan gangguan muskuloskeletal.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Monitor setinggi mungkin agar layar terlihat jelas dari jauh',false),
    (s,'B','Membungkuk ke depan agar lebih dekat dengan layar',false),
    (s,'C','Punggung tegak, monitor sejajar mata, siku 90°, kaki menapak lantai',true),
    (s,'D','Duduk miring agar tidak cepat lelah',false),
    (s,'E','Posisi duduk tidak berpengaruh pada kesehatan selama nyaman',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Tindakan mana yang termasuk pelanggaran etika digital di media sosial?',
    'pg', 'sedang',
    'Menyebarkan informasi yang belum terverifikasi (hoaks) adalah pelanggaran etika digital yang dapat merugikan banyak pihak dan bahkan melanggar hukum (UU ITE di Indonesia).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Menggunakan tanda pagar (#) untuk mengkategorikan konten',false),
    (s,'B','Meminta izin sebelum mengunggah foto orang lain',false),
    (s,'C','Menyebarkan berita/informasi yang belum terverifikasi kebenarannya (hoaks)',true),
    (s,'D','Mencantumkan sumber saat membagikan informasi dari orang lain',false),
    (s,'E','Melaporkan konten yang mengandung ujaran kebencian',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Menggunakan software bajakan (crack/keygen) di laboratorium sekolah melanggar...',
    'pg', 'mudah',
    'Software bajakan melanggar HAKI (hak cipta pengembang software) dan berpotensi melanggar UU Hak Cipta No. 28 Tahun 2014. Selain ilegal, software bajakan juga berisiko mengandung malware.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Peraturan tentang kecepatan internet di sekolah',false),
    (s,'B','Hak Atas Kekayaan Intelektual (HAKI) dan UU Hak Cipta',true),
    (s,'C','Peraturan tentang jam penggunaan laboratorium',false),
    (s,'D','Standar keamanan jaringan laboratorium',false),
    (s,'E','Tidak melanggar apapun selama digunakan untuk belajar',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Sebutkan dan jelaskan minimal 5 aturan K3LH yang harus diterapkan di laboratorium komputer sekolah! Untuk setiap aturan, jelaskan juga apa risiko yang dapat terjadi jika aturan tersebut tidak dipatuhi!',
    'essay', 'sedang',
    'Jawaban ideal (minimal 5 dari):
1. Dilarang makan/minum di lab → Risiko: tumpahan cairan merusak perangkat elektronik, kontaminasi komponen
2. Matikan komputer dengan benar (shutdown) → Risiko: kerusakan file sistem, HDD bermasalah
3. Tidak menyentuh bagian dalam komputer saat masih terhubung listrik → Risiko: sengatan listrik, kerusakan komponen
4. Gunakan stabilizer/UPS → Risiko: lonjakan tegangan merusak PSU dan motherboard
5. Jaga jarak pandang ke monitor (50-70 cm) → Risiko: kelelahan mata, gangguan penglihatan
6. Simpan kabel dengan rapi → Risiko: tersandung, kabel terputus, bahaya kebakaran
7. Tidak memasukkan USB sembarangan → Risiko: penyebaran virus/malware ke seluruh jaringan
8. Laporkan kerusakan segera → Risiko: kerusakan menyebar, membahayakan pengguna lain

Nilai penuh: 5 aturan + risiko spesifik yang relevan untuk tiap aturan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Kamu menemukan sebuah artikel berita mengejutkan di media sosial dan ingin membagikannya ke teman-teman. Jelaskan langkah-langkah yang harus kamu lakukan sebelum membagikan informasi tersebut agar kamu tidak melanggar etika digital! Apa yang terjadi jika kamu langsung membagikan tanpa verifikasi?',
    'essay', 'mudah',
    'Jawaban ideal:
Langkah verifikasi sebelum share:
1. Periksa sumber berita — apakah dari media terpercaya/resmi?
2. Cek tanggal artikel — apakah masih relevan atau berita lama yang disebarkan ulang?
3. Cross-check di minimal 2–3 sumber berbeda untuk konfirmasi
4. Gunakan situs cek fakta (Turnbackhoax.id, Kompas Cek Fakta, dll)
5. Perhatikan judul — judul clickbait sering menyesatkan
6. Jika ragu, lebih baik tidak dibagikan

Risiko jika langsung dibagikan tanpa verifikasi:
- Menyebarkan hoaks yang merugikan pihak lain
- Bisa dikenai sanksi UU ITE (penjara/denda)
- Merusak reputasi diri sendiri
- Menimbulkan kepanikan atau konflik di masyarakat

Nilai penuh: langkah verifikasi minimal 4 + konsekuensi hukum/sosial yang tepat.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 7, 25);

  RAISE NOTICE 'Seed berhasil: 1 kompetensi "Pemrograman Komputer", 4 tes, 28 soal (20 PG 5-opsi + 8 essay).';
END $$;
