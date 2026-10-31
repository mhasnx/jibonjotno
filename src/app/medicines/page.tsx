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

function MedicineCardThumbnail({ item }: { item: CatalogItem }) {
  const [imgErr, setImgErr] = useState(false);

  const cleanBrand = encodeURIComponent((item.brand || "").trim().toLowerCase().replace(/\s+/g, "-"));
  const fallbackUrl = `https://medex.com.bd/cdn/img/medicines/${cleanBrand}.png`;
  const imgSrc = item.imageUrl && !imgErr ? item.imageUrl : fallbackUrl;

  return (
    <div className="w-24 h-22 rounded-2xl border border-slate-200 bg-white p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs relative group-hover:border-emerald-500 transition">
      {!imgErr ? (
        <img
          src={imgSrc}
          alt={item.brand}
          referrerPolicy="no-referrer"
          onError={() => setImgErr(true)}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition"
        />
      ) : (
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-800 to-teal-950 text-white p-1.5 flex flex-col justify-between">
          <div className="text-[7px] font-black uppercase text-emerald-300 truncate">
            {item.dosageForm}
          </div>
          <div className="text-center font-black text-[11px] leading-tight truncate">
            {item.brand}
          </div>
          <div className="text-[7px] text-center text-slate-300 font-mono truncate">
            {item.strength}
          </div>
        </div>
      )}
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
    const customSaved = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("jj_custom_medicines") || "[]") : [];
    const overrides = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("jj_medicine_overrides") || "{}") : {};

    fetch("/data/all_medicines.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const combined = [...customSaved, ...MASTER_CATALOG, ...data].map((item) =>
            overrides[item.id] ? { ...item, ...overrides[item.id] } : item
          );
          setCatalog(combined);
        } else {
          setCatalog([...customSaved, ...MASTER_CATALOG]);
        }
      })
      .catch(() => {
        setCatalog([...customSaved, ...MASTER_CATALOG]);
      })
      .finally(() => setIsLoadingExtended(false));
  }, []);

  const categories = [
    { id: "ALL", bn: "সব ক্যাটাগরি", en: "All Items" },
    { id: "Gastric", bn: "গ্যাস্ট্রিক", en: "Gastric" },
    { id: "Fever", bn: "জ্বর ও ব্যথা", en: "Fever & Pain" },
    { id: "Antibiotic", bn: "অ্যান্টিবায়োটিক", en: "Antibiotics" },
    { id: "Allergy", bn: "অ্যালার্জি", en: "Allergy" },
    { id: "Vitamin", bn: "ভিটামিন", en: "Vitamins" },
    { id: "Cardiac", bn: "হৃদরোগ ও প্রেশার", en: "Cardiac" },
    { id: "Diabetes", bn: "ডায়াবেটিস", en: "Diabetes" },
    { id: "Equipment", bn: "মেডিকেল ডিভাইস", en: "Devices" },
  ];

  const filteredItems = useMemo(() => {
    const q = normalizeVoiceQuery(searchQuery).toLowerCase();
    return catalog.filter((item) => {
      const matchesCat =
        selectedCategory === "ALL" ||
        (item.category || "").toLowerCase() === selectedCategory.toLowerCase();
      if (!matchesCat) return false;
      if (!q) return true;

      return (
        (item.brand || "").toLowerCase().includes(q) ||
        (item.generic || "").toLowerCase().includes(q) ||
        (item.company || "").toLowerCase().includes(q) ||
        (item.category || "").toLowerCase().includes(q)
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
    setAddedToast(`${med.brand} ফার্মেসি ব্যাগে যুক্ত হয়েছে!`);
    setTimeout(() => setAddedToast(""), 2500);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex-1 w-full space-y-6">
      <VoiceSearchModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onResult={(spoken) => {
          setSearchQuery(spoken);
          setCurrentPage(1);
        }}
      />

      {addedToast && (
        <div className="fixed bottom-20 lg:bottom-8 right-6 bg-[#0f4c3a] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-black z-50">
          ✓ {addedToast}
        </div>
      )}

      <div className="bg-gradient-to-br from-[#0f4c3a] to-[#082c21] text-white rounded-3xl p-6 md:p-9 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-emerald-800/80 text-emerald-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              35,941+ VERIFIED DATABASE
            </span>
            <h1 className="text-2xl md:text-3xl font-black mt-2">
              {t("পূর্ণাঙ্গ ঔষধ নির্দেশিকা ও মূল্য তালিকা", "Bangladesh Medicine & Device Directory")}
            </h1>
          </div>

          <div className="text-xs bg-white/10 px-4 py-2 rounded-2xl border border-white/15">
            {t("পাওয়া গেছে:", "Found:")}{" "}
            <strong className="text-amber-300 font-mono text-sm">
              {filteredItems.length.toLocaleString()}
            </strong>
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
                "ব্র্যান্ড, জেনেরিক বা কোম্পানির নাম লিখুন (Napa, Sergel, Cefixime)...",
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
                className="text-slate-400 hover:text-rose-600 px-2.5 text-xs font-black cursor-pointer"
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {paginatedItems.map((med) => {
            const unitP = parseFloat(med.priceTk) || 5.0;
            const stripP = (unitP * 10).toFixed(2);
            return (
              <div
                key={med.id}
                onClick={() => setSelectedItem(med)}
                className="premium-card bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-[#0f4c3a] flex flex-col justify-between group cursor-pointer transition shadow-2xs hover:shadow-xl"
              >
                <div className="flex items-start space-x-4">
                  <MedicineCardThumbnail item={med} />
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

                <div
                  className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      পাতা (10's): ৳{stripP}
                    </span>
                    <span className="text-base font-black text-[#0f4c3a] font-mono">
                      BDT {unitP.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setSelectedItem(med)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
                    >
                      {t("বিস্তারিত", "Details")}
                    </button>
                    <button
                      onClick={() => handleQuickAdd(med)}
                      className="px-3.5 py-2 rounded-xl bg-[#0f4c3a] hover:bg-emerald-900 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                    >
                      + {t("অর্ডার", "Add")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
            Page {currentPage} / {totalPages.toLocaleString()}
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
          allMedicines={catalog}
          onClose={() => setSelectedItem(null)}
          onSelectAlternative={(alt) => setSelectedItem(alt)}
        />
      )}
    </main>
  );
}

export default function MedicinesPage() {
  return (
    <div className="min-h-screen bg-[#f4f7f6] flex flex-col justify-between font-sans text-slate-800 pb-20 lg:pb-0">
      <PublicNavbar />
      <Suspense fallback={<div className="p-12 text-center font-bold">ঔষধ ডেটাবেজ লোড হচ্ছে...</div>}>
        <MedicinesCatalogContent />
      </Suspense>
    </div>
  );
}