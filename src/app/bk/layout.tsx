import { requireRole } from "@/lib/auth";
import { getTahunAjaranAktifLabel } from "@/lib/tahun-ajaran";
import { SidebarNav, type NavIconKey } from "@/components/sidebar-nav";
import { TopBar } from "@/components/top-bar";
import { AppFooter } from "@/components/app-footer";

const NAV_ITEMS: { href: string; label: string; icon: NavIconKey }[] = [
  { href: "/bk/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/bk/siswa", label: "Siswa", icon: "users" },
  { href: "/bk/konseling", label: "History Konseling", icon: "heart-handshake" },
  { href: "/bk/catatan", label: "Catatan Siswa", icon: "notebook-pen" },
  { href: "/bk/ganti-password", label: "Ganti Password", icon: "key-round" },
];

export default async function BkLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole(["bk"]);
  const tahunAjaranLabel = await getTahunAjaranAktifLabel();

  return (
    <div className="flex min-h-screen">
      <SidebarNav title="BK" items={NAV_ITEMS} />
      <div className="flex flex-1 flex-col bg-muted/30">
        <TopBar tahunAjaranLabel={tahunAjaranLabel} email={profile.email} navTitle="BK" navItems={NAV_ITEMS} />
        <main className="flex-1 overflow-x-hidden p-4 md:p-8 print:p-0">
          <div className="mx-auto max-w-6xl print:max-w-none">{children}</div>
          <div className="mx-auto max-w-6xl print:hidden"><AppFooter /></div>
        </main>
      </div>
    </div>
  );
}
