"use client";

import { Badge } from "@/components/ui/badge";
import { SimpleCrud } from "@/components/simple-crud";
import { createSiswa, updateSiswa, deleteSiswa } from "./actions";

type Siswa = {
  id_siswa: string;
  nama_lengkap: string;
  nisn: string | null;
  nis: string | null;
  jenkel: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  agama: string | null;
  aktif: boolean;
  akun_aktif: boolean;
  kelas_terkini: string | null;
};

export function SiswaClient({ rows }: { rows: Siswa[] }) {
  return (
    <SimpleCrud<Siswa>
      title="Siswa"
      idKey="id_siswa"
      rows={rows}
      columns={[
        { key: "nama_lengkap", label: "Nama Lengkap" },
        { key: "nisn", label: "NISN" },
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
        { name: "nis", label: "NIS" },
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
    />
  );
}
