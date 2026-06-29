"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { restoreAction } from "./actions";

export default function BackupPage() {
  const [isPending, startTransition] = useTransition();
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleRestore(formData: FormData) {
    if (!confirmed) {
      setMessage({ type: "error", text: "Centang konfirmasi terlebih dahulu sebelum restore." });
      return;
    }
    setMessage(null);
    startTransition(async () => {
      const result = await restoreAction(formData);
      setMessage({ type: result.success ? "success" : "error", text: result.message });
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Backup & Restore</h1>
        <p className="text-muted-foreground">Cadangkan atau pulihkan data sekolah</p>
      </div>

      <Card className="max-w-lg p-6">
        <h2 className="font-medium">Backup</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Mengunduh seluruh data akademik (jurusan, kelas, siswa, guru, nilai, sertifikat, dst.) dalam satu file JSON.
        </p>
        <a
          href="/api/admin/backup"
          download
          className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Download Backup
        </a>
      </Card>

      <Card className="max-w-lg p-6">
        <h2 className="font-medium">Restore</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Memulihkan data dari file backup JSON. Data akan <strong>digabung (upsert)</strong> dengan data yang
          sudah ada berdasarkan ID — data baru yang dibuat setelah backup diambil tidak akan terhapus.
        </p>

        {message && (
          <p
            className={`mb-4 rounded-md px-3 py-2 text-sm ${
              message.type === "success" ? "bg-green-500/10 text-green-700" : "bg-destructive/10 text-destructive"
            }`}
          >
            {message.text}
          </p>
        )}

        <form action={handleRestore} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="file">File Backup (.json)</Label>
            <Input id="file" name="file" type="file" accept="application/json" required />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="h-4 w-4"
            />
            Saya paham proses ini akan mengubah data yang ada di database.
          </label>
          <Button type="submit" disabled={isPending || !confirmed} variant="destructive">
            {isPending ? "Memproses..." : "Restore Data"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
