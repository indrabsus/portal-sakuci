import Link from "next/link";
import { BookOpen, FileText, NotebookText, Route, Award, Sparkles } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSiswaKelasInfo } from "@/lib/siswa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MENU_SISWA = [
  { href: "/siswa/materi", label: "Materi", desc: "Materi yang dibagikan guru.", icon: BookOpen },
  { href: "/siswa/tugas", label: "Tugas", desc: "Kerjakan tugas dari guru.", icon: FileText },
  { href: "/siswa/nilai", label: "Nilai", desc: "Lihat dan cetak nilai Anda.", icon: NotebookText },
  { href: "/siswa/roadmap", label: "Roadmap Belajar", desc: "Capai kompetensi untuk sertifikat.", icon: Route },
  { href: "/siswa/sertifikat", label: "Sertifikat Saya", desc: "Sertifikat yang sudah didapat.", icon: Award },
  { href: "/siswa/proyek", label: "Project & Inovasi", desc: "Bagikan project atau inovasi Anda.", icon: Sparkles },
];

export default async function SiswaDashboardPage() {
  const profile = await requireRole(["siswa"]);
  const supabase = await createClient();
  const kelasInfo = await getSiswaKelasInfo(profile.id_siswa ?? "");

  const { data: mengajarList } = kelasInfo.id_kelas
    ? await supabase.from("mengajar").select("id_mengajar").eq("id_kelas", kelasInfo.id_kelas)
    : { data: [] as { id_mengajar: string }[] };

  const idMengajarList = (mengajarList ?? []).map((m) => m.id_mengajar);
  const safeIds = idMengajarList.length ? idMengajarList : [""];

  const [{ count: materiCount }, { data: tugasList }, { count: sertifikatCount }] = await Promise.all([
    supabase.from("materi").select("id_materi", { count: "exact", head: true }).in("id_mengajar", safeIds),
    supabase.from("tugas").select("id_tugas").in("id_mengajar", safeIds).eq("status", "aktif"),
    supabase.from("sertifikat").select("id_sertifikat", { count: "exact", head: true }).eq("id_siswa", profile.id_siswa ?? "").eq("status", "aktif"),
  ]);

  const idTugasList = (tugasList ?? []).map((t) => t.id_tugas);
  const { data: pengumpulanList } = idTugasList.length
    ? await supabase.from("pengumpulan_tugas").select("id_tugas, status").eq("id_siswa", profile.id_siswa ?? "").in("id_tugas", idTugasList)
    : { data: [] as { id_tugas: string; status: string }[] };

  const selesaiSet = new Set((pengumpulanList ?? []).filter((p) => p.status !== "belum").map((p) => p.id_tugas));
  const tugasBelum = idTugasList.filter((id) => !selesaiSet.has(id)).length;

  const cards = [
    { label: "Kelas", value: kelasInfo.nama_kelas ?? "-", icon: BookOpen },
    { label: "Materi Tersedia", value: materiCount ?? 0, icon: BookOpen },
    { label: "Tugas Belum Dikerjakan", value: tugasBelum, icon: FileText },
    { label: "Sertifikat Diterima", value: sertifikatCount ?? 0, icon: Award },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Halo, {profile.nama_lengkap}</h1>
        <p className="text-muted-foreground">Selamat belajar!</p>
      </div>

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
              <p className="text-2xl font-bold tracking-tight">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Menu Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MENU_SISWA.map((item) => (
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
