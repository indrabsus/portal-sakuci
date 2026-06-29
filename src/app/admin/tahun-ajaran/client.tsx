"use client";

import { SimpleCrud } from "@/components/simple-crud";
import { createTahunAjaran, updateTahunAjaran, deleteTahunAjaran } from "./actions";

type TahunAjaran = {
  id_tahun_ajaran: string;
  nama_tahun_ajaran: string;
  semester: string;
  aktif: boolean;
};

export function TahunAjaranClient({ rows }: { rows: TahunAjaran[] }) {
  return (
    <SimpleCrud<TahunAjaran>
      title="Tahun Ajaran"
      idKey="id_tahun_ajaran"
      rows={rows}
      columns={[
        { key: "nama_tahun_ajaran", label: "Tahun Ajaran" },
        { key: "semester", label: "Semester", render: (r) => (r.semester === "ganjil" ? "Ganjil" : "Genap") },
        { key: "aktif", label: "Status", render: (r) => (r.aktif ? "Aktif" : "-") },
      ]}
      fields={[
        { name: "nama_tahun_ajaran", label: "Nama Tahun Ajaran (cth: 2025/2026)", required: true },
        {
          name: "semester",
          label: "Semester",
          type: "select",
          required: true,
          options: [
            { value: "ganjil", label: "Ganjil" },
            { value: "genap", label: "Genap" },
          ],
        },
        { name: "aktif", label: "Jadikan tahun ajaran aktif", type: "checkbox" },
      ]}
      createAction={createTahunAjaran}
      updateAction={updateTahunAjaran}
      deleteAction={deleteTahunAjaran}
    />
  );
}
