"use client";

import React, { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("mahmudulhm2003@gmail.com");
  const [password, setPassword] = useState("admin123");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("jibonjotno_admin_auth", "true");
      localStorage.setItem("jibonjotno_admin_email", email);
      document.cookie = "admin_auth=true; path=/; max-age=86400";
      document.cookie = "admin_token=authenticated_secure_session_token; path=/; max-age=86400";
      window.location.replace("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#082c21] text-white flex flex-col justify-between font-sans">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white text-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-[#0f4c3a]">জীবনযত্ন অ্যাডমিন পোর্টাল</h1>
            <p className="text-xs text-slate-500 font-bold">সুরক্ষিত অ্যাডমিন গেটওয়ে</p>
          </div>

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
              className="w-full py-3.5 rounded-2xl bg-[#0f4c3a] hover:bg-emerald-900 text-white font-bold text-xs transition shadow-lg cursor-pointer"
            >
              অ্যাডমিন প্যানেলে প্রবেশ করুন →
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