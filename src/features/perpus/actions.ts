"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

export type BukuPayload = {
  judul: string;
  pengarang?: string;
  penerbit?: string;
  tahun_terbit?: number | null;
  isbn?: string;
  kategori?: string;
  lokasi_lemari?: string;
  stok: number;
};

export async function createBuku(payload: BukuPayload) {
  await requireRole(["perpus", "admin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("buku").insert({
    ...payload,
    pengarang: payload.pengarang || null,
    penerbit: payload.penerbit || null,
    tahun_terbit: payload.tahun_terbit || null,
    isbn: payload.isbn || null,
    kategori: payload.kategori || null,
    lokasi_lemari: payload.lokasi_lemari || null,
  });
  if (error) return { success: false, message: error.message };
  revalidatePath("/perpus/buku");
  return { success: true };
}

export async function updateBuku(id: string, payload: BukuPayload) {
  await requireRole(["perpus", "admin"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("buku")
    .update({
      ...payload,
      pengarang: payload.pengarang || null,
      penerbit: payload.penerbit || null,
      tahun_terbit: payload.tahun_terbit || null,
      isbn: payload.isbn || null,
      kategori: payload.kategori || null,
      lokasi_lemari: payload.lokasi_lemari || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id_buku", id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/perpus/buku");
  return { success: true };
}

export async function deleteBuku(id: string) {
  await requireRole(["perpus", "admin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("buku").delete().eq("id_buku", id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/perpus/buku");
  return { success: true };
}

export type PeminjamanPayload = {
  id_buku: string;
  id_siswa: string;
  tanggal_pinjam: string;
  tanggal_kembali_rencana: string;
  catatan?: string;
};

export async function createPeminjaman(payload: PeminjamanPayload) {
  await requireRole(["perpus", "admin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("peminjaman_buku").insert({
    ...payload,
    catatan: payload.catatan || null,
    status: "dipinjam",
  });
  if (error) return { success: false, message: error.message };
  revalidatePath("/perpus/peminjaman");
  return { success: true };
}

export async function kembalikanBuku(id: string) {
  await requireRole(["perpus", "admin"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("peminjaman_buku")
    .update({ status: "dikembalikan", tanggal_kembali_aktual: new Date().toISOString().split("T")[0] })
    .eq("id_peminjaman", id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/perpus/peminjaman");
  return { success: true };
}

export async function deletePeminjaman(id: string) {
  await requireRole(["perpus", "admin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("peminjaman_buku").delete().eq("id_peminjaman", id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/perpus/peminjaman");
  return { success: true };
}
