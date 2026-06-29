import Link from "next/link";
import { School, BookOpen, FileText, ClipboardCheck, BookMarked, NotebookText } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MENU_GURU = [
  { href: "/guru/mengajar", label: "Pembagian Mengajar", desc: "Pilih kelas dan mapel yang Anda ajar.", icon: School },
  { href: "/guru/materi", label: "Materi", desc: "Bagikan materi teks, link, atau file.", icon: BookOpen },
  { href: "/guru/tugas", label: "Tugas", desc: "Buat tugas dari bank soal.", icon: FileText },
  { href: "/guru/pengumpulan", label: "Pengumpulan Tugas", desc: "Periksa dan nilai jawaban siswa.", icon: ClipboardCheck },
  { href: "/guru/bank-soal", label: "Bank Soal", desc: "Kelola soal PG dan essay.", icon: BookMarked },
  { href: "/guru/nilai", label: "Nilai", desc: "Lihat dan cetak nilai siswa.", icon: NotebookText },
];

export default async function GuruDashboardPage() {
  const profile = await requireRole(["guru"]);
  const supabase = await createClient();

  const { data: mengajarList } = await supabase
    .from("mengajar")
    .select("id_mengajar")
    .eq("id_guru", profile.id_guru ?? "");

  const idMengajarList = (mengajarList ?? []).map((m) => m.id_mengajar);

  const safeIdMengajar = idMengajarList.length ? idMengajarList : [""];

  const [materi, { data: tugasList }] = await Promise.all([
    supabase.from("materi").select("id_materi", { count: "exact", head: true }).in("id_mengajar", safeIdMengajar),
    supabase.from("tugas").select("id_tugas").in("id_mengajar", safeIdMengajar),
  ]);

  const idTugasList = (tugasList ?? []).map((t) => t.id_tugas);
  const { count: pengumpulanBelumCount } = idTugasList.length
    ? await supabase
        .from("pengumpulan_tugas")
        .select("id_pengumpulan", { count: "exact", head: true })
        .eq("status", "selesai")
        .in("id_tugas", idTugasList)
    : { count: 0 };

  const cards = [
    { label: "Kelas Diajar", value: idMengajarList.length, icon: School },
    { label: "Materi Dibagikan", value: materi.count ?? 0, icon: BookOpen },
    { label: "Tugas Dibuat", value: idTugasList.length, icon: FileText },
    { label: "Menunggu Dinilai", value: pengumpulanBelumCount ?? 0, icon: ClipboardCheck },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Guru</h1>
        <p className="text-muted-foreground">Selamat datang, {profile.nama_lengkap}</p>
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
              <p className="text-3xl font-bold tracking-tight">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Menu Guru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MENU_GURU.map((item) => (
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
