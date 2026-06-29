"use client";

import { useRef, useState } from "react";
import { FileUp, X, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function MateriFileUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    if (file.size > 20 * 1024 * 1024) {
      setError("Ukuran file maksimal 20MB.");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const path = `materi/${crypto.randomUUID()}-${file.name}`;

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
        <div className="flex w-fit items-center gap-2 rounded-lg border px-3 py-1.5">
          <FileText className="size-4 text-muted-foreground" />
          <a href={value} target="_blank" rel="noopener noreferrer" className="max-w-60 truncate text-sm text-primary underline-offset-4 hover:underline">
            {decodeURIComponent(value.split("/").pop() ?? "file")}
          </a>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Hapus file"
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
          {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <FileUp className="size-3.5" />}
          {uploading ? "Mengunggah..." : "Unggah File"}
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
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
