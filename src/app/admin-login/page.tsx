"use client";

import React, { useState } from "react";
import Link from "next/link";
import { saltedPasswordDigest } from "@/lib/auth/sha256";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("mahmudulhm2003@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const passwordHash = await saltedPasswordDigest(cleanEmail, password);
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: cleanEmail, passwordHash }),
      });
      const data = await response.json().catch(() => ({ success: false }));
      if (!response.ok || !data.success) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "jj_admin_session",
        JSON.stringify({
          email: data.user?.email || cleanEmail,
          name: "Md Mahmudul Hassan",
          role: "SUPER_ADMIN",
        })
      );
      localStorage.setItem("admin_authenticated", "true");
      window.location.href = "/admin";
    } catch {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#072e23] via-[#0b3b2d] to-[#041d16] flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-emerald-500/20">
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-extrabold">
              🛡️ এন্টারপ্রাইজ সিকিউরিটি হাব
            </span>
            <h1 className="text-2xl font-black text-slate-900">জীবনযত্ন অ্যাডমিন পোর্টাল</h1>
            <p className="text-xs text-slate-500 font-medium">
              সুপার অ্যাডমিন কন্ট্রোল সেন্টারে প্রবেশ করুন
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-bold text-center">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                সুপার অ্যাডমিন ইমেইল
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                অ্যাক্সেস পাসওয়ার্ড
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড লিখুন"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f4c3a] hover:bg-emerald-900 text-white font-black py-3.5 rounded-xl text-sm shadow-lg transition cursor-pointer"
            >
              {loading ? "যাচাই করা হচ্ছে..." : "অ্যাডমিন প্যানেলে প্রবেশ করুন →"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <Link
              href="/"
              className="text-xs font-bold text-slate-500 hover:text-[#0f4c3a] transition"
            >
              ← পাবলিক ওয়েবসাইটে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
