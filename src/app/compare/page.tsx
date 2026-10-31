"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { MASTER_CATALOG, CatalogItem } from "@/data/medicinesCatalog";
import MedicinePackagingModal from "@/components/medicines/MedicinePackagingModal";

function PriceComparisonContent() {
  const searchParams = useSearchParams();
  const initialGeneric = searchParams.get("generic") || "";
  const { t } = useLanguage();
  const { addToCart } = useCart();

  const [catalog, setCatalog] = useState<CatalogItem[]>(MASTER_CATALOG);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialGeneric);
  const [selectedGeneric, setSelectedGeneric] = useState(
    initialGeneric || "Esomeprazole Magnesium Trihydrate"
  );
  const [selectedMedModal, setSelectedMedModal] = useState<CatalogItem | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/data/all_medicines.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCatalog([...MASTER_CATALOG, ...data]);
        } else {
          return fetch("/api/medicines?limit=500")
            .then((res) => (res.ok ? res.json() : null))
            .then((api) => {
              if (api && Array.isArray(api.items)) {
                setCatalog(api.items);
              }
            });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Popular Generics list extracted dynamically from 35,941+ catalog
  const genericGroups = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of catalog) {
      if (!item.generic) continue;
      map.set(item.generic, (map.get(item.generic) || 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40);
  }, [catalog]);

  // Matched medicines for comparison
  const comparedMedicines = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    let list = catalog;

    if (q) {
      // If user searches a brand name (e.g. Sergel), find its generic first so all alternatives appear!
      const exactBrand = catalog.find((m) => (m.brand || "").toLowerCase() === q);
      const targetGen = exactBrand ? exactBrand.generic.toLowerCase() : q;

      list = catalog.filter(
        (m) =>
          (m.generic || "").toLowerCase().includes(targetGen) ||
          (m.brand || "").toLowerCase().includes(q)
      );
    } else if (selectedGeneric) {
      list = catalog.filter(
        (m) => (m.generic || "").toLowerCase() === selectedGeneric.toLowerCase()
      );
    }

    return [...list]
      .sort((a, b) => (parseFloat(a.priceTk) || 0) - (parseFloat(b.priceTk) || 0))
      .slice(0, 120);
  }, [catalog, searchTerm, selectedGeneric]);

  const highestPrice = useMemo(() => {
    if (comparedMedicines.length === 0) return 0;
    return Math.max(...comparedMedicines.map((m) => parseFloat(m.priceTk) || 0));
  }, [comparedMedicines]);

  const lowestPrice = useMemo(() => {
    if (comparedMedicines.length === 0) return 0;
    return Math.min(...comparedMedicines.map((m) => parseFloat(m.priceTk) || 0));
  }, [comparedMedicines]);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex-1 w-full space-y-6">
      {toast && (
        <div className="fixed bottom-8 right-6 bg-[#0f4c3a] text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-black z-50">
          ✓ {toast}
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#0f4c3a] to-[#06231b] text-white rounded-3xl p-6 md:p-9 shadow-xl space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase">
              35,941+ GENERIC & BRAND PRICE ENGINE
            </span>
            <h1 className="text-2xl md:text-3xl font-black mt-2">
              {t("ওষুধের দামের তুলনা ও সাশ্রয়ী বিকল্প (Price Comparison)", "Medicine Price Comparison & Generic Alternatives")}
            </h1>
            <p className="text-xs text-emerald-100 mt-1">
              একই জেনেরিকের বিভিন্ন কোম্পানির ওষুধের দাম তুলনা করে সাশ্রয়ী ও মানসম্মত বিকল্প বেছে নিন
            </p>
          </div>
          <div className="bg-white/10 border border-white/15 px-4 py-2.5 rounded-2xl text-xs">
            মোট সংযুক্ত ওষুধ: <strong className="text-amber-300 font-mono">{catalog.length.toLocaleString()}</strong>
          </div>
        </div>

        {/* Search Input */}
        <div className="max-w-3xl bg-white rounded-2xl p-1.5 flex items-center shadow-lg">
          <span className="pl-3.5 text-slate-400">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="যেকোনো ওষুধের ব্র্যান্ড বা জেনেরিক নাম লিখুন (যেমন: Sergel, Napa, Cefixime, Omeprazole)..."
            className="w-full px-3 py-2.5 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-3 text-xs font-black text-slate-400 hover:text-rose-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Generic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {genericGroups.slice(0, 14).map(([genName, count]) => (
            <button
              key={genName}
              onClick={() => {
                setSearchTerm("");
                setSelectedGeneric(genName);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 cursor-pointer transition ${
                selectedGeneric === genName && !searchTerm
                  ? "bg-amber-400 text-slate-950 font-black"
                  : "bg-white/10 text-emerald-100 hover:bg-white/20"
              }`}
            >
              {genName} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase">তুলনাকৃত ব্র্যান্ড সংখ্যা</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            {comparedMedicines.length} টি ব্র্যান্ড
          </div>
        </div>
        <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-200">
          <span className="text-[11px] font-bold text-emerald-800 uppercase">সর্বনিম্ন ইউনিট মূল্য (Lowest)</span>
          <div className="text-2xl font-black text-[#0f4c3a] font-mono mt-1">
            ৳ {lowestPrice.toFixed(2)}
          </div>
        </div>
        <div className="bg-amber-50 p-5 rounded-3xl border border-amber-200">
          <span className="text-[11px] font-bold text-amber-900 uppercase">সর্বোচ্চ ইউনিট মূল্য (Highest)</span>
          <div className="text-2xl font-black text-amber-800 font-mono mt-1">
            ৳ {highestPrice.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Comparison Results List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
        <h2 className="text-base sm:text-lg font-black text-slate-900">
          📊 মূল্য তুলনা তালিকা (কম দাম থেকে বেশি দাম অনুসারে সাজানো)
        </h2>

        {loading && comparedMedicines.length === 0 ? (
          <div className="py-12 text-center text-sm font-bold text-slate-500">
            ৩৫,৯৪১+ ওষুধের ডাটাবেজ থেকে দামের তুলনা লোড হচ্ছে...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparedMedicines.map((med, index) => {
              const price = parseFloat(med.priceTk) || 0;
              const savingsPct =
                highestPrice > price && highestPrice > 0
                  ? Math.round(((highestPrice - price) / highestPrice) * 100)
                  : 0;

              return (
                <div
                  key={med.id}
                  onClick={() => setSelectedMedModal(med)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-[#0f4c3a] bg-slate-50/50 hover:bg-white transition flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0f4c3a] to-emerald-800 text-white flex flex-col items-center justify-center shrink-0 font-black text-[10px] shadow-xs">
                      <span>#{index + 1}</span>
                      <span className="text-[8px] text-amber-300">{med.dosageForm}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-black text-slate-900 truncate group-hover:text-[#0f4c3a]">
                          {med.brand} <span className="text-xs text-slate-500">{med.strength}</span>
                        </h3>
                        {savingsPct > 0 && (
                          <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                            {savingsPct}% সাশ্রয়
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-emerald-800 truncate">🧬 {med.generic}</p>
                      <p className="text-[11px] text-slate-500 truncate">🏢 {med.company}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                    <div className="text-base font-black text-[#0f4c3a] font-mono">
                      ৳ {price.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      পাতা (10): ৳{(price * 10).toFixed(2)}
                    </div>
                    <button
                      onClick={() => {
                        addToCart({
                          id: med.id,
                          name: `${med.brand} (${med.strength})`,
                          generic: med.generic,
                          company: med.company,
                          price,
                          requiresRx: med.requiresRx,
                          dosageForm: med.dosageForm,
                        });
                        setToast(`${med.brand} ব্যাগে যুক্ত হয়েছে!`);
                        setTimeout(() => setToast(""), 2500);
                      }}
                      className="bg-[#0f4c3a] hover:bg-emerald-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      + অর্ডার
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedMedModal && (
        <MedicinePackagingModal
          medicine={selectedMedModal}
          allMedicines={catalog}
          onClose={() => setSelectedMedModal(null)}
          onSelectAlternative={(alt) => setSelectedMedModal(alt)}
        />
      )}
    </main>
  );
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-[#f4f7f6] flex flex-col justify-between font-sans text-slate-800">
      <PublicNavbar />
      <Suspense fallback={<div className="p-12 text-center">Loading Price Comparison Engine...</div>}>
        <PriceComparisonContent />
      </Suspense>
    </div>
  );
}