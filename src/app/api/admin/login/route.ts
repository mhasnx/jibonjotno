import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL || "mahmudulhm2003@gmail.com";
    const adminPassHash = process.env.ADMIN_PASSWORD_HASH || "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";

    const incomingHash = crypto.createHash("sha256").update(password || "").digest("hex");

    if (email === adminEmail && incomingHash === adminPassHash) {
      const response = NextResponse.json({ success: true, message: "Login successful" });
      response.cookies.set({
        name: "admin_token",
        value: "authenticated_secure_session_token",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
      return response;
    }

    return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}