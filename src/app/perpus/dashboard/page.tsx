import Link from "next/link";
import { BookOpen, ClipboardList, AlertCircle } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getDashboardStats } from "@/features/perpus/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PerpusDashboardPage() {
  await requireRole(["perpus"]);
  const { totalBuku, totalDipinjam, totalTerlambat } = await getDashboardStats();

  const cards = [
    { label: "Total Koleksi Buku", value: totalBuku, icon: BookOpen },
    { label: "Sedang Dipinjam", value: totalDipinjam, icon: ClipboardList },
    { label: "Terlambat Dikembalikan", value: totalTerlambat, icon: AlertCircle },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Perpustakaan</h1>
        <p className="text-muted-foreground">Kelola koleksi buku dan peminjaman siswa.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label} className="shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <card.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-3 pt-6">
          {[
            { href: "/perpus/buku", icon: BookOpen, label: "Daftar Buku", desc: "Tambah, edit, dan kelola koleksi buku perpustakaan." },
            { href: "/perpus/peminjaman", icon: ClipboardList, label: "Peminjaman", desc: "Catat peminjaman baru dan pantau pengembalian buku siswa." },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground/70">
                <item.icon className="size-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
