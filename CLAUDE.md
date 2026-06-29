@AGENTS.md

# Portal Sakuci

LMS + manajemen akademik untuk SMK (vocational high school), 5 role: **admin, kajur, guru, siswa, bkk**.
Next.js 16 (App Router, `src/`) + Supabase (Postgres + Auth + Storage) + shadcn/ui (berbasis `@base-ui/react`, **bukan** Radix) + Tailwind v4.

## Struktur & konvensi inti

- **Middleware** ada di `src/proxy.ts` (bukan `src/middleware.ts`) — Next.js 16 men-deprecate konvensi lama. Export function harus bernama `proxy`, bukan `middleware`. Logikanya didelegasikan ke `src/lib/supabase/middleware.ts` (`updateSession`).
- **3 Supabase client**: `src/lib/supabase/client.ts` (browser), `server.ts` (cookies-aware, untuk Server Component/Action), `admin.ts` (service role, bypass RLS — hanya untuk operasi server-side: aktivasi, reset password, backup, landing page publik).
- **Auth helper**: `src/lib/auth.ts` — `getCurrentProfile()`, `requireRole(roles[])` (dipakai di tiap `layout.tsx` sebagai lapisan kedua setelah middleware), `requireKajurJurusan()` (khusus kajur, redirect ke dashboard dgn pesan error kalau `id_jurusan` belum di-set admin).
- **Login**: email + password + pilih tahun ajaran (disimpan di cookie `ta_aktif`). **Aktivasi** akun baru: guru pakai `uid_fp` + `no_hp`, siswa pakai `nisn` + `tanggal_lahir` — keduanya bikin Supabase Auth user + baris `profiles` + `akun_guru`/`akun_siswa` via service role (`src/app/aktivasi/actions.ts`).
- Setiap role punya folder `src/app/{role}/` dengan `layout.tsx` (sidebar + topbar via `requireRole`), `dashboard/`, dan halaman fitur masing-masing.

## Komponen reusable penting

- **`SimpleCrud`** (`src/components/simple-crud.tsx`) — tabel+dialog CRUD generik, field types: `text/date/checkbox/select/textarea`. Dipakai di hampir semua CRUD sederhana (Jurusan, Mapel, Roadmap Kompetensi, dll). Punya prop `renderExtraActions` untuk tombol custom di kolom Aksi (mis. ikon mata buka modal).
- **`useTableControls`** + **`SortableHead`/`TablePagination`** — pola sorting & pagination (10/50/100) yang dipakai di semua tabel.
- **`fetchAllRows`** (`src/lib/fetch-all.ts`) — PostgREST default limit 1000 baris/request; helper ini paginasi otomatis via `.range()`. **Selalu pakai ini** untuk list yang potensial besar (siswa, sertifikat, dll), jangan query langsung tanpa range kalau datanya bisa >1000 baris.
- **`InitialsAvatar`** (`src/components/initials-avatar.tsx`) — terima `fotoUrl` opsional, fallback ke inisial nama.
- **`YoutubeThumbnail`** — ekstrak video ID dari berbagai format URL YouTube, tampilkan thumbnail `hqdefault.jpg` + ikon play.
- **`CertificateView`** (`src/components/certificate-view.tsx`) — desain sertifikat bertema circuit/tech elegan, dipakai ulang di 3 tempat (kajur/siswa/bkk cetak sertifikat).

## Skema database (real, sudah banyak berubah dari draft awal)

Tabel utama: `roles`, `profiles` (id_profile = auth.users.id, `id_role`, **`id_jurusan`** untuk scoping kajur), `jurusan` (+ `deskripsi`, `kode_jurusan`), `tahun_ajaran` (+ `semester`), `kelas`, `guru`, `siswa` (+ `foto_url`), `akun_guru`, `akun_siswa`, `mapel`, `mengajar`.

Kompetensi/roadmap: `kompetensi` (di-scope ke `id_jurusan`), `progres_kompetensi`, `sertifikat` (snapshot `nama_kajur`/`jabatan_kajur`/`kode_verifikasi`/`qr_code` saat terbit), `kompetensi_tugas`, `kompetensi_tugas_soal`, `pengumpulan_kompetensi`, `jawaban_kompetensi_siswa`.

**`soal_kompetensi` + `opsi_jawaban_kompetensi`** — bank soal **terpisah** dari `bank_soal` milik guru, khusus dipakai untuk tes kompetensi/roadmap (kajur).

Pembelajaran harian: `materi`, `tugas` (+ **`semester`** — lihat catatan di bawah), `pengumpulan_tugas`, `bank_soal`, `opsi_jawaban`, `tugas_soal`, `jawaban_tugas_siswa`, `nilai_komponen`, `nilai_siswa`.

Lainnya: `pengumuman`, `log_aktivitas`, `informasi_sekolah` (+ `visi`, `misi`), `project_siswa` (+ `status` pending/approved/rejected, `catatan_kajur`, snapshot `id_kelas`/`id_tahun_ajaran` saat dibuat).

