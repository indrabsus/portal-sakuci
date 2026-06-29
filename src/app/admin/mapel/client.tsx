"use client";

import { SimpleCrud } from "@/components/simple-crud";
import { createMapel, updateMapel, deleteMapel } from "./actions";

type Mapel = { id_mapel: string; nama_mapel: string };

export function MapelClient({ rows }: { rows: Mapel[] }) {
  return (
    <SimpleCrud<Mapel>
      title="Mata Pelajaran"
      idKey="id_mapel"
      rows={rows}
      columns={[{ key: "nama_mapel", label: "Nama Mata Pelajaran" }]}
      fields={[{ name: "nama_mapel", label: "Nama Mata Pelajaran", required: true }]}
      createAction={createMapel}
      updateAction={updateMapel}
      deleteAction={deleteMapel}
    />
  );
}
