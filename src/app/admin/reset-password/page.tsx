"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { searchUserByEmail, resetPasswordAction } from "./actions";

type FoundUser = {
  found: true;
  id_profile: string;
  nama_lengkap: string | null;
  email: string | null;
  role: string;
};

export default function ResetPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [user, setUser] = useState<FoundUser | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleSearch(formData: FormData) {
    setMessage(null);
    setUser(null);
    startTransition(async () => {
      const result = await searchUserByEmail(formData);
      if (!result.found) {
        setMessage({ type: "error", text: "User dengan email tersebut tidak ditemukan." });
        return;
      }
      setUser(result);
    });
  }

  function handleReset(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await resetPasswordAction(formData);
      setMessage({ type: result.success ? "success" : "error", text: result.message });
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Reset Password</h1>
        <p className="text-muted-foreground">Cari user berdasarkan email, lalu atur password baru</p>
      </div>

      <Card className="max-w-md p-6">
        <form action={handleSearch} className="flex gap-2">
          <Input name="email" type="email" placeholder="Email user" required />
          <Button type="submit" disabled={isPending}>Cari</Button>
        </form>
      </Card>

      {message && (
        <p
          className={`max-w-md rounded-md px-3 py-2 text-sm ${
            message.type === "success" ? "bg-green-500/10 text-green-700" : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </p>
      )}

      {user && (
        <Card className="max-w-md p-6">
          <p className="font-medium">{user.nama_lengkap}</p>
          <p className="text-sm text-muted-foreground">{user.email} &middot; {user.role}</p>

          <form action={handleReset} className="mt-4 flex flex-col gap-3">
            <input type="hidden" name="id_profile" value={user.id_profile} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="new_password">Password Baru</Label>
              <Input id="new_password" name="new_password" type="password" minLength={6} required />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Memproses..." : "Reset Password"}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
