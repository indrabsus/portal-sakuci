"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Printer, Search, SendHorizonal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SimpleCrud } from "@/components/simple-crud";
import { InitialsAvatar } from "@/components/initials-avatar";
import { AktivasiMassalDialog } from "./aktivasi-massal";
import { createGuru, updateGuru, deleteGuru, sendWaBulkGuru, type SaranAktivasiGuru } from "./actions";

type Guru = {
  id_guru: string;
  nama_lengkap: string;
  uid_fp: string | null;
  no_hp: string | null;
  jenkel: string | null;
  foto_url: string | null;
  akun_aktif: boolean;
  username: string | null;
};

export function GuruClient({ rows, saran }: { rows: Guru[]; saran: SaranAktivasiGuru[] }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [isWaModalOpen, setWaModalOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isSending, startSending] = useTransition();

  const belumAktivasi = useMemo(
    () => rows.filter((r) => !r.akun_aktif).map((r) => ({ id_guru: r.id_guru, nama_lengkap: r.nama_lengkap })),
    [rows]
  );

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return rows;
    return rows.filter((row) => row.nama_lengkap.toLowerCase().includes(query) || (row.no_hp ?? "").toLowerCase().includes(query));
  }, [rows, search]);

  function toggleSelection(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  }

  function handleSendWa() {
    if (!selectedIds.length || !message.trim()) {
      setStatus("Pilih guru dan isi pesan terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.set("ids", selectedIds.join(","));
    formData.set("message", message.trim());

    startSending(async () => {
      const result = await sendWaBulkGuru(formData);
      setStatus(result.message);
      if (result.success) {
        setSelectedIds([]);
        setMessage("");
        setWaModalOpen(false);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Aktivasi & komunikasi massal</p>
          <p className="text-sm text-muted-foreground">
            Aktifkan akun guru yang belum login, atau kirim WhatsApp ke guru terpilih.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AktivasiMassalDialog
            guruBelumAktivasi={belumAktivasi}
            saran={saran}
            onSelesai={() => router.refresh()}
          />
          <Button type="button" onClick={() => setWaModalOpen(true)} className="gap-2" disabled={rows.length === 0}>
            <SendHorizonal className="size-4" />
            Kirim WhatsApp
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => window.print()}
            className="gap-2"
            disabled={rows.length === 0}
          >
            <Printer className="size-4" />
            Cetak PDF
          </Button>
        </div>
      </div>

      {status ? (
        <div className={status.startsWith("Berhasil") ? "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700" : "rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"}>
          {status}
        </div>
      ) : null}

      <Dialog open={isWaModalOpen} onOpenChange={setWaModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Kirim WhatsApp ke guru</DialogTitle>
            <DialogDescription>Pilih guru yang ingin dikirimi, lalu ketik pesan yang akan dikirim.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama guru atau nomor..."
                className="pl-9"
              />
            </div>
            <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border p-3">
              {filteredRows.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tidak ada guru yang cocok.</p>
              ) : (
                filteredRows.map((row) => (
                  <label key={row.id_guru} className="flex cursor-pointer items-center gap-3 rounded-md border p-2 transition hover:bg-accent/40">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id_guru)}
                      onChange={() => toggleSelection(row.id_guru)}
                      className="h-4 w-4 shrink-0"
                    />
                    <InitialsAvatar name={row.nama_lengkap} fotoUrl={row.foto_url} className="size-8 text-xs" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{row.nama_lengkap}</p>
                      <p className="truncate text-xs text-muted-foreground">{row.no_hp ?? "-"}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="wa-message">Pesan</Label>
              <Textarea
                id="wa-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                placeholder="Contoh: Assalamualaikum, informasi penting..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setWaModalOpen(false)}>
              Batal
            </Button>
            <Button type="button" onClick={handleSendWa} disabled={isSending || !selectedIds.length || !message.trim()} className="gap-2">
              <SendHorizonal className="size-4" />
              {isSending ? "Mengirim..." : "Kirim WhatsApp"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="no-print">
      <SimpleCrud<Guru>
        title="Guru"
        idKey="id_guru"
        rows={rows}
        columns={[
        {
          key: "nama_lengkap",
          label: "Nama Lengkap",
          render: (r) => (
            <div className="flex items-center gap-2.5">
              <InitialsAvatar name={r.nama_lengkap} fotoUrl={r.foto_url} className="size-8 text-xs" />
              {r.nama_lengkap}
            </div>
          ),
        },
        { key: "uid_fp", label: "UID FP" },
        { key: "no_hp", label: "No HP" },
        {
          key: "akun_aktif",
          label: "Status Akun",
          render: (r) =>
            r.akun_aktif ? (
              <Badge>Aktif</Badge>
            ) : (
              <Badge variant="secondary">Belum aktivasi</Badge>
            ),
        },
      ]}
      fields={[
        { name: "nama_lengkap", label: "Nama Lengkap", required: true },
        { name: "uid_fp", label: "UID FP (untuk aktivasi akun)", required: true },
        { name: "no_hp", label: "No HP", required: true },
        {
          name: "jenkel",
          label: "Jenis Kelamin",
          type: "select",
          options: [
            { value: "L", label: "Laki-laki" },
            { value: "P", label: "Perempuan" },
          ],
        },
      ]}
        createAction={createGuru}
        updateAction={updateGuru}
        deleteAction={deleteGuru}
      />
      </div>

      <div className="hidden print:block">
        <h1 className="mb-3 text-lg font-bold">Data Guru</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>No HP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id_guru}>
                <TableCell>{r.nama_lengkap}</TableCell>
                <TableCell>{r.username ?? "-"}</TableCell>
                <TableCell>{r.no_hp ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
