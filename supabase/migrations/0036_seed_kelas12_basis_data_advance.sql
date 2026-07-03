-- ============================================================
-- Seed: Roadmap Kompetensi Kelas XII
-- 1 Kompetensi: Basis Data Advance (urutan 1)
-- 5 Tes Kompetensi (5 PG 5-opsi + 2 Essay per tes)
-- Jalankan di Supabase SQL Editor
-- ============================================================

DO $block$
DECLARE
  v_jur uuid;

  k1 uuid; -- kompetensi

  t1 uuid; -- Backup & Restore
  t2 uuid; -- Stored Procedure & Trigger
  t3 uuid; -- Optimasi Lanjutan
  t4 uuid; -- Pengantar NoSQL
  t5 uuid; -- Keamanan Basis Data Lanjutan

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
    'Basis Data Advance',
    'Pendalaman basis data tingkat lanjut meliputi strategi backup & restore, pemrograman server-side (stored procedure & trigger), teknik optimasi lanjutan (query plan, partitioning), pengantar NoSQL (MongoDB), serta keamanan basis data enterprise.',
    12, 1, 70, true)
  RETURNING id_kompetensi INTO k1;

  -- ----------------------------------------------------------
  -- KOMPETENSI_TUGAS
  -- ----------------------------------------------------------
  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Backup & Restore',
    'Tes pemahaman strategi backup database (full, incremental, differential), prosedur restore, point-in-time recovery, dan implementasi backup otomatis.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t1;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Stored Procedure & Trigger',
    'Tes kemampuan membuat dan menggunakan stored procedure, function, dan trigger untuk mengotomasi logika bisnis di level database.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t2;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Optimasi Lanjutan',
    'Tes pemahaman query execution plan, analisis slow query, strategi indexing lanjutan (composite, partial, covering index), dan table partitioning.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t3;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Pengantar NoSQL',
    'Tes pemahaman konsep NoSQL, jenis-jenis database NoSQL (document, key-value, column-family, graph), kapan menggunakan NoSQL vs relasional, dan operasi dasar MongoDB.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t4;

  INSERT INTO public.kompetensi_tugas (id_kompetensi, judul, deskripsi, status)
  VALUES (k1, 'Keamanan Basis Data Lanjutan',
    'Tes pemahaman manajemen user & privilege, enkripsi data at-rest dan in-transit, audit logging, row-level security, dan pencegahan ancaman database tingkat lanjut.', 'aktif')
  RETURNING id_kompetensi_tugas INTO t5;

  -- ==========================================================
  -- TES 1: BACKUP & RESTORE
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jenis backup yang menyalin SELURUH data database tanpa memperhatikan apakah data sudah pernah di-backup sebelumnya disebut...',
    'pg', 'mudah',
    'Full Backup menyalin seluruh database setiap kali backup dijalankan. Ukuran besar dan waktu lama, tapi restore paling sederhana (hanya butuh satu file backup). Incremental backup hanya menyalin data yang berubah sejak backup terakhir (full atau incremental sebelumnya). Differential backup menyalin data yang berubah sejak full backup terakhir.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Incremental Backup',false),
    (s,'B','Differential Backup',false),
    (s,'C','Full Backup',true),
    (s,'D','Snapshot Backup',false),
    (s,'E','Log Backup',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Kemampuan database untuk dikembalikan ke kondisi pada titik waktu tertentu (misalnya tepat sebelum sebuah query DELETE besar yang tidak disengaja) disebut...',
    'pg', 'sedang',
    'Point-in-Time Recovery (PITR) memungkinkan restore database ke kondisi pada waktu spesifik menggunakan kombinasi full backup + transaction log (WAL di PostgreSQL, binary log di MySQL). Sangat berguna saat terjadi kecelakaan seperti DELETE atau UPDATE tanpa WHERE yang tidak disengaja.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Hot Standby',false),
    (s,'B','Point-in-Time Recovery (PITR)',true),
    (s,'C','Snapshot Rollback',false),
    (s,'D','Transaction Rewind',false),
    (s,'E','Log Replay',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perintah MySQL untuk membuat dump (ekspor) seluruh database "sekolah" ke file SQL adalah...',
    'pg', 'mudah',
    'mysqldump adalah utilitas command-line MySQL untuk membuat backup dalam bentuk file SQL yang berisi perintah CREATE TABLE dan INSERT. mysqldump -u root -p sekolah > sekolah_backup.sql akan mengekspor database sekolah. Restore dilakukan dengan: mysql -u root -p sekolah < sekolah_backup.sql')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','mysql --export sekolah > backup.sql',false),
    (s,'B','mysqlbackup -u root -p sekolah',false),
    (s,'C','mysqldump -u root -p sekolah > backup.sql',true),
    (s,'D','mysql --dump sekolah > backup.sql',false),
    (s,'E','mysqlexport -u root sekolah backup.sql',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Strategi backup yang paling efisien dari segi storage jika dilakukan setiap hari (Senin full backup, Selasa–Minggu hanya data baru) adalah...',
    'pg', 'sulit',
    'Incremental Backup setiap hari hanya menyalin data yang berubah sejak backup sebelumnya (hari sebelumnya) — ukuran terkecil. Trade-off: saat restore butuh Full Backup + SEMUA incremental backup sejak full (lebih kompleks). Differential hanya butuh Full + differential terakhir saat restore, tapi ukurannya terus membesar setiap hari.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Full Backup setiap hari',false),
    (s,'B','Differential Backup setiap hari',false),
    (s,'C','Incremental Backup setiap hari',true),
    (s,'D','Snapshot Backup setiap hari',false),
    (s,'E','Log Backup setiap hari',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam konteks disaster recovery, RTO (Recovery Time Objective) adalah...',
    'pg', 'sedang',
    'RTO = waktu maksimum yang diizinkan untuk sistem kembali beroperasi setelah disaster. Contoh: RTO 4 jam berarti sistem harus online kembali dalam 4 jam. RPO (Recovery Point Objective) berbeda: waktu maksimum data yang boleh hilang. Contoh: RPO 1 jam berarti backup harus minimal setiap 1 jam agar data hilang maksimal 1 jam.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Jumlah data maksimum yang boleh hilang diukur dalam satuan waktu',false),
    (s,'B','Waktu maksimum yang diizinkan untuk sistem kembali beroperasi setelah disaster',true),
    (s,'C','Frekuensi minimum backup harus dilakukan',false),
    (s,'D','Ukuran maksimum file backup yang diizinkan',false),
    (s,'E','Waktu yang dibutuhkan untuk menjalankan satu siklus backup penuh',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Sebuah sekolah memiliki database akademik yang sangat penting. Data tidak boleh hilang lebih dari 6 jam (RPO = 6 jam) dan sistem harus kembali online dalam 2 jam jika terjadi kegagalan (RTO = 2 jam). Rancanglah strategi backup lengkap yang memenuhi persyaratan ini! Jelaskan: (a) jenis dan jadwal backup yang dipilih, (b) lokasi penyimpanan backup (3-2-1 rule), (c) prosedur restore langkah demi langkah, (d) cara memverifikasi backup berhasil sebelum disaster terjadi, (e) script bash sederhana untuk otomasi backup harian!',
    'essay', 'sulit',
    'Jawaban ideal:

(a) STRATEGI BACKUP (memenuhi RPO 6 jam, RTO 2 jam):
- Full backup: setiap Minggu pukul 00.00 (saat tidak ada aktivitas)
- Differential backup: setiap hari pukul 00.00 (data berubah sejak full backup terakhir)
- Transaction log backup: setiap 6 jam — 06.00, 12.00, 18.00, 00.00 (memenuhi RPO 6 jam)
- Database engine: MySQL dengan binary log aktif (PITR support)

(b) 3-2-1 RULE:
- 3 salinan backup: primary + dua backup
- 2 media berbeda: disk lokal server + NAS (Network Attached Storage)
- 1 offsite: cloud storage (Google Cloud Storage / AWS S3 / Backblaze)
Konfigurasi: backup langsung ke lokal, kemudian script sync ke NAS & cloud setelah backup selesai.

(c) PROSEDUR RESTORE (target: RTO 2 jam):
Langkah 1 (15 menit): Siapkan server pengganti atau matikan layanan
Langkah 2 (30 menit): Restore full backup terakhir
  mysql -u root -p sekolah < full_backup_minggu.sql
Langkah 3 (20 menit): Restore differential backup terakhir
  mysql -u root -p sekolah < diff_backup_kemarin.sql
Langkah 4 (10 menit): Replay transaction log sampai titik waktu sebelum insiden
  mysqlbinlog --stop-datetime="2024-12-15 09:55:00" binlog.000001 | mysql -u root -p
Langkah 5 (15 menit): Verifikasi data: cek jumlah record, jalankan query validasi
Langkah 6 (10 menit): Hidupkan kembali layanan, uji fungsionalitas
Total: ~100 menit < RTO 2 jam

(d) VERIFIKASI BACKUP:
- Setiap minggu: lakukan test restore ke server staging terpisah
- Cek checksum file backup: md5sum backup.sql > backup.md5
- Validasi restore: bandingkan jumlah record antara DB asli vs hasil restore
- Dokumentasikan hasil test dalam log verifikasi
- Alert jika backup gagal atau ukuran file backup anomali (terlalu kecil)

(e) SCRIPT OTOMASI:
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="sekolah"
DB_USER="backup_user"
DB_PASS="password_aman"
BACKUP_DIR="/backup/mysql"
CLOUD_BUCKET="gs://sekolah-backup"

# Buat direktori jika belum ada
mkdir -p "$BACKUP_DIR"

# Jalankan backup
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_full_${DATE}.sql.gz"
mysqldump -u "$DB_USER" -p"$DB_PASS" \
  --single-transaction \
  --routines \
  --triggers \
  "$DB_NAME" | gzip > "$BACKUP_FILE"

# Cek apakah backup berhasil
if [ $? -eq 0 ] && [ -s "$BACKUP_FILE" ]; then
  echo "[$(date)] Backup berhasil: $BACKUP_FILE ($(du -sh $BACKUP_FILE | cut -f1))"
  # Sync ke cloud
  gsutil cp "$BACKUP_FILE" "$CLOUD_BUCKET/"
  # Hapus backup lokal lebih dari 7 hari
  find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete
else
  echo "[$(date)] BACKUP GAGAL!" | mail -s "ALERT: Backup DB Sekolah Gagal" admin@sekolah.id
  exit 1
fi

# Simpan log
echo "[$(date)] Backup: $BACKUP_FILE" >> /var/log/db_backup.log

Nilai penuh: jadwal backup (full+differential+log) + 3-2-1 rule + langkah restore urut + cara verifikasi + script bash dengan error handling dan notifikasi.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan perbedaan antara Full Backup, Differential Backup, dan Incremental Backup dari segi: (a) definisi, (b) ukuran storage yang digunakan, (c) kecepatan proses backup, (d) kompleksitas saat restore, (e) kapan masing-masing paling tepat digunakan. Buat tabel perbandingan dan rekomendasikan kombinasi yang paling optimal untuk database sekolah yang aktif digunakan setiap hari kerja!',
    'essay', 'sedang',
    'Jawaban ideal:

TABEL PERBANDINGAN:

| Aspek           | Full Backup        | Differential       | Incremental        |
|-----------------|--------------------|--------------------|---------------------|
| Definisi        | Salin SEMUA data   | Data berubah sejak | Data berubah sejak  |
|                 |                    | full backup terakhir| backup terakhir     |
| Ukuran storage  | Paling besar       | Sedang (makin besar)| Paling kecil        |
| Kecepatan backup| Paling lambat      | Sedang             | Paling cepat        |
| Restore         | Paling mudah       | Full + diff terakhir| Full + SEMUA incr   |
|                 | (1 file)           | (2 file)           | (bisa banyak file)  |
| Kapan dipakai   | Awal minggu/bulan  | Harian (data kecil)| Harian (data besar) |

PENJELASAN DETAIL:

(a) Definisi:
Full: snapshot lengkap seluruh database pada satu waktu
Differential: semua data yang berubah sejak full backup terakhir (makin besar tiap hari)
Incremental: hanya data yang berubah sejak backup TERAKHIR (bisa incremental sebelumnya)

(b) Ukuran: Full > Differential (bertambah tiap hari) > Incremental (konsisten kecil)

(c) Kecepatan backup: Incremental < Differential < Full (incremental paling cepat)

(d) Restore:
Full: restore 1 file saja
Differential: restore full backup + 1 file differential terakhir
Incremental: restore full backup + SEMUA file incremental sejak full (paling kompleks, urutan penting)

(e) Kapan dipakai:
Full: ketika ada perubahan skema besar, awal periode, sebelum upgrade
Differential: organisasi kecil dengan perubahan data tidak terlalu banyak, ingin restore mudah
Incremental: organisasi besar dengan data berubah terus-menerus, storage terbatas

REKOMENDASI UNTUK SEKOLAH:
Kombinasi optimal: Full (Minggu malam) + Incremental (Senin-Sabtu setiap 6 jam)
Alasan:
- Sekolah aktif Senin-Jumat, data berubah (nilai, absensi) tapi tidak masif
- Incremental cukup kecil, backup cepat, tidak ganggu performa server saat jam sekolah
- Full backup Minggu malam (saat tidak ada aktivitas) sebagai baseline bersih
- Saat terjadi masalah, restore: Full Minggu + incremental berurutan sampai titik kejadian

Nilai penuh: tabel perbandingan 5 aspek + penjelasan masing-masing + rekomendasi kombinasi dengan alasan spesifik untuk konteks sekolah.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t1, s, 7, 25);

  -- ==========================================================
  -- TES 2: STORED PROCEDURE & TRIGGER
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Keuntungan utama menggunakan Stored Procedure dibandingkan mengirimkan query SQL langsung dari aplikasi adalah...',
    'pg', 'sedang',
    'Keuntungan stored procedure: (1) Performa — dikompilasi dan di-cache di server, eksekusi lebih cepat. (2) Keamanan — aplikasi tidak perlu tahu struktur tabel, hanya memanggil prosedur. (3) Reusability — bisa dipanggil dari banyak aplikasi/bahasa. (4) Mengurangi network traffic — logic di server, tidak kirim banyak query bolak-balik. (5) Centralized business logic.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Stored procedure selalu lebih mudah ditulis daripada query biasa',false),
    (s,'B','Stored procedure otomatis membuat backup data sebelum dieksekusi',false),
    (s,'C','Logika dikompilasi di server — lebih cepat, aman, dan mengurangi network traffic',true),
    (s,'D','Stored procedure tidak membutuhkan hak akses khusus untuk dieksekusi',false),
    (s,'E','Stored procedure tidak bisa menggunakan parameter sehingga lebih sederhana',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam MySQL Trigger, kata kunci NEW dan OLD merujuk pada...',
    'pg', 'sedang',
    'NEW = nilai baru setelah operasi (tersedia di INSERT dan UPDATE trigger). OLD = nilai lama sebelum operasi (tersedia di UPDATE dan DELETE trigger). Pada INSERT trigger: hanya NEW tersedia. Pada DELETE trigger: hanya OLD tersedia. Pada UPDATE trigger: keduanya tersedia — OLD.kolom adalah nilai sebelum update, NEW.kolom adalah nilai setelah update.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','NEW = tabel baru yang dibuat, OLD = tabel lama yang dihapus',false),
    (s,'B','NEW = nilai baris setelah operasi, OLD = nilai baris sebelum operasi',true),
    (s,'C','NEW = koneksi database baru, OLD = koneksi database yang sudah ada',false),
    (s,'D','NEW = transaksi yang baru dimulai, OLD = transaksi yang sudah selesai',false),
    (s,'E','NEW = index baru, OLD = index yang akan dihapus',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Trigger yang dieksekusi SEBELUM operasi DML (INSERT/UPDATE/DELETE) selesai dijalankan disebut...',
    'pg', 'mudah',
    'BEFORE trigger berjalan sebelum data aktual diubah di tabel — berguna untuk validasi, modifikasi nilai NEW sebelum disimpan, atau mencegah operasi (dengan SIGNAL di MySQL). AFTER trigger berjalan setelah data diubah — berguna untuk logging, sinkronisasi tabel lain, update statistik. INSTEAD OF trigger khusus untuk view.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','AFTER Trigger',false),
    (s,'B','INSTEAD OF Trigger',false),
    (s,'C','BEFORE Trigger',true),
    (s,'D','PRE Trigger',false),
    (s,'E','VALIDATE Trigger',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perbedaan antara Stored Procedure dan Function (Stored Function) di MySQL adalah...',
    'pg', 'sulit',
    'Stored Procedure: dipanggil dengan CALL, tidak harus mengembalikan nilai, bisa punya multiple OUT parameter, tidak bisa dipakai langsung di query SELECT. Function: dipanggil langsung di dalam ekspresi SQL (SELECT hitungNilai(id)), HARUS mengembalikan tepat satu nilai dengan RETURN, tidak bisa mengubah data (di banyak implementasi — no DML untuk deterministic function).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Stored procedure lebih cepat dari function karena tidak perlu return value',false),
    (s,'B','Function harus mengembalikan nilai dan bisa dipakai langsung di query; procedure dipanggil dengan CALL dan tidak harus return',true),
    (s,'C','Function bisa mengubah data di tabel; procedure hanya untuk SELECT',false),
    (s,'D','Keduanya identik — hanya berbeda nama konvensi',false),
    (s,'E','Procedure bisa dipanggil dari SELECT; function harus dipanggil dengan CALL',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Masalah utama yang perlu diwaspadai saat menggunakan Trigger secara berlebihan dalam database adalah...',
    'pg', 'sulit',
    'Trigger yang berlebihan atau saling memicu (cascading trigger) dapat: (1) membuat debugging sangat sulit karena efek tersembunyi — developer tidak melihat trigger berjalan saat INSERT/UPDATE, (2) memperlambat performa karena setiap DML memicu trigger tambahan, (3) trigger bisa memicu trigger lain secara berantai (cascading), (4) susah ditest unit. Gunakan trigger hanya untuk cross-cutting concerns seperti audit log.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Trigger tidak bisa mengakses tabel yang sama dengan tabel yang memicunya',false),
    (s,'B','Trigger tidak bisa menerima parameter dari luar',false),
    (s,'C','Efek tersembunyi (hidden side effect) yang menyulitkan debugging dan bisa memicu cascading trigger yang memperlambat performa',true),
    (s,'D','Trigger hanya bisa dibuat oleh superuser sehingga developer biasa tidak bisa menggunakannya',false),
    (s,'E','Trigger otomatis terhapus saat server di-restart',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Buatlah implementasi Stored Procedure dan Trigger untuk sistem nilai sekolah! (a) Stored Procedure "sp_hitung_nilai_akhir" yang menerima parameter id_siswa dan id_mapel, menghitung nilai akhir dari komponen (UTS bobot 30%, UAS bobot 40%, tugas harian bobot 30%), menyimpan hasilnya ke tabel nilai_akhir, dan mengembalikan OUT parameter berupa nilai akhir dan predikat (A/B/C/D/E). (b) Trigger "trg_audit_nilai" yang mencatat setiap perubahan nilai ke tabel audit_nilai (siapa yang mengubah, nilai lama, nilai baru, waktu perubahan)!',
    'essay', 'sulit',
    'Jawaban ideal:

-- (a) STORED PROCEDURE
DELIMITER $$

CREATE PROCEDURE sp_hitung_nilai_akhir(
    IN  p_id_siswa  INT,
    IN  p_id_mapel  INT,
    OUT p_nilai_akhir DECIMAL(5,2),
    OUT p_predikat   VARCHAR(1)
)
BEGIN
    DECLARE v_uts    DECIMAL(5,2);
    DECLARE v_uas    DECIMAL(5,2);
    DECLARE v_tugas  DECIMAL(5,2);

    -- Ambil komponen nilai
    SELECT uts, uas, tugas
    INTO v_uts, v_uas, v_tugas
    FROM komponen_nilai
    WHERE id_siswa = p_id_siswa AND id_mapel = p_id_mapel
    LIMIT 1;

    -- Hitung nilai akhir
    SET p_nilai_akhir = (v_uts * 0.30) + (v_uas * 0.40) + (v_tugas * 0.30);

    -- Tentukan predikat
    SET p_predikat = CASE
        WHEN p_nilai_akhir >= 90 THEN ''A''
        WHEN p_nilai_akhir >= 80 THEN ''B''
        WHEN p_nilai_akhir >= 70 THEN ''C''
        WHEN p_nilai_akhir >= 60 THEN ''D''
        ELSE ''E''
    END;

    -- Simpan ke tabel nilai_akhir (INSERT atau UPDATE)
    INSERT INTO nilai_akhir (id_siswa, id_mapel, nilai, predikat, updated_at)
    VALUES (p_id_siswa, p_id_mapel, p_nilai_akhir, p_predikat, NOW())
    ON DUPLICATE KEY UPDATE
        nilai      = p_nilai_akhir,
        predikat   = p_predikat,
        updated_at = NOW();

END$$

DELIMITER ;

-- Cara memanggil:
CALL sp_hitung_nilai_akhir(101, 5, @nilai, @predikat);
SELECT @nilai AS nilai_akhir, @predikat AS predikat;

-- (b) TRIGGER AUDIT
-- Buat tabel audit terlebih dahulu:
CREATE TABLE audit_nilai (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    id_nilai     INT,
    id_siswa     INT,
    kolom        VARCHAR(50),
    nilai_lama   DECIMAL(5,2),
    nilai_baru   DECIMAL(5,2),
    diubah_oleh  VARCHAR(100),
    waktu        DATETIME DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$

CREATE TRIGGER trg_audit_nilai
AFTER UPDATE ON komponen_nilai
FOR EACH ROW
BEGIN
    -- Catat perubahan UTS jika berubah
    IF OLD.uts <> NEW.uts THEN
        INSERT INTO audit_nilai (id_nilai, id_siswa, kolom, nilai_lama, nilai_baru, diubah_oleh)
        VALUES (OLD.id, OLD.id_siswa, ''uts'', OLD.uts, NEW.uts, CURRENT_USER());
    END IF;

    -- Catat perubahan UAS jika berubah
    IF OLD.uas <> NEW.uas THEN
        INSERT INTO audit_nilai (id_nilai, id_siswa, kolom, nilai_lama, nilai_baru, diubah_oleh)
        VALUES (OLD.id, OLD.id_siswa, ''uas'', OLD.uas, NEW.uas, CURRENT_USER());
    END IF;

    -- Catat perubahan tugas jika berubah
    IF OLD.tugas <> NEW.tugas THEN
        INSERT INTO audit_nilai (id_nilai, id_siswa, kolom, nilai_lama, nilai_baru, diubah_oleh)
        VALUES (OLD.id, OLD.id_siswa, ''tugas'', OLD.tugas, NEW.tugas, CURRENT_USER());
    END IF;
END$$

DELIMITER ;

Nilai penuh: stored procedure dengan IN+OUT parameter + DECLARE variable + kalkulasi bobot + INSERT ON DUPLICATE KEY + predikat CASE + trigger AFTER UPDATE + IF OLD <> NEW + INSERT ke audit dengan CURRENT_USER().')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan skenario di mana penggunaan Trigger lebih tepat daripada menangani logika di aplikasi! Kemudian buatlah trigger untuk fitur "stok otomatis" pada sistem perpustakaan: saat buku dipinjam (INSERT ke tabel peminjaman), stok buku berkurang 1 secara otomatis dan jika stok sudah 0 sebelum peminjaman, batalkan dengan pesan error. Saat buku dikembalikan (UPDATE status peminjaman jadi ''dikembalikan''), stok bertambah 1 kembali!',
    'essay', 'sedang',
    'Jawaban ideal:

SKENARIO TRIGGER LEBIH TEPAT DARI LOGIKA APLIKASI:
1. Integritas data yang harus terjaga meski database diakses dari banyak aplikasi berbeda (web, mobile, desktop, CLI) — trigger berlaku di semua jalur akses, bukan hanya lewat satu aplikasi.
2. Audit logging — mencatat semua perubahan data termasuk yang dilakukan langsung via SQL client oleh DBA, bukan hanya lewat aplikasi.
3. Denormalisasi otomatis — update kolom summary/counter yang harus selalu sinkron dengan data detail.
4. Validasi business rule tingkat database yang tidak bisa dinyatakan dengan constraint biasa (CHECK/FK).

TRIGGER STOK PERPUSTAKAAN:

DELIMITER $$

-- Trigger 1: Kurangi stok saat buku dipinjam
CREATE TRIGGER trg_kurangi_stok_pinjam
BEFORE INSERT ON peminjaman
FOR EACH ROW
BEGIN
    DECLARE v_stok INT;

    -- Cek stok saat ini
    SELECT stok INTO v_stok
    FROM buku WHERE id_buku = NEW.id_buku FOR UPDATE;

    -- Jika stok habis, batalkan peminjaman
    IF v_stok <= 0 THEN
        SIGNAL SQLSTATE ''45000''
            SET MESSAGE_TEXT = ''Peminjaman gagal: stok buku sudah habis.'';
    END IF;

    -- Kurangi stok
    UPDATE buku SET stok = stok - 1 WHERE id_buku = NEW.id_buku;
END$$

-- Trigger 2: Kembalikan stok saat buku dikembalikan
CREATE TRIGGER trg_kembalikan_stok
AFTER UPDATE ON peminjaman
FOR EACH ROW
BEGIN
    -- Hanya proses jika status berubah dari non-dikembalikan menjadi dikembalikan
    IF OLD.status <> ''dikembalikan'' AND NEW.status = ''dikembalikan'' THEN
        UPDATE buku SET stok = stok + 1 WHERE id_buku = NEW.id_buku;
    END IF;
END$$

DELIMITER ;

Catatan penting:
- FOR UPDATE pada SELECT stok mencegah race condition jika dua peminjaman terjadi bersamaan
- SIGNAL SQLSTATE membatalkan seluruh transaksi (INSERT tidak jadi)
- Cek OLD.status <> ''dikembalikan'' mencegah stok bertambah dua kali jika trigger dipanggil lagi

Nilai penuh: 4 skenario trigger lebih tepat + BEFORE INSERT trigger dengan cek stok + FOR UPDATE (race condition) + SIGNAL SQLSTATE untuk error + AFTER UPDATE trigger dengan cek perubahan status OLD vs NEW.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t2, s, 7, 25);

  -- ==========================================================
  -- TES 3: OPTIMASI LANJUTAN
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Dalam output EXPLAIN MySQL, nilai kolom "type" yang menunjukkan performa PALING BURUK (full table scan) adalah...',
    'pg', 'sulit',
    'Urutan type dari TERBAIK ke TERBURUK: system > const > eq_ref > ref > range > index > ALL. "ALL" = full table scan, baca semua baris — terburuk. "ref" = index lookup biasa (baik). "range" = scan sebagian index (cukup baik). "const/eq_ref" = sangat baik untuk JOIN. Target optimasi: hindari type = ALL, usahakan minimal "range" atau "ref".')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','ref',false),
    (s,'B','range',false),
    (s,'C','index',false),
    (s,'D','ALL',true),
    (s,'E','eq_ref',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Covering Index adalah jenis index di mana...',
    'pg', 'sulit',
    'Covering Index: index yang mengandung SEMUA kolom yang dibutuhkan oleh query — baik kolom di WHERE maupun kolom di SELECT. Database bisa menjawab query hanya dari index tanpa harus mengakses tabel utama sama sekali (no table lookup). Ini sangat cepat. Di EXPLAIN terlihat "Using index" di kolom Extra. Dibuat dengan menyertakan semua kolom yang diquery dalam satu composite index.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Index yang secara otomatis menutupi (cover) semua tabel dalam database',false),
    (s,'B','Index yang mencakup semua kolom yang dibutuhkan query sehingga tidak perlu akses tabel utama',true),
    (s,'C','Index pada semua kolom sebuah tabel sekaligus',false),
    (s,'D','Index yang melindungi data dari perubahan yang tidak sah',false),
    (s,'E','Index yang otomatis diperbarui setiap kali ada perubahan skema',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Table Partitioning adalah teknik yang membagi tabel besar menjadi bagian lebih kecil. Jenis partitioning yang membagi data berdasarkan rentang nilai (misalnya tahun) disebut...',
    'pg', 'sedang',
    'RANGE Partitioning membagi baris berdasarkan rentang nilai kolom. Contoh: partisi p2022 untuk tahun=2022, p2023 untuk tahun=2023. Jenis lain: HASH (distribusi merata berdasarkan hash), LIST (berdasarkan daftar nilai diskrit seperti kota), KEY (seperti hash tapi pakai primary key). Range paling umum untuk data time-series.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','HASH Partitioning',false),
    (s,'B','LIST Partitioning',false),
    (s,'C','RANGE Partitioning',true),
    (s,'D','KEY Partitioning',false),
    (s,'E','COLUMN Partitioning',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Teknik yang menyimpan hasil query yang sering diakses di memori sehingga query berikutnya tidak perlu ke database adalah...',
    'pg', 'sedang',
    'Query Caching / Result Caching menyimpan hasil query di memori (Redis, Memcached, atau query cache bawaan database). Sangat efektif untuk data yang jarang berubah tapi sering dibaca (read-heavy). Perlu strategi invalidasi: kapan cache dianggap stale dan harus di-refresh. MySQL 8.0 menghapus query cache bawaan — gunakan caching di application layer (Redis).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Connection Pooling',false),
    (s,'B','Query Rewriting',false),
    (s,'C','Query Caching / Result Caching',true),
    (s,'D','Lazy Loading',false),
    (s,'E','Index Scan',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Query mana yang berpotensi lebih lambat pada tabel dengan 10 juta baris meski ada index pada kolom "status"?',
    'pg', 'sulit',
    'SELECT * FROM orders WHERE status = ''aktif'' berpotensi tidak menggunakan index secara efektif jika kardinalitas rendah — misalnya 80% data statusnya "aktif". Database query optimizer akan memilih full scan karena lebih murah dari index lookup + table fetch untuk jutaan baris. Sebaliknya, SELECT * FROM orders WHERE id = 12345 selalu cepat karena id adalah primary key dengan kardinalitas sangat tinggi.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','SELECT * FROM orders WHERE id = 12345',false),
    (s,'B','SELECT COUNT(*) FROM orders',false),
    (s,'C','SELECT * FROM orders WHERE status = ''aktif'' (jika 80% data berstatus aktif)',true),
    (s,'D','SELECT id, total FROM orders ORDER BY id LIMIT 10',false),
    (s,'E','SELECT * FROM orders WHERE created_at > ''2024-01-01'' (dengan index pada created_at)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Database sekolah memiliki tabel LOG_AKTIVITAS dengan 50 juta baris yang terus bertambah setiap hari. Query laporan bulanan sangat lambat (> 5 menit). Lakukan analisis dan optimasi! (a) Tuliskan dan interpretasikan output EXPLAIN untuk query: SELECT tanggal, COUNT(*) as total FROM log_aktivitas WHERE YEAR(tanggal) = 2024 AND bulan = 6 GROUP BY tanggal; (b) Identifikasi minimal 3 masalah pada query tersebut, (c) Tulis ulang query yang lebih optimal, (d) Rancang strategi RANGE Partitioning per tahun untuk tabel ini beserta SQL-nya!',
    'essay', 'sulit',
    'Jawaban ideal:

(a) EXPLAIN OUTPUT (perkiraan untuk tabel 50 juta baris tanpa optimasi):
+----+--------+----------------+------+------+-----+-----------------------------+
| id | type   | table          | key  | rows | Extra                       |
+----+--------+----------------+------+------+-----+-----------------------------+
|  1 | ALL    | log_aktivitas  | NULL | 50M  | Using where; Using filesort |
+----+--------+----------------+------+------+-----+-----------------------------+

Interpretasi:
- type = ALL → FULL TABLE SCAN pada 50 juta baris (sangat buruk)
- key = NULL → tidak ada index yang digunakan
- rows = 50M → database memperkirakan harus baca 50 juta baris
- Using filesort → pengurutan dilakukan di memori (tambah lambat)

(b) 3 MASALAH PADA QUERY:
1. YEAR(tanggal) = 2024 — membungkus kolom tanggal dengan fungsi YEAR() mencegah penggunaan index pada kolom tanggal. Ini penyebab utama full scan.
2. Kolom "bulan" yang terpisah dari "tanggal" — redundan, sebaiknya gunakan MONTH(tanggal) atau range tanggal.
3. SELECT * tidak digunakan tapi GROUP BY tanggal menyebabkan filesort — perlu index pada tanggal.

(c) QUERY OPTIMAL:
-- Ganti YEAR(tanggal) dengan range BETWEEN agar index bisa digunakan:
SELECT DATE(tanggal) AS hari, COUNT(*) AS total
FROM log_aktivitas
WHERE tanggal >= ''2024-06-01''
  AND tanggal <  ''2024-07-01''
GROUP BY DATE(tanggal)
ORDER BY hari;

-- Tambahkan index:
CREATE INDEX idx_log_tanggal ON log_aktivitas(tanggal);

-- Setelah optimasi, EXPLAIN akan menunjukkan type = range, key = idx_log_tanggal

(d) RANGE PARTITIONING PER TAHUN:
ALTER TABLE log_aktivitas
PARTITION BY RANGE (YEAR(tanggal)) (
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- Keuntungan: query dengan filter tahun/bulan hanya scan partisi relevan (partition pruning)
-- Query bulan Juni 2024 hanya scan partisi p2024 (~12 juta baris) bukan 50 juta baris

-- Tambahkan partisi tahun baru setiap tahun:
ALTER TABLE log_aktivitas REORGANIZE PARTITION p_future INTO (
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

Nilai penuh: interpretasi EXPLAIN (type + key + rows) + 3 masalah teridentifikasi + query fix BETWEEN + CREATE INDEX + PARTITION BY RANGE SQL lengkap + penjelasan partition pruning.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan konsep "Query Execution Plan" dan bagaimana cara membacanya untuk mengidentifikasi bottleneck! Kemudian bandingkan strategi optimasi: (a) menambah RAM server, (b) menambah index, (c) optimasi query (rewrite), (d) partitioning tabel, (e) caching (Redis). Untuk masing-masing strategi: kapan efektif, kapan tidak efektif, dan berapa estimasi biaya implementasinya (murah/sedang/mahal)!',
    'essay', 'sedang',
    'Jawaban ideal:

QUERY EXECUTION PLAN:
Adalah rencana langkah-langkah yang dipilih query optimizer untuk mengeksekusi query. Dilihat dengan EXPLAIN (MySQL) atau EXPLAIN ANALYZE (PostgreSQL). Informasi penting yang dibaca:
- type/scan type: ALL (buruk) → range → ref → const (terbaik)
- rows: estimasi jumlah baris yang dibaca — makin kecil makin baik
- key: index yang digunakan — NULL berarti full scan
- Extra: "Using filesort" (ada sorting mahal), "Using temporary" (ada temp table), "Using index" (covering index — bagus)
Cara identifikasi bottleneck: cari baris dengan rows terbesar dan type = ALL — itulah yang perlu dioptimasi pertama.

PERBANDINGAN STRATEGI OPTIMASI:

(a) Tambah RAM Server:
+ Efektif: saat buffer pool database penuh — lebih banyak data bisa di-cache di memori
- Tidak efektif: jika masalah adalah query buruk atau tidak ada index — RAM tidak membantu query O(n) menjadi O(log n)
Biaya: MAHAL (hardware baru) tapi cepat implementasinya — solusi sementara

(b) Tambah Index:
+ Efektif: query SELECT dengan WHERE/JOIN pada kolom yang sering difilter, kardinalitas tinggi
- Tidak efektif: kolom dengan kardinalitas rendah (gender), tabel yang sangat sering INSERT/UPDATE (overhead index maintenance)
Biaya: MURAH — hanya CREATE INDEX, tanpa downtime (MySQL: online DDL)

(c) Optimasi Query (Rewrite):
+ Efektif: query yang ditulis tidak efisien (fungsi pada kolom, subquery berulang, SELECT *)
- Tidak efektif: jika query sudah optimal tapi data memang sangat besar
Biaya: MURAH — hanya perubahan kode, tidak ada biaya infrastruktur

(d) Partitioning Tabel:
+ Efektif: tabel data historis sangat besar (> 100 juta baris), query selalu filter pada kolom partisi
- Tidak efektif: tabel kecil, query tidak memfilter kolom partisi, banyak cross-partition join
Biaya: SEDANG — perlu ALTER TABLE + pengujian, bisa butuh maintenance window

(e) Caching (Redis):
+ Efektif: data yang sama sering dibaca berkali-kali, data jarang berubah (referensi, konfigurasi, laporan)
- Tidak efektif: data yang sering berubah (real-time), query yang selalu butuh data terbaru
Biaya: SEDANG — perlu setup Redis server + ubah kode aplikasi untuk cache layer

REKOMENDASI URUTAN: (c) Optimasi query dulu (gratis) → (b) Tambah index → (d) Partitioning → (e) Redis → (a) Tambah RAM sebagai last resort.

Nilai penuh: cara baca EXPLAIN (type+rows+key+Extra) + cara identifikasi bottleneck + 5 strategi masing-masing kapan efektif + tidak efektif + estimasi biaya + urutan rekomendasi.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t3, s, 7, 25);

  -- ==========================================================
  -- TES 4: PENGANTAR NOSQL
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Teorema CAP menyatakan bahwa sistem terdistribusi tidak dapat menjamin ketiganya sekaligus. Huruf "A" dalam CAP singkatan dari...',
    'pg', 'sedang',
    'CAP Theorem (Brewer Theorem): sistem terdistribusi hanya bisa menjamin 2 dari 3: Consistency (semua node melihat data yang sama), Availability (setiap request mendapat response meski ada node yang gagal), Partition Tolerance (sistem tetap beroperasi meski ada network partition/komunikasi antar node terputus). NoSQL biasanya memilih AP (tersedia tapi mungkin data tidak konsisten sesaat) atau CP.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Accuracy (Akurasi data)',false),
    (s,'B','Availability (Ketersediaan sistem meski ada kegagalan node)',true),
    (s,'C','Atomicity (Semua operasi berhasil atau gagal sepenuhnya)',false),
    (s,'D','Asynchronicity (Operasi berjalan secara asinkron)',false),
    (s,'E','Authentication (Keamanan akses data)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'MongoDB menyimpan data dalam format...',
    'pg', 'mudah',
    'MongoDB menyimpan data sebagai BSON (Binary JSON) — format binary dari JSON yang mendukung tipe data tambahan seperti Date, ObjectId, Binary. Di MongoDB: database → collections (setara tabel) → documents (setara baris, berupa objek JSON/BSON). Documents dalam satu collection tidak harus punya struktur yang sama (schema-less / flexible schema).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Tabel relasional dengan baris dan kolom',false),
    (s,'B','File CSV yang diindeks',false),
    (s,'C','BSON (Binary JSON) documents dalam collections',true),
    (s,'D','XML dengan schema yang ketat',false),
    (s,'E','Key-value pairs dalam hash map',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perintah MongoDB untuk mencari semua dokumen di collection "siswa" di mana nilai field "kelas" adalah "XII RPL" adalah...',
    'pg', 'sedang',
    'db.collection.find({query}) adalah cara dasar query di MongoDB. db.siswa.find({ kelas: "XII RPL" }) mencari dokumen dengan field kelas bernilai "XII RPL". Untuk kondisi lebih kompleks: $gt, $lt, $in, $and, $or, $regex, dll. Untuk satu dokumen: findOne(). Untuk update: updateOne/updateMany. Untuk hapus: deleteOne/deleteMany.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','db.siswa.select({ kelas: "XII RPL" })',false),
    (s,'B','db.siswa.query("kelas = XII RPL")',false),
    (s,'C','db.siswa.find({ kelas: "XII RPL" })',true),
    (s,'D','SELECT * FROM siswa WHERE kelas = "XII RPL"',false),
    (s,'E','db.siswa.get({ where: { kelas: "XII RPL" } })',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jenis database NoSQL yang paling tepat untuk menyimpan data sesi (session) pengguna yang hanya butuh key-value sederhana dengan TTL (time-to-live) adalah...',
    'pg', 'sedang',
    'Key-Value Store (contoh: Redis, Memcached) ideal untuk session karena: (1) struktur session sederhana — key = session_id, value = data session, (2) mendukung TTL otomatis (data dihapus otomatis setelah expired), (3) sangat cepat karena data di-store di memori (in-memory). Document DB (MongoDB) terlalu berat untuk session. Graph DB untuk relasi antar entitas kompleks. Column-family untuk analytics skala besar.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Document Database (MongoDB)',false),
    (s,'B','Graph Database (Neo4j)',false),
    (s,'C','Key-Value Store (Redis)',true),
    (s,'D','Column-Family Database (Cassandra)',false),
    (s,'E','Time-Series Database (InfluxDB)',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Kapan sebaiknya menggunakan database NoSQL daripada database relasional (SQL)?',
    'pg', 'sedang',
    'NoSQL lebih tepat untuk: (1) data tidak terstruktur atau semi-terstruktur (skema berubah-ubah), (2) volume data sangat besar (Big Data) yang perlu horizontal scaling mudah, (3) perlu fleksibilitas skema cepat (startup, MVP), (4) data berbentuk dokumen/graph/key-value secara alami, (5) ketersediaan tinggi lebih penting dari konsistensi ketat. SQL tetap lebih baik untuk: data terstruktur, relasi kompleks, transaksi ACID kritis, laporan kompleks.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Saat data memiliki relasi yang sangat kompleks antar entitas',false),
    (s,'B','Saat membutuhkan transaksi ACID yang ketat seperti transfer uang bank',false),
    (s,'C','Saat data tidak terstruktur, skema sering berubah, atau volume sangat besar dan perlu horizontal scaling',true),
    (s,'D','NoSQL selalu lebih baik dari SQL dalam semua kondisi',false),
    (s,'E','Saat ingin membuat laporan bisnis kompleks dengan banyak JOIN',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Sebuah aplikasi e-learning perlu menyimpan data "progress belajar siswa" yang strukturnya sangat bervariasi per mata pelajaran (ada yang punya video, kuis, tugas, proyek). Tim dev mempertimbangkan MongoDB. Implementasikan: (a) rancang skema dokumen MongoDB yang fleksibel untuk progress siswa dengan nested dokumen, (b) operasi CRUD: insert satu progress baru, find progress siswa tertentu, update nilai kuis, delete progress, (c) buat agregasi MongoDB untuk menghitung rata-rata nilai kuis per mata pelajaran di seluruh siswa!',
    'essay', 'sulit',
    'Jawaban ideal:

(a) SKEMA DOKUMEN MONGODB (flexible schema):
// Collection: progress_siswa
{
  _id: ObjectId("..."),
  id_siswa: "NIS-001",
  nama_siswa: "Budi Santoso",
  kelas: "XII RPL",
  mapel: "Pemrograman Web",
  id_mapel: "mapel-pw-001",
  periode: "2024/2025",
  updated_at: ISODate("2024-12-15T10:30:00Z"),
  materi: [
    {
      judul: "HTML Dasar",
      tipe: "video",
      durasi_tonton: 3600,  // detik
      selesai: true,
      tgl_selesai: ISODate("2024-11-01")
    },
    {
      judul: "CSS Flexbox",
      tipe: "video",
      durasi_tonton: 1800,
      selesai: false
    }
  ],
  kuis: [
    {
      judul: "Kuis HTML",
      nilai: 85,
      percobaan: 2,
      max_percobaan: 3,
      tgl_terakhir: ISODate("2024-11-05")
    }
  ],
  tugas: [
    {
      judul: "Buat Form Login",
      file_url: "https://storage/tugas/form-login.zip",
      nilai_guru: 90,
      feedback: "Bagus, tinggal tambah validasi",
      submitted_at: ISODate("2024-11-10")
    }
  ],
  total_progress_persen: 65
}

(b) OPERASI CRUD:
// INSERT
db.progress_siswa.insertOne({
  id_siswa: "NIS-002",
  nama_siswa: "Siti Rahayu",
  mapel: "Basis Data",
  kuis: [],
  materi: [],
  total_progress_persen: 0,
  updated_at: new Date()
});

// FIND progress siswa tertentu
db.progress_siswa.find(
  { id_siswa: "NIS-001" },
  { nama_siswa: 1, mapel: 1, total_progress_persen: 1 }
);

// UPDATE nilai kuis (update nested array)
db.progress_siswa.updateOne(
  { id_siswa: "NIS-001", "kuis.judul": "Kuis HTML" },
  {
    $set: {
      "kuis.$.nilai": 92,
      updated_at: new Date()
    }
  }
);

// DELETE progress
db.progress_siswa.deleteOne({ id_siswa: "NIS-001", mapel: "Pemrograman Web" });

(c) AGREGASI rata-rata nilai kuis per mapel:
db.progress_siswa.aggregate([
  // Unwind array kuis agar setiap kuis jadi dokumen terpisah
  { $unwind: "$kuis" },
  // Filter hanya kuis yang sudah dinilai
  { $match: { "kuis.nilai": { $exists: true, $gt: 0 } } },
  // Group by mapel, hitung rata-rata
  {
    $group: {
      _id: "$mapel",
      rata_nilai_kuis: { $avg: "$kuis.nilai" },
      total_kuis: { $sum: 1 },
      total_siswa: { $addToSet: "$id_siswa" }
    }
  },
  // Hitung jumlah siswa unik
  { $addFields: { total_siswa: { $size: "$total_siswa" } } },
  // Urutkan dari rata-rata tertinggi
  { $sort: { rata_nilai_kuis: -1 } }
]);

Nilai penuh: skema nested dokumen (materi+kuis+tugas array) + insertOne + find dengan projection + updateOne dengan positional operator ($) + deleteOne + aggregate dengan $unwind + $group $avg + $sort.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Bandingkan 4 kategori utama database NoSQL (Document, Key-Value, Column-Family, Graph) dari segi struktur data, contoh produk, keunggulan, dan use case terbaik! Kemudian, untuk sistem sekolah yang memiliki fitur: (1) manajemen nilai siswa, (2) session login, (3) feed aktivitas/notifikasi, (4) peta relasi alumni — rekomendasikan jenis database yang paling tepat untuk masing-masing fitur dan jelaskan alasannya!',
    'essay', 'sedang',
    'Jawaban ideal:

4 KATEGORI NOSQL:

1. Document Database:
   Struktur: Dokumen JSON/BSON yang bisa nested, schema flexible
   Contoh: MongoDB, CouchDB, Firestore
   Keunggulan: Fleksibel, mudah diquery, natural untuk data OOP
   Best use case: Katalog produk, profil pengguna, konten CMS, e-commerce

2. Key-Value Store:
   Struktur: Pasangan key → value sederhana (string, hash, list, set)
   Contoh: Redis, DynamoDB, Memcached
   Keunggulan: Sangat cepat (in-memory), TTL bawaan, atomic operations
   Best use case: Session, cache, real-time leaderboard, queue

3. Column-Family Database:
   Struktur: Data dikelompokkan per kolom (bukan baris), kompresi tinggi
   Contoh: Apache Cassandra, HBase, ScyllaDB
   Keunggulan: Write throughput sangat tinggi, distribusi skala besar (petabyte), time-series
   Best use case: IoT sensor data, log analytics, time-series, social media feed skala Twitter

4. Graph Database:
   Struktur: Nodes (entitas) + Edges (relasi) + Properties
   Contoh: Neo4j, Amazon Neptune, ArangoDB
   Keunggulan: Query relasi kompleks sangat cepat (traversal), tidak butuh JOIN
   Best use case: Sosial network, rekomendasi (juga beli), fraud detection, knowledge graph

REKOMENDASI UNTUK SISTEM SEKOLAH:

(1) Manajemen nilai siswa:
→ SQL (MySQL/PostgreSQL) — Data terstruktur (siswa, mapel, nilai), butuh transaksi ACID, banyak relasi dan laporan JOIN, integritas referensial penting. NoSQL tidak tepat di sini.

(2) Session login:
→ Redis (Key-Value) — session_id sebagai key, data session sebagai value, TTL otomatis saat logout/expired, sangat cepat (in-memory). Sempurna untuk session.

(3) Feed aktivitas/notifikasi:
→ Redis (List/Stream) atau MongoDB — Redis List untuk real-time feed yang cepat. MongoDB jika feed perlu query kompleks (filter by type, date range). Feed bersifat append-only dan jarang diupdate — cocok NoSQL.

(4) Peta relasi alumni:
→ Neo4j (Graph Database) — relasi alumni sangat kompleks: lulus tahun berapa, sekarang bekerja di mana, teman seangkatan siapa, mentor siapa. Graph query sangat efisien untuk "temukan alumni yang connected ke perusahaan X dalam 2 derajat" — mustahil efisien di SQL JOIN.

Nilai penuh: 4 kategori (struktur+contoh+keunggulan+use case) + rekomendasi 4 fitur sekolah dengan alasan masing-masing (SQL untuk nilai — alasan tepat, Redis untuk session, NoSQL untuk feed, Graph untuk relasi alumni).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t4, s, 7, 25);

  -- ==========================================================
  -- TES 5: KEAMANAN BASIS DATA LANJUTAN
  -- ==========================================================

  -- PG 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Perintah SQL untuk memberikan hak SELECT dan INSERT pada tabel "nilai" kepada user "guru_app" di MySQL adalah...',
    'pg', 'mudah',
    'GRANT privilege ON objek TO user adalah sintaks pemberian hak akses. REVOKE untuk mencabut. Contoh: GRANT SELECT, INSERT ON sekolah.nilai TO ''guru_app''@''localhost''; Prinsip least privilege: berikan hak minimum yang dibutuhkan. Untuk DBA: GRANT ALL PRIVILEGES ON *.* TO ''admin''@''localhost'' WITH GRANT OPTION.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','ALLOW SELECT, INSERT ON nilai TO guru_app',false),
    (s,'B','PERMIT SELECT, INSERT ON nilai FOR guru_app',false),
    (s,'C','GRANT SELECT, INSERT ON nilai TO ''guru_app''@''localhost''',true),
    (s,'D','SET PRIVILEGE SELECT, INSERT ON nilai TO guru_app',false),
    (s,'E','ADD ACCESS SELECT, INSERT ON nilai FOR guru_app',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 1, 10);

  -- PG 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Enkripsi "data at-rest" pada database berarti...',
    'pg', 'sedang',
    'Data at-rest = data yang sedang disimpan (di disk/storage), bukan sedang dikirim. Enkripsi at-rest melindungi jika storage fisik dicuri atau ada akses langsung ke file database. Implementasi: Transparent Data Encryption (TDE) di enterprise DB, enkripsi di level kolom (AES_ENCRYPT di MySQL), atau enkripsi di level storage/OS. Data in-transit = data yang sedang dikirim melalui jaringan (dilindungi dengan TLS/SSL).')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Mengenkripsi data yang sedang dikirim antara aplikasi dan database melalui jaringan',false),
    (s,'B','Mengenkripsi query SQL sebelum dikirim ke database server',false),
    (s,'C','Mengenkripsi data yang tersimpan di disk sehingga aman meski storage fisik dicuri',true),
    (s,'D','Mengenkripsi password user di tabel users agar tidak terbaca plaintext',false),
    (s,'E','Mengenkripsi koneksi database menggunakan SSL/TLS',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 2, 10);

  -- PG 3
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Row-Level Security (RLS) pada database memungkinkan...',
    'pg', 'sedang',
    'Row-Level Security (didukung PostgreSQL secara native, MySQL via VIEW/aplikasi): membatasi baris mana yang bisa dilihat/dimodifikasi oleh user tertentu di level database — bukan di level aplikasi. Contoh: guru hanya bisa melihat nilai siswa di kelasnya, siswa hanya bisa melihat nilainya sendiri. Policy dibuat dengan CREATE POLICY. Lebih aman dari filter di aplikasi yang bisa di-bypass.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Membatasi jumlah baris yang bisa dikembalikan dalam satu query',false),
    (s,'B','Mengenkripsi baris tertentu yang ditandai sebagai sensitif',false),
    (s,'C','Membatasi baris mana yang bisa diakses user tertentu di level database berdasarkan policy',true),
    (s,'D','Mengunci baris agar tidak bisa diubah selama transaksi berlangsung',false),
    (s,'E','Menyembunyikan kolom tertentu dari hasil query',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 3, 10);

  -- PG 4
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Teknik "SQL Injection Second Order" berbeda dari SQL Injection biasa karena...',
    'pg', 'sedang',
    'Second-Order SQL Injection: data berbahaya disimpan terlebih dahulu ke database (tahap 1, mungkin sudah di-escape dengan benar), kemudian diambil kembali dan digunakan tanpa sanitasi dalam query lain (tahap 2). Lebih berbahaya karena lebih sulit dideteksi — tidak muncul langsung saat input. Contoh: username "admin''--" disimpan aman, tapi saat diambil untuk query "UPDATE users SET nama = ''$username''" menjadi berbahaya.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Second-order injection menggunakan dua query sekaligus dalam satu request',false),
    (s,'B','Payload berbahaya disimpan dulu ke database, lalu dieksekusi saat data tersebut diambil dan digunakan di query lain',true),
    (s,'C','Second-order injection hanya menyerang database NoSQL, bukan relasional',false),
    (s,'D','Second-order injection lebih mudah dicegah dari SQL injection biasa',false),
    (s,'E','Serangan dilakukan dari dua browser berbeda secara bersamaan',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 4, 10);

  -- PG 5
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Database Audit Log berguna untuk...',
    'pg', 'mudah',
    'Audit log mencatat semua aktivitas database: siapa mengakses data apa, kapan, dari mana (IP), query apa yang dijalankan, apakah berhasil atau gagal. Berguna untuk: (1) investigasi insiden keamanan (siapa yang hapus data?), (2) compliance/regulasi (GDPR, PCI-DSS, HIPAA mensyaratkan audit trail), (3) deteksi akses tidak wajar, (4) forensik setelah breach. Bukan untuk meningkatkan kecepatan query.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.opsi_jawaban_kompetensi (id_soal_kompetensi, label, isi_opsi, is_benar) VALUES
    (s,'A','Meningkatkan kecepatan query dengan mencache hasil query yang sering dipakai',false),
    (s,'B','Mencatat semua aktivitas database untuk investigasi insiden keamanan dan pemenuhan regulasi',true),
    (s,'C','Membuat backup otomatis setiap kali ada perubahan data',false),
    (s,'D','Memblokir query yang mencurigakan secara otomatis sebelum dieksekusi',false),
    (s,'E','Mengompres log transaksi agar tidak memenuhi disk',false);
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 5, 10);

  -- Essay 1
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Rancang sistem keamanan database berlapis (defense in depth) untuk database sekolah yang menyimpan data sensitif (nilai, biodata siswa, data keuangan)! Sistem harus mencakup: (a) manajemen user dan privilege (buat minimal 4 role berbeda dengan hak akses sesuai), (b) enkripsi data sensitif di level kolom menggunakan AES, (c) implementasi audit log dengan trigger untuk operasi DELETE pada tabel nilai, (d) konfigurasi koneksi aman (SSL/TLS), (e) prosedur response jika terjadi data breach!',
    'essay', 'sulit',
    'Jawaban ideal:

