"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InitialsAvatar } from "@/components/initials-avatar";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/compress-image";
import { updateFotoSiswa } from "./actions";

export function ProfilClient({
  idSiswa,
  namaLengkap,
  fotoUrl,
  nisn,
  kelasNama,
  jurusanNama,
}: {
  idSiswa: string;
  namaLengkap: string;
  fotoUrl: string | null;
  nisn: string | null;
  kelasNama: string | null;
  jurusanNama: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(fotoUrl);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }

    setUploading(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 500, maxHeight: 500, quality: 0.8 });

      const supabase = createClient();
      const path = `${idSiswa}/${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage.from("siswa-foto").upload(path, compressed, {
        upsert: true,
        contentType: "image/jpeg",
      });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from("siswa-foto").getPublicUrl(path);
      setPreview(data.publicUrl);

      const formData = new FormData();
      formData.set("foto_url", data.publicUrl);
      startTransition(async () => {
        const result = await updateFotoSiswa(formData);
        if (!result.success) {
          setError(result.message);
        } else {
          router.refresh();
        }
      });
    } finally {
      setUploading(false);
    }
  }

  const busy = uploading || isPending;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-sm text-muted-foreground">Kelola foto profil Anda</p>
      </div>

      <Card className="max-w-md shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <div className="relative">
            <InitialsAvatar name={namaLengkap} fotoUrl={preview} className="size-28 text-3xl" />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm hover:bg-primary/80 disabled:opacity-50"
              aria-label="Ganti foto"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div>
            <p className="font-semibold">{namaLengkap}</p>
            <p className="text-sm text-muted-foreground">
              NISN: {nisn ?? "-"} &middot; {kelasNama ?? "-"} {jurusanNama ?? ""}
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? "Mengunggah..." : "Ganti Foto Profil"}
          </Button>
          <p className="text-xs text-muted-foreground">Foto akan dikompres otomatis maksimal 500x500px.</p>
        </CardContent>
      </Card>
    </div>
  );
}
