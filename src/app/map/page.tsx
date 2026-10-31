"use client";

import React, { useState } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useLanguage } from "@/context/LanguageContext";

const HOSPITALS_ICU = [
  { name: "Dhaka Medical College Hospital (DMCH)", division: "Dhaka", addressBn: "বকশীবাজার, ঢাকা", addressEn: "Bakshibazar, Dhaka", icuBedsBn: "৩৫টি বেড (সরকারি)", icuBedsEn: "35 Beds (Govt)", doctorsOnDutyBn: "২৪/৭ ক্রিটিক্যাল কেয়ার টিম", doctorsOnDutyEn: "24/7 Critical Care Team", phone: "02-55165088", mapQuery: "Dhaka+Medical+College+Hospital" },
  { name: "Evercare Hospital Dhaka", division: "Dhaka", addressBn: "বসুন্ধরা আবাসিক এলাকা, ঢাকা", addressEn: "Bashundhara R/A, Dhaka", icuBedsBn: "২৪টি বেড (প্রাইভেট)", icuBedsEn: "24 Beds (Private)", doctorsOnDutyBn: "সিনিয়র আইসিইউ কনসালট্যান্ট", doctorsOnDutyEn: "Senior ICU Consultants", phone: "10678", mapQuery: "Evercare+Hospital+Dhaka" },
  { name: "Square Hospital Limited", division: "Dhaka", addressBn: "পান্থপথ, ঢাকা", addressEn: "Panthapath, Dhaka", icuBedsBn: "২৮টি বেড (প্রাইভেট)", icuBedsEn: "28 Beds (Private)", doctorsOnDutyBn: "২৪/৭ ইমার্জেন্সি ও ট্রমা কেয়ার", doctorsOnDutyEn: "24/7 Emergency & Trauma", phone: "10616", mapQuery: "Square+Hospital+Dhaka" },
  { name: "United Hospital Limited", division: "Dhaka", addressBn: "গুলশান-২, ঢাকা", addressEn: "Gulshan-2, Dhaka", icuBedsBn: "২২টি বেড (কার্ডিয়াক ও নিউরো)", icuBedsEn: "22 Beds (Cardiac/Neuro)", doctorsOnDutyBn: "ক্রিটিক্যাল স্পেশালিস্ট", doctorsOnDutyEn: "Critical Care Specialists", phone: "10666", mapQuery: "United+Hospital+Dhaka" },
  { name: "BIRDEM General Hospital", division: "Dhaka", addressBn: "শাহবাগ, ঢাকা", addressEn: "Shahbag, Dhaka", icuBedsBn: "২০টি বেড (এন্ডোক্রাইন ও কিডনি)", icuBedsEn: "20 Beds (Endocrine & Renal)", doctorsOnDutyBn: "বিশেষায়িত মেডিকেল টিম", doctorsOnDutyEn: "Specialized Medical Team", phone: "02-9661551", mapQuery: "BIRDEM+Hospital+Dhaka" },
  { name: "Chittagong Medical College Hospital", division: "Chattogram", addressBn: "কে.বি. ফজলুল কাদের রোড, চট্টগ্রাম", addressEn: "K.B. Fazlul Kader Rd, Chattogram", icuBedsBn: "২৫টি বেড (সরকারি)", icuBedsEn: "25 Beds (Govt)", doctorsOnDutyBn: "আঞ্চলিক আইসিইউ হাব", doctorsOnDutyEn: "Regional ICU Hub", phone: "031-619400", mapQuery: "Chittagong+Medical+College+Hospital" },
  { name: "Rajshahi Medical College Hospital", division: "Rajshahi", addressBn: "লক্ষ্মীপুর, রাজশাহী", addressEn: "Laxmipur, Rajshahi", icuBedsBn: "২০টি বেড (সরকারি)", icuBedsEn: "20 Beds (Govt)", doctorsOnDutyBn: "২৪/৭ ইমার্জেন্সি আইসিইউ", doctorsOnDutyEn: "24/7 Emergency ICU", phone: "0721-772150", mapQuery: "Rajshahi+Medical+College+Hospital" },
  { name: "MAG Osmani Medical College Hospital", division: "Sylhet", addressBn: "মেডিকেল রোড, সিলেট", addressEn: "Medical Road, Sylhet", icuBedsBn: "১৮টি বেড (সরকারি)", icuBedsEn: "18 Beds (Govt)", doctorsOnDutyBn: "২৪/৭ জরুরি কেয়ার", doctorsOnDutyEn: "24/7 Emergency Care", phone: "0821-713667", mapQuery: "MAG+Osmani+Medical+College+Hospital+Sylhet" },
  { name: "Khulna Medical College Hospital", division: "Khulna", addressBn: "ছোট বয়রা, খুলনা", addressEn: "Choto Boyra, Khulna", icuBedsBn: "১৬টি বেড (সরকারি)", icuBedsEn: "16 Beds (Govt)", doctorsOnDutyBn: "২৪/৭ ক্রিটিক্যাল কেয়ার", doctorsOnDutyEn: "24/7 Critical Care", phone: "041-760350", mapQuery: "Khulna+Medical+College+Hospital" },
];

