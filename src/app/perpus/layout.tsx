import { requireRole } from "@/lib/auth";
import { getTahunAjaranAktifLabel } from "@/lib/tahun-ajaran";
import { SidebarNav, type NavIconKey } from "@/components/sidebar-nav";
import { TopBar } from "@/components/top-bar";
import { AppFooter } from "@/components/app-footer";

const NAV_ITEMS: { href: string; label: string; icon: NavIconKey }[] = [
  { href: "/perpus/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/perpus/buku", label: "Daftar Buku", icon: "book-open" },
  { href: "/perpus/peminjaman", label: "Peminjaman", icon: "clipboard-list" },
  { href: "/perpus/ganti-password", label: "Ganti Password", icon: "key-round" },
];

export default async function PerpusLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole(["perpus"]);
  const tahunAjaranLabel = await getTahunAjaranAktifLabel();

  return (
    <div className="flex min-h-screen">
      <SidebarNav title="Perpustakaan" items={NAV_ITEMS} />
      <div className="flex flex-1 flex-col bg-muted/30">
        <TopBar tahunAjaranLabel={tahunAjaranLabel} email={profile.email} />
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
          <div className="mx-auto max-w-6xl"><AppFooter /></div>
        </main>
      </div>
    </div>
  );
}
