"use client";

import React, { useState } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useLanguage } from "@/context/LanguageContext";

export default function PediatricDosePage() {
  const { t } = useLanguage();
  const [weightKg, setWeightKg] = useState<number>(10);
  const [medicineType, setMedicineType] = useState<"paracetamol" | "cefixime" | "cetirizine">("paracetamol");

  // Clinical pediatric dosage calculations
  const calculateDose = () => {
    if (medicineType === "paracetamol") {
      // 15 mg/kg per dose. 120mg/5ml syrup = 24 mg/ml.
      const mgDose = weightKg * 15;
      const mlDose = (mgDose / 24).toFixed(1);
      const spoons = (parseFloat(mlDose) / 5).toFixed(1);
      return {
        medicineName: "প্যারাসিটামল সিরাপ (১২০ মি.গ্রা. / ৫ মি.লি.)",
        standardBrand: "Napa / Ace / Fast Syrup",
        doseText: `প্রতিবারে ${mlDose} মি.লি. (আনুমানিক ${spoons} চা চামচ)`,
        frequency: "জ্বর বা ব্যথায় দিনে সর্বোচ্চ ৩ থেকে ৪ বার (অন্তত ৬ ঘণ্টা বিরতিতে)।",
        warning: "২৪ ঘণ্টায় ৪ বারের বেশি সিরাপ দেওয়া যাবে না। পর্যাপ্ত পানি ও তরল খাওয়ান।",
      };
    } else if (medicineType === "cefixime") {
      // 8 mg/kg daily in 2 divided doses = 4 mg/kg per dose. 100mg/5ml suspension = 20 mg/ml.
      const mgDose = weightKg * 4;
      const mlDose = (mgDose / 20).toFixed(1);
      const spoons = (parseFloat(mlDose) / 5).toFixed(1);
      return {
        medicineName: "সেফিক্সিম পেডিয়াট্রিক সাসপেনশন (১০০ মি.গ্রা. / ৫ মি.লি.)",
        standardBrand: "3-C / Cef-3 Suspension",
        doseText: `প্রতিবারে ${mlDose} মি.লি. (আনুমানিক ${spoons} চা চামচ)`,
        frequency: "১২ ঘণ্টা পরপর দিনে ২ বার খাবারের পর ৭-১০ দিন।",
        warning: "অ্যান্টিবায়োটিক অবশ্যই রেজিস্টার্ড শিশু বিশেষজ্ঞের পরামর্শ অনুযায়ী পূর্ণ কোর্স শেষ করতে হবে।",
      };
    } else {
      // Cetirizine 0.25 mg/kg daily. Syrup 5mg/5ml = 1 mg/ml.
      const mlDose = (weightKg * 0.25).toFixed(1);
      return {
        medicineName: "সিট্রিজিন অ্যালার্জি সিরাপ (৫ মি.গ্রা. / ৫ মি.লি.)",
        standardBrand: "Alatrol / Cetriz Syrup",
        doseText: `প্রতিবারে ${mlDose} মি.লি.`,
        frequency: "রাতে ঘুমানোর আগে দিনে মাত্র ১ বার।",
        warning: "মৃদু ঘুম ঘুম ভাব হতে পারে। ২ বছরের নিচের শিশুদের ক্ষেত্রে চিকিৎসকের পরামর্শ নিন।",
      };
    }
  };

  const result = calculateDose();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between font-sans text-slate-800 pb-16 lg:pb-0">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-10 flex-1 w-full space-y-8">
        <div className="bg-[#0f4c3a] text-white rounded-3xl p-8 md:p-12 shadow-lg text-center space-y-3">
          <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            👶 {t("শিশুদের নিরাপদ ঔষধ মাত্রা ক্যালকুলেটর", "Pediatric Safe Dosage Calculator")}
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold">
            {t("ওজন অনুযায়ী শিশুর সঠিক সিরাপ মাত্রা জানুন", "Accurate Pediatric Syrup Dose by Weight")}
          </h1>
          <p className="text-emerald-100/85 text-xs md:text-sm max-w-xl mx-auto">
            {t(
              "শিশুদের বয়স নয়, ওজন (কেজি) অনুযায়ী সিরাপের সঠিক মিলিমিটার ও চামচের পরিমাপ নিশ্চিত করুন।",
              "Child dosages must strictly follow body weight (kg) to prevent accidental under or overdosing."
            )}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                ১. ঔষধের ধরন নির্বাচন করুন:
              </label>
              <select
                value={medicineType}
                onChange={(e: any) => setMedicineType(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs font-bold bg-white"
              >
                <option value="paracetamol">প্যারাসিটামল জ্বর ও ব্যথার সিরাপ (Napa / Ace)</option>
                <option value="cefixime">সেফিক্সিম অ্যান্টিবায়োটিক সাসপেনশন (3-C / Cef-3)</option>
                <option value="cetirizine">সিট্রিজিন সর্দি ও অ্যালার্জি সিরাপ (Alatrol)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700">
                  ২. শিশুর শরীরের সঠিক ওজন (Weight):
                </label>
                <span className="text-base font-black text-[#0f4c3a] bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                  {weightKg} কেজি (kg)
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={40}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                <span>৩ কেজি (নবজাতক)</span>
                <span>২০ কেজি</span>
                <span>৪০ কেজি</span>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
              নির্দেশিত সেবনমাত্রা (Calculated Dosage)
            </span>
            <h2 className="text-xl font-black text-slate-900">{result.medicineName}</h2>
            <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-xs space-y-2">
              <div className="text-base font-black text-[#0f4c3a]">
                💊 {result.doseText}
              </div>
              <div className="text-xs text-slate-700 font-semibold">
                🕒 সেবনবিধি: {result.frequency}
              </div>
              <div className="text-xs text-rose-700 font-semibold border-t border-slate-100 pt-2">
                ⚠️ সতর্কতা: {result.warning}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#072e23] text-slate-300 py-8 text-center text-xs mt-12">
        <p className="font-bold text-white text-sm mb-1">জীবনযত্ন (JibonJotno)</p>
        <p className="text-slate-400">&copy; 2026 JibonJotno. All rights reserved.</p>
      </footer>
    </div>
  );
}