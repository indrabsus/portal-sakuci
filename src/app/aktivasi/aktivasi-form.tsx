"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { aktivasiGuruAction, aktivasiSiswaAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AktivasiForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleGuruSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await aktivasiGuruAction(formData);
      setMessage({ type: result.success ? "success" : "error", text: result.message });
      if (result.success) setTimeout(() => router.push("/login"), 1500);
    });
  }

  function handleSiswaSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await aktivasiSiswaAction(formData);
      setMessage({ type: result.success ? "success" : "error", text: result.message });
      if (result.success) setTimeout(() => router.push("/login"), 1500);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {message && (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            message.type === "success"
              ? "bg-green-500/10 text-green-700"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </p>
      )}

      <Tabs defaultValue="siswa">
        <TabsList className="w-full">
          <TabsTrigger value="siswa" className="flex-1">Siswa</TabsTrigger>
          <TabsTrigger value="guru" className="flex-1">Guru</TabsTrigger>
        </TabsList>

        <TabsContent value="siswa">
          <form action={handleSiswaSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nisn">NISN</Label>
              <Input id="nisn" name="nisn" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
              <Input id="tanggal_lahir" name="tanggal_lahir" type="date" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email_siswa">Email (untuk login)</Label>
              <Input id="email_siswa" name="email" type="email" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password_siswa">Password</Label>
              <Input id="password_siswa" name="password" type="password" minLength={6} required />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Memproses..." : "Aktivasi Akun Siswa"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="guru">
          <form action={handleGuruSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="uid_fp">UID FP</Label>
              <Input id="uid_fp" name="uid_fp" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="no_hp_guru">No HP</Label>
              <Input id="no_hp_guru" name="no_hp" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email_guru">Email (untuk login)</Label>
              <Input id="email_guru" name="email" type="email" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password_guru">Password</Label>
              <Input id="password_guru" name="password" type="password" minLength={6} required />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Memproses..." : "Aktivasi Akun Guru"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <a href="/login" className="text-center text-sm text-muted-foreground hover:underline">
        Sudah punya akun? Masuk
      </a>
    </div>
  );
}
