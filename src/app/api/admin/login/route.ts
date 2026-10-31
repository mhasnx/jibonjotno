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
import { SESSION_COOKIE_OPTIONS } from "@/lib/auth/sessionCookie";

const LoginSchema = z.object({
  email: z.string().email().max(100),
  passwordHash: z.string().regex(/^[a-f0-9]{64}$/i).optional(),
  password: z.string().min(6).max(64).optional(),
});

function adminCookie(value: string, maxAge: number) {
  return {
    name: ADMIN_SESSION_COOKIE,
    value,
    ...SESSION_COOKIE_OPTIONS,
    maxAge,
  };
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyAdminSessionToken(token);
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  return NextResponse.json({
    success: true,
    user: { email: session.email, role: session.role },
  });
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, { key: "admin-login", limit: 8, windowMs: 60_000 });
  if (!limited.success) {
    return tooManyRequests(limited.retryAfterSeconds);
  }

  try {
    const body: unknown = await request.json();
    const parsed = LoginSchema.parse(body);
    const email = parsed.email.trim().toLowerCase();
    const expectedEmail = getConfiguredAdminEmail();

    const envPassword = process.env.ADMIN_PASSWORD || "";
    const envHash = (process.env.ADMIN_PASSWORD_SHA256 || "").toLowerCase();

    if (!envPassword && !envHash) {
      return NextResponse.json(
        { success: false, message: "Admin credentials are not configured" },
        { status: 503 }
      );
    }

    let incomingHash = (parsed.passwordHash || "").toLowerCase();
    if (!incomingHash && parsed.password) {
      incomingHash = await saltedPasswordDigest(email, parsed.password);
    }

    if (!incomingHash || email !== expectedEmail) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const expectedHash = envHash || (await saltedPasswordDigest(expectedEmail, envPassword));
    if (!timingSafeEqualHex(incomingHash, expectedHash)) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const token = await createAdminSessionToken(expectedEmail);
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: { email: expectedEmail, role: "super_admin" },
    });
    response.cookies.set(adminCookie(token, ADMIN_SESSION_TTL_SECONDS));
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: "Invalid credentials format" }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
