"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

async function sha256Hex(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function AdminLoginPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const SUPER_ADMIN_EMAIL = "mahmudulhm2003@gmail.com";
  const EXPECTED_HASH = "6dde3979d326e44a8534e760f2c9d22d483a578272eacaba265bda3675adeb5c";
  const SALT = "JibonJotno_Enterprise_2026_Salt_Secure";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      const computedHash = await sha256Hex(`${cleanPass}_${SALT}`);

      if (cleanEmail === SUPER_ADMIN_EMAIL && computedHash === EXPECTED_HASH) {
        const sessionPayload = {
          email: SUPER_ADMIN_EMAIL,
          role: "Super Admin",
          issuedAt: Date.now(),
          token: `jj_auth_${Math.random().toString(36).substring(2)}_${Date.now()}`,
        };

        localStorage.setItem("jj_admin_session", JSON.stringify(sessionPayload));
        router.push("/admin/medicines");
      } else {
        setErrorMsg("ইমেইল অথবা পাসওয়ার্ড সঠিক নয়! অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } catch {
      setErrorMsg("নিরাপত্তা যাচাইতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs font-bold font-sans">
        নিরাপত্তা গেটওয়ে লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#072e23] via-[#0b3c2e] to-[#041a14] flex items-center justify-center p-4 font-sans text-slate-800" suppressHydrationWarning>
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-emerald-900/20 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-[#0f4c3a]" />

        <div className="text-center space-y-1">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-900 text-[11px] font-black px-3.5 py-1 rounded-full border border-emerald-200 uppercase">
            <span>🛡️ এন্টারপ্রাইজ সিকিউরিটি হাব</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight pt-2">
            জীবনযত্ন অ্যাডমিন পোর্টাল
          </h1>
          <p className="text-xs text-slate-500">
            সুরক্ষিত ক্রিপ্টোগ্রাফিক অথেনটিকেশন গেটওয়ে
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl text-xs font-bold text-center animate-in fade-in">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-slate-700 mb-1">সুপার অ্যাডমিন ইমেইল</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mahmudulhm2003@gmail.com"
              className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">অ্যাক্সেস পাসওয়ার্ড</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
              required
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-slate-700">
              <span>🔒 ২৫৬-বিট ক্রিপ্টোগ্রাফিক সুরক্ষা</span>
            </div>
            <div>পাসওয়ার্ড প্লেইন-টেক্সট আকারে সেভ হয় না। SHA-256 এনক্রিপশনের মাধ্যমে সরাসরি যাচাই সক্রিয়।</div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f4c3a] hover:bg-emerald-900 active:scale-95 text-white py-3.5 rounded-2xl font-bold text-xs transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "ভেরিফাই করা হচ্ছে..." : "অ্যাডমিন প্যানেলে প্রবেশ করুন →"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <Link href="/" className="text-xs font-bold text-slate-500 hover:text-emerald-800">
            ← পাবলিক ওয়েবসাইটে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}