"use client";

import { useState } from "react";
import { Eye, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimpleCrud } from "@/components/simple-crud";
import { createKelas, updateKelas, deleteKelas } from "./actions";
import { KelasSiswaModal } from "./kelas-siswa-modal";
import { KelasMasalModal } from "./kelas-masal-modal";

type Kelas = {
  id_kelas: string;
  nama_kelas: string;
  tingkat: number | null;
  id_jurusan: string | null;
  id_tahun_ajaran: string | null;
  aktif: boolean;
  jurusan_nama: string | null;
  tahun_ajaran_nama: string | null;
  jumlah_siswa: number;
};

export function KelasClient({
  rows,
  jurusanOptions,
  tahunAjaranOptions,
}: {
  rows: Kelas[];
  jurusanOptions: { value: string; label: string }[];
  tahunAjaranOptions: { value: string; label: string }[];
}) {
  const [selected, setSelected] = useState<Kelas | null>(null);
  const [masalOpen, setMasalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setMasalOpen(true)}>
          <Layers className="size-4" />
          Buat Kelas Massal
        </Button>
      </div>

      <SimpleCrud<Kelas>
        title="Kelas"
        idKey="id_kelas"
        rows={rows}
        columns={[
          { key: "nama_kelas", label: "Nama Kelas" },
          { key: "tingkat", label: "Tingkat" },
          { key: "jurusan_nama", label: "Jurusan", render: (r) => r.jurusan_nama ?? "-" },
          { key: "tahun_ajaran_nama", label: "Tahun Ajaran", render: (r) => r.tahun_ajaran_nama ?? "-" },
          { key: "jumlah_siswa", label: "Jumlah Siswa" },
        ]}
        fields={[
          { name: "nama_kelas", label: "Nama Kelas", required: true },
          { name: "tingkat", label: "Tingkat (cth: 10, 11, 12)" },
          { name: "id_jurusan", label: "Jurusan", type: "select", options: jurusanOptions },
          { name: "id_tahun_ajaran", label: "Tahun Ajaran", type: "select", required: true, options: tahunAjaranOptions },
          { name: "aktif", label: "Aktif", type: "checkbox" },
        ]}
        createAction={createKelas}
        updateAction={updateKelas}
        deleteAction={deleteKelas}
        renderExtraActions={(row) => (
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-primary hover:bg-primary/10"
            onClick={() => setSelected(row)}
            aria-label="Lihat siswa"
          >
            <Eye className="size-3.5" />
          </Button>
        )}
      />

      {selected && (
        <KelasSiswaModal
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
          idKelas={selected.id_kelas}
          idTahunAjaran={selected.id_tahun_ajaran ?? ""}
          namaKelas={selected.nama_kelas}
        />
      )}

      <KelasMasalModal
        open={masalOpen}
        onOpenChange={setMasalOpen}
        jurusanOptions={jurusanOptions}
        tahunAjaranOptions={tahunAjaranOptions}
      />
    </>
  );
}
