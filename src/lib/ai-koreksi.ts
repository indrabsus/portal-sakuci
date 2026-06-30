type KoreksiResult = { nilai: number; alasan: string };

export async function koreksiEssayAI({
  pertanyaan,
  pembahasan,
  jawabanSiswa,
}: {
  pertanyaan: string;
  pembahasan: string | null;
  jawabanSiswa: string;
}): Promise<KoreksiResult> {
  const baseUrl = process.env.NEXT_PUBLIC_API_AI;
  const model = process.env.OLLAMA_MODEL ?? "qwen2.5:7b";
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_AI belum diset di environment.");

  const prompt = [
    "Kamu adalah asisten guru yang menilai jawaban essay siswa SMK.",
    "Beri nilai 0-100 berdasarkan kesesuaian jawaban siswa dengan kunci jawaban/pembahasan.",
    "Jika tidak ada kunci jawaban, nilai berdasarkan kebenaran dan kelengkapan jawaban secara umum.",
    "Balas HANYA dalam format JSON murni tanpa markdown: {\"nilai\": <angka 0-100>, \"alasan\": \"<alasan singkat dalam Bahasa Indonesia>\"}",
    "",
    `Pertanyaan: ${pertanyaan}`,
    pembahasan ? `Kunci Jawaban/Pembahasan: ${pembahasan}` : "",
    `Jawaban Siswa: ${jawabanSiswa || "(tidak menjawab)"}`,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      format: "json",
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    throw new Error(`AI tidak merespons (status ${response.status}).`);
  }

  const data = await response.json();
  const raw = String(data.response ?? "{}");

  let parsed: { nilai?: number; alasan?: string };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Respons AI tidak valid.");
  }

  const nilai = Math.max(0, Math.min(100, Math.round(Number(parsed.nilai ?? 0))));
  const alasan = String(parsed.alasan ?? "-");

  return { nilai, alasan };
}
