"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useLanguage } from "@/context/LanguageContext";

const GENERIC_COMPARISONS = [
  {
    generic: "Esomeprazole (20 mg)",
    keyword: "Esomeprazole",
    useBn: "গ্যাস্ট্রিক আলসার ও এসিডিটি নিয়ন্ত্রণ",
    useEn: "Gastric ulcer & acid reflux management",
    brands: [
      { name: "Sergel 20", company: "Healthcare Pharma", form: "Capsule", price: 7.00 },
      { name: "Maxpro 20", company: "Renata Limited", form: "Tablet", price: 7.00 },
      { name: "Nexum 20", company: "Square Pharma", form: "Capsule", price: 7.00 },
      { name: "Esonix 20", company: "Incepta Pharma", form: "Tablet", price: 6.00 },
      { name: "Opton 20", company: "Beximco Pharma", form: "Capsule", price: 6.50 },
    ],
  },
  {
    generic: "Cefixime Trihydrate (200 mg)",
    keyword: "Cefixime",
    useBn: "টাইফয়েড ও ব্যাকটেরিয়াজনিত সংক্রমণ (অ্যান্টিবায়োটিক)",
    useEn: "Typhoid & bacterial infections (Antibiotic)",
    brands: [
      { name: "Cef-3", company: "Square Pharma", form: "Capsule", price: 35.00 },
      { name: "3-C", company: "Edruc Limited", form: "Capsule", price: 35.00 },
      { name: "Denvar 200", company: "Healthcare Pharma", form: "Capsule", price: 35.00 },
      { name: "Orcef 200", company: "Incepta Pharma", form: "Capsule", price: 32.00 },
      { name: "T-Cef", company: "Opsonin Pharma", form: "Capsule", price: 30.00 },
    ],
  },
  {
    generic: "Paracetamol (500 mg)",
    keyword: "Paracetamol",
    useBn: "জ্বর, মাথাব্যথা ও সাধারণ ব্যথা নিরাময়",
    useEn: "Fever, headache & general pain relief",
    brands: [
      { name: "Napa", company: "Beximco Pharma", form: "Tablet", price: 1.20 },
      { name: "Ace", company: "Square Pharma", form: "Tablet", price: 1.20 },
      { name: "Fast", company: "ACME Laboratories", form: "Tablet", price: 1.20 },
      { name: "Reset", company: "Incepta Pharma", form: "Tablet", price: 1.15 },
      { name: "Pyralgin", company: "Renata Limited", form: "Tablet", price: 1.20 },
    ],
  },
  {
    generic: "Azithromycin (500 mg)",
    keyword: "Azithromycin",
    useBn: "শ্বাসনালী ও গলার ইনফেকশন",
    useEn: "Respiratory tract & throat infections",
    brands: [
      { name: "Zimax 500", company: "Square Pharma", form: "Tablet", price: 35.00 },
      { name: "Azithrocin", company: "Beximco Pharma", form: "Tablet", price: 35.00 },
      { name: "Tridosil", company: "Incepta Pharma", form: "Tablet", price: 32.00 },
      { name: "Azin", company: "ACME Laboratories", form: "Tablet", price: 35.00 },
    ],
  },
  {
    generic: "Calcium + Vitamin D3",
    keyword: "Vitamin",
    useBn: "হাড় ক্ষয় ও ক্যালসিয়াম ঘাটতি",
    useEn: "Osteoporosis & calcium deficiency",
    brands: [
      { name: "Calbo-D", company: "Square Pharma", form: "Tablet", price: 7.00 },
      { name: "Ostocal D", company: "Incepta Pharma", form: "Tablet", price: 7.00 },
      { name: "Coralcal-D", company: "Healthcare Pharma", form: "Tablet", price: 8.00 },
      { name: "Sandocal D", company: "Beximco Pharma", form: "Tablet", price: 6.50 },
    ],
  },
];

