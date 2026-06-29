"use client";

import Link from "next/link";
import { ListTodo } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SimpleCrud } from "@/components/simple-crud";
import { createKompetensi, updateKompetensi, deleteKompetensi } from "./actions";

type Kompetensi = {
  id_kompetensi: string;
  judul: string;
  deskripsi: string | null;
  tingkat: number | null;
  urutan: number | null;
  syarat_lulus: number;
  aktif: boolean;
};

export function RoadmapClient({ rows }: { rows: Kompetensi[] }) {
  return (
    <SimpleCrud<Kompetensi>
      title="Roadmap Kompetensi"
      idKey="id_kompetensi"
      rows={rows}
      columns={[
        { key: "urutan", label: "Urutan" },
        { key: "judul", label: "Judul Kompetensi" },
        { key: "tingkat", label: "Tingkat", render: (r) => r.tingkat ?? "-" },
        { key: "syarat_lulus", label: "Syarat Lulus" },
        {
          key: "aktif",
          label: "Status",
          render: (r) => (r.aktif ? <Badge>Aktif</Badge> : <Badge variant="secondary">Nonaktif</Badge>),
        },
      ]}
      fields={[
        { name: "judul", label: "Judul Kompetensi", required: true },
        { name: "deskripsi", label: "Deskripsi" },
        { name: "tingkat", label: "Tingkat (cth: 10, 11, 12)" },
        { name: "urutan", label: "Urutan dalam roadmap", required: true },
        { name: "syarat_lulus", label: "Syarat Nilai Lulus (0-100)", required: true },
        { name: "aktif", label: "Aktif", type: "checkbox" },
      ]}
      createAction={createKompetensi}
      updateAction={updateKompetensi}
      deleteAction={deleteKompetensi}
      renderExtraActions={(row) => (
        <Link
          href={`/kajur/roadmap/${row.id_kompetensi}`}
          aria-label="Kelola tes & soal"
          className="inline-flex size-7 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary/10"
        >
          <ListTodo className="size-3.5" />
        </Link>
      )}
    />
  );
}
