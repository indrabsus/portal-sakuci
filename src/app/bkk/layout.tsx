import { requireRole } from "@/lib/auth";
import { getTahunAjaranAktifLabel } from "@/lib/tahun-ajaran";
import { AppShell } from "@/components/app-shell";
import type { NavIconKey } from "@/components/sidebar-nav";

const NAV_ITEMS: { href: string; label: string; icon: NavIconKey }[] = [
  { href: "/bkk/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/bkk/siswa", label: "Data Siswa", icon: "users" },
  { href: "/bkk/ganti-password", label: "Ganti Password", icon: "key-round" },
];

export default async function BkkLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole(["bkk"]);
  const tahunAjaranLabel = await getTahunAjaranAktifLabel();

  return (
    <AppShell title="BKK" navItems={NAV_ITEMS} tahunAjaranLabel={tahunAjaranLabel} email={profile.email}>
      {children}
    </AppShell>
  );
}
