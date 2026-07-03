-- ============================================================
-- Seed: Roadmap Kompetensi Kelas XI
-- 1 Kompetensi: Basis Data Lanjutan (urutan 2, mapel sama dengan Basis Data)
-- 6 Tes Kompetensi (5 PG 5-opsi + 2 Essay per tes)
-- Jalankan di Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  v_jur uuid;

  k1 uuid; -- kompetensi

  t1 uuid; -- Indexing & Optimasi Dasar
  t2 uuid; -- Integrasi PHP-MySQL
  t3 uuid; -- Keamanan Data Dasar
  t4 uuid; -- Migration & Seeder (Laravel)
  t5 uuid; -- Eloquent ORM
  t6 uuid; -- Query Builder Lanjutan

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
    'Basis Data Lanjutan',
    'Pendalaman basis data meliputi optimasi query dengan indexing, integrasi PHP-MySQL, keamanan data, serta pengelolaan database modern menggunakan Laravel: migration, seeder, Eloquent ORM, dan Query Builder.',
    11, 2, 70, true)
  RETURNING id_kompetensi INTO k1;

  -- ----------------------------------------------------------
  -- KOMPETENSI_TUGAS
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Indexing & Optimasi Dasar',
    'Tes pemahaman konsep index database, jenis-jenis index, EXPLAIN query, dan teknik optimasi query SQL.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t1;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Integrasi PHP-MySQL',
    'Tes kemampuan menghubungkan PHP dengan MySQL menggunakan PDO, prepared statement, dan transaksi database.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t2;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Keamanan Data Dasar',
    'Tes pemahaman SQL Injection, XSS dalam konteks database, enkripsi password, dan praktik keamanan data.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t3;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Migration & Seeder (Laravel)',
    'Tes kemampuan membuat dan menjalankan migration serta seeder untuk pengelolaan skema dan data awal database di Laravel.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t4;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Eloquent ORM',
    'Tes pemahaman dan penggunaan Eloquent ORM Laravel: model, relasi (hasOne, hasMany, belongsTo, belongsToMany), dan operasi CRUD via model.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t5;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Query Builder Lanjutan',
    'Tes kemampuan menggunakan Laravel Query Builder untuk query kompleks: join, agregasi, subquery, dan raw expression.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t6;

  -- ==========================================================
  -- TES 1: INDEXING & OPTIMASI DASAR
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Apa fungsi utama INDEX dalam database?',
    'pg', 'mudah',
    'Index adalah struktur data tambahan yang mempercepat pencarian/pencarian data tanpa harus melakukan full table scan (membaca seluruh baris). Trade-off: mempercepat SELECT tapi sedikit memperlambat INSERT/UPDATE/DELETE karena index harus diperbarui.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Mengenkripsi data agar tidak bisa dibaca sembarangan',false),
    (s,'B','Mempercepat pencarian data dengan menghindari full table scan',true),
    (s,'C','Membuat backup otomatis setiap tabel',false),
    (s,'D','Mengompresi data agar tabel lebih kecil',false),
    (s,'E','Mengurutkan data secara otomatis setiap ada INSERT',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perintah SQL untuk melihat rencana eksekusi query (apakah menggunakan index atau full scan) adalah...',
    'pg', 'sedang',
    'EXPLAIN (atau EXPLAIN ANALYZE di PostgreSQL) menampilkan execution plan: jenis scan (index scan/full scan), estimasi baris, biaya. Ini alat utama untuk mengidentifikasi query lambat dan memastikan index digunakan dengan benar.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','DESCRIBE query',false),
    (s,'B','ANALYZE query',false),
    (s,'C','SHOW PLAN query',false),
    (s,'D','EXPLAIN query',true),
    (s,'E','DEBUG query',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Index yang dibuat secara otomatis oleh database pada kolom PRIMARY KEY disebut...',
    'pg', 'mudah',
    'Clustered Index (atau Primary Index) dibuat otomatis pada PRIMARY KEY. Data fisik tabel disusun berdasarkan urutan primary key. Setiap tabel hanya bisa punya satu clustered index. Non-clustered index adalah index tambahan yang kita buat manual pada kolom lain.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Secondary Index',false),
    (s,'B','Composite Index',false),
    (s,'C','Full-Text Index',false),
    (s,'D','Unique Index',false),
    (s,'E','Clustered Index (Primary Index)',true);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dari dua query berikut, manakah yang lebih optimal untuk mencari siswa bernama "Andi"?
