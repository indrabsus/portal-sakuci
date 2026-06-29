import "server-only";
import QRCode from "qrcode";

export async function generateQrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    margin: 1,
    width: 200,
    color: { dark: "#1e293b", light: "#ffffff" },
  });
}
