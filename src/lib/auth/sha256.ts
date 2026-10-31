const encoder = new TextEncoder();

export const PUBLIC_AUTH_SALT =
  process.env.NEXT_PUBLIC_ADMIN_AUTH_SALT || "jj-public-kdf-v1";

export function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function sha256Hex(message: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", encoder.encode(message));
  return bufferToHex(digest);
}

/** Salted SHA-256 digest used by admin login. Never log the input password. */
export async function saltedPasswordDigest(
  email: string,
  password: string,
  salt: string = PUBLIC_AUTH_SALT
): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase();
  return sha256Hex(`${salt}:${normalizedEmail}:${password}`);
}

export function looksLikeSha256Hex(value: string): boolean {
  return /^[a-f0-9]{64}$/i.test(value);
}
