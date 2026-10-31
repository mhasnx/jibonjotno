"use client";

import React, { useState } from "react";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useLanguage } from "@/context/LanguageContext";

export default function MonthlyRefillPage() {
  const { t } = useLanguage();
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [medList, setMedList] = useState("");
  const [cycleDays, setCycleDays] = useState("30");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !medList) return;
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between font-sans text-slate-800 pb-16 lg:pb-0">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-10 flex-1 w-full space-y-8">
        <div className="bg-[#0f4c3a] text-white rounded-3xl p-8 md:p-12 shadow-lg text-center space-y-3">
          <span className="bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            🔄 মাসিক অটো-রিফিল ও পিল রিমাইন্ডার
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold">
            {t("নিয়মিত ওষুধের মেয়াদ শেষ হওয়ার আগেই রিফিল পান", "Monthly Medicine Auto-Refill Subscription")}
          </h1>
          <p className="text-emerald-100/85 text-xs md:text-sm max-w-xl mx-auto">
            {t(
              "ডায়াবেটিস, উচ্চ রক্তচাপ বা থাইরয়েডের ওষুধ শেষ হওয়ার ৫ দিন পূর্বে স্বয়ংক্রিয় এসএমএস পাবেন এবং ক্যাশ অন ডেলিভারিতে বাসায় ওষুধ পৌঁছে যাবে।",
              "Never run out of essential chronic medications. We remind you 5 days in advance and deliver via Cash on Delivery."
            )}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm">
          {saved ? (
            <div className="p-8 bg-emerald-50 rounded-2xl text-center space-y-3">
              <div className="text-4xl text-emerald-700">✓</div>
              <h3 className="text-xl font-black text-slate-900">মাসিক রিফিল শিডিউল সক্রিয় করা হয়েছে!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                আপনার দেওয়া নম্বরে ({phone}) ওষুধ শেষ হওয়ার ৫ দিন আগে এসএমএস পাঠানো হবে। আপনি সম্মতি দিলে ক্যাশ অন ডেলিভারিতে এক ক্লিকে নতুন প্যাক পাঠানো হবে।
              </p>
              <button
                onClick={() => setSaved(false)}
                className="bg-[#0f4c3a] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-xs mt-3"
              >
                নতুন শিডিউল যোগ করুন
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1">রোগীর নাম *</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="যেমন: হাজী আব্দুল করিম"
                    className="w-full p-3.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">মোবাইল নম্বর * (এসএমএস রিমাইন্ডারের জন্য)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full p-3.5 rounded-xl border border-slate-200 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">নিয়মিত সেবনকৃত ওষুধের তালিকা ও ডোজ *</label>
                <textarea
                  rows={3}
                  value={medList}
                  onChange={(e) => setMedList(e.target.value)}
                  placeholder="যেমন: ১. Sergel 20 (প্রতিদিন সকালে ও রাতে খাবারের আগে - ৬০টি)&#10;২. Napa Extend (প্রয়োজনে)"
                  className="w-full p-3.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1">রিফিল চক্র (কয়দিন পর পর প্রয়োজন?)</label>
                  <select
                    value={cycleDays}
                    onChange={(e) => setCycleDays(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-white font-bold"
                  >
                    <option value="15">১৫ দিন পর পর (Half-Month)</option>
                    <option value="30">৩০ দিন পর পর (১ মাস)</option>
                    <option value="60">৬০ দিন পর পর (২ মাস)</option>
                    <option value="90">৯০ দিন পর পর (৩ মাস)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">পেমেন্ট মেথড</label>
                  <input
                    type="text"
                    value="১০০% ক্যাশ অন ডেলিভারি (ওষুধ পেয়ে মূল্য পরিশোধ)"
                    disabled
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0f4c3a] hover:bg-emerald-900 text-white py-3.5 rounded-2xl font-bold transition shadow-md text-sm mt-2"
              >
                ✓ অটো-রিফিল ও এসএমএস অ্যালার্ট চালু করুন
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="bg-[#072e23] text-slate-300 py-8 text-center text-xs mt-12">
        <p className="font-bold text-white text-sm mb-1">জীবনযত্ন (JibonJotno)</p>
        <p className="text-slate-400">&copy; 2026 JibonJotno. All rights reserved.</p>
      </footer>
    </div>
  );
}