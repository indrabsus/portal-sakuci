import { requireRole } from "@/lib/auth";
import { getAkunBelumMigrasi } from "./actions";
import { MigrasiClient } from "./migrasi-client";

export default async function MigrasiAkunPage() {
  await requireRole(["admin"]);
  const akun = await getAkunBelumMigrasi();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Migrasi Akun ke Username</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Konversi email lama (Gmail, dll) ke format <span className="font-mono text-foreground">username@sakuci.id</span> agar bisa login dengan username.
        </p>
      </div>
      <MigrasiClient akun={akun} />
    </div>
  );
}
