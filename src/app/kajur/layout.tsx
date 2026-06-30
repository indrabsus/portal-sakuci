import { requireRole } from "@/lib/auth";
import { getTahunAjaranAktifLabel } from "@/lib/tahun-ajaran";
import { SidebarNav, type NavIconKey } from "@/components/sidebar-nav";
import { TopBar } from "@/components/top-bar";
import { AppFooter } from "@/components/app-footer";

const NAV_ITEMS: { href: string; label: string; icon: NavIconKey }[] = [
  { href: "/kajur/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/kajur/roadmap", label: "Roadmap Kompetensi", icon: "route" },
  { href: "/kajur/validasi-kompetensi", label: "Validasi Tes Kompetensi", icon: "clipboard-list" },
  { href: "/kajur/sertifikat", label: "Sertifikat Siswa", icon: "award" },
  { href: "/kajur/rekap-kompetensi", label: "Rekap Kompetensi", icon: "clipboard-check" },
  { href: "/kajur/inovasi-siswa", label: "Project & Inovasi Siswa", icon: "sparkles" },
  { href: "/kajur/konseling", label: "Konseling Siswa", icon: "heart-handshake" },
  { href: "/kajur/laporan", label: "Laporan Keaktifan", icon: "bar-chart" },
  { href: "/kajur/ganti-password", label: "Ganti Password", icon: "key-round" },
];

export default async function KajurLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole(["kajur"]);
  const tahunAjaranLabel = await getTahunAjaranAktifLabel();

  return (
    <div className="flex min-h-screen">
      <SidebarNav title="Kajur" items={NAV_ITEMS} />
      <div className="flex flex-1 flex-col bg-muted/30">
        <TopBar tahunAjaranLabel={tahunAjaranLabel} email={profile.email} navTitle="Kajur" navItems={NAV_ITEMS} />
        <main className="flex-1 overflow-x-hidden p-4 md:p-8 print:p-0">
          <div className="mx-auto max-w-6xl print:max-w-none">{children}</div>
          <div className="mx-auto max-w-6xl print:hidden"><AppFooter /></div>
        </main>
      </div>
    </div>
  );
}
