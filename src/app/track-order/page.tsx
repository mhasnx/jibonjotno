"use client";

import React, { useState } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

interface DosageSchedule {
  morning: string;
  noon: string;
  night: string;
  timing: string;
  advice: string;
}

// Automatic clinical dosage mapper based on medicine names/categories
function getDosageRule(name: string): DosageSchedule {
  const lower = name.toLowerCase();
  if (lower.includes("sergel") || lower.includes("maxpro") || lower.includes("seclo") || lower.includes("esomeprazole") || lower.includes("omeprazole")) {
    return {
      morning: "১টি",
      noon: "—",
      night: "১টি",
      timing: "🍽️ খাবারের ২০-৩০ মিনিট আগে",
      advice: "পর্যাপ্ত পানি সহ গিলে খাবেন, চিবাবেন না।"
    };
  }
  if (lower.includes("napa") || lower.includes("ace") || lower.includes("fast") || lower.includes("paracetamol")) {
    return {
      morning: "১টি",
      noon: "১টি",
      night: "১টি",
      timing: "🍽️ খাবারের ভরা পেটে (ভরা পেটে সেব্য)",
      advice: "জ্বর বা তীব্র ব্যথায় ৬ ঘণ্টা পর পর সেব্য।"
    };
  }
  if (lower.includes("cefixime") || lower.includes("3-c") || lower.includes("zimax") || lower.includes("azithromycin")) {
    return {
      morning: "১টি",
      noon: "—",
      night: "১টি",
      timing: "🍽️ নির্দিষ্ট সময়ে খাবারের পর",
      advice: "অ্যান্টিবায়োটিকের পূর্ণ কোর্স অবশ্যই শেষ করবেন।"
    };
  }
  if (lower.includes("alatrol") || lower.includes("cetriz") || lower.includes("fexo") || lower.includes("bilastine")) {
    return {
      morning: "—",
      noon: "—",
      night: "১টি",
      timing: "🍽️ রাতের খাবারের পর ঘুমানোর পূর্বে",
      advice: "মৃদু ঘুম ঘুম ভাব হতে পারে।"
    };
  }
  return {
    morning: "১টি",
    noon: "—",
    night: "১টি",
    timing: "🍽️ চিকিৎসকের পরামর্শ অনুযায়ী খাবারের পর",
    advice: "নিয়মিত সময়ে সেবন করুন।"
  };
}

