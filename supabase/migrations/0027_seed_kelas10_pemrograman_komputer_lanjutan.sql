-- ============================================================
-- Seed: Roadmap Kompetensi Kelas X
-- 1 Kompetensi: Pemrograman Komputer Lanjutan (urutan 2)
-- 4 Tes Kompetensi (5 PG 5-opsi + 2 Essay per tes)
-- Jalankan di Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  v_jur uuid;

  k1 uuid; -- kompetensi

  t1 uuid; -- HTML5
  t2 uuid; -- CSS3
  t3 uuid; -- JavaScript Dasar
  t4 uuid; -- Version Control (Git/GitHub)

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
    'Pemrograman Komputer Lanjutan',
    'Membangun antarmuka web menggunakan HTML5, CSS3, JavaScript, serta mengelola kode dengan Git dan GitHub sebagai fondasi pengembangan web modern.',
    10, 2, 70, true)
  RETURNING id_kompetensi INTO k1;

  -- ----------------------------------------------------------
  -- 2. KOMPETENSI_TUGAS
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'HTML5',
    'Tes pemahaman struktur dokumen HTML5, tag semantik, form, dan elemen multimedia.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t1;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'CSS3',
    'Tes kemampuan styling menggunakan selector, box model, flexbox, grid, dan responsive design.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t2;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'JavaScript Dasar',
    'Tes pemahaman DOM manipulation, event handling, dan validasi form dengan JavaScript.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t3;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Version Control (Git & GitHub)',
    'Tes pemahaman Git untuk version control: commit, push, branching, dan kolaborasi via GitHub.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t4;

  -- ==========================================================
  -- TES 1: HTML5
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Tag HTML5 yang paling tepat digunakan untuk membungkus konten navigasi utama sebuah website adalah...',
    'pg', 'mudah',
    '<nav> adalah elemen semantik HTML5 yang secara khusus dirancang untuk menandai bagian navigasi. Penggunaan tag semantik membantu mesin pencari dan screen reader memahami struktur halaman.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','<menu>',false),
    (s,'B','<div id="nav">',false),
    (s,'C','<nav>',true),
    (s,'D','<navigation>',false),
    (s,'E','<header>',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Atribut HTML yang digunakan untuk mewajibkan sebuah field form diisi sebelum form dapat di-submit adalah...',
    'pg', 'mudah',
    'Atribut "required" pada elemen <input> atau <textarea> mewajibkan pengguna mengisi field tersebut. Browser akan menampilkan pesan error otomatis jika field kosong saat di-submit.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','mandatory',false),
    (s,'B','validate',false),
    (s,'C','necessary',false),
    (s,'D','required',true),
    (s,'E','compulsory',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan antara elemen <div> dan <section> dalam HTML5 adalah...',
    'pg', 'sedang',
    '<section> adalah elemen semantik yang menandai bagian konten bertema/bertopik tertentu. <div> adalah container generik tanpa makna semantik, hanya untuk keperluan styling/layout.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','<div> adalah elemen baru HTML5, <section> sudah ada sejak HTML4',false),
    (s,'B','<section> memiliki makna semantik (bagian bertema), <div> adalah container generik tanpa makna',true),
    (s,'C','<div> hanya bisa digunakan sekali per halaman, <section> bisa berkali-kali',false),
    (s,'D','Keduanya identik dan dapat digunakan secara bergantian',false),
    (s,'E','<section> tidak bisa diberi style CSS, <div> bisa',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Kode HTML berikut akan menampilkan apa?
<a href="https://google.com" target="_blank">Cari di sini</a>',
    'pg', 'mudah',
    'target="_blank" membuat link terbuka di tab/jendela baru. Teks yang ditampilkan adalah konten di antara tag <a> yaitu "Cari di sini".')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Teks "https://google.com" yang bisa diklik dan membuka di tab yang sama',false),
    (s,'B','Tombol berlabel "Cari di sini" yang mengirim form',false),
    (s,'C','Teks "Cari di sini" yang bisa diklik dan membuka Google di tab baru',true),
    (s,'D','Gambar dengan alt text "Cari di sini"',false),
    (s,'E','Teks "target="_blank"" yang ditampilkan apa adanya',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Elemen HTML5 yang paling tepat untuk menampilkan konten artikel berita mandiri yang dapat berdiri sendiri (seperti posting blog) adalah...',
    'pg', 'sedang',
    '<article> digunakan untuk konten mandiri yang dapat didistribusikan secara independen, seperti artikel berita atau posting blog. Berbeda dengan <section> yang hanya membagi halaman menjadi bagian-bagian.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','<content>',false),
    (s,'B','<post>',false),
    (s,'C','<main>',false),
    (s,'D','<section>',false),
    (s,'E','<article>',true);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan konsep "HTML Semantik" dan mengapa penggunaannya penting! Sebutkan minimal 5 tag semantik HTML5 beserta fungsi masing-masing dan contoh penggunaannya yang tepat!',
    'essay', 'sedang',
    'Jawaban ideal:
