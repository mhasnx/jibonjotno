import { PUBLIC_AUTH_SALT, bufferToHex, timingSafeEqualHex } from "@/lib/auth/sha256";
import { SESSION_COOKIE_NAME } from "@/lib/auth/sessionCookie";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE_NAME;
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24;

export type AdminSessionPayload = {
  email: string;
  role: "super_admin";
  exp: number;
};

function sessionSecret(): string {
  return process.env.SESSION_SECRET || process.env.ADMIN_AUTH_SALT || "jj-fallback-session-hmac";
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacSha256Hex(secret: string, data: string): Promise<string> {
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await globalThis.crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return bufferToHex(signature);
}

export async function createAdminSessionToken(email: string): Promise<string> {
  const payload: AdminSessionPayload = {
    email: email.trim().toLowerCase(),
    role: "super_admin",
    exp: Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000,
  };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await hmacSha256Hex(sessionSecret(), body);
  return `${body}.${signature}`;
}

export async function verifyAdminSessionToken(token: string | undefined | null): Promise<AdminSessionPayload | null> {
  if (!token || !token.includes(".")) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = await hmacSha256Hex(sessionSecret(), body);
  if (!timingSafeEqualHex(expected, signature)) return null;

  try {
    const parsed = JSON.parse(decoder.decode(fromBase64Url(body))) as AdminSessionPayload;
    if (!parsed?.email || parsed.role !== "super_admin" || typeof parsed.exp !== "number") {
      return null;
    }
    if (parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getConfiguredAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || "mahmudulhm2003@gmail.com").trim().toLowerCase();
}

export { PUBLIC_AUTH_SALT };
