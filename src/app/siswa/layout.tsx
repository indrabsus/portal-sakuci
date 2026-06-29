import { requireRole } from "@/lib/auth";
import { getTahunAjaranAktifLabel } from "@/lib/tahun-ajaran";
import { SidebarNav, type NavIconKey } from "@/components/sidebar-nav";
import { TopBar } from "@/components/top-bar";

const NAV_ITEMS: { href: string; label: string; icon: NavIconKey }[] = [
  { href: "/siswa/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/siswa/profil", label: "Profil Saya", icon: "user-circle" },
  { href: "/siswa/materi", label: "Materi", icon: "book-open" },
  { href: "/siswa/tugas", label: "Tugas", icon: "file-text" },
  { href: "/siswa/nilai", label: "Nilai", icon: "notebook-text" },
  { href: "/siswa/roadmap", label: "Roadmap Belajar", icon: "route" },
  { href: "/siswa/sertifikat", label: "Sertifikat Saya", icon: "award" },
  { href: "/siswa/proyek", label: "Project & Inovasi", icon: "sparkles" },
  { href: "/siswa/ganti-password", label: "Ganti Password", icon: "key-round" },
];

export default async function SiswaLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole(["siswa"]);
  const tahunAjaranLabel = await getTahunAjaranAktifLabel();

  return (
    <div className="flex min-h-screen">
      <SidebarNav title="Siswa" items={NAV_ITEMS} />
      <div className="flex flex-1 flex-col bg-muted/30">
        <TopBar tahunAjaranLabel={tahunAjaranLabel} email={profile.email} />
        <main className="flex-1 overflow-x-hidden p-6 md:p-8 print:p-0">
          <div className="mx-auto max-w-6xl print:max-w-none">{children}</div>
        </main>
      </div>
    </div>
  );
}