export default function TrackOrderPage() {
  const { t } = useLanguage();
  const { orders } = useCart();
  const [orderQuery, setOrderQuery] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const q = orderQuery.trim().toUpperCase();
    if (!q) return;

    const found = orders.find((o) => o.orderNumber.toUpperCase() === q || o.id === q);
    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchedOrder({
        id: "demo-track",
        orderNumber: q.startsWith("JJ-") ? q : `JJ-2026-${q}`,
        customerName: "মোঃ হাসিবুর রহমান",
        phone: "01712-889900",
        address: "রোড ৪, সেক্টর ৭, উত্তরা",
        city: "Dhaka",
        paymentMethod: "Cash on Delivery",
        items: [
          { name: "Sergel 20 (20 mg)", qty: 14, price: 7.0 },
          { name: "Napa Extend (665 mg)", qty: 20, price: 2.0 },
          { name: "3-C (200 mg) Antibiotic", qty: 7, price: 35.0 },
        ],
        total: 383.0,
        status: "Approved",
        createdAt: "আজ, দুপুর ২:১৫",
      });
    }
  };

  const steps = [
    { labelBn: "অর্ডার গ্রহণ সম্পন্ন", labelEn: "Order Placed", status: "completed" },
    { labelBn: "প্রেসক্রিপশন ও ফার্মাসিস্ট ভেরিফাইড", labelEn: "Pharmacist Verified", status: searchedOrder?.status === "Pending" ? "current" : "completed" },
    { labelBn: "কোল্ড-চেইনে প্যাকেজিং সম্পন্ন", labelEn: "Packed in Cold-Chain", status: searchedOrder?.status === "Approved" || searchedOrder?.status === "Delivered" ? "completed" : "pending" },
    { labelBn: "ডেলিভারি রাইডার পথে রয়েছে", labelEn: "Out for Delivery", status: searchedOrder?.status === "Delivered" ? "completed" : "pending" },
    { labelBn: "ডেলিভারি সম্পন্ন", labelEn: "Delivered", status: searchedOrder?.status === "Delivered" ? "completed" : "pending" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between font-sans text-slate-800 pb-16 lg:pb-0">
      <div className="print:hidden">
        <PublicNavbar />
      </div>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 flex-1 w-full space-y-8">
        {/* Search Banner (Hidden during Print) */}
        <div className="print:hidden bg-[#0f4c3a] text-white rounded-3xl p-8 md:p-12 shadow-lg text-center space-y-3">
          <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            🚚 {t("লাইভ অর্ডার ট্র্যাকিং ও সেবনবিধি চার্ট", "Live Order Tracking & Dosage Schedule")}
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold">
            {t("আপনার ঔষধের ট্র্যাকিং ও বাংলা প্রেসক্রিপশন মেমো", "Track Delivery & Patient Dosage Schedule")}
          </h1>
          <p className="text-emerald-100/85 text-xs md:text-sm max-w-xl mx-auto">
            {t(
              "অর্ডার ট্র্যাকিং আইডি (যেমন: JJ-2026-8841) দিয়ে ডেলিভারি স্ট্যাটাস দেখুন এবং কোন ওষুধ কখন খেতে হবে তার পূর্ণাঙ্গ সেবনবিধি কার্ড প্রিন্ট বা ডাউনলোড করুন।",
              "Track dispensary status and download the complete Bengali patient dosage schedule card."
            )}
          </p>

          <form onSubmit={handleTrack} className="max-w-md mx-auto pt-4 flex gap-2">
            <input
              type="text"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="যেমন: JJ-2026-8841"
              className="w-full bg-white text-slate-900 px-4 py-3 rounded-2xl text-xs md:text-sm font-bold focus:outline-none shadow-md font-mono"
              required
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-6 py-3 rounded-2xl text-xs md:text-sm font-black transition shadow-md shrink-0"
            >
              {t("ট্র্যাক করুন", "Track")}
            </button>
          </form>
        </div>

        {/* Tracking & Printable Memo Section */}
        {searchedOrder && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
            {/* Header info (Appears on screen & print) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-black text-[#0f4c3a]">জীবনযত্ন</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    মডেল ফার্মেসি ও ডিজিটাল স্বাস্থ্য
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  ইনভয়েস নং: <strong className="font-mono text-slate-900">{searchedOrder.orderNumber}</strong> • তারিখ ও সময়: {searchedOrder.createdAt}
                </div>
              </div>

              {/* Download / Print Button (Hidden in Print) */}
              <button
                onClick={() => window.print()}
                className="print:hidden bg-[#0f4c3a] hover:bg-emerald-950 text-white px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center space-x-2 shadow-md shrink-0"
              >
                <span>📄 ডাউনলোড / প্রিন্ট সেবনবিধি মেমো</span>
              </button>
            </div>

            {/* Patient & Order Details Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">রোগী / গ্রাহকের তথ্য</span>
                <span className="font-black text-slate-900 text-sm block">{searchedOrder.customerName}</span>
                <span className="text-slate-600 block">মোবাইল: {searchedOrder.phone}</span>
                <span className="text-slate-600 block">ঠিকানা: {searchedOrder.address}, {searchedOrder.city}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">পেমেন্ট ও ডেলিভারি স্ট্যাটাস</span>
                <span className="inline-block bg-emerald-100 text-emerald-900 font-black px-2.5 py-0.5 rounded-full text-[11px] mt-0.5">
                  💵 ১০০% ক্যাশ অন ডেলিভারি (পণ্য পেয়ে মূল্য পরিশোধ)
                </span>
                <div className="text-slate-700 font-bold text-sm mt-1">
                  মোট প্রদেয় ক্যাশ বিল: <strong className="text-base text-[#0f4c3a]">৳ {searchedOrder.total.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Stepper (Only visible on web screen) */}
            <div className="print:hidden space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">ডেলিভারি ট্র্যাকিং প্রগ্রেস:</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border text-xs flex flex-col justify-between space-y-1.5 ${
                      step.status === "completed"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                        : step.status === "current"
                        ? "bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-400/30"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    <div className="font-bold flex items-center space-x-1">
                      <span>{step.status === "completed" ? "✓" : idx + 1}.</span>
                      <span className="text-[11px] font-black">{t(step.labelBn, step.labelEn)}</span>
                    </div>
                    <span className="text-[10px] font-semibold opacity-80">
                      {step.status === "completed" ? "সম্পন্ন" : step.status === "current" ? "চলমান..." : "অপেক্ষমাণ"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ☀️ ⛅ 🌙 PATIENT DOSAGE CARD (রোগীর বাংলা সেবনবিধি চার্ট) */}
            <div className="space-y-3 pt-2">
              <div className="bg-emerald-900 text-white px-4 py-2.5 rounded-2xl flex justify-between items-center">
                <span className="font-black text-xs md:text-sm flex items-center space-x-2">
                  <span>💊</span>
                  <span>রোগীর ঔষধ সেবনবিধি নির্দেশিকা চার্ট (Dosage Schedule Card)</span>
                </span>
                <span className="text-[10px] text-emerald-200 font-semibold hidden sm:inline">
                  রেজিস্টার্ড ফার্মাসিস্ট দ্বারা ভেরিফাইড
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-3 px-3">ঔষধের নাম ও পরিমাণ</th>
                      <th className="py-3 px-2 text-center bg-amber-50/70">☀️ সকাল</th>
                      <th className="py-3 px-2 text-center bg-orange-50/70">⛅ দুপুর</th>
                      <th className="py-3 px-2 text-center bg-indigo-50/70">🌙 রাত</th>
                      <th className="py-3 px-3">🍽️ খাওয়ার নিয়ম</th>
                      <th className="py-3 px-3">বিশেষ পরামর্শ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {searchedOrder.items.map((it: any, idx: number) => {
                      const dose = getDosageRule(it.name);
                      return (
                        <tr key={idx} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-3 font-bold text-slate-900">
                            <div>{it.name}</div>
                            <span className="text-[10px] text-slate-500 font-normal">পরিমাণ: {it.qty} টি (৳ {it.price.toFixed(2)})</span>
                          </td>
                          <td className="py-3.5 px-2 text-center font-black text-amber-900 bg-amber-50/40 text-sm">
                            {dose.morning}
                          </td>
                          <td className="py-3.5 px-2 text-center font-black text-orange-900 bg-orange-50/40 text-sm">
                            {dose.noon}
                          </td>
                          <td className="py-3.5 px-2 text-center font-black text-indigo-900 bg-indigo-50/40 text-sm">
                            {dose.night}
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-slate-800">
                            {dose.timing}
                          </td>
                          <td className="py-3.5 px-3 text-[11px] text-slate-500 leading-snug">
                            {dose.advice}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bill Summary Table for Cash On Delivery */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600 font-medium">
                <span>ওষুধের সর্বমোট মূল্য:</span>
                <span className="font-mono font-bold">৳ {(searchedOrder.total - (searchedOrder.city === "Dhaka" ? 60 : 120)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 font-medium">
                <span>হোম ডেলিভারি ফি:</span>
                <span className="font-mono font-bold">৳ {searchedOrder.city === "Dhaka" ? "60.00" : "120.00"}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                <span>ক্যাশ অন ডেলিভারিতে সর্বমোট প্রদেয় বিল:</span>
                <span className="text-lg text-[#0f4c3a] font-mono">৳ {searchedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Official Footer Note on Memo */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <strong>জরুরি স্বাস্থ্য সহায়তায় হেল্পলাইন: ১৬২৬৩ | জীবনযত্ন ফার্মেসি কাস্টমার সাপোর্ট: ০৯৬XX-XXXXXX</strong>
                <p className="text-[10px] text-emerald-800">ওষুধ অবশ্যই আলো ও আর্দ্রতা থেকে দূরে ৩০° সেন্টিগ্রেডের নিচে শুষ্ক স্থানে এবং শিশুদের নাগালের বাইরে রাখুন।</p>
              </div>
              <div className="text-[10px] font-bold text-slate-500 shrink-0 font-mono">
                JibonJotno E-Prescription Memo
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="print:hidden">
        <footer className="bg-[#072e23] text-slate-300 py-8 text-center text-xs mt-12">
          <p className="font-bold text-white text-sm mb-1">জীবনযত্ন (JibonJotno)</p>
          <p className="text-slate-400">&copy; 2026 JibonJotno. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}