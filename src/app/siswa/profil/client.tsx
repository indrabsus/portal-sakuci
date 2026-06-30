"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  Loader2,
  GraduationCap,
  Hash,
  Mail,
  VenusAndMars,
  MapPin,
  CalendarDays,
  Sparkles,
  Award,
  Lightbulb,
  ArrowRight,
  Phone,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { InitialsAvatar } from "@/components/initials-avatar";
import { YoutubeThumbnail } from "@/components/youtube-thumbnail";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/compress-image";
import { updateFotoSiswa, updateNoHpSiswa } from "./actions";

type SertifikatItem = { id_sertifikat: string; judul: string; nilai: number | null; tanggal_terbit: string | null };
type ProyekItem = { id_project: string; nama_project: string; status: string; link_youtube: string | null };

const STATUS_PROYEK_LABEL: Record<string, string> = { pending: "Menunggu Review", approved: "Disetujui", rejected: "Ditolak" };
const STATUS_PROYEK_VARIANT: Record<string, "secondary" | "default" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

export function ProfilClient({
  idSiswa,
  namaLengkap,
  email,
  fotoUrl,
  nisn,
  jenkel,
  tempatLahir,
  tanggalLahir,
  agama,
  noHp,
  kelasNama,
  jurusanNama,
  sertifikatList,
  proyekList,
}: {
  idSiswa: string;
  namaLengkap: string;
  email: string | null;
  fotoUrl: string | null;
  nisn: string | null;
  jenkel: string | null;
  tempatLahir: string | null;
  tanggalLahir: string | null;
  agama: string | null;
  noHp: string | null;
  kelasNama: string | null;
  jurusanNama: string | null;
  sertifikatList: SertifikatItem[];
  proyekList: ProyekItem[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(fotoUrl);
  const [error, setError] = useState<string | null>(null);

  const [editingHp, setEditingHp] = useState(false);
  const [noHpValue, setNoHpValue] = useState(noHp ?? "");
  const [hpError, setHpError] = useState<string | null>(null);
  const [hpPending, startHpTransition] = useTransition();

  function handleSaveHp() {
    setHpError(null);
    const formData = new FormData();
    formData.set("no_hp", noHpValue.trim());
    startHpTransition(async () => {
      const result = await updateNoHpSiswa(formData);
      if (result.success) {
        setEditingHp(false);
        router.refresh();
      } else {
        setHpError(result.message);
      }
    });
  }

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }

    setUploading(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 500, maxHeight: 500, quality: 0.8 });

      const supabase = createClient();
      const path = `${idSiswa}/${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage.from("siswa-foto").upload(path, compressed, {
        upsert: true,
        contentType: "image/jpeg",
      });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from("siswa-foto").getPublicUrl(path);
      setPreview(data.publicUrl);

      const formData = new FormData();
      formData.set("foto_url", data.publicUrl);
      startTransition(async () => {
        const result = await updateFotoSiswa(formData);
        if (!result.success) {
          setError(result.message);
        } else {
          router.refresh();
        }
      });
    } finally {
      setUploading(false);
    }
  }

  const busy = uploading || isPending;

  const tanggalLahirLabel = tanggalLahir
    ? new Date(tanggalLahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const dataPribadi = [
    { label: "NISN", value: nisn, icon: Hash },
    { label: "Jenis Kelamin", value: jenkel === "L" ? "Laki-laki" : jenkel === "P" ? "Perempuan" : null, icon: VenusAndMars },
    { label: "Tempat, Tanggal Lahir", value: [tempatLahir, tanggalLahirLabel].filter(Boolean).join(", ") || null, icon: MapPin },
    { label: "Agama", value: agama, icon: CalendarDays },
    { label: "Email", value: email, icon: Mail },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil Saya</h1>
        <p className="text-sm text-muted-foreground">Informasi akun dan data diri kamu</p>
      </div>

      <Card className="overflow-hidden shadow-sm">
        <div className="relative h-28 bg-gradient-to-br from-primary via-primary/80 to-accent sm:h-32">
          <svg className="absolute inset-0 h-full w-full text-white opacity-[0.12]" aria-hidden>
            <defs>
              <pattern id="profil-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M28 0 H0 V28" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#profil-grid)" />
          </svg>
          <div className="absolute -right-6 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
          <Badge className="absolute right-4 top-4 gap-1 bg-white/15 text-white backdrop-blur-sm hover:bg-white/15">
            <Sparkles className="size-3" /> Siswa
          </Badge>
        </div>

        <CardContent className="relative flex flex-col items-center gap-3 px-6 pb-6 pt-0 text-center">
          <div className="relative -mt-14">
            <InitialsAvatar name={namaLengkap} fotoUrl={preview} className="size-28 border-4 border-card text-3xl shadow-md" />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/80 disabled:opacity-50"
              aria-label="Ganti foto"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div>
            <p className="text-lg font-bold tracking-tight">{namaLengkap}</p>
            <p className="text-sm text-muted-foreground">{email ?? "-"}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              <GraduationCap className="size-3" /> {kelasNama ?? "-"}
            </Badge>
            {jurusanNama && (
              <Badge variant="secondary" className="gap-1.5">
                <Sparkles className="size-3" /> {jurusanNama}
              </Badge>
            )}
          </div>

          <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={busy} className="mt-1">
            {busy ? "Mengunggah..." : "Ganti Foto Profil"}
          </Button>
          <p className="text-xs text-muted-foreground">Foto akan dikompres otomatis maksimal 500x500px.</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Informasi Pribadi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {dataPribadi.map((d) => (
            <div key={d.label} className="flex items-start gap-3 rounded-xl border bg-muted/30 p-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <d.icon className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{d.label}</p>
                <p className="text-sm font-medium">{d.value || "-"}</p>
              </div>
            </div>
          ))}

          {/* No HP - editable */}
          <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-3 sm:col-span-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Phone className="size-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">No. HP</p>
              {editingHp ? (
                <div className="mt-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={noHpValue}
                      onChange={(e) => setNoHpValue(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="h-8 max-w-[220px] text-sm"
                      disabled={hpPending}
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" className="size-7 text-emerald-600" disabled={hpPending} onClick={handleSaveHp}>
                      {hpPending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7 text-muted-foreground"
                      disabled={hpPending}
                      onClick={() => { setEditingHp(false); setNoHpValue(noHp ?? ""); setHpError(null); }}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                  {hpError && <p className="text-xs text-destructive">{hpError}</p>}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{noHp || "-"}</p>
                  <Button size="icon" variant="ghost" className="size-6 text-muted-foreground hover:text-primary" onClick={() => setEditingHp(true)}>
                    <Pencil className="size-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Sertifikat Kompetensi</CardTitle>
          <Link href="/siswa/sertifikat" className="flex items-center gap-1 text-xs text-primary hover:underline">
            Lihat semua <ArrowRight className="size-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {sertifikatList.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada sertifikat. Selesaikan roadmap kompetensi untuk mendapatkannya.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {sertifikatList.map((s) => (
                <div key={s.id_sertifikat} className="flex items-start gap-3 rounded-xl border bg-muted/30 p-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Award className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-snug">{s.judul}</p>
                    <p className="text-xs text-muted-foreground">
                      Nilai {s.nilai ?? "-"}
                      {s.tanggal_terbit &&
                        ` · ${new Date(s.tanggal_terbit).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Project & Inovasi</CardTitle>
          <Link href="/siswa/proyek" className="flex items-center gap-1 text-xs text-primary hover:underline">
            Lihat semua <ArrowRight className="size-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {proyekList.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada project & inovasi yang dibuat.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {proyekList.map((p) => (
                <div key={p.id_project} className="overflow-hidden rounded-xl border">
                  {p.link_youtube ? (
                    <YoutubeThumbnail url={p.link_youtube} />
                  ) : (
                    <div className="flex h-28 items-center justify-center bg-gradient-to-br from-primary/10 to-accent/20">
                      <Lightbulb className="size-7 text-primary/50" />
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2 p-3">
                    <p className="text-sm font-medium leading-snug">{p.nama_project}</p>
                    <Badge variant={STATUS_PROYEK_VARIANT[p.status] ?? "secondary"} className="shrink-0">
                      {STATUS_PROYEK_LABEL[p.status] ?? p.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
