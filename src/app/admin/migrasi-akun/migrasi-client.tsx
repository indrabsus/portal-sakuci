"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle, Loader2, RefreshCw, ArrowRight } from "lucide-react";
import { jalankanMigrasi, type AkunLama, type HasilMigrasi } from "./actions";
import { Button } from "@/components/ui/button";

export function MigrasiClient({ akun }: { akun: AkunLama[] }) {
  // usernames yang bisa diedit per item
  const [usernames, setUsernames] = useState<Record<string, string>>(
    Object.fromEntries(akun.map((a) => [a.id_profile, a.username_saran]))
  );
  const [selected, setSelected] = useState<Set<string>>(
    new Set(akun.map((a) => a.id_profile))
  );
  const [hasil, setHasil] = useState<HasilMigrasi[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(akun.map((a) => a.id_profile)) : new Set());
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleMigrasi = () => {
    const items = [...selected].map((id) => ({
      id_profile: id,
      username: usernames[id] ?? "",
    }));
    startTransition(async () => {
      const res = await jalankanMigrasi(items);
      setHasil(res);
    });
  };

  // ── sudah semua selesai ──
  if (hasil) {
    const berhasil = hasil.filter((h) => h.status === "berhasil");
    const gagal = hasil.filter((h) => h.status === "gagal");
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
              <CheckCircle2 size={15} /> {berhasil.length} berhasil
            </span>
            {gagal.length > 0 && (
              <span className="flex items-center gap-1.5 text-red-500 font-medium">
                <XCircle size={15} /> {gagal.length} gagal
              </span>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => setHasil(null)}>
            <RefreshCw size={14} className="mr-1.5" /> Cek ulang
          </Button>
        </div>

        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Nama</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Email Lama</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Username Baru</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {hasil.map((h) => (
                <tr key={h.id_profile} className="hover:bg-muted/30">
                  <td className="px-4 py-2.5">{h.nama_lengkap ?? "—"}</td>
                  <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">{h.email_lama}</td>
                  <td className="px-4 py-2.5 font-mono text-xs">{h.email_baru}</td>
                  <td className="px-4 py-2.5">
                    {h.status === "berhasil" ? (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle2 size={13} /> Berhasil
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500" title={h.pesan}>
                        <XCircle size={13} /> {h.pesan}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── belum ada akun yang perlu migrasi ──
  if (akun.length === 0) {
    return (
      <div className="rounded-xl border bg-muted/30 px-6 py-12 text-center">
        <CheckCircle2 size={32} className="mx-auto mb-3 text-green-500" />
        <p className="font-medium">Semua akun sudah menggunakan format @sakuci.id</p>
        <p className="text-sm text-muted-foreground mt-1">Tidak ada yang perlu dimigrasi.</p>
      </div>
    );
  }

  // ── form migrasi ──
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{akun.length} akun</span> dengan email lama ditemukan.
          Periksa username saran di bawah — edit jika perlu — lalu jalankan migrasi.
        </p>
        <Button
          onClick={handleMigrasi}
          disabled={isPending || selected.size === 0}
          className="gap-2"
        >
          {isPending ? (
            <><Loader2 size={15} className="animate-spin" /> Memproses {selected.size} akun...</>
          ) : (
            <><ArrowRight size={15} /> Migrasi {selected.size} akun dipilih</>
          )}
        </Button>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2.5 w-10">
                <input
                  type="checkbox"
                  checked={selected.size === akun.length}
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="rounded"
                />
              </th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Nama</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Email Lama</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">
                Username Baru <span className="text-xs font-normal">(bisa diedit)</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {akun.map((a) => (
              <tr key={a.id_profile} className={selected.has(a.id_profile) ? "bg-muted/20" : "opacity-50"}>
                <td className="px-4 py-2.5 text-center">
                  <input
                    type="checkbox"
                    checked={selected.has(a.id_profile)}
                    onChange={() => toggleOne(a.id_profile)}
                    className="rounded"
                  />
                </td>
                <td className="px-4 py-2.5 font-medium">{a.nama_lengkap ?? "—"}</td>
                <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">{a.email_lama}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center rounded-md border bg-background overflow-hidden w-fit focus-within:ring-2 focus-within:ring-ring">
                    <input
                      value={usernames[a.id_profile] ?? ""}
                      onChange={(e) =>
                        setUsernames((prev) => ({
                          ...prev,
                          [a.id_profile]: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""),
                        }))
                      }
                      className="px-2 py-1 text-xs font-mono bg-transparent outline-none w-36"
                      disabled={!selected.has(a.id_profile)}
                    />
                    <span className="px-2 py-1 text-xs text-muted-foreground bg-muted border-l select-none">
                      @sakuci.id
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
