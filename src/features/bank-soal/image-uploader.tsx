"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function ImageUploader({
  value,
  onChange,
  pathPrefix,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  pathPrefix: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5MB.");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${pathPrefix}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("bank-soal").upload(path, file);
    setUploading(false);

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("bank-soal").getPublicUrl(path);
    onChange(data.publicUrl);
  }

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative inline-block w-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Pratinjau" className="max-h-32 rounded-lg border object-contain" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm"
            aria-label="Hapus gambar"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit gap-1.5"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
          {uploading ? "Mengunggah..." : "Unggah Gambar"}
        </Button>
      )}
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
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
