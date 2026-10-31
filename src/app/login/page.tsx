"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(email, password);
    if (success) {
      router.push("/");
    } else {
      setError("Email othoba password sothik noy! Onugroho kore abar chesta korun.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between font-sans text-slate-800">
      <PublicNavbar />

      <main className="max-w-md mx-auto px-4 py-12 flex-1 w-full flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 w-full space-y-6">
          <div className="text-center space-y-1">
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-3 py-1 rounded-full uppercase">
              জীবনযত্ন ইউজার পোর্টাল
            </span>
            <h1 className="text-2xl font-black text-slate-900 pt-2">লগইন করুন</h1>
            <p className="text-xs text-slate-500">আপনার একাউন্টে প্রবেশ করে সহজে অর্ডার করুন</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-bold text-center">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 mb-1">ইমেইল ঠিকানা *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@gmail.com"
                className="w-full p-3.5 rounded-xl border border-slate-200 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">পাসওয়ার্ড *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3.5 rounded-xl border border-slate-200"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0f4c3a] hover:bg-emerald-900 text-white py-3.5 rounded-2xl font-bold transition shadow-md text-xs"
            >
              লগইন করুন →
            </button>
          </form>

          <div className="text-center pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500">কোনো একাউন্ট নেই? </span>
            <Link href="/signup" className="font-bold text-[#0f4c3a] hover:underline">
              নিবন্ধন করুন (Sign Up)
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-[#072e23] text-slate-300 py-6 text-center text-xs">
        <p>&copy; 2026 JibonJotno. All rights reserved.</p>
      </footer>
    </div>
  );
}