(a) MANAJEMEN USER & PRIVILEGE (Least Privilege):

-- 1. App User — untuk aplikasi web (hanya CRUD yang dibutuhkan)
CREATE USER ''app_web''@''%'' IDENTIFIED BY ''p@ssw0rd_k0mpleks_123'';
GRANT SELECT, INSERT, UPDATE ON sekolah.siswa TO ''app_web''@''%'';
GRANT SELECT, INSERT, UPDATE ON sekolah.nilai TO ''app_web''@''%'';
GRANT SELECT ON sekolah.kelas TO ''app_web''@''%'';
-- TIDAK: DELETE, DROP, ALTER, CREATE

-- 2. Read-Only User — untuk laporan dan guru lihat nilai
CREATE USER ''guru_readonly''@''192.168.1.%'' IDENTIFIED BY ''readonly_pass'';
GRANT SELECT ON sekolah.nilai TO ''guru_readonly''@''192.168.1.%'';
GRANT SELECT ON sekolah.siswa TO ''guru_readonly''@''192.168.1.%'';

-- 3. Backup User — hanya untuk proses backup, tidak bisa mengubah data
CREATE USER ''backup_user''@''localhost'' IDENTIFIED BY ''backup_pass'';
GRANT SELECT, LOCK TABLES, SHOW VIEW, EVENT, TRIGGER ON sekolah.* TO ''backup_user''@''localhost'';

