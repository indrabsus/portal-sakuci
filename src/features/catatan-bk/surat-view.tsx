import type { CatatanBkRow } from "./types";

function formatTanggal(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function romanMonth(dateStr: string) {
  const bulan = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
  return bulan[new Date(dateStr).getMonth()];
}

export function SuratPerjanjianView({
  catatan,
  namaSekolah,
  alamatSekolah,
}: {
  catatan: CatatanBkRow;
  namaSekolah: string;
  alamatSekolah: string;
}) {
  const tahun = new Date(catatan.tanggal).getFullYear();
  const nomorSurat = `BK/${romanMonth(catatan.tanggal)}/${tahun}/SP`;

  return (
    <div
      className="
        w-full max-w-3xl bg-white text-black
        px-16 py-12
        print:max-w-none print:px-[2cm] print:py-[1.5cm]
        shadow-lg print:shadow-none
        font-serif text-[13px] leading-relaxed
      "
    >
      {/* Kop Surat */}
      <div className="flex flex-col items-center border-b-2 border-black pb-3 mb-6 text-center">
        <p className="text-base font-bold uppercase tracking-wide">{namaSekolah}</p>
        <p className="text-[11px]">Bimbingan dan Konseling</p>
        {alamatSekolah && <p className="text-[11px] text-gray-700">{alamatSekolah}</p>}
      </div>

      {/* Judul */}
      <div className="text-center mb-6">
        <p className="text-[15px] font-bold uppercase tracking-widest underline underline-offset-4">
          Surat Perjanjian
        </p>
        <p className="text-[11px] text-gray-600 mt-1">Nomor: {nomorSurat}</p>
      </div>

      {/* Pembukaan */}
      <p className="mb-4 text-justify">
        Yang bertanda tangan di bawah ini, Koordinator Bimbingan dan Konseling{" "}
        <strong>{namaSekolah}</strong>, telah mengadakan pertemuan dan pembinaan kepada
        siswa berikut:
      </p>

      {/* Data Siswa */}
      <table className="mb-5 w-full text-[13px]">
        <tbody>
          {[
            ["Nama Siswa", catatan.nama_siswa],
            ["NISN", catatan.nisn ?? "-"],
            ["Kelas", catatan.kelas_label],
            ["Tanggal", formatTanggal(catatan.tanggal)],
          ].map(([label, value]) => (
            <tr key={label}>
              <td className="w-40 py-0.5 align-top">{label}</td>
              <td className="w-6 align-top">:</td>
              <td className="align-top font-semibold">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Permasalahan */}
      <p className="font-semibold mb-1">Permasalahan:</p>
      <p className="mb-4 text-justify whitespace-pre-wrap border-l-2 border-gray-300 pl-3">
        {catatan.permasalahan}
      </p>

      {/* Tindakan */}
      <p className="font-semibold mb-1">Tindakan / Solusi yang Diberikan:</p>
      <p className="mb-4 text-justify whitespace-pre-wrap border-l-2 border-gray-300 pl-3">
        {catatan.tindakan}
      </p>

      {/* Kesepakatan */}
      {catatan.kesepakatan && (
        <>
          <p className="font-semibold mb-1">Kesepakatan:</p>
          <p className="mb-4 text-justify whitespace-pre-wrap border-l-2 border-gray-300 pl-3">
            {catatan.kesepakatan}
          </p>
        </>
      )}

      {/* Catatan Tambahan */}
      {catatan.catatan_tambahan && (
        <>
          <p className="font-semibold mb-1">Catatan Tambahan:</p>
          <p className="mb-4 text-justify whitespace-pre-wrap border-l-2 border-gray-300 pl-3">
            {catatan.catatan_tambahan}
          </p>
        </>
      )}

      {/* Penutup */}
      <p className="mt-4 mb-8 text-justify">
        Demikian surat perjanjian ini dibuat dengan sebenarnya dan disetujui oleh semua pihak
        untuk dapat dilaksanakan dengan penuh tanggung jawab.
      </p>

      {/* Tanda Tangan */}
      <div className="flex justify-between mt-8">
        {/* Siswa */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-[12px]">Siswa,</p>
          <div className="h-16" />
          <div className="border-t border-black w-36 pt-1 text-center">
            <p className="text-[12px] font-semibold">{catatan.nama_siswa}</p>
            {catatan.nisn && <p className="text-[11px] text-gray-600">NISN: {catatan.nisn}</p>}
          </div>
        </div>

        {/* Koordinator BK */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-[12px]">Koordinator BK,</p>
          <div className="h-16" />
          <div className="border-t border-black w-48 pt-1 text-center">
            <p className="text-[12px] font-semibold">
              {catatan.nama_koordinator_bk ?? "................................"}
            </p>
            {catatan.nip_koordinator_bk ? (
              <p className="text-[11px] text-gray-600">NIP: {catatan.nip_koordinator_bk}</p>
            ) : (
              <p className="text-[11px] text-gray-400">NIP: ................................</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
