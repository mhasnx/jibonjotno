"use client";

import React, { useState } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useLanguage } from "@/context/LanguageContext";

const SAMPLE_DONORS = [
  { id: "1", name: "তানভীর আহমেদ", group: "A+", location: "ঢাকা (মিরপুর-১০)", phone: "01711-223344", lastDonation: "৪ মাস আগে", available: true },
  { id: "2", name: "মাহমুদুল হাসান", group: "O+", location: "ঢাকা (ধানমন্ডি)", phone: "01819-556677", lastDonation: "৫ মাস আগে", available: true },
  { id: "3", name: "সাকিব চৌধুরী", group: "B+", location: "চট্টগ্রাম (জিইসি মোড়)", phone: "01912-334455", lastDonation: "৩ মাস আগে", available: true },
  { id: "4", name: "ফারহানা রহমান", group: "AB+", location: "ঢাকা (উত্তরা)", phone: "01611-998877", lastDonation: "৬ মাস আগে", available: true },
  { id: "5", name: "আরিফুল ইসলাম", group: "O- (Rare)", location: "সিলেট (আম্বরখানা)", phone: "01715-443322", lastDonation: "৪ মাস আগে", available: true },
  { id: "6", name: "মেহেদী হাসান", group: "A- (Rare)", location: "রাজশাহী (জিরো পয়েন্ট)", phone: "01817-112233", lastDonation: "৫ মাস আগে", available: true },
];

export default function BloodBankPage() {
  const { t } = useLanguage();
  const [selectedGroup, setSelectedGroup] = useState("ALL");
  const [requestModal, setRequestModal] = useState(false);
  const [requestConfirmed, setRequestConfirmed] = useState(false);

  const groups = ["ALL", "A+", "A- (Rare)", "B+", "B- (Rare)", "O+", "O- (Rare)", "AB+", "AB- (Rare)"];

  const filtered = selectedGroup === "ALL"
    ? SAMPLE_DONORS
    : SAMPLE_DONORS.filter((d) => d.group.startsWith(selectedGroup.split(" ")[0]));

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between font-sans text-slate-800 pb-16 lg:pb-0">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex-1 w-full space-y-8">
        <div className="bg-gradient-to-br from-rose-700 via-rose-800 to-red-950 text-white rounded-3xl p-8 md:p-12 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              🩸 জরুরি রক্তসেবা ও রক্তদাতা নেটওয়ার্ক
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold mt-3 mb-2">
              {t("রক্তের গ্রুপ অনুযায়ী রক্তদাতা খুঁজুন", "Emergency Blood Donor Network")}
            </h1>
            <p className="text-rose-100/90 text-xs md:text-sm max-w-xl">
              {t(
                "মুহূর্তেই আপনার রক্তের গ্রুপের ভেরিফাইড রক্তদাতাদের সাথে সরাসরি ফোনে যোগাযোগ করুন বা জরুরি রক্তের আবেদন পোস্ট করুন।",
                "Connect instantly with verified donors in your division or broadcast urgent blood requisitions."
              )}
            </p>
          </div>

          <button
            onClick={() => {
              setRequestModal(true);
              setRequestConfirmed(false);
            }}
            className="bg-white text-rose-800 hover:bg-rose-50 px-6 py-3.5 rounded-2xl text-xs md:text-sm font-black transition shadow-md shrink-0"
          >
            📢 জরুরি রক্তের অনুরোধ পোস্ট করুন
          </button>
        </div>

        {/* Blood Group Filter Buttons */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase px-1">
            রক্তের গ্রুপ বাছাই করুন (Select Blood Group):
          </div>
          <div className="flex flex-wrap gap-2">
            {groups.map((grp) => (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  selectedGroup === grp
                    ? "bg-rose-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700"
                }`}
              >
                {grp}
              </button>
            ))}
          </div>
        </div>

        {/* Donors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((donor) => (
            <div
              key={donor.id}
              className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-rose-400 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xl font-black text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-2xl">
                    {donor.group}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ প্রস্তুত (Available)
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-base mt-2">{donor.name}</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">📍 {donor.location}</p>
                <p className="text-[11px] text-slate-400 mt-1">সর্বশেষ রক্তদান: {donor.lastDonation}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-slate-700">{donor.phone}</span>
                <a
                  href={`tel:${donor.phone}`}
                  className="bg-rose-700 hover:bg-rose-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center space-x-1"
                >
                  <span>📞 কল করুন</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Emergency Request Modal */}
      {requestModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 px-3 py-0.5 rounded-full">
                  লাইভ রক্তের রিকোয়েস্ট
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">জরুরি রক্তের আবেদন</h3>
              </div>
              <button onClick={() => setRequestModal(false)} className="text-slate-400 font-bold text-lg">✕</button>
            </div>

            {requestConfirmed ? (
              <div className="p-5 bg-rose-50 rounded-2xl text-center space-y-2">
                <div className="text-3xl text-rose-700">✓</div>
                <h4 className="font-black text-slate-900 text-sm">আবেদনটি নেটওয়ার্কে সম্প্রচারিত হয়েছে!</h4>
                <p className="text-xs text-slate-600">উক্ত গ্রুপের নিবন্ধিত রক্তদাতাদের মোবাইলে তাৎক্ষণিক এসএমএস নোটিফিকেশন পাঠানো হচ্ছে।</p>
                <button
                  onClick={() => setRequestModal(false)}
                  className="w-full bg-rose-700 text-white py-2 rounded-xl text-xs font-bold mt-2"
                >
                  ঠিক আছে
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setRequestConfirmed(true); }} className="space-y-3 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 mb-1">রক্তের গ্রুপ ও পরিমাণ (ব্যাগ) *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select className="p-3 rounded-xl border border-slate-200 bg-white font-bold">
                      <option>A+</option>
                      <option>B+</option>
                      <option>O+</option>
                      <option>AB+</option>
                      <option>O-</option>
                      <option>A-</option>
                      <option>B-</option>
                      <option>AB-</option>
                    </select>
                    <input type="text" placeholder="যেমন: ২ ব্যাগ" className="p-3 rounded-xl border border-slate-200" required />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">হাসপাতালের নাম ও ঠিকানা *</label>
                  <input type="text" placeholder="যেমন: ঢাকা মেডিকেল কলেজ হাসপাতাল" className="w-full p-3 rounded-xl border border-slate-200" required />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">যোগাযোগের মোবাইল নম্বর *</label>
                  <input type="tel" placeholder="01XXXXXXXXX" className="w-full p-3 rounded-xl border border-slate-200 font-mono" required />
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-700 hover:bg-rose-800 text-white py-3 rounded-xl font-bold transition shadow-md"
                >
                  📢 অবিলম্বে রক্তদাতা খুঁজুন
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