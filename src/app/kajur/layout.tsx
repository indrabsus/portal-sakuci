import { requireRole } from "@/lib/auth";
import { getTahunAjaranAktifLabel } from "@/lib/tahun-ajaran";
import { AppShell } from "@/components/app-shell";
import type { NavIconKey } from "@/components/sidebar-nav";

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
    <AppShell title="Kajur" navItems={NAV_ITEMS} tahunAjaranLabel={tahunAjaranLabel} email={profile.email}>
      {children}
    </AppShell>
  );
}