HTML Semantik = penggunaan tag HTML yang memiliki makna/arti terhadap konten yang dibungkusnya, bukan sekadar untuk tampilan visual.

Pentingnya: (1) Membantu mesin pencari (SEO) memahami struktur konten, (2) Meningkatkan aksesibilitas untuk screen reader, (3) Kode lebih mudah dibaca dan dirawat oleh developer.

Minimal 5 tag semantik:
- <header> → kepala halaman/section (logo, judul, navbar)
- <nav> → blok navigasi (menu utama, breadcrumb)
- <main> → konten utama halaman (hanya 1 per halaman)
- <article> → konten mandiri (posting blog, berita)
- <section> → bagian bertema dalam halaman
- <aside> → konten sampingan (sidebar, iklan terkait)
- <footer> → kaki halaman (copyright, kontak, link sosial)
- <figure>/<figcaption> → gambar dengan keterangan

Nilai penuh: definisi semantik + alasan pentingnya (min 2) + 5 tag dengan fungsi dan contoh benar.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah struktur HTML5 lengkap untuk halaman "Profil Siswa" yang mencakup: (a) bagian header dengan nama dan foto profil, (b) bagian navigasi dengan minimal 3 menu, (c) bagian konten utama berisi biodata (nama, NISN, kelas, alamat), (d) form untuk memperbarui email dan nomor HP, (e) footer. Tuliskan kodenya dengan tag semantik yang tepat!',
    'essay', 'sulit',
    'Jawaban ideal (struktur minimal):
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Profil Siswa</title>
</head>
<body>
  <header>
    <img src="foto.jpg" alt="Foto Profil">
    <h1>Nama Siswa</h1>
  </header>
  <nav>
    <ul>
      <li><a href="#profil">Profil</a></li>
      <li><a href="#nilai">Nilai</a></li>
      <li><a href="#absensi">Absensi</a></li>
    </ul>
  </nav>
  <main>
    <section id="profil">
      <h2>Biodata</h2>
      <p>Nama: ...</p><p>NISN: ...</p><p>Kelas: ...</p><p>Alamat: ...</p>
    </section>
    <section id="update">
      <h2>Perbarui Kontak</h2>
      <form>
        <label>Email: <input type="email" name="email" required></label>
        <label>No HP: <input type="tel" name="hp" required></label>
        <button type="submit">Simpan</button>
      </form>
    </section>
  </main>
  <footer><p>&copy; 2024 Portal Sekolah</p></footer>
</body>
</html>