-- 4. DBA User — hanya dari localhost, tidak dari luar
CREATE USER ''dba_admin''@''127.0.0.1'' IDENTIFIED BY ''super_secret_dba_pass'';
GRANT ALL PRIVILEGES ON sekolah.* TO ''dba_admin''@''127.0.0.1'' WITH GRANT OPTION;

FLUSH PRIVILEGES;

(b) ENKRIPSI KOLOM SENSITIF:
-- Simpan data terenkripsi
INSERT INTO siswa (nama, nisn, no_hp, tanggal_lahir)
VALUES (
    ''Budi Santoso'',
    AES_ENCRYPT(''0012345678'', UNHEX(SHA2(''kunci_rahasia_sekolah'', 256))),
    AES_ENCRYPT(''081234567890'', UNHEX(SHA2(''kunci_rahasia_sekolah'', 256))),
    ''2006-05-15''
);

-- Baca data terenkripsi
SELECT nama,
       CAST(AES_DECRYPT(nisn, UNHEX(SHA2(''kunci_rahasia_sekolah'', 256))) AS CHAR) AS nisn_asli
FROM siswa WHERE id = 1;

(c) AUDIT LOG TRIGGER:
CREATE TABLE audit_delete_nilai (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    id_nilai    INT,
    id_siswa    INT,
    id_mapel    INT,
    nilai_lama  DECIMAL(5,2),
    dihapus_oleh VARCHAR(100),
    waktu_hapus  DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address   VARCHAR(50)
);