A: SELECT * FROM siswa WHERE UPPER(nama) = ''ANDI''
B: SELECT * FROM siswa WHERE nama = ''Andi''',
    'pg', 'sulit',
    'Query B lebih optimal karena tidak membungkus kolom dengan fungsi (UPPER()). Saat kolom dibungkus fungsi, database tidak bisa menggunakan index pada kolom nama dan terpaksa full table scan. Query B bisa memanfaatkan index jika ada index pada kolom nama.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Query A lebih optimal karena UPPER() memastikan case-insensitive',false),
    (s,'B','Keduanya sama persis performanya',false),
    (s,'C','Query B lebih optimal karena tidak membungkus kolom dengan fungsi sehingga index bisa digunakan',true),
    (s,'D','Query A lebih optimal karena membandingkan huruf kapital lebih cepat',false),
    (s,'E','Tidak bisa ditentukan tanpa melihat jumlah data',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Kapan sebaiknya TIDAK membuat index pada sebuah kolom?',
    'pg', 'sedang',
    'Index tidak efisien pada: (1) kolom dengan kardinalitas rendah (sedikit nilai unik) seperti kolom jenis_kelamin (hanya L/P) — database lebih cepat full scan, (2) tabel sangat kecil, (3) kolom yang sangat sering di-UPDATE. Index hanya efektif jika nilai uniknya banyak.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Kolom yang sering digunakan di klausa WHERE',false),
    (s,'B','Kolom yang digunakan sebagai foreign key',false),
    (s,'C','Kolom yang sering di-JOIN dengan tabel lain',false),
    (s,'D','Kolom dengan kardinalitas rendah (sedikit nilai unik, seperti jenis_kelamin)',true),
    (s,'E','Kolom yang digunakan di klausa ORDER BY',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Sebuah aplikasi sekolah memiliki tabel NILAI(id, nisn, id_mapel, semester, nilai_akhir) dengan 50.000 baris data. Query berikut sangat lambat:
SELECT * FROM nilai WHERE nisn = ''0012345678'' AND semester = ''Ganjil'';
Jelaskan: (a) mengapa query ini lambat, (b) bagaimana cara mengidentifikasi masalahnya menggunakan EXPLAIN, (c) solusi indexing yang tepat beserta perintah SQL-nya, (d) apa trade-off dari solusi yang kamu usulkan!',
    'essay', 'sulit',
    'Jawaban ideal:

(a) Mengapa lambat:
Tanpa index pada kolom nisn dan semester, database harus melakukan FULL TABLE SCAN — membaca semua 50.000 baris satu per satu untuk menemukan yang cocok. Semakin banyak data, semakin lambat.

(b) Identifikasi dengan EXPLAIN:
EXPLAIN SELECT * FROM nilai WHERE nisn = ''0012345678'' AND semester = ''Ganjil'';
Output akan menunjukkan: type = ALL (full scan), rows = ~50000 (perkiraan baris dibaca), key = NULL (tidak ada index digunakan). Ini tanda index diperlukan.

(c) Solusi indexing:
-- Index tunggal pada nisn (paling sering difilter):
CREATE INDEX idx_nilai_nisn ON nilai(nisn);

-- Atau composite index untuk kedua kolom:
CREATE INDEX idx_nilai_nisn_semester ON nilai(nisn, semester);

Composite index lebih optimal untuk query yang memfilter KEDUA kolom sekaligus. Urutan kolom penting: taruh kolom dengan selektivitas tinggi (nisn) di depan.

(d) Trade-off:
+ Query SELECT jauh lebih cepat (dari O(n) ke O(log n))
- INSERT/UPDATE/DELETE sedikit lebih lambat karena index harus diperbarui
- Membutuhkan ruang penyimpanan tambahan
- Terlalu banyak index memperlambat write operations

Nilai penuh: penjelasan full scan (a) + penggunaan EXPLAIN dengan interpretasi (b) + CREATE INDEX benar (c) + trade-off disebutkan (d).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara Composite Index dan Single Column Index! Kapan sebaiknya menggunakan masing-masing? Kemudian buatlah contoh kasus tabel TRANSAKSI(id, id_pelanggan, id_produk, tanggal, status, total) dan tentukan index mana yang paling tepat untuk mengoptimalkan query: (a) cari transaksi berdasarkan id_pelanggan saja, (b) cari transaksi berdasarkan id_pelanggan DAN status, (c) cari transaksi dalam rentang tanggal tertentu!',
    'essay', 'sedang',
    'Jawaban ideal:

Single Column Index: index pada satu kolom. Efektif untuk query yang memfilter satu kolom saja.
Composite Index: index pada beberapa kolom sekaligus. Efektif untuk query yang sering memfilter kombinasi kolom tersebut. Penting: urutan kolom sangat menentukan efektivitas (leftmost prefix rule).

Kasus tabel TRANSAKSI:

(a) Cari berdasarkan id_pelanggan saja:
CREATE INDEX idx_pelanggan ON transaksi(id_pelanggan);
→ Single column index cukup karena hanya satu kolom filter.

(b) Cari berdasarkan id_pelanggan DAN status:
CREATE INDEX idx_pelanggan_status ON transaksi(id_pelanggan, status);
→ Composite index. id_pelanggan di depan karena kardinalitasnya lebih tinggi.
→ Index ini juga bisa digunakan untuk query (a) saja (leftmost prefix).

(c) Cari berdasarkan rentang tanggal:
CREATE INDEX idx_tanggal ON transaksi(tanggal);
→ Single column index pada kolom tanggal. Range query (BETWEEN, >, <) dapat menggunakan index B-tree.

Catatan: jika query (b) sering dijalankan dengan tambahan filter tanggal, pertimbangkan:
CREATE INDEX idx_pelanggan_status_tanggal ON transaksi(id_pelanggan, status, tanggal);

Nilai penuh: perbedaan single vs composite + leftmost prefix rule + pilihan index yang tepat untuk 3 kasus + penjelasan alasan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 7, 25);

  -- ==========================================================
  -- TES 2: INTEGRASI PHP-MYSQL
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam PDO, method yang digunakan untuk memulai sebuah transaksi database adalah...',
    'pg', 'mudah',
    'Alur transaksi PDO: $pdo->beginTransaction() → eksekusi query → $pdo->commit() (jika sukses) atau $pdo->rollBack() (jika gagal). beginTransaction() menonaktifkan auto-commit sehingga perubahan belum tersimpan sampai commit() dipanggil.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','$pdo->startTransaction()',false),
    (s,'B','$pdo->openTransaction()',false),
    (s,'C','$pdo->beginTransaction()',true),
    (s,'D','$pdo->newTransaction()',false),
    (s,'E','$pdo->initTransaction()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perhatikan kode PDO berikut:
$stmt = $pdo->prepare("SELECT * FROM siswa WHERE kelas = ?");
$stmt->execute([$kelas]);
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

Konstanta PDO::FETCH_ASSOC berarti hasil fetch dikembalikan sebagai...',
    'pg', 'sedang',
    'PDO::FETCH_ASSOC = array asosiatif dengan nama kolom sebagai key. PDO::FETCH_NUM = array numerik (index 0,1,2...). PDO::FETCH_BOTH = keduanya (default). PDO::FETCH_OBJ = objek. PDO::FETCH_CLASS = objek dari class tertentu.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Array numerik dengan index 0, 1, 2, ...',false),
    (s,'B','Array asosiatif dengan nama kolom sebagai key',true),
    (s,'C','Objek stdClass dengan properti sesuai nama kolom',false),
    (s,'D','String JSON dari seluruh hasil query',false),
    (s,'E','Array berisi array numerik dan asosiatif sekaligus',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam transaksi database, jika terjadi error di tengah proses transfer saldo antara dua rekening, perintah yang harus dipanggil untuk membatalkan semua perubahan yang sudah terjadi adalah...',
    'pg', 'mudah',
    'rollBack() membatalkan semua perubahan yang terjadi sejak beginTransaction() dipanggil. Ini memastikan sifat Atomicity dari ACID — jika transfer gagal di tengah jalan, saldo tidak berkurang dari rekening pengirim tanpa bertambah di penerima.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','$pdo->cancel()',false),
    (s,'B','$pdo->undo()',false),
    (s,'C','$pdo->revert()',false),
    (s,'D','$pdo->rollBack()',true),
    (s,'E','$pdo->abort()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Method PDO untuk mengambil ID dari baris terakhir yang berhasil di-INSERT adalah...',
    'pg', 'sedang',
    '$pdo->lastInsertId() mengembalikan ID auto-increment dari INSERT terakhir. Sangat berguna saat perlu langsung menggunakan ID baru tersebut untuk menyimpan relasi di tabel lain (misalnya setelah insert header pesanan, ambil id-nya untuk insert detail pesanan).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','$pdo->getInsertId()',false),
    (s,'B','$pdo->lastInsertId()',true),
    (s,'C','$pdo->newRowId()',false),
    (s,'D','$stmt->insertedId()',false),
    (s,'E','$pdo->rowCount()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Atribut PDO yang diset agar PDO melempar exception saat terjadi error database (bukan diam-diam gagal) adalah...',
    'pg', 'sedang',
    'PDO::ATTR_ERRMODE dengan nilai PDO::ERRMODE_EXCEPTION membuat PDO melempar PDOException saat error. Ini best practice karena memaksa kita menangani error dengan try-catch. Alternatif: ERRMODE_SILENT (default, diam) dan ERRMODE_WARNING (hanya warning).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC',false),
    (s,'B','PDO::ATTR_EMULATE_PREPARES => false',false),
    (s,'C','PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION',true),
    (s,'D','PDO::ATTR_PERSISTENT => true',false),
    (s,'E','PDO::ATTR_TIMEOUT => 30',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah kode PHP menggunakan PDO untuk fitur "Transfer Saldo" antar dua akun tabungan siswa! Kode harus: (a) menggunakan transaksi database (beginTransaction/commit/rollBack), (b) memastikan saldo pengirim cukup sebelum transfer, (c) mengurangi saldo pengirim DAN menambah saldo penerima dalam satu transaksi, (d) menangani error dengan try-catch, (e) mencatat log transaksi ke tabel log_transaksi!',
    'essay', 'sulit',
    'Jawaban ideal:

<?php
function transferSaldo(PDO $pdo, int $idPengirim, int $idPenerima, float $jumlah): array {
    try {
        $pdo->beginTransaction();

        // Ambil saldo pengirim dengan LOCK FOR UPDATE
        $stmt = $pdo->prepare("SELECT saldo FROM tabungan WHERE id = ? FOR UPDATE");
        $stmt->execute([$idPengirim]);
        $pengirim = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$pengirim) throw new Exception("Akun pengirim tidak ditemukan.");
        if ($pengirim["saldo"] < $jumlah) throw new Exception("Saldo tidak mencukupi.");

        // Kurangi saldo pengirim
        $stmt = $pdo->prepare("UPDATE tabungan SET saldo = saldo - ? WHERE id = ?");
        $stmt->execute([$jumlah, $idPengirim]);

        // Tambah saldo penerima
        $stmt = $pdo->prepare("UPDATE tabungan SET saldo = saldo + ? WHERE id = ?");
        $stmt->execute([$jumlah, $idPenerima]);

        // Catat log transaksi
        $stmt = $pdo->prepare(
            "INSERT INTO log_transaksi (id_pengirim, id_penerima, jumlah, status, created_at)
             VALUES (?, ?, ?, ''sukses'', NOW())"
        );
        $stmt->execute([$idPengirim, $idPenerima, $jumlah]);

        $pdo->commit();
        return ["success" => true, "message" => "Transfer Rp " . number_format($jumlah) . " berhasil."];

    } catch (Exception $e) {
        $pdo->rollBack();
        // Catat log gagal (tanpa transaksi agar tidak ikut rollback)
        return ["success" => false, "message" => "Transfer gagal: " . $e->getMessage()];
    }
}
?>

Nilai penuh: beginTransaction + cek saldo dengan lock + UPDATE kurangi + UPDATE tambah + INSERT log + commit + catch rollBack + return message.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara named placeholder (:nama) dan positional placeholder (?) dalam PDO Prepared Statement! Kapan sebaiknya menggunakan masing-masing? Buatlah contoh fungsi PHP dengan PDO untuk: mencari siswa berdasarkan kombinasi filter opsional (nama, kelas, tahun_angkatan) yang bisa dikombinasikan bebas!',
    'essay', 'sedang',
    'Jawaban ideal:

Positional placeholder (?): parameter diisi berdasarkan urutan. Lebih ringkas untuk query sederhana.
$stmt = $pdo->prepare("SELECT * FROM siswa WHERE nisn = ? AND kelas = ?");
$stmt->execute([$nisn, $kelas]);

Named placeholder (:nama): parameter diisi berdasarkan nama, lebih readable untuk query kompleks, urutan tidak penting saat execute.
$stmt = $pdo->prepare("SELECT * FROM siswa WHERE nisn = :nisn AND kelas = :kelas");
$stmt->execute([":nisn" => $nisn, ":kelas" => $kelas]);

Kapan pakai: positional untuk query pendek/sederhana, named untuk query panjang/banyak parameter agar lebih mudah dibaca.

Fungsi filter opsional:
<?php
function cariSiswa(PDO $pdo, ?string $nama, ?string $kelas, ?int $tahun): array {
    $sql = "SELECT * FROM siswa WHERE 1=1";
    $params = [];

    if ($nama !== null && $nama !== "") {
        $sql .= " AND nama LIKE :nama";
        $params[":nama"] = "%" . $nama . "%";
    }
    if ($kelas !== null && $kelas !== "") {
        $sql .= " AND kelas = :kelas";
        $params[":kelas"] = $kelas;
    }
    if ($tahun !== null) {
        $sql .= " AND tahun_angkatan = :tahun";
        $params[":tahun"] = $tahun;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>

Nilai penuh: perbedaan ? vs :nama + kapan pakai + fungsi dynamic WHERE dengan 1=1 + named placeholder untuk filter opsional.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 7, 25);

  -- ==========================================================
  -- TES 3: KEAMANAN DATA DASAR
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Serangan di mana penyerang menyisipkan perintah SQL berbahaya melalui input form untuk memanipulasi query database disebut...',
    'pg', 'mudah',
    'SQL Injection terjadi saat input pengguna langsung digabungkan ke string query tanpa sanitasi. Contoh: input "'' OR 1=1 --" bisa membuat WHERE clause selalu true, memberi akses ke semua data. Pencegahan: Prepared Statement, ORM, atau stored procedure.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Cross-Site Scripting (XSS)',false),
    (s,'B','Cross-Site Request Forgery (CSRF)',false),
    (s,'C','SQL Injection',true),
    (s,'D','Buffer Overflow',false),
    (s,'E','Man-in-the-Middle Attack',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Fungsi PHP yang paling tepat untuk menyimpan password pengguna ke database secara aman adalah...',
    'pg', 'sedang',
    'password_hash($password, PASSWORD_BCRYPT) menggunakan algoritma bcrypt yang dirancang khusus untuk hashing password: lambat secara by design (mencegah brute force), otomatis menambahkan salt, menghasilkan hash berbeda tiap kali meski password sama. Verifikasi: password_verify().')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','md5($password)',false),
    (s,'B','sha1($password)',false),
    (s,'C','base64_encode($password)',false),
    (s,'D','password_hash($password, PASSWORD_BCRYPT)',true),
    (s,'E','encrypt($password, $key)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Mengapa MD5 dan SHA1 TIDAK aman untuk menyimpan password?',
    'pg', 'sedang',
    'MD5 dan SHA1 dirancang untuk kecepatan (bukan keamanan password): (1) terlalu cepat — attacker bisa mencoba miliaran kombinasi per detik dengan GPU, (2) sudah ada rainbow table (database hash yang sudah dihitung), (3) tidak punya salt otomatis, (4) MD5 sudah ditemukan collision attack.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','MD5 dan SHA1 menghasilkan output yang terlalu panjang',false),
    (s,'B','MD5 dan SHA1 hanya bisa dipakai di sistem Linux',false),
    (s,'C','MD5 dan SHA1 terlalu cepat (mudah di-brute force), ada rainbow table, dan tidak punya salt otomatis',true),
    (s,'D','MD5 dan SHA1 tidak kompatibel dengan PHP versi terbaru',false),
    (s,'E','MD5 dan SHA1 tidak menghasilkan hash yang unik',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Token acak yang disisipkan ke form HTML dan divalidasi di server untuk mencegah serangan CSRF adalah...',
    'pg', 'sulit',
    'CSRF Token (Synchronizer Token Pattern): server membuat token acak unik per sesi, menyisipkannya ke form sebagai hidden field, lalu memvalidasinya saat form di-submit. Jika token tidak cocok/tidak ada, request ditolak. Ini memastikan request benar-benar berasal dari form yang diberikan server.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','API Key',false),
    (s,'B','JWT Token',false),
    (s,'C','CSRF Token (Synchronizer Token)',true),
    (s,'D','Session ID',false),
    (s,'E','Captcha Code',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Prinsip keamanan "Principle of Least Privilege" dalam konteks database berarti...',
    'pg', 'sedang',
    'Principle of Least Privilege: setiap user/aplikasi hanya diberi hak akses minimum yang dibutuhkan untuk tugasnya. Contoh: user aplikasi web hanya perlu SELECT/INSERT/UPDATE/DELETE pada tabel tertentu — tidak perlu DROP TABLE, CREATE USER, atau akses ke tabel sistem. Meminimalkan dampak jika akun dikompromikan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Semua pengguna mendapat hak akses yang sama untuk kemudahan manajemen',false),
    (s,'B','Admin mendapat semua hak, pengguna biasa tidak mendapat hak apapun',false),
    (s,'C','Setiap user/aplikasi hanya mendapat hak akses minimum yang diperlukan untuk tugasnya',true),
    (s,'D','Password database harus minimal 8 karakter dan diganti setiap bulan',false),
    (s,'E','Database hanya boleh diakses dari dalam jaringan lokal (LAN)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah sistem login PHP yang aman yang menerapkan: (a) prepared statement untuk cek username/password, (b) password_hash saat registrasi dan password_verify saat login, (c) regenerasi session ID setelah login berhasil, (d) proteksi CSRF dengan token pada form login, (e) pembatasan percobaan login (rate limiting sederhana menggunakan session)!',
    'essay', 'sulit',
    'Jawaban ideal:

-- registrasi.php (simpan password) --
<?php
$hash = password_hash($_POST["password"], PASSWORD_BCRYPT);
$stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
$stmt->execute([$_POST["username"], $hash]);
?>

-- login.php --
<?php
session_start();

// Rate limiting sederhana
if (!isset($_SESSION["login_attempts"])) $_SESSION["login_attempts"] = 0;
if (!isset($_SESSION["login_time"])) $_SESSION["login_time"] = time();

if ($_SESSION["login_attempts"] >= 5 && (time() - $_SESSION["login_time"]) < 300) {
    die("Terlalu banyak percobaan. Coba lagi dalam 5 menit.");
}

// Generate & validasi CSRF token
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $_SESSION["csrf_token"] = bin2hex(random_bytes(32));
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Cek CSRF
    if (!hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"] ?? "")) {
        die("Request tidak valid (CSRF).");
    }

    $username = trim($_POST["username"]);
    $password = $_POST["password"];

    // Prepared statement — tidak rentan SQL Injection
    $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user["password"])) {
        // Login berhasil — regenerasi session ID (cegah session fixation)
        session_regenerate_id(true);
        $_SESSION["user_id"] = $user["id"];
        $_SESSION["username"] = $user["username"];
        $_SESSION["login_attempts"] = 0;
        header("Location: dashboard.php"); exit;
    } else {
        $_SESSION["login_attempts"]++;
        $_SESSION["login_time"] = time();
        $error = "Username atau password salah.";
    }
}
?>
<form method="POST">
  <input type="hidden" name="csrf_token" value="<?= $_SESSION[''csrf_token''] ?>">
  <input name="username"> <input name="password" type="password">
  <button>Login</button>
</form>

Nilai penuh: prepared statement + password_verify + session_regenerate_id + CSRF token + rate limiting 5 percobaan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan dengan contoh kode konkret bagaimana SQL Injection bisa terjadi pada kode PHP yang tidak aman, kemudian tunjukkan perbaikannya menggunakan Prepared Statement! Sertakan juga penjelasan tentang minimal 3 praktik keamanan database lainnya yang harus diterapkan dalam aplikasi web!',
    'essay', 'sedang',
    'Jawaban ideal:

RENTAN SQL Injection:
<?php
$username = $_POST["username"]; // misalnya: admin'' --
$sql = "SELECT * FROM users WHERE username = ''$username''";
// Query jadi: SELECT * FROM users WHERE username = ''admin'' --''
// Semua setelah -- adalah komentar → login tanpa password!
$result = $pdo->query($sql);
?>

AMAN dengan Prepared Statement:
<?php
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$_POST["username"]]);
$user = $stmt->fetch();
// Input apapun tidak akan dieksekusi sebagai SQL
?>

3 Praktik Keamanan Database Lainnya:

1. Gunakan akun DB dengan hak minimal (Least Privilege):
   -- Buat user khusus aplikasi, hanya beri hak yang dibutuhkan
   CREATE USER ''app_user''@''localhost'' IDENTIFIED BY ''password_kuat'';
   GRANT SELECT, INSERT, UPDATE, DELETE ON sekolah.* TO ''app_user''@''localhost'';
   -- Jangan pakai user root untuk aplikasi!

2. Enkripsi data sensitif:
   -- Simpan password dengan bcrypt, bukan plaintext/MD5
   $hash = password_hash($password, PASSWORD_BCRYPT);
   -- Data sensitif lain (NIK, no. rekening) enkripsi sebelum disimpan

3. Validasi & sanitasi input di server:
   $email = filter_var($_POST["email"], FILTER_VALIDATE_EMAIL);
   $nama  = htmlspecialchars(strip_tags(trim($_POST["nama"])));
   -- Jangan hanya andalkan validasi di JavaScript (bisa di-bypass)

4. Backup rutin & enkripsi backup database

Nilai penuh: contoh kode rentan + penjelasan exploit + perbaikan prepared statement + 3 praktik lain dengan contoh.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 7, 25);

  -- ==========================================================
  -- TES 4: MIGRATION & SEEDER (LARAVEL)
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perintah Artisan untuk membuat file migration baru di Laravel adalah...',
    'pg', 'mudah',
    'php artisan make:migration nama_migration membuat file migration baru di folder database/migrations/ dengan timestamp. Konvensi penamaan: snake_case deskriptif, misalnya create_users_table atau add_email_to_students_table.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','php artisan create:migration nama_migration',false),
    (s,'B','php artisan migration:new nama_migration',false),
    (s,'C','php artisan make:migration nama_migration',true),
    (s,'D','php artisan db:migration nama_migration',false),
    (s,'E','php artisan generate:migration nama_migration',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam file migration Laravel, method yang berisi perintah untuk MEMBUAT tabel adalah...',
    'pg', 'mudah',
    'Setiap migration Laravel punya dua method: up() untuk menerapkan perubahan (CREATE TABLE, ADD COLUMN, dll) dan down() untuk membatalkan perubahan (DROP TABLE, DROP COLUMN, dll). down() digunakan saat rollback.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','create()',false),
    (s,'B','run()',false),
    (s,'C','down()',false),
    (s,'D','up()',true),
    (s,'E','apply()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perintah untuk menjalankan semua migration yang belum dijalankan sekaligus reset database dan isi ulang dengan seeder adalah...',
    'pg', 'sedang',
    'php artisan migrate:fresh --seed melakukan: DROP semua tabel → jalankan semua migration dari awal → jalankan DatabaseSeeder. Berguna saat development untuk reset database bersih. HATI-HATI: jangan dijalankan di production karena menghapus semua data!')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','php artisan migrate --fresh --seed',false),
    (s,'B','php artisan migrate:rollback --seed',false),
    (s,'C','php artisan db:seed --migrate',false),
    (s,'D','php artisan migrate:fresh --seed',true),
    (s,'E','php artisan migrate --reset --seed',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Di Laravel, class yang digunakan untuk membuat data dummy/awal dalam jumlah besar secara otomatis menggunakan Faker adalah...',
    'pg', 'sedang',
    'Factory di Laravel menggunakan Faker untuk menghasilkan data palsu yang realistis (nama, email, tanggal, dll) dalam jumlah besar. Dibuat dengan php artisan make:factory NamaFactory. Seeder memanggil Factory untuk mengisi database dengan data testing.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Seeder',false),
    (s,'B','Faker',false),
    (s,'C','Blueprint',false),
    (s,'D','Factory',true),
    (s,'E','Generator',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Helper Schema Builder Laravel untuk menambahkan kolom foreign key yang mengacu ke primary key tabel lain adalah...',
    'pg', 'sulit',
    'Schema::table() dengan $table->foreignId(''id_kelas'')->constrained(''kelas'') membuat kolom bigint unsigned + constraint FOREIGN KEY secara otomatis. constrained() secara konvensi mengacu ke tabel "kelas" kolom "id". Bisa juga eksplisit: ->references(''id'')->on(''kelas'').')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','$table->foreign(''id_kelas'')',false),
    (s,'B','$table->integer(''id_kelas'')->references(''id'')->on(''kelas'')',false),
    (s,'C','$table->foreignKey(''id_kelas'', ''kelas'')',false),
    (s,'D','$table->foreignId(''id_kelas'')->constrained(''kelas'')',true),
    (s,'E','$table->unsignedBigInteger(''id_kelas'')->foreign()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah migration Laravel untuk tabel sistem perpustakaan digital yang terdiri dari tabel: buku (id, isbn, judul, pengarang, tahun, stok, id_kategori FK), kategori (id, nama_kategori), anggota (id, nisn, nama, email, tgl_daftar), peminjaman (id, id_anggota FK, id_buku FK, tgl_pinjam, tgl_kembali, status, denda). Sertakan juga seeder untuk mengisi minimal 3 kategori dan 5 buku!',
    'essay', 'sulit',
    'Jawaban ideal:

-- Migration: create_kategori_table --
public function up(): void {
    Schema::create(''kategori'', function (Blueprint $table) {
        $table->id();
        $table->string(''nama_kategori'', 100);
        $table->timestamps();
    });
}

-- Migration: create_buku_table --
public function up(): void {
    Schema::create(''buku'', function (Blueprint $table) {
        $table->id();
        $table->string(''isbn'', 20)->unique();
        $table->string(''judul'', 200);
        $table->string(''pengarang'', 100);
        $table->year(''tahun'');
        $table->unsignedInteger(''stok'')->default(0);
        $table->foreignId(''id_kategori'')->constrained(''kategori'')->onDelete(''restrict'');
        $table->timestamps();
    });
}

-- Migration: create_peminjaman_table --
public function up(): void {
    Schema::create(''peminjaman'', function (Blueprint $table) {
        $table->id();
        $table->foreignId(''id_anggota'')->constrained(''anggota'');
        $table->foreignId(''id_buku'')->constrained(''buku'');
        $table->date(''tgl_pinjam'');
        $table->date(''tgl_kembali'')->nullable();
        $table->enum(''status'', [''dipinjam'', ''dikembalikan'', ''terlambat''])->default(''dipinjam'');
        $table->decimal(''denda'', 10, 2)->default(0);
        $table->timestamps();
    });
}

-- KategoriSeeder --
public function run(): void {
    $kategori = [''Fiksi'', ''Teknologi'', ''Sains'', ''Sejarah'', ''Bahasa''];
    foreach ($kategori as $nama) {
        DB::table(''kategori'')->insert([''nama_kategori'' => $nama, ''created_at'' => now()]);
    }
}

-- BukuSeeder --
public function run(): void {
    Buku::factory()->count(50)->create(); // atau insert manual
    DB::table(''buku'')->insert([
        [''isbn'' => ''978-0-13-468599-1'', ''judul'' => ''Clean Code'', ''pengarang'' => ''Robert Martin'', ''tahun'' => 2008, ''stok'' => 3, ''id_kategori'' => 2],
        // ... dst
    ]);
}

Nilai penuh: 3-4 migration dengan Blueprint benar + FK constrained + seeder dengan insert data nyata.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan konsep "Database Version Control" menggunakan Migration di Laravel! Mengapa migration lebih baik daripada mengekspor/mengimpor file SQL secara manual saat bekerja dalam tim? Kemudian jelaskan perbedaan dan kapan menggunakan: migrate, migrate:rollback, migrate:fresh, dan migrate:refresh beserta risikonya!',
    'essay', 'sedang',
    'Jawaban ideal:

Database Version Control dengan Migration:
Migration = file PHP yang merepresentasikan perubahan skema database secara terurut dan terdokumentasi. Setiap perubahan (buat tabel, tambah kolom, dll) disimpan sebagai migration terpisah dengan timestamp.

Mengapa lebih baik dari manual SQL:
1. Versioning: setiap perubahan skema tercatat di git bersama kode
2. Kolaborasi tim: developer lain cukup jalankan php artisan migrate untuk sync
3. Konsistensi: semua environment (local, staging, production) punya skema yang sama
4. Rollback mudah: bisa undo perubahan dengan migrate:rollback
5. CI/CD friendly: bisa diautomasi dalam pipeline deployment

Perbedaan perintah:
php artisan migrate
→ Jalankan migration yang BELUM dijalankan saja
→ Aman di production, tidak merusak data yang ada

php artisan migrate:rollback
→ Batalkan BATCH migration terakhir (method down())
→ Data di tabel yang di-drop akan HILANG
→ Gunakan saat perlu undo perubahan terbaru

php artisan migrate:fresh
→ DROP semua tabel → migrate ulang dari awal
→ SEMUA DATA HILANG — HANYA untuk development!
→ Jangan pernah di production

php artisan migrate:refresh
→ Rollback semua → migrate ulang (lebih gentle dari fresh)
→ Data tetap hilang karena semua di-rollback
→ Dengan --seed: isi ulang data seeder

Risiko terbesar: migrate:fresh dan migrate:refresh di server production = bencana data!

Nilai penuh: konsep version control + 4 alasan lebih baik dari manual + 4 perintah dijelaskan dengan risiko masing-masing.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 7, 25);

  -- ==========================================================
  -- TES 5: ELOQUENT ORM
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Secara default, Eloquent Laravel berasumsi nama tabel dari sebuah Model adalah...',
    'pg', 'mudah',
    'Eloquent menggunakan konvensi: nama model dalam PascalCase diubah ke snake_case plural. Contoh: Model User → tabel users, Model ProductCategory → tabel product_categories. Jika nama tabel berbeda, override dengan property: protected $table = ''nama_tabel'';')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Nama model dalam huruf kecil tanpa perubahan (misalnya: Siswa → siswa)',false),
    (s,'B','Nama model dalam PascalCase ditambah "Table" (misalnya: Siswa → SiswaTable)',false),
    (s,'C','Nama model dalam snake_case plural (misalnya: Siswa → siswas, ProductCategory → product_categories)',true),
    (s,'D','Nama model sama persis dengan nama tabel, harus selalu sama',false),
    (s,'E','Nama model dalam UPPERCASE dengan underscore (misalnya: Siswa → SISWA)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam Eloquent, relasi yang menyatakan "satu Guru memiliki banyak Mapel" (dari sisi Model Guru) didefinisikan dengan method...',
    'pg', 'sedang',
    'hasMany() = "has many" = satu ke banyak dari sisi parent. Guru hasMany Mapel artinya di tabel mapel ada kolom id_guru sebagai FK. Sebaliknya, dari sisi Mapel: belongsTo Guru. hasOne = satu ke satu. belongsToMany = many-to-many via pivot table.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','belongsTo()',false),
    (s,'B','hasOne()',false),
    (s,'C','belongsToMany()',false),
    (s,'D','hasMany()',true),
    (s,'E','manyToMany()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Masalah "N+1 Query" dalam Eloquent terjadi ketika...',
    'pg', 'sulit',
    'N+1 Problem: 1 query untuk ambil semua Guru, lalu N query tambahan (satu per guru) untuk ambil mapel masing-masing. Solusi: Eager Loading dengan with(). Contoh: Guru::with(''mapel'')->get() → hanya 2 query total, bukan 1+N query.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Query mengambil terlalu banyak kolom dengan SELECT *',false),
    (s,'B','Tidak ada index pada primary key tabel',false),
    (s,'C','Mengakses relasi dalam loop menghasilkan 1 query utama + N query tambahan (satu per record)',true),
    (s,'D','Query dijalankan lebih dari satu kali karena ada bug logika',false),
    (s,'E','Database tidak mendukung lebih dari satu JOIN sekaligus',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Method Eloquent yang digunakan untuk membuat atau memperbarui record berdasarkan kondisi tertentu (jika ada update, jika tidak ada create) adalah...',
    'pg', 'sedang',
    'updateOrCreate([kondisi_pencarian], [nilai_untuk_update/create]) mencari record berdasarkan kondisi pertama, jika ditemukan → update dengan nilai kedua, jika tidak → buat baru dengan gabungan keduanya. Mirip dengan UPSERT di SQL.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','findOrCreate()',false),
    (s,'B','createOrUpdate()',false),
    (s,'C','firstOrNew()',false),
    (s,'D','updateOrCreate()',true),
    (s,'E','upsert()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Property Eloquent yang digunakan untuk mendefinisikan kolom-kolom yang BOLEH diisi secara mass assignment (melindungi dari mass assignment vulnerability) adalah...',
    'pg', 'sedang',
    '$fillable = whitelist kolom yang boleh diisi via create() atau fill(). $guarded = blacklist kolom yang TIDAK boleh diisi (kebalikan fillable). Tanpa salah satu, Eloquent akan throw MassAssignmentException. Best practice: gunakan $fillable untuk eksplisit mendaftar kolom yang aman.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','$visible',false),
    (s,'B','$hidden',false),
    (s,'C','$casts',false),
    (s,'D','$fillable',true),
    (s,'E','$attributes',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah implementasi Eloquent ORM untuk sistem blog sederhana dengan relasi: User hasMany Post, Post belongsTo User, Post belongsToMany Tag (via pivot post_tag). Implementasikan: (a) ketiga model dengan relasi yang tepat, (b) eager loading untuk menghindari N+1 saat menampilkan semua post beserta user dan tag-nya, (c) contoh CRUD menggunakan Eloquent (buat post baru, update, hapus), (d) attach/detach tag ke post!',
    'essay', 'sulit',
    'Jawaban ideal:

// Model User
class User extends Model {
    protected $fillable = [''name'', ''email'', ''password''];
    public function posts() { return $this->hasMany(Post::class); }
}

// Model Post
class Post extends Model {
    protected $fillable = [''title'', ''body'', ''user_id''];
    public function user()  { return $this->belongsTo(User::class); }
    public function tags()  { return $this->belongsToMany(Tag::class, ''post_tag''); }
}

// Model Tag
class Tag extends Model {
    protected $fillable = [''name''];
    public function posts() { return $this->belongsToMany(Post::class, ''post_tag''); }
}

// (b) Eager loading — hindari N+1
$posts = Post::with([''user'', ''tags''])->latest()->get();
// Hanya 3 query: posts + users + tags

// (c) CRUD
// Create
$post = Post::create([
    ''title'' => ''Belajar Laravel'',
    ''body''  => ''Eloquent sangat powerful!'',
    ''user_id'' => auth()->id(),
]);

// Update
$post->update([''title'' => ''Belajar Eloquent ORM'']);
// atau: Post::where(''id'', $id)->update([''title'' => ''...'']);

// Delete
$post->delete();
// atau: Post::destroy($id);

// (d) Attach/Detach tag
$post->tags()->attach([1, 2, 3]);       // tambah tag dengan id 1,2,3
$post->tags()->detach([2]);              // hapus tag id 2
$post->tags()->sync([1, 3]);            // set exact tags (hapus yg tidak ada)

Nilai penuh: 3 model + relasi tepat + $fillable + eager loading with() + CRUD via model + attach/detach/sync.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara Lazy Loading dan Eager Loading dalam Eloquent! Demonstrasikan dengan contoh kode yang menunjukkan masalah N+1 dan solusinya. Kemudian jelaskan kapan menggunakan: with() (eager), load() (lazy eager), dan withCount()!',
    'essay', 'sedang',
    'Jawaban ideal:

Lazy Loading: relasi diload saat pertama kali diakses (otomatis, per-objek).
Eager Loading: relasi diload sekaligus bersama query utama.

Masalah N+1 (Lazy Loading):
$guru = Guru::all(); // 1 query
foreach ($guru as $g) {
    echo $g->mapel->count(); // N query! (1 per guru)
}
// Total: 1 + N query → sangat lambat jika N = 1000

Solusi Eager Loading dengan with():
$guru = Guru::with(''mapel'')->get(); // hanya 2 query total
foreach ($guru as $g) {
    echo $g->mapel->count(); // data sudah di-cache, 0 query tambahan
}

Kapan menggunakan:

with() — saat SEBELUM query dieksekusi, sudah tahu relasi apa yang dibutuhkan:
$posts = Post::with([''user'', ''tags'', ''comments''])->paginate(10);

load() — lazy eager loading, SETELAH koleksi sudah ada:
$posts = Post::paginate(10); // query pertama
// ... processing lain ...
$posts->load(''user'', ''tags''); // load relasi belakangan

withCount() — hitung jumlah relasi tanpa load seluruh datanya:
$guru = Guru::withCount(''mapel'')->get();
echo $guru->first()->mapel_count; // kolom virtual mapel_count

Nilai penuh: perbedaan lazy vs eager + contoh N+1 masalah + solusi with() + penjelasan with() vs load() vs withCount() dengan contoh.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 7, 25);

  -- ==========================================================
  -- TES 6: QUERY BUILDER LANJUTAN
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Laravel Query Builder diakses melalui facade...',
    'pg', 'mudah',
    'DB facade (Illuminate\Support\Facades\DB) adalah titik masuk ke Query Builder Laravel. Contoh: DB::table(''users'')->get(). Berbeda dengan Eloquent yang melalui Model, Query Builder langsung ke database tanpa model/ORM layer. Lebih ringan tapi tidak punya fitur relasi/casting Eloquent.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Query::table()',false),
    (s,'B','Database::table()',false),
    (s,'C','DB::table()',true),
    (s,'D','Schema::table()',false),
    (s,'E','Builder::table()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan antara get() dan first() pada Query Builder Laravel adalah...',
    'pg', 'mudah',
    'get() mengembalikan Collection dari semua baris yang cocok. first() mengembalikan satu objek (baris pertama) atau null jika tidak ada. firstOrFail() seperti first() tapi throw ModelNotFoundException jika tidak ditemukan.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','get() lebih cepat dari first() karena tidak membutuhkan ORDER BY',false),
    (s,'B','first() mengembalikan array, get() mengembalikan objek',false),
    (s,'C','get() mengembalikan Collection semua baris; first() mengembalikan satu baris (objek) atau null',true),
    (s,'D','Keduanya identik, hanya berbeda nama',false),
    (s,'E','first() hanya bisa dipakai setelah orderBy()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Query Builder Laravel untuk menghitung rata-rata kolom "nilai" dari tabel "nilai_siswa" adalah...',
    'pg', 'sedang',
    'avg() adalah method agregasi Query Builder untuk rata-rata. Method agregasi lain: count(), sum(), max(), min(). Bisa dikombinasikan dengan where() untuk agregasi kondisional: DB::table(''nilai_siswa'')->where(''kelas'', ''XI'')->avg(''nilai'').')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','DB::table(''nilai_siswa'')->average(''nilai'')',false),
    (s,'B','DB::table(''nilai_siswa'')->mean(''nilai'')',false),
    (s,'C','DB::table(''nilai_siswa'')->avg(''nilai'')',true),
    (s,'D','DB::table(''nilai_siswa'')->select(AVG(nilai))->get()',false),
    (s,'E','DB::table(''nilai_siswa'')->calculate(''avg'', ''nilai'')',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Kapan sebaiknya menggunakan Query Builder (DB::table) daripada Eloquent Model?',
    'pg', 'sulit',
    'Query Builder lebih baik untuk: (1) query agregasi kompleks dengan banyak JOIN, GROUP BY, raw SQL, (2) operasi bulk yang butuh performa tinggi (update/insert ribuan baris), (3) tabel yang tidak punya Model, (4) reporting/analytics query yang tidak perlu fitur ORM. Eloquent lebih baik untuk CRUD dengan relasi.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Selalu gunakan Query Builder karena lebih cepat dari Eloquent dalam semua situasi',false),
    (s,'B','Query Builder hanya untuk SELECT, Eloquent untuk INSERT/UPDATE/DELETE',false),
    (s,'C','Query Builder lebih baik untuk query kompleks/agregasi/bulk, Eloquent untuk CRUD dengan relasi dan fitur ORM',true),
    (s,'D','Eloquent tidak bisa digunakan bersama JOIN, sehingga harus pakai Query Builder',false),
    (s,'E','Query Builder tidak mendukung WHERE clause, gunakan Eloquent untuk kondisi filter',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Method Query Builder Laravel untuk menyisipkan raw SQL expression yang aman (dengan binding) ke dalam query adalah...',
    'pg', 'sulit',
    'DB::raw() menyisipkan raw SQL tapi TIDAK aman (tidak di-escape). selectRaw(), whereRaw(), orderByRaw(), groupByRaw() menerima binding sebagai argumen kedua sehingga aman. Contoh: ->whereRaw(''YEAR(created_at) = ?'', [2024]) lebih aman dari ->whereRaw(''YEAR(created_at) = '' . $tahun).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','DB::raw()',false),
    (s,'B','DB::sql()',false),
    (s,'C','selectRaw() / whereRaw() / orderByRaw() dengan binding parameter',true),
    (s,'D','DB::inject()',false),
    (s,'E','DB::statement()',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah query menggunakan Laravel Query Builder untuk laporan akademik sekolah! Query harus: (a) JOIN tabel siswa, nilai, dan mapel, (b) hitung rata-rata nilai per siswa per semester, (c) filter hanya siswa kelas XI, (d) group by siswa dan semester, (e) having rata-rata di atas 70, (f) urutkan dari rata-rata tertinggi, (g) paginate 15 per halaman. Sertakan juga versi raw SQL-nya untuk perbandingan!',
    'essay', 'sulit',
    'Jawaban ideal:

// Laravel Query Builder:
$laporan = DB::table(''siswa as s'')
    ->join(''nilai as n'', ''s.id'', ''='', ''n.id_siswa'')
    ->join(''mapel as m'', ''n.id_mapel'', ''='', ''m.id'')
    ->select([
        ''s.id'',
        ''s.nama'',
        ''s.kelas'',
        ''n.semester'',
        DB::raw(''AVG(n.nilai_akhir) as rata_nilai''),
        DB::raw(''COUNT(n.id_mapel) as jumlah_mapel'')
    ])
    ->where(''s.kelas'', ''LIKE'', ''XI%'')
    ->groupBy(''s.id'', ''s.nama'', ''s.kelas'', ''n.semester'')
    ->having(DB::raw(''AVG(n.nilai_akhir)''), ''>'', 70)
    ->orderByDesc(''rata_nilai'')
    ->paginate(15);

// Raw SQL yang setara:
/*
SELECT s.id, s.nama, s.kelas, n.semester,
       AVG(n.nilai_akhir) AS rata_nilai,
       COUNT(n.id_mapel) AS jumlah_mapel
FROM siswa s
JOIN nilai n ON s.id = n.id_siswa
JOIN mapel m ON n.id_mapel = m.id
WHERE s.kelas LIKE ''XI%''
GROUP BY s.id, s.nama, s.kelas, n.semester
HAVING AVG(n.nilai_akhir) > 70
ORDER BY rata_nilai DESC
LIMIT 15 OFFSET 0;
*/

Nilai penuh: join 3 tabel + select dengan DB::raw AVG + where kelas XI + groupBy + having + orderByDesc + paginate.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara Eloquent ORM dan Query Builder di Laravel dari segi: performa, kemudahan penggunaan, dan kasus penggunaan yang tepat! Kemudian buatlah contoh query yang sama menggunakan KEDUA pendekatan (Eloquent dan Query Builder) untuk: menampilkan 10 produk terlaris berdasarkan total penjualan bulan ini, beserta nama kategori dan stok tersisa!',
    'essay', 'sulit',
    'Jawaban ideal:

Perbandingan:
Eloquent ORM:
- Performa: sedikit lebih lambat (overhead model hydration)
- Kemudahan: lebih mudah, kode lebih ekspresif, fitur lengkap (relasi, casting, events)
- Cocok untuk: CRUD standar, fitur dengan relasi, kode yang butuh readability

Query Builder:
- Performa: lebih cepat untuk query kompleks/bulk
- Kemudahan: lebih dekat ke SQL mentah, perlu tahu nama tabel/kolom
- Cocok untuk: laporan, agregasi kompleks, bulk operations, subquery

Contoh 10 produk terlaris:

// === Eloquent ===
$produk = Produk::select(''produk.*'', ''kategori.nama_kategori'')
    ->join(''kategori'', ''produk.id_kategori'', ''='', ''kategori.id'')
    ->withSum([''penjualan AS total_terjual'' => function($q) {
        $q->whereMonth(''created_at'', now()->month);
    }], ''jumlah'')
    ->orderByDesc(''total_terjual'')
    ->limit(10)
    ->get();

// === Query Builder ===
$produk = DB::table(''produk as p'')
    ->join(''kategori as k'', ''p.id_kategori'', ''='', ''k.id'')
    ->leftJoin(''penjualan as pj'', function($join) {
        $join->on(''p.id'', ''='', ''pj.id_produk'')
             ->whereMonth(''pj.created_at'', now()->month);
    })
    ->select([
        ''p.id'', ''p.nama_produk'', ''p.stok'',
        ''k.nama_kategori'',
        DB::raw(''COALESCE(SUM(pj.jumlah), 0) as total_terjual'')
    ])
    ->groupBy(''p.id'', ''p.nama_produk'', ''p.stok'', ''k.nama_kategori'')
    ->orderByDesc(''total_terjual'')
    ->limit(10)
    ->get();

Nilai penuh: perbandingan 3 aspek + contoh Eloquent dengan join/withSum + contoh Query Builder dengan join/groupBy/DB::raw + keduanya menghasilkan data yang sama.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t6, s, 7, 25);

  RAISE NOTICE 'Seed berhasil: 1 kompetensi "Basis Data Lanjutan" (tingkat=11, urutan=2), 6 tes, 42 soal (30 PG 5-opsi + 12 essay).';
END $$;
