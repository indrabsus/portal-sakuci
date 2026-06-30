"use client";

import { Badge } from "@/components/ui/badge";
import { SimpleCrud } from "@/components/simple-crud";
import { InitialsAvatar } from "@/components/initials-avatar";
import { createGuru, updateGuru, deleteGuru } from "./actions";

type Guru = {
  id_guru: string;
  nama_lengkap: string;
  uid_fp: string | null;
  no_hp: string | null;
  jenkel: string | null;
  foto_url: string | null;
  akun_aktif: boolean;
};

export function GuruClient({ rows }: { rows: Guru[] }) {
  return (
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
  );
}
