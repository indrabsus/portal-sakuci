-- ============================================================
-- Seed: Roadmap Kompetensi Kelas XI
-- 1 Kompetensi: Pemrograman Web (urutan 1, mapel berbeda)
-- 5 Tes Kompetensi (5 PG 5-opsi + 2 Essay per tes)
-- Jalankan di Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  v_jur uuid;

  k1 uuid; -- kompetensi

  t1 uuid; -- HTML/CSS Lanjutan
  t2 uuid; -- Dasar PHP
  t3 uuid; -- PHP Form Handling
  t4 uuid; -- Studi Kasus CRUD Awal
  t5 uuid; -- OOP PHP Dasar & Lanjutan

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
    'Pemrograman Web',
    'Membangun aplikasi web dinamis menggunakan HTML/CSS lanjutan, PHP, penanganan form, operasi CRUD dengan database MySQL, dan paradigma Object Oriented Programming (OOP) dalam PHP.',
    11, 1, 70, true)
  RETURNING id_kompetensi INTO k1;

  -- ----------------------------------------------------------
  -- 2. KOMPETENSI_TUGAS
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'HTML/CSS Lanjutan',
    'Tes kemampuan HTML5 semantik lanjutan, CSS advanced (Flexbox, Grid, animasi, variabel CSS), dan teknik layout responsif.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t1;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Dasar PHP',
    'Tes pemahaman sintaks dasar PHP: variabel, tipe data, operator, kondisional, perulangan, fungsi, dan array.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t2;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'PHP Form Handling',
    'Tes kemampuan menangani form HTML dengan PHP: GET/POST, validasi input, sanitasi, upload file, dan session/cookie.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t3;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Studi Kasus CRUD Awal',
    'Tes kemampuan membangun aplikasi CRUD (Create, Read, Update, Delete) sederhana dengan PHP dan MySQL menggunakan PDO/MySQLi.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t4;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'OOP PHP Dasar & Lanjutan',
    'Tes pemahaman dan penerapan Object Oriented Programming dalam PHP: class, object, constructor, enkapsulasi, inheritance, polymorphism, dan interface.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t5;

  -- ==========================================================
  -- TES 1: HTML/CSS LANJUTAN
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Property CSS yang memungkinkan kita mendefinisikan nilai yang dapat digunakan kembali di seluruh stylesheet dan diawali dengan "--" disebut...',
    'pg', 'sedang',
    'CSS Custom Properties (CSS Variables) didefinisikan dengan prefix "--" dan diakses menggunakan fungsi var(). Contoh: :root { --warna-utama: #4f46e5; } lalu dipakai: color: var(--warna-utama); Sangat berguna untuk theming dan konsistensi desain.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','CSS Preprocessor Variables (seperti $var di SASS)',false),
    (s,'B','CSS Custom Properties (CSS Variables)',true),
    (s,'C','CSS Data Attributes',false),
    (s,'D','CSS Constants',false),
    (s,'E','CSS Tokens',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Deklarasi CSS Grid berikut "grid-template-columns: repeat(3, 1fr)" akan menghasilkan...',
    'pg', 'sedang',
    '1fr = 1 fraction unit (bagian proporsional dari ruang yang tersisa). repeat(3, 1fr) = 3 kolom dengan lebar sama rata membagi seluruh lebar container. Jika container 900px, tiap kolom = 300px. "fr" adalah unit khusus CSS Grid.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','3 kolom dengan lebar masing-masing 1 piksel',false),
    (s,'B','1 kolom yang dibagi menjadi 3 bagian menggunakan float',false),
    (s,'C','3 kolom dengan lebar sama rata membagi seluruh lebar container',true),
    (s,'D','3 baris dengan tinggi sama rata',false),
    (s,'E','Kolom yang berulang hingga container penuh',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'CSS pseudo-class ":nth-child(2n)" akan memilih elemen...',
    'pg', 'sulit',
    ':nth-child(2n) = memilih elemen ke-2, 4, 6, 8, ... (semua elemen genap). Sama dengan :nth-child(even). Contoh penggunaan: tr:nth-child(2n) { background: #f0f0f0; } untuk membuat zebra striping di tabel.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Elemen ke-2 saja dari parent-nya',false),
    (s,'B','Dua elemen pertama dari parent-nya',false),
    (s,'C','Semua elemen ganjil (ke-1, 3, 5, ...)',false),
    (s,'D','Semua elemen genap (ke-2, 4, 6, ...)',true),
    (s,'E','Elemen dengan class "2n"',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Property CSS untuk membuat animasi transisi halus saat nilai property berubah (misalnya saat hover) adalah...',
    'pg', 'mudah',
    'transition mengatur animasi perubahan property CSS secara halus. Sintaks: transition: property duration timing-function delay. Contoh: transition: background-color 0.3s ease; akan membuat perubahan warna background menjadi halus dalam 0.3 detik.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','animation',false),
    (s,'B','transform',false),
    (s,'C','transition',true),
    (s,'D','motion',false),
    (s,'E','keyframe',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Untuk membuat elemen dengan class "kartu" bergerak naik 10px saat di-hover menggunakan CSS, kode yang tepat adalah...',
    'pg', 'sedang',
    'transform: translateY() menggerakkan elemen secara vertikal. Nilai negatif = naik, positif = turun. Dikombinasikan dengan transition untuk efek halus. translateY(-10px) = naik 10px dari posisi asal.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','.kartu:hover { top: -10px; }',false),
    (s,'B','.kartu:hover { margin-top: -10px; }',false),
    (s,'C','.kartu:hover { position: -10px; }',false),
    (s,'D','.kartu:hover { transform: translateY(-10px); }',true),
    (s,'E','.kartu:hover { move: up 10px; }',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah kode HTML dan CSS untuk sebuah halaman "Kartu Profil Siswa" yang responsif! Ketentuan: (a) gunakan HTML5 semantik yang tepat, (b) layout menggunakan CSS Flexbox atau Grid, (c) kartu harus memiliki: foto profil (avatar), nama, kelas, dan 3 info (NISN, email, no HP), (d) tambahkan efek hover yang halus pada kartu, (e) kartu harus responsif: 3 kolom di desktop, 1 kolom di mobile (max-width: 600px)!',
    'essay', 'sulit',
    'Jawaban ideal:

HTML:
<main class="container">
  <article class="kartu-profil">
    <img src="foto.jpg" alt="Foto Siswa" class="avatar">
    <h2 class="nama">Budi Santoso</h2>
    <p class="kelas">XI RPL 1</p>
    <ul class="info-list">
      <li>NISN: 0012345678</li>
      <li>Email: budi@sekolah.sch.id</li>
      <li>No HP: 081234567890</li>
    </ul>
  </article>
  <!-- kartu lainnya... -->
</main>

CSS:
:root { --warna-utama: #4f46e5; --radius: 12px; }

.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 2rem;
}

.kartu-profil {
  background: white;
  border-radius: var(--radius);
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.kartu-profil:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
.avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; }
.nama { font-size: 1.1rem; font-weight: bold; color: var(--warna-utama); }
.info-list { list-style: none; padding: 0; text-align: left; font-size: 0.875rem; }

@media (max-width: 600px) {
  .container { grid-template-columns: 1fr; }
}

Nilai penuh: HTML5 semantik (article/main) + grid 3 kolom + komponen kartu lengkap + hover effect dengan transition + media query 1 kolom mobile.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara CSS Flexbox dan CSS Grid! Kapan sebaiknya menggunakan Flexbox dan kapan menggunakan Grid? Berikan contoh kasus nyata untuk masing-masing, kemudian tuliskan kode CSS yang tepat untuk: (a) navbar horizontal dengan logo kiri dan menu kanan menggunakan Flexbox, (b) layout halaman dengan header, sidebar, konten utama, dan footer menggunakan Grid!',
    'essay', 'sedang',
    'Jawaban ideal:

Perbedaan:
- Flexbox: sistem SATU DIMENSI (baris ATAU kolom). Ideal untuk komponen kecil: navbar, card row, tombol group.
- Grid: sistem DUA DIMENSI (baris DAN kolom bersamaan). Ideal untuk layout halaman keseluruhan.

Kapan pakai Flexbox: komponen linear seperti navbar, tombol, list horizontal, centering elemen.
Kapan pakai Grid: layout keseluruhan halaman, galeri foto, dashboard dengan banyak widget.

(a) Navbar dengan Flexbox:
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #1e293b;
}
.logo { color: white; font-weight: bold; font-size: 1.25rem; }
.menu { display: flex; gap: 1.5rem; list-style: none; }
.menu a { color: #94a3b8; text-decoration: none; }
.menu a:hover { color: white; }

(b) Layout halaman dengan Grid:
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar konten"
    "footer footer";
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
header { grid-area: header; }
aside  { grid-area: sidebar; }
main   { grid-area: konten; }
footer { grid-area: footer; }

Nilai penuh: perbedaan Flexbox vs Grid + kapan pakai masing-masing + kode navbar Flexbox benar + kode Grid layout dengan grid-template-areas.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 7, 25);

  -- ==========================================================
  -- TES 2: DASAR PHP
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Apa output dari kode PHP berikut?
<?php
$nilai = 85;
if ($nilai >= 90) {
    echo "A";
} elseif ($nilai >= 75) {
    echo "B";
} else {
    echo "C";
}
?>',
    'pg', 'mudah',
    '$nilai = 85. Kondisi pertama: 85 >= 90 → FALSE. Kondisi kedua: 85 >= 75 → TRUE → output "B". Kondisi else tidak dieksekusi. PHP mengeksekusi blok pertama yang kondisinya TRUE.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','A',false),
    (s,'B','B',true),
    (s,'C','C',false),
    (s,'D','AB',false),
    (s,'E','Tidak ada output (error)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Fungsi PHP yang digunakan untuk menggabungkan elemen-elemen array menjadi sebuah string dengan pemisah tertentu adalah...',
    'pg', 'mudah',
    'implode($separator, $array) atau join() menggabungkan array menjadi string. Kebalikannya: explode($separator, $string) memecah string menjadi array. Contoh: implode(", ", ["PHP","MySQL","HTML"]) → "PHP, MySQL, HTML".')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','array_merge()',false),
    (s,'B','concat()',false),
    (s,'C','str_join()',false),
    (s,'D','implode()',true),
    (s,'E','array_combine()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Apa output dari kode PHP berikut?
<?php
$buah = ["apel", "mangga", "jeruk"];
echo count($buah) . " buah";
?>',
    'pg', 'mudah',
    'count($array) mengembalikan jumlah elemen dalam array. Array $buah memiliki 3 elemen. Operator "." di PHP adalah string concatenation. Output: "3 buah".')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','apel mangga jeruk buah',false),
    (s,'B','0 buah',false),
    (s,'C','3 buah',true),
    (s,'D','Array buah',false),
    (s,'E','Error karena tipe data berbeda',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam PHP, perbedaan antara echo dan print adalah...',
    'pg', 'sedang',
    'echo: bisa menerima beberapa argumen (echo "a", "b";), tidak return value, sedikit lebih cepat. print: hanya satu argumen, selalu return 1 (bisa dipakai dalam ekspresi), lebih lambat. Dalam praktik sehari-hari keduanya hampir identik untuk menampilkan output.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','echo hanya untuk string, print bisa untuk semua tipe data',false),
    (s,'B','print bisa menerima banyak argumen, echo hanya satu',false),
    (s,'C','echo tidak return value dan bisa banyak argumen; print return 1 dan hanya satu argumen',true),
    (s,'D','Keduanya identik, tidak ada perbedaan sama sekali',false),
    (s,'E','echo digunakan di dalam HTML, print hanya di dalam PHP murni',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Apa output dari kode PHP berikut?
<?php
function kali($a, $b = 2) {
    return $a * $b;
}
echo kali(5);
echo " ";
echo kali(5, 3);
?>',
    'pg', 'sedang',
    '$b = 2 adalah default parameter value. kali(5) → kali(5, 2) = 10. kali(5, 3) = 15. Default parameter dipakai saat argumen tidak disediakan. Output: "10 15".')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','5 15',false),
    (s,'B','10 10',false),
    (s,'C','Error karena argumen kurang',false),
    (s,'D','10 15',true),
    (s,'E','5 3',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah program PHP yang: (a) membuat array asosiatif berisi data 5 siswa (kunci: nama, nilai, kelas), (b) menampilkan data siswa dalam tabel HTML, (c) menghitung dan menampilkan nilai rata-rata kelas, (d) menandai baris siswa yang nilainya di bawah rata-rata dengan warna merah, (e) menampilkan siswa dengan nilai tertinggi!',
    'essay', 'sulit',
    'Jawaban ideal:

<?php
$siswa = [
    ["nama" => "Andi",  "nilai" => 85, "kelas" => "XI RPL 1"],
    ["nama" => "Budi",  "nilai" => 72, "kelas" => "XI RPL 1"],
    ["nama" => "Citra", "nilai" => 90, "kelas" => "XI RPL 1"],
    ["nama" => "Deni",  "nilai" => 65, "kelas" => "XI RPL 1"],
    ["nama" => "Eva",   "nilai" => 88, "kelas" => "XI RPL 1"],
];

$total = 0;
$nilaiMax = $siswa[0]["nilai"];
$siswaTerbaik = $siswa[0]["nama"];

foreach ($siswa as $s) {
    $total += $s["nilai"];
    if ($s["nilai"] > $nilaiMax) {
        $nilaiMax = $s["nilai"];
        $siswaTerbaik = $s["nama"];
    }
}
$rata = $total / count($siswa);
?>

<table border="1">
  <tr><th>No</th><th>Nama</th><th>Nilai</th><th>Kelas</th></tr>
  <?php foreach ($siswa as $i => $s): ?>
    <?php $warna = $s["nilai"] < $rata ? "style=''background:salmon''" : ""; ?>
    <tr <?= $warna ?>>
      <td><?= $i + 1 ?></td>
      <td><?= htmlspecialchars($s["nama"]) ?></td>
      <td><?= $s["nilai"] ?></td>
      <td><?= $s["kelas"] ?></td>
    </tr>
  <?php endforeach; ?>
</table>

<p>Rata-rata kelas: <?= number_format($rata, 2) ?></p>
<p>Siswa terbaik: <?= $siswaTerbaik ?> (<?= $nilaiMax ?>)</p>

Nilai penuh: array asosiatif 5 siswa + tabel HTML + hitung rata-rata + highlight merah di bawah rata-rata + siswa nilai tertinggi.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara variabel lokal dan variabel global dalam PHP! Kemudian buatlah program PHP yang: (a) mendefinisikan fungsi untuk menghitung luas dan keliling persegi panjang, (b) mendefinisikan fungsi untuk menghitung luas dan keliling lingkaran, (c) panggil semua fungsi dengan nilai yang berbeda, (d) tampilkan hasilnya dalam format yang rapi!',
    'essay', 'sedang',
    'Jawaban ideal:

Variabel Lokal: hanya bisa diakses di dalam fungsi di mana ia didefinisikan.
Variabel Global: didefinisikan di luar fungsi, tidak bisa langsung diakses di dalam fungsi (perlu keyword "global" atau $_GLOBALS).

<?php
define("PI", 3.14159);

function luasPersegiPanjang($p, $l) {
    return $p * $l;
}
function kelilingPersegiPanjang($p, $l) {
    return 2 * ($p + $l);
}

function luasLingkaran($r) {
    return PI * $r * $r;
}
function kelilingLingkaran($r) {
    return 2 * PI * $r;
}

// Persegi panjang 10 x 5
$p = 10; $l = 5;
echo "=== Persegi Panjang ({$p} x {$l}) ===\n";
echo "Luas    : " . luasPersegiPanjang($p, $l) . " cm²\n";
echo "Keliling: " . kelilingPersegiPanjang($p, $l) . " cm\n\n";

// Lingkaran r = 7
$r = 7;
echo "=== Lingkaran (r = {$r}) ===\n";
echo "Luas    : " . number_format(luasLingkaran($r), 2) . " cm²\n";
echo "Keliling: " . number_format(kelilingLingkaran($r), 2) . " cm\n";
?>

Nilai penuh: penjelasan lokal vs global + fungsi luas/keliling persegi panjang + fungsi luas/keliling lingkaran + pemanggilan + output rapi.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 7, 25);

  -- ==========================================================
  -- TES 3: PHP FORM HANDLING
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan utama antara method GET dan POST pada form HTML adalah...',
    'pg', 'sedang',
    'GET: data dikirim via URL (query string), terlihat di address bar, bisa di-bookmark, cocok untuk pencarian/filter. POST: data dikirim di body request, tidak terlihat di URL, lebih aman untuk data sensitif (password, data pribadi), bisa kirim data besar/file.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','GET lebih aman dari POST untuk mengirim password',false),
    (s,'B','POST tidak bisa digunakan untuk mengirim file',false),
    (s,'C','GET mengirim data via URL; POST via body request — GET cocok untuk pencarian, POST untuk data sensitif',true),
    (s,'D','GET hanya untuk mengambil data dari server, tidak bisa mengirim',false),
    (s,'E','Keduanya identik, hanya berbeda nama saja',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Fungsi PHP yang digunakan untuk mencegah XSS (Cross-Site Scripting) dengan mengubah karakter HTML khusus menjadi entity HTML adalah...',
    'pg', 'sedang',
    'htmlspecialchars() mengubah: & → &amp;, " → &quot;, '' → &#039;, < → &lt;, > → &gt;. Ini mencegah browser mengeksekusi script yang disuntikkan oleh pengguna jahat melalui input form. WAJIB digunakan saat menampilkan data dari input pengguna.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','strip_tags()',false),
    (s,'B','htmlspecialchars()',true),
    (s,'C','addslashes()',false),
    (s,'D','sanitize()',false),
    (s,'E','escape_html()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Untuk mengecek apakah form sudah di-submit via method POST di PHP, cara yang tepat adalah...',
    'pg', 'mudah',
    '$_SERVER["REQUEST_METHOD"] === "POST" adalah cara paling andal mengecek apakah request datang via POST. Alternatif: isset($_POST["nama_tombol_submit"]) — mengecek apakah tombol submit ada di data POST.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','if (form_submitted() == true)',false),
    (s,'B','if ($_FORM["method"] == "post")',false),
    (s,'C','if ($_POST["submit"] === true)',false),
    (s,'D','if ($_SERVER["REQUEST_METHOD"] === "POST")',true),
    (s,'E','if (method_is("POST"))',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Superglobal PHP yang digunakan untuk menyimpan data antar halaman tanpa perlu dikirim ulang melalui form disebut...',
    'pg', 'sedang',
    '$_SESSION menyimpan data di server yang bisa diakses lintas halaman selama sesi browser aktif. Harus diawali dengan session_start(). Cocok untuk data login, keranjang belanja. $_COOKIE disimpan di browser (kurang aman). $_GET/$_POST hanya untuk request saat itu.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','$_GLOBAL',false),
    (s,'B','$_COOKIE',false),
    (s,'C','$_SERVER',false),
    (s,'D','$_SESSION',true),
    (s,'E','$_REQUEST',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Ketika mengupload file via form PHP, informasi file yang diupload (nama, ukuran, tipe, lokasi sementara) tersimpan di...',
    'pg', 'mudah',
    '$_FILES adalah superglobal PHP yang berisi informasi file yang diupload: $_FILES["namaField"]["name"] (nama asli), ["type"] (MIME type), ["size"] (ukuran byte), ["tmp_name"] (lokasi file sementara di server), ["error"] (kode error). Form harus punya enctype="multipart/form-data".')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','$_POST["file"]',false),
    (s,'B','$_GET["file"]',false),
    (s,'C','$_UPLOAD',false),
    (s,'D','$_FILES',true),
    (s,'E','$_SERVER["FILE"]',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah form registrasi PHP yang lengkap dengan validasi server-side! Form harus memiliki: nama (wajib, min 3 karakter), email (wajib, format valid), password (wajib, min 8 karakter), konfirmasi password (harus sama), nomor HP (opsional, hanya angka). Tampilkan pesan error spesifik per field dan jika berhasil tampilkan pesan sukses!',
    'essay', 'sulit',
    'Jawaban ideal:

<?php
$errors = [];
$success = false;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nama  = trim($_POST["nama"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $pass  = $_POST["password"] ?? "";
    $konfirm = $_POST["konfirmasi"] ?? "";
    $hp    = trim($_POST["hp"] ?? "");

    if (strlen($nama) < 3)
        $errors["nama"] = "Nama minimal 3 karakter.";
    if (!filter_var($email, FILTER_VALIDATE_EMAIL))
        $errors["email"] = "Format email tidak valid.";
    if (strlen($pass) < 8)
        $errors["password"] = "Password minimal 8 karakter.";
    elseif ($pass !== $konfirm)
        $errors["konfirmasi"] = "Konfirmasi password tidak cocok.";
    if ($hp !== "" && !ctype_digit($hp))
        $errors["hp"] = "Nomor HP hanya boleh berisi angka.";

    if (empty($errors)) $success = true;
}
?>
<?php if ($success): ?>
  <p style="color:green">Registrasi berhasil! Selamat datang, <?= htmlspecialchars($nama) ?>.</p>
<?php endif; ?>

<form method="POST">
  <label>Nama:
    <input type="text" name="nama" value="<?= htmlspecialchars($nama ?? '') ?>">
    <?php if (isset($errors["nama"])): ?>
      <span style="color:red"><?= $errors["nama"] ?></span>
    <?php endif; ?>
  </label>
  <!-- field lainnya serupa... -->
  <button type="submit">Daftar</button>
</form>

Nilai penuh: cek REQUEST_METHOD + validasi semua field (nama min 3 + email FILTER_VALIDATE_EMAIL + pass min 8 + konfirmasi sama + HP ctype_digit) + tampil error per field + htmlspecialchars saat output + pesan sukses.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan cara kerja SESSION dalam PHP beserta siklus hidupnya! Kemudian buatlah kode PHP untuk: (a) halaman login.php yang memvalidasi username/password (hardcode: admin/12345), menyimpan session jika berhasil, (b) halaman dashboard.php yang hanya bisa diakses jika sudah login (cek session), (c) halaman logout.php yang menghapus session dan redirect ke login!',
    'essay', 'sedang',
    'Jawaban ideal:

Cara kerja SESSION:
1. session_start() dipanggil → PHP membuat/melanjutkan sesi
2. Server membuat session ID unik, dikirim ke browser sebagai cookie (PHPSESSID)
3. Data disimpan di $_SESSION → disimpan di file sementara di server
4. Setiap request berikutnya, browser kirim PHPSESSID → server cocokkan dengan data sesi
5. Sesi berakhir: session_destroy(), browser tutup, atau timeout

-- login.php --
<?php
session_start();
$error = "";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user = $_POST["username"] ?? "";
    $pass = $_POST["password"] ?? "";
    if ($user === "admin" && $pass === "12345") {
        $_SESSION["login"] = true;
        $_SESSION["username"] = $user;
        header("Location: dashboard.php");
        exit;
    } else {
        $error = "Username atau password salah!";
    }
}
?>
<form method="POST">
  <input name="username" placeholder="Username">
  <input name="password" type="password" placeholder="Password">
  <?php if ($error) echo "<p style=color:red>$error</p>"; ?>
  <button>Login</button>
</form>

-- dashboard.php --
<?php
session_start();
if (!isset($_SESSION["login"]) || !$_SESSION["login"]) {
    header("Location: login.php"); exit;
}
echo "Selamat datang, " . htmlspecialchars($_SESSION["username"]);
echo '' <a href="logout.php">Logout</a>'';
?>

-- logout.php --
<?php
session_start();
session_unset();
session_destroy();
header("Location: login.php");
exit;
?>

Nilai penuh: penjelasan session + siklus hidup + login dengan session_start + cek credential + redirect + dashboard cek session + logout dengan destroy.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 7, 25);

  -- ==========================================================
  -- TES 4: STUDI KASUS CRUD AWAL
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Singkatan CRUD dalam pengembangan aplikasi database adalah...',
    'pg', 'mudah',
    'CRUD = Create (INSERT data baru), Read (SELECT/tampilkan data), Update (UPDATE ubah data), Delete (DELETE hapus data). Ini adalah 4 operasi dasar yang hampir selalu ada di setiap aplikasi yang menggunakan database.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Copy, Restore, Update, Delete',false),
    (s,'B','Create, Read, Update, Delete',true),
    (s,'C','Create, Refresh, Upload, Download',false),
    (s,'D','Connect, Retrieve, Unlink, Drop',false),
    (s,'E','Cache, Read, Upload, Delete',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Keunggulan menggunakan PDO (PHP Data Objects) dibandingkan MySQLi procedural dalam koneksi database adalah...',
    'pg', 'sedang',
    'PDO mendukung 12+ driver database (MySQL, PostgreSQL, SQLite, dll) sehingga kode mudah dipindahkan ke database lain. MySQLi hanya untuk MySQL. Keduanya mendukung Prepared Statement untuk keamanan. PDO berorientasi objek secara konsisten.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','PDO lebih cepat dari MySQLi untuk semua jenis query',false),
    (s,'B','PDO mendukung banyak jenis database (MySQL, PostgreSQL, dll) sehingga kode lebih portabel',true),
    (s,'C','PDO tidak perlu koneksi ke database terlebih dahulu',false),
    (s,'D','MySQLi tidak mendukung prepared statement, PDO mendukung',false),
    (s,'E','PDO hanya bisa digunakan dengan framework seperti Laravel',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Teknik keamanan database yang menggunakan placeholder "?" atau ":nama" dalam query SQL untuk mencegah SQL Injection disebut...',
    'pg', 'sedang',
    'Prepared Statement (parameterized query) memisahkan query SQL dari datanya. Placeholder diganti data SETELAH query dikompilasi, sehingga input pengguna tidak pernah dieksekusi sebagai SQL. Ini adalah cara terbaik mencegah SQL Injection.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Query Escaping',false),
    (s,'B','SQL Filtering',false),
    (s,'C','Prepared Statement',true),
    (s,'D','Input Sanitization',false),
    (s,'E','Database Encryption',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perintah PHP untuk mengarahkan pengguna ke halaman lain setelah operasi CRUD berhasil (Post-Redirect-Get pattern) adalah...',
    'pg', 'mudah',
    'header("Location: halaman.php") mengirim HTTP redirect ke browser. WAJIB diikuti exit/die untuk menghentikan eksekusi kode berikutnya. Pattern PRG (Post-Redirect-Get) mencegah form di-submit ulang saat halaman di-refresh.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','redirect("halaman.php")',false),
    (s,'B','goto("halaman.php")',false),
    (s,'C','$_SERVER["REDIRECT"] = "halaman.php"',false),
    (s,'D','header("Location: halaman.php"); exit;',true),
    (s,'E','echo "<script>window.location=''halaman.php''</script>"',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam arsitektur aplikasi CRUD PHP sederhana, file yang sebaiknya dibuat terpisah untuk menyimpan konfigurasi koneksi database adalah...',
    'pg', 'sedang',
    'Memisahkan koneksi database ke file config.php atau koneksi.php adalah praktik terbaik: (1) konfigurasi hanya di satu tempat, (2) mudah diubah jika pindah server, (3) semua halaman cukup require/include file ini. Ini prinsip DRY (Don''t Repeat Yourself).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Ditulis ulang di setiap file PHP yang butuh database',false),
    (s,'B','Disimpan di file HTML agar mudah dilihat',false),
    (s,'C','Disimpan di file config.php atau koneksi.php yang di-include ke semua halaman',true),
    (s,'D','Disimpan langsung di URL sebagai parameter',false),
    (s,'E','Tidak perlu file terpisah, langsung di index.php saja',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah kode PHP lengkap untuk fitur CREATE (tambah data) dan READ (tampilkan data) pada aplikasi Data Siswa! Harus mencakup: (a) file koneksi.php dengan PDO, (b) form tambah siswa (nama, kelas, alamat), (c) proses simpan ke database dengan prepared statement, (d) tampilkan daftar siswa dalam tabel dari database, (e) sertakan penanganan error yang tepat!',
    'essay', 'sulit',
    'Jawaban ideal:

-- koneksi.php --
<?php
$host = "localhost"; $db = "sekolah"; $user = "root"; $pass = "";
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Koneksi gagal: " . $e->getMessage());
}
?>