DELIMITER $$
CREATE TRIGGER trg_audit_delete_nilai
BEFORE DELETE ON nilai
FOR EACH ROW
BEGIN
    INSERT INTO audit_delete_nilai
        (id_nilai, id_siswa, id_mapel, nilai_lama, dihapus_oleh)
    VALUES
        (OLD.id, OLD.id_siswa, OLD.id_mapel, OLD.nilai_akhir, CURRENT_USER());
END$$
DELIMITER ;

(d) KONEKSI AMAN SSL/TLS (di my.cnf):
[mysqld]
ssl-ca=/etc/mysql/ssl/ca-cert.pem
ssl-cert=/etc/mysql/ssl/server-cert.pem
ssl-key=/etc/mysql/ssl/server-key.pem
require_secure_transport=ON

-- User wajib SSL:
ALTER USER ''app_web''@''%'' REQUIRE SSL;

(e) PROSEDUR RESPONSE DATA BREACH:
1. DETEKSI (0-1 jam): Monitor audit log anomali, alert jika ada akses tidak biasa (jam tengah malam, volume query besar, export banyak baris)
2. CONTAINMENT (1-2 jam): Segera blokir akun yang dicurigai, isolasi server dari jaringan luar, revoke semua credential yang mungkin terkompromisi
3. ASSESSMENT (2-4 jam): Analisis audit log — data apa yang diakses/dicuri, dari IP mana, metode apa
4. NOTIFICATION (< 72 jam per GDPR): Notifikasi ke pihak berwenang, informasikan siswa yang datanya terdampak
5. RECOVERY: Ganti semua password DB, rotate encryption key, patch celah yang digunakan
6. POST-INCIDENT: Review dan perkuat security policy, pelatihan awareness untuk staf

