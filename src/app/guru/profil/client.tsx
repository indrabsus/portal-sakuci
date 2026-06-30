"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Hash, Phone, VenusAndMars, Mail, Sparkles, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InitialsAvatar } from "@/components/initials-avatar";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/compress-image";
import { updateFotoGuru } from "./actions";

type Mengajar = { id_mengajar: string; mapel: string; kelas: string };

export function ProfilGuruClient({
  idGuru,
  namaLengkap,
  email,
  fotoUrl,
  uidFp,
  noHp,
  jenkel,
  daftarMengajar,
}: {
  idGuru: string;
  namaLengkap: string;
  email: string | null;
  fotoUrl: string | null;
  uidFp: string | null;
  noHp: string | null;
  jenkel: string | null;
  daftarMengajar: Mengajar[];
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
      const path = `${idGuru}/${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage.from("guru-foto").upload(path, compressed, {
        upsert: true,
        contentType: "image/jpeg",
      });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from("guru-foto").getPublicUrl(path);
      setPreview(data.publicUrl);

      const formData = new FormData();
      formData.set("foto_url", data.publicUrl);
      startTransition(async () => {
        const result = await updateFotoGuru(formData);
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

  const dataPribadi = [
    { label: "UID FP", value: uidFp, icon: Hash },
    { label: "No. HP", value: noHp, icon: Phone },
    { label: "Jenis Kelamin", value: jenkel === "L" ? "Laki-laki" : jenkel === "P" ? "Perempuan" : null, icon: VenusAndMars },
    { label: "Email", value: email, icon: Mail },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-sm text-muted-foreground">Informasi akun dan data diri Anda</p>
      </div>

      <Card className="overflow-hidden shadow-sm">
        <div className="relative h-28 bg-gradient-to-br from-primary via-primary/80 to-accent sm:h-32">
          <svg className="absolute inset-0 h-full w-full text-white opacity-[0.12]" aria-hidden>
            <defs>
              <pattern id="profil-guru-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M28 0 H0 V28" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#profil-guru-grid)" />
          </svg>
          <div className="absolute -right-6 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
          <Badge className="absolute right-4 top-4 gap-1 bg-white/15 text-white backdrop-blur-sm hover:bg-white/15">
            <Sparkles className="size-3" /> Guru
          </Badge>
        </div>

        <CardContent className="relative flex flex-col items-center gap-3 px-6 pb-6 pt-0 text-center">
          <div className="relative -mt-14">
            <InitialsAvatar name={namaLengkap} fotoUrl={preview} className="size-28 border-4 border-card text-3xl shadow-md" />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/80 disabled:opacity-50"
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
            <p className="text-lg font-bold tracking-tight">{namaLengkap}</p>
            <p className="text-sm text-muted-foreground">{email ?? "-"}</p>
          </div>

          <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={busy} className="mt-1">
            {busy ? "Mengunggah..." : "Ganti Foto Profil"}
          </Button>
          <p className="text-xs text-muted-foreground">Foto akan dikompres otomatis maksimal 500x500px.</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Informasi Pribadi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {dataPribadi.map((d) => (
            <div key={d.label} className="flex items-start gap-3 rounded-xl border bg-muted/30 p-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <d.icon className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{d.label}</p>
                <p className="text-sm font-medium">{d.value || "-"}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Mengajar</CardTitle>
        </CardHeader>
        <CardContent>
          {daftarMengajar.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada pembagian mengajar.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {daftarMengajar.map((m) => (
                <div key={m.id_mengajar} className="flex items-start gap-3 rounded-xl border bg-muted/30 p-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <School className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-snug">{m.mapel}</p>
                    <p className="text-xs text-muted-foreground">{m.kelas}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
