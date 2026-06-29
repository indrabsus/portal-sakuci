import Link from "next/link";
import {
  Users,
  GraduationCap,
  School,
  Layers,
  BookOpen,
  ClipboardList,
  Award,
  UserCheck,
  CalendarRange,
  KeyRound,
  DatabaseBackup,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MENU_ADMIN = [
  { href: "/admin/tahun-ajaran", label: "Tahun Ajaran", desc: "Kelola periode tahun ajaran sekolah.", icon: CalendarRange },
  { href: "/admin/jurusan", label: "Jurusan", desc: "Tambah, edit, dan hapus data jurusan.", icon: Layers },
  { href: "/admin/kelas", label: "Kelola Kelas", desc: "Tambah, edit, dan hapus data kelas.", icon: School },
  { href: "/admin/guru", label: "Kelola Guru", desc: "Kelola data guru dan akun pengajar.", icon: GraduationCap },
  { href: "/admin/siswa", label: "Kelola Siswa", desc: "Kelola data siswa dan kelasnya.", icon: Users },
  { href: "/admin/mapel", label: "Kelola Mapel", desc: "Atur mata pelajaran untuk e-learning.", icon: BookOpen },
  { href: "/admin/reset-password", label: "Reset Password", desc: "Atur ulang password akun pengguna.", icon: KeyRound },
  { href: "/admin/backup", label: "Backup & Restore", desc: "Cadangkan dan pulihkan data sekolah.", icon: DatabaseBackup },
];

async function getCounts() {
  const supabase = await createClient();

  const [
    siswa,
    siswaAktif,
    guru,
    kelas,
    jurusan,
    mapel,
    tugasAktif,
    sertifikatTerbit,
    akunGuruAktif,
    akunSiswaAktif,
  ] = await Promise.all([
    supabase.from("siswa").select("id_siswa", { count: "exact", head: true }),
    supabase.from("siswa").select("id_siswa", { count: "exact", head: true }).eq("aktif", true),
    supabase.from("guru").select("id_guru", { count: "exact", head: true }),
    supabase.from("kelas").select("id_kelas", { count: "exact", head: true }),
    supabase.from("jurusan").select("id_jurusan", { count: "exact", head: true }),
    supabase.from("mapel").select("id_mapel", { count: "exact", head: true }),
    supabase.from("tugas").select("id_tugas", { count: "exact", head: true }).eq("status", "aktif"),
    supabase.from("sertifikat").select("id_sertifikat", { count: "exact", head: true }),
    supabase.from("akun_guru").select("id_akun_guru", { count: "exact", head: true }),
    supabase.from("akun_siswa").select("id_akun_siswa", { count: "exact", head: true }),
  ]);

  return {
    totalSiswa: siswa.count ?? 0,
    siswaAktif: siswaAktif.count ?? 0,
    totalGuru: guru.count ?? 0,
    totalKelas: kelas.count ?? 0,
    totalJurusan: jurusan.count ?? 0,
    totalMapel: mapel.count ?? 0,
    tugasAktif: tugasAktif.count ?? 0,
    sertifikatTerbit: sertifikatTerbit.count ?? 0,
    akunGuruAktif: akunGuruAktif.count ?? 0,
    akunSiswaAktif: akunSiswaAktif.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const c = await getCounts();

  const cards = [
    { label: "Total Siswa", value: c.totalSiswa, sub: `${c.siswaAktif} aktif`, icon: Users },
    { label: "Total Guru", value: c.totalGuru, sub: `${c.akunGuruAktif} akun aktif`, icon: GraduationCap },
    { label: "Total Kelas", value: c.totalKelas, icon: School },
    { label: "Jurusan", value: c.totalJurusan, icon: Layers },
    { label: "Mata Pelajaran", value: c.totalMapel, icon: BookOpen },
    { label: "Tugas Aktif", value: c.tugasAktif, icon: ClipboardList },
    { label: "Sertifikat Terbit", value: c.sertifikatTerbit, icon: Award },
    { label: "Akun Siswa Aktif", value: c.akunSiswaAktif, sub: `dari ${c.totalSiswa} siswa`, icon: UserCheck },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-muted-foreground">Ringkasan data sekolah secara keseluruhan</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <card.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight">{card.value}</p>
              {card.sub && <p className="text-xs text-muted-foreground">{card.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Menu Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MENU_ADMIN.map((item) => (
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
