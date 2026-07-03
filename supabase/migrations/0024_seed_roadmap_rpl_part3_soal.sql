-- ============================================================
-- Seed Part 3: Soal Kompetensi + Opsi Jawaban (Kelas X & XI)
-- Jalankan SETELAH Part 1 & 2
-- ============================================================

DO $$
DECLARE
  v_jur uuid;
  s uuid; -- soal id sementara

  PROCEDURE ins_soal(
    p_pertanyaan text, p_kesulitan text, p_pembahasan text,
    p_a text, p_b text, p_c text, p_d text, p_benar text,
    OUT p_id uuid
  ) AS $proc$
  BEGIN
    INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
    SELECT v_jur, p_pertanyaan, 'pg', p_kesulitan, p_pembahasan
    RETURNING id_soal_kompetensi INTO p_id;

    INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (p_id, 'A', p_a, p_benar = 'A'),
    (p_id, 'B', p_b, p_benar = 'B'),
    (p_id, 'C', p_c, p_benar = 'C'),
    (p_id, 'D', p_d, p_benar = 'D');
  END $proc$ LANGUAGE plpgsql;

  PROCEDURE link(p_judul_kompetensi text, p_id_soal uuid, p_nomor int) AS $proc$
  DECLARE v_kt uuid;
  BEGIN
    SELECT kt.id_kompetensi_tugas INTO v_kt
    FROM public.kompetensi_tugas kt
    JOIN public.kompetensi k ON k.id_kompetensi = kt.id_kompetensi
    WHERE k.id_jurusan = v_jur AND k.judul = p_judul_kompetensi
    LIMIT 1;
    IF v_kt IS NOT NULL THEN
      INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot)
      VALUES (v_kt, p_id_soal, p_nomor, 20)
      ON CONFLICT DO NOTHING;
    END IF;
  END $proc$ LANGUAGE plpgsql;

