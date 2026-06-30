import { AktivasiForm } from "./aktivasi-form";
import { AppFooter } from "@/components/app-footer";

export default function AktivasiPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/20 p-4">
      <div className="w-full max-w-sm rounded-2xl border bg-card/90 p-8 shadow-xl shadow-primary/5 backdrop-blur-sm">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-sm shadow-primary/30">
            PS
          </div>
          <h1 className="text-xl font-bold tracking-tight">Aktivasi Akun</h1>
          <p className="text-sm text-muted-foreground">
            Untuk siswa & guru yang belum pernah membuat akun
          </p>
        </div>
        <AktivasiForm />
      </div>
      <div className="absolute inset-x-0 bottom-2"><AppFooter /></div>
    </div>
  );
}
