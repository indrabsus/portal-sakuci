import Link from "next/link";
import { AlertTriangle, Route, FileQuestion, Award, ClipboardCheck, ClipboardList, BarChart3, Sparkles } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MENU_KAJUR = [
  { href: "/kajur/roadmap", label: "Roadmap Kompetensi", desc: "Susun jenjang kompetensi jurusan Anda.", icon: Route },
  { href: "/kajur/validasi-kompetensi", label: "Validasi Tes Kompetensi", desc: "Nilai jawaban essay tes roadmap siswa.", icon: ClipboardList },
  { href: "/kajur/sertifikat", label: "Sertifikat Siswa", desc: "Terbitkan sertifikat kompetensi siswa.", icon: Award },
  { href: "/kajur/rekap-kompetensi", label: "Rekap Kompetensi", desc: "Lihat progres kompetensi siswa jurusan Anda.", icon: ClipboardCheck },
  { href: "/kajur/inovasi-siswa", label: "Project & Inovasi Siswa", desc: "Lihat project/inovasi siswa jurusan Anda.", icon: Sparkles },
  { href: "/kajur/laporan", label: "Laporan Keaktifan", desc: "Pantau keaktifan guru dan siswa.", icon: BarChart3 },
];

async function getCounts(idJurusan: string) {
  const supabase = await createClient();

  const { data: kompetensiList } = await supabase.from("kompetensi").select("id_kompetensi").eq("id_jurusan", idJurusan).eq("aktif", true);
  const idKompetensiList = (kompetensiList ?? []).map((k) => k.id_kompetensi);
  const safeIds = idKompetensiList.length ? idKompetensiList : [""];

  const [sertifikatAktif, menungguValidasi, soal] = await Promise.all([
    supabase.from("sertifikat").select("id_sertifikat", { count: "exact", head: true }).eq("status", "aktif").in("id_kompetensi", safeIds),
    supabase.from("progres_kompetensi").select("id_progres", { count: "exact", head: true }).eq("status", "proses").in("id_kompetensi", safeIds),
    supabase.from("soal_kompetensi").select("id_soal_kompetensi", { count: "exact", head: true }).eq("id_jurusan", idJurusan),
  ]);

  return {
    kompetensi: idKompetensiList.length,
    sertifikatAktif: sertifikatAktif.count ?? 0,
    menungguValidasi: menungguValidasi.count ?? 0,
    soal: soal.count ?? 0,
  };
}

export default async function KajurDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const profile = await requireRole(["kajur"]);
  const { error } = await searchParams;

  if (!profile.id_jurusan) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Kajur</h1>
          <p className="text-muted-foreground">Selamat datang, {profile.nama_lengkap}</p>
        </div>
        <Card className="border-amber-300 bg-amber-50 shadow-sm dark:border-amber-900 dark:bg-amber-950/30">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300">Jurusan belum diatur</p>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Akun Anda belum ditautkan ke jurusan tertentu. Hubungi Admin untuk mengatur jurusan yang Anda kelola
                di menu Admin &rarr; Kajur &amp; Jurusan, sebelum bisa mengelola roadmap kompetensi.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const supabase = await createClient();
  const [{ data: jurusan }, c] = await Promise.all([
    supabase.from("jurusan").select("nama_jurusan").eq("id_jurusan", profile.id_jurusan).single(),
    getCounts(profile.id_jurusan),
  ]);

  const cards = [
    { label: "Kompetensi Aktif", value: c.kompetensi, icon: Route },
    { label: "Sertifikat Terbit", value: c.sertifikatAktif, icon: Award },
    { label: "Menunggu Validasi", value: c.menungguValidasi, icon: ClipboardCheck },
    { label: "Soal Kompetensi", value: c.soal, icon: FileQuestion },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Kajur</h1>
        <p className="text-muted-foreground">Jurusan {jurusan?.nama_jurusan ?? "-"}</p>
      </div>

      {error === "jurusan_belum_diatur" && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Halaman tersebut membutuhkan jurusan yang sudah diatur.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <card.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Menu Kajur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MENU_KAJUR.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-start gap-3 rounded-xl border p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground/70">
                  <item.icon className="size-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
