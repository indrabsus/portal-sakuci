import { requireRole } from "@/lib/auth";
import { getTahunAjaranAktifLabel } from "@/lib/tahun-ajaran";
import { SidebarNav, type NavIconKey } from "@/components/sidebar-nav";
import { TopBar } from "@/components/top-bar";

const NAV_ITEMS: { href: string; label: string; icon: NavIconKey }[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/tahun-ajaran", label: "Tahun Ajaran", icon: "calendar-range" },
  { href: "/admin/jurusan", label: "Jurusan", icon: "layers" },
  { href: "/admin/kajur", label: "Kajur & Jurusan", icon: "user-circle" },
  { href: "/admin/kelas", label: "Kelas", icon: "school" },
  { href: "/admin/guru", label: "Guru", icon: "graduation-cap" },
  { href: "/admin/siswa", label: "Siswa", icon: "users" },
  { href: "/admin/mapel", label: "Mata Pelajaran", icon: "book-open" },
  { href: "/admin/informasi-sekolah", label: "Informasi Sekolah", icon: "building" },
  { href: "/admin/reset-password", label: "Reset Password", icon: "key-round" },
  { href: "/admin/backup", label: "Backup & Restore", icon: "database-backup" },
  { href: "/admin/ganti-password", label: "Ganti Password Saya", icon: "user-circle" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole(["admin"]);
  const tahunAjaranLabel = await getTahunAjaranAktifLabel();

  return (
    <div className="flex min-h-screen">
      <SidebarNav title="Admin" items={NAV_ITEMS} />
      <div className="flex flex-1 flex-col bg-muted/30">
        <TopBar tahunAjaranLabel={tahunAjaranLabel} email={profile.email} />
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
