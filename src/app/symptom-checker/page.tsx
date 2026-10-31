"use client";

import React, { useState } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useLanguage } from "@/context/LanguageContext";

export default function OtherServicesPage() {
  const [activeTab, setActiveTab] = useState<"blood" | "ambulance" | "oxygen" | "bmi">("blood");
  const [weight, setWeight] = useState("65");
  const [heightCm, setHeightCm] = useState("168");
  const { t } = useLanguage();

  const bmiValue = (() => {
    const w = parseFloat(weight);
    const h = parseFloat(heightCm) / 100;
    if (!w || !h || h <= 0) return null;
    return (w / (h * h)).toFixed(1);
  })();

  const bloodBanks = [
    { nameBn: "কোয়ান্টাম ল্যাব", nameEn: "Quantum Lab Blood Bank", areaBn: "শান্তিনগর, ঢাকা", areaEn: "Shantinagar, Dhaka", phone: "01714-010869", statusBn: "২৪ ঘণ্টা খোলা", statusEn: "Open 24/7" },
    { nameBn: "সন্ধানী (ঢাকা মেডিকেল ইউনিট)", nameEn: "Sandhani (DMCH Unit)", areaBn: "বকশীবাজার, ঢাকা", areaEn: "Bakshibazar, Dhaka", phone: "02-9668690", statusBn: "জরুরি ডোনার পুল", statusEn: "Emergency Pool" },
    { nameBn: "রেড ক্রিসেন্ট ব্লাড সেন্টার", nameEn: "Red Crescent Blood Center", areaBn: "মোহাম্মদপুর, ঢাকা", areaEn: "Mohammadpur, Dhaka", phone: "02-9116563", statusBn: "ভেরিফাইড ব্যাংক", statusEn: "Verified Center" },
    { nameBn: "বাঁধন (ঢাকা বিশ্ববিদ্যালয় টিএসসি)", nameEn: "Badhan (TSC, DU Unit)", areaBn: "শাহবাগ, ঢাকা", areaEn: "Shahbag, Dhaka", phone: "01534-982674", statusBn: "স্বেচ্ছাসেবী নেটওয়ার্ক", statusEn: "Volunteer Network" },
  ];

  const ambulances = [
    { nameBn: "জাতীয় জরুরি অ্যাম্বুলেন্স সার্ভিস", nameEn: "National Emergency Ambulance", typeBn: "সরকারি জরুরি পরিবহন", typeEn: "Govt. Toll-Free Dispatch", phone: "999", rateBn: "টোল ফ্রি কল", rateEn: "Toll Free Call" },
    { nameBn: "ঢাকা আইসিইউ ও লাইফ সাপোর্ট", nameEn: "Dhaka ICU & Life Support", typeBn: "ICU & ভেন্টিলেটর যুক্ত", typeEn: "Ventilator & Paramedic", phone: "01711-000000", rateBn: "সারাদেশে ২৪/৭", rateEn: "24/7 Nationwide" },
    { nameBn: "আঞ্জুমান মুফিদুল ইসলাম", nameEn: "Anjuman Mufidul Islam", typeBn: "দাতব্য অ্যাম্বুলেন্স সেবা", typeEn: "Charitable Ambulance", phone: "02-9336611", rateBn: "মানবিক সেবা", rateEn: "Humanitarian Service" },
    { nameBn: "বিভাগীয় জরুরি অ্যাম্বুলেন্স হাব", nameEn: "Divisional Ambulance Hub", typeBn: "এসি ও নন-এসি পরিবহন", typeEn: "AC & Non-AC Transport", phone: "01819-000000", rateBn: "তাৎক্ষণিক ডিসপ্যাচ", rateEn: "Fast Regional Dispatch" },
  ];

  const oxygenProviders = [
    { nameBn: "মেডি-অক্সিজেন হোম সাপ্লাই", nameEn: "Medi-Oxygen Home Delivery", serviceBn: "১.৪ ও ২.০ কিউবিক মিটার সিলিন্ডার ও ফ্লো-মিটার", serviceEn: "1.4 & 2.0 m³ cylinders with flow meter", phone: "01700-112233", deliveryBn: "৬০ মিনিটে হোম ডেলিভারি", deliveryEn: "Within 60 mins" },
    { nameBn: "লাইফলাইন মেডিকেল ইকুইপমেন্ট", nameEn: "Lifeline Medical Equipment", serviceBn: "অক্সিজেন কনসেনট্রেটর (৫ ও ১০ লিটার) ভাড়া ও বিক্রয়", serviceEn: "5L & 10L oxygen concentrators rent/sale", phone: "01900-445566", deliveryBn: "২৪/৭ টেকনিশিয়ান সাপোর্ট", deliveryEn: "24/7 Technician Support" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between font-sans text-slate-800 pb-16 lg:pb-0">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-1 w-full space-y-8">
        <div className="bg-[#0f4c3a] text-white rounded-3xl p-7 md:p-11 shadow-lg">
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full">
            ⚡ {t("অন্যান্য জরুরি স্বাস্থ্য সেবা", "Essential Emergency Health Services")}
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold mt-3 mb-2">
            {t("ব্লাড ব্যাংক, অ্যাম্বুলেন্স ও বিশেষ সেবা ক্যাটাগরি", "Blood Bank, Ambulance & Support Categories")}
          </h1>
          <p className="text-emerald-100/80 text-xs md:text-sm max-w-2xl">
            {t(
              "ব্লাড ব্যাংক, ২৪/৭ লাইফ সাপোর্ট অ্যাম্বুলেন্স, হোম অক্সিজেন ডেলিভারি এবং তাৎক্ষণিক বিএমআই ক্যালকুলেটর।",
              "Verified blood donors, nationwide 24/7 ICU ambulances, medical oxygen cylinders, and interactive BMI analysis."
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab("blood")}
            className={`p-4 rounded-2xl border text-left transition ${
              activeTab === "blood"
                ? "bg-[#0f4c3a] text-white border-[#0f4c3a] shadow-md"
                : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="text-2xl mb-1">🩸</div>
            <div className="font-extrabold text-sm">{t("ব্লাড ব্যাংক ও ডোনার", "Blood Banks")}</div>
            <div className="text-[11px] opacity-80">{t("জরুরি রক্তের সন্ধান", "Verified Donor Groups")}</div>
          </button>

          <button
            onClick={() => setActiveTab("ambulance")}
            className={`p-4 rounded-2xl border text-left transition ${
              activeTab === "ambulance"
                ? "bg-[#0f4c3a] text-white border-[#0f4c3a] shadow-md"
                : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="text-2xl mb-1">🚑</div>
            <div className="font-extrabold text-sm">{t("২৪/৭ অ্যাম্বুলেন্স", "24/7 Ambulances")}</div>
            <div className="text-[11px] opacity-80">{t("আইসিইউ ও পরিবহন", "ICU & Transport")}</div>
          </button>

          <button
            onClick={() => setActiveTab("oxygen")}
            className={`p-4 rounded-2xl border text-left transition ${
              activeTab === "oxygen"
                ? "bg-[#0f4c3a] text-white border-[#0f4c3a] shadow-md"
                : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="text-2xl mb-1">🫁</div>
            <div className="font-extrabold text-sm">{t("অক্সিজেন সাপ্লাই", "Oxygen Cylinders")}</div>
            <div className="text-[11px] opacity-80">{t("হোম ডেলিভারি", "Home Supply")}</div>
          </button>

          <button
            onClick={() => setActiveTab("bmi")}
            className={`p-4 rounded-2xl border text-left transition ${
              activeTab === "bmi"
                ? "bg-[#0f4c3a] text-white border-[#0f4c3a] shadow-md"
                : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="text-2xl mb-1">⚖️</div>
            <div className="font-extrabold text-sm">{t("বিএমআই ক্যালকুলেটর", "BMI Calculator")}</div>
            <div className="text-[11px] opacity-80">{t("স্বাস্থ্যকর ওজন চেক", "Ideal Weight Check")}</div>
          </button>
        </div>

        {activeTab === "blood" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">🩸 {t("ভেরিফাইড ব্লাড ব্যাংক ও ডোনার নেটওয়ার্ক", "Verified Blood Centers & Volunteer Networks")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bloodBanks.map((b, i) => (
                <div key={i} className="p-5 rounded-2xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full">
                      {t(b.statusBn, b.statusEn)}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1">{t(b.nameBn, b.nameEn)}</h3>
                    <p className="text-xs text-slate-500">📍 {t(b.areaBn, b.areaEn)}</p>
                  </div>
                  <a
                    href={`tel:${b.phone}`}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    📞 {b.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "ambulance" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">🚑 {t("জরুরি অ্যাম্বুলেন্স ও লাইফ সাপোর্ট পরিবহন", "Emergency Ambulance & Life Support Transport")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ambulances.map((a, i) => (
                <div key={i} className="p-5 rounded-2xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full">
                      {t(a.rateBn, a.rateEn)}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1">{t(a.nameBn, a.nameEn)}</h3>
                    <p className="text-xs text-slate-500">{t(a.typeBn, a.typeEn)}</p>
                  </div>
                  <a
                    href={`tel:${a.phone}`}
                    className="bg-[#0f4c3a] hover:bg-emerald-900 text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    📞 {a.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "oxygen" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">🫁 {t("মেডিকেল অক্সিজেন সিলিন্ডার হোম সার্ভিস", "Medical Oxygen Delivery & Concentrators")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {oxygenProviders.map((o, i) => (
                <div key={i} className="p-5 rounded-2xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full">
                      {t(o.deliveryBn, o.deliveryEn)}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1">{t(o.nameBn, o.nameEn)}</h3>
                    <p className="text-xs text-slate-500">{t(o.serviceBn, o.serviceEn)}</p>
                  </div>
                  <a
                    href={`tel:${o.phone}`}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    📞 {o.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "bmi" && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs max-w-2xl">
            <h2 className="text-xl font-extrabold text-slate-900 mb-4">⚖️ {t("বিএমআই (BMI) ও স্বাস্থ্যকর ওজন ক্যালকুলেটর", "BMI & Ideal Weight Calculator")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">{t("আপনার ওজন (কেজি - KG)", "Your Weight (KG)")}</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">{t("আপনার উচ্চতা (সেন্টিমিটার - CM)", "Your Height (CM)")}</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-bold"
                />
              </div>
            </div>
            {bmiValue && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-xs text-emerald-800 font-bold block">{t("আপনার বর্তমান বিএমআই স্কোর:", "Your Current BMI Score:")}</span>
                  <span className="text-2xl font-black text-[#0f4c3a]">{bmiValue}</span>
                </div>
                <div className="text-xs font-bold text-emerald-950">
                  {parseFloat(bmiValue) < 18.5
                    ? t("কম ওজন (পুষ্টিকর খাবার প্রয়োজন)", "Underweight (Nutritional boost recommended)")
                    : parseFloat(bmiValue) <= 24.9
                    ? t("✓ স্বাভাবিক ও স্বাস্থ্যকর ওজন", "✓ Normal & Healthy Weight")
                    : t("অতিরিক্ত ওজন (নিয়মিত শরীরচর্চা প্রয়োজন)", "Overweight (Regular physical activity recommended)")}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-[#072e23] text-slate-300 py-8 text-center text-xs mt-12">
        <p className="font-bold text-white text-sm mb-1">জীবনযত্ন (JibonJotno)</p>
        <p className="text-slate-400">&copy; 2026 JibonJotno. All rights reserved.</p>
      </footer>
    </div>
  );
}