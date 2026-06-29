type CertificateData = {
  namaSiswa: string;
  judulKompetensi: string;
  nilai: number | null;
  nomorSertifikat: string | null;
  kodeVerifikasi: string | null;
  tanggalTerbit: string | null;
  namaKajur: string | null;
  jabatanKajur: string | null;
  qrDataUrl: string;
  namaSekolah: string;
  rincianTes: { judul: string; nilai: number | null }[];
  statusLulus: boolean;
};

function CircuitOverlay() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full text-primary opacity-[0.12]"
      viewBox="0 0 1000 700"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* Pojok kiri atas */}
      <path
        d="M0 0 V90 H70 L100 120 H260 L290 150 H380 M0 40 H30 L50 60 H140 M0 160 H40 V200 H180"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="100" cy="120" r="5" fill="currentColor" />
      <circle cx="260" cy="120" r="3" fill="currentColor" />
      <circle cx="380" cy="150" r="4" fill="currentColor" />
      <circle cx="140" cy="60" r="3" fill="currentColor" />
      <circle cx="180" cy="200" r="3" fill="currentColor" />

      {/* Pojok kanan bawah */}
      <path
        d="M1000 700 V610 H930 L900 580 H740 L710 550 H620 M1000 660 H970 L950 640 H860 M1000 540 H960 V500 H820"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="900" cy="580" r="5" fill="currentColor" />
      <circle cx="740" cy="580" r="3" fill="currentColor" />
      <circle cx="620" cy="550" r="4" fill="currentColor" />
      <circle cx="860" cy="640" r="3" fill="currentColor" />
      <circle cx="820" cy="500" r="3" fill="currentColor" />

      {/* Pojok kanan atas & kiri bawah, lebih ringan */}
      <path d="M1000 0 V60 H940 L920 80 H840 M1000 100 H980" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" />
      <circle cx="940" cy="60" r="3" fill="currentColor" opacity="0.7" />
      <circle cx="840" cy="80" r="3" fill="currentColor" opacity="0.7" />
      <path d="M0 700 V640 H60 L80 620 H160 M0 600 H20" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" />
      <circle cx="60" cy="640" r="3" fill="currentColor" opacity="0.7" />
      <circle cx="160" cy="620" r="3" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

function CornerOrnament({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      <path d="M2 30 V2 H30" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M2 30 V10 H10 M2 30 H22 V22" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  );
}

export function CertificateView({ data }: { data: CertificateData }) {
  return (
    <div className="relative mx-auto aspect-[297/210] w-full max-w-[1100px] overflow-hidden rounded-md bg-white shadow-2xl ring-1 ring-black/5 print:m-0 print:aspect-auto print:h-[210mm] print:w-[297mm] print:max-w-none print:rounded-none print:shadow-none print:ring-0">
      {/* Border elegan */}
      <div className="absolute inset-[14px] border-[3px] border-double border-primary/40" />
      <div className="absolute inset-[22px] border border-primary/20" />

      {/* Ornamen pojok */}
      <CornerOrnament className="absolute left-6 top-6 size-10 text-primary/50" />
      <CornerOrnament className="absolute right-6 top-6 size-10 rotate-90 text-primary/50" />
      <CornerOrnament className="absolute bottom-6 left-6 size-10 -rotate-90 text-primary/50" />
      <CornerOrnament className="absolute bottom-6 right-6 size-10 rotate-180 text-primary/50" />

      <CircuitOverlay />

      {!data.statusLulus && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <span className="-rotate-[18deg] select-none whitespace-nowrap border-[6px] border-red-600/80 px-8 py-2 text-5xl font-black uppercase tracking-widest text-red-600/80 sm:text-7xl">
            TIDAK LULUS
          </span>
        </div>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-between px-14 py-10 text-center sm:px-20 sm:py-12">
        <div className="flex w-full flex-col items-center gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo Sekolah" className="h-14 w-auto object-contain" />
          <p className="mt-1 text-sm font-bold uppercase tracking-[0.15em] text-foreground">{data.namaSekolah}</p>
          <div className="mt-1 h-px w-44 bg-primary/40" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-extrabold uppercase tracking-[0.2em] text-foreground sm:text-2xl">
            Sertifikat Kompetensi
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">Dengan ini menyatakan bahwa</p>
          <p className="font-serif text-3xl font-bold text-primary sm:text-4xl">{data.namaSiswa}</p>
          <p className="max-w-xl text-xs text-muted-foreground sm:text-sm">
            telah dinyatakan <span className="font-semibold text-foreground">LULUS</span> dalam uji kompetensi
          </p>
          <p className="text-base font-bold text-foreground sm:text-lg">{data.judulKompetensi}</p>

          {data.rincianTes.length > 0 && (
            <div className="mt-1 flex w-full max-w-md flex-col gap-0.5 rounded-lg border border-primary/15 bg-primary/[0.03] px-4 py-2">
              {data.rincianTes.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 text-[11px] sm:text-xs">
                  <span className="text-muted-foreground">{t.judul}</span>
                  <span className="font-semibold text-foreground">{t.nilai ?? "-"}</span>
                </div>
              ))}
              <div className="mt-1 flex items-center justify-between gap-3 border-t border-primary/15 pt-1 text-xs font-bold sm:text-sm">
                <span className="text-foreground">Nilai Akhir</span>
                <span className="text-primary">{data.nilai ?? "-"}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex w-full items-end justify-between gap-6">
          <div className="flex flex-col items-start gap-0.5 text-left text-[11px] text-muted-foreground">
            <p>No. Sertifikat: <span className="font-mono text-foreground">{data.nomorSertifikat ?? "-"}</span></p>
            <p>Kode Verifikasi: <span className="font-mono text-foreground">{data.kodeVerifikasi ?? "-"}</span></p>
            <p>
              Tanggal Terbit:{" "}
              <span className="text-foreground">
                {data.tanggalTerbit ? new Date(data.tanggalTerbit).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.qrDataUrl} alt="QR Verifikasi" className="size-16 rounded-md border bg-white p-1" />
            <p className="text-[9px] text-muted-foreground">Pindai untuk verifikasi</p>
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <p className="font-serif text-2xl italic text-primary">{data.namaKajur ?? ""}</p>
            <div className="h-px w-36 bg-foreground/40" />
            <p className="text-xs text-muted-foreground">{data.jabatanKajur ?? "Kepala Jurusan"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
