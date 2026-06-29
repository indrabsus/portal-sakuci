"use client";

import { SimpleCrud } from "@/components/simple-crud";
import { createJurusan, updateJurusan, deleteJurusan } from "./actions";

type Jurusan = {
  id_jurusan: string;
  kode_jurusan: string;
  nama_jurusan: string;
  deskripsi: string | null;
  aktif: boolean;
};

export function JurusanClient({ rows }: { rows: Jurusan[] }) {
  return (
    <SimpleCrud<Jurusan>
      title="Jurusan"
      idKey="id_jurusan"
      rows={rows}
      columns={[
        { key: "kode_jurusan", label: "Kode" },
        { key: "nama_jurusan", label: "Nama Jurusan" },
        { key: "aktif", label: "Status", render: (r) => (r.aktif ? "Aktif" : "Nonaktif") },
      ]}
      fields={[
        { name: "kode_jurusan", label: "Kode Jurusan (cth: RPL)", required: true },
        { name: "nama_jurusan", label: "Nama Jurusan", required: true },
        { name: "deskripsi", label: "Deskripsi (untuk halaman publik)", type: "textarea" },
        { name: "aktif", label: "Aktif", type: "checkbox" },
      ]}
      createAction={createJurusan}
      updateAction={updateJurusan}
      deleteAction={deleteJurusan}
    />
  );
}
