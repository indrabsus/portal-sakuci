"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { balasKonselingAI } from "@/lib/ai-konseling";
import { tutupSesiDenganRingkasan, tutupSesiKedaluwarsaJikaPerlu, sapuSesiKedaluwarsa } from "@/features/konseling/auto-close";

type ActionResult = { success: boolean; message: string };

async function verifySesiOwnership(supabase: Awaited<ReturnType<typeof createClient>>, idSesi: string, idSiswa: string) {
  const { data } = await supabase.from("konseling_sesi").select("id_siswa").eq("id_sesi", idSesi).single();
  return data?.id_siswa === idSiswa;
}

export async function mulaiSesiKonseling(): Promise<ActionResult & { idSesi?: string }> {
  const profile = await requireRole(["siswa"]);
  if (!profile.id_siswa) return { success: false, message: "Akun siswa tidak ditemukan." };
  const supabase = await createClient();

  await sapuSesiKedaluwarsa(supabase, profile.id_siswa);

  const { data: sesiAktif } = await supabase
    .from("konseling_sesi")
    .select("id_sesi")
    .eq("id_siswa", profile.id_siswa)
    .eq("status", "aktif")
    .maybeSingle();

  if (sesiAktif) {
    return { success: true, message: "Melanjutkan sesi yang sedang berlangsung.", idSesi: sesiAktif.id_sesi };
  }

  const { data, error } = await supabase
    .from("konseling_sesi")
    .insert({ id_siswa: profile.id_siswa, status: "aktif" })
    .select("id_sesi")
    .single();

  if (error || !data) return { success: false, message: error?.message ?? "Gagal memulai sesi." };
  return { success: true, message: "Sesi dimulai.", idSesi: data.id_sesi };
}

export async function kirimPesanKonseling(formData: FormData): Promise<ActionResult & { balasan?: string; sesiBerakhir?: boolean }> {
  const profile = await requireRole(["siswa"]);
  if (!profile.id_siswa) return { success: false, message: "Akun siswa tidak ditemukan." };
  const supabase = await createClient();

  const idSesi = String(formData.get("id_sesi") ?? "");
  const isi = String(formData.get("isi") ?? "").trim();
  if (!idSesi || !isi) return { success: false, message: "Pesan tidak boleh kosong." };

  if (!(await verifySesiOwnership(supabase, idSesi, profile.id_siswa))) {
    return { success: false, message: "Sesi ini bukan milik Anda." };
  }

  if (await tutupSesiKedaluwarsaJikaPerlu(supabase, idSesi)) {
    revalidatePath("/siswa/konseling");
    return { success: false, message: "Sesi ini sudah otomatis berakhir karena tidak ada aktivitas selama 12 jam.", sesiBerakhir: true };
  }

  const { error: insertError } = await supabase
    .from("konseling_pesan")
    .insert({ id_sesi: idSesi, pengirim: "siswa", isi });
  if (insertError) return { success: false, message: insertError.message };

  const { data: riwayatRaw } = await supabase
    .from("konseling_pesan")
    .select("pengirim, isi")
    .eq("id_sesi", idSesi)
    .order("created_at", { ascending: true });

  const riwayat = (riwayatRaw ?? []) as { pengirim: "siswa" | "ai"; isi: string }[];

  try {
    const balasan = await balasKonselingAI(riwayat);
    const { error: aiInsertError } = await supabase
      .from("konseling_pesan")
      .insert({ id_sesi: idSesi, pengirim: "ai", isi: balasan });
    if (aiInsertError) return { success: false, message: aiInsertError.message };

    revalidatePath(`/siswa/konseling/${idSesi}`);
    return { success: true, message: "Terkirim.", balasan };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal menghubungi AI." };
  }
}

export async function akhiriSesiKonseling(formData: FormData): Promise<ActionResult> {
  const profile = await requireRole(["siswa"]);
  if (!profile.id_siswa) return { success: false, message: "Akun siswa tidak ditemukan." };
  const supabase = await createClient();

  const idSesi = String(formData.get("id_sesi") ?? "");
  if (!idSesi) return { success: false, message: "Sesi tidak valid." };
  if (!(await verifySesiOwnership(supabase, idSesi, profile.id_siswa))) {
    return { success: false, message: "Sesi ini bukan milik Anda." };
  }

  const hasil = await tutupSesiDenganRingkasan(supabase, idSesi);
  revalidatePath("/siswa/konseling");
  if (!hasil.success) return { success: false, message: hasil.message ?? "Sesi diakhiri, tapi gagal membuat ringkasan AI." };
  return { success: true, message: "Sesi diakhiri." };
}
