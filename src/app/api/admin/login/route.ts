import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const targetEmail = process.env.ADMIN_EMAIL || "mahmudulhm2003@gmail.com";
    // Direct plain password fallback check to guarantee instant working login
    const targetPassword = process.env.ADMIN_PASSWORD || "admin";

    if (email === targetEmail && password === targetPassword) {
      const response = NextResponse.json({ success: true, message: "Login successful" });
      response.cookies.set({
        name: "admin_token",
        value: "authenticated_secure_session_token",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });
      return response;
    }

    return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}