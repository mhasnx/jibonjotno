"use client";

import React, { useState } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useLanguage } from "@/context/LanguageContext";

const POPULAR_TESTS = [
  { id: "1", nameBn: "সিবিসি (CBC with ESR)", nameEn: "Complete Blood Count (CBC)", govPrice: 150, pvtPrice: 450, sampleType: "রক্ত (Blood)", desc: "রক্তস্বল্পতা, ইনফেকশন ও প্লাটিলেট পর্যবেক্ষণের জন্য।" },
  { id: "2", nameBn: "ডেঙ্গু এনএস১ অ্যান্টিজেন ও অ্যান্টিবডি", nameEn: "Dengue NS1 Antigen & IgG/IgM", govPrice: 100, pvtPrice: 350, sampleType: "রক্ত (Blood)", desc: "ডেঙ্গু জ্বরের প্রথম দিন থেকেই দ্রুত সনাক্তকরণের পরীক্ষা।" },
  { id: "3", nameBn: "লিপিড প্রোফাইল (রক্তের চর্বি পরীক্ষা)", nameEn: "Lipid Profile (Fasting)", govPrice: 400, pvtPrice: 1100, sampleType: "রক্ত (১২ ঘণ্টা খালি পেট)", desc: "কোলেস্টেরল, ট্রাইগ্লিসারাইড ও হৃদরোগ ঝুঁকি নির্ণয়।" },
  { id: "4", nameBn: "ডায়াবেটিস এইচবিএওয়ানসি (HbA1c)", nameEn: "HbA1c Glycated Hemoglobin", govPrice: 300, pvtPrice: 850, sampleType: "রক্ত (Blood)", desc: "বিগত ৩ মাসের গড় সুগার নিয়ন্ত্রণের অবস্থা।" },
  { id: "5", nameBn: "থাইরয়েড ফাংশন (TSH)", nameEn: "Thyroid Stimulating Hormone (TSH)", govPrice: 250, pvtPrice: 650, sampleType: "রক্ত (Blood)", desc: "হাইপো বা হাইপার থাইরয়েডিজম রোগ নির্ণয়ে।" },
  { id: "6", nameBn: "ইউরিন আর/ই (Urine R/E)", nameEn: "Urine Routine Examination", govPrice: 60, pvtPrice: 200, sampleType: "প্রস্রাব (Urine)", desc: "মূত্রনালীর ইনফেকশন ও কিডনি সুস্থতা যাচাই।" },
];

export default function LabTestsPage() {
  const { t } = useLanguage();
  const [bookingModal, setBookingModal] = useState<any>(null);
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between font-sans text-slate-800 pb-16 lg:pb-0">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 flex-1 w-full space-y-8">
        <div className="bg-[#0f4c3a] text-white rounded-3xl p-8 md:p-12 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              🏥 Govt vs Private Price Comparison
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold mt-3 mb-2">
              {t("ডায়াগনস্টিক টেস্ট ও হোম স্যাম্পল কালেকশন", "Diagnostic Tests & Home Sample Collection")}
            </h1>
            <p className="text-emerald-100/85 text-xs md:text-sm max-w-xl">
              {t(
                "সকল সাধারণ প্যাথলজিক্যাল টেস্টের সরকারি বনাম বেসরকারি খরচ জানুন এবং ঘরে বসেই স্যাম্পল দেওয়ার বুকিং দিন।",
                "Compare standard hospital laboratory test costs and book verified home phlebotomist sample collection."
              )}
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 p-4 rounded-2xl text-xs space-y-1 shrink-0">
            <div className="font-bold text-amber-300">💉 হোম কালেকশন সুবিধা:</div>
            <div>• রেজিস্টার্ড ল্যাব টেকনিশিয়ান দ্বারা স্যাম্পল সংগ্রহ</div>
            <div>• অনলাইনেই নির্ভুল রিপোর্ট পাওয়ার নিশ্চয়তা</div>
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_TESTS.map((test) => (
            <div
              key={test.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-600/60 transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                  🧪 {test.sampleType}
                </span>
                <h2 className="text-base font-black text-slate-900 mt-2">{test.nameBn}</h2>
                <div className="text-[11px] font-bold text-emerald-800">{test.nameEn}</div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{test.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">সরকারি হাসপাতালে:</span>
                    <span className="font-black text-slate-800">৳ {test.govPrice}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">বেসরকারি ল্যাবে:</span>
                    <span className="font-black text-[#0f4c3a]">৳ {test.pvtPrice}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setBookingModal(test);
                    setConfirmed(false);
                  }}
                  className="w-full bg-[#0f4c3a] hover:bg-emerald-900 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-xs"
                >
                  💉 হোম স্যাম্পল বুক করুন
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase">
                  হোম স্যাম্পল কালেকশন
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{bookingModal.nameBn}</h3>
              </div>
              <button onClick={() => setBookingModal(null)} className="text-slate-400 font-bold text-lg">✕</button>
            </div>

            {confirmed ? (
              <div className="p-4 bg-emerald-50 rounded-2xl text-center space-y-2">
                <div className="text-3xl text-emerald-700">✓</div>
                <h4 className="font-black text-slate-900 text-sm">বুকিং সফলভাবে গ্রহণ করা হয়েছে!</h4>
                <p className="text-xs text-slate-600">আমাদের কল সেন্টার থেকে শীঘ্রই কল দিয়ে সময় ও ঠিকানা নিশ্চিত করা হবে।</p>
                <button
                  onClick={() => setBookingModal(null)}
                  className="w-full bg-[#0f4c3a] text-white py-2 rounded-xl text-xs font-bold mt-2"
                >
                  ঠিক আছে
                </button>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-3 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 mb-1">রোগীর পুরো নাম *</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="নাম লিখুন"
                    className="w-full p-3 rounded-xl border border-slate-200"
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
                  <label className="block text-slate-700 mb-1">ঠিকানা (বাসা / রোড / এলাকা) *</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="পূর্ণাঙ্গ ঠিকানা..."
                    className="w-full p-3 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600">
                  পরীক্ষার খরচ: <strong>৳ {bookingModal.pvtPrice}</strong> + হোম ভিজিট চার্জ <strong>৳ ১৫০</strong>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#0f4c3a] hover:bg-emerald-900 text-white py-3 rounded-xl font-bold transition shadow-md"
                >
                  ✓ স্যাম্পল সংগ্রহের জন্য বুক করুন
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <footer className="bg-[#072e23] text-slate-300 py-8 text-center text-xs mt-12">
        <p className="font-bold text-white text-sm mb-1">জীবনযত্ন (JibonJotno)</p>
        <p className="text-slate-400">&copy; 2026 JibonJotno. All rights reserved.</p>
      </footer>
    </div>
  );
}