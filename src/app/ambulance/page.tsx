"use client";

import React, { useState } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useLanguage } from "@/context/LanguageContext";

const SAMPLE_AMBULANCE = [
  { id: "1", type: "ICU ভেন্টিলেটর অ্যাম্বুলেন্স", provider: "ঢাকা সেন্ট্রাল অ্যাম্বুলেন্স সার্ভিস", area: "ঢাকা (সারাদেশে সার্ভিস)", phone: "01711-000111", features: "ভেন্টিলেটর, মনিটর, ডাক্তার ও অক্সিজেন সাপোর্ট" },
  { id: "2", type: "এসি ফ্রিজার অ্যাম্বুলেন্স", provider: "গ্রিন লাইফ অ্যাম্বুলেন্স", area: "ঢাকা ও পার্শ্ববর্তী এলাকা", phone: "01819-222333", features: "মৃতদেহ সংরক্ষণে কোল্ড চেম্বার সহ" },
  { id: "3", type: "জরুরি অক্সিজেন সিলিন্ডার ডেলিভারি", provider: "লাইফ-কেয়ার অক্সিজেন এক্সপ্রেস", area: "ঢাকা (২ ঘণ্টার মধ্যে বাসায় ডেলিভারি)", phone: "01912-444555", features: "সিলিন্ডার, ফ্লো-মিটার, ট্রলি ও মাস্ক সেট" },
  { id: "4", type: "নন-এসি বেসিক অ্যাম্বুলেন্স", provider: "সিটি অ্যাম্বুলেন্স কর্পোরেশন", area: "চট্টগ্রাম মেট্রোপলিটন", phone: "01611-666777", features: "জরুরি রোগী পরিবহনে সার্বক্ষণিক সার্ভিস" },
  { id: "5", type: "ICU লাইফ সাপোর্ট অ্যাম্বুলেন্স", provider: "নর্থ-বেঙ্গল অ্যাম্বুলেন্স", area: "রাজশাহী ও রংপুর বিভাগ", phone: "01715-888999", features: "পোর্টেবল ইসিজি, সাকশন ও ভেন্টিলেটর যুক্ত" },
];

export default function AmbulanceDirectoryPage() {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState("ALL");

  const filtered = filterType === "ALL"
    ? SAMPLE_AMBULANCE
    : filterType === "OXYGEN"
    ? SAMPLE_AMBULANCE.filter((a) => a.type.includes("অক্সিজেন"))
    : SAMPLE_AMBULANCE.filter((a) => a.type.includes("অ্যাম্বুলেন্স"));

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between font-sans text-slate-800 pb-16 lg:pb-0">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex-1 w-full space-y-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-8 md:p-12 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="bg-rose-600 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              🚑 ২৪/৭ জরুরি অ্যাম্বুলেন্স ও অক্সিজেন
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold mt-3 mb-2">
              {t("জরুরি অ্যাম্বুলেন্স ও অক্সিজেন সার্ভিস ডিরেক্টরি", "Emergency Ambulance & Oxygen Directory")}
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-xl">
              {t(
                "আইসিইউ অ্যাম্বুলেন্স, ফ্রিজার গাড়ি বা ঘরে জরুরি অক্সিজেন সিলিন্ডার সরবরাহের জন্য সরাসরি ডায়াল করুন।",
                "Dial verified ICU ambulances, non-AC carriers, and 2-hour home oxygen cylinder delivery services."
              )}
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 p-4 rounded-2xl text-xs space-y-1.5 shrink-0">
            <div className="font-bold text-amber-300">🚨 সরকারি জরুরি হটলাইন:</div>
            <div>• জাতীয় জরুরি সেবা: <strong>৯৯৯ (999)</strong></div>
            <div>• স্বাস্থ্য বাতায়ন: <strong>১৬২৬৩ (16263)</strong></div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filterType === "ALL" ? "bg-[#0f4c3a] text-white" : "bg-white text-slate-700 border border-slate-200"}`}
          >
            সব জরুরি সেবা (All)
          </button>
          <button
            onClick={() => setFilterType("AMBULANCE")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filterType === "AMBULANCE" ? "bg-[#0f4c3a] text-white" : "bg-white text-slate-700 border border-slate-200"}`}
          >
            🚑 অ্যাম্বুলেন্স সার্ভিস
          </button>
          <button
            onClick={() => setFilterType("OXYGEN")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filterType === "OXYGEN" ? "bg-[#0f4c3a] text-white" : "bg-white text-slate-700 border border-slate-200"}`}
          >
            🫁 অক্সিজেন সিলিন্ডার
          </button>
        </div>

        {/* Directory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-600/60 transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full">
                  {item.type}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-2">{item.provider}</h3>
                <p className="text-xs text-emerald-800 font-semibold mt-0.5">📍 {item.area}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">সুবিধাসমূহ: {item.features}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-slate-700">{item.phone}</span>
                <a
                  href={`tel:${item.phone}`}
                  className="bg-[#0f4c3a] hover:bg-emerald-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center space-x-1"
                >
                  <span>📞 সরাসরি কল</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-[#072e23] text-slate-300 py-8 text-center text-xs mt-12">
        <p className="font-bold text-white text-sm mb-1">জীবনযত্ন (JibonJotno)</p>
        <p className="text-slate-400">&copy; 2026 JibonJotno. All rights reserved.</p>
      </footer>
    </div>
  );
}