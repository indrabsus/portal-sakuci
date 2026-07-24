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
  aktivasiMassalSiswa,
  type HasilAktivasiSiswa,
  type SaranAktivasiSiswa,
} from "./actions";

type SiswaBelumAktivasi = {
  id_siswa: string;
  nama_lengkap: string;
};

export function AktivasiMassalSiswaDialog({
  siswaBelumAktivasi,
  saran,
  onSelesai,
}: {
  siswaBelumAktivasi: SiswaBelumAktivasi[];
  saran: SaranAktivasiSiswa[];
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
        disabled={siswaBelumAktivasi.length === 0}
      >
        <UserPlus className="size-4" />
        Aktivasi Massal {siswaBelumAktivasi.length > 0 ? `(${siswaBelumAktivasi.length})` : ""}
      </Button>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Aktivasi Massal Akun Siswa</DialogTitle>
          <DialogDescription>
            Buat akun langsung untuk siswa yang belum aktivasi mandiri (mengikuti filter kelas &amp; pencarian saat
            ini). Username otomatis dari nama (bisa diedit), password default{" "}
            <span className="font-mono text-foreground">123456</span> — sampaikan ke masing-masing siswa agar segera
            diganti setelah login pertama.
          </DialogDescription>
        </DialogHeader>

        {/* Mount ulang tiap dialog dibuka supaya state (pilihan, username, hasil)
            selalu mulai bersih dari saran terbaru - tanpa perlu effect sinkronisasi. */}
        {open && (
          <AktivasiMassalSiswaForm
            siswaBelumAktivasi={siswaBelumAktivasi}
            saran={saran}
            onClose={() => setOpen(false)}
            onSelesai={onSelesai}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AktivasiMassalSiswaForm({
  siswaBelumAktivasi,
  saran,
  onClose,
  onSelesai,
}: {
  siswaBelumAktivasi: SiswaBelumAktivasi[];
  saran: SaranAktivasiSiswa[];
  onClose: () => void;
  onSelesai: () => void;
}) {
  const [usernames, setUsernames] = useState<Record<string, string>>(() =>
    Object.fromEntries(saran.map((s) => [s.id_siswa, s.username_saran]))
  );
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(siswaBelumAktivasi.map((s) => s.id_siswa))
  );
  const [hasil, setHasil] = useState<HasilAktivasiSiswa[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(siswaBelumAktivasi.map((s) => s.id_siswa)) : new Set());
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
      id_siswa: id,
      username: usernames[id] ?? "",
    }));

    startTransition(async () => {
      const res = await aktivasiMassalSiswa(items);
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
                <tr key={h.id_siswa} className="hover:bg-muted/30">
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
                  checked={selected.size === siswaBelumAktivasi.length && siswaBelumAktivasi.length > 0}
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
            {siswaBelumAktivasi.map((s) => (
              <tr key={s.id_siswa} className={selected.has(s.id_siswa) ? "bg-muted/20" : "opacity-50"}>
                <td className="px-4 py-2.5 text-center">
                  <input
                    type="checkbox"
                    checked={selected.has(s.id_siswa)}
                    onChange={() => toggleOne(s.id_siswa)}
                    className="rounded"
                  />
                </td>
                <td className="px-4 py-2.5 font-medium">{s.nama_lengkap}</td>
                <td className="px-4 py-2.5">
                  <div className="flex w-fit items-center overflow-hidden rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring">
                    <input
                      value={usernames[s.id_siswa] ?? ""}
                      onChange={(e) =>
                        setUsernames((prev) => ({
                          ...prev,
                          [s.id_siswa]: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""),
                        }))
                      }
                      className="w-36 bg-transparent px-2 py-1 font-mono text-xs outline-none"
                      disabled={!selected.has(s.id_siswa)}
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
              <Loader2 size={15} className="animate-spin" /> Memproses {selected.size} siswa...
            </>
          ) : (
            <>
              <UserPlus size={15} /> Aktifkan {selected.size} Siswa
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}