Nilai penuh: 4 role dengan hak berbeda + AES_ENCRYPT/DECRYPT + trigger BEFORE DELETE ke audit table + konfigurasi SSL + 5+ langkah breach response dengan estimasi waktu.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 6, 25);

  -- Essay 2
  INSERT INTO public.soal_kompetensi (id_jurusan, pertanyaan, tipe_soal, tingkat_kesulitan, pembahasan)
  VALUES (v_jur,
    'Jelaskan konsep "Defense in Depth" (keamanan berlapis) dalam konteks keamanan database! Identifikasi minimal 6 lapisan keamanan yang harus ada dari lapisan terluar (jaringan) sampai lapisan terdalam (data). Kemudian, analisislah skenario serangan: seorang mantan karyawan yang masih ingat password root database mencoba mengakses data siswa dari luar kantor — lapisan keamanan mana yang akan menghentikannya, dan bagaimana?',
    'essay', 'sedang',
    'Jawaban ideal:

DEFENSE IN DEPTH — KEAMANAN BERLAPIS:

Konsep: tidak mengandalkan satu lapisan keamanan saja. Jika satu lapisan berhasil ditembus, lapisan berikutnya masih melindungi. Seperti bawang berlapis — penyerang harus menembus semua lapisan.

6 LAPISAN KEAMANAN DATABASE:

1. Lapisan Jaringan (Network):
   - Firewall: hanya izinkan koneksi ke port 3306 (MySQL) dari IP server aplikasi, blokir dari internet
   - VPN: akses database dari luar kantor harus lewat VPN dengan autentikasi 2FA
   - Network segmentation: server DB di subnet terpisah dari zona publik

2. Lapisan Sistem Operasi (OS):
   - Minimal OS install (tidak ada software tidak perlu)
   - Patch OS rutin untuk menutup vulnerability
   - MySQL berjalan sebagai user non-root OS
   - File permission ketat pada direktori data MySQL

3. Lapisan Autentikasi Database:
   - Password kompleks untuk semua user DB
   - Batasi host yang boleh konek (''user''@''192.168.1.10'' bukan ''user''@''%'')
   - Multi-factor authentication untuk akun DBA
   - Rotasi password berkala, hapus user yang tidak aktif

4. Lapisan Otorisasi (Privilege):
   - Prinsip least privilege: setiap user hanya punya hak minimum
   - Role-based access, tidak ada shared account
   - Audit dan review privilege secara berkala

5. Lapisan Data (Enkripsi):
   - Enkripsi data at-rest (TDE atau enkripsi kolom AES)
   - Enkripsi data in-transit (SSL/TLS untuk semua koneksi)
   - Enkripsi backup

6. Lapisan Monitoring & Audit:
   - Audit log semua aktivitas (login berhasil/gagal, query sensitif, perubahan privilege)
   - Alerting real-time jika ada anomali (login jam tidak wajar, banyak SELECT besar)
   - Database Activity Monitoring (DAM)

ANALISIS SERANGAN MANTAN KARYAWAN:

Skenario: mantan karyawan tahu password root, coba akses dari rumah.

Lapisan 1 — FIREWALL (DIBLOKIR):
Port 3306 hanya terbuka untuk IP server aplikasi internal. Koneksi dari IP rumah langsung ditolak firewall sebelum sampai ke server DB. Jika firewall dikonfigurasi benar, serangan berhenti di sini.

Lapisan 2 — HOST RESTRICTION (DIBLOKIR sebagai backup):
Meski lolos firewall, akun ''root''@''localhost'' atau ''root''@''192.168.1.%'' tidak mengizinkan koneksi dari IP luar. MySQL menolak koneksi.

Lapisan 3 — PASSWORD ROTASI (DIBLOKIR):
Setelah karyawan resign, prosedur offboarding yang benar langsung menonaktifkan dan mengganti semua password yang pernah diketahuinya. Password lama sudah tidak valid.

Lapisan 4 — AUDIT LOG (TERDETEKSI):
Meski semua percobaan gagal, setiap attempt login tercatat. Alert otomatis dikirim ke security tim: "Login gagal 5x dari IP asing 203.x.x.x untuk user root". Tim bisa investigasi dan ambil tindakan hukum.

Kesimpulan: Defense in depth memastikan bahkan jika satu lapisan gagal (misal firewall misconfigured), masih ada 3+ lapisan yang melindungi. Mantan karyawan sangat kecil kemungkinan berhasil menembus semua lapisan.

Nilai penuh: konsep defense in depth + 6 lapisan dengan contoh konkret + analisis skenario serangan dengan lapisan mana yang menghentikan (minimal 3 lapisan disebutkan) + skenario audit log detection.')
  RETURNING id_soal_kompetensi INTO s;
  INSERT INTO public.kompetensi_tugas_soal (id_kompetensi_tugas, id_soal, nomor, bobot) VALUES (t5, s, 7, 25);

  RAISE NOTICE 'Seed berhasil: 1 kompetensi "Basis Data Advance" (tingkat=12, urutan=1), 5 tes, 35 soal (25 PG 5-opsi + 10 essay).';
END $block$;
