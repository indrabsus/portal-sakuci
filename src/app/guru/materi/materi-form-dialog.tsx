"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MateriFileUploader } from "@/features/materi-uploader";
import { createMateri, updateMateri } from "./actions";

export type MateriRow = {
  id_materi: string;
  id_mengajar: string;
  judul: string;
  isi: string | null;
  file_url: string | null;
};

export function MateriFormDialog({
  open,
  onOpenChange,
  editing,
  mengajarOptions,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: MateriRow | null;
  mengajarOptions: { value: string; label: string }[];
  onSaved: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [idMengajar, setIdMengajar] = useState("");
  const [judul, setJudul] = useState("");
  const [tipe, setTipe] = useState<"teks" | "yt" | "file">("teks");
  const [isi, setIsi] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);

    if (editing) {
      setIdMengajar(editing.id_mengajar);
      setJudul(editing.judul);
      if (editing.file_url) {
        setTipe("file");
        setFileUrl(editing.file_url);
        setIsi("");
      } else if (editing.isi?.includes("youtube.com") || editing.isi?.includes("youtu.be")) {
        setTipe("yt");
        setIsi(editing.isi ?? "");
        setFileUrl(null);
      } else {
        setTipe("teks");
        setIsi(editing.isi ?? "");
        setFileUrl(null);
      }
    } else {
      setIdMengajar(mengajarOptions[0]?.value ?? "");
      setJudul("");
      setTipe("teks");
      setIsi("");
      setFileUrl(null);
    }
  }, [open, editing, mengajarOptions]);

  function handleSubmit() {
    setError(null);
    if (!idMengajar || !judul.trim()) {
      setError("Kelas/mapel dan judul wajib diisi.");
      return;
    }
    if (tipe === "file" && !fileUrl) {
      setError("Unggah file terlebih dahulu.");
      return;
    }
    if (tipe !== "file" && !isi.trim()) {
      setError("Isi materi wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.set("id_mengajar", idMengajar);
    formData.set("judul", judul);
    formData.set("isi", tipe === "file" ? "" : isi);
    formData.set("file_url", tipe === "file" ? fileUrl ?? "" : "");
    if (editing) formData.set("id_materi", editing.id_materi);

    startTransition(async () => {
      const result = editing ? await updateMateri(formData) : await createMateri(formData);
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Materi" : "Bagikan Materi"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

          <div className="flex flex-col gap-2">
            <Label>Kelas / Mapel</Label>
            <Select value={idMengajar} onValueChange={(v) => setIdMengajar(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kelas/mapel">
                  {(v: unknown) => mengajarOptions.find((m) => m.value === v)?.label ?? "Pilih kelas/mapel"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {mengajarOptions.map((m) => (
                  <SelectItem key={m.value} value={m.value} label={m.label}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Judul</Label>
            <Input value={judul} onChange={(e) => setJudul(e.target.value)} />
          </div>

          <Tabs value={tipe} onValueChange={(v) => setTipe((v as typeof tipe) ?? "teks")}>
            <TabsList className="w-full">
              <TabsTrigger value="teks" className="flex-1">Teks</TabsTrigger>
              <TabsTrigger value="yt" className="flex-1">Link YouTube</TabsTrigger>
              <TabsTrigger value="file" className="flex-1">File</TabsTrigger>
            </TabsList>
            <TabsContent value="teks" className="pt-2">
              <Textarea value={isi} onChange={(e) => setIsi(e.target.value)} rows={5} placeholder="Tulis materi di sini..." />
            </TabsContent>
            <TabsContent value="yt" className="pt-2">
              <Input value={isi} onChange={(e) => setIsi(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
            </TabsContent>
            <TabsContent value="file" className="pt-2">
              <MateriFileUploader value={fileUrl} onChange={setFileUrl} />
            </TabsContent>
          </Tabs>
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