export default function HospitalIcuMapPage() {
  const [division, setDivision] = useState("All");
  const [selectedMapQuery, setSelectedMapQuery] = useState("Dhaka+Medical+College+Hospital");
  const { t } = useLanguage();

  const hotlines = [
    { name: t("জাতীয় জরুরি সেবা", "National Emergency"), number: "999", note: t("অ্যাম্বুলেন্স, পুলিশ ও ফায়ার সার্ভিস", "Ambulance, Police, Fire") },
    { name: t("স্বাস্থ্য বাতায়ন", "Health Portal Helpline"), number: "16263", note: t("২৪ ঘণ্টা সরকারি ডাক্তার পরামর্শ", "24/7 Free Doctor Advice") },
    { name: t("জাতীয় তথ্য ও সেবা", "National Information"), number: "333", note: t("সরকারি তথ্য ও জরুরি সহায়তা", "Govt. Citizen Support") },
    { name: t("শিশু হেল্পলাইন", "Child Support Line"), number: "1098", note: t("জরুরি শিশু চিকিৎসা ও সুরক্ষা", "Child Emergency Safety") },
  ];

  const divisions = [
    { label: t("সকল বিভাগ", "All Divisions"), value: "All" },
    { label: t("ঢাকা", "Dhaka"), value: "Dhaka" },
    { label: t("চট্টগ্রাম", "Chattogram"), value: "Chattogram" },
    { label: t("রাজশাহী", "Rajshahi"), value: "Rajshahi" },
    { label: t("সিলেট", "Sylhet"), value: "Sylhet" },
    { label: t("খুলনা", "Khulna"), value: "Khulna" },
  ];

  const filtered = division === "All" ? HOSPITALS_ICU : HOSPITALS_ICU.filter((h) => h.division === division);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800 pb-16 lg:pb-0">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-1 w-full space-y-10">
        <section>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
            🚨 {t("বাংলাদেশের সকল জরুরি সেবা হটলাইন", "National Emergency Helplines of Bangladesh")}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hotlines.map((h, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                    {t("24/7 সক্রিয়", "Active 24/7")}
                  </span>
                  <h3 className="text-2xl font-black text-rose-600 mt-1">{h.number}</h3>
                  <p className="font-bold text-slate-900 text-xs">{h.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{h.note}</p>
                </div>
                <a
                  href={`tel:${h.number}`}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shrink-0"
                >
                  📞 {t("কল", "Call")}
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                🏥 {t("সারাদেশের আইসিইউ (ICU) হাসপাতাল ও লাইভ গুগল ম্যাপ", "Nationwide ICU Hospitals & Live Google Maps")}
              </h2>
              <p className="text-xs text-slate-500">
                {t(
                  "যেকোনো হাসপাতালের কার্ডে 'ম্যাপে দেখুন' চাপলে সরাসরি নিচে গুগল ম্যাপে অবস্থান ও নেভিগেশন খুলবে।",
                  "Click 'View on Map' on any card to project live coordinates and directions onto the interactive map."
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {divisions.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDivision(d.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                    division === d.value ? "bg-[#0f4c3a] text-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <iframe
              title="Bangladesh Hospital ICU Map"
              src={`https://www.google.com/maps?q=${selectedMapQuery}&output=embed`}
              className="w-full h-72 md:h-96 rounded-2xl border-0"
              loading="lazy"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((h, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    {h.division} • 🛏️ {t(h.icuBedsBn, h.icuBedsEn)}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base mt-2">{h.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">📍 {t(h.addressBn, h.addressEn)}</p>
                  <p className="text-xs text-slate-600 mt-1">👨‍⚕️ {t(h.doctorsOnDutyBn, h.doctorsOnDutyEn)}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center gap-2">
                  <a href={`tel:${h.phone}`} className="text-xs font-black text-rose-600 hover:underline">
                    📞 {h.phone}
                  </a>
                  <button
                    onClick={() => setSelectedMapQuery(h.mapQuery)}
                    className="bg-[#0f4c3a] hover:bg-emerald-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition"
                  >
                    📍 {t("ম্যাপে দেখুন", "View on Map")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-[#072e23] text-slate-300 py-8 text-center text-xs mt-12">
        <p className="font-bold text-white text-sm mb-1">জীবনযত্ন (JibonJotno)</p>
        <p className="text-slate-400">&copy; 2026 JibonJotno. All rights reserved.</p>
      </footer>
    </div>
  );
}