/**
 * Cetak dgn override @page ke A4 portrait (default global @page adalah landscape).
 * Named CSS page (`page: <name>`) tidak dipakai krn tidak reliable saat konten memecah
 * ke beberapa halaman (browser bisa memotong konten di batas halaman) - override polos
 * di sini berlaku utk seluruh halaman cetak, termasuk lanjutan multi-halaman.
 */
export function printPortraitA4() {
  const style = document.createElement("style");
  style.textContent = "@page { size: A4 portrait; margin: 15mm 18mm; }";
  document.head.appendChild(style);
  window.print();
  document.head.removeChild(style);
}
