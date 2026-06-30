import Link from "next/link";
import { MessageCircle, AlertTriangle, HeartHandshake } from "lucide-react";
import { getKonselingSesiList } from "@/features/konseling/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function BkDashboardPage() {
  const rows = await getKonselingSesiList();

  const totalSesi = rows.length;
  const risikoTinggi = rows.filter((r) => r.tingkat_risiko === "tinggi").length;
  const berlangsung = rows.filter((r) => r.status === "aktif").length;

  const cards = [
    { label: "Total Sesi Konseling", value: totalSesi, icon: MessageCircle },
    { label: "Indikasi Risiko Tinggi", value: risikoTinggi, icon: AlertTriangle },
    { label: "Sesi Berlangsung", value: berlangsung, icon: HeartHandshake },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard BK</h1>
        <p className="text-muted-foreground">Bimbingan Konseling - Pemantauan Konseling AI Siswa</p>
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
            href="/bk/konseling"
            className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground/70">
              <HeartHandshake className="size-4.5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Konseling Siswa</p>
              <p className="text-xs text-muted-foreground">Lihat ringkasan & indikasi hasil sesi konseling AI seluruh siswa.</p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