Nilai penuh: DOCTYPE + html/head/body benar + semua 5 bagian ada + tag semantik tepat + form dengan input type yang sesuai.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 7, 25);

  -- ==========================================================
  -- TES 2: CSS3
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Property CSS yang digunakan untuk membuat layout dua dimensi (baris DAN kolom secara bersamaan) adalah...',
    'pg', 'sedang',
    'CSS Grid adalah sistem layout dua dimensi yang mengatur elemen dalam baris (row) dan kolom (column) sekaligus. Flexbox adalah sistem satu dimensi (baris ATAU kolom).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','display: flex',false),
    (s,'B','display: block',false),
    (s,'C','display: inline-flex',false),
    (s,'D','display: grid',true),
    (s,'E','display: table',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Urutan box model CSS dari dalam ke luar yang benar adalah...',
    'pg', 'mudah',
    'Box model CSS terdiri dari: content (isi) → padding (ruang dalam antara content dan border) → border (garis tepi) → margin (ruang luar antara elemen dengan elemen lain).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','margin → border → padding → content',false),
    (s,'B','content → border → padding → margin',false),
    (s,'C','content → padding → border → margin',true),
    (s,'D','padding → content → border → margin',false),
    (s,'E','border → padding → content → margin',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Media query CSS berikut "@media (max-width: 768px) { ... }" akan mengaktifkan style tersebut ketika...',
    'pg', 'mudah',
    'max-width: 768px berarti kondisi terpenuhi saat lebar viewport maksimal 768px atau kurang, yaitu pada ukuran layar tablet dan smartphone (mobile/tablet view).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Lebar layar minimal 768px ke atas (layar desktop)',false),
    (s,'B','Lebar layar persis 768px saja',false),
    (s,'C','Lebar layar maksimal 768px (layar tablet dan smartphone)',true),
    (s,'D','Tinggi layar maksimal 768px',false),
    (s,'E','Semua ukuran layar tanpa terkecuali',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Property Flexbox yang digunakan untuk mengatur perataan item secara horizontal (pada main axis ketika flex-direction: row) adalah...',
    'pg', 'sedang',
    'justify-content mengontrol distribusi item pada main axis (horizontal jika flex-direction: row). Nilainya: flex-start, flex-end, center, space-between, space-around, space-evenly.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','align-items',false),
    (s,'B','align-content',false),
    (s,'C','flex-wrap',false),
    (s,'D','justify-content',true),
    (s,'E','flex-direction',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Selector CSS ".container > p" akan memilih elemen...',
    'pg', 'sulit',
    'Selector ">" adalah child combinator yang memilih elemen <p> yang merupakan anak LANGSUNG dari elemen dengan class "container". Berbeda dengan ".container p" (descendant) yang memilih semua <p> di dalam .container termasuk yang bertingkat.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Semua elemen <p> di dalam .container, termasuk yang bersarang di dalam elemen lain',false),
    (s,'B','Elemen <p> pertama saja di dalam .container',false),
    (s,'C','Semua elemen <p> yang berada tepat satu level di bawah .container (anak langsung)',true),
    (s,'D','Elemen .container yang berada di dalam <p>',false),
    (s,'E','Elemen <p> yang memiliki class "container"',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan konsep "Responsive Web Design (RWD)" dan cara mengimplementasikannya menggunakan CSS! Sebutkan minimal 3 teknik CSS yang digunakan dalam membuat website responsif, lengkap dengan contoh kodenya!',
    'essay', 'sedang',
    'Jawaban ideal:
Responsive Web Design = pendekatan desain web agar tampilan menyesuaikan diri secara otomatis dengan ukuran layar perangkat (desktop, tablet, smartphone).

Teknik CSS untuk RWD:

1. Media Query — menerapkan style berbeda berdasarkan ukuran layar:
@media (max-width: 768px) { .container { flex-direction: column; } }

2. Flexible Grid (Flexbox/Grid):
.container { display: flex; flex-wrap: wrap; }
.item { flex: 1 1 300px; }

3. Relative Units — menggunakan %, vw, vh, rem, em daripada px:
.hero { width: 100%; height: 100vh; font-size: 1.5rem; }

4. Viewport Meta Tag (di HTML):
<meta name="viewport" content="width=device-width, initial-scale=1.0">

5. Gambar responsif: img { max-width: 100%; height: auto; }

Nilai penuh: definisi RWD benar + min 3 teknik dengan kode contoh yang tepat.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah CSS untuk membuat layout halaman portofolio sederhana menggunakan Flexbox dengan ketentuan: (a) navbar horizontal dengan logo di kiri dan menu di kanan, (b) section hero terpusat secara vertikal dan horizontal, (c) section kartu portofolio dengan 3 kolom yang berubah menjadi 1 kolom saat layar ≤ 600px.',
    'essay', 'sulit',
    'Jawaban ideal:
/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}
.nav-menu { display: flex; gap: 1rem; list-style: none; }

