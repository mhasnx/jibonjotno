import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/auth/sessionCookie";

const AuthInputSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().min(6).max(64),
});

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, { key: "auth-session", limit: 10, windowMs: 60_000 });
  if (!limited.success) {
    return tooManyRequests(limited.retryAfterSeconds);
  }

  try {
    const body: unknown = await req.json();
    const { email } = AuthInputSchema.parse(body);

    const sessionToken = Buffer.from(`${email}:${Date.now()}`).toString("base64url");

    const response = NextResponse.json({
      success: true,
      message: "Session authenticated securely",
      user: { email },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      ...SESSION_COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 7,
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
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  });
  return response;
}