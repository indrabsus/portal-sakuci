export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Award,
  Sparkles,
  Target,
  Heart,
  MapPin,
  Mail,
  AtSign,
  Phone,
  ExternalLink,
  Compass,
  BookOpen,
  Dumbbell,
  Music,
  Camera,
  Computer,
  FlaskConical,
  Library,
  Building2,
  Trees,
  Users,
  GraduationCap,
  Layers,
  Quote,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InitialsAvatar } from "@/components/initials-avatar";
import { YoutubeThumbnail } from "@/components/youtube-thumbnail";
import { LandingNav } from "@/components/landing/landing-nav";

const EKSKUL = [
  { nama: "Pramuka", desc: "Membentuk jiwa kepemimpinan, kemandirian, dan kedisiplinan siswa.", icon: Compass },
  { nama: "Rohis", desc: "Pembinaan keagamaan dan akhlak mulia bagi seluruh siswa.", icon: Heart },
  { nama: "Futsal", desc: "Mengasah kerja sama tim dan sportivitas melalui olahraga.", icon: Dumbbell },
  { nama: "Paduan Suara", desc: "Mengembangkan minat dan talenta siswa di bidang seni musik.", icon: Music },
  { nama: "Jurnalistik & Fotografi", desc: "Melatih kemampuan menulis, dokumentasi, dan publikasi sekolah.", icon: Camera },
  { nama: "PMR", desc: "Pelatihan pertolongan pertama dan kepedulian sosial.", icon: Heart },
];

const FASILITAS = [
  { nama: "Lab Komputer", desc: "Ruang praktik dengan perangkat dan jaringan terkini.", icon: Computer },
  { nama: "Perpustakaan", desc: "Koleksi buku lengkap dan ruang baca yang nyaman.", icon: Library },
  { nama: "Masjid Sekolah", desc: "Tempat ibadah dan pembinaan rohani warga sekolah.", icon: Building2 },
  { nama: "Lab Praktik Kejuruan", desc: "Ruang praktik sesuai kompetensi keahlian masing-masing jurusan.", icon: FlaskConical },
  { nama: "Lapangan Olahraga", desc: "Area olahraga dan kegiatan ekstrakurikuler luar ruang.", icon: Trees },
  { nama: "Ruang Multimedia", desc: "Ruang serbaguna untuk presentasi dan kegiatan kreatif siswa.", icon: BookOpen },
];

const FOTO_JURUSAN: Record<string, string> = {
  PPLG: "/jurusan/rpl.jpg",
  AKL: "/jurusan/ak.jpg",
  PM: "/jurusan/bdp.jpg",
  MPLB: "/jurusan/mplb.jpg",
};

