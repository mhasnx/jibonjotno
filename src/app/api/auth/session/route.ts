import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { saltedPasswordDigest, timingSafeEqualHex } from "@/lib/auth/sha256";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSessionToken,
  getConfiguredAdminEmail,
  verifyAdminSessionToken,
} from "@/lib/auth/adminSession";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/auth/sessionCookie";

const AuthInputSchema = z.object({
  email: z.string().email().max(100),
  passwordHash: z.string().regex(/^[a-f0-9]{64}$/i).optional(),
  password: z.string().min(6).max(64).optional(),
});

function clearSessionCookie() {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  };
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyAdminSessionToken(token);
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  return NextResponse.json({
    success: true,
    user: { email: session.email, role: session.role },
  });
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, { key: "auth-session", limit: 10, windowMs: 60_000 });
  if (!limited.success) {
    return tooManyRequests(limited.retryAfterSeconds);
  }

  try {
    const body: unknown = await req.json();
    const parsed = AuthInputSchema.parse(body);
    const email = parsed.email.trim().toLowerCase();
    const expectedEmail = getConfiguredAdminEmail();
    const envPassword = process.env.ADMIN_PASSWORD || "";
    const envHash = (process.env.ADMIN_PASSWORD_SHA256 || "").toLowerCase();

    if (!envPassword && !envHash) {
      return NextResponse.json({ success: false, error: "Authentication is not configured" }, { status: 503 });
    }

    let incomingHash = (parsed.passwordHash || "").toLowerCase();
    if (!incomingHash && parsed.password) {
      incomingHash = await saltedPasswordDigest(email, parsed.password);
    }

    const expectedHash = envHash || (await saltedPasswordDigest(expectedEmail, envPassword));
    if (!incomingHash || email !== expectedEmail || !timingSafeEqualHex(incomingHash, expectedHash)) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const sessionToken = await createAdminSessionToken(expectedEmail);
    const response = NextResponse.json({
      success: true,
      message: "Session authenticated securely",
      user: { email: expectedEmail, role: "super_admin" },
    });
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      ...SESSION_COOKIE_OPTIONS,
      maxAge: ADMIN_SESSION_TTL_SECONDS,
    });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid credentials format" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const limited = rateLimit(req, { key: "auth-session-logout", limit: 20, windowMs: 60_000 });
  if (!limited.success) {
    return tooManyRequests(limited.retryAfterSeconds);
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.set(clearSessionCookie());
  return response;
}
