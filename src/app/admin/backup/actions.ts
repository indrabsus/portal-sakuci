"use server";

import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { BACKUP_TABLES } from "@/lib/backup-tables";

type ActionResult = { success: boolean; message: string };

export async function restoreAction(formData: FormData): Promise<ActionResult> {
  await requireRole(["admin"]);

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: "Pilih file backup (.json) terlebih dahulu." };
  }

  let parsed: { data?: Record<string, unknown[]> };
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    return { success: false, message: "File bukan JSON yang valid." };
  }

  const data = parsed.data;
  if (!data || typeof data !== "object") {
    return { success: false, message: "Format file backup tidak dikenali." };
  }

  const admin = createAdminClient();
  const summary: string[] = [];

  // Restore = upsert (gabung dengan data yang ada), bukan menimpa/menghapus seluruh tabel,
  // supaya proses ini tidak merusak data baru yang dibuat setelah backup diambil.
  for (const { table, pk } of BACKUP_TABLES) {
    const rows = data[table];
    if (!Array.isArray(rows) || rows.length === 0) continue;

    const { error } = await admin.from(table).upsert(rows, { onConflict: pk });
    if (error) {
      return { success: false, message: `Gagal restore tabel ${table}: ${error.message}. Tabel sebelumnya berhasil: ${summary.join(", ") || "-"}` };
    }
    summary.push(`${table} (${rows.length})`);
  }

  return { success: true, message: `Restore berhasil: ${summary.join(", ") || "tidak ada data untuk dipulihkan"}.` };
}
