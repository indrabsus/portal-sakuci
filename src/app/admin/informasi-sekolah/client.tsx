"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { updateInformasiSekolah } from "./actions";

type Sekolah = {
  id_sekolah: string;
  nama_sekolah: string;
  alamat: string | null;
  email: string | null;
  instagram: string | null;
  no_telepon: string | null;
  nama_kepala_sekolah: string | null;
  visi: string | null;
  misi: string | null;
};

export function InformasiSekolahClient({ data }: { data: Sekolah | null }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleSubmit(formData: FormData) {
    setMessage(null);
    if (data) formData.set("id_sekolah", data.id_sekolah);
    startTransition(async () => {
      const result = await updateInformasiSekolah(formData);
      setMessage({ type: result.success ? "success" : "error", text: result.message });
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Informasi Sekolah</h1>
        <p className="text-sm text-muted-foreground">Digunakan untuk kop sertifikat dan halaman publik</p>
      </div>

      {message && (
        <p className={`max-w-lg rounded-md px-3 py-2 text-sm ${message.type === "success" ? "bg-green-500/10 text-green-700" : "bg-destructive/10 text-destructive"}`}>
          {message.text}
        </p>
      )}

      <Card className="max-w-lg p-6 shadow-sm">
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nama_sekolah">Nama Sekolah</Label>
            <Input id="nama_sekolah" name="nama_sekolah" defaultValue={data?.nama_sekolah ?? ""} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="alamat">Alamat</Label>
            <Input id="alamat" name="alamat" defaultValue={data?.alamat ?? ""} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={data?.email ?? ""} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" name="instagram" placeholder="@namasekolah" defaultValue={data?.instagram ?? ""} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="no_telepon">No. Telepon</Label>
            <Input id="no_telepon" name="no_telepon" defaultValue={data?.no_telepon ?? ""} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="nama_kepala_sekolah">Nama Kepala Sekolah</Label>
            <Input id="nama_kepala_sekolah" name="nama_kepala_sekolah" defaultValue={data?.nama_kepala_sekolah ?? ""} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="visi">Visi (untuk halaman publik)</Label>
            <Textarea id="visi" name="visi" rows={2} defaultValue={data?.visi ?? ""} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="misi">Misi (untuk halaman publik, satu poin per baris)</Label>
            <Textarea id="misi" name="misi" rows={4} defaultValue={data?.misi ?? ""} />
          </div>
          <Button type="submit" disabled={isPending} className="mt-2 w-fit">
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
