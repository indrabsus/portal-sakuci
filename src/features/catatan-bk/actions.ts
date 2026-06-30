"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

export type CatatanBkPayload = {
  id_siswa: string;
  tanggal: string;
  permasalahan: string;
  tindakan: string;
  kesepakatan?: string;
  catatan_tambahan?: string;
  nama_koordinator_bk?: string;
  nip_koordinator_bk?: string;
};

export async function createCatatanBk(payload: CatatanBkPayload) {
  await requireRole(["bk", "admin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("catatan_bk").insert({
    ...payload,
    kesepakatan: payload.kesepakatan || null,
    catatan_tambahan: payload.catatan_tambahan || null,
    nama_koordinator_bk: payload.nama_koordinator_bk || null,
    nip_koordinator_bk: payload.nip_koordinator_bk || null,
  });
  if (error) return { success: false, message: error.message };
  revalidatePath("/bk/catatan");
  return { success: true };
}

export async function updateCatatanBk(idCatatan: string, payload: CatatanBkPayload) {
  await requireRole(["bk", "admin"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("catatan_bk")
    .update({
      ...payload,
      kesepakatan: payload.kesepakatan || null,
      catatan_tambahan: payload.catatan_tambahan || null,
      nama_koordinator_bk: payload.nama_koordinator_bk || null,
      nip_koordinator_bk: payload.nip_koordinator_bk || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id_catatan", idCatatan);
  if (error) return { success: false, message: error.message };
  revalidatePath("/bk/catatan");
  return { success: true };
}

export async function deleteCatatanBk(idCatatan: string) {
  await requireRole(["bk", "admin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("catatan_bk").delete().eq("id_catatan", idCatatan);
  if (error) return { success: false, message: error.message };
  revalidatePath("/bk/catatan");
  return { success: true };
}
