-- ============================================================
-- Seed: Roadmap Kompetensi Kelas XII
-- 1 Kompetensi: Pemodelan Perangkat Lunak Advance (urutan 1)
-- 5 Tes Kompetensi (5 PG 5-opsi + 2 Essay per tes)
-- Jalankan di Supabase SQL Editor
-- ============================================================

DO $block$
DECLARE
  v_jur uuid;

  k1 uuid; -- kompetensi

  t1 uuid; -- Component Diagram
  t2 uuid; -- Pemodelan Sistem Skala Penuh
  t3 uuid; -- Dokumentasi Teknis
  t4 uuid; -- Evaluasi & Pengujian Model
  t5 uuid; -- Presentasi Rancangan Sistem

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
    'Pemodelan Perangkat Lunak Advance',
    'Penguasaan pemodelan perangkat lunak tingkat lanjut: component diagram, pemodelan sistem skala penuh (integrasi semua diagram UML), dokumentasi teknis profesional, evaluasi & pengujian model, serta kemampuan mempresentasikan rancangan sistem secara komprehensif.',
    12, 1, 70, true)
  RETURNING id_kompetensi INTO k1;

  -- ----------------------------------------------------------
  -- KOMPETENSI_TUGAS
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Component Diagram',
    'Tes pemahaman dan pembuatan Component Diagram UML untuk memodelkan struktur komponen sistem, dependensi antar komponen, dan antarmuka yang disediakan maupun dibutuhkan.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t1;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Pemodelan Sistem Skala Penuh',
    'Tes kemampuan mengintegrasikan seluruh diagram UML (Use Case, Class, Sequence, Activity, Component, Deployment) untuk memodelkan sistem aplikasi nyata secara lengkap dan konsisten.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t2;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Dokumentasi Teknis',
    'Tes kemampuan menyusun dokumentasi teknis profesional: Software Design Document (SDD), API documentation, deployment guide, dan README yang komprehensif sesuai standar industri.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t3;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Evaluasi & Pengujian Model',
    'Tes kemampuan mengevaluasi kualitas model perangkat lunak menggunakan kriteria IEEE, melakukan review diagram untuk menemukan inkonsistensi, dan merancang test plan berdasarkan model.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t4;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Presentasi Rancangan Sistem',
    'Tes kemampuan mengkomunikasikan rancangan sistem secara lisan dan tertulis kepada audience teknis maupun non-teknis, menjawab pertanyaan teknis, dan mempertahankan keputusan desain.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t5;

  -- ==========================================================
  -- TES 1: COMPONENT DIAGRAM
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam Component Diagram UML, notasi yang menggambarkan antarmuka yang DISEDIAKAN oleh sebuah komponen (provided interface) adalah...',
    'pg', 'mudah',
    'Provided Interface digambarkan sebagai "lollipop" — lingkaran kecil yang terhubung ke komponen via garis. Artinya komponen tersebut menyediakan layanan/kontrak ini untuk digunakan komponen lain. Required Interface (antarmuka yang dibutuhkan) digambarkan sebagai "socket" — setengah lingkaran terbuka. Keduanya bersama membentuk Assembly Connector saat dikoneksikan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Panah putus-putus menuju komponen lain',false),
    (s,'B','Kotak persegi dengan stereotipe <<interface>>',false),
    (s,'C','Lingkaran kecil (lollipop) yang terhubung ke komponen',true),
    (s,'D','Setengah lingkaran terbuka (socket) yang terhubung ke komponen',false),
    (s,'E','Diamond hitam yang menunjuk ke komponen',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan utama antara Component Diagram dan Deployment Diagram dalam UML adalah...',
    'pg', 'sedang',
    'Component Diagram menunjukkan STRUKTUR LOGIS: komponen software, dependensinya, dan antarmuka yang disediakan/dibutuhkan — tidak membahas di server mana komponen berjalan. Deployment Diagram menunjukkan INFRASTRUKTUR FISIK: node (server, device), artifact yang di-deploy ke setiap node, dan koneksi fisik antar node. Component bisa ada di dalam Deployment Diagram sebagai komponen yang di-deploy ke node tertentu.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Component Diagram untuk sistem lama, Deployment Diagram untuk sistem baru',false),
    (s,'B','Component Diagram menampilkan struktur logis komponen software; Deployment Diagram menampilkan penempatan fisik komponen pada infrastruktur hardware',true),
    (s,'C','Keduanya identik — hanya berbeda notasi versi UML yang berbeda',false),
    (s,'D','Component Diagram hanya untuk backend; Deployment Diagram hanya untuk frontend',false),
    (s,'E','Deployment Diagram lebih detail dari Component Diagram karena mencakup kode sumber',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam Component Diagram, relasi dependensi antar komponen (komponen A menggunakan komponen B) digambarkan dengan...',
    'pg', 'sedang',
    'Dependensi digambar sebagai panah putus-putus (dashed arrow) dari komponen yang bergantung ke komponen yang dibutuhkan, dengan stereotipe <<use>>. Cara lain yang lebih ekspresif: gunakan Assembly Connector — required interface (socket) komponen A dihubungkan ke provided interface (lollipop) komponen B. Ini lebih informatif karena menunjukkan kontrak/antarmuka yang digunakan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Garis solid dengan panah tertutup (seperti inheritance di class diagram)',false),
    (s,'B','Panah putus-putus (dashed arrow) dari komponen yang bergantung ke komponen yang dibutuhkan',true),
    (s,'C','Garis ganda horizontal yang menghubungkan dua komponen',false),
    (s,'D','Diamond terbuka (aggregation) di sisi komponen yang digunakan',false),
    (s,'E','Panah dengan dua kepala yang menunjukkan dependensi dua arah',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Stereotipe UML yang digunakan untuk menandai sebuah komponen sebagai subsistem (kumpulan komponen yang bekerja bersama melayani fungsi tertentu) adalah...',
    'pg', 'sulit',
    '<<subsystem>> adalah stereotipe UML standar untuk mengelompokkan komponen yang bekerja bersama sebagai satu unit fungsional. Dalam Component Diagram, subsistem biasanya digambar sebagai komponen besar yang di dalamnya berisi komponen-komponen lebih kecil. Contoh: <<subsystem>> PaymentModule berisi komponen PaymentGateway, InvoiceService, RefundProcessor.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','<<module>>',false),
    (s,'B','<<package>>',false),
    (s,'C','<<subsystem>>',true),
    (s,'D','<<cluster>>',false),
    (s,'E','<<group>>',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Manfaat utama membuat Component Diagram sebelum memulai implementasi kode adalah...',
    'pg', 'mudah',
    'Component Diagram membantu: (1) Identifikasi komponen yang harus dibangun dan batasannya — developer tahu tanggung jawab masing-masing modul. (2) Identifikasi dependensi — bisa deteksi circular dependency sebelum kode ditulis. (3) Dasar pembagian kerja tim — tim A bangun komponen X, tim B bangun komponen Y, mereka hanya perlu menyepakati interface. (4) Estimasi kompleksitas lebih akurat.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Menghasilkan kode secara otomatis sehingga developer tidak perlu menulis kode',false),
    (s,'B','Memastikan sistem bebas dari bug sebelum implementasi',false),
    (s,'C','Mengidentifikasi komponen, batas tanggung jawab, dan dependensi antar modul sehingga tim bisa bekerja paralel dengan kontrak interface yang jelas',true),
    (s,'D','Menggantikan kebutuhan unit testing karena sudah tervisualisasi',false),
    (s,'E','Menentukan bahasa pemrograman yang paling tepat untuk setiap komponen',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah Component Diagram (deskripsikan secara tertulis dengan detail lengkap) untuk sistem e-learning sekolah yang memiliki fitur: login siswa/guru, melihat materi, mengumpulkan tugas, dan penilaian oleh guru. Diagram harus mencakup: (a) minimal 6 komponen utama dengan tanggung jawab masing-masing, (b) provided interface dan required interface setiap komponen, (c) dependensi antar komponen, (d) komponen eksternal (database, email service, storage), (e) pengelompokan komponen dalam subsistem yang logis!',
    'essay', 'sulit',
    'Jawaban ideal:

COMPONENT DIAGRAM — SISTEM E-LEARNING SEKOLAH

SUBSISTEM 1: <<subsystem>> Frontend Layer
  Komponen: WebApp (Browser Client)
  Provided Interface: UI (tampilan halaman ke user)
  Required Interface: IAuthService, IMateriService, ITugasService, INilaiService

SUBSISTEM 2: <<subsystem>> Application Layer (Backend)

  Komponen 1: AuthController
  Tanggung jawab: Handle login/logout/register, validasi token, manajemen session
  Provided Interface: IAuthService (login(), logout(), validateToken(), getProfile())
  Required Interface: IUserRepository, IEmailService

  Komponen 2: MateriController
  Tanggung jawab: CRUD materi, upload file, streaming video, akses kontrol
  Provided Interface: IMateriService (getMateri(), uploadMateri(), deleteMateri())
  Required Interface: IMateriRepository, IStorageService

  Komponen 3: TugasController
  Tanggung jawab: Distribusi tugas, pengumpulan jawaban, manajemen deadline
  Provided Interface: ITugasService (getTugas(), submitTugas(), getSubmission())
  Required Interface: ITugasRepository, IStorageService, INotifikasiService

  Komponen 4: NilaiController
  Tanggung jawab: Input nilai guru, kalkulasi nilai akhir, generate rapor
  Provided Interface: INilaiService (inputNilai(), getNilai(), generateRapor())
  Required Interface: INilaiRepository, ITugasRepository, INotifikasiService

SUBSISTEM 3: <<subsystem>> Data Layer

  Komponen 5: UserRepository
  Tanggung jawab: CRUD data user (siswa, guru, admin) ke database
  Provided Interface: IUserRepository (findByEmail(), save(), findById())
  Required Interface: IDatabase

  Komponen 6: TugasRepository & NilaiRepository & MateriRepository
  (pola sama: CRUD ke database untuk entitas masing-masing)
  Required Interface: IDatabase

KOMPONEN EKSTERNAL:

  <<external>> Database (MySQL/PostgreSQL)
  Provided Interface: IDatabase (query(), transaction(), connection())

  <<external>> EmailService (SMTP / SendGrid)
  Provided Interface: IEmailService (send(), sendBulk(), verifyEmail())

  <<external>> StorageService (AWS S3 / Google Cloud Storage)
  Provided Interface: IStorageService (upload(), download(), delete(), getUrl())

DEPENDENSI ANTAR KOMPONEN (panah putus-putus):
- WebApp --> AuthController (via IAuthService)
- WebApp --> MateriController (via IMateriService)
- WebApp --> TugasController (via ITugasService)
- WebApp --> NilaiController (via INilaiService)
- AuthController --> UserRepository (via IUserRepository)
- AuthController --> EmailService (via IEmailService)
- MateriController --> MateriRepository (via IMateriRepository)
- MateriController --> StorageService (via IStorageService)
- TugasController --> TugasRepository (via ITugasRepository)
- TugasController --> StorageService (via IStorageService)
- NilaiController --> NilaiRepository (via INilaiRepository)
- *Repository --> Database (via IDatabase)

Nilai penuh: 6+ komponen dengan tanggung jawab + provided/required interface tiap komponen + dependensi lengkap + 3 komponen eksternal + 2 subsistem logis.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan konsep "Loose Coupling" dan "High Cohesion" dalam desain komponen perangkat lunak! Mengapa kedua prinsip ini penting? Kemudian analisis: apakah Component Diagram berikut sudah menerapkan prinsip ini dengan baik? Komponen MonolithicApp menyediakan SEMUA interface (login, nilai, tugas, materi, laporan, notifikasi, payment) dan tidak bergantung pada komponen lain sama sekali. Berikan rekomendasi perbaikan!',
    'essay', 'sedang',
    'Jawaban ideal:

LOOSE COUPLING:
Definisi: tingkat ketergantungan antar komponen seminimal mungkin. Komponen A tidak perlu tahu detail implementasi komponen B — hanya perlu tahu interface-nya.
Manfaat: (1) Komponen bisa diubah/diganti tanpa mempengaruhi komponen lain, (2) Lebih mudah ditest secara terisolasi (mock dependency), (3) Tim berbeda bisa mengerjakan komponen berbeda secara paralel, (4) Sistem lebih mudah di-scale (komponen tertentu bisa di-scale independen).

HIGH COHESION:
Definisi: setiap komponen bertanggung jawab pada satu area fungsional yang jelas dan semua fungsinya berkaitan erat (single responsibility principle di level komponen).
Manfaat: (1) Lebih mudah dipahami dan dipelihara, (2) Perubahan requirement tidak merambat ke seluruh sistem, (3) Reusability tinggi — komponen AuthService bisa dipakai di banyak aplikasi.

ANALISIS MonolithicApp:
MonolithicApp MELANGGAR KEDUA PRINSIP:

Masalah Cohesion (LOW COHESION):
Satu komponen menangani login + nilai + tugas + materi + laporan + notifikasi + payment — terlalu banyak tanggung jawab yang tidak berkaitan. Jika ada bug di payment, seluruh aplikasi (termasuk login) harus di-deploy ulang.

Masalah Coupling: Paradoksnya, meski tidak bergantung pada komponen lain, semua fitur SALING bergantung di dalam satu komponen — tight coupling internal yang lebih buruk karena tidak terlihat.

REKOMENDASI PERBAIKAN (pecah menjadi komponen terpisah):
Sebelum: 1 MonolithicApp dengan 7 tanggung jawab
Sesudah:
- AuthService: login, logout, token validation
- AkademikService: nilai, tugas, materi (atau pecah lebih lanjut)
- LaporanService: generate laporan, export PDF
- NotifikasiService: email, push notification
- PaymentService: pembayaran, invoice
Setiap komponen punya provided interface yang terdefinisi jelas dan hanya bergantung pada komponen lain lewat interface (loose coupling).

Manfaat setelah diperbaiki: setiap komponen bisa di-deploy, di-scale, di-test, dan dikembangkan secara independen oleh tim yang berbeda.

Nilai penuh: definisi loose coupling + manfaat + definisi high cohesion + manfaat + identifikasi 2 pelanggaran prinsip pada MonolithicApp + rekomendasi pemecahan 5+ komponen dengan alasan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 7, 25);

  -- ==========================================================
  -- TES 2: PEMODELAN SISTEM SKALA PENUH
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam pemodelan sistem skala penuh, diagram UML yang paling tepat untuk menunjukkan BAGAIMANA objek-objek berinteraksi saat menjalankan sebuah use case tertentu (alur pesan antar objek dalam urutan waktu) adalah...',
    'pg', 'mudah',
    'Sequence Diagram menampilkan interaksi antar objek dalam urutan waktu (vertikal). Setiap use case idealnya punya satu atau lebih sequence diagram untuk mengilustrasikan alurnya. Collaboration/Communication Diagram juga menampilkan interaksi tapi berfokus pada struktur (hubungan antar objek), bukan urutan waktu. Activity Diagram untuk alur kerja/proses bisnis.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Class Diagram',false),
    (s,'B','Use Case Diagram',false),
    (s,'C','Sequence Diagram',true),
    (s,'D','Component Diagram',false),
    (s,'E','State Machine Diagram',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam pemodelan sistem skala penuh, konsistensi antar diagram sangat penting. Jika Class Diagram memiliki class "Siswa" dengan method "kumpulkanTugas()", maka di Sequence Diagram...',
    'pg', 'sedang',
    'Konsistensi adalah kualitas kritis pemodelan skala penuh. Jika Class Diagram mendefinisikan method kumpulkanTugas() pada class Siswa, maka di Sequence Diagram pesan/message yang dikirim ke objek :Siswa harus menggunakan nama yang sama persis. Inconsistency antar diagram menunjukkan model belum matang dan akan membingungkan developer saat implementasi.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Method kumpulkanTugas() tidak perlu muncul — sequence diagram bebas dari class diagram',false),
    (s,'B','Pesan yang dikirim ke objek :Siswa harus menggunakan nama method yang sama: kumpulkanTugas()',true),
    (s,'C','Nama method boleh berbeda di sequence diagram karena ini level abstraksi berbeda',false),
    (s,'D','Sequence diagram hanya menampilkan method dari interface, bukan dari class konkret',false),
    (s,'E','Method di class diagram otomatis tidak berlaku jika tidak muncul di sequence diagram',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Urutan yang benar dalam membuat model UML sistem skala penuh (dari abstrak ke detail) adalah...',
    'pg', 'sulit',
    'Pendekatan top-down yang umum: (1) Use Case Diagram — fungsionalitas apa yang ada (level bisnis). (2) Activity Diagram — alur kerja setiap use case. (3) Class Diagram — struktur data dan relasi (level desain). (4) Sequence/Collaboration Diagram — interaksi dinamis saat runtime. (5) Component Diagram — struktur modul/arsitektur. (6) Deployment Diagram — infrastruktur fisik. Ini tidak kaku tapi sering diikuti secara iteratif.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Deployment → Component → Class → Sequence → Activity → Use Case',false),
    (s,'B','Class → Use Case → Sequence → Activity → Component → Deployment',false),
    (s,'C','Use Case → Activity → Class → Sequence → Component → Deployment',true),
    (s,'D','Sequence → Class → Use Case → Component → Activity → Deployment',false),
    (s,'E','Semua diagram dibuat bersamaan dalam satu sesi pemodelan',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Teknik "4+1 Architectural View Model" (Kruchten) mendeskripsikan arsitektur software dari 5 sudut pandang. View yang menggambarkan proses runtime (concurrency, thread, process) adalah...',
    'pg', 'sulit',
    '4+1 View: (1) Logical View (Class/Object Diagram) — struktur dan fungsionalitas. (2) Process View (Activity/Sequence Diagram) — runtime, concurrency, thread, sinkronisasi. (3) Development View (Component/Package Diagram) — struktur modul untuk developer. (4) Physical View (Deployment Diagram) — hardware, jaringan, deployment. (+1) Scenarios (Use Case Diagram) — mengilustrasikan dan memvalidasi keempat view.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Logical View',false),
    (s,'B','Physical View',false),
    (s,'C','Process View',true),
    (s,'D','Development View',false),
    (s,'E','Scenarios View',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam pemodelan sistem skala penuh, "traceability" (keterlacakan) berarti...',
    'pg', 'sedang',
    'Traceability: kemampuan melacak hubungan antara elemen di satu artefak ke elemen di artefak lain. Contoh: Use Case "Submit Tugas" → sequence diagram "submitTugas" → class "Tugas" + method "submit()" → komponen "TugasController" → tabel database "tugas". Jika requirement berubah, traceability memungkinkan identifikasi semua artefak yang perlu diperbarui. Penting untuk change management dan impact analysis.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Kemampuan sistem untuk di-trace saat terjadi error runtime',false),
    (s,'B','Log yang mencatat setiap perubahan diagram selama proses pemodelan',false),
    (s,'C','Kemampuan melacak hubungan antara requirement, diagram desain, komponen, dan kode implementasi',true),
    (s,'D','Fitur undo/redo di tool pemodelan UML',false),
    (s,'E','Nomor versi yang diberikan pada setiap diagram yang dibuat',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Anda ditugaskan membuat model lengkap untuk "Sistem Presensi Digital Sekolah" yang memiliki fitur: (a) guru membuat QR Code presensi per sesi kelas, (b) siswa scan QR lewat mobile app, (c) sistem validasi QR dan catat presensi, (d) wali kelas lihat rekap presensi, (e) sistem kirim notifikasi ke orang tua jika siswa tidak hadir. Buat daftar lengkap diagram UML yang diperlukan, jelaskan isi setiap diagram, dan tunjukkan bagaimana masing-masing diagram saling berkaitan (traceability)!',
    'essay', 'sulit',
    'Jawaban ideal:

DAFTAR DIAGRAM UML YANG DIPERLUKAN:

1. USE CASE DIAGRAM
Aktor: Guru, Siswa, Wali Kelas, Orang Tua (notif), System (timer)
Use Case utama:
- Guru: Buat Sesi Presensi, Generate QR Code, Lihat Rekap Harian
- Siswa: Scan QR Code, Lihat Status Presensi Sendiri
- Wali Kelas: Lihat Rekap Presensi Kelas, Export Laporan
- System: Kirim Notifikasi Ketidakhadiran (<<extend>> dari Catat Presensi)
Relasi: Generate QR <<include>> Buat Sesi, Kirim Notifikasi <<extend>> Catat Presensi

2. ACTIVITY DIAGRAM — Alur Scan Presensi
Start → Siswa buka app → Scan QR → [QR valid?]
  Ya → [QR sudah expired?]
    Tidak expired → [Siswa sudah scan hari ini?]
      Belum → Catat Hadir → Update UI siswa → Henti
      Sudah → Tampilkan "Sudah Presensi" → Henti
    Expired → Tampilkan error "QR Kedaluwarsa" → Henti
  Tidak valid → Tampilkan error → Henti

3. CLASS DIAGRAM
Class utama:
- Guru (-id, -nama, -nip) + buat_sesi(), generate_qr()
- Siswa (-nis, -nama, -kelas) + scan_presensi()
- SesiPresensi (-id, -id_guru, -id_mapel, -token, -waktu_mulai, -waktu_berakhir) + isValid()
- Presensi (-id, -id_siswa, -id_sesi, -waktu_scan, -status: hadir/terlambat/alpha)
- NotifikasiOrangTua (-id, -id_presensi, -no_hp_ortu, -status_kirim, -waktu_kirim)
Relasi: Guru -hasMany-> SesiPresensi, SesiPresensi -hasMany-> Presensi, Siswa -hasMany-> Presensi

4. SEQUENCE DIAGRAM — Use Case "Scan QR Code"
Lifeline: :Siswa, :MobileApp, :PresensiController, :SesiPresensiRepository, :PresensiRepository, :NotifikasiService
1. Siswa scan QR → MobileApp: decode token
2. MobileApp → PresensiController: POST /presensi {token, id_siswa}
3. PresensiController → SesiPresensiRepository: findByToken(token)
4. SesiPresensiRepo → PresensiController: sesi (atau null)
5. [alt] sesi valid dan belum expired:
   PresensiController → PresensiRepository: save(id_siswa, id_sesi, HADIR)
   [end] kalau absen: NotifikasiService.kirim(ortu)
6. PresensiController → MobileApp: response sukses/error

5. COMPONENT DIAGRAM
Komponen: MobileApp, WebApp (guru/walikelas), PresensiService, NotifikasiService, QRGeneratorService, Database, WhatsApp API

6. DEPLOYMENT DIAGRAM
Node: Smartphone Siswa (MobileApp), Laptop Guru (Browser), App Server (Spring Boot/Laravel), DB Server (MySQL), Notification Server

TRACEABILITY:
Use Case "Scan QR" → Activity Diagram alur scan → Class Diagram (Siswa, SesiPresensi, Presensi) → Sequence Diagram (interaksi antar objek saat scan) → Component Diagram (MobileApp + PresensiService komponen) → Deployment Diagram (Smartphone + App Server node)

Nilai penuh: 5-6 diagram disebutkan + isi setiap diagram dijelaskan dengan elemen konkret + traceability minimal 2 artefak ke diagram lain.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara pendekatan pemodelan "Big Design Up Front (BDUF)" dan "Just Enough Design (JED/Agile Modeling"! Kapan masing-masing tepat digunakan? Dalam konteks proyek pengembangan aplikasi sekolah selama 4 bulan dengan tim 5 orang, diagram UML mana saja yang wajib dibuat dan mana yang opsional? Berikan rekomendasi dengan alasan!',
    'essay', 'sedang',
    'Jawaban ideal:

BIG DESIGN UP FRONT (BDUF):
Definisi: buat semua dokumentasi dan diagram desain secara lengkap dan detail SEBELUM menulis satu baris kode pun. Model harus sempurna sebelum implementasi dimulai.
Kelebihan: risiko rancangan ulang besar di akhir lebih kecil, cocok untuk tim besar terdistribusi yang butuh dokumentasi sebagai kontrak, wajib untuk sistem kritis (avionik, medis, perbankan core).
Kekurangan: lambat di awal, requirement sering berubah sehingga dokumen cepat obsolete, over-engineering untuk fitur yang ternyata tidak diperlukan, biaya dokumentasi besar.
Kapan tepat: proyek pemerintah/militer/medis dengan requirement frozen, sistem safety-critical, kontrak fixed-price dengan klien, tim besar > 20 orang terdistribusi.

JUST ENOUGH DESIGN (Agile Modeling):
Definisi: buat model secukupnya untuk memandu implementasi sprint berikutnya. Model dibuat iteratif, tidak perlu sempurna, boleh kasar (whiteboard sketch).
Kelebihan: responsif terhadap perubahan requirement, hemat waktu dokumentasi, developer bisa mulai coding lebih cepat, model selalu relevan (dibuat dekat dengan implementasi).
Kekurangan: risiko rancangan besar perlu diubah jika ada keputusan arsitektur keliru di awal, kurang cocok untuk tim besar karena shared understanding sulit tanpa dokumentasi.
Kapan tepat: startup, proyek 3-6 bulan, tim kecil 3-8 orang, requirement masih sering berubah.

REKOMENDASI UNTUK PROYEK SEKOLAH (4 bulan, 5 orang):

WAJIB DIBUAT:
1. Use Case Diagram — definisikan scope dan semua fungsi sistem, baseline yang disepakati bersama tim dan stakeholder. Tanpa ini, risiko scope creep tinggi.
2. Class Diagram (untuk modul inti) — struktur data utama dan relasi. Dasar pembuatan migration database. Tidak harus semua class, cukup domain model utama.
3. Sequence Diagram (2-3 alur kritis) — misalnya alur login, alur submit tugas, alur penilaian. Untuk memastikan semua anggota tim paham interaksi antar komponen sebelum implementasi.

OPSIONAL (buat jika diperlukan):
4. Activity Diagram — untuk alur bisnis yang kompleks saja, tidak semua use case.
5. Component Diagram — jika sistem dipecah ke banyak service/komponen independen.
6. Deployment Diagram — jika ada keputusan infrastruktur yang kompleks (multi-server, cloud).

YANG BISA DILEWATI untuk proyek ini:
- State Machine Diagram (kecuali ada objek dengan lifecycle kompleks)
- Collaboration Diagram (sequence sudah cukup)
- Object Diagram (class diagram sudah cukup)

Nilai penuh: definisi BDUF + JED + kelebihan/kekurangan masing-masing + kapan tepat + rekomendasi 3 diagram wajib dengan alasan + opsional + yang bisa dilewati untuk konteks proyek 4 bulan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 7, 25);

  -- ==========================================================
  -- TES 3: DOKUMENTASI TEKNIS
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Standar dokumentasi yang paling umum digunakan untuk mendeskripsikan kebutuhan perangkat lunak (apa yang harus dilakukan sistem) adalah...',
    'pg', 'mudah',
    'IEEE 830 / IEEE 29148 mendefinisikan standar untuk Software Requirements Specification (SRS). SRS mendeskripsikan APA yang sistem harus lakukan (fungsional) dan batasan BAGAIMANA (non-fungsional: performa, keamanan, ketersediaan). Berbeda dari SDD (Software Design Document) yang mendeskripsikan BAGAIMANA sistem akan dibangun secara teknis.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','SDD (Software Design Document)',false),
    (s,'B','SRS (Software Requirements Specification) sesuai IEEE 830',true),
    (s,'C','STP (Software Test Plan)',false),
    (s,'D','SAD (Software Architecture Document)',false),
    (s,'E','SUM (Software User Manual)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Format dokumentasi API yang paling banyak digunakan di industri saat ini yang memungkinkan dokumentasi interaktif (bisa langsung mencoba endpoint dari browser) adalah...',
    'pg', 'sedang',
    'OpenAPI Specification (sebelumnya Swagger) adalah standar de-facto dokumentasi REST API. File YAML/JSON yang mendeskripsikan semua endpoint, parameter, request/response schema. Swagger UI menghasilkan halaman web interaktif dari file OpenAPI — developer bisa langsung try-out endpoint. Tools: Swagger Editor, Redoc, Postman bisa import OpenAPI.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','RAML (RESTful API Modeling Language)',false),
    (s,'B','API Blueprint (Markdown format)',false),
    (s,'C','OpenAPI Specification (Swagger)',true),
    (s,'D','WSDL (Web Services Description Language)',false),
    (s,'E','JSON Schema (tanpa API description)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Prinsip "Docs as Code" (Documentation as Code) berarti...',
    'pg', 'sedang',
    'Docs as Code: dokumentasi diperlakukan seperti kode — disimpan di repository git bersama kode, ditulis dalam format plain text (Markdown, AsciiDoc, reStructuredText), di-review melalui pull request, di-build otomatis oleh CI/CD pipeline (generate HTML/PDF). Keuntungan: dokumentasi selalu sinkron dengan kode, versi terkontrol, mudah di-diff, bisa diupdate siapa saja dalam tim (bukan hanya technical writer).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Dokumentasi dibuat otomatis 100% dari kode sumber tanpa perlu ditulis manual',false),
    (s,'B','Dokumentasi disimpan di repository git, ditulis dalam plain text, dan dikelola seperti kode (review, versioning, CI/CD)',true),
    (s,'C','Semua dokumentasi harus ditulis dalam bahasa pemrograman (Python, JavaScript, dll)',false),
    (s,'D','Kode program digunakan sebagai pengganti dokumentasi tradisional',false),
    (s,'E','Dokumentasi hanya boleh dibuat oleh developer yang menulis kode bersangkutan',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam README.md sebuah proyek open-source yang baik, bagian yang menjelaskan cara menginstal dan menjalankan proyek untuk pertama kali disebut...',
    'pg', 'mudah',
    'Getting Started / Quick Start adalah bagian README yang paling sering dicari developer baru. Berisi: prerequisites (apa yang harus sudah terinstall), langkah instalasi, konfigurasi environment, dan cara menjalankan. README yang baik juga memiliki: deskripsi singkat, fitur utama, cara berkontribusi (Contributing), lisensi, dan link ke dokumentasi lebih lengkap.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Changelog',false),
    (s,'B','Contributing',false),
    (s,'C','Getting Started / Quick Start / Installation',true),
    (s,'D','License',false),
    (s,'E','FAQ',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dokumentasi yang menjelaskan MENGAPA sebuah keputusan arsitektur diambil (bukan hanya apa keputusannya) disebut...',
    'pg', 'sedang',
    'Architecture Decision Record (ADR) mendokumentasikan: konteks masalah yang dihadapi, opsi-opsi yang dipertimbangkan, keputusan yang diambil, alasan/rationale, dan konsekuensi (positif dan negatif). ADR sangat berharga bagi anggota tim baru atau tim di masa depan agar tidak mengulang keputusan yang sama atau membatalkan keputusan tanpa memahami alasannya.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Technical Specification Document',false),
    (s,'B','System Architecture Document',false),
    (s,'C','Architecture Decision Record (ADR)',true),
    (s,'D','Design Pattern Catalog',false),
    (s,'E','Code Review Comment',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah dokumentasi teknis lengkap untuk API endpoint "Submit Tugas" pada sistem e-learning sekolah menggunakan format OpenAPI/Swagger! Dokumentasi harus mencakup: (a) deskripsi endpoint, method HTTP, dan URL, (b) request headers yang diperlukan (autentikasi), (c) request body schema lengkap dengan tipe data dan validasi, (d) response schema untuk kasus sukses (201) dan minimal 3 kasus error (400, 401, 409), (e) contoh request dan response dalam format JSON!',
    'essay', 'sulit',
    'Jawaban ideal (format OpenAPI YAML):

openapi: 3.0.3
info:
  title: E-Learning Sekolah API
  version: 1.0.0

paths:
  /api/v1/tugas/{id_tugas}/submit:

    # (a) Deskripsi endpoint
    post:
      summary: Submit jawaban tugas
      description: |
        Siswa mengirimkan jawaban untuk tugas tertentu.
        Setiap siswa hanya bisa submit satu kali per tugas.
        File jawaban wajib dilampirkan jika tipe tugas adalah "upload_file".
      tags: [Tugas]
      operationId: submitTugas

      parameters:
        - name: id_tugas
          in: path
          required: true
          schema: { type: integer }
          description: ID tugas yang akan disubmit

      # (b) Request Headers (autentikasi)
      security:
        - BearerAuth: []
      # Header: Authorization: Bearer <jwt_token>

      # (c) Request Body
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              required: [jawaban_teks]
              properties:
                jawaban_teks:
                  type: string
                  minLength: 10
                  maxLength: 5000
                  description: Isi jawaban dalam bentuk teks
                  example: "Jawaban saya untuk tugas ini adalah..."
                file_jawaban:
                  type: string
                  format: binary
                  description: File jawaban (opsional, maks 10MB, format .pdf/.docx/.zip)
                catatan:
                  type: string
                  maxLength: 500
                  description: Catatan tambahan untuk guru (opsional)

      responses:
        # (d) Respons sukses
        ''201'':
          description: Tugas berhasil dikumpulkan
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: true }
                  message: { type: string, example: "Tugas berhasil dikumpulkan" }
                  data:
                    type: object
                    properties:
                      id_pengumpulan: { type: integer, example: 99 }
                      id_siswa: { type: integer, example: 42 }
                      id_tugas: { type: integer, example: 7 }
                      waktu_submit: { type: string, format: date-time }
                      status: { type: string, example: "menunggu_penilaian" }

        # (d) Error responses
        ''400'':
          description: Data tidak valid
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: false }
                  errors:
                    type: object
                    example:
                      jawaban_teks: ["Jawaban minimal 10 karakter"]
                      file_jawaban: ["Ukuran file maksimal 10MB"]

        ''401'':
          description: Tidak terautentikasi
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: false }
                  message: { type: string, example: "Token tidak valid atau sudah kedaluwarsa" }
                  code: { type: string, example: "UNAUTHORIZED" }

        ''409'':
          description: Tugas sudah pernah dikumpulkan
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean, example: false }
                  message: { type: string, example: "Kamu sudah mengumpulkan tugas ini" }
                  code: { type: string, example: "ALREADY_SUBMITTED" }
                  data:
                    type: object
                    properties:
                      waktu_submit_sebelumnya: { type: string, format: date-time }