function CompareContent() {
  const searchParams = useSearchParams();
  const [selectedGeneric, setSelectedGeneric] = useState(GENERIC_COMPARISONS[0]);
  const { t } = useLanguage();

  useEffect(() => {
    const g = searchParams.get("generic");
    if (g) {
      const found = GENERIC_COMPARISONS.find(
        (item) =>
          item.generic.toLowerCase().includes(g.toLowerCase()) ||
          item.keyword.toLowerCase().includes(g.toLowerCase())
      );
      if (found) setSelectedGeneric(found);
    }
  }, [searchParams]);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-1 w-full">
      <div className="bg-[#0f4c3a] text-white rounded-3xl p-7 md:p-10 mb-8 shadow-md">
        <span className="text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full">
          ⚖️ {t("স্মার্ট জেনেরিক দামের তুলনা", "Smart Generic Price Comparison")}
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold mt-3 mb-2">
          {t("ঔষধের দামের তুলনা ও বিকল্প ব্র্যান্ড", "Medicine Price Comparison & Alternatives")}
        </h1>
        <p className="text-emerald-100/80 text-xs md:text-sm max-w-2xl">
          {t(
            "একই জেনেরিক উপাদানের বিভিন্ন কোম্পানির ঔষধের বাজারমূল্য তুলনা করে আপনার সাশ্রয়ী ও নির্ভরযোগ্য বিকল্প বেছে নিন।",
            "Compare market prices across leading brands sharing identical generics to pick the most economical choice."
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 h-fit">
          <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider mb-2">
            {t("জেনেরিক নির্বাচন করুন", "Select Generic Formula")}
          </h2>
          {GENERIC_COMPARISONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedGeneric(item)}
              className={`w-full text-left p-4 rounded-xl border transition ${
                selectedGeneric.generic === item.generic
                  ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="font-bold text-sm">{item.generic}</div>
              <div className="text-xs text-slate-500 mt-0.5">{t(item.useBn, item.useEn)}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-4 mb-4 gap-2">
            <div>
              <h3 className="text-xl font-black text-slate-900">{selectedGeneric.generic}</h3>
              <p className="text-xs text-slate-500">{t("কাজ:", "Indication:")} {t(selectedGeneric.useBn, selectedGeneric.useEn)}</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full w-fit">
              {t("সবচেয়ে সাশ্রয়ী দাম হাইলাইট করা হয়েছে", "Lowest Price Highlighted")}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                  <th className="py-3 px-4">{t("ব্র্যান্ডের নাম", "Brand Name")}</th>
                  <th className="py-3 px-4">{t("কোম্পানি", "Company")}</th>
                  <th className="py-3 px-4">{t("ধরন", "Dosage Form")}</th>
                  <th className="py-3 px-4 text-right">{t("প্রতি পিস মূল্য", "Unit Price")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedGeneric.brands.map((b, i) => {
                  const minPrice = Math.min(...selectedGeneric.brands.map((x) => x.price));
                  const isCheapest = b.price === minPrice;
                  return (
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {b.name}
                        {isCheapest && (
                          <span className="ml-2 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {t("সাশ্রয়ী", "Cheapest")}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{b.company}</td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">{b.form}</td>
                      <td className="py-3.5 px-4 text-right font-black text-[#0f4c3a]">
                        ৳ {b.price.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PriceComparisonPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800 pb-16 lg:pb-0">
      <PublicNavbar />
      <Suspense fallback={<div className="p-12 text-center text-sm">লোড হচ্ছে...</div>}>
        <CompareContent />
      </Suspense>
      <footer className="bg-[#072e23] text-slate-300 py-8 text-center text-xs mt-12">
        <p className="font-bold text-white text-sm mb-1">জীবনযত্ন (JibonJotno)</p>
        <p className="text-slate-400">&copy; 2026 JibonJotno. All rights reserved.</p>
      </footer>
    </div>
  );
}