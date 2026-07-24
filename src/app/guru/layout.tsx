import { requireRole } from "@/lib/auth";
import { getTahunAjaranAktifLabel } from "@/lib/tahun-ajaran";
import { AppShell } from "@/components/app-shell";
import type { NavIconKey } from "@/components/sidebar-nav";

const NAV_ITEMS: { href: string; label: string; icon: NavIconKey }[] = [
  { href: "/guru/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/guru/absen", label: "Absen", icon: "calendar-range" },
  { href: "/guru/profil", label: "Profil Saya", icon: "user-circle" },
  { href: "/guru/mengajar", label: "Pembagian Mengajar", icon: "school" },
  { href: "/guru/materi", label: "Materi", icon: "book-open" },
  { href: "/guru/tugas", label: "Tugas", icon: "file-text" },
  { href: "/guru/pengumpulan", label: "Pengumpulan Tugas", icon: "clipboard-check" },
  { href: "/guru/bank-soal", label: "Bank Soal", icon: "book-marked" },
  { href: "/guru/nilai", label: "Nilai", icon: "notebook-text" },
  { href: "/guru/laporan", label: "Laporan", icon: "bar-chart" },
];

export default async function GuruLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole(["guru"]);
  const tahunAjaranLabel = await getTahunAjaranAktifLabel();

  return (
    <AppShell
      title="Guru"
      navItems={NAV_ITEMS}
      tahunAjaranLabel={tahunAjaranLabel}
      email={profile.email}
      namaLengkap={profile.nama_lengkap}
      fotoUrl={profile.foto}
      gantiPasswordHref="/guru/ganti-password"
      currentUserId={profile.id_profile}
    >
      {children}
    </AppShell>
  );
}