# (e) Contoh sudah tercakup di schema/example masing-masing response di atas

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

Nilai penuh: format OpenAPI/YAML yang benar + deskripsi endpoint + security/header + requestBody dengan tipe dan validasi + response 201 dengan data schema + 3 error response (400+401+409) dengan pesan dan code + contoh JSON di masing-masing response.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Anda baru bergabung di tim yang mewarisi proyek sistem informasi sekolah berumur 3 tahun tanpa dokumentasi apapun. Jelaskan strategi Anda untuk: (a) membuat dokumentasi dari kode yang sudah ada (reverse engineering documentation), (b) menentukan prioritas dokumentasi mana yang harus dibuat pertama, (c) mencegah situasi yang sama di masa depan (membangun budaya dokumentasi dalam tim), (d) tools apa saja yang bisa membantu proses ini!',
    'essay', 'sedang',
    'Jawaban ideal:

(a) REVERSE ENGINEERING DOCUMENTATION:

Langkah 1 — Pahami codebase (1-2 minggu):
- Baca semua route/controller untuk memahami fitur yang ada
- Jalankan aplikasi, explore semua halaman dan fitur
- Baca skema database untuk memahami domain model
- Tanya ke stakeholder atau user: apa saja fitur utama yang digunakan sehari-hari?

