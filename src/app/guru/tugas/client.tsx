"use client";

import { useState } from "react";
import { ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SimpleCrud } from "@/components/simple-crud";
import type { BankSoalRow } from "@/features/bank-soal/types";
import { createTugas, updateTugas, deleteTugas } from "./actions";
import { SoalTugasModal } from "./soal-tugas-modal";

type TugasRow = {
  id_tugas: string;
  id_mengajar: string;
  judul: string;
  deskripsi: string | null;
  deadline: string | null;
  status: string;
  semester: string;
  mengajar_label: string;
  jumlah_soal: number;
};

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "aktif", label: "Aktif" },
  { value: "ditutup", label: "Ditutup" },
];

const SEMESTER_OPTIONS = [
  { value: "ganjil", label: "Ganjil" },
  { value: "genap", label: "Genap" },
];

export function TugasClient({
  rows,
  mengajarOptions,
  bankSoal,
}: {
  rows: TugasRow[];
  mengajarOptions: { value: string; label: string }[];
  bankSoal: BankSoalRow[];
}) {
  const [selected, setSelected] = useState<TugasRow | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <SimpleCrud<TugasRow>
        title="Tugas"
        idKey="id_tugas"
        rows={rows}
        columns={[
          { key: "judul", label: "Judul Tugas" },
          { key: "mengajar_label", label: "Kelas/Mapel" },
          { key: "semester", label: "Semester", render: (r) => (r.semester === "ganjil" ? "Ganjil" : "Genap") },
          { key: "jumlah_soal", label: "Jumlah Soal" },
          { key: "deadline", label: "Deadline", render: (r) => (r.deadline ? new Date(r.deadline).toLocaleDateString("id-ID") : "-") },
          {
            key: "status",
            label: "Status",
            render: (r) => <Badge variant={r.status === "aktif" ? "default" : "secondary"}>{STATUS_OPTIONS.find((s) => s.value === r.status)?.label ?? r.status}</Badge>,
          },
        ]}
        fields={[
          { name: "id_mengajar", label: "Kelas / Mapel", type: "select", required: true, options: mengajarOptions },
          { name: "judul", label: "Judul Tugas", required: true },
          { name: "deskripsi", label: "Deskripsi" },
          { name: "deadline", label: "Deadline", type: "date" },
          { name: "semester", label: "Semester", type: "select", required: true, options: SEMESTER_OPTIONS },
          { name: "status", label: "Status", type: "select", required: true, options: STATUS_OPTIONS },
        ]}
        createAction={createTugas}
        updateAction={updateTugas}
        deleteAction={deleteTugas}
        renderExtraActions={(row) => (
          <button
            type="button"
            onClick={() => setSelected(row)}
            aria-label="Kelola soal"
            className="inline-flex size-7 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary/10"
          >
            <ListChecks className="size-3.5" />
          </button>
        )}
      />

      {selected && (
        <SoalTugasModal
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
          idTugas={selected.id_tugas}
          judulTugas={selected.judul}
          bankSoal={bankSoal}
        />
      )}
    </div>
  );
}
