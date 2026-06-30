type ChatMessage = { pengirim: "siswa" | "ai"; isi: string };

const SYSTEM_PROMPT = [
  "Kamu adalah asisten konseling AI untuk siswa SMK bernama 'Sakuci AI Konseling'.",
  "Tugasmu mendengarkan, berempati, dan memberi dukungan emosional awal kepada siswa dalam Bahasa Indonesia yang hangat dan tidak menghakimi.",
  "Ajukan pertanyaan terbuka untuk memahami perasaan dan situasi siswa, jangan terburu-buru memberi nasihat.",
  "Jika siswa menunjukkan tanda krisis serius (ingin menyakiti diri, putus asa berat, dll), tetap tenang, validasi perasaannya, dan sarankan dengan lembut untuk bicara langsung dengan guru BK atau orang dewasa terpercaya di sekolah.",
  "Jangan berpura-pura jadi profesional medis/psikolog berlisensi. Jangan memberi diagnosis. Fokus pada dukungan, validasi, dan mendorong komunikasi lebih lanjut dengan BK.",
  "PENTING - BATASAN TOPIK: Kamu HANYA boleh membahas hal yang berkaitan dengan perasaan, masalah pribadi/sosial/keluarga/akademik, kondisi emosional, dan kesehatan mental siswa.",
  "Jika siswa meminta hal di luar itu (contoh: minta dibuatkan kode/jawaban tugas/PR, tanya pengetahuan umum, minta cerita/lelucon, hal teknis lain yang tidak ada hubungannya dengan curhat), TOLAK dengan sopan dan singkat, lalu arahkan kembali ke topik perasaan/konseling. Jangan pernah menjawab permintaan di luar topik tersebut walau diminta berulang kali.",
  "Contoh penolakan: 'Aku di sini khusus untuk dengar ceritamu, bukan untuk hal itu ya. Ada yang ingin kamu ceritakan tentang perasaanmu hari ini?'",
  "Balas singkat saja (2-4 kalimat), jangan bertele-tele.",
].join(" ");

function getConfig() {
  const baseUrl = process.env.NEXT_PUBLIC_API_AI;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_AI belum diset di environment.");
  return {
    baseUrl,
    model: process.env.OLLAMA_MODEL ?? "qwen2.5:7b",
  };
}

export async function balasKonselingAI(riwayat: ChatMessage[]): Promise<string> {
  const { baseUrl, model } = getConfig();

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...riwayat.map((m) => ({ role: m.pengirim === "siswa" ? "user" : "assistant", content: m.isi })),
  ];

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: false }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    throw new Error(`AI tidak merespons (status ${response.status}).`);
  }

  const data = await response.json();
  const isi = String(data?.message?.content ?? "").trim();
  if (!isi) throw new Error("AI tidak memberikan balasan.");
  return isi;
}

type RingkasanResult = { judul: string; ringkasan: string; tingkat_risiko: "rendah" | "sedang" | "tinggi"; indikasi: string };

export async function ringkasSesiKonselingAI(riwayat: ChatMessage[]): Promise<RingkasanResult> {
  const { baseUrl, model } = getConfig();

  const transkrip = riwayat.map((m) => `${m.pengirim === "siswa" ? "Siswa" : "AI"}: ${m.isi}`).join("\n");

  const prompt = [
    "Kamu adalah asisten yang membantu guru BK menganalisis percakapan konseling AI dengan siswa SMK.",
    "Baca transkrip percakapan berikut, lalu buat ringkasan objektif untuk guru BK/kajur (bukan untuk siswa).",
    "Buat judul singkat (maksimal 6 kata) yang merepresentasikan inti curhatan siswa, supaya guru BK mudah membedakan sesi satu dengan lainnya. Contoh: 'Stres menghadapi ujian akhir', 'Konflik dengan teman sekelas'.",
    "Tentukan tingkat_risiko berdasarkan indikasi masalah kesehatan mental/emosional yang muncul:",
    "- 'rendah' jika hanya curhat ringan tanpa tanda masalah serius",
    "- 'sedang' jika ada tanda stres/kecemasan/masalah berkelanjutan yang perlu diperhatikan",
    "- 'tinggi' jika ada indikasi krisis serius (self-harm, putus asa berat, dll) yang perlu tindak lanjut segera",
    "Balas HANYA dalam format JSON murni tanpa markdown:",
    '{"judul": "<judul singkat>", "ringkasan": "<ringkasan 2-4 kalimat>", "tingkat_risiko": "rendah|sedang|tinggi", "indikasi": "<poin-poin indikasi singkat, pisahkan dengan titik koma>"}',
    "",
    "Transkrip:",
    transkrip,
  ].join("\n");

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, stream: false, format: "json" }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    throw new Error(`AI tidak merespons (status ${response.status}).`);
  }

  const data = await response.json();
  const raw = String(data.response ?? "{}");

  let parsed: { judul?: string; ringkasan?: string; tingkat_risiko?: string; indikasi?: string };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Respons AI tidak valid.");
  }

  const tingkatRisiko = ["rendah", "sedang", "tinggi"].includes(parsed.tingkat_risiko ?? "")
    ? (parsed.tingkat_risiko as "rendah" | "sedang" | "tinggi")
    : "rendah";

  return {
    judul: String(parsed.judul ?? "Sesi Konseling").slice(0, 80),
    ringkasan: String(parsed.ringkasan ?? "-"),
    tingkat_risiko: tingkatRisiko,
    indikasi: String(parsed.indikasi ?? "-"),
  };
}