Langkah 2 — Buat diagram dari kode (bukan sebaliknya):
- Class diagram: generate dari kode menggunakan tools (PhpStorm, Visual Paradigm import source)
- ERD: generate dari skema database menggunakan MySQL Workbench atau dbdiagram.io
- Sequence diagram: buat manual untuk alur kritis berdasarkan pembacaan kode controller

Langkah 3 — Dokumentasi API:
- Gunakan Postman: test semua endpoint, export sebagai dokumentasi
- Atau annotate kode dengan PHPDoc/JSDoc lalu generate dengan tools

(b) PRIORITAS DOKUMENTASI:

Prioritas 1 (KRITIS — buat pertama):
- ERD/skema database — tanpa ini, perubahan database sangat berisiko
- README basic: cara setup, cara run, dependency apa saja
- Daftar fitur dan use case utama

Prioritas 2 (PENTING — buat dalam 1 bulan):
- API documentation untuk semua endpoint yang dipakai frontend/mobile
- ADR untuk keputusan arsitektur besar yang sudah ada (kenapa pakai framework X, kenapa struktur folder seperti ini)
- Deployment guide: cara deploy ke production

Prioritas 3 (BERGUNA — buat bertahap):
- Class diagram domain model
- Sequence diagram alur kritis
- Panduan kontribusi untuk developer baru

