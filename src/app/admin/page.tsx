"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "jibonjotno_admin_session=; path=/; max-age=0";
    router.push("/admin-login");
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            সুপার অ্যাডমিন কন্ট্রোল প্যানেল
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3">স্বাগতম, অ্যাডমিন মহোদয়</h1>
          <p className="text-emerald-100/80 text-sm mt-1 max-w-xl">
            জীবনযত্ন (JibonJotno) স্বাস্থ্য প্ল্যাটফর্মের রিয়েল-টাইম লাইভ ম্যানেজমেন্ট, ঔষধ ক্যাটালগ, এবং সিকিউরিটি ওভারভিউ।
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href="/"
            className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition"
          >
            🌐 পাবলিক সাইট দেখুন
          </a>
          <button
            onClick={handleLogout}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md"
          >
            🔒 লগআউট (Logout)
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <a href="/admin/medicines" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-600 transition block">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xl">💊</div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">ক্যাটালগ পরিচালনা</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট ভেরিফাইড ঔষধ</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">৩৫,৯৪১+</h3>
        </a>

        <a href="/admin/orders" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-amber-500 transition block">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl text-xl">📦</div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">টেস্ট মোড</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">অর্ডার ও প্রেসক্রিপশন</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">১২ টি</h3>
        </a>

        <a href="/admin/videos" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 transition block">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl text-xl">🎥</div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">সক্রিয়</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">স্বাস্থ্য গাইড ও ভিডিও</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">২০+ গাইড</h3>
        </a>

        <a href="/admin/audit-logs" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-500 transition block">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-700 rounded-xl text-xl">🛡️</div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">সুরক্ষিত</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">সিকিউরিটি অডিট লগ</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">২৪/৭</h3>
        </a>
      </div>

      {/* Main Action Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">⚡ দ্রুত ম্যানেজমেন্ট পোর্টাল</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/admin/medicines" className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition group">
              <div className="text-xl mb-2">💊</div>
              <h3 className="font-bold text-slate-800 group-hover:text-emerald-900 text-sm">ঔষধ ক্যাটালগ ও মূল্য</h3>
              <p className="text-xs text-slate-500 mt-1">নতুন ঔষধ যোগ ও মূল্য আপডেট করুন →</p>
            </a>

            <a href="/admin/orders" className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition group">
              <div className="text-xl mb-2">📦</div>
              <h3 className="font-bold text-slate-800 group-hover:text-emerald-900 text-sm">অর্ডার ও প্রেসক্রিপশন যাচাই</h3>
              <p className="text-xs text-slate-500 mt-1">প্রেসক্রিপশন রিভিউ ও অনুমোদন করুন →</p>
            </a>

            <a href="/admin/videos" className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition group">
              <div className="text-xl mb-2">🎥</div>
              <h3 className="font-bold text-slate-800 group-hover:text-emerald-900 text-sm">ভিডিও ও আর্টিকেল পাইপলাইন</h3>
              <p className="text-xs text-slate-500 mt-1">স্বাস্থ্য সচেতনতামূলক কন্টেন্ট যোগ করুন →</p>
            </a>

            <a href="/admin/audit-logs" className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition group">
              <div className="text-xl mb-2">🛡️</div>
              <h3 className="font-bold text-slate-800 group-hover:text-emerald-900 text-sm">অডিট লগ ও সিকিউরিটি</h3>
              <p className="text-xs text-slate-500 mt-1">অ্যাডমিন অ্যাক্টিভিটি ট্র্যাক করুন →</p>
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">📋 কম্প্লায়েন্স ও ফিচার লক</h2>
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="font-bold text-amber-900 block text-xs">COMMERCE_ENABLED</span>
                <span className="text-xs text-amber-700">বর্তমান স্ট্যাটাস: false (টেস্ট মোড সক্রিয়)</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="font-bold text-emerald-900 block text-xs">RBAC ROUTE GUARD</span>
                <span className="text-xs text-emerald-700">সক্রিয় (/admin-login কুকি দ্বারা সুরক্ষিত)</span>
              </div>
            </div>
          </div>
          <div className="pt-6 mt-6 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-400">JibonJotno Enterprise CMS v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}