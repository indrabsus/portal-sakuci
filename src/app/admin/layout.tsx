import { requireRole } from "@/lib/auth";
import { getTahunAjaranAktifLabel } from "@/lib/tahun-ajaran";
import { AppShell } from "@/components/app-shell";
import type { NavIconKey } from "@/components/sidebar-nav";

const NAV_ITEMS: { href: string; label: string; icon: NavIconKey }[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/tahun-ajaran", label: "Tahun Ajaran", icon: "calendar-range" },
  { href: "/admin/jurusan", label: "Jurusan", icon: "layers" },
  { href: "/admin/kajur", label: "Kajur & Jurusan", icon: "user-circle" },
  { href: "/admin/kelas", label: "Kelas", icon: "school" },
  { href: "/admin/guru", label: "Guru", icon: "graduation-cap" },
  { href: "/admin/siswa", label: "Siswa", icon: "users" },
  { href: "/admin/mapel", label: "Mata Pelajaran", icon: "book-open" },
  { href: "/admin/konseling", label: "Konseling Siswa", icon: "heart-handshake" },
  { href: "/admin/informasi-sekolah", label: "Informasi Sekolah", icon: "building" },
  { href: "/admin/reset-password", label: "Reset Password", icon: "key-round" },
  { href: "/admin/backup", label: "Backup & Restore", icon: "database-backup" },
  { href: "/admin/ganti-password", label: "Ganti Password Saya", icon: "user-circle" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole(["admin"]);
  const tahunAjaranLabel = await getTahunAjaranAktifLabel();

  return (
    <AppShell title="Admin" navItems={NAV_ITEMS} tahunAjaranLabel={tahunAjaranLabel} email={profile.email}>
      {children}
    </AppShell>
  );
}
