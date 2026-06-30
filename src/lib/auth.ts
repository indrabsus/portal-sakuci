import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "admin" | "kajur" | "guru" | "siswa" | "bkk" | "bk" | "perpus";

export type CurrentProfile = {
  id_profile: string;
  nama_lengkap: string | null;
  email: string | null;
  foto: string | null;
  role: Role;
  id_guru: string | null;
  id_siswa: string | null;
  id_jurusan: string | null;
};

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id_profile, nama_lengkap, email, foto, aktif, id_jurusan, roles(nama_role)")
    .eq("id_profile", user.id)
    .single();

  if (!profile || profile.aktif === false) return null;

  const role = (profile.roles as unknown as { nama_role: string } | null)?.nama_role as Role | undefined;
  if (!role) return null;

  const [{ data: akunGuru }, { data: akunSiswa }] = await Promise.all([
    role === "guru"
      ? supabase.from("akun_guru").select("id_guru").eq("id_profile", user.id).single()
      : Promise.resolve({ data: null }),
    role === "siswa"
      ? supabase.from("akun_siswa").select("id_siswa").eq("id_profile", user.id).single()
      : Promise.resolve({ data: null }),
  ]);

  return {
    id_profile: profile.id_profile,
    nama_lengkap: profile.nama_lengkap,
    email: profile.email,
    foto: profile.foto,
    role,
    id_guru: akunGuru?.id_guru ?? null,
    id_siswa: akunSiswa?.id_siswa ?? null,
    id_jurusan: profile.id_jurusan ?? null,
  };
}

/** Dipanggil di setiap layout role sebagai lapisan kedua selain middleware. */
export async function requireRole(allowed: Role[]): Promise<CurrentProfile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!allowed.includes(profile.role)) redirect(`/${profile.role}/dashboard`);
  return profile;
}

/** Khusus Kajur: pastikan jurusan sudah di-assign oleh admin sebelum lanjut. */
export async function requireKajurJurusan(): Promise<CurrentProfile & { id_jurusan: string }> {
  const profile = await requireRole(["kajur"]);
  if (!profile.id_jurusan) {
    redirect("/kajur/dashboard?error=jurusan_belum_diatur");
  }
  return profile as CurrentProfile & { id_jurusan: string };
}