BEGIN
  SELECT id_jurusan INTO v_jur FROM public.jurusan
  WHERE lower(nama_jurusan) LIKE '%rpl%' OR lower(nama_jurusan) LIKE '%pplg%'
     OR lower(kode_jurusan) LIKE '%rpl%' OR lower(kode_jurusan) LIKE '%pplg%'
  LIMIT 1;
  IF v_jur IS NULL THEN RAISE EXCEPTION 'Jurusan PPLG/RPL tidak ditemukan.'; END IF;

  -- ========== Konsep Algoritma ==========
  CALL ins_soal('Manakah yang BUKAN merupakan ciri-ciri algoritma yang baik?',
    'mudah', 'Algoritma yang baik harus memiliki langkah yang jelas, terbatas, menghasilkan output, dan dapat dieksekusi. Ambiguitas bukan ciri algoritma yang baik.',
    'Memiliki langkah-langkah yang jelas dan tidak ambigu',
    'Menghasilkan output yang tepat untuk setiap input',
    'Harus berjalan tanpa batas waktu agar akurat',
    'Dapat diselesaikan dalam jumlah langkah yang terbatas',
    'C', s);
  CALL link('Konsep Algoritma', s, 1);

  CALL ins_soal('Algoritma untuk menghitung kembalian uang paling tepat dimulai dengan langkah apa?',
    'mudah', 'Langkah pertama dalam algoritma apa pun adalah menerima/membaca input yang diperlukan.',
    'Cetak jumlah kembalian',
    'Kurangi harga dari uang yang dibayar',
    'Baca harga barang dan uang yang dibayar',
    'Tampilkan pesan terima kasih',
    'C', s);
  CALL link('Konsep Algoritma', s, 2);

  CALL ins_soal('Sebuah algoritma memiliki 3 input dan menghasilkan 0 output. Pernyataan yang benar adalah...',
    'sedang', 'Setiap algoritma yang benar harus menghasilkan setidaknya satu output.',
    'Algoritma tersebut valid karena input lebih banyak dari output',
    'Algoritma tersebut tidak valid karena harus ada minimal satu output',
    'Algoritma tersebut efisien karena tidak membuang memori untuk output',
    'Algoritma tersebut disebut prosedur, bukan algoritma',
    'B', s);
  CALL link('Konsep Algoritma', s, 3);

  CALL ins_soal('Urutan langkah algoritma yang benar untuk program "hitung luas persegi panjang" adalah...',
    'mudah', 'Urutan logis: input dulu → proses → output.',
    'Proses → Input → Output',
    'Output → Proses → Input',
    'Input → Output → Proses',
    'Input → Proses → Output',
    'D', s);
  CALL link('Konsep Algoritma', s, 4);

  CALL ins_soal('Apa yang dimaksud dengan "finiteness" (keterbatasan) dalam algoritma?',
    'sedang', 'Finiteness berarti algoritma harus berhenti setelah sejumlah langkah yang terbatas, tidak boleh berjalan selamanya.',
    'Algoritma hanya boleh memiliki satu input',
    'Algoritma harus berhenti setelah sejumlah langkah yang terbatas',
    'Algoritma tidak boleh memiliki percabangan',
    'Algoritma harus ditulis dalam satu halaman',
    'B', s);
  CALL link('Konsep Algoritma', s, 5);

  -- ========== Flowchart ==========
  CALL ins_soal('Simbol belah ketupat (diamond) pada flowchart digunakan untuk...',
    'mudah', 'Simbol diamond/belah ketupat melambangkan kondisi atau keputusan (decision) dalam flowchart.',
    'Menampilkan output ke layar',
    'Menyatakan awal atau akhir program',
    'Menyatakan proses atau operasi',
    'Menyatakan kondisi/keputusan (decision)',
    'D', s);
  CALL link('Flowchart', s, 1);

  CALL ins_soal('Simbol oval/elips pada flowchart standar melambangkan...',
    'mudah', 'Simbol oval/elips melambangkan terminator, yaitu awal (Start) atau akhir (End) program.',
    'Proses perhitungan',
    'Awal atau akhir program (terminator)',
    'Keputusan percabangan',
    'Input/Output data',
    'B', s);
  CALL link('Flowchart', s, 2);

  CALL ins_soal('Pada flowchart, simbol parallelogram (jajaran genjang) digunakan untuk...',
    'mudah', 'Parallelogram melambangkan operasi input atau output (membaca data / menampilkan data).',
    'Percabangan logika',
    'Memanggil subroutine',
    'Operasi input atau output',
    'Proses aritmatika',
    'C', s);
  CALL link('Flowchart', s, 3);

  CALL ins_soal('Flowchart program kalkulator sederhana yang menghitung A+B membutuhkan minimal berapa simbol (tidak termasuk panah alur)?',
    'sedang', 'Minimal: Start (oval) → Input A,B (parallelogram) → Hitung A+B (rectangle) → Output hasil (parallelogram) → End (oval) = 5 simbol.',
    '3 simbol',
    '4 simbol',
    '5 simbol',
    '7 simbol',
    'C', s);
  CALL link('Flowchart', s, 4);

  CALL ins_soal('Perbedaan utama antara struktur "selection" dan "iteration" pada flowchart adalah...',
    'sedang', 'Selection (percabangan) memilih salah satu jalur berdasarkan kondisi. Iteration (looping) mengulang blok proses selama kondisi terpenuhi.',
    'Selection menggunakan simbol rectangle, iteration menggunakan diamond',
    'Selection memilih satu jalur dari kondisi; iteration mengulang proses selama kondisi terpenuhi',
    'Keduanya sama, hanya berbeda nama',
    'Iteration tidak memiliki simbol decision',
    'B', s);
  CALL link('Flowchart', s, 5);

  -- ========== Pseudocode ==========
  CALL ins_soal('Notasi pseudocode yang paling tepat untuk mencetak bilangan 1 sampai 5 adalah...',
    'mudah', 'FOR loop dari 1 sampai 5 dengan increment 1 adalah cara paling tepat untuk mencetak bilangan berurutan.',
    'WHILE i > 5 DO PRINT i',
    'FOR i FROM 1 TO 5 DO PRINT i',
    'REPEAT PRINT i UNTIL i = 5',
    'IF i = 5 THEN PRINT i',
    'B', s);
  CALL link('Pseudocode', s, 1);

  CALL ins_soal('Pseudocode berikut menghasilkan output apa? SET x = 10; IF x > 5 THEN PRINT "besar" ELSE PRINT "kecil"',
    'mudah', 'Karena x=10 dan 10 > 5 bernilai true, maka output adalah "besar".',
    'kecil',
    'besar',
    'Error',
    'Tidak ada output',
    'B', s);
  CALL link('Pseudocode', s, 2);

  CALL ins_soal('Manakah pseudocode yang benar untuk mencari nilai maksimum dari dua bilangan A dan B?',
    'sedang', 'Logika yang benar adalah: jika A lebih besar dari B, maka maks=A, selain itu maks=B.',
    'IF A < B THEN maks = A ELSE maks = B',
    'IF A > B THEN maks = A ELSE maks = B',
    'IF A = B THEN maks = A ELSE maks = 0',
    'maks = A + B',
    'B', s);
  CALL link('Pseudocode', s, 3);

  CALL ins_soal('Dalam pseudocode terstruktur, kata kunci END IF atau ENDIF digunakan untuk...',
    'mudah', 'END IF menandai penutup blok percabangan IF...THEN...ELSE dalam pseudocode terstruktur.',
    'Mengakhiri seluruh program',
    'Menutup blok perulangan',
    'Menutup blok percabangan IF',
    'Mendeklarasikan akhir fungsi',
    'C', s);
  CALL link('Pseudocode', s, 4);

  CALL ins_soal('Pseudocode berikut: "SET total = 0; FOR i FROM 1 TO 100 DO SET total = total + i; PRINT total" menghitung apa?',
    'sedang', 'Program ini menjumlahkan angka 1 hingga 100, hasilnya adalah 5050.',
    'Rata-rata angka 1 sampai 100',
    'Jumlah semua angka dari 1 sampai 100',
    'Nilai terbesar dari 1 sampai 100',
    'Jumlah angka genap dari 1 sampai 100',
    'B', s);
  CALL link('Pseudocode', s, 5);

  -- ========== Dasar Bahasa Pemrograman ==========
  CALL ins_soal('Tipe data yang tepat untuk menyimpan nilai rata-rata ujian (misalnya 87.5) adalah...',
    'mudah', 'Nilai desimal seperti 87.5 membutuhkan tipe data float atau double, bukan integer.',
    'integer (int)',
    'boolean',
    'float / double',
    'string',
    'C', s);
  CALL link('Dasar Bahasa Pemrograman', s, 1);

  CALL ins_soal('Operator mana yang digunakan untuk mengecek apakah dua nilai TIDAK SAMA?',
    'mudah', 'Operator != atau <> digunakan untuk memeriksa ketidaksamaan.',
    '== (sama dengan)',
    '!= atau <> (tidak sama dengan)',
    '>= (lebih besar atau sama)',
    '&& (dan logika)',
    'B', s);
  CALL link('Dasar Bahasa Pemrograman', s, 2);

  CALL ins_soal('Apa hasil dari ekspresi: 17 % 5 dalam bahasa pemrograman?',
    'sedang', '17 dibagi 5 = 3 sisa 2. Operator % adalah modulo yang menghasilkan sisa pembagian.',
    '3',
    '2',
    '3.4',
    '12',
    'B', s);
  CALL link('Dasar Bahasa Pemrograman', s, 3);

  CALL ins_soal('Variabel yang dideklarasikan di dalam sebuah fungsi bersifat...',
    'sedang', 'Variabel di dalam fungsi adalah variabel lokal — hanya dapat diakses di dalam fungsi tersebut.',
    'Global — dapat diakses dari seluruh program',
    'Lokal — hanya dapat diakses di dalam fungsi itu',
    'Statis — nilainya tidak berubah',
    'Konstan — tidak dapat diubah nilainya',
    'B', s);
  CALL link('Dasar Bahasa Pemrograman', s, 4);

  CALL ins_soal('Program konversi suhu: Celsius ke Fahrenheit menggunakan rumus F = (C × 9/5) + 32. Jika C = 100, maka F adalah...',
    'sedang', '(100 × 9/5) + 32 = 180 + 32 = 212°F.',
    '100',
    '180',
    '212',
    '373',
    'C', s);
  CALL link('Dasar Bahasa Pemrograman', s, 5);

  -- ========== Struktur Kontrol ==========
  CALL ins_soal('Pernyataan SWITCH/CASE paling tepat digunakan ketika...',
    'mudah', 'SWITCH/CASE efisien untuk memilih di antara banyak nilai diskret dari satu variabel.',
    'Kondisi menggunakan operator > atau <',
    'Memeriksa satu variabel terhadap banyak nilai diskret',
    'Melakukan perulangan berdasarkan kondisi',
    'Menggabungkan beberapa kondisi boolean',
    'B', s);
  CALL link('Struktur Kontrol', s, 1);

  CALL ins_soal('Perulangan FOR paling tepat digunakan ketika...',
    'mudah', 'FOR loop digunakan ketika jumlah iterasi sudah diketahui sejak awal.',
    'Jumlah perulangan tidak diketahui dan bergantung pada input user',
    'Jumlah perulangan sudah diketahui dari awal',
    'Perulangan harus berjalan minimal satu kali',
    'Kondisi diperiksa di akhir perulangan',
    'B', s);
  CALL link('Struktur Kontrol', s, 2);

  CALL ins_soal('Perbedaan utama antara while loop dan do-while loop adalah...',
    'sedang', 'do-while memeriksa kondisi SETELAH eksekusi, sehingga body loop pasti dijalankan minimal sekali.',
    'while loop lebih cepat dari do-while',
    'do-while memeriksa kondisi setelah eksekusi, sehingga body pasti berjalan minimal sekali',
    'while loop tidak bisa menggunakan variabel counter',
    'do-while hanya bisa digunakan untuk menu program',
    'B', s);
  CALL link('Struktur Kontrol', s, 3);

  CALL ins_soal('Nilai rata-rata dari [90, 80, 70, 60] adalah 75. Kategori nilai apa yang tepat jika A=90-100, B=80-89, C=70-79, D=60-69?',
    'sedang', '75 berada di rentang 70-79, sehingga kategorinya adalah C.',
    'A',
    'B',
    'C',
    'D',
    'C', s);
  CALL link('Struktur Kontrol', s, 4);

  CALL ins_soal('Apa yang terjadi jika kondisi pada while loop tidak pernah menjadi false?',
    'mudah', 'Jika kondisi selalu true, loop akan berjalan tanpa henti — disebut infinite loop.',
    'Loop berhenti setelah 1000 iterasi otomatis',
    'Program langsung ke baris berikutnya',
    'Terjadi infinite loop (perulangan tak terbatas)',
    'Program menghasilkan error syntax',
    'C', s);
  CALL link('Struktur Kontrol', s, 5);

  -- ========== Array & Struktur Data Dasar ==========
  CALL ins_soal('Array nilai[5] = {80, 90, 75, 85, 95}. Nilai nilai[2] adalah...',
    'mudah', 'Indeks array dimulai dari 0. Indeks ke-2 (ketiga) adalah 75.',
    '90',
    '80',
    '75',
    '85',
    'C', s);
  CALL link('Array & Struktur Data Dasar', s, 1);

  CALL ins_soal('Untuk menyimpan data nilai 30 siswa dalam satu variabel, struktur yang paling tepat adalah...',
    'mudah', 'Array memungkinkan penyimpanan banyak nilai dengan tipe sama dalam satu variabel.',
    '30 variabel terpisah',
    'Satu string panjang',
    'Array satu dimensi berukuran 30',
    'Boolean',
    'C', s);
  CALL link('Array & Struktur Data Dasar', s, 2);

  CALL ins_soal('Array dua dimensi matrix[3][3] memiliki berapa total elemen?',
    'sedang', '3 baris × 3 kolom = 9 elemen total.',
    '3',
    '6',
    '9',
    '12',
    'C', s);
  CALL link('Array & Struktur Data Dasar', s, 3);

  CALL ins_soal('Algoritma untuk mencari nilai tertinggi dari array nilai[n] yang paling efisien adalah...',
    'sedang', 'Linear search dengan satu pass O(n) adalah cara paling efisien untuk menemukan nilai maksimum dalam array tidak terurut.',
    'Urutkan dulu lalu ambil elemen terakhir — O(n log n)',
    'Bandingkan setiap elemen satu per satu dengan variabel maks — O(n)',
    'Gunakan dua loop bersarang — O(n²)',
    'Ambil elemen tengah array',
    'B', s);
  CALL link('Array & Struktur Data Dasar', s, 4);

  CALL ins_soal('Apa output dari: int a[] = {1,2,3,4,5}; for(i=0; i<5; i++) sum += a[i];',
    'mudah', '1+2+3+4+5 = 15.',
    '12',
    '15',
    '14',
    '10',
    'B', s);
  CALL link('Array & Struktur Data Dasar', s, 5);

  -- ========== Fungsi & Prosedur ==========
  CALL ins_soal('Apa perbedaan utama antara fungsi dan prosedur?',
    'sedang', 'Fungsi mengembalikan nilai (return value), sedangkan prosedur tidak mengembalikan nilai.',
    'Fungsi tidak bisa dipanggil berkali-kali, prosedur bisa',
    'Fungsi mengembalikan nilai, prosedur tidak mengembalikan nilai',
    'Prosedur lebih cepat dari fungsi',
    'Fungsi hanya bisa menerima satu parameter',
    'B', s);
  CALL link('Fungsi & Prosedur', s, 1);

  CALL ins_soal('Variabel yang dideklarasikan di luar semua fungsi disebut variabel...',
    'mudah', 'Variabel yang dideklarasikan di luar fungsi adalah variabel global, bisa diakses dari mana saja.',
    'Lokal',
    'Statis',
    'Global',
    'Dinamis',
    'C', s);
  CALL link('Fungsi & Prosedur', s, 2);

  CALL ins_soal('Fungsi rekursif adalah fungsi yang...',
    'sedang', 'Rekursi adalah ketika sebuah fungsi memanggil dirinya sendiri.',
    'Hanya bisa dipanggil sekali',
    'Tidak memiliki return value',
    'Memanggil dirinya sendiri',
    'Selalu menggunakan loop',
    'C', s);
  CALL link('Fungsi & Prosedur', s, 3);

  CALL ins_soal('Apa keuntungan utama menggunakan fungsi dalam pemrograman?',
    'mudah', 'Fungsi memungkinkan kode reuse — ditulis sekali, dipanggil berkali-kali di tempat berbeda.',
    'Program menjadi lebih lambat',
    'Kode lebih sulit dibaca',
    'Kode dapat digunakan ulang (reuse) dan program lebih terstruktur',
    'Variabel global tidak diperlukan',
    'C', s);
  CALL link('Fungsi & Prosedur', s, 4);

  CALL ins_soal('Parameter yang nilainya dikirim ke fungsi dan tidak mengubah variabel aslinya disebut...',
    'sedang', 'Pass by value menyalin nilai, sehingga perubahan di dalam fungsi tidak mempengaruhi variabel asli.',
    'Pass by reference',
    'Pass by value',
    'Pass by pointer',
    'Pass by address',
    'B', s);
  CALL link('Fungsi & Prosedur', s, 5);

  -- ========== Pengantar OOP ==========
  CALL ins_soal('Dalam konsep OOP, "objek" adalah...',
    'mudah', 'Objek adalah instance (wujud nyata) dari sebuah kelas.',
    'Template atau cetak biru untuk membuat sesuatu',
    'Instance nyata dari sebuah kelas',
    'Fungsi yang memanipulasi data',
    'Variabel dengan tipe data kompleks',
    'B', s);
  CALL link('Pengantar OOP', s, 1);

  CALL ins_soal('Dalam sistem perpustakaan, manakah yang paling tepat disebut sebagai "kelas"?',
    'mudah', 'Buku adalah kelas/blueprint. "Laskar Pelangi" adalah objek/instance dari kelas Buku.',
    '"Laskar Pelangi" (judul spesifik)',
    '"Ahmad Fulan" (anggota tertentu)',
    '"Buku" (kategori umum dengan atribut judul, penulis, ISBN)',
    '"Rak A1" (lokasi spesifik)',
    'C', s);
  CALL link('Pengantar OOP', s, 2);

  CALL ins_soal('Atribut dalam OOP setara dengan apa dalam pemrograman prosedural?',
    'mudah', 'Atribut kelas setara dengan variabel yang menyimpan data objek.',
    'Fungsi',
    'Variabel',
    'Tipe data',
    'Operator',
    'B', s);
  CALL link('Pengantar OOP', s, 3);

  CALL ins_soal('Konsep OOP yang memungkinkan sebuah kelas mewarisi sifat dari kelas lain disebut...',
    'sedang', 'Inheritance (pewarisan) memungkinkan kelas anak (child) mewarisi atribut dan method dari kelas induk (parent).',
    'Enkapsulasi',
    'Polimorfisme',
    'Inheritance (Pewarisan)',
    'Abstraksi',
    'C', s);
  CALL link('Pengantar OOP', s, 4);

  -- ========== Perakitan Komputer ==========
  CALL ins_soal('Komponen yang berfungsi sebagai "otak" komputer untuk melakukan pemrosesan instruksi adalah...',
    'mudah', 'CPU (Central Processing Unit) adalah komponen utama yang memproses semua instruksi program.',
    'RAM (Random Access Memory)',
    'HDD (Hard Disk Drive)',
    'CPU (Central Processing Unit)',
    'GPU (Graphics Processing Unit)',
    'C', s);
  CALL link('Perakitan Komputer', s, 1);

  CALL ins_soal('Urutan perakitan komputer yang benar dimulai dengan...',
    'sedang', 'Pemasanan prosesor ke motherboard adalah langkah pertama sebelum komponen lain dipasang.',
    'Memasang power supply ke casing',
    'Memasang RAM ke slot memori',
    'Memasang prosesor ke soket di motherboard',
    'Menghubungkan kabel data HDD',
    'C', s);
  CALL link('Perakitan Komputer', s, 2);

  CALL ins_soal('RAM yang lebih besar (misalnya 16GB vs 4GB) mempengaruhi performa komputer karena...',
    'mudah', 'RAM yang lebih besar memungkinkan lebih banyak program berjalan bersamaan tanpa melambat.',
    'Prosesor bekerja lebih cepat secara otomatis',
    'Lebih banyak data dapat diakses secara cepat secara bersamaan',
    'Hard disk membaca data lebih cepat',
    'Koneksi internet menjadi lebih stabil',
    'B', s);
  CALL link('Perakitan Komputer', s, 3);

  -- ========== Sistem Operasi ==========
  CALL ins_soal('Perintah command line yang digunakan untuk berpindah direktori di Linux/Mac adalah...',
    'mudah', 'Perintah cd (change directory) digunakan untuk berpindah antar direktori di terminal.',
    'mv',
    'ls',
    'cd',
    'cp',
    'C', s);
  CALL link('Sistem Operasi', s, 1);

  CALL ins_soal('Perintah "ls -la" di terminal Linux/Mac berfungsi untuk...',
    'sedang', 'ls -la menampilkan semua file (termasuk tersembunyi) dengan detail lengkap (permission, ukuran, tanggal).',
    'Menghapus semua file di direktori saat ini',
    'Membuat direktori baru',
    'Menampilkan semua file termasuk tersembunyi dengan detail lengkap',
    'Memindahkan file ke direktori lain',
    'C', s);
  CALL link('Sistem Operasi', s, 2);

  CALL ins_soal('Apa fungsi utama sistem operasi dalam komputer?',
    'mudah', 'Sistem operasi bertugas sebagai perantara antara pengguna/aplikasi dan hardware komputer.',
    'Membuat dokumen teks',
    'Mengakses internet',
    'Mengelola hardware dan menyediakan layanan untuk aplikasi',
    'Menyimpan data ke cloud',
    'C', s);
  CALL link('Sistem Operasi', s, 3);

  -- ========== Jaringan Komputer Dasar ==========
  CALL ins_soal('Jenis jaringan yang mencakup area satu gedung atau kampus disebut...',
    'mudah', 'LAN (Local Area Network) adalah jaringan yang mencakup area terbatas seperti satu gedung.',
    'WAN (Wide Area Network)',
    'MAN (Metropolitan Area Network)',
    'LAN (Local Area Network)',
    'VPN (Virtual Private Network)',
    'C', s);
  CALL link('Jaringan Komputer Dasar', s, 1);

  CALL ins_soal('IP Address 192.168.1.1 termasuk dalam kelas...',
    'sedang', 'Range 192.168.x.x termasuk IP privat kelas C (192.0.0.0 - 223.255.255.255).',
    'Kelas A',
    'Kelas B',
    'Kelas C',
    'Kelas D',
    'C', s);
  CALL link('Jaringan Komputer Dasar', s, 2);

  CALL ins_soal('Perangkat yang menghubungkan beberapa komputer dalam satu jaringan LAN dan meneruskan paket data berdasarkan IP address tujuan adalah...',
    'sedang', 'Router bertugas meneruskan paket antar jaringan berdasarkan IP address, berbeda dengan switch yang bekerja di level MAC address.',
    'Hub',
    'Switch',
    'Router',
    'Repeater',
    'C', s);
  CALL link('Jaringan Komputer Dasar', s, 3);

  -- ========== K3LH & Etika Kerja ==========
  CALL ins_soal('HAKI dalam konteks digital mengacu pada...',
    'mudah', 'HAKI (Hak Atas Kekayaan Intelektual) melindungi karya cipta digital seperti software, desain, dan konten.',
    'Hak untuk mengakses internet gratis',
    'Hak perlindungan atas karya cipta, seperti software dan konten digital',
    'Hak privasi data pribadi',
    'Hak penggunaan komputer di laboratorium',
    'B', s);
  CALL link('K3LH & Etika Kerja', s, 1);

  CALL ins_soal('Yang termasuk etika digital dalam penggunaan media sosial adalah...',
    'mudah', 'Etika digital mencakup perilaku bertanggung jawab di dunia maya, termasuk tidak menyebarkan hoaks.',
    'Menyebarkan informasi yang belum terverifikasi agar viral',
    'Menggunakan identitas palsu untuk kebebasan berpendapat',
    'Menghormati privasi orang lain dan tidak menyebarkan konten hoaks',
    'Men-download software berbayar secara ilegal karena tidak mampu beli',
    'C', s);
  CALL link('K3LH & Etika Kerja', s, 2);

  -- ========== HTML5 ==========
  CALL ins_soal('Tag HTML5 yang digunakan untuk mendefinisikan bagian navigasi website adalah...',
    'mudah', '<nav> adalah elemen semantik HTML5 khusus untuk menandai bagian navigasi.',
    '<menu>',
    '<header>',
    '<nav>',
    '<section>',
    'C', s);
  CALL link('HTML5', s, 1);

  CALL ins_soal('Atribut "required" pada elemen <input> di HTML5 berfungsi untuk...',
    'mudah', 'Atribut required memastikan field form harus diisi sebelum form bisa di-submit.',
    'Membuat field hanya bisa dibaca',
    'Mengatur placeholder teks',
    'Mewajibkan field diisi sebelum form dapat di-submit',
    'Mengubah tampilan field',
    'C', s);
  CALL link('HTML5', s, 2);

  CALL ins_soal('Perbedaan antara <div> dan <section> di HTML5 adalah...',
    'sedang', '<section> adalah elemen semantik yang menandai bagian konten bertema, sedangkan <div> adalah container generik tanpa makna semantik.',
    '<div> lebih baru dari <section>',
    '<section> adalah elemen semantik dengan makna, <div> adalah container generik',
    '<div> hanya bisa digunakan untuk layout kolom',
    'Keduanya identik, hanya berbeda nama',
    'B', s);
  CALL link('HTML5', s, 3);

  CALL ins_soal('Tag yang benar untuk membuat hyperlink ke halaman lain adalah...',
    'mudah', 'Tag <a href="..."> digunakan untuk membuat hyperlink.',
    '<link href="halaman.html">',
    '<url>halaman.html</url>',
    '<a href="halaman.html">Klik</a>',
    '<hyperlink>halaman.html</hyperlink>',
    'C', s);
  CALL link('HTML5', s, 4);

  CALL ins_soal('Elemen HTML5 yang paling tepat untuk menampilkan artikel berita adalah...',
    'sedang', '<article> adalah elemen semantik untuk konten mandiri seperti artikel berita atau posting blog.',
    '<div class="artikel">',
    '<article>',
    '<content>',
    '<paragraph>',
    'B', s);
  CALL link('HTML5', s, 5);

  -- ========== CSS3 ==========
  CALL ins_soal('Property CSS yang digunakan untuk membuat layout dengan baris dan kolom secara dua dimensi adalah...',
    'sedang', 'CSS Grid adalah sistem layout dua dimensi (baris dan kolom), sedangkan Flexbox adalah satu dimensi.',
    'display: flex',
    'display: block',
    'display: grid',
    'display: inline',
    'C', s);
  CALL link('CSS3', s, 1);

  CALL ins_soal('Selector CSS yang tepat untuk menerapkan style HANYA pada <p> yang berada di dalam <div class="kontainer"> adalah...',
    'sedang', 'Descendant selector menggunakan spasi: ".kontainer p" memilih semua p di dalam .kontainer.',
    'p.kontainer { }',
    '.kontainer > p { } (hanya anak langsung)',
    '.kontainer p { }',
    'div + p { }',
    'C', s);
  CALL link('CSS3', s, 2);

  CALL ins_soal('Property Flexbox yang mengatur perataan item secara vertikal (cross axis) adalah...',
    'sedang', 'align-items mengontrol perataan item pada cross axis (vertikal jika flex-direction: row).',
    'justify-content',
    'flex-wrap',
    'align-items',
    'flex-direction',
    'C', s);
  CALL link('CSS3', s, 3);

  CALL ins_soal('Media query "@media (max-width: 768px)" berarti style diterapkan ketika...',
    'mudah', 'max-width: 768px berarti style berlaku saat lebar layar maksimal 768px (tablet/mobile).',
    'Layar minimal 768px (desktop)',
    'Layar persis 768px',
    'Layar maksimal 768px (tablet dan mobile)',
    'Semua ukuran layar',
    'C', s);
  CALL link('CSS3', s, 4);

  CALL ins_soal('Box model CSS terdiri dari (dari dalam ke luar):',
    'mudah', 'Urutan box model dari dalam ke luar: content → padding → border → margin.',
    'margin → border → padding → content',
    'content → padding → border → margin',
    'padding → content → margin → border',
    'border → content → padding → margin',
    'B', s);
  CALL link('CSS3', s, 5);

  -- ========== JavaScript Dasar ==========
  CALL ins_soal('Cara yang benar untuk mengakses elemen HTML dengan id="judul" menggunakan JavaScript adalah...',
    'mudah', 'document.getElementById() adalah metode standar untuk mengakses elemen berdasarkan ID.',
    'document.getElement("judul")',
    'document.getElementById("judul")',
    'document.querySelector("#judul") — ini juga benar tapi bukan getElementById',
    'window.find("judul")',
    'B', s);
  CALL link('JavaScript Dasar', s, 1);

  CALL ins_soal('Event listener yang merespons saat pengguna mengklik sebuah tombol adalah...',
    'mudah', '"click" adalah event untuk klik mouse pada elemen.',
    '"hover"',
    '"focus"',
    '"click"',
    '"load"',
    'C', s);
  CALL link('JavaScript Dasar', s, 2);

  CALL ins_soal('Validasi form menggunakan JavaScript dilakukan di sisi...',
    'mudah', 'JavaScript berjalan di browser (client-side), sehingga validasinya terjadi di sisi klien.',
    'Server (server-side)',
    'Database',
    'Client / browser (client-side)',
    'CDN',
    'C', s);
  CALL link('JavaScript Dasar', s, 3);

  CALL ins_soal('Apa output dari: console.log(typeof "hello");',
    'mudah', '"hello" adalah string, sehingga typeof mengembalikan "string".',
    '"hello"',
    '"text"',
    '"string"',
    '"char"',
    'C', s);
  CALL link('JavaScript Dasar', s, 4);

  CALL ins_soal('Fungsi document.querySelector(".btn") akan memilih...',
    'sedang', 'querySelector dengan ".btn" memilih elemen PERTAMA yang memiliki class "btn".',
    'Semua elemen dengan id "btn"',
    'Elemen pertama dengan class "btn"',
    'Semua elemen dengan class "btn"',
    'Elemen dengan tag <btn>',
    'B', s);
  CALL link('JavaScript Dasar', s, 5);

  -- ========== Version Control Git ==========
  CALL ins_soal('Perintah Git untuk menyimpan perubahan ke repository lokal adalah...',
    'mudah', 'git commit menyimpan perubahan yang sudah di-stage ke repository lokal dengan pesan commit.',
    'git push',
    'git add',
    'git commit',
    'git save',
    'C', s);
  CALL link('Version Control (Git & GitHub)', s, 1);

  CALL ins_soal('Urutan perintah Git yang benar untuk mengunggah file baru ke GitHub adalah...',
    'sedang', 'Urutan yang benar: git add (staging) → git commit (simpan lokal) → git push (upload ke remote).',
    'git push → git commit → git add',
    'git commit → git add → git push',
    'git add → git commit → git push',
    'git push → git add → git commit',
    'C', s);
  CALL link('Version Control (Git & GitHub)', s, 2);

  CALL ins_soal('Perintah "git clone <url>" berfungsi untuk...',
    'mudah', 'git clone menyalin seluruh repository dari remote (GitHub) ke komputer lokal.',
    'Membuat branch baru',
    'Menyalin repository dari remote ke lokal',
    'Menggabungkan dua branch',
    'Menghapus repository',
    'B', s);
  CALL link('Version Control (Git & GitHub)', s, 3);

  CALL ins_soal('Apa fungsi dari file .gitignore?',
    'sedang', '.gitignore memberi tahu Git file/folder mana yang tidak perlu dilacak (seperti node_modules, .env).',
    'Menyimpan konfigurasi repository GitHub',
    'Mendaftarkan file/folder yang tidak ingin dilacak oleh Git',
    'Mengamankan repository dari akses publik',
    'Menyimpan riwayat commit',
    'B', s);
  CALL link('Version Control (Git & GitHub)', s, 4);

  CALL ins_soal('Perintah Git untuk melihat status file yang sudah/belum di-stage adalah...',
    'mudah', 'git status menampilkan kondisi working directory dan staging area saat ini.',
    'git log',
    'git diff',
    'git status',
    'git show',
    'C', s);
  CALL link('Version Control (Git & GitHub)', s, 5);

  -- ========== Konsep Basis Data ==========
  CALL ins_soal('RDBMS adalah singkatan dari...',
    'mudah', 'RDBMS = Relational Database Management System, sistem manajemen basis data berbasis relasi/tabel.',
    'Rapid Database Management System',
    'Relational Database Management System',
    'Remote Database Management System',
    'Reliable Database Management System',
    'B', s);
  CALL link('Konsep Basis Data', s, 1);

  CALL ins_soal('Primary key dalam basis data relasional berfungsi sebagai...',
    'mudah', 'Primary key mengidentifikasi setiap baris secara unik dalam tabel.',
    'Kolom yang boleh berisi nilai NULL',
    'Penghubung antar dua tabel',
    'Pengidentifikasi unik setiap baris dalam tabel',
    'Indeks untuk mempercepat query',
    'C', s);
  CALL link('Konsep Basis Data', s, 2);

  CALL ins_soal('MySQL adalah contoh dari...',
    'mudah', 'MySQL adalah RDBMS open-source yang sangat populer untuk pengembangan web.',
    'Bahasa pemrograman',
    'Framework web',
    'RDBMS (Relational Database Management System)',
    'Sistem operasi server',
    'C', s);
  CALL link('Konsep Basis Data', s, 3);

  CALL ins_soal('phpMyAdmin adalah...',
    'mudah', 'phpMyAdmin adalah antarmuka berbasis web untuk mengelola basis data MySQL secara visual.',
    'Bahasa query untuk MySQL',
    'RDBMS alternatif dari MySQL',
    'Antarmuka web untuk mengelola database MySQL',
    'Plugin PHP untuk koneksi database',
    'C', s);
  CALL link('Konsep Basis Data', s, 4);

  CALL ins_soal('Tabel dalam basis data relasional terdiri dari...',
    'mudah', 'Tabel terdiri dari baris (record/row) dan kolom (field/attribute).',
    'File dan folder',
    'Objek dan method',
    'Baris (record) dan kolom (field/atribut)',
    'Node dan edge',
    'C', s);
  CALL link('Konsep Basis Data', s, 5);

  -- ========== Perancangan ERD ==========
  CALL ins_soal('Dalam ERD, simbol yang digunakan untuk menggambarkan entitas adalah...',
    'mudah', 'Entitas digambarkan dengan persegi panjang (rectangle) dalam notasi ERD standar.',
    'Oval/elips',
    'Belah ketupat (diamond)',
    'Persegi panjang (rectangle)',
    'Garis lurus',
    'C', s);
  CALL link('Perancangan ERD', s, 1);

  CALL ins_soal('Kardinalitas "one-to-many" antara tabel Guru dan Kelas berarti...',
    'sedang', 'Satu guru dapat mengajar banyak kelas, tetapi satu kelas hanya diasuh satu guru (wali kelas).',
    'Satu guru hanya bisa mengajar satu kelas',
    'Satu guru bisa mengajar banyak kelas, satu kelas hanya punya satu wali guru',
    'Banyak guru mengajar satu kelas',
    'Banyak guru mengajar banyak kelas',
    'B', s);
  CALL link('Perancangan ERD', s, 2);

  CALL ins_soal('Foreign key dalam ERD berfungsi untuk...',
    'sedang', 'Foreign key adalah kolom yang mereferensikan primary key tabel lain untuk membuat relasi.',
    'Mengidentifikasi baris secara unik dalam tabel',
    'Mempercepat pencarian data',
    'Menghubungkan dua tabel dengan mereferensikan primary key tabel lain',
    'Menyimpan data dalam format terenkripsi',
    'C', s);
  CALL link('Perancangan ERD', s, 3);

  CALL ins_soal('Dalam ERD perpustakaan: seorang anggota bisa meminjam banyak buku, dan satu buku bisa dipinjam banyak anggota (berbeda waktu). Relasi ini adalah...',
    'sedang', 'Relasi many-to-many membutuhkan tabel perantara (junction table) seperti tabel Peminjaman.',
    'One-to-one',
    'One-to-many',
    'Many-to-one',
    'Many-to-many',
    'D', s);
  CALL link('Perancangan ERD', s, 4);

  CALL ins_soal('Atribut yang memiliki banyak nilai untuk satu entitas (misalnya nomor telepon seseorang) disebut...',
    'sulit', 'Multi-valued attribute adalah atribut yang dapat memiliki lebih dari satu nilai untuk satu entitas.',
    'Atribut kunci',
    'Atribut derivatif',
    'Atribut komposit',
    'Atribut multi-nilai',
    'D', s);
  CALL link('Perancangan ERD', s, 5);

  -- ========== Normalisasi ==========
  CALL ins_soal('Normalisasi 1NF (First Normal Form) mensyaratkan bahwa...',
    'sedang', '1NF mensyaratkan setiap sel tabel hanya berisi satu nilai atomik (tidak ada grup berulang).',
    'Tidak ada dependensi transitif',
    'Tidak ada dependensi parsial',
    'Setiap kolom berisi nilai atomik dan tidak ada grup berulang',
    'Semua tabel memiliki primary key komposit',
    'C', s);
  CALL link('Normalisasi', s, 1);

  CALL ins_soal('Tabel dinyatakan melanggar 2NF jika...',
    'sedang', '2NF dilanggar jika ada atribut non-kunci yang bergantung hanya pada sebagian primary key (partial dependency) — hanya relevan untuk primary key komposit.',
    'Ada atribut yang bergantung pada atribut non-kunci lain',
    'Ada atribut non-kunci yang bergantung hanya pada sebagian primary key komposit',
    'Ada nilai NULL dalam primary key',
    'Ada dua tabel dengan nama kolom sama',
    'B', s);
  CALL link('Normalisasi', s, 2);

  CALL ins_soal('Dependensi transitif yang harus dihilangkan pada 3NF adalah ketika...',
    'sulit', 'Dependensi transitif: A→B→C, di mana C bergantung pada B (non-key), dan B bergantung pada A (key). Harus dipecah.',
    'Atribut kunci bergantung pada atribut lain',
    'Atribut non-kunci bergantung pada atribut non-kunci lain (bukan langsung ke primary key)',
    'Dua tabel memiliki primary key yang sama',
    'Atribut memiliki lebih dari satu nilai',
    'B', s);
  CALL link('Normalisasi', s, 3);

  -- ========== DDL & DML Dasar ==========
  CALL ins_soal('Perintah SQL untuk membuat tabel baru adalah...',
    'mudah', 'CREATE TABLE adalah perintah DDL untuk membuat tabel baru di database.',
    'INSERT TABLE',
    'MAKE TABLE',
    'CREATE TABLE',
    'NEW TABLE',
    'C', s);
  CALL link('DDL & DML Dasar', s, 1);

  CALL ins_soal('Perintah SQL untuk mengubah data yang sudah ada dalam tabel adalah...',
    'mudah', 'UPDATE digunakan untuk mengubah nilai kolom pada baris yang sudah ada.',
    'INSERT',
    'MODIFY',
    'CHANGE',
    'UPDATE',
    'D', s);
  CALL link('DDL & DML Dasar', s, 2);

  CALL ins_soal('Klausa WHERE dalam perintah DELETE berfungsi untuk...',
    'mudah', 'WHERE membatasi baris mana yang akan dihapus. Tanpa WHERE, semua baris akan terhapus.',
    'Mengurutkan data sebelum dihapus',
    'Membatasi baris mana yang akan dihapus',
    'Menampilkan data yang dihapus',
    'Membuat cadangan data sebelum dihapus',
    'B', s);
  CALL link('DDL & DML Dasar', s, 3);

  CALL ins_soal('Perintah ALTER TABLE digunakan untuk...',
    'sedang', 'ALTER TABLE memodifikasi struktur tabel yang sudah ada (tambah/hapus kolom, ubah tipe data).',
    'Menghapus seluruh tabel beserta datanya',
    'Menambahkan data baru ke tabel',
    'Memodifikasi struktur tabel yang sudah ada',
    'Membuat salinan tabel',
    'C', s);
  CALL link('DDL & DML Dasar', s, 4);

  CALL ins_soal('Perbedaan DROP TABLE dan TRUNCATE TABLE adalah...',
    'sedang', 'DROP menghapus tabel beserta strukturnya. TRUNCATE hanya menghapus semua data tetapi mempertahankan struktur tabel.',
    'Keduanya sama-sama menghapus data saja',
    'DROP menghapus tabel dan strukturnya; TRUNCATE menghapus data saja tapi mempertahankan struktur',
    'TRUNCATE lebih lambat dari DROP',
    'DROP hanya bisa dilakukan oleh admin database',
    'B', s);
  CALL link('DDL & DML Dasar', s, 5);

  -- ========== Query Lanjutan ==========
  CALL ins_soal('JOIN yang menampilkan semua data dari tabel kiri meskipun tidak ada pasangan di tabel kanan adalah...',
    'sedang', 'LEFT JOIN (LEFT OUTER JOIN) mempertahankan semua baris tabel kiri, mengisi NULL untuk kolom tabel kanan yang tidak cocok.',
    'INNER JOIN',
    'RIGHT JOIN',
    'LEFT JOIN',
    'FULL JOIN',
    'C', s);
  CALL link('Query Lanjutan', s, 1);

  CALL ins_soal('Fungsi agregat COUNT(*) menghitung...',
    'mudah', 'COUNT(*) menghitung jumlah total baris dalam hasil query, termasuk yang memiliki nilai NULL.',
    'Jumlah kolom dalam tabel',
    'Total baris yang memenuhi kondisi (termasuk NULL)',
    'Nilai rata-rata kolom',
    'Nilai terbesar dalam kolom',
    'B', s);
  CALL link('Query Lanjutan', s, 2);

  CALL ins_soal('Klausa GROUP BY digunakan bersama fungsi agregat untuk...',
    'sedang', 'GROUP BY mengelompokkan baris dengan nilai sama pada kolom tertentu sebelum fungsi agregat diterapkan.',
    'Mengurutkan hasil query',
    'Memfilter baris sebelum grouping',
    'Mengelompokkan baris berdasarkan nilai kolom tertentu',
    'Menggabungkan dua tabel',
    'C', s);
  CALL link('Query Lanjutan', s, 3);

  CALL ins_soal('Perbedaan HAVING dan WHERE dalam SQL adalah...',
    'sedang', 'WHERE memfilter baris SEBELUM grouping. HAVING memfilter SESUDAH grouping (bekerja pada hasil GROUP BY).',
    'HAVING lebih cepat dari WHERE',
    'WHERE memfilter baris sebelum grouping; HAVING memfilter setelah grouping',
    'Keduanya identik, hanya berbeda nama',
    'HAVING hanya bisa digunakan dengan INNER JOIN',
    'B', s);
  CALL link('Query Lanjutan', s, 4);

  CALL ins_soal('Subquery adalah...',
    'sedang', 'Subquery adalah query SQL yang ditempatkan di dalam query lain (nested query).',
    'Query yang dijalankan di server terpisah',
    'Query yang hanya mengambil satu kolom',
    'Query SQL yang ditempatkan di dalam query lain',
    'Query tanpa klausa WHERE',
    'C', s);
  CALL link('Query Lanjutan', s, 5);

  -- ========== Integrasi PHP-MySQL ==========
  CALL ins_soal('PDO dalam PHP singkatan dari...',
    'mudah', 'PDO = PHP Data Objects, antarmuka akses database yang mendukung banyak DBMS.',
    'PHP Database Operations',
    'PHP Data Objects',
    'PHP Direct Output',
    'PHP Development Objects',
    'B', s);
  CALL link('Integrasi PHP–MySQL', s, 1);

  CALL ins_soal('Prepared statement digunakan untuk...',
    'sedang', 'Prepared statement memisahkan query dari data, mencegah SQL injection secara efektif.',
    'Mempercepat tampilan halaman web',
    'Mencegah SQL Injection dengan memisahkan query dari data',
    'Menyimpan hasil query ke cache',
    'Mengenkripsi data di database',
    'B', s);
  CALL link('Integrasi PHP–MySQL', s, 2);

  CALL ins_soal('Perintah PHP/PDO yang benar untuk mengeksekusi prepared statement dengan parameter adalah...',
    'sedang', 'execute() dengan array parameter digunakan untuk menjalankan prepared statement.',
    '$stmt->query($data)',
    '$stmt->run([$data])',
    '$stmt->execute([$data])',
    '$stmt->send($data)',
    'C', s);
  CALL link('Integrasi PHP–MySQL', s, 3);

  -- ========== Keamanan Data Dasar ==========
  CALL ins_soal('SQL Injection terjadi ketika...',
    'sedang', 'SQL Injection terjadi ketika input user disisipkan langsung ke query SQL tanpa sanitasi, memungkinkan eksekusi query berbahaya.',
    'Database kehabisan memori',
    'Input pengguna disisipkan langsung ke query SQL tanpa validasi/sanitasi',
    'Koneksi database terputus',
    'Server berjalan terlalu lama',
    'B', s);
  CALL link('Keamanan Data Dasar', s, 1);

  CALL ins_soal('Fungsi PHP yang benar untuk meng-hash password sebelum disimpan ke database adalah...',
    'sedang', 'password_hash() dengan PASSWORD_BCRYPT atau PASSWORD_DEFAULT adalah cara aman dan resmi di PHP modern.',
    'md5($password)',
    'sha1($password)',
    'password_hash($password, PASSWORD_DEFAULT)',
    'encrypt($password)',
    'C', s);
  CALL link('Keamanan Data Dasar', s, 2);

  CALL ins_soal('Mengapa MD5 tidak direkomendasikan untuk hashing password saat ini?',
    'sulit', 'MD5 adalah hashing cepat dan sudah ditemukan banyak collision. Mudah di-brute force dengan rainbow table.',
    'MD5 terlalu lambat untuk digunakan di server',
    'MD5 menghasilkan hash yang terlalu panjang',
    'MD5 rentan terhadap rainbow table attack dan sudah banyak ditemukan collision-nya',
    'MD5 tidak kompatibel dengan PHP modern',
    'C', s);
  CALL link('Keamanan Data Dasar', s, 3);

  -- ========== Migration & Seeder Laravel ==========
  CALL ins_soal('Perintah Artisan untuk membuat file migration baru di Laravel adalah...',
    'mudah', 'php artisan make:migration membuat file migration baru di folder database/migrations.',
    'php artisan migrate',
    'php artisan make:migration',
    'php artisan db:migrate',
    'php artisan create:migration',
    'B', s);
  CALL link('Migration & Seeder Laravel', s, 1);

  CALL ins_soal('Perintah "php artisan migrate:fresh --seed" berfungsi untuk...',
    'sedang', 'migrate:fresh menghapus semua tabel dan menjalankan ulang migration, --seed menjalankan seeder setelahnya.',
    'Menjalankan hanya seeder tanpa migration',
    'Membuat backup database sebelum migration',
    'Menghapus semua tabel, menjalankan ulang migration, lalu menjalankan seeder',
    'Mengembalikan migration ke versi sebelumnya',
    'C', s);
  CALL link('Migration & Seeder Laravel', s, 2);

  CALL ins_soal('Factory di Laravel digunakan untuk...',
    'sedang', 'Factory membuat data dummy (fake) untuk testing atau seeding menggunakan Faker library.',
    'Membuat controller baru secara otomatis',
    'Menghasilkan data dummy untuk testing/seeding',
    'Membuat koneksi ke database eksternal',
    'Mengelola dependency injection',
    'B', s);
  CALL link('Migration & Seeder Laravel', s, 3);

  -- ========== Eloquent ORM ==========
  CALL ins_soal('Eloquent ORM di Laravel memungkinkan developer untuk...',
    'mudah', 'Eloquent ORM memetakan tabel database ke kelas PHP (Model), sehingga bisa berinteraksi dengan database menggunakan sintaks PHP.',
    'Membuat tampilan HTML secara otomatis',
    'Berinteraksi dengan database menggunakan sintaks PHP tanpa menulis SQL manual',
    'Mengirim email secara otomatis',
    'Mengoptimalkan performa frontend',
    'B', s);
  CALL link('Eloquent ORM', s, 1);

  CALL ins_soal('Relasi Eloquent hasMany digunakan ketika...',
    'sedang', 'hasMany memodelkan relasi one-to-many: satu model memiliki banyak instance model lain.',
    'Satu user memiliki satu profil',
    'Satu post dimiliki oleh satu user',
    'Satu user memiliki banyak post',
    'Banyak user memiliki banyak role',
    'C', s);
  CALL link('Eloquent ORM', s, 2);

  CALL ins_soal('Method Eloquent yang digunakan untuk mengambil semua record dari tabel adalah...',
    'mudah', 'Model::all() mengembalikan semua baris dari tabel sebagai Eloquent Collection.',
    'Model::get()',
    'Model::fetch()',
    'Model::all()',
    'Model::select()',
    'C', s);
  CALL link('Eloquent ORM', s, 3);

  CALL ins_soal('Eager loading di Eloquent menggunakan method...',
    'sedang', 'with() digunakan untuk eager loading — memuat relasi bersamaan dalam satu query untuk menghindari N+1 problem.',
    'load()',
    'join()',
    'with()',
    'include()',
    'C', s);
  CALL link('Eloquent ORM', s, 4);

  -- ========== Rekayasa Kebutuhan ==========
  CALL ins_soal('Kebutuhan fungsional sistem adalah...',
    'mudah', 'Kebutuhan fungsional mendeskripsikan apa yang HARUS BISA DILAKUKAN sistem (fitur dan fungsi).',
    'Batasan performa seperti waktu respons dan kapasitas',
    'Deskripsi apa yang harus dilakukan sistem (fitur dan fungsi)',
    'Kebutuhan perangkat keras minimum',
    'Standar keamanan yang harus dipenuhi',
    'B', s);
  CALL link('Rekayasa Kebutuhan', s, 1);

  CALL ins_soal('Contoh kebutuhan NON-fungsional sistem informasi sekolah adalah...',
    'sedang', 'Kebutuhan non-fungsional mengatur KUALITAS sistem, bukan fiturnya (performa, keamanan, ketersediaan).',
    'Sistem harus bisa menampilkan daftar siswa',
    'Sistem harus menyediakan fitur login',
    'Sistem harus merespons dalam waktu kurang dari 2 detik',
    'Sistem harus bisa mencetak laporan nilai',
    'C', s);
  CALL link('Rekayasa Kebutuhan', s, 2);

  CALL ins_soal('Teknik penggalian kebutuhan yang paling umum digunakan adalah...',
    'mudah', 'Wawancara (interview) dengan stakeholder adalah teknik paling umum dan efektif untuk menggali kebutuhan.',
    'Menebak berdasarkan pengalaman sendiri',
    'Wawancara dengan stakeholder dan pengguna',
    'Membaca dokumentasi kompetitor',
    'Menggunakan template sistem yang sudah ada',
    'B', s);
  CALL link('Rekayasa Kebutuhan', s, 3);

  -- ========== UML Use Case Diagram ==========
  CALL ins_soal('Aktor dalam use case diagram merepresentasikan...',
    'mudah', 'Aktor adalah entitas di luar sistem yang berinteraksi dengan sistem (bisa manusia, sistem lain).',
    'Fitur utama sistem',
    'Database sistem',
    'Pengguna atau sistem luar yang berinteraksi dengan sistem',
    'Prosesor yang menjalankan sistem',
    'C', s);
  CALL link('UML Use Case Diagram', s, 1);

  CALL ins_soal('Relasi <<include>> antara dua use case berarti...',
    'sedang', '<<include>> berarti use case A selalu memanggil/menyertakan use case B setiap kali dieksekusi.',
    'Use case A mungkin menggunakan use case B secara opsional',
    'Use case A selalu menyertakan use case B saat dieksekusi',
    'Use case B adalah versi yang diperluas dari use case A',
    'Use case A dan B tidak saling berhubungan',
    'B', s);
  CALL link('UML Use Case Diagram', s, 2);

  CALL ins_soal('Perbedaan relasi <<include>> dan <<extend>> dalam use case adalah...',
    'sulit', '<<include>> wajib (selalu dipanggil), <<extend>> opsional (dipanggil hanya dalam kondisi tertentu).',
    'Tidak ada perbedaan, keduanya opsional',
    '<<include>> wajib dieksekusi; <<extend>> opsional dan kondisional',
    '<<extend>> wajib; <<include>> opsional',
    'Keduanya selalu wajib dieksekusi',
    'B', s);
  CALL link('UML Use Case Diagram', s, 3);

  -- ========== Dasar PHP ==========
  CALL ins_soal('Cara menggabungkan string di PHP menggunakan operator...',
    'mudah', 'PHP menggunakan titik (.) sebagai operator konkatenasi string, bukan + seperti JavaScript.',
    '+ (plus)',
    '& (ampersand)',
    '. (titik/dot)',
    '* (bintang)',
    'C', s);
  CALL link('Dasar PHP', s, 1);

  CALL ins_soal('Variabel superglobal PHP yang menyimpan data form yang dikirim via method POST adalah...',
    'mudah', '$_POST adalah array superglobal yang berisi data form yang dikirim dengan method POST.',
    '$GET',
    '$_POST',
    '$REQUEST',
    '$FORM',
    'B', s);
  CALL link('Dasar PHP', s, 2);

  CALL ins_soal('Fungsi PHP untuk mengubah semua huruf string menjadi huruf kecil adalah...',
    'mudah', 'strtolower() mengubah semua karakter string menjadi huruf kecil.',
    'tolower()',
    'lowercase()',
    'strtolower()',
    'str_lower()',
    'C', s);
  CALL link('Dasar PHP', s, 3);

  CALL ins_soal('Kode PHP berikut menghasilkan apa? <?php echo 10 / 3; ?>',
    'sedang', 'PHP secara default menghasilkan hasil pembagian desimal: 10/3 = 3.3333...',
    '3',
    '3.3333333333333',
    'Error',
    '1',
    'B', s);
  CALL link('Dasar PHP', s, 4);

  CALL ins_soal('Perbedaan echo dan print di PHP adalah...',
    'mudah', 'echo lebih cepat dan bisa menerima banyak argumen. print mengembalikan nilai 1 (bisa digunakan dalam ekspresi).',
    'echo hanya bisa mencetak angka, print untuk string',
    'print lebih cepat dari echo',
    'echo bisa menerima banyak argumen dan sedikit lebih cepat; print mengembalikan nilai 1',
    'Keduanya identik dalam segala hal',
    'C', s);
  CALL link('Dasar PHP', s, 5);

  -- ========== PHP Form Handling ==========
  CALL ins_soal('Perbedaan antara GET dan POST dalam pengiriman form HTML adalah...',
    'sedang', 'GET mengirim data melalui URL (terlihat, terbatas ukuran). POST mengirim via body request (tersembunyi, lebih aman untuk data sensitif).',
    'GET lebih aman dari POST untuk data password',
    'POST mengirim data melalui URL, GET melalui body request',
    'GET mengirim data di URL (terlihat); POST melalui body (lebih aman untuk data sensitif)',
    'Keduanya identik dalam keamanan',
    'C', s);
  CALL link('PHP Form Handling', s, 1);

  CALL ins_soal('Fungsi PHP yang digunakan untuk memulai session adalah...',
    'mudah', 'session_start() harus dipanggil di awal script sebelum menggunakan variabel $_SESSION.',
    'session_begin()',
    'start_session()',
    'session_open()',
    'session_start()',
    'D', s);
  CALL link('PHP Form Handling', s, 2);

  CALL ins_soal('Untuk menyimpan data login user ke session setelah autentikasi berhasil, kode yang benar adalah...',
    'sedang', '$_SESSION adalah array superglobal untuk menyimpan data session yang persisten antar halaman.',
    '$GET["user_id"] = $userId',
    '$SESSION["user_id"] = $userId',
    '$_SESSION["user_id"] = $userId',
    'setcookie("user_id", $userId)',
    'C', s);
  CALL link('PHP Form Handling', s, 3);

  -- ========== OOP PHP Dasar & Lanjutan ==========
  CALL ins_soal('Dalam PHP, keyword yang digunakan untuk membuat instance (objek) dari sebuah class adalah...',
    'mudah', 'Keyword new digunakan untuk membuat instance baru dari sebuah kelas.',
    'create',
    'instance',
    'new',
    'make',
    'C', s);
  CALL link('OOP PHP Dasar & Lanjutan', s, 1);

  CALL ins_soal('Method __construct() dalam PHP class berfungsi sebagai...',
    'mudah', '__construct() adalah constructor yang dipanggil otomatis saat objek baru dibuat.',
    'Method yang dipanggil saat objek dihapus',
    'Method untuk mengkonversi objek ke string',
    'Constructor — dipanggil otomatis saat objek baru dibuat',
    'Method statis yang tidak perlu instansiasi',
    'C', s);
  CALL link('OOP PHP Dasar & Lanjutan', s, 2);

  CALL ins_soal('Keyword "extends" dalam PHP digunakan untuk...',
    'mudah', 'extends membuat class anak (child) yang mewarisi properti dan method dari class induk (parent).',
    'Mengimplementasikan interface',
    'Membuat class abstrak',
    'Mewarisi class lain (inheritance)',
    'Mengimpor namespace',
    'C', s);
  CALL link('OOP PHP Dasar & Lanjutan', s, 3);

  CALL ins_soal('Interface dalam PHP OOP adalah...',
    'sedang', 'Interface mendefinisikan kontrak method yang harus diimplementasikan oleh class yang menggunakannya.',
    'Class yang tidak bisa di-instansiasi',
    'Kontrak yang mendefinisikan method yang harus diimplementasikan class',
    'Class dengan semua method sudah terimplementasi',
    'Cara untuk membuat variabel global',
    'B', s);
  CALL link('OOP PHP Dasar & Lanjutan', s, 4);

  CALL ins_soal('Polimorfisme dalam OOP berarti...',
    'sedang', 'Polimorfisme memungkinkan objek dari class berbeda merespons method yang sama dengan perilaku berbeda.',
    'Sebuah class hanya memiliki satu instance',
    'Objek dari class berbeda dapat merespons method yang sama dengan cara berbeda',
    'Class tidak boleh memiliki lebih dari satu constructor',
    'Semua method harus memiliki return value',
    'B', s);
  CALL link('OOP PHP Dasar & Lanjutan', s, 5);

  -- ========== Keamanan Web ==========
  CALL ins_soal('XSS (Cross-Site Scripting) terjadi ketika...',
    'sedang', 'XSS terjadi saat input pengguna yang berisi script HTML/JS ditampilkan tanpa sanitasi, sehingga skrip jahat ikut dieksekusi browser.',
    'Attacker mengakses database langsung',
    'Skrip berbahaya dari input pengguna dieksekusi di browser korban',
    'Server kehabisan resource',
    'Koneksi HTTPS dipermalukan',
    'B', s);
  CALL link('Keamanan Web', s, 1);

  CALL ins_soal('Fungsi PHP yang digunakan untuk mencegah XSS dengan mengubah karakter HTML menjadi entitas adalah...',
    'sedang', 'htmlspecialchars() mengkonversi <, >, &, " menjadi entitas HTML sehingga tidak diinterpretasikan sebagai kode.',
    'strip_tags()',
    'htmlspecialchars()',
    'sanitize()',
    'escape_html()',
    'B', s);
  CALL link('Keamanan Web', s, 2);

  CALL ins_soal('CSRF (Cross-Site Request Forgery) dicegah dengan cara...',
    'sedang', 'CSRF token adalah nilai acak unik yang disisipkan di form dan diverifikasi server, mencegah request palsu dari situs lain.',
    'Mengenkripsi semua data form',
    'Menggunakan HTTPS',
    'Menyisipkan CSRF token di form dan memverifikasinya di server',
    'Membatasi ukuran upload file',
    'C', s);
  CALL link('Keamanan Web', s, 3);

  -- ========== Autentikasi & Otorisasi Web ==========
  CALL ins_soal('RBAC (Role-Based Access Control) berarti...',
    'sedang', 'RBAC mengontrol akses berdasarkan role/peran pengguna, bukan per individu.',
    'Mengontrol akses berdasarkan waktu login',
    'Mengontrol akses berdasarkan role/peran yang dimiliki pengguna',
    'Mengenkripsi semua data pengguna',
    'Membatasi jumlah pengguna yang bisa login bersamaan',
    'B', s);
  CALL link('Autentikasi & Otorisasi Web', s, 1);

  CALL ins_soal('Middleware dalam konteks web framework berfungsi sebagai...',
    'sedang', 'Middleware adalah lapisan yang memproses request sebelum sampai ke controller, biasa digunakan untuk autentikasi dan otorisasi.',
    'Template engine untuk rendering HTML',
    'Lapisan yang memproses request sebelum mencapai controller (misal: cek autentikasi)',
    'Library untuk koneksi ke database',
    'Sistem caching untuk mempercepat response',
    'B', s);
  CALL link('Autentikasi & Otorisasi Web', s, 2);

  -- ========== Pengenalan Laravel ==========
  CALL ins_soal('Laravel menggunakan pola arsitektur...',
    'mudah', 'Laravel mengikuti pola MVC (Model-View-Controller) yang memisahkan logika bisnis, tampilan, dan kontrol.',
    'MVP (Model-View-Presenter)',
    'MVVM (Model-View-ViewModel)',
    'MVC (Model-View-Controller)',
    'REST (Representational State Transfer)',
    'C', s);
  CALL link('Pengenalan Laravel', s, 1);

  CALL ins_soal('File routes web utama di Laravel terletak di...',
    'mudah', 'Route web konvensional Laravel berada di routes/web.php.',
    'app/routes.php',
    'routes/web.php',
    'config/routes.php',
    'public/routes.php',
    'B', s);
  CALL link('Pengenalan Laravel', s, 2);

  CALL ins_soal('Perintah untuk menjalankan development server bawaan Laravel adalah...',
    'mudah', 'php artisan serve memulai built-in PHP development server untuk Laravel di localhost:8000.',
    'php artisan start',
    'laravel run',
    'php artisan serve',
    'composer run-server',
    'C', s);
  CALL link('Pengenalan Laravel', s, 3);

  CALL ins_soal('Artisan adalah...',
    'mudah', 'Artisan adalah CLI (Command Line Interface) bawaan Laravel untuk berbagai tugas development.',
    'Template engine Laravel',
    'ORM Laravel',
    'CLI bawaan Laravel untuk membantu tugas development',
    'Package manager Laravel',
    'C', s);
  CALL link('Pengenalan Laravel', s, 4);

  -- ========== Blade Templating ==========
  CALL ins_soal('Direktif Blade untuk mewarisi layout master adalah...',
    'mudah', '@extends digunakan di child view untuk mewarisi layout master Blade.',
    '@include',
    '@component',
    '@extends',
    '@layout',
    'C', s);
  CALL link('Blade Templating', s, 1);

  CALL ins_soal('Direktif Blade @yield digunakan untuk...',
    'sedang', '@yield menandai tempat di layout master di mana konten dari child view akan disisipkan.',
    'Mengulang array data',
    'Menampilkan variabel PHP',
    'Menandai tempat di layout master untuk konten dari child view',
    'Membuat komponen reusable',
    'C', s);
  CALL link('Blade Templating', s, 2);

  CALL ins_soal('Sintaks Blade yang benar untuk menampilkan variabel $nama dengan escape HTML adalah...',
    'mudah', '{{ $nama }} adalah sintaks Blade untuk menampilkan variabel dengan auto-escape HTML (mencegah XSS).',
    '<?php echo $nama; ?>',
    '{!! $nama !!}',
    '{{ $nama }}',
    '@echo($nama)',
    'C', s);
  CALL link('Blade Templating', s, 3);

  -- ========== CRUD dengan Laravel ==========
  CALL ins_soal('Resource Controller di Laravel menyediakan berapa method standar?',
    'sedang', 'Resource Controller Laravel memiliki 7 method: index, create, store, show, edit, update, destroy.',
    '5 method',
    '6 method',
    '7 method',
    '8 method',
    'C', s);
  CALL link('CRUD dengan Laravel', s, 1);

  CALL ins_soal('Form Request Validation di Laravel digunakan untuk...',
    'sedang', 'Form Request class memindahkan logika validasi dari controller ke class terpisah, menjaga controller tetap bersih.',
    'Membuat form HTML secara otomatis',
    'Memisahkan logika validasi dari controller ke class khusus',
    'Mengirim email dari form kontak',
    'Mengupload file dari form',
    'B', s);
  CALL link('CRUD dengan Laravel', s, 2);

  CALL ins_soal('Perintah Artisan untuk membuat Resource Controller di Laravel adalah...',
    'mudah', '--resource flag membuat controller dengan 7 method CRUD secara otomatis.',
    'php artisan make:controller NamaController',
    'php artisan make:controller NamaController --resource',
    'php artisan controller:make NamaController',
    'php artisan make:crud NamaController',
    'B', s);
  CALL link('CRUD dengan Laravel', s, 3);

  RAISE NOTICE 'Part 3 selesai: soal kompetensi Kelas X & XI berhasil di-insert.';
END $$;
