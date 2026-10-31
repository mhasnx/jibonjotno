"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = signup({ name, email, phone, address }, password);
    if (success) {
      router.push("/");
    } else {
      setError("Ei email-ti already registered hoyeche! Onno email use korun.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between font-sans text-slate-800">
      <PublicNavbar />

      <main className="max-w-md mx-auto px-4 py-10 flex-1 w-full flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 w-full space-y-6">
          <div className="text-center space-y-1">
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-3 py-1 rounded-full uppercase">
              নতুন ইউজার রেজিস্ট্রেশন
            </span>
            <h1 className="text-2xl font-black text-slate-900 pt-2">সাইন আপ করুন</h1>
            <p className="text-xs text-slate-500">জীবনযত্ন প্ল্যাটফর্মে আপনার ফ্রি একাউন্ট খুলুন</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-bold text-center">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 mb-1">পূর্ণ নাম *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full p-3 rounded-xl border border-slate-200"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">ইমেইল ঠিকানা *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@gmail.com"
                className="w-full p-3 rounded-xl border border-slate-200 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">মোবাইল নম্বর *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full p-3 rounded-xl border border-slate-200 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">ডেলিভারি ঠিকানা *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="বাসা, রোড ও এলাকা..."
                className="w-full p-3 rounded-xl border border-slate-200"
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
                className="w-full p-3 rounded-xl border border-slate-200"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0f4c3a] hover:bg-emerald-900 text-white py-3.5 rounded-2xl font-bold transition shadow-md text-xs mt-2"
            >
              একাউন্ট তৈরি করুন →
            </button>
          </form>

          <div className="text-center pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500">ইতিমধ্যেই একাউন্ট আছে? </span>
            <Link href="/login" className="font-bold text-[#0f4c3a] hover:underline">
              লগইন করুন
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