"use client";

import { useEffect, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/features/bank-soal/image-uploader";
import { FileUploader } from "./file-uploader";
import { createSoalKompetensi, updateSoalKompetensi, getOpsiForSoalKompetensi } from "./actions";
import type { SoalKompetensiRow, OpsiJawabanKompetensi } from "./types";

const LABELS = ["A", "B", "C", "D", "E"];
const KESULITAN_OPTIONS = [
  { value: "mudah", label: "Mudah" },
  { value: "sedang", label: "Sedang" },
  { value: "sulit", label: "Sulit" },
];

function emptyOpsi(label: string): OpsiJawabanKompetensi {
  return { label, isi_opsi: "", is_benar: false, gambar_url: null };
}

export function SoalKompetensiFormDialog({
  open,
  onOpenChange,
  editing,
  idJurusanDefault,
  jurusanOptions,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: SoalKompetensiRow | null;
  idJurusanDefault?: string;
  jurusanOptions: { value: string; label: string }[];
  onSaved: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [pertanyaan, setPertanyaan] = useState("");
  const [idJurusan, setIdJurusan] = useState("");
  const [tipeSoal, setTipeSoal] = useState<"pg" | "essay">("pg");
  const [tingkatKesulitan, setTingkatKesulitan] = useState("sedang");
  const [pembahasan, setPembahasan] = useState("");
  const [gambarUrl, setGambarUrl] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [opsi, setOpsi] = useState<OpsiJawabanKompetensi[]>([emptyOpsi("A"), emptyOpsi("B")]);

  useEffect(() => {
    if (!open) return;
    setError(null);

    if (editing) {
      setPertanyaan(editing.pertanyaan);
      setIdJurusan(editing.id_jurusan ?? "");
      setTipeSoal(editing.tipe_soal);
      setTingkatKesulitan(editing.tingkat_kesulitan ?? "sedang");
      setPembahasan(editing.pembahasan ?? "");
      setGambarUrl(editing.gambar_url);
      setFileUrl(editing.file_url);
      if (editing.tipe_soal === "pg") {
        getOpsiForSoalKompetensi(editing.id_soal_kompetensi).then((data) => {
          setOpsi(data.length > 0 ? data : [emptyOpsi("A"), emptyOpsi("B")]);
        });
      } else {
        setOpsi([emptyOpsi("A"), emptyOpsi("B")]);
      }
    } else {
      setPertanyaan("");
      setIdJurusan(idJurusanDefault ?? "");
      setTipeSoal("pg");
      setTingkatKesulitan("sedang");
      setPembahasan("");
      setGambarUrl(null);
      setFileUrl(null);
      setOpsi([emptyOpsi("A"), emptyOpsi("B")]);
    }
  }, [open, editing, idJurusanDefault]);

  function addOpsi() {
    if (opsi.length >= LABELS.length) return;
    setOpsi([...opsi, emptyOpsi(LABELS[opsi.length])]);
  }

  function removeOpsi(index: number) {
    setOpsi(opsi.filter((_, i) => i !== index).map((o, i) => ({ ...o, label: LABELS[i] })));
  }

  function updateOpsi(index: number, patch: Partial<OpsiJawabanKompetensi>) {
    setOpsi(opsi.map((o, i) => (i === index ? { ...o, ...patch } : o)));
  }

  function setBenar(index: number) {
    setOpsi(opsi.map((o, i) => ({ ...o, is_benar: i === index })));
  }

  function handleSubmit() {
    setError(null);
    if (!pertanyaan.trim()) {
      setError("Pertanyaan wajib diisi.");
      return;
    }
    if (tipeSoal === "pg") {
      if (opsi.some((o) => !o.isi_opsi.trim())) {
        setError("Semua opsi jawaban harus diisi.");
        return;
      }
      if (!opsi.some((o) => o.is_benar)) {
        setError("Tentukan satu opsi jawaban yang benar.");
        return;
      }
    }

    const formData = new FormData();
    formData.set("pertanyaan", pertanyaan);
    formData.set("id_jurusan", idJurusan);
    formData.set("tipe_soal", tipeSoal);
    formData.set("tingkat_kesulitan", tingkatKesulitan);
    formData.set("pembahasan", pembahasan);
    formData.set("gambar_url", gambarUrl ?? "");
    formData.set("file_url", fileUrl ?? "");
    formData.set("opsi_json", JSON.stringify(opsi));
    if (editing) formData.set("id_soal_kompetensi", editing.id_soal_kompetensi);

    startTransition(async () => {
      const result = editing ? await updateSoalKompetensi(formData) : await createSoalKompetensi(formData);
      if (!result.success) {
        setError(result.message);
        return;
      }
      onOpenChange(false);
      onSaved();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Soal Kompetensi" : "Tambah Soal Kompetensi"}</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label>Jurusan (opsional)</Label>
              <Select value={idJurusan} onValueChange={(v) => setIdJurusan(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Semua jurusan">
                    {(v: unknown) => jurusanOptions.find((j) => j.value === v)?.label ?? "Semua jurusan"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {jurusanOptions.map((j) => (
                    <SelectItem key={j.value} value={j.value} label={j.label}>
                      {j.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tipe Soal</Label>
              <Select value={tipeSoal} onValueChange={(v) => setTipeSoal((v as "pg" | "essay") ?? "pg")}>
                <SelectTrigger className="w-full">
                  <SelectValue>{tipeSoal === "pg" ? "Pilihan Ganda" : "Essay"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pg" label="Pilihan Ganda">Pilihan Ganda</SelectItem>
                  <SelectItem value="essay" label="Essay">Essay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tingkat Kesulitan</Label>
              <Select value={tingkatKesulitan} onValueChange={(v) => setTingkatKesulitan(v ?? "sedang")}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {KESULITAN_OPTIONS.find((k) => k.value === tingkatKesulitan)?.label ?? "Sedang"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {KESULITAN_OPTIONS.map((k) => (
                    <SelectItem key={k.value} value={k.value} label={k.label}>
                      {k.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Pertanyaan</Label>
            <Textarea value={pertanyaan} onChange={(e) => setPertanyaan(e.target.value)} rows={3} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Gambar Soal (opsional)</Label>
              <ImageUploader value={gambarUrl} onChange={setGambarUrl} pathPrefix="soal-kompetensi" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Lampiran File (opsional)</Label>
              <FileUploader value={fileUrl} onChange={setFileUrl} pathPrefix="soal-kompetensi-file" />
            </div>
          </div>

          {tipeSoal === "pg" ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label>Opsi Jawaban</Label>
                <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={addOpsi} disabled={opsi.length >= LABELS.length}>
                  <Plus className="size-3.5" />
                  Tambah Opsi
                </Button>
              </div>

              {opsi.map((o, index) => (
                <div key={index} className="flex flex-col gap-2 rounded-lg border p-3">
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => setBenar(index)}
                      className={`mt-1.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                        o.is_benar ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                      title="Tandai sebagai jawaban benar"
                    >
                      {o.label}
                    </button>
                    <Textarea
                      value={o.isi_opsi}
                      onChange={(e) => updateOpsi(index, { isi_opsi: e.target.value })}
                      placeholder={`Isi opsi ${o.label}`}
                      rows={1}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0 text-destructive hover:bg-destructive/10"
                      onClick={() => removeOpsi(index)}
                      disabled={opsi.length <= 2}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                  <div className="ml-8">
                    <ImageUploader
                      value={o.gambar_url}
                      onChange={(url) => updateOpsi(index, { gambar_url: url })}
                      pathPrefix="opsi-kompetensi"
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Klik label (A/B/C...) untuk menandai jawaban benar.</p>
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label>Pembahasan (opsional)</Label>
            <Textarea value={pembahasan} onChange={(e) => setPembahasan(e.target.value)} rows={2} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
