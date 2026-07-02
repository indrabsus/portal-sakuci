import { requireRole } from "@/lib/auth";
import { getTahunAjaranAktifLabel } from "@/lib/tahun-ajaran";
import { AppShell } from "@/components/app-shell";
import type { NavIconKey } from "@/components/sidebar-nav";

const NAV_ITEMS: { href: string; label: string; icon: NavIconKey }[] = [
  { href: "/siswa/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/siswa/profil", label: "Profil Saya", icon: "user-circle" },
  { href: "/siswa/materi", label: "Materi", icon: "book-open" },
  { href: "/siswa/tugas", label: "Tugas", icon: "file-text" },
  { href: "/siswa/nilai", label: "Nilai", icon: "notebook-text" },
  { href: "/siswa/roadmap", label: "Roadmap Belajar", icon: "route" },
  { href: "/siswa/sertifikat", label: "Sertifikat Saya", icon: "award" },
  { href: "/siswa/proyek", label: "Project & Inovasi", icon: "sparkles" },
  { href: "/siswa/konseling", label: "Konseling AI", icon: "message-circle" },
  { href: "/siswa/ganti-password", label: "Ganti Password", icon: "key-round" },
];

export default async function SiswaLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole(["siswa"]);
  const tahunAjaranLabel = await getTahunAjaranAktifLabel();

  return (
    <AppShell title="Siswa" navItems={NAV_ITEMS} tahunAjaranLabel={tahunAjaranLabel} email={profile.email}>
      {children}
    </AppShell>
  );
}