Semua migration ada di `supabase/migrations/0001`–`0014` (sequential, sudah dijalankan manual oleh user via SQL Editor — **tidak ada akses eksekusi SQL langsung dari environment ini**, tidak ada psql/connection string). **Migration baru harus ditulis sebagai file, lalu user diminta jalankan manual sebelum kode yang bergantung padanya dibangun** — selalu konfirmasi dulu.

## Keputusan bisnis penting

- **Kajur di-scope ke satu jurusan** via `profiles.id_jurusan` (diatur Admin di `/admin/kajur`). Semua halaman kajur (roadmap, validasi, sertifikat, rekap, inovasi siswa, laporan) filter by jurusan ini DAN verifikasi ownership di tiap server action (bukan cuma di query list) — supaya kajur PPLG tidak bisa modifikasi data MPLB lewat manipulasi request.
- **Satu kompetensi (roadmap item) bisa punya beberapa `kompetensi_tugas` (tes)**. Siswa harus **lulus semua tes** baru `progres_kompetensi` jadi `'lulus'` — lihat `recomputeProgresKompetensi()` di `src/lib/kompetensi-progress.ts`, dipanggil setiap kali ada tes baru dinilai (oleh siswa sendiri untuk PG, atau kajur untuk essay).
- **Nilai Akhir sertifikat dihitung ulang setiap kali ditampilkan** (bukan dibekukan saat terbit) via `hitungNilaiAkhir()` — supaya kalau ada tes baru ditambahkan, nilai akhir ikut update. Kalau ada tes yang skornya turun di bawah syarat lulus, otomatis muncul watermark **"TIDAK LULUS"** merah (`cekStatusLulus()`).
- **Jabatan di tanda tangan sertifikat dinamis** per jurusan ("Ketua Program Keahlian {kode}") via `getJabatanKajur()`.
- **`project_siswa` (inovasi siswa) butuh approval kajur** (`status='approved'`) sebelum tampil di landing page publik. Edit ulang oleh siswa otomatis reset status ke `pending`.
- **Landing page publik** (`src/app/page.tsx`) — tampil untuk pengunjung anonim di `/`; yang sudah login otomatis redirect ke dashboard masing-masing (middleware + page-level check). Pakai admin client untuk fetch data (bypass RLS, aman karena cuma data yang sudah `approved`/`aktif` yang ditampilkan).
- **Semester**: HANYA dipakai di `tugas.semester` untuk pemisahan laporan nilai (Guru & Siswa punya selector Ganjil/Genap di halaman Nilai). Kelas, mengajar, kompetensi, dan semua yang lain tetap berlaku 1 tahun ajaran penuh, **tidak** dipecah per semester — ini keputusan eksplisit user untuk menghindari kebingungan.
- **Storage buckets**: `bank-soal` (gambar soal + file materi, dipakai bareng), `siswa-foto` (foto profil, dikompres ke maks 500x500px JPEG quality 80% di browser sebelum upload via `src/lib/compress-image.ts` — jangan simpan foto ukuran asli).

## Gotcha teknis (sudah pernah kena, jangan ulangi)

- **shadcn `Button` TIDAK punya prop `asChild`** (base-ui, bukan Radix) — jangan pernah pakai `asChild`, styling `<Link>` langsung sebagai gantinya.
- **Dialog default punya `sm:max-w-sm`** yang menang di breakpoint ≥640px walau kita kasih `max-w-6xl` polos (urutan cascade CSS) — kalau mau dialog lebih lebar, override juga `sm:max-w-*`-nya secara eksplisit.
- **shadcn `Select` (base-ui)** tidak otomatis render label dari value yang dipilih — kasih `children` sebagai function ke `SelectValue`, atau prop `label` di `SelectItem`, supaya tidak nongol UUID mentah.
- **`.single()` Supabase JS** diam-diam return `data: null` kalau 0 baris (tidak throw) — selalu cek `if (!data) notFound()`, jangan asumsikan ada.
- **PostgREST default limit 1000 baris** — pakai `fetchAllRows()` untuk list yang bisa besar.
- Print/cetak (sertifikat, nilai): butuh `@page { size: A4 landscape; margin: 0; }` di `globals.css` + class `print:p-0`/`print:max-w-none` menjalar lewat semua wrapper layout, kalau tidak konten lompat ke halaman ke-2.
- Icon dari `lucide-react` — beberapa nama yang "kelihatan pasti ada" ternyata tidak ada di versi ini (mis. `Instagram`, `Youtube`) — cek dulu via `ls node_modules/lucide-react/dist/esm/icons/` kalau ragu.

## Preferensi user

- Bahasa Indonesia di seluruh UI.
- Desain elegan/modern: font Plus Jakarta Sans, aksen warna indigo-biru (oklch), dark mode via `next-themes`, hindari tampilan polos/grayscale.
- Mau fitur yang benar-benar jalan (bukan placeholder kosong) — kecuali memang diminta dummy (ekskul/fasilitas di landing page, belum ada tabel DB-nya).
- **Selalu minta konfirmasi user setelah migration SQL dibuat, sebelum lanjut bangun kode yang bergantung padanya** (karena tidak ada akses eksekusi SQL langsung).
