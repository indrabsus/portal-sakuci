"use client";

import { useState, useTransition } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { changePassword } from "./actions";

export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await changePassword(formData);
      setMessage({ type: result.success ? "success" : "error", text: result.message });
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ganti Password</h1>
        <p className="text-sm text-muted-foreground">Perbarui password akun Anda secara berkala demi keamanan</p>
      </div>

      <Card className="max-w-md shadow-sm">
        <CardHeader>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <KeyRound className="size-4.5" />
          </div>
          <CardTitle className="text-base">Perbarui Password</CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <p
              className={`mb-4 rounded-md px-3 py-2 text-sm ${
                message.type === "success" ? "bg-green-500/10 text-green-700" : "bg-destructive/10 text-destructive"
              }`}
            >
              {message.text}
            </p>
          )}

          <form action={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password_lama">Password Saat Ini</Label>
              <Input id="password_lama" name="password_lama" type="password" required autoComplete="current-password" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password_baru">Password Baru</Label>
              <Input id="password_baru" name="password_baru" type="password" minLength={6} required autoComplete="new-password" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="konfirmasi_password">Konfirmasi Password Baru</Label>
              <Input id="konfirmasi_password" name="konfirmasi_password" type="password" minLength={6} required autoComplete="new-password" />
            </div>
            <Button type="submit" disabled={isPending} className="mt-1 w-fit">
              {isPending ? "Menyimpan..." : "Simpan Password Baru"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
