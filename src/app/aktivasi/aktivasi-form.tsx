"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { aktivasiGuruAction, aktivasiSiswaAction, cekUsernameAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

/** Sanitasi: huruf kecil, hanya [a-z0-9_.], buang karakter lain */
function sanitizeUsername(val: string) {
  return val.toLowerCase().replace(/[^a-z0-9_.]/g, "");
}

type CheckStatus = "idle" | "checking" | "available" | "taken" | "invalid";

function UsernameInput({ id, name }: { id: string; name: string }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<CheckStatus>("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const check = async (username: string) => {
    if (!username || username.length < 3) {
      setStatus("idle");
      setStatusMsg("");
      return;
    }
    setStatus("checking");
    const result = await cekUsernameAction(username);
    setStatus(result.ok ? "available" : username.length < 3 ? "invalid" : "taken");
    setStatusMsg(result.message);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = sanitizeUsername(e.target.value);
    setValue(clean);
    setStatus("idle");
    setStatusMsg("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => check(clean), 600);
  };

  const handleBlur = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    check(value);
  };

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, []);

  const borderColor =
    status === "available" ? "border-green-500 focus-within:ring-green-500/40" :
    status === "taken" || status === "invalid" ? "border-red-500 focus-within:ring-red-500/40" :
    "focus-within:ring-ring";

  return (
    <div className="flex flex-col gap-1.5">
      <div className={`flex items-center rounded-md border bg-background overflow-hidden focus-within:ring-2 ${borderColor}`}>
        <input
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          minLength={3}
          maxLength={30}
          autoComplete="username"
          placeholder="contoh: budi.santoso"
          className="flex-1 min-w-0 px-3 py-2 text-sm bg-transparent outline-none"
        />
        <span className="px-3 py-2 text-xs text-muted-foreground bg-muted border-l select-none whitespace-nowrap">
          @sakuci.id
        </span>
      </div>

      {/* Status feedback */}
      {status === "checking" && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 size={12} className="animate-spin" />
          Memeriksa ketersediaan...
        </p>
      )}
      {status === "available" && (
        <p className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
          <CheckCircle2 size={12} />
          {statusMsg}
        </p>
      )}
      {(status === "taken" || status === "invalid") && (
        <p className="flex items-center gap-1.5 text-xs text-red-500">
          <XCircle size={12} />
          {statusMsg}
        </p>
      )}
      {status === "idle" && (
        <p className="text-xs text-muted-foreground">
          Huruf kecil, angka, titik, atau underscore. Min 3 karakter.
        </p>
      )}
    </div>
  );
}

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
              <Label htmlFor="username_siswa">Username (untuk login)</Label>
              <UsernameInput id="username_siswa" name="username" />
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
              <Label htmlFor="username_guru">Username (untuk login)</Label>
              <UsernameInput id="username_guru" name="username" />
              <p className="text-xs text-muted-foreground">
                Huruf kecil, angka, titik, atau underscore. Min 3 karakter.
              </p>
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
