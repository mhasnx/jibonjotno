"use client";

import React, { useState } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("mahmudulhm2003@gmail.com");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("jibonjotno_admin_auth", "true");
          localStorage.setItem("jibonjotno_admin_email", email);
          document.cookie = "admin_auth=true; path=/; max-age=86400";
          window.location.href = "/admin/dashboard";
        }
      } else {
        setLoading(false);
        setError(data.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়!");
      }
    } catch (err) {
      setLoading(false);
      setError("সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="min-h-screen bg-[#082c21] text-white flex flex-col justify-between font-sans">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white text-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-[#0f4c3a]">জীবনযত্ন অ্যাডমিন পোর্টাল</h1>
            <p className="text-xs text-slate-500 font-bold">সুরক্ষিত অ্যাডমিন গেটওয়ে</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3.5 rounded-2xl text-center">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                সুপার অ্যাডমিন ইমেইল
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0f4c3a]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                অ্যাক্সেস পাসওয়ার্ড
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0f4c3a]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#0f4c3a] hover:bg-emerald-900 text-white font-bold text-xs transition shadow-lg cursor-pointer disabled:opacity-50"
            >
              {loading ? "যাচাই করা হচ্ছে..." : "অ্যাডমিন প্যানেলে প্রবেশ করুন →"}
            </button>
          </form>

          <div className="text-center">
            <a href="/" className="text-xs font-bold text-slate-500 hover:text-[#0f4c3a]">
              ← পাবলিক ওয়েবসাইটে ফিরে যান
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}