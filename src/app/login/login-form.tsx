"use client";

import { useState, useTransition } from "react";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TahunAjaran = {
  id_tahun_ajaran: string;
  nama_tahun_ajaran: string;
  semester: string;
  aktif: boolean;
};

function labelFor(ta: TahunAjaran) {
  return `${ta.nama_tahun_ajaran} - ${ta.semester === "ganjil" ? "Ganjil" : "Genap"}${ta.aktif ? " (aktif)" : ""}`;
}

const ERROR_MESSAGE: Record<string, string> = {
  field_kosong: "Semua field wajib diisi.",
  login_gagal: "Email atau password salah.",
  akun_tidak_aktif: "Akun Anda belum aktif. Hubungi admin.",
};

export function LoginForm({
  tahunAjaranList,
  error,
}: {
  tahunAjaranList: TahunAjaran[];
  error?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [idTahunAjaran, setIdTahunAjaran] = useState(
    tahunAjaranList.find((t) => t.aktif)?.id_tahun_ajaran ?? "",
  );

  return (
    <form
      action={(formData) => startTransition(() => loginAction(formData))}
      className="flex flex-col gap-4"
    >
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {ERROR_MESSAGE[error] ?? "Terjadi kesalahan."}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="username" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="id_tahun_ajaran">Tahun Ajaran</Label>
        <Select value={idTahunAjaran} onValueChange={(value) => setIdTahunAjaran(value ?? "")}>
          <SelectTrigger id="id_tahun_ajaran" className="w-full">
            <SelectValue placeholder="Pilih tahun ajaran">
              {(value: unknown) =>
                tahunAjaranList.find((ta) => ta.id_tahun_ajaran === value)?.nama_tahun_ajaran
                  ? labelFor(tahunAjaranList.find((ta) => ta.id_tahun_ajaran === value)!)
                  : "Pilih tahun ajaran"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {tahunAjaranList.map((ta) => {
              const label = labelFor(ta);
              return (
                <SelectItem key={ta.id_tahun_ajaran} value={ta.id_tahun_ajaran} label={label}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <input type="hidden" name="id_tahun_ajaran" value={idTahunAjaran} required />
      </div>

      <Button type="submit" disabled={isPending} className="mt-2">
        {isPending ? "Memproses..." : "Masuk"}
      </Button>

      <a href="/aktivasi" className="text-center text-sm text-muted-foreground hover:underline">
        Belum punya akun? Aktivasi di sini
      </a>
    </form>
  );
}
