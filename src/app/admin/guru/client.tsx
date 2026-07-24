"use client";

import { useRouter } from "next/navigation";
import { Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SimpleCrud } from "@/components/simple-crud";
import { InitialsAvatar } from "@/components/initials-avatar";
import { AktivasiMassalDialog } from "./aktivasi-massal";
import { createGuru, updateGuru, deleteGuru, type SaranAktivasiGuru } from "./actions";

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
  const belumAktivasi = rows.filter((r) => !r.akun_aktif).map((r) => ({ id_guru: r.id_guru, nama_lengkap: r.nama_lengkap }));

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Aktivasi massal & cetak data</p>
          <p className="text-sm text-muted-foreground">Aktifkan akun guru yang belum login, atau cetak data guru.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AktivasiMassalDialog guruBelumAktivasi={belumAktivasi} saran={saran} onSelesai={() => router.refresh()} />
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

      <div className="hidden print:block p-6">
        <h1 className="mb-3 text-lg font-bold">Data Guru</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="border">Nama Lengkap</TableHead>
              <TableHead className="border">Username</TableHead>
              <TableHead className="border">No HP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id_guru}>
                <TableCell className="border">{r.nama_lengkap}</TableCell>
                <TableCell className="border">{r.username ?? "-"}</TableCell>
                <TableCell className="border">{r.no_hp ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
