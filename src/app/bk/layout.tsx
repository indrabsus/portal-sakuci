import { requireRole } from "@/lib/auth";
import { getTahunAjaranAktifLabel } from "@/lib/tahun-ajaran";
import { AppShell } from "@/components/app-shell";
import type { NavIconKey } from "@/components/sidebar-nav";

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
    <AppShell title="BK" navItems={NAV_ITEMS} tahunAjaranLabel={tahunAjaranLabel} email={profile.email}>
      {children}
    </AppShell>
  );
}
