import QRCode from "qrcode";

export async function generateQrDataUrl(text: string) {
  return QRCode.toDataURL(text);
}
