import Link from "next/link";
import { Users, Award, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/fetch-all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function BkkDashboardPage() {
  const supabase = await createClient();

  const [{ count: totalSiswa }, { count: siswaAktif }, sertifikatList] = await Promise.all([
    supabase.from("siswa").select("id_siswa", { count: "exact", head: true }),
    supabase.from("siswa").select("id_siswa", { count: "exact", head: true }).eq("aktif", true),
    fetchAllRows((from, to) => supabase.from("sertifikat").select("id_siswa").eq("status", "aktif").range(from, to)),
  ]);

  const siswaDenganSertifikat = new Set(sertifikatList.map((s) => s.id_siswa)).size;

  const cards = [
    { label: "Total Siswa", value: totalSiswa ?? 0, icon: Users },
    { label: "Siswa Aktif", value: siswaAktif ?? 0, icon: GraduationCap },
    { label: "Siswa Bersertifikat", value: siswaDenganSertifikat, icon: Award },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard BKK</h1>
        <p className="text-muted-foreground">Bursa Kerja Khusus - Portofolio Siswa</p>
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
        <CardContent className="pt-6">
          <Link
            href="/bkk/siswa"
            className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground/70">
              <Users className="size-4.5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Data Siswa</p>
              <p className="text-xs text-muted-foreground">Lihat semua siswa dan portofolio sertifikat kompetensinya.</p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
