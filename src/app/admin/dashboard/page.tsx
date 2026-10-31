"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#071310] flex items-center justify-center text-white font-sans">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-300">অ্যাডমিন কন্ট্রোল সেন্টারে রিডাইরেক্ট করা হচ্ছে...</p>
      </div>
    </div>
  );
}