(c) MEMBANGUN BUDAYA DOKUMENTASI:

1. Definition of Done: setiap PR/task baru dianggap selesai HANYA jika ada update dokumentasi yang relevan
2. Dokumentasi satu layar sama dengan kode: simpan di repo yang sama (Docs as Code), review di PR yang sama
3. Template siap pakai: sediakan template ADR, template API doc, template README agar mudah diisi
4. Alokasi waktu: 10-20% waktu sprint untuk dokumentasi — bukan kerja lembur
5. Rotasi "Doc Champion": setiap sprint ada satu orang yang bertanggung jawab review kualitas dokumentasi

(d) TOOLS YANG MEMBANTU:

- dbdiagram.io / MySQL Workbench: generate ERD dari database yang sudah ada
- Swagger/Postman: dokumentasi dan testing API sekaligus
- Notion / Confluence: wiki tim, ADR, runbook
- MkDocs / Docusaurus / GitBook: publish dokumentasi dari Markdown (Docs as Code)
- PhpStorm / IntelliJ: generate class diagram dari kode PHP/Java
- PlantUML / Mermaid: diagram as code, bisa disimpan di git

Nilai penuh: langkah reverse engineering (baca codebase + generate diagram + API doc) + 3 level prioritas dengan konten spesifik + 4-5 cara bangun budaya dokumentasi + minimal 4 tools dengan fungsinya.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 7, 25);

  -- ==========================================================
  -- TES 4: EVALUASI & PENGUJIAN MODEL
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Kriteria evaluasi model UML yang mengukur seberapa lengkap semua aspek sistem sudah dimodelkan (tidak ada elemen penting yang terlewat) disebut...',
    'pg', 'sedang',
    'Completeness (kelengkapan): semua use case punya diagram yang mendeskripsikannya, semua class yang disebutkan di sequence diagram ada di class diagram, semua aktor terdefinisi, semua exception path dimodelkan. Konsistensi (consistency): elemen yang sama disebut dengan nama yang sama di semua diagram. Correctness: model menggambarkan sistem yang bisa diimplementasikan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Consistency (Konsistensi)',false),
    (s,'B','Correctness (Kebenaran)',false),
    (s,'C','Completeness (Kelengkapan)',true),
    (s,'D','Clarity (Kejelasan)',false),
    (s,'E','Conciseness (Keringkasan)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Teknik pengujian yang menurunkan test case langsung dari Use Case Diagram (setiap use case jadi setidaknya satu skenario test) disebut...',
    'pg', 'sedang',
    'Use Case-based Testing: setiap use case menghasilkan test scenario. Use case punya basic flow (happy path) dan alternative/exception flow. Setiap flow jadi satu test case. Ini memastikan coverage dari perspektif user. Model-based Testing secara umum menggunakan model (UML, state machine, dll) sebagai dasar pembuatan test case — lebih sistematis dari ad-hoc testing.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Equivalence Partitioning',false),
    (s,'B','Boundary Value Analysis',false),
    (s,'C','Use Case-based Testing (Model-based Testing)',true),
    (s,'D','Statement Coverage Testing',false),
    (s,'E','Mutation Testing',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Inkonsistensi yang paling sering ditemukan saat mereview model UML skala besar adalah...',
    'pg', 'sulit',
    'Inkonsistensi nama (naming inconsistency) adalah yang paling umum: class "User" di class diagram dipanggil "Pengguna" di sequence diagram, method "simpanData()" di class diagram menjadi "saveData()" di sequence diagram. Ini terjadi karena diagram dibuat oleh orang berbeda atau di waktu berbeda tanpa shared glossary. Solusi: buat glossary/kamus istilah di awal proyek dan patuhi naming convention.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Diagram yang terlalu besar dan tidak muat di satu halaman',false),
    (s,'B','Penggunaan warna yang tidak konsisten antar diagram',false),
    (s,'C','Inkonsistensi nama — elemen yang sama disebut dengan nama berbeda di diagram yang berbeda',true),
    (s,'D','Jumlah diagram yang terlalu sedikit untuk sistem yang kompleks',false),
    (s,'E','Versi UML yang berbeda antara diagram yang satu dengan yang lain',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam konteks evaluasi model perangkat lunak, "walkthrough" berbeda dari "formal inspection" karena...',
    'pg', 'sedang',
    'Walkthrough: author menjelaskan model/dokumen kepada reviewer sementara reviewer memberikan masukan — informal, tanpa prosedur ketat, tujuan utama adalah transfer knowledge dan menemukan masalah secara kolaboratif. Formal Inspection (Fagan Inspection): ada moderator, peran terdefinisi (author, reader, inspector, recorder), checklist formal, meeting terstruktur, defect di-log dan di-track. Lebih formal tapi lebih efektif untuk dokumen kritis.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Walkthrough dilakukan oleh orang luar tim, formal inspection oleh anggota tim sendiri',false),
    (s,'B','Walkthrough lebih informal — author menjelaskan ke reviewer; formal inspection punya peran, checklist, dan prosedur ketat',true),
    (s,'C','Walkthrough hanya untuk kode; formal inspection hanya untuk dokumen',false),
    (s,'D','Walkthrough membutuhkan tools khusus; formal inspection bisa dilakukan manual',false),
    (s,'E','Keduanya identik — hanya nama berbeda untuk organisasi berbeda',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Test plan yang diturunkan dari State Machine Diagram paling tepat untuk menguji...',
    'pg', 'sulit',
    'State Machine Diagram menggambarkan lifecycle suatu objek: state-state yang mungkin dan transisi antar state. Test case yang diturunkan: (1) setiap state harus dapat dicapai (state coverage), (2) setiap transisi harus ditest (transition coverage), (3) transisi yang tidak valid harus ditest (negative test — sistem harus menolak). Contoh: status pengumpulan tugas (draft → submitted → graded → revision_requested → submitted). Setiap transisi jadi satu test case.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Performa dan kecepatan respon sistem',false),
    (s,'B','Keamanan dan enkripsi data',false),
    (s,'C','Perilaku objek melalui semua state yang mungkin dan validitas setiap transisi state',true),
    (s,'D','Kompatibilitas sistem dengan berbagai browser',false),
    (s,'E','Jumlah pengguna yang bisa mengakses sistem secara bersamaan',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Lakukan evaluasi kritis terhadap Class Diagram berikut dan identifikasi masalahnya! Deskripsi diagram: Class "SistemSekolah" memiliki atribut: id_siswa, nama_siswa, kelas_siswa, id_guru, nama_guru, mapel_guru, id_nilai, nilai_uts, nilai_uas, nilai_akhir, id_tugas, judul_tugas, deadline_tugas. Method: tambahSiswa(), hapusSiswa(), tambahGuru(), inputNilai(), buatTugas(). Identifikasi: (a) minimal 4 masalah desain, (b) prinsip OOP/desain yang dilanggar, (c) refactoring menjadi class diagram yang benar!',
    'essay', 'sulit',
    'Jawaban ideal:

(a) 4 MASALAH DESAIN yang ditemukan:

1. GOD CLASS / LOW COHESION:
Satu class SistemSekolah bertanggung jawab atas segalanya — siswa, guru, nilai, tugas. Melanggar Single Responsibility Principle (SRP). Setiap kali ada perubahan pada entitas manapun, class ini harus diubah.

2. DATA CLUMPING — atribut seharusnya jadi class tersendiri:
- id_siswa + nama_siswa + kelas_siswa → harus jadi class Siswa
- id_guru + nama_guru + mapel_guru → harus jadi class Guru
- id_nilai + nilai_uts + nilai_uas + nilai_akhir → harus jadi class Nilai
- id_tugas + judul_tugas + deadline_tugas → harus jadi class Tugas
Ini mengindikasikan MISSING ABSTRACTION.

3. TIDAK ADA RELASI ANTAR ENTITAS:
Tidak ada yang menunjukkan bahwa Siswa memiliki banyak Nilai, Guru memberi Tugas, dll. Struktur relasional sekolah tidak termodel.

4. MIXING CONCERNS — method tidak kohesif:
tambahSiswa() dan tambahGuru() adalah domain yang berbeda tetapi ada di satu class. Seharusnya masing-masing ada di class-nya sendiri.

(b) PRINSIP YANG DILANGGAR:
- Single Responsibility Principle (SRP): satu class harus punya satu alasan untuk berubah
- Separation of Concerns: pemisahan domain siswa, guru, nilai, tugas
- DRY (dalam konteks desain): pola atribut yang sama (id + nama + ...) berulang tanpa diabstraksi
- Open/Closed Principle: penambahan entitas baru memaksa modifikasi SistemSekolah

(c) REFACTORING — CLASS DIAGRAM YANG BENAR:

Class Siswa:
- id: int
- nama: string
- tanggal_lahir: date
- getKelas(): Kelas
- getNilai(mapel): Nilai

Class Guru:
- id: int
- nama: string
- nip: string
- getMapel(): List<Mapel>
- buatTugas(mapel, judul, deadline): Tugas

Class Nilai:
- id: int
- nilai_uts: decimal
- nilai_uas: decimal
- getValue(): decimal (hitung otomatis)
- getPredikat(): string

Class Tugas:
- id: int
- judul: string
- deadline: datetime
- deskripsi: string
- getStatus(): string

Class Kelas:
- id: int
- nama: string
- tingkat: int
- getSiswa(): List<Siswa>

RELASI:
- Siswa -[0..*]---[1]- Kelas (Siswa terdaftar di satu Kelas)
- Guru -[0..*]---[0..*]- Mapel (many-to-many via Mengajar)
- Siswa -[0..*]---[0..*]- Tugas (pengumpulan via PengumpulanTugas)
- Nilai -[0..*]---[1]- Siswa
- Nilai -[0..*]---[1]- Mapel

Nilai penuh: 4 masalah teridentifikasi dengan nama anti-pattern + 3 prinsip OOP yang dilanggar + class diagram refactoring dengan minimal 5 class terpisah + relasi yang tepat.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah Test Plan lengkap untuk menguji Use Case "Input Nilai Siswa" (guru menginput nilai UTS, UAS, dan tugas harian untuk satu mapel satu kelas)! Test Plan harus mencakup: (a) minimal 5 test scenario (basic flow + alternative flow + exception flow), (b) test case detail untuk setiap skenario (precondition, langkah, expected result), (c) test data yang diperlukan, (d) kriteria lulus pengujian (pass/fail criteria)!',
    'essay', 'sedang',
    'Jawaban ideal:

TEST PLAN — USE CASE: INPUT NILAI SISWA

SCOPE: Fitur input nilai UTS, UAS, tugas harian oleh guru untuk satu mapel satu kelas.
PRECONDITION UMUM: Guru sudah login, punya akses mengajar kelas dan mapel yang bersangkutan.

(a + b) TEST SCENARIOS & TEST CASES:

SCENARIO 1 — Basic Flow: Input nilai lengkap dan valid [HAPPY PATH]
Precondition: Guru login, pilih kelas XII RPL, mapel Pemrograman Web
Langkah:
  1. Buka halaman input nilai
  2. Pilih siswa "Andi Saputra" dari daftar
  3. Input UTS: 85, UAS: 90, Tugas: 88
  4. Klik "Simpan"
Expected Result:
  - Data tersimpan, nilai akhir terhitung: (85*0.3)+(90*0.4)+(88*0.3) = 88.0
  - Predikat: B
  - Flash message: "Nilai berhasil disimpan"
  - Redirect ke halaman daftar nilai kelas

SCENARIO 2 — Alternative Flow: Update nilai yang sudah pernah diinput
Precondition: Nilai Andi Saputra sudah pernah diinput sebelumnya
Langkah: Input UTS baru: 90, klik Simpan
Expected Result: Nilai lama digantikan, nilai akhir dihitung ulang, flash message "Nilai berhasil diperbarui"

SCENARIO 3 — Exception Flow: Nilai di luar rentang 0-100
Langkah: Input UTS: -5 atau UAS: 110
Expected Result:
  - Error validasi muncul: "Nilai harus antara 0-100"
  - Data tidak tersimpan
  - Form tetap menampilkan nilai yang diinput (dengan old() value)

SCENARIO 4 — Exception Flow: Guru tidak punya hak akses mapel ini
Precondition: Guru login sebagai Pak Budi (mengajar Matematika), coba input nilai Pemrograman Web
Expected Result:
  - Sistem menolak dengan HTTP 403: "Anda tidak memiliki akses untuk mapel ini"
  - Tidak ada data yang tersimpan

SCENARIO 5 — Exception Flow: Akses tanpa login
Precondition: Belum login atau session expired
Langkah: Akses langsung URL /nilai/input
Expected Result: Redirect ke halaman login dengan pesan "Silakan login terlebih dahulu"

(c) TEST DATA:
Guru valid: { nama: "Ibu Dewi", mengajar: "XII RPL", mapel: "Pemrograman Web" }
Guru tidak valid: { nama: "Pak Budi", mengajar: "XII RPL", mapel: "Matematika" }
Siswa: { nis: "2024001", nama: "Andi Saputra", kelas: "XII RPL" }
Nilai valid: UTS=85, UAS=90, Tugas=88 (semua 0-100)
Nilai tidak valid: UTS=-5, UAS=110, Tugas="abc" (non-numerik)

(d) KRITERIA LULUS (Pass/Fail Criteria):
LULUS jika:
- Semua 5 skenario menghasilkan expected result yang tepat
- Validasi menolak semua input tidak valid
- Kalkulasi nilai akhir akurat (toleransi 0.01)
- Otorisasi bekerja — guru hanya bisa input nilai kelasnya sendiri
- Tidak ada data tersimpan saat error terjadi

GAGAL jika:
- Satu atau lebih skenario menghasilkan hasil yang berbeda dari expected
- Nilai di luar 0-100 bisa tersimpan
- Guru A bisa input nilai untuk kelas yang diajar Guru B

Nilai penuh: 5 skenario (happy path + 2 alternative + 2 exception) + detail precondition+langkah+expected result per skenario + test data konkret + pass/fail criteria yang terukur.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 7, 25);

  -- ==========================================================
  -- TES 5: PRESENTASI RANCANGAN SISTEM
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Saat mempresentasikan rancangan sistem kepada stakeholder non-teknis (kepala sekolah, komite), pendekatan yang paling efektif adalah...',
    'pg', 'mudah',
    'Non-technical stakeholder tidak memahami UML, class diagram, atau istilah teknis. Pendekatan efektif: (1) gunakan analogi dan bahasa sehari-hari, (2) fokus pada manfaat bisnis (apa yang bisa dilakukan sistem, bukan bagaimana cara kerjanya), (3) gunakan mockup/wireframe UI daripada diagram teknis, (4) visualisasi alur proses dengan flowchart sederhana, (5) cerita/scenario "user journey" yang relatable.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Tampilkan semua diagram UML secara lengkap agar terlihat profesional',false),
    (s,'B','Gunakan terminologi teknis yang tepat agar tidak ada misunderstanding',false),
    (s,'C','Fokus pada manfaat bisnis, gunakan bahasa sehari-hari, mockup UI, dan analogi yang relatable',true),
    (s,'D','Minta stakeholder belajar UML terlebih dahulu sebelum presentasi',false),
    (s,'E','Hanya tampilkan biaya dan timeline, skip bagian teknis sepenuhnya',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam presentasi rancangan sistem kepada tim developer, bagian yang paling penting untuk dijelaskan terlebih dahulu sebelum masuk ke detail teknis adalah...',
    'pg', 'sedang',
    'Konteks dan tujuan sistem (MENGAPA sistem dibangun, masalah apa yang dipecahkan) harus dijelaskan pertama. Developer yang memahami tujuan bisa membuat keputusan implementasi yang lebih baik, mengerti trade-off yang diambil, dan tidak salah arah. "Start with Why" — tanpa konteks, detail teknis tidak bermakna dan developer tidak bisa menilai apakah desain tepat atau tidak.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Langsung ke Class Diagram karena developer ingin hal konkret',false),
    (s,'B','Konteks bisnis dan tujuan sistem — MENGAPA sistem dibangun dan masalah apa yang dipecahkan',true),
    (s,'C','Stack teknologi yang akan digunakan (framework, database, server)',false),
    (s,'D','Timeline dan pembagian tugas kerja tim',false),
    (s,'E','Biaya infrastruktur dan estimasi total proyek',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Saat ditanya pertanyaan teknis yang belum kamu ketahui jawabannya saat presentasi desain sistem, respons yang paling profesional adalah...',
    'pg', 'sedang',
    'Jujur mengakui ketidaktahuan dan berkomitmen mencari jawaban adalah respons paling profesional. Mengarang jawaban (bluffing) sangat berbahaya — jika tertangkap, kredibilitas hancur. Mengatakan "saya tidak tahu" tanpa tindak lanjut juga tidak cukup. Respons ideal: "Saya belum pasti untuk hal ini, tapi saya akan cek dan follow up dalam [waktu spesifik]" — menunjukkan kejujuran dan profesionalisme.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Jawab dengan percaya diri meski tidak yakin, karena ragu-ragu terlihat tidak profesional',false),
    (s,'B','Alihkan topik ke bagian lain yang kamu kuasai',false),
    (s,'C','Jujur mengakui belum tahu, berkomitmen mencari jawaban, dan follow up setelah presentasi dengan waktu yang jelas',true),
    (s,'D','Minta penanya untuk mencari sendiri jawabannya',false),
    (s,'E','Batalkan presentasi dan minta jadwal ulang',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Teknik "storytelling" dalam presentasi rancangan sistem efektif karena...',
    'pg', 'mudah',
    'Storytelling (user scenario/journey) membuat konsep teknis lebih mudah dicerna: "Bayangkan Pak Budi guru Matematika ingin memasukkan nilai UTS kelas XII..." Audience langsung terhubung secara emosional dan kognitif. Jauh lebih efektif dari membacakan list fitur atau menampilkan diagram tanpa konteks. Storytelling membantu audience memahami nilai bisnis dan memvalidasi apakah sistem akan solve masalah nyata mereka.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Mengisi waktu presentasi sehingga tidak ada dead air',false),
    (s,'B','Membuat presenter terlihat lebih pintar karena bisa bercerita',false),
    (s,'C','Membuat konsep teknis lebih mudah dipahami dengan menghubungkannya ke skenario pengguna nyata yang relatable',true),
    (s,'D','Menggantikan kebutuhan diagram teknis sehingga presentasi lebih singkat',false),
    (s,'E','Menyembunyikan kelemahan desain dengan narasi yang menarik',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Ketika seorang reviewer mengkritik keputusan desain dalam rancangan sistem kamu, sikap yang paling konstruktif adalah...',
    'pg', 'sulit',
    'Dengarkan dulu, minta klarifikasi jika perlu, lalu evaluasi kritik secara objektif berdasarkan argumen teknis — bukan berdasarkan ego. Jika kritik valid: akui dan diskusikan alternatif. Jika tidak setuju: jelaskan reasoning di balik keputusan dengan data/pertimbangan, bukan defensif. Kritik dalam review adalah hadiah — membantu menemukan masalah sebelum implementasi yang jauh lebih mahal.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Langsung setuju dengan semua kritik untuk menghindari konflik',false),
    (s,'B','Pertahankan desain sepenuhnya karena kamu yang paling memahaminya',false),
    (s,'C','Dengarkan, evaluasi secara objektif, akui jika valid, atau jelaskan reasoning jika tidak setuju dengan argumen teknis yang kuat',true),
    (s,'D','Minta kritik disampaikan secara tertulis saja agar bisa dibalas nanti',false),
    (s,'E','Abaikan kritik yang berasal dari orang dengan jabatan lebih rendah',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Anda diminta mempresentasikan rancangan "Sistem Informasi Sekolah" kepada dua audience berbeda dalam satu hari: (a) Kepala Sekolah dan Komite Sekolah (non-teknis, fokus pada manfaat dan biaya) — 15 menit, (b) Tim Developer (teknis, perlu detail implementasi) — 45 menit. Buatlah outline presentasi untuk masing-masing audience! Jelaskan: struktur slide, konten utama setiap bagian, visual yang digunakan, dan strategi menjawab pertanyaan yang mungkin muncul dari masing-masing audience!',
    'essay', 'sulit',
    'Jawaban ideal:

PRESENTASI A — KEPALA SEKOLAH & KOMITE (15 menit, non-teknis)

OUTLINE SLIDE:

Slide 1 — PEMBUKAAN (1 menit):
Judul: "Sistem Informasi Sekolah: Transformasi Digital Pengelolaan Akademik"
Visual: foto/ilustrasi sekolah modern, bukan diagram teknis

Slide 2 — MASALAH SAAT INI (2 menit):
Konten: "Saat ini: nilai direkap manual di Excel → error, data hilang, lambat"
Visual: tabel perbandingan Sebelum vs Sesudah, bukan diagram UML

Slide 3 — SOLUSI: APA YANG BISA DILAKUKAN SISTEM (4 menit):
Konten: list fitur dalam bahasa bisnis
- "Guru input nilai langsung dari laptop/HP → tidak perlu rekap manual"
- "Siswa lihat nilai real-time → tidak perlu menunggu"
- "Laporan rapor otomatis → hemat 10 jam kerja per semester"
Visual: mockup/screenshot UI, bukan class diagram

Slide 4 — MANFAAT TERUKUR (3 menit):
Konten: estimasi penghematan waktu dan biaya, peningkatan akurasi data
Visual: grafik atau infografis sederhana

Slide 5 — TIMELINE & INVESTASI (3 menit):
Konten: jadwal 4 bulan (ringkas), estimasi biaya server, lisensi
Visual: timeline horizontal sederhana

Slide 6 — TANYA JAWAB (2 menit)

STRATEGI JAWAB PERTANYAAN:
- "Berapa biaya totalnya?" → siapkan estimasi rinci (hardware + pengembangan + maintenance)
- "Apakah data siswa aman?" → jelaskan backup harian + akses login, tanpa istilah teknis
- "Kapan bisa dipakai?" → sebutkan tanggal konkret, bukan "sekitar 4 bulan"

PRESENTASI B — TIM DEVELOPER (45 menit, teknis)

OUTLINE:

Slide 1-2 — KONTEKS & TUJUAN (5 menit):
Masalah bisnis, scope sistem, constraint (budget, timeline, tech stack)

Slide 3-4 — ARSITEKTUR TINGKAT TINGGI (8 menit):
Component Diagram, tech stack (Laravel + MySQL + Redis), alasan pemilihan
Diskusi: "Mengapa MySQL bukan PostgreSQL?" "Mengapa monolith dulu, bukan microservice?"

Slide 5-6 — DOMAIN MODEL (8 menit):
Class Diagram entitas utama (Siswa, Guru, Nilai, Tugas, Kelas)
Penjelasan relasi dan keputusan desain penting

Slide 7-8 — ALUR SISTEM KRITIS (10 menit):
Sequence Diagram untuk 2-3 use case kritis (login, input nilai, submit tugas)
Fokus pada error handling dan edge case

Slide 9 — SKEMA DATABASE (5 menit):
ERD singkat, indeks yang direncanakan, pertimbangan performa

Slide 10 — PEMBAGIAN KERJA & API CONTRACT (5 menit):
Modul siapa yang mengerjakan apa, interface antar tim (API endpoint list)

Slide 11-12 — TANYA JAWAB & DISKUSI (4 menit)

STRATEGI JAWAB PERTANYAAN TEKNIS:
- "Kenapa tidak pakai framework X?" → jelaskan pertimbangan (tim familiar, ekosistem, waktu)
- "Bagaimana handle concurrent request?" → jelaskan connection pooling + queue
- "Kalau ada yang tidak tahu?" → "Bagus, saya akan cek dan follow up besok"

Nilai penuh: 2 outline yang BERBEDA (non-teknis: manfaat+visual mockup, teknis: arsitektur+diagram) + konten per slide + visual yang tepat per audience + strategi pertanyaan berbeda per audience.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam sesi design review, reviewer mengajukan 3 pertanyaan kritis terhadap rancangan sistem presensi digital yang kamu buat: (1) "Bagaimana jika server down saat jam presensi? Siswa tidak bisa presensi sama sekali?" (2) "QR Code bisa di-screenshot dan dikirim ke teman yang tidak hadir — bagaimana mencegah kecurangan?" (3) "Jika ada 500 siswa scan QR bersamaan dalam 2 menit, apakah sistem bisa menangani?" Jawablah ketiga pertanyaan ini secara teknis dan profesional seolah-olah kamu sedang dalam sesi review!',
    'essay', 'sulit',
    'Jawaban ideal:

PERTANYAAN 1 — Offline/Server Down:
"Pertanyaan yang sangat valid dan memang harus kami antisipasi. Ada beberapa strategi:

Solusi 1 — Offline-first mode di mobile app:
App menyimpan data presensi secara lokal (SQLite) saat tidak ada koneksi, kemudian sync ke server saat koneksi kembali. QR masih bisa di-generate secara offline menggunakan pre-generated token yang di-cache di device guru.

Solusi 2 — Fallback ke presensi manual:
Jika server down > 5 menit, sistem otomatis fallback ke mode manual (guru catat di kertas, input ke sistem setelah server kembali).

Solusi 3 — High Availability setup:
Deploy di cloud dengan auto-scaling dan health check — uptime target 99.9% (8.7 jam downtime per tahun). Untuk sekolah, ini sudah cukup. Jika budget memungkinkan, bisa tambah load balancer dan standby server.

Untuk versi awal proyek ini, kami rekomendasikan solusi 1 (offline-first) karena paling praktis."

PERTANYAAN 2 — Screenshot QR Code:
"Ini kelemahan yang kami sudah identifikasi. Beberapa mitigasi yang bisa diterapkan:

Mitigasi 1 — QR dengan expiry pendek:
Token dalam QR di-generate ulang setiap 60 detik. QR yang di-screenshot akan expired setelah 1 menit. Ini yang paling efektif dan mudah diimplementasi.

Mitigasi 2 — Validasi lokasi GPS:
Saat scan, app mengirim koordinat GPS siswa. Server validasi apakah koordinat dalam radius 100m dari lokasi kelas. Screenshot tidak berguna jika siswa tidak di area sekolah.

Mitigasi 3 — One-time use token:
Setiap token hanya bisa digunakan satu kali per siswa. Jika siswa A sudah scan, token yang sama tidak bisa digunakan oleh siswa B.

Kami rekomendasikan kombinasi mitigasi 1 + 3 (token berubah tiap menit + one-time use) sebagai baseline. GPS sebagai opsional untuk sekolah yang memerlukan validasi ketat."

PERTANYAAN 3 — 500 Siswa Concurrent:
"Terima kasih atas pertanyaan performa ini — ini memang perlu dipersiapkan.

Analisis beban: 500 siswa dalam 2 menit = 4.2 request per detik rata-rata, dengan kemungkinan spike 15-20 req/detik di menit pertama. Ini termasuk beban rendah-menengah.

Stack saat ini (Laravel + MySQL di single server) bisa menangani ini ASALKAN:
1. Database connection pooling aktif (misalnya PgBouncer atau MySQL connection pool)
2. Response sudah di-cache untuk data yang tidak berubah (data sesi presensi)
3. Query sudah dioptimasi dan ada index pada kolom token dan id_siswa

Jika perlu scale lebih: tambahkan Redis sebagai cache layer untuk token validation — mengurangi hit ke database. Queue untuk proses notifikasi ke orang tua — tidak perlu real-time.

Kami akan lakukan load testing dengan Apache JMeter sebelum go-live untuk memvalidasi asumsi ini."

Nilai penuh: masing-masing pertanyaan dijawab dengan solusi teknis konkret (bukan hanya "perlu dipertimbangkan") + minimal 2 solusi per pertanyaan + rekomendasi mana yang diprioritaskan + nada profesional/kolaboratif.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 7, 25);

  RAISE NOTICE 'Seed berhasil: 1 kompetensi "Pemodelan Perangkat Lunak Advance" (tingkat=12, urutan=1), 5 tes, 35 soal (25 PG 5-opsi + 10 essay).';
END $block$;