-- index.php --
<?php
require "koneksi.php";
$pesan = "";

// CREATE
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nama   = trim($_POST["nama"] ?? "");
    $kelas  = trim($_POST["kelas"] ?? "");
    $alamat = trim($_POST["alamat"] ?? "");
    if ($nama && $kelas) {
        $stmt = $pdo->prepare("INSERT INTO siswa (nama, kelas, alamat) VALUES (?, ?, ?)");
        $stmt->execute([$nama, $kelas, $alamat]);
        $pesan = "Data berhasil ditambahkan!";
    } else {
        $pesan = "Nama dan kelas wajib diisi!";
    }
}

// READ
$siswaList = $pdo->query("SELECT * FROM siswa ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
?>
<?php if ($pesan) echo "<p>$pesan</p>"; ?>

<form method="POST">
  <input name="nama" placeholder="Nama Siswa" required>
  <input name="kelas" placeholder="Kelas">
  <textarea name="alamat" placeholder="Alamat"></textarea>
  <button>Tambah</button>
</form>

<table border="1">
  <tr><th>No</th><th>Nama</th><th>Kelas</th><th>Alamat</th></tr>
  <?php foreach ($siswaList as $i => $s): ?>
  <tr>
    <td><?= $i+1 ?></td>
    <td><?= htmlspecialchars($s["nama"]) ?></td>
    <td><?= htmlspecialchars($s["kelas"]) ?></td>
    <td><?= htmlspecialchars($s["alamat"]) ?></td>
  </tr>
  <?php endforeach; ?>
</table>

Nilai penuh: koneksi PDO + try-catch + form POST + prepared statement INSERT + SELECT fetchAll + tampil tabel + htmlspecialchars.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Lengkapi aplikasi CRUD Data Siswa dengan fitur UPDATE dan DELETE! Buatlah: (a) tombol Edit di tiap baris tabel yang membawa ke halaman edit.php dengan id siswa, (b) form edit.php yang menampilkan data lama dan bisa diubah, (c) proses UPDATE dengan prepared statement, (d) tombol Hapus dengan konfirmasi JavaScript, (e) proses DELETE dari database!',
    'essay', 'sulit',
    'Jawaban ideal:

-- Di tabel (index.php) tambahkan kolom Aksi: --
<td>
  <a href="edit.php?id=<?= $s[''id''] ?>">Edit</a> |
  <a href="hapus.php?id=<?= $s[''id''] ?>"
     onclick="return confirm(''Yakin hapus data ini?'')">Hapus</a>
</td>

-- edit.php --
<?php
require "koneksi.php";
$id = (int)($_GET["id"] ?? 0);
if (!$id) { header("Location: index.php"); exit; }

// Ambil data lama
$stmt = $pdo->prepare("SELECT * FROM siswa WHERE id = ?");
$stmt->execute([$id]);
$siswa = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$siswa) { header("Location: index.php"); exit; }

