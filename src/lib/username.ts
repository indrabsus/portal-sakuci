import "server-only";

export const USERNAME_REGEX = /^[a-z0-9_.]{3,30}$/;

/** Username dari nama_lengkap: huruf kecil, buang spasi & karakter non alfanumerik, ambil 10 karakter pertama. */
export function namaKeUsername(nama: string, fallbackSuffix: string): string {
  const base = nama
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 10);
  return base.length >= 3 ? base : `${base}${fallbackSuffix}`.slice(0, 10);
}

/**
 * Cari username yang tidak bentrok. Kalau `username` sudah dipakai, tetap lanjutkan proses
 * dengan menambahkan 3 angka acak di belakangnya (dicoba ulang sampai ketemu yang unik),
 * bukan menggagalkan barisnya.
 */
export async function resolveUsernameBentrok(
  username: string,
  domain: string,
  isTaken: (email: string) => Promise<boolean>,
  maxAttempts = 5,
): Promise<string | null> {
  let candidate = username;
  for (let attempt = 0; attempt <= maxAttempts; attempt++) {
    if (!(await isTaken(`${candidate}@${domain}`))) return candidate;
    const suffix = String(Math.floor(100 + Math.random() * 900));
    candidate = `${username}${suffix}`.slice(0, 30);
  }
  return null;
}
