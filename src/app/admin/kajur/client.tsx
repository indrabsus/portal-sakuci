"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateJurusanKajur, updateNipKajur } from "./actions";

type KajurRow = {
  id_profile: string;
  nama_lengkap: string | null;
  email: string | null;
  id_jurusan: string | null;
  nip_nuptk: string | null;
};

export function KajurJurusanClient({
  rows,
  jurusanOptions,
}: {
  rows: KajurRow[];
  jurusanOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(rows.map((r) => [r.id_profile, r.id_jurusan ?? ""])),
  );
  const [nipValues, setNipValues] = useState<Record<string, string>>(
    Object.fromEntries(rows.map((r) => [r.id_profile, r.nip_nuptk ?? ""])),
  );

  function handleChange(idProfile: string, idJurusan: string) {
    setValues((prev) => ({ ...prev, [idProfile]: idJurusan }));
    const formData = new FormData();
    formData.set("id_profile", idProfile);
    formData.set("id_jurusan", idJurusan);
    startTransition(async () => {
      await updateJurusanKajur(formData);
      router.refresh();
    });
  }

  function handleNipBlur(idProfile: string, original: string | null) {
    const nip = nipValues[idProfile] ?? "";
    if (nip === (original ?? "")) return;
    const formData = new FormData();
    formData.set("id_profile", idProfile);
    formData.set("nip_nuptk", nip);
    startTransition(async () => {
      await updateNipKajur(formData);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kajur & Jurusan</h1>
        <p className="text-sm text-muted-foreground">
          Atur jurusan yang dikelola tiap akun Kajur. Kajur hanya bisa mengurus kompetensi, sertifikat, dan siswa di jurusannya sendiri.
        </p>
      </div>

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Nama Kajur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Jurusan</TableHead>
                <TableHead>NIP/NUPTK (untuk sertifikat)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Belum ada akun Kajur</TableCell>
                </TableRow>
              )}
              {rows.map((row) => (
                <TableRow key={row.id_profile} className="hover:bg-accent/40">
                  <TableCell>{row.nama_lengkap ?? "-"}</TableCell>
                  <TableCell>{row.email ?? "-"}</TableCell>
                  <TableCell>
                    <Select
                      value={values[row.id_profile] ?? ""}
                      onValueChange={(v) => handleChange(row.id_profile, v ?? "")}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-56">
                        <SelectValue placeholder="Belum diatur">
                          {(v: unknown) =>
                            v ? jurusanOptions.find((j) => j.value === v)?.label ?? "Belum diatur" : (
                              <Badge variant="secondary">Belum diatur</Badge>
                            )
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {jurusanOptions.map((j) => (
                          <SelectItem key={j.value} value={j.value} label={j.label}>{j.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      className="w-40"
                      value={nipValues[row.id_profile] ?? ""}
                      onChange={(e) => setNipValues((prev) => ({ ...prev, [row.id_profile]: e.target.value }))}
                      onBlur={() => handleNipBlur(row.id_profile, row.nip_nuptk)}
                      disabled={isPending}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
