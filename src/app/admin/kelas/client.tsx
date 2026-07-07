"use client";

import { useMemo, useState } from "react";
import { CopyPlus, Eye, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimpleCrud } from "@/components/simple-crud";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createKelas, updateKelas, deleteKelas } from "./actions";
import { KelasSiswaModal } from "./kelas-siswa-modal";
import { KelasMasalModal } from "./kelas-masal-modal";
import { DuplikatKelasModal } from "./duplikat-kelas-modal";

const SEMUA_TAHUN_AJARAN = "semua";

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
  defaultTahunAjaranId,
}: {
  rows: Kelas[];
  jurusanOptions: { value: string; label: string }[];
  tahunAjaranOptions: { value: string; label: string }[];
  defaultTahunAjaranId: string;
}) {
  const [selected, setSelected] = useState<Kelas | null>(null);
  const [masalOpen, setMasalOpen] = useState(false);
  const [duplikatOpen, setDuplikatOpen] = useState(false);
  const [filterTahunAjaran, setFilterTahunAjaran] = useState(defaultTahunAjaranId || SEMUA_TAHUN_AJARAN);

  const filterOptions = [{ value: SEMUA_TAHUN_AJARAN, label: "Semua Tahun Ajaran" }, ...tahunAjaranOptions];
  const filteredRows = useMemo(
    () => (filterTahunAjaran === SEMUA_TAHUN_AJARAN ? rows : rows.filter((r) => r.id_tahun_ajaran === filterTahunAjaran)),
    [rows, filterTahunAjaran],
  );

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="w-64">
          <Select value={filterTahunAjaran} onValueChange={(v) => setFilterTahunAjaran(v ?? SEMUA_TAHUN_AJARAN)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter tahun ajaran">
                {() => filterOptions.find((t) => t.value === filterTahunAjaran)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setDuplikatOpen(true)}>
            <CopyPlus className="size-4" />
            Duplikat Kelas
          </Button>
          <Button variant="outline" onClick={() => setMasalOpen(true)}>
            <Layers className="size-4" />
            Buat Kelas Massal
          </Button>
        </div>
      </div>

      <SimpleCrud<Kelas>
        title="Kelas"
        idKey="id_kelas"
        rows={filteredRows}
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

      <DuplikatKelasModal
        open={duplikatOpen}
        onOpenChange={setDuplikatOpen}
        rows={rows}
        tahunAjaranOptions={tahunAjaranOptions}
      />
    </>
  );
}
