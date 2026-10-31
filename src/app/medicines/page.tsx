"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { MASTER_CATALOG, CatalogItem } from "@/data/medicinesCatalog";
import MedicinePackagingModal from "@/components/medicines/MedicinePackagingModal";
import VoiceSearchModal from "@/components/features/VoiceSearchModal";
import { normalizeVoiceQuery } from "@/lib/medical/voiceSearchHelper";
import { MedicineCardSkeleton } from "@/components/ui/Skeleton";
import StructuredData from "@/components/seo/StructuredData";

function MedicineThumb({ item }: { item: CatalogItem }) {
  const [imgErr, setImgErr] = useState(false);

  const badgeColors: Record<string, string> = {
    Gastric: "from-emerald-700 to-teal-900",
    Fever: "from-amber-600 to-orange-800",
    Pain: "from-rose-600 to-red-900",
    Antibiotic: "from-indigo-600 to-blue-950",
    Allergy: "from-cyan-600 to-sky-900",
    Vitamin: "from-teal-600 to-emerald-900",
    Cardiac: "from-red-600 to-rose-950",
    Diabetes: "from-purple-600 to-indigo-950",
    Equipment: "from-slate-700 to-slate-950",
  };

  const bg = badgeColors[item.category] || "from-emerald-700 to-teal-900";

  if (item.imageUrl && !imgErr && !item.imageUrl.includes("scribd")) {
    return (
      <div className="w-20 h-20 rounded-2xl border border-slate-200/80 bg-white p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
        <img
          src={item.imageUrl}
          alt={item.brand}
          onError={() => setImgErr(true)}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${bg} text-white p-2 flex flex-col justify-between shrink-0 shadow-sm select-none border border-white/15`}
    >
      <div className="flex justify-between items-center text-[8px] font-black uppercase opacity-80">
        <span className="truncate">{item.dosageForm}</span>
        <span>3D</span>
      </div>
      <div className="text-center my-auto">
        <div className="text-[11px] font-black leading-tight truncate">{item.brand}</div>
        <div className="text-[8px] text-emerald-200 font-bold truncate">{item.strength}</div>
      </div>
      <div className="text-[7px] text-center bg-black/25 rounded py-0.5 font-mono truncate">
        {item.company.split(" ")[0]}
      </div>
    </div>
  );
}

function MedicinesCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const { t } = useLanguage();
  const { addToCart } = useCart();

  const [catalog, setCatalog] = useState<CatalogItem[]>(MASTER_CATALOG);
  const [isLoadingExtended, setIsLoadingExtended] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [addedToast, setAddedToast] = useState("");

  const itemsPerPage = 24;

  useEffect(() => {
    const qParam = searchParams.get("q");
    if (qParam !== null) {
      setSearchQuery(qParam);
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    setIsLoadingExtended(true);
    fetch("/data/all_medicines.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCatalog([...MASTER_CATALOG, ...data]);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingExtended(false));
  }, []);

  const categories = [
    { id: "ALL", bn: "\u09B8\u09AC \u0995\u09CD\u09AF\u09BE\u099F\u09BE\u0997\u09B0\u09BF", en: "All Items" },
    { id: "Gastric", bn: "\u0997\u09CD\u09AF\u09BE\u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0995", en: "Gastric" },
    { id: "Fever", bn: "\u099C\u09CD\u09AC\u09B0 \u0993 \u09AC\u09CD\u09AF\u09A5\u09BE", en: "Fever & Pain" },
    { id: "Antibiotic", bn: "\u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u09BF\u09AC\u09BE\u09DF\u09CB\u099F\u09BF\u0995", en: "Antibiotics" },
    { id: "Allergy", bn: "\u0985\u09CD\u09AF\u09BE\u09B2\u09BE\u09B0\u09CD\u099C\u09BF", en: "Allergy" },
    { id: "Vitamin", bn: "\u09AD\u09BF\u099F\u09BE\u09AE\u09BF\u09A8", en: "Vitamins" },
    { id: "Cardiac", bn: "\u09B9\u09C3\u09A6\u09B0\u09CB\u0997 \u0993 \u09AA\u09CD\u09B0\u09C7\u09B6\u09BE\u09B0", en: "Cardiac" },
    { id: "Diabetes", bn: "\u09A1\u09BE\u09DF\u09BE\u09AC\u09C7\u099F\u09BF\u09B8", en: "Diabetes" },
    { id: "Equipment", bn: "\u09AE\u09C7\u09A1\u09BF\u0995\u09C7\u09B2 \u09A1\u09BF\u09AD\u09BE\u0987\u09B8", en: "Devices" },
  ];

  const filteredItems = useMemo(() => {
    const q = normalizeVoiceQuery(searchQuery).toLowerCase();
    return catalog.filter((item) => {
      const matchesCat =
        selectedCategory === "ALL" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      if (!matchesCat) return false;
      if (!q) return true;

      return (
        item.brand.toLowerCase().includes(q) ||
        item.generic.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [catalog, searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const handleQuickAdd = (med: CatalogItem) => {
    addToCart({
      id: med.id,
      name: `${med.brand} (${med.strength})`,
      generic: med.generic,
      company: med.company,
      price: parseFloat(med.priceTk) || 5.0,
      requiresRx: med.requiresRx,
      dosageForm: med.dosageForm,
    });
    setAddedToast(`${med.brand} added to pharmacy bag!`);
    setTimeout(() => setAddedToast(""), 2500);
  };

  const directoryFaqs = [
    {
      question: "How does JibonJotno verify medicine prices in Bangladesh?",
      answer: "All 35,941+ medicine prices and generic profiles are cross-checked against DGDA and leading Bangladeshi pharmaceutical directories.",
    },
    {
      question: "Can I order medicines with 100% Cash on Delivery?",
      answer: "Yes, every medicine and healthcare device on JibonJotno supports 100% Cash on Delivery across Dhaka and all districts of Bangladesh.",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex-1 w-full space-y-6">
      <StructuredData type="FAQPage" faqs={directoryFaqs} />
      {paginatedItems[0] && <StructuredData type="Drug" medicine={paginatedItems[0]} />}

      <VoiceSearchModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onResult={(spoken) => {
          setSearchQuery(spoken);
          setCurrentPage(1);
        }}
      />

      {addedToast && (
        <div className="fixed bottom-20 lg:bottom-8 right-6 bg-[#0f4c3a] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-black z-50 flex items-center space-x-2">
          <span>✓ {addedToast}</span>
        </div>
      )}

      <div className="bg-gradient-to-br from-[#0f4c3a] to-[#082c21] text-white rounded-3xl p-6 md:p-9 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-emerald-800/80 text-emerald-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              35,941+ VERIFIED DATABASE
            </span>
            <h1 className="text-2xl md:text-3xl font-black mt-2">
              {t("\u09AA\u09C2\u09B0\u09CD\u09A3\u09BE\u0999\u09CD\u0997 \u0994\u09B7\u09A7 \u09A8\u09BF\u09B0\u09CD\u09A6\u09C7\u09B6\u09BF\u0995\u09BE \u0993 \u09AE\u09C2\u09B2\u09CD\u09AF \u09A4\u09BE\u09B2\u09BF\u0995\u09BE", "Bangladesh Medicine & Device Directory")}
            </h1>
          </div>

          <div className="text-xs bg-white/10 px-4 py-2 rounded-2xl border border-white/15">
            {t("\u09AA\u09BE\u0993\u09DF\u09BE \u0997\u09C7\u099B\u09C7:", "Found:")}{" "}
            <strong className="text-amber-300 font-mono text-sm">{filteredItems.length}</strong>
          </div>
        </div>

        <div className="relative max-w-3xl">
          <div className="bg-white rounded-2xl p-1.5 flex items-center shadow-lg">
            <span className="pl-3.5 text-slate-400 text-lg">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t(
                "\u09AC\u09CD\u09B0\u09CD\u09AF\u09BE\u09A8\u09CD\u09A1, \u099C\u09C7\u09A8\u09C7\u09B0\u09BF\u0995 \u09AC\u09BE \u0995\u09CB\u09AE\u09CD\u09AA\u09BE\u09A8\u09BF\u09B0 \u09A8\u09BE\u09AE \u09B2\u09BF\u0996\u09C1\u09A8 (Napa, Sergel, Cefixime)...",
                "Type brand, generic, or pharmaceutical company..."
              )}
              className="w-full px-3 py-2.5 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  router.replace("/medicines");
                }}
                className="text-slate-400 hover:text-rose-600 px-2.5 text-xs font-black"
              >
                ✕
              </button>
            )}
            <button
              type="button"
              onClick={() => setVoiceModalOpen(true)}
              className="w-10 h-10 rounded-xl bg-emerald-50 hover:bg-rose-600 text-[#0f4c3a] hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer"
              title="Voice Search"
            >
              <span>🎙️</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                  : "bg-white/10 text-emerald-100 hover:bg-white/20"
              }`}
            >
              {t(cat.bn, cat.en)}
            </button>
          ))}
        </div>
      </div>

      {isLoadingExtended && paginatedItems.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <MedicineCardSkeleton key={n} />
          ))}
        </div>
      ) : paginatedItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-base font-black text-slate-800">
            {t(`"${searchQuery}" \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u09A8\u09BF`, `No medicines found for "${searchQuery}"`)}
          </h3>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
            }}
            className="bg-[#0f4c3a] text-white px-5 py-2.5 rounded-xl text-xs font-bold"
          >
            {t("\u09B8\u09AC \u0994\u09B7\u09A7 \u09A6\u09C7\u0996\u09C1\u09A8", "Show All Medicines")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {paginatedItems.map((med) => (
            <div
              key={med.id}
              className="premium-card bg-white rounded-3xl p-5 border border-slate-200/90 flex flex-col justify-between group"
            >
              <div className="flex items-start space-x-4">
                <MedicineThumb item={med} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {med.dosageForm}
                    </span>
                    {med.requiresRx ? (
                      <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                        Rx
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        OTC
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-slate-900 mt-1.5 truncate group-hover:text-[#0f4c3a] transition">
                    {med.brand}{" "}
                    <span className="text-xs font-bold text-slate-500">{med.strength}</span>
                  </h3>
                  <p className="text-xs font-bold text-emerald-800 truncate mt-0.5">
                    🧬 {med.generic}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    🏢 {med.company}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Unit Price</span>
                  <span className="text-base font-black text-[#0f4c3a] font-mono">
                    BDT {med.priceTk}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setSelectedItem(med)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
                  >
                    {t("\u09AC\u09BF\u09B8\u09CD\u09A4\u09BE\u09B0\u09BF\u09A4", "Details")}
                  </button>
                  <button
                    onClick={() => handleQuickAdd(med)}
                    className="px-3.5 py-2 rounded-xl bg-[#0f4c3a] hover:bg-emerald-900 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    + {t("\u0985\u09B0\u09CD\u09A1\u09BE\u09B0", "Add")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-3 pt-4">
          <button
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
          >
            ← Prev
          </button>
          <span className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-xl border border-slate-200">
            Page {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}

      {selectedItem && (
        <MedicinePackagingModal
          medicine={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </main>
  );
}

export default function MedicinesPage() {
  return (
    <div className="min-h-screen bg-[#f4f7f6] flex flex-col justify-between font-sans text-slate-800 pb-20 lg:pb-0">
      <PublicNavbar />
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <MedicineCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <MedicinesCatalogContent />
      </Suspense>
      <footer className="bg-[#072e23] text-slate-300 py-8 text-center text-xs mt-12">
        <p className="font-bold text-white text-sm mb-1">JibonJotno Digital Health</p>
        <p className="text-slate-400">&copy; 2026 JibonJotno. All rights reserved.</p>
      </footer>
    </div>
  );
}