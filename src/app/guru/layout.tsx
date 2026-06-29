import { requireRole } from "@/lib/auth";
import { getTahunAjaranAktifLabel } from "@/lib/tahun-ajaran";
import { SidebarNav, type NavIconKey } from "@/components/sidebar-nav";
import { TopBar } from "@/components/top-bar";

const NAV_ITEMS: { href: string; label: string; icon: NavIconKey }[] = [
  { href: "/guru/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/guru/mengajar", label: "Pembagian Mengajar", icon: "school" },
  { href: "/guru/materi", label: "Materi", icon: "book-open" },
  { href: "/guru/tugas", label: "Tugas", icon: "file-text" },
  { href: "/guru/pengumpulan", label: "Pengumpulan Tugas", icon: "clipboard-check" },
  { href: "/guru/bank-soal", label: "Bank Soal", icon: "book-marked" },
  { href: "/guru/nilai", label: "Nilai", icon: "notebook-text" },
  { href: "/guru/laporan", label: "Laporan", icon: "bar-chart" },
  { href: "/guru/ganti-password", label: "Ganti Password", icon: "key-round" },
];

export default async function GuruLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole(["guru"]);
  const tahunAjaranLabel = await getTahunAjaranAktifLabel();

  return (
    <div className="flex min-h-screen">
      <SidebarNav title="Guru" items={NAV_ITEMS} />
      <div className="flex flex-1 flex-col bg-muted/30">
        <TopBar tahunAjaranLabel={tahunAjaranLabel} email={profile.email} />
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
