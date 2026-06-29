import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { BACKUP_TABLES } from "@/lib/backup-tables";

export async function GET() {
  await requireRole(["admin"]);
  const admin = createAdminClient();

  const result: Record<string, unknown[]> = {};
  for (const { table } of BACKUP_TABLES) {
    const { data, error } = await admin.from(table).select("*");
    if (error) {
      return NextResponse.json({ error: `Gagal membaca tabel ${table}: ${error.message}` }, { status: 500 });
    }
    result[table] = data ?? [];
  }

  const payload = JSON.stringify({ generated_at: new Date().toISOString(), data: result }, null, 2);
  const filename = `backup-portal-sakuci-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(payload, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
