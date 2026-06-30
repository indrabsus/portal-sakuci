"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { SimpleCrud } from "@/components/simple-crud";
import { createSiswa, updateSiswa, deleteSiswa, resetPasswordSiswa } from "./actions";

type Siswa = {
  id_siswa: string;
  nama_lengkap: string;
  nisn: string | null;
  jenkel: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  agama: string | null;
  no_hp: string | null;
  aktif: boolean;
  akun_aktif: boolean;
  id_profile: string | null;
  kelas_terkini: string | null;
};

function formatTtl(tempat: string | null, tanggal: string | null) {
  const tgl = tanggal
    ? new Date(tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : null;
  if (tempat && tgl) return `${tempat}, ${tgl}`;
  if (tgl) return tgl;
  if (tempat) return tempat;
  return "-";
}

export function SiswaClient({ rows }: { rows: Siswa[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [resetTarget, setResetTarget] = useState<Siswa | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.nama_lengkap.toLowerCase().includes(q) ||
        (r.nisn ?? "").toLowerCase().includes(q) ||
        (r.kelas_terkini ?? "").toLowerCase().includes(q),
    );
  }, [rows, search]);

  function handleReset() {
    if (!resetTarget?.id_profile || !resetTarget.nisn) return;
    setMessage(null);
    const formData = new FormData();
    formData.set("id_profile", resetTarget.id_profile);
    formData.set("nisn", resetTarget.nisn);
    startTransition(async () => {
      const result = await resetPasswordSiswa(formData);
      setMessage(result.message);
      if (result.success) router.refresh();
    });
  }

  return (
    <>
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, NISN, atau kelas..."
          className="pl-8"
        />
      </div>

      <SimpleCrud<Siswa>
        title="Siswa"
        idKey="id_siswa"
        rows={filtered}
        columns={[
          { key: "nama_lengkap", label: "Nama Lengkap" },
          { key: "nisn", label: "NISN" },
          {
            key: "tanggal_lahir",
            label: "Tempat, Tanggal Lahir",
            render: (r) => formatTtl(r.tempat_lahir, r.tanggal_lahir),
          },
          { key: "no_hp", label: "No. HP", render: (r) => r.no_hp ?? "-" },
          { key: "kelas_terkini", label: "Kelas", render: (r) => r.kelas_terkini ?? "-" },
          { key: "aktif", label: "Status", render: (r) => (r.aktif ? "Aktif" : "Nonaktif") },
          {
            key: "akun_aktif",
            label: "Akun",
            render: (r) =>
              r.akun_aktif ? <Badge>Aktif</Badge> : <Badge variant="secondary">Belum aktivasi</Badge>,
          },
        ]}
        fields={[
          { name: "nama_lengkap", label: "Nama Lengkap", required: true },
          { name: "nisn", label: "NISN", required: true },
          { name: "tanggal_lahir", label: "Tanggal Lahir (untuk aktivasi akun)", type: "date", required: true },
          { name: "tempat_lahir", label: "Tempat Lahir" },
          {
            name: "jenkel",
            label: "Jenis Kelamin",
            type: "select",
            options: [
              { value: "L", label: "Laki-laki" },
              { value: "P", label: "Perempuan" },
            ],
          },
          { name: "agama", label: "Agama" },
          { name: "aktif", label: "Aktif", type: "checkbox" },
        ]}
        createAction={createSiswa}
        updateAction={updateSiswa}
        deleteAction={deleteSiswa}
        renderExtraActions={(row) =>
          row.akun_aktif ? (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-primary hover:bg-primary/10"
              onClick={() => {
                setMessage(null);
                setResetTarget(row);
              }}
              aria-label="Reset password"
            >
              <KeyRound className="size-3.5" />
            </Button>
          ) : null
        }
      />

      <Dialog open={!!resetTarget} onOpenChange={(open) => !open && setResetTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password - {resetTarget?.nama_lengkap}</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Password akan direset ke NISN siswa: <span className="font-mono font-medium text-foreground">{resetTarget?.nisn}</span>
          </p>

          {message && (
            <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{message}</p>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setResetTarget(null)} disabled={isPending}>
              Tutup
            </Button>
            <Button onClick={handleReset} disabled={isPending}>
              {isPending ? "Memproses..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