/* Hero */
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
}

/* Portofolio Grid */
.portfolio {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 2rem;
}
.card { flex: 1 1 calc(33.333% - 1rem); }

/* Responsive */
@media (max-width: 600px) {
  .nav-menu { display: none; } /* atau hamburger */
  .card { flex: 1 1 100%; }
}

Nilai penuh: navbar flex space-between + hero flex center + card 3 kolom flex + media query untuk 1 kolom.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 7, 25);

  -- ==========================================================
  -- TES 3: JAVASCRIPT DASAR
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Method JavaScript yang digunakan untuk memilih elemen HTML berdasarkan ID-nya adalah...',
    'pg', 'mudah',
    'document.getElementById("id") mengembalikan elemen tunggal berdasarkan atribut id. querySelector("#id") juga bisa, tapi getElementById adalah cara khusus untuk ID.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','document.getElement("id-nama")',false),
    (s,'B','document.selectById("id-nama")',false),
    (s,'C','document.getElementById("id-nama")',true),
    (s,'D','document.findById("id-nama")',false),
    (s,'E','document.querySelector(".id-nama")',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perhatikan kode berikut:
document.getElementById("tombol").addEventListener("click", function() {
  alert("Halo!");
});
Apa yang terjadi ketika elemen dengan id "tombol" diklik?',
    'pg', 'mudah',
    'addEventListener("click", ...) mendaftarkan event listener untuk event klik. Ketika elemen diklik, fungsi callback dieksekusi dan menampilkan dialog alert dengan teks "Halo!".')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Halaman langsung berpindah ke URL baru',false),
    (s,'B','Elemen "tombol" berubah warna',false),
    (s,'C','Muncul kotak dialog dengan tulisan "Halo!"',true),
    (s,'D','Teks "Halo!" dicetak di console',false),
    (s,'E','Elemen "tombol" terhapus dari halaman',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Apa output dari kode JavaScript berikut?
let x = "5";
let y = 3;
console.log(x + y);',
    'pg', 'sedang',
    'Operator + dengan string dan number melakukan konkatenasi string, bukan penjumlahan. "5" + 3 = "53" (string). Ini disebut type coercion di JavaScript.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','8 (angka hasil penjumlahan)',false),
    (s,'B','Error karena tipe data berbeda',false),
    (s,'C','"53" (konkatenasi string)',true),
    (s,'D','NaN (Not a Number)',false),
    (s,'E','"5+3" (literal string)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Cara yang benar untuk mengubah isi teks sebuah elemen HTML dengan id="judul" menggunakan JavaScript adalah...',
    'pg', 'sedang',
    'innerHTML atau innerText/textContent digunakan untuk mengubah isi elemen. innerHTML bisa mengandung tag HTML, textContent hanya teks biasa.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','document.judul.text = "Teks Baru"',false),
    (s,'B','document.getElementById("judul").value = "Teks Baru"',false),
    (s,'C','document.getElementById("judul").innerHTML = "Teks Baru"',true),
    (s,'D','document.changeText("judul", "Teks Baru")',false),
    (s,'E','$("#judul").html("Teks Baru")',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Fungsi document.querySelector(".kartu") akan mengembalikan...',
    'pg', 'sedang',
    'querySelector mengembalikan elemen PERTAMA yang cocok dengan selector CSS yang diberikan. Untuk mengambil semua elemen, gunakan querySelectorAll yang mengembalikan NodeList.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Semua elemen yang memiliki class "kartu" sebagai array',false),
    (s,'B','Elemen pertama yang memiliki id "kartu"',false),
    (s,'C','Elemen pertama yang memiliki class "kartu"',true),
    (s,'D','Semua elemen <kartu> sebagai NodeList',false),
    (s,'E','Jumlah elemen yang memiliki class "kartu"',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan apa yang dimaksud dengan DOM (Document Object Model) dalam JavaScript! Kemudian tuliskan kode JavaScript untuk: (a) mengubah warna background elemen dengan id="kotak" menjadi merah saat diklik, (b) menampilkan teks yang diketik pengguna di input#nama secara real-time di sebuah <p id="preview">.',
    'essay', 'sedang',
    'Jawaban ideal:
DOM = representasi objek dari dokumen HTML dalam bentuk pohon (tree) yang dapat dimanipulasi oleh JavaScript. Setiap elemen HTML menjadi node dalam pohon DOM.

(a) Ubah background saat klik:
const kotak = document.getElementById("kotak");
kotak.addEventListener("click", function() {
  kotak.style.backgroundColor = "red";
});

(b) Preview real-time:
const inputNama = document.getElementById("nama");
const preview = document.getElementById("preview");
inputNama.addEventListener("input", function() {
  preview.textContent = inputNama.value;
});
// atau: inputNama.oninput = () => preview.textContent = this.value;

Nilai penuh: definisi DOM benar + kode (a) addEventListener click + style + kode (b) addEventListener input + textContent/innerHTML.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah kode JavaScript untuk memvalidasi form pendaftaran dengan aturan berikut sebelum form di-submit:
(a) Field nama tidak boleh kosong
(b) Field email harus mengandung karakter "@" dan "."
(c) Field password minimal 8 karakter
(d) Jika ada yang tidak valid, tampilkan pesan error spesifik dan HENTIKAN pengiriman form',
    'essay', 'sulit',
    'Jawaban ideal:
document.getElementById("formDaftar").addEventListener("submit", function(e) {
  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  let valid = true;

  if (nama === "") {
    document.getElementById("errorNama").textContent = "Nama tidak boleh kosong!";
    valid = false;
  } else { document.getElementById("errorNama").textContent = ""; }

  if (!email.includes("@") || !email.includes(".")) {
    document.getElementById("errorEmail").textContent = "Format email tidak valid!";
    valid = false;
  } else { document.getElementById("errorEmail").textContent = ""; }

  if (password.length < 8) {
    document.getElementById("errorPassword").textContent = "Password minimal 8 karakter!";
    valid = false;
  } else { document.getElementById("errorPassword").textContent = ""; }

  if (!valid) e.preventDefault(); // hentikan submit
});

Nilai penuh: event submit + e.preventDefault() + validasi 3 field + pesan error spesifik per field.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 7, 25);

  -- ==========================================================
  -- TES 4: VERSION CONTROL (GIT & GITHUB)
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perintah Git yang digunakan untuk menyimpan perubahan ke repository lokal disertai pesan deskripsi adalah...',
    'pg', 'mudah',
    'git commit -m "pesan" menyimpan snapshot perubahan yang sudah di-staging area ke repository lokal dengan pesan commit yang mendeskripsikan perubahan tersebut.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','git push -m "pesan"',false),
    (s,'B','git add -m "pesan"',false),
    (s,'C','git save -m "pesan"',false),
    (s,'D','git commit -m "pesan"',true),
    (s,'E','git store -m "pesan"',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Urutan perintah Git yang BENAR untuk mengunggah file baru ke repository GitHub adalah...',
    'pg', 'sedang',
    'Alur Git: (1) git add — masukkan file ke staging area, (2) git commit — simpan ke repository lokal, (3) git push — unggah ke repository remote (GitHub).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','git push → git commit → git add',false),
    (s,'B','git commit → git add → git push',false),
    (s,'C','git add → git push → git commit',false),
    (s,'D','git add → git commit → git push',true),
    (s,'E','git init → git push → git commit',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Apa fungsi dari file ".gitignore" dalam sebuah repository Git?',
    'pg', 'sedang',
    '.gitignore berisi daftar pola file/folder yang tidak ingin dilacak oleh Git (misalnya node_modules/, .env, *.log). File-file ini tidak akan masuk ke staging area meskipun ada perubahan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Menyimpan konfigurasi akun GitHub',false),
    (s,'B','Mendaftarkan file/folder yang tidak ingin dilacak oleh Git',true),
    (s,'C','Mengamankan repository dari akses publik',false),
    (s,'D','Menyimpan riwayat seluruh commit',false),
    (s,'E','Mengatur izin siapa saja yang boleh push ke repository',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perintah "git clone https://github.com/user/repo.git" berfungsi untuk...',
    'pg', 'mudah',
    'git clone menyalin seluruh repository dari remote (GitHub) ke komputer lokal, termasuk semua file, riwayat commit, dan branch.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Membuat branch baru dari repository yang sudah ada',false),
    (s,'B','Menggabungkan dua branch menjadi satu',false),
    (s,'C','Menyalin seluruh repository dari GitHub ke komputer lokal',true),
    (s,'D','Menghapus repository dari GitHub',false),
    (s,'E','Memperbarui repository lokal dengan perubahan terbaru dari remote',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam alur kerja Git dengan branching, perintah yang digunakan untuk membuat branch baru sekaligus langsung berpindah ke branch tersebut adalah...',
    'pg', 'sulit',
    'git checkout -b nama-branch membuat branch baru DAN langsung berpindah ke branch itu dalam satu perintah. Alternatif modern: git switch -c nama-branch.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','git branch nama-branch',false),
    (s,'B','git new nama-branch',false),
    (s,'C','git checkout nama-branch',false),
    (s,'D','git checkout -b nama-branch',true),
    (s,'E','git create nama-branch',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan konsep version control dan mengapa Git penting bagi seorang developer! Kemudian jelaskan perbedaan antara "git add", "git commit", dan "git push" beserta kapan masing-masing digunakan dalam alur kerja sehari-hari!',
    'essay', 'sedang',
    'Jawaban ideal:
Version control = sistem yang mencatat setiap perubahan pada file/kode dari waktu ke waktu sehingga developer dapat melihat riwayat, membandingkan versi, dan mengembalikan ke versi sebelumnya.

Pentingnya Git: (1) Melacak riwayat perubahan kode, (2) Kolaborasi tim tanpa konflik, (3) Bisa kembali ke versi sebelumnya jika ada bug, (4) Branching untuk fitur baru tanpa merusak kode utama.

git add: memindahkan file dari working directory ke staging area (memilih file yang akan di-commit). Contoh: git add index.html atau git add .

git commit: menyimpan snapshot staging area ke repository lokal dengan pesan deskripsi. Contoh: git commit -m "tambah halaman login"

git push: mengunggah commit dari repository lokal ke repository remote (GitHub). Contoh: git push origin main

Analogi: add = memasukkan ke keranjang belanja, commit = membayar di kasir, push = mengirim ke gudang pusat.

Nilai penuh: definisi version control + alasan pentingnya Git (min 2) + penjelasan add/commit/push yang benar dengan contoh.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Kamu dan temanmu berkolaborasi membuat website portofolio menggunakan Git dan GitHub. Jelaskan alur kerja kolaborasi yang benar menggunakan branching strategy, mulai dari: (a) masing-masing mengambil salinan repository, (b) membuat fitur baru di branch terpisah, (c) menggabungkan pekerjaan kalian, (d) menangani konflik jika ada perubahan di file yang sama!',
    'essay', 'sulit',
    'Jawaban ideal:
(a) Clone & setup:
- Temanmu: git clone <url-repo>
- Kamu: git clone <url-repo> (atau fork jika bukan collaborator)

(b) Buat branch untuk fitur:
git checkout -b fitur/navbar     # kamu kerjakan navbar
git checkout -b fitur/hero-section  # temanmu kerjakan hero
# Kerjakan, lalu:
git add . && git commit -m "selesai navbar"
git push origin fitur/navbar

(c) Merge ke main via Pull Request di GitHub:
- Buka GitHub → Pull Request → pilih branch → Review → Merge
- Atau lokal: git checkout main → git merge fitur/navbar → git push

(d) Tangani konflik:
- git pull origin main (untuk update lokal)
- Jika konflik: Git menandai file dengan <<<, ===, >>>
- Edit file → pilih/gabungkan perubahan → hapus marker konflik
- git add file-konflik → git commit → git push

Nilai penuh: clone/fork (a) + branching (b) dengan perintah benar + merge/PR (c) + cara resolve conflict (d).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 7, 25);

  RAISE NOTICE 'Seed berhasil: 1 kompetensi "Pemrograman Komputer Lanjutan" (urutan 2), 4 tes, 28 soal (20 PG 5-opsi + 8 essay).';
END $$;
