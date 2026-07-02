import { requireRole } from "@/lib/auth";
import { getTahunAjaranAktifLabel } from "@/lib/tahun-ajaran";
import { AppShell } from "@/components/app-shell";
import type { NavIconKey } from "@/components/sidebar-nav";

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
    <AppShell title="Perpustakaan" navItems={NAV_ITEMS} tahunAjaranLabel={tahunAjaranLabel} email={profile.email}>
      {children}
    </AppShell>
  );
}