export default async function HomePage() {
  const admin = createAdminClient();

  const [
    { data: sekolah },
    { data: jurusanList },
    { data: kajurList },
    { data: sertifikatList },
    { data: projectList },
    { count: totalSiswa },
    { count: totalGuru },
    { count: totalSertifikat },
  ] = await Promise.all([
    admin.from("informasi_sekolah").select("*").limit(1).maybeSingle(),
    admin.from("jurusan").select("id_jurusan, nama_jurusan, kode_jurusan, deskripsi").eq("aktif", true).order("nama_jurusan"),
    admin.from("profiles").select("nama_lengkap, id_jurusan").not("id_jurusan", "is", null),
    admin
      .from("sertifikat")
      .select(
        "id_sertifikat, nilai, tanggal_terbit, siswa(nama_lengkap, foto_url, siswa_kelas(aktif, kelas(nama_kelas, tingkat))), kompetensi(judul)",
      )
      .eq("status", "aktif")
      .order("tanggal_terbit", { ascending: false })
      .limit(8),
    admin
      .from("project_siswa")
      .select("id_project, nama_project, deskripsi, link_youtube, siswa(nama_lengkap, foto_url), kelas(nama_kelas, tingkat)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(6),
    admin.from("siswa").select("id_siswa", { count: "exact", head: true }).eq("aktif", true),
    admin.from("guru").select("id_guru", { count: "exact", head: true }),
    admin.from("sertifikat").select("id_sertifikat", { count: "exact", head: true }).eq("status", "aktif"),
  ]);

  const namaSekolah = sekolah?.nama_sekolah ?? "Portal Sakuci";
  const ketuaJurusanMap = new Map<string, string>();
  for (const k of kajurList ?? []) {
    if (k.id_jurusan && !ketuaJurusanMap.has(k.id_jurusan)) ketuaJurusanMap.set(k.id_jurusan, k.nama_lengkap ?? "-");
  }

  const misiList = (sekolah?.misi ?? "").split("\n").map((m: string) => m.trim()).filter(Boolean);
  const alamatLengkap = sekolah?.alamat || "Jl. Sangkuriang No. 76, Cimahi";
  const mapsQuery = encodeURIComponent(`${namaSekolah} ${alamatLengkap}`);
  const namaKepsek = sekolah?.nama_kepala_sekolah || "Nasrullah Nurul Rohmat, S.Pd.,M.Pd";

  const STATS = [
    { label: "Siswa Aktif", value: totalSiswa ?? 0, icon: Users },
    { label: "Tenaga Pendidik", value: totalGuru ?? 0, icon: GraduationCap },
    { label: "Program Keahlian", value: (jurusanList ?? []).length, icon: Layers },
    { label: "Sertifikat Terbit", value: totalSertifikat ?? 0, icon: Award },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav namaSekolah={namaSekolah} />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-28 pt-24 sm:px-6 sm:pb-36 sm:pt-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/all.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/85" />
        <CircuitGlow />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Sparkles className="size-3" /> Sekolah Menengah Kejuruan
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo" className="h-20 w-auto object-contain drop-shadow-lg" />
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{namaSekolah}</h1>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/90 sm:text-base">
            Modern <span className="text-white/40">&bull;</span> Profesional <span className="text-white/40">&bull;</span> Religius
          </p>
          <p className="max-w-2xl text-white/85 sm:text-lg">
            Mencetak generasi unggul yang kompeten di bidang keahliannya, berakhlak mulia, dan siap berkontribusi bagi bangsa.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <a href="#tentang" className="inline-flex h-10 items-center justify-center rounded-lg border border-white/30 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20">
              Pelajari Lebih Lanjut
            </a>
            <Link href="/login" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-black/20 transition-transform hover:scale-[1.03] hover:bg-primary/90">
              Masuk Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Stats - overlapping hero */}
      <div className="relative z-10 mx-4 -mt-14 sm:mx-6 sm:-mt-16">
        <Card className="relative mx-auto max-w-5xl overflow-hidden border-primary/10 shadow-xl shadow-black/5">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardContent className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4 sm:p-6">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1.5 text-center">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                  <s.icon className="size-4.5" />
                </div>
                <p className="text-2xl font-extrabold tracking-tight sm:text-3xl">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tentang & Visi Misi */}
      <section id="tentang" className="relative px-4 pt-20 pb-16 sm:px-6">
        <DotPattern />
        <div className="relative mx-auto max-w-5xl">
          <SectionHeading eyebrow="Profil Sekolah" title="Tentang Kami" subtitle="Visi dan misi yang menjadi landasan setiap langkah kami" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="group relative overflow-hidden shadow-sm transition-shadow hover:shadow-lg">
              <div className="absolute -right-8 -top-8 size-32 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-125" />
              <CardHeader className="relative">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
                  <Target className="size-5" />
                </div>
                <CardTitle>Visi</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {sekolah?.visi || "Menjadi lembaga pendidikan kejuruan yang modern, profesional, dan religius dalam mencetak lulusan yang kompeten dan berakhlak mulia."}
                </p>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden shadow-sm transition-shadow hover:shadow-lg">
              <div className="absolute -right-8 -top-8 size-32 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-125" />
              <CardHeader className="relative">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
                  <Heart className="size-5" />
                </div>
                <CardTitle>Misi</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                {misiList.length > 0 ? (
                  <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                    {misiList.map((m: string, idx: number) => (
                      <li key={idx} className="flex gap-2 leading-relaxed">
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {idx + 1}
                        </span>
                        {m}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Menyelenggarakan pendidikan kejuruan berkualitas, membangun karakter religius, dan menyiapkan siswa siap kerja maupun
                    berwirausaha.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Jurusan */}
      <section id="jurusan" className="relative bg-muted/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="Program Keahlian" title="4 Jurusan Unggulan" subtitle="Pilih jurusan sesuai minat dan bakatmu" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {(jurusanList ?? []).map((j) => (
              <Card key={j.id_jurusan} className="group overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                {FOTO_JURUSAN[j.kode_jurusan] && (
                  <div className="relative h-48 w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={FOTO_JURUSAN[j.kode_jurusan]}
                      alt={j.nama_jurusan}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                      {j.kode_jurusan}
                    </span>
                    <p className="absolute bottom-3 left-4 right-4 text-base font-bold text-white drop-shadow-sm">{j.nama_jurusan}</p>
                  </div>
                )}
                <CardContent className="flex flex-col gap-2 pt-4">
                  <p className="text-sm text-muted-foreground">{j.deskripsi || "Program keahlian yang membekali siswa dengan kompetensi siap kerja dan berdaya saing."}</p>
                  {ketuaJurusanMap.get(j.id_jurusan) && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-primary" />
                      Ketua Program Keahlian: <span className="font-medium text-foreground">{ketuaJurusanMap.get(j.id_jurusan)}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
            {(jurusanList ?? []).length === 0 && (
              <p className="col-span-2 text-center text-sm text-muted-foreground">Data jurusan belum tersedia.</p>
            )}
          </div>
        </div>
      </section>

      {/* Sambutan Kepala Sekolah */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6">
        <GridPattern />
        <GlowOrb className="-left-20 top-10 size-72" />
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Pimpinan Sekolah" title="Sambutan Kepala Sekolah" subtitle="" />
          <Card className="relative overflow-hidden border-primary/10 shadow-md">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/5" />
            <CardContent className="relative flex flex-col items-center gap-6 pt-6 text-center sm:flex-row sm:items-start sm:text-left">
              <div className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/kepsek.jpg"
                  alt={namaKepsek}
                  className="size-32 rounded-2xl object-cover shadow-md ring-4 ring-primary/10"
                />
                <div className="absolute -bottom-2 -right-2 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                  <Quote className="size-4" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-lg font-bold">{namaKepsek}</p>
                  <p className="text-sm text-muted-foreground">Kepala Sekolah</p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  &ldquo;Assalamu&rsquo;alaikum warahmatullahi wabarakatuh. Selamat datang di {namaSekolah}. Kami berkomitmen
                  membina siswa-siswi menjadi pribadi yang kompeten di bidang keahliannya, profesional dalam bersikap, dan
                  senantiasa berpegang pada nilai-nilai keagamaan dalam setiap langkahnya. Melalui pembelajaran yang modern
                  dan relevan dengan kebutuhan dunia kerja, kami berharap setiap lulusan mampu bersaing secara global tanpa
                  meninggalkan akhlak yang mulia. Mari bersama membangun generasi yang cerdas, terampil, dan berintegritas.&rdquo;
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Siswa Berprestasi / Sertifikat */}
      <section id="prestasi" className="relative bg-muted/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="Pencapaian" title="Siswa Berprestasi" subtitle="Siswa yang telah meraih sertifikat kompetensi" />
          {(sertifikatList ?? []).length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">Belum ada sertifikat yang diterbitkan.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {(sertifikatList ?? []).map((s) => {
                const siswa = s.siswa as unknown as {
                  nama_lengkap: string;
                  foto_url: string | null;
                  siswa_kelas: { aktif: boolean; kelas: { nama_kelas: string; tingkat: number | null } | null }[] | null;
                } | null;
                const kompetensi = s.kompetensi as unknown as { judul: string } | null;
                const kelas = siswa?.siswa_kelas?.find((sk) => sk.aktif)?.kelas ?? null;
                const kelasLabel = kelas ? (kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas) : null;
                return (
                  <Card key={s.id_sertifikat} className="group shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                    <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
                      <div className="rounded-full bg-gradient-to-br from-primary/30 to-primary/10 p-0.5">
                        <InitialsAvatar name={siswa?.nama_lengkap ?? "-"} fotoUrl={siswa?.foto_url} className="size-14 border-2 border-background text-base" />
                      </div>
                      <p className="text-sm font-semibold">{siswa?.nama_lengkap ?? "-"}</p>
                      {kelasLabel && <p className="text-xs text-muted-foreground">{kelasLabel}</p>}
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Award className="size-3" />
                        {kompetensi?.judul ?? "-"}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Inovasi siswa */}
      <section id="inovasi" className="relative px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="Karya Siswa" title="Inovasi & Karya Siswa" subtitle="Project dan inovasi siswa yang telah disetujui Kajur" />
          {(projectList ?? []).length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">Belum ada karya siswa yang dipublikasikan.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(projectList ?? []).map((p) => {
                const siswa = p.siswa as unknown as { nama_lengkap: string; foto_url: string | null } | null;
                const kelas = p.kelas as unknown as { nama_kelas: string; tingkat: number | null } | null;
                const kelasLabel = kelas ? (kelas.tingkat ? `${kelas.tingkat} ${kelas.nama_kelas}` : kelas.nama_kelas) : "-";
                return (
                  <Card key={p.id_project} className="group overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                    {p.link_youtube ? (
                      <div className="px-4 pt-4">
                        <YoutubeThumbnail url={p.link_youtube} />
                      </div>
                    ) : (
                      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-primary/10 to-accent/20">
                        <Sparkles className="size-8 text-primary/50" />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-base">{p.nama_project}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                      <p className="line-clamp-2 text-sm text-muted-foreground">{p.deskripsi ?? "-"}</p>
                      <div className="flex items-center gap-2 border-t pt-2">
                        <InitialsAvatar name={siswa?.nama_lengkap ?? "-"} fotoUrl={siswa?.foto_url} className="size-6 text-[10px]" />
                        <span className="text-xs text-muted-foreground">{siswa?.nama_lengkap ?? "-"} &middot; {kelasLabel}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Ekskul */}
      <section className="relative overflow-hidden bg-muted/30 px-4 py-20 sm:px-6">
        <GridPattern />
        <GlowOrb className="-right-24 top-0 size-80" />
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="Pengembangan Diri" title="Ekstrakurikuler" subtitle="Wadah pengembangan minat dan talenta siswa" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EKSKUL.map((item) => (
              <Card key={item.nama} className="group relative overflow-hidden border-primary/10 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="absolute right-0 top-0 size-16 rounded-bl-3xl bg-primary/5 transition-colors group-hover:bg-primary/10" />
                <CardContent className="relative flex items-start gap-3 pt-6">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <item.icon className="size-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.nama}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fasilitas */}
      <section id="fasilitas" className="relative overflow-hidden px-4 py-20 sm:px-6">
        <DotPattern />
        <GlowOrb className="-left-24 bottom-0 size-80" />
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="Sarana & Prasarana" title="Fasilitas Sekolah" subtitle="Sarana penunjang kegiatan belajar dan ibadah" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FASILITAS.map((item) => (
              <Card key={item.nama} className="group relative overflow-hidden border-primary/10 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="absolute right-0 top-0 size-16 rounded-bl-3xl bg-primary/5 transition-colors group-hover:bg-primary/10" />
                <CardContent className="relative flex items-start gap-3 pt-6">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <item.icon className="size-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.nama}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lokasi */}
      <section id="lokasi" className="relative bg-muted/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="Kunjungi Kami" title="Lokasi Kami" subtitle={alamatLengkap} />
          <Card className="overflow-hidden shadow-md">
            <iframe
              title="Lokasi Sekolah"
              src={`https://maps.google.com/maps?q=${mapsQuery}&output=embed`}
              className="h-80 w-full border-0"
              loading="lazy"
            />
          </Card>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
          >
            Buka di Google Maps <ExternalLink className="size-3.5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden border-t bg-background px-4 pt-14 pb-8 sm:px-6">
        <GridPattern className="opacity-[0.04]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
            <p className="text-center text-sm font-semibold sm:text-left">{namaSekolah}</p>
            <p className="text-center text-xs text-muted-foreground sm:text-left">Modern &middot; Profesional &middot; Religius</p>
          </div>

          <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
            <p className="text-sm font-semibold">Tautan Cepat</p>
            <a href="#tentang" className="text-xs text-muted-foreground hover:text-primary">Tentang Kami</a>
            <a href="#jurusan" className="text-xs text-muted-foreground hover:text-primary">Program Keahlian</a>
            <a href="#prestasi" className="text-xs text-muted-foreground hover:text-primary">Siswa Berprestasi</a>
            <Link href="/login" className="text-xs text-muted-foreground hover:text-primary">Masuk Portal</Link>
          </div>

          <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
            <p className="text-sm font-semibold">Kontak</p>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5" /> {alamatLengkap}</span>
            {sekolah?.email && <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="size-3.5" /> {sekolah.email}</span>}
            {sekolah?.no_telepon && <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="size-3.5" /> {sekolah.no_telepon}</span>}
            {sekolah?.instagram && <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><AtSign className="size-3.5" /> {sekolah.instagram}</span>}
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {namaSekolah}. Seluruh hak cipta dilindungi.
        </p>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Created by Indra Batara, S.Pd.,Gr (IT Dev SMK Sangkuriang 1 Cimahi)
        </p>
      </footer>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="mb-10 flex flex-col items-center gap-2 text-center">
      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
        <span className="h-px w-4 bg-primary" /> {eyebrow} <span className="h-px w-4 bg-primary" />
      </span>
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      {subtitle && <p className="max-w-xl text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function DotPattern() {
  return (
    <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-primary opacity-[0.05]" aria-hidden>
      <defs>
        <pattern id="dot-pattern" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-pattern)" />
    </svg>
  );
}

function GridPattern({ className = "" }: { className?: string }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 -z-10 h-full w-full text-primary opacity-[0.06] ${className}`} aria-hidden>
      <defs>
        <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 H0 V40" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
}

function GlowOrb({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-3xl ${className}`}
    />
  );
}

function CircuitGlow() {
  return (
    <svg className="absolute inset-0 h-full w-full text-primary/60 opacity-40" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden>
      <path d="M0 80 H180 L220 120 H420 L460 80 H1000" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M0 420 H160 L200 380 H520 L560 420 H1000" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="180" cy="80" r="4" fill="currentColor" />
      <circle cx="460" cy="80" r="4" fill="currentColor" />
      <circle cx="160" cy="420" r="4" fill="currentColor" />
      <circle cx="560" cy="420" r="4" fill="currentColor" />
    </svg>
  );
}
