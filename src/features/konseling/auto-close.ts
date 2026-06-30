import { createClient } from "@/lib/supabase/server";
import { ringkasSesiKonselingAI } from "@/lib/ai-konseling";

const BATAS_TIDAK_AKTIF_MS = 12 * 60 * 60 * 1000;

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function tutupSesiDenganRingkasan(supabase: SupabaseClient, idSesi: string) {
  const { data: riwayatRaw } = await supabase
    .from("konseling_pesan")
    .select("pengirim, isi")
    .eq("id_sesi", idSesi)
    .order("created_at", { ascending: true });

  const riwayat = (riwayatRaw ?? []) as { pengirim: "siswa" | "ai"; isi: string }[];

  if (riwayat.length === 0) {
    await supabase.from("konseling_sesi").update({ status: "selesai", ended_at: new Date().toISOString() }).eq("id_sesi", idSesi);
    return { success: true };
  }

  try {
    const hasil = await ringkasSesiKonselingAI(riwayat);
    await supabase
      .from("konseling_sesi")
      .update({
        status: "selesai",
        ended_at: new Date().toISOString(),
        judul: hasil.judul,
        ringkasan: hasil.ringkasan,
        tingkat_risiko: hasil.tingkat_risiko,
        indikasi: hasil.indikasi,
      })
      .eq("id_sesi", idSesi);
    return { success: true };
  } catch (e) {
    await supabase.from("konseling_sesi").update({ status: "selesai", ended_at: new Date().toISOString() }).eq("id_sesi", idSesi);
    return { success: false, message: e instanceof Error ? e.message : "Gagal membuat ringkasan AI." };
  }
}

/** Cek satu sesi: kalau aktif & tidak ada aktivitas >12 jam, tutup otomatis. Return true kalau ditutup. */
export async function tutupSesiKedaluwarsaJikaPerlu(supabase: SupabaseClient, idSesi: string): Promise<boolean> {
  const { data: sesi } = await supabase.from("konseling_sesi").select("status, started_at").eq("id_sesi", idSesi).single();
  if (!sesi || sesi.status !== "aktif") return false;

  const { data: pesanTerakhir } = await supabase
    .from("konseling_pesan")
    .select("created_at")
    .eq("id_sesi", idSesi)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const waktuTerakhir = pesanTerakhir?.created_at ?? sesi.started_at;
  const sudahLama = Date.now() - new Date(waktuTerakhir).getTime() > BATAS_TIDAK_AKTIF_MS;
  if (!sudahLama) return false;

  await tutupSesiDenganRingkasan(supabase, idSesi);
  return true;
}

/** Sapu semua sesi aktif milik siswa tertentu (atau semua, untuk tampilan staff) yang sudah kedaluwarsa. */
export async function sapuSesiKedaluwarsa(supabase: SupabaseClient, idSiswa?: string) {
  let query = supabase.from("konseling_sesi").select("id_sesi").eq("status", "aktif");
  if (idSiswa) query = query.eq("id_siswa", idSiswa);
  const { data: aktifList } = await query;

  for (const s of aktifList ?? []) {
    await tutupSesiKedaluwarsaJikaPerlu(supabase, s.id_sesi);
  }
}
