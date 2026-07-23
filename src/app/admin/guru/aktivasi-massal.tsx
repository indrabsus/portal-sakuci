"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle, Loader2, RefreshCw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  aktivasiMassalGuru,
  type HasilAktivasiGuru,
  type SaranAktivasiGuru,
} from "./actions";

type GuruBelumAktivasi = {
  id_guru: string;
  nama_lengkap: string;
};

export function AktivasiMassalDialog({
  guruBelumAktivasi,
  saran,
  onSelesai,
}: {
  guruBelumAktivasi: GuruBelumAktivasi[];
  saran: SaranAktivasiGuru[];
  onSelesai: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="outline"
        className="gap-2"
        onClick={() => setOpen(true)}
        disabled={guruBelumAktivasi.length === 0}
      >
        <UserPlus className="size-4" />
        Aktivasi Massal {guruBelumAktivasi.length > 0 ? `(${guruBelumAktivasi.length})` : ""}
      </Button>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Aktivasi Massal Akun Guru</DialogTitle>
          <DialogDescription>
            Buat akun langsung untuk guru yang belum aktivasi mandiri. Username otomatis dari nama
            (bisa diedit), password default <span className="font-mono text-foreground">123456</span> —
            sampaikan ke masing-masing guru agar segera diganti setelah login pertama.
          </DialogDescription>
        </DialogHeader>

        {/* Mount ulang tiap dialog dibuka supaya state (pilihan, username, hasil)
            selalu mulai bersih dari saran terbaru - tanpa perlu effect sinkronisasi. */}
        {open && (
          <AktivasiMassalForm
            guruBelumAktivasi={guruBelumAktivasi}
            saran={saran}
            onClose={() => setOpen(false)}
            onSelesai={onSelesai}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AktivasiMassalForm({
  guruBelumAktivasi,
  saran,
  onClose,
  onSelesai,
}: {
  guruBelumAktivasi: GuruBelumAktivasi[];
  saran: SaranAktivasiGuru[];
  onClose: () => void;
  onSelesai: () => void;
}) {
  const [usernames, setUsernames] = useState<Record<string, string>>(() =>
    Object.fromEntries(saran.map((s) => [s.id_guru, s.username_saran]))
  );
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(guruBelumAktivasi.map((g) => g.id_guru))
  );
  const [hasil, setHasil] = useState<HasilAktivasiGuru[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(guruBelumAktivasi.map((g) => g.id_guru)) : new Set());
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAktivasi = () => {
    const items = [...selected].map((id) => ({
      id_guru: id,
      username: usernames[id] ?? "",
    }));

    startTransition(async () => {
      const res = await aktivasiMassalGuru(items);
      setHasil(res);
      if (res.some((h) => h.status === "berhasil")) {
        onSelesai();
      }
    });
  };

  if (hasil) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1.5 font-medium text-green-600 dark:text-green-400">
              <CheckCircle2 size={15} /> {hasil.filter((h) => h.status === "berhasil").length} berhasil
            </span>
            {hasil.some((h) => h.status === "gagal") && (
              <span className="flex items-center gap-1.5 font-medium text-red-500">
                <XCircle size={15} /> {hasil.filter((h) => h.status === "gagal").length} gagal
              </span>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted/50">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Nama</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Username</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {hasil.map((h) => (
                <tr key={h.id_guru} className="hover:bg-muted/30">
                  <td className="px-4 py-2.5">{h.nama_lengkap}</td>
                  <td className="px-4 py-2.5 font-mono text-xs">{h.username}@sakuci.id</td>
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

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setHasil(null)}>
            <RefreshCw size={14} className="mr-1.5" /> Kembali
          </Button>
          <Button type="button" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="max-h-96 overflow-y-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/50">
            <tr>
              <th className="w-10 px-4 py-2.5">
                <input
                  type="checkbox"
                  checked={selected.size === guruBelumAktivasi.length && guruBelumAktivasi.length > 0}
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="rounded"
                />
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Nama</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Username <span className="text-xs font-normal">(bisa diedit)</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {guruBelumAktivasi.map((g) => (
              <tr key={g.id_guru} className={selected.has(g.id_guru) ? "bg-muted/20" : "opacity-50"}>
                <td className="px-4 py-2.5 text-center">
                  <input
                    type="checkbox"
                    checked={selected.has(g.id_guru)}
                    onChange={() => toggleOne(g.id_guru)}
                    className="rounded"
                  />
                </td>
                <td className="px-4 py-2.5 font-medium">{g.nama_lengkap}</td>
                <td className="px-4 py-2.5">
                  <div className="flex w-fit items-center overflow-hidden rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring">
                    <input
                      value={usernames[g.id_guru] ?? ""}
                      onChange={(e) =>
                        setUsernames((prev) => ({
                          ...prev,
                          [g.id_guru]: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""),
                        }))
                      }
                      className="w-36 bg-transparent px-2 py-1 font-mono text-xs outline-none"
                      disabled={!selected.has(g.id_guru)}
                    />
                    <span className="select-none border-l bg-muted px-2 py-1 text-xs text-muted-foreground">
                      @sakuci.id
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button onClick={handleAktivasi} disabled={isPending || selected.size === 0} className="gap-2">
          {isPending ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Memproses {selected.size} guru...
            </>
          ) : (
            <>
              <UserPlus size={15} /> Aktifkan {selected.size} Guru
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}