// Proses UPDATE
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nama   = trim($_POST["nama"]);
    $kelas  = trim($_POST["kelas"]);
    $alamat = trim($_POST["alamat"]);
    $stmt = $pdo->prepare("UPDATE siswa SET nama=?, kelas=?, alamat=? WHERE id=?");
    $stmt->execute([$nama, $kelas, $alamat, $id]);
    header("Location: index.php"); exit;
}
?>
<form method="POST">
  <input name="nama"   value="<?= htmlspecialchars($siswa[''nama'']) ?>" required>
  <input name="kelas"  value="<?= htmlspecialchars($siswa[''kelas'']) ?>">
  <textarea name="alamat"><?= htmlspecialchars($siswa[''alamat'']) ?></textarea>
  <button>Simpan Perubahan</button>
</form>

-- hapus.php --
<?php
require "koneksi.php";
$id = (int)($_GET["id"] ?? 0);
if ($id) {
    $stmt = $pdo->prepare("DELETE FROM siswa WHERE id = ?");
    $stmt->execute([$id]);
}
header("Location: index.php"); exit;
?>

Nilai penuh: link edit dengan id + form edit tampil data lama + UPDATE prepared statement + PRG redirect + hapus dengan confirm JS + DELETE prepared statement.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 7, 25);

  -- ==========================================================
  -- TES 5: OOP PHP DASAR & LANJUTAN
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam OOP PHP, method khusus yang otomatis dipanggil saat objek dibuat dari sebuah class adalah...',
    'pg', 'mudah',
    '__construct() adalah magic method constructor yang dipanggil otomatis saat new ClassName() dieksekusi. Biasanya digunakan untuk menginisialisasi property objek. Kebalikannya: __destruct() dipanggil saat objek dihapus dari memori.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','__init()',false),
    (s,'B','__start()',false),
    (s,'C','__new()',false),
    (s,'D','__construct()',true),
    (s,'E','__create()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Prinsip OOP yang menyembunyikan detail implementasi internal class dan hanya mengekspos interface publik disebut...',
    'pg', 'sedang',
    'Encapsulation (Enkapsulasi) = membungkus data (property) dan method yang beroperasi pada data tersebut menjadi satu unit (class), dengan mengontrol akses menggunakan visibility (private/protected/public). Property biasanya private, diakses via getter/setter.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Inheritance (Pewarisan)',false),
    (s,'B','Polymorphism (Polimorfisme)',false),
    (s,'C','Abstraction (Abstraksi)',false),
    (s,'D','Encapsulation (Enkapsulasi)',true),
    (s,'E','Composition (Komposisi)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perhatikan kode PHP berikut:
class Hewan {
    public function suara() { return "..."; }
}
class Kucing extends Hewan {
    public function suara() { return "Meow"; }
}
class Anjing extends Hewan {
    public function suara() { return "Woof"; }
}
$h = new Kucing();
echo $h->suara();

Output yang dihasilkan adalah...',
    'pg', 'sulit',
    'Polymorphism: kelas Kucing meng-override method suara() dari Hewan. Objek $h bertipe Kucing, sehingga PHP memanggil method suara() milik Kucing (bukan Hewan). Output: "Meow". Ini adalah runtime polymorphism (method overriding).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','"..."',false),
    (s,'B','"Woof"',false),
    (s,'C','"Meow"',true),
    (s,'D','"MeowWoof"',false),
    (s,'E','Error karena method suara() sudah ada di parent class',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam PHP, keyword yang digunakan untuk memanggil constructor atau method dari parent class di dalam child class adalah...',
    'pg', 'sedang',
    'parent::__construct() memanggil constructor parent class dari child class. Ini penting untuk memastikan inisialisasi parent juga berjalan. Contoh: parent::__construct($nama) di class Guru extends Pegawai untuk menginisialisasi property $nama yang ada di Pegawai.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','super::__construct()',false),
    (s,'B','base::__construct()',false),
    (s,'C','this->parent()',false),
    (s,'D','parent::__construct()',true),
    (s,'E','extends::__construct()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan antara abstract class dan interface dalam PHP adalah...',
    'pg', 'sulit',
    'Abstract Class: bisa punya method konkret (implementasi) DAN abstract (harus di-override). Class hanya bisa extends SATU abstract class. Interface: SEMUA method harus diimplementasikan (tidak ada implementasi di interface). Class bisa implements BANYAK interface. Interface hanya bisa punya konstanta dan method signature.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Interface bisa punya method dengan implementasi, abstract class tidak bisa',false),
    (s,'B','Abstract class dan interface identik, hanya beda sintaks',false),
    (s,'C','Abstract class bisa punya method konkret; interface tidak. Class bisa implements banyak interface tapi hanya extends satu abstract class',true),
    (s,'D','Sebuah class bisa extends banyak abstract class tapi hanya implements satu interface',false),
    (s,'E','Interface digunakan untuk inheritance, abstract class untuk enkapsulasi',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah implementasi OOP PHP untuk sistem perpustakaan! Buat class Buku dengan: (a) property private: judul, pengarang, tahun, stok, (b) constructor untuk inisialisasi semua property, (c) getter dan setter untuk setiap property, (d) method pinjam() yang mengurangi stok (gagal jika stok 0), (e) method kembalikan() yang menambah stok, (f) method info() yang menampilkan semua info buku. Buat minimal 2 objek dan demonstrasikan semua method!',
    'essay', 'sulit',
    'Jawaban ideal:

<?php
class Buku {
    private string $judul;
    private string $pengarang;
    private int $tahun;
    private int $stok;

    public function __construct(string $judul, string $pengarang, int $tahun, int $stok) {
        $this->judul     = $judul;
        $this->pengarang = $pengarang;
        $this->tahun     = $tahun;
        $this->stok      = $stok;
    }

    public function getJudul(): string    { return $this->judul; }
    public function getPengarang(): string { return $this->pengarang; }
    public function getTahun(): int        { return $this->tahun; }
    public function getStok(): int         { return $this->stok; }
    public function setJudul(string $j)    { $this->judul = $j; }

    public function pinjam(): string {
        if ($this->stok <= 0) return "Stok habis, tidak bisa dipinjam!";
        $this->stok--;
        return "Buku berhasil dipinjam. Sisa stok: {$this->stok}";
    }

    public function kembalikan(): string {
        $this->stok++;
        return "Buku berhasil dikembalikan. Stok sekarang: {$this->stok}";
    }

    public function info(): string {
        return "Judul: {$this->judul} | Pengarang: {$this->pengarang} | Tahun: {$this->tahun} | Stok: {$this->stok}";
    }
}

$buku1 = new Buku("Clean Code", "Robert C. Martin", 2008, 3);
$buku2 = new Buku("PHP & MySQL", "Luke Welling", 2017, 1);

echo $buku1->info() . "\n";
echo $buku1->pinjam() . "\n";
echo $buku1->pinjam() . "\n";

echo $buku2->info() . "\n";
echo $buku2->pinjam() . "\n";
echo $buku2->pinjam() . "\n"; // stok habis
echo $buku2->kembalikan() . "\n";
?>

Nilai penuh: property private + constructor lengkap + getter/setter + pinjam dengan cek stok + kembalikan + info + 2 objek + demonstrasi semua method.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah hierarki class OOP PHP untuk sistem kepegawaian sekolah! Buat: (a) abstract class Pegawai dengan property nama, nip, gaji_pokok dan abstract method hitungGaji(), (b) class Guru extends Pegawai dengan tambahan property tunjangan_mengajar dan implementasi hitungGaji(), (c) class StafTU extends Pegawai dengan property uang_lembur dan implementasi hitungGaji(), (d) interface Printable dengan method cetakSlipGaji(), (e) kedua class implementasi interface Printable, (f) buat objek keduanya dan panggil cetakSlipGaji()!',
    'essay', 'sulit',
    'Jawaban ideal:

<?php
abstract class Pegawai {
    protected string $nama;
    protected string $nip;
    protected float $gaji_pokok;

    public function __construct(string $nama, string $nip, float $gaji_pokok) {
        $this->nama       = $nama;
        $this->nip        = $nip;
        $this->gaji_pokok = $gaji_pokok;
    }

    abstract public function hitungGaji(): float;

    public function getNama(): string { return $this->nama; }
    public function getNip(): string  { return $this->nip; }
}

interface Printable {
    public function cetakSlipGaji(): string;
}

class Guru extends Pegawai implements Printable {
    private float $tunjangan_mengajar;

    public function __construct(string $nama, string $nip, float $gaji_pokok, float $tunjangan) {
        parent::__construct($nama, $nip, $gaji_pokok);
        $this->tunjangan_mengajar = $tunjangan;
    }

    public function hitungGaji(): float {
        return $this->gaji_pokok + $this->tunjangan_mengajar;
    }

    public function cetakSlipGaji(): string {
        return "=== SLIP GAJI GURU ===\n"
             . "Nama  : {$this->nama}\n"
             . "NIP   : {$this->nip}\n"
             . "Pokok : Rp " . number_format($this->gaji_pokok) . "\n"
             . "Tunjangan: Rp " . number_format($this->tunjangan_mengajar) . "\n"
             . "TOTAL : Rp " . number_format($this->hitungGaji());
    }
}

class StafTU extends Pegawai implements Printable {
    private float $uang_lembur;

    public function __construct(string $nama, string $nip, float $gaji_pokok, float $lembur) {
        parent::__construct($nama, $nip, $gaji_pokok);
        $this->uang_lembur = $lembur;
    }

    public function hitungGaji(): float {
        return $this->gaji_pokok + $this->uang_lembur;
    }

    public function cetakSlipGaji(): string {
        return "=== SLIP GAJI STAF TU ===\n"
             . "Nama  : {$this->nama}\n"
             . "Pokok : Rp " . number_format($this->gaji_pokok) . "\n"
             . "Lembur: Rp " . number_format($this->uang_lembur) . "\n"
             . "TOTAL : Rp " . number_format($this->hitungGaji());
    }
}

$guru  = new Guru("Ibu Sari", "G001", 3500000, 1200000);
$staf  = new StafTU("Pak Budi", "S001", 2800000, 500000);

echo $guru->cetakSlipGaji() . "\n\n";
echo $staf->cetakSlipGaji() . "\n";
?>

Nilai penuh: abstract class Pegawai + abstract method hitungGaji + interface Printable + Guru extends + implements + parent::__construct + StafTU serupa + 2 objek + cetak slip.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 7, 25);

  RAISE NOTICE 'Seed berhasil: 1 kompetensi "Pemrograman Web" (tingkat=11, urutan=1), 5 tes, 35 soal (25 PG 5-opsi + 10 essay).';
END $$;
