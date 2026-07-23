import "server-only";

export function normalizeWaNumber(value: string | null) {
  const digits = value?.replace(/\D/g, "") ?? "";
  if (!digits) return null;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  return digits;
}

export async function sendWaMessage(nomor: string, pesan: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_WA?.trim();
  if (!apiBase) {
    throw new Error("Variabel NEXT_PUBLIC_API_WA belum diatur.");
  }

  const endpoint = `${apiBase.replace(/\/$/, "")}/notifuser`;
  const attempts = 2;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomor, pesan }),
        signal: controller.signal,
        cache: "no-store",
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`${response.status}${detail ? ` ${detail}` : ""}`.trim());
      }

      return;
    } catch (error) {
      if (attempt === attempts) {
        const message = error instanceof Error ? error.message : "Tidak diketahui";
        throw new Error(`Gagal mengirim ke ${nomor}: ${message}`);
      }
    } finally {
      clearTimeout(timeout);
    }
  }
}

/** Cek status koneksi gateway WhatsApp. Gagal/timeout/env kosong dianggap offline. */
export async function getWaStatus(): Promise<boolean> {
  const apiBase = process.env.NEXT_PUBLIC_API_WA?.trim();
  if (!apiBase) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${apiBase.replace(/\/$/, "")}/status`, {
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) return false;
    const json = await response.json().catch(() => null);
    return json?.data?.status === "ready" || json?.status === "ready" || json?.connected === true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
