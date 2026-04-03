import crypto from "crypto";

export function generateReceiptHash(payload: object) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
}
