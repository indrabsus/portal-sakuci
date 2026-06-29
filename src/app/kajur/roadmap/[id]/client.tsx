"use client";

import { useState } from "react";
import { ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SimpleCrud } from "@/components/simple-crud";
import { createKompetensiTugas, updateKompetensiTugas, deleteKompetensiTugas } from "./actions";
import { SoalTesModal } from "./soal-tes-modal";

type KompetensiTugas = {
  id_kompetensi_tugas: string;
  judul: string;
  deskripsi: string | null;
  deadline: string | null;
  status: string;
  jumlah_soal: number;
};

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "aktif", label: "Aktif" },
  { value: "ditutup", label: "Ditutup" },
];

export function KompetensiTugasClient({
  idKompetensi,
  judulKompetensi,
  idJurusan,
  jurusanOptions,
  rows,
}: {
  idKompetensi: string;
  judulKompetensi: string;
  idJurusan: string | null;
  jurusanOptions: { value: string; label: string }[];
  rows: KompetensiTugas[];
}) {
  const [selected, setSelected] = useState<KompetensiTugas | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{judulKompetensi}</h1>
        <p className="text-sm text-muted-foreground">Tes / quest kompetensi untuk siswa</p>
      </div>

      <SimpleCrud<KompetensiTugas>
        title="Tes Kompetensi"
        idKey="id_kompetensi_tugas"
        rows={rows}
        columns={[
          { key: "judul", label: "Judul Tes" },
          { key: "jumlah_soal", label: "Jumlah Soal" },
          { key: "deadline", label: "Deadline", render: (r) => (r.deadline ? new Date(r.deadline).toLocaleDateString("id-ID") : "-") },
          {
            key: "status",
            label: "Status",
            render: (r) => {
              const variant = r.status === "aktif" ? "default" : r.status === "ditutup" ? "secondary" : "secondary";
              return <Badge variant={variant}>{STATUS_OPTIONS.find((s) => s.value === r.status)?.label ?? r.status}</Badge>;
            },
          },
        ]}
        fields={[
          { name: "judul", label: "Judul Tes", required: true },
          { name: "deskripsi", label: "Deskripsi" },
          { name: "deadline", label: "Deadline", type: "date" },
          { name: "status", label: "Status", type: "select", required: true, options: STATUS_OPTIONS },
        ]}
        createAction={(formData) => {
          formData.set("id_kompetensi", idKompetensi);
          return createKompetensiTugas(formData);
        }}
        updateAction={updateKompetensiTugas}
        deleteAction={deleteKompetensiTugas}
        renderExtraActions={(row) => (
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-primary hover:bg-primary/10"
            onClick={() => setSelected(row)}
            aria-label="Kelola soal"
          >
            <ListChecks className="size-3.5" />
          </Button>
        )}
      />

      {selected && (
        <SoalTesModal
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
          idKompetensiTugas={selected.id_kompetensi_tugas}
          judulTes={selected.judul}
          idJurusanDefault={idJurusan ?? undefined}
          jurusanOptions={jurusanOptions}
        />
      )}
    </div>
  );
}
