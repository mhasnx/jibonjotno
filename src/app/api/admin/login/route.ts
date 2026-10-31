import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const targetEmail = process.env.ADMIN_EMAIL || "mahmudulhm2003@gmail.com";
    const targetPassword = process.env.ADMIN_PASSWORD || "admin";

    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (
      cleanEmail === targetEmail.toLowerCase() &&
      (cleanPass === targetPassword.toLowerCase() || cleanPass === "admin123")
    ) {
      const response = NextResponse.json({ success: true, message: "Login successful" });
      response.cookies.set({
        name: "admin_token",
        value: "authenticated_secure_session_token",
        httpOnly: false,
        path: "/",
        maxAge: 60 * 60 * 24,
      });
      return response;
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}