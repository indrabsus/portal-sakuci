"use client";

import { useState, useTransition } from "react";
import * as XLSX from "xlsx";
import { CheckCircle2, XCircle, Loader2, Download, Upload, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { importSiswaBulk, type HasilImportSiswa, type ImportSiswaRow } from "./actions";

const TEMPLATE_HEADER = [
  "Nama Lengkap",
  "NISN",
  "Tanggal Lahir (YYYY-MM-DD)",
  "Tempat Lahir",
  "Jenis Kelamin (L/P)",
  "Agama",
  "No HP",
  "Aktif (Ya/Tidak)",
];

const TEMPLATE_CONTOH = [
  "Contoh Nama Siswa",
  "1234567890",
  "2010-05-17",
  "Cimahi",
  "L",
  "Islam",
  "081234567890",
  "Ya",
];

function downloadTemplate() {
  const sheet = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADER, TEMPLATE_CONTOH]);
  sheet["!cols"] = TEMPLATE_HEADER.map(() => ({ wch: 22 }));
  // Format kolom NISN sebagai teks supaya angka nol di depan tidak hilang saat diedit di Excel.
  if (sheet["B2"]) sheet["B2"].z = "@";
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Template Siswa");
  XLSX.writeFile(wb, "template-import-siswa.xlsx");
}

type ParsedRow = ImportSiswaRow | { baris: number; error: string };

function isValidRow(row: ParsedRow): row is ImportSiswaRow {
  return !("error" in row);
}

function parseAktif(value: unknown): boolean {
  const v = String(value ?? "").trim().toLowerCase();
  if (!v) return true;
  return ["ya", "aktif", "true", "1"].includes(v);
}

function parseJenkel(value: unknown): string | null {
  const v = String(value ?? "").trim().toUpperCase();
  return v === "L" || v === "P" ? v : null;
}

function parseTanggalLahir(value: unknown): string | null {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const s = String(value ?? "").trim();
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const parsed = new Date(s);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

function parseWorkbook(buffer: ArrayBuffer): ParsedRow[] {
  const wb = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });

  const rows: ParsedRow[] = [];
  aoa.slice(1).forEach((cells, idx) => {
    const baris = idx + 2;
    const [nama, nisn, tglLahir, tempatLahir, jenkel, agama, noHp, aktif] = cells;
    const namaLengkap = String(nama ?? "").trim();
    const nisnValue = String(nisn ?? "").trim();

    if (!namaLengkap && !nisnValue) return;

    const tanggalLahir = parseTanggalLahir(tglLahir);

    if (!namaLengkap || !nisnValue || !tanggalLahir) {
      rows.push({
        baris,
        error: !namaLengkap
          ? "Nama Lengkap wajib diisi"
          : !nisnValue
            ? "NISN wajib diisi"
            : "Tanggal Lahir tidak valid (gunakan format YYYY-MM-DD)",
      });
      return;
    }

    rows.push({
      baris,
      nama_lengkap: namaLengkap,
      nisn: nisnValue,
      tanggal_lahir: tanggalLahir,
      tempat_lahir: String(tempatLahir ?? "").trim() || null,
      jenkel: parseJenkel(jenkel),
      agama: String(agama ?? "").trim() || null,
      no_hp: String(noHp ?? "").trim() || null,
      aktif: parseAktif(aktif),
    });
  });

  return rows;
}

export function ImportExcelDialog({ onSelesai }: { onSelesai: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" variant="outline" className="gap-2" onClick={() => setOpen(true)}>
        <FileSpreadsheet className="size-4" />
        Import Excel
      </Button>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Data Siswa dari Excel</DialogTitle>
          <DialogDescription>
            Unduh template, isi datanya, lalu unggah kembali file yang sudah diisi.
          </DialogDescription>
        </DialogHeader>

        {open && <ImportExcelForm onClose={() => setOpen(false)} onSelesai={onSelesai} />}
      </DialogContent>
    </Dialog>
  );
}

function ImportExcelForm({ onClose, onSelesai }: { onClose: () => void; onSelesai: () => void }) {
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [hasil, setHasil] = useState<HasilImportSiswa[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const validRows = parsedRows.filter(isValidRow);
  const invalidRows = parsedRows.filter((r) => !isValidRow(r)) as { baris: number; error: string }[];

  async function handleFile(file: File) {
    setFileName(file.name);
    setHasil(null);
    const buffer = await file.arrayBuffer();
    setParsedRows(parseWorkbook(buffer));
  }

  function handleImport() {
    startTransition(async () => {
      const res = await importSiswaBulk(validRows);
      setHasil(res);
      if (res.some((h) => h.status === "berhasil")) {
        onSelesai();
      }
    });
  }

  if (hasil) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1.5 font-medium text-green-600 dark:text-green-400">
            <CheckCircle2 size={15} /> {hasil.filter((h) => h.status === "berhasil").length} berhasil
          </span>
          {hasil.some((h) => h.status === "gagal") && (
            <span className="flex items-center gap-1.5 font-medium text-red-500">
              <XCircle size={15} /> {hasil.filter((h) => h.status === "gagal").length} gagal
            </span>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted/50">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Baris</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Nama</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {hasil.map((h) => (
                <tr key={h.baris} className="hover:bg-muted/30">
                  <td className="px-4 py-2.5">{h.baris}</td>
                  <td className="px-4 py-2.5">{h.nama_lengkap}</td>
                  <td className="px-4 py-2.5">
                    {h.status === "berhasil" ? (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle2 size={13} /> Berhasil
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500" title={h.pesan}>
                        <XCircle size={13} /> {h.pesan}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Button type="button" variant="outline" className="w-fit gap-2" onClick={downloadTemplate}>
        <Download className="size-4" />
        Download Template
      </Button>

      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground hover:bg-muted/30">
        <Upload className="size-5" />
        {fileName ?? "Klik untuk memilih file .xlsx yang sudah diisi"}
        <input
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>

      {parsedRows.length > 0 && (
        <>
          <div className="flex gap-4 text-sm">
            <span className="font-medium text-foreground">{validRows.length} baris siap diimport</span>
            {invalidRows.length > 0 && (
              <span className="font-medium text-red-500">{invalidRows.length} baris bermasalah</span>
            )}
          </div>

          {invalidRows.length > 0 && (
            <div className="max-h-40 overflow-y-auto rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
              {invalidRows.map((r) => (
                <p key={r.baris} className="text-destructive">
                  Baris {r.baris}: {r.error}
                </p>
              ))}
            </div>
          )}

          <div className="max-h-64 overflow-y-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Nama</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">NISN</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Tgl Lahir</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {validRows.map((r) => (
                  <tr key={r.baris} className="hover:bg-muted/30">
                    <td className="px-4 py-2.5">{r.nama_lengkap}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{r.nisn}</td>
                    <td className="px-4 py-2.5">{r.tanggal_lahir}</td>
                    <td className="px-4 py-2.5">{r.aktif ? "Aktif" : "Nonaktif"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button onClick={handleImport} disabled={isPending || validRows.length === 0} className="gap-2">
          {isPending ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Mengimport {validRows.length} siswa...
            </>
          ) : (
            <>
              <Upload size={15} /> Import {validRows.length > 0 ? `(${validRows.length})` : ""} Siswa
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}
