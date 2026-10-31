"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useLanguage } from "@/context/LanguageContext";
import QuickRxOrderModal from "@/components/features/QuickRxOrderModal";
import VoiceSearchModal from "@/components/features/VoiceSearchModal";
import { MASTER_CATALOG, CatalogItem } from "@/data/medicinesCatalog";
import { normalizeVoiceQuery } from "@/lib/medical/voiceSearchHelper";

const QUICK_TAGS = [
  { labelBn: "Napa Extend", labelEn: "Napa Extend", query: "Napa" },
  { labelBn: "Sergel 20", labelEn: "Sergel 20", query: "Sergel" },
  { labelBn: "Antibiotics", labelEn: "Antibiotics", query: "Cefixime" },
  { labelBn: "Gastric", labelEn: "Gastric", query: "Esomeprazole" },
  { labelBn: "BP Monitor", labelEn: "BP Monitor", query: "Omron" },
  { labelBn: "Health Guides", labelEn: "Health Guides", href: "/videos" },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [rxModalOpen, setRxModalOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [allMedicines, setAllMedicines] = useState<CatalogItem[]>(MASTER_CATALOG);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    fetch("/data/all_medicines.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllMedicines([...MASTER_CATALOG, ...data]);
        }
      })
      .catch(() => {});
  }, []);

  const liveMatches = useMemo(() => {
    const normalized = normalizeVoiceQuery(query).toLowerCase();
    if (!normalized) return [];

    const results: Array<{
      id: string;
      title: string;
      sub: string;
      price?: string;
      badge: string;
      href: string;
    }> = [];

    for (let i = 0; i < allMedicines.length; i++) {
      const m = allMedicines[i];
      if (
        m.brand.toLowerCase().includes(normalized) ||
        m.generic.toLowerCase().includes(normalized) ||
        m.category.toLowerCase().includes(normalized) ||
        m.company.toLowerCase().includes(normalized)
      ) {
        results.push({
          id: m.id,
          title: `${m.brand} (${m.strength})`,
          sub: `${m.generic} • ${m.company}`,
          price: `BDT ${m.priceTk}`,
          badge: m.dosageForm,
          href: `/medicines?q=${encodeURIComponent(m.brand)}`,
        });
      }
      if (results.length >= 7) break;
    }

    return results;
  }, [query, allMedicines]);

  const executeSearch = (searchTerm: string) => {
    const cleaned = normalizeVoiceQuery(searchTerm);
    setFocused(false);
    if (!cleaned) {
      router.push("/medicines");
      return;
    }
    router.push(`/medicines?q=${encodeURIComponent(cleaned)}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex flex-col justify-between font-sans text-slate-800 pb-20 lg:pb-0">
      <QuickRxOrderModal isOpen={rxModalOpen} onClose={() => setRxModalOpen(false)} />
      <VoiceSearchModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onResult={(spokenQuery) => {
          setQuery(spokenQuery);
          executeSearch(spokenQuery);
        }}
      />
      <PublicNavbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-5 pb-4 w-full">
        <div className="bg-gradient-to-br from-[#0a3d2e] via-[#0f4c3a] to-[#06241b] text-white rounded-[28px] py-10 md:py-14 px-5 md:px-12 text-center shadow-2xl relative overflow-visible border border-emerald-800/40">
          <div className="flex flex-wrap justify-center items-center gap-2 mb-4 relative z-10">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-100 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/15">
              35,941+ VERIFIED MEDICINES & EQUIPMENT
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/15 backdrop-blur-md px-3.5 py-1 rounded-full border border-amber-400/30">
              100% CASH ON DELIVERY
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black mt-2 mb-3 tracking-tight leading-tight relative z-10">
            {t(
              "\u09B8\u09B9\u099C \u0993 \u09B8\u09A0\u09BF\u0995 \u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF \u09A4\u09A5\u09CD\u09AF \u0986\u09AA\u09A8\u09BE\u09B0 \u09B9\u09BE\u09A4\u09C7\u09B0 \u09AE\u09C1\u09A0\u09CB\u09DF",
              "Reliable Digital Healthcare at Your Fingertips"
            )}
          </h1>
          <p className="text-emerald-100/85 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-7 leading-relaxed relative z-10">
            {t(
              "\u0994\u09B7\u09A7\u09C7\u09B0 \u09AC\u09BF\u09AC\u09B0\u09A3, \u099C\u09C7\u09A8\u09C7\u09B0\u09BF\u0995 \u09A6\u09BE\u09AE\u09C7\u09B0 \u09A4\u09C1\u09B2\u09A8\u09BE, \u09E8\u09E6+ \u09B0\u09CB\u0997\u09C7\u09B0 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u099A\u09BF\u0995\u09BF\u09CE\u09B8\u09BE, \u099C\u09B0\u09C1\u09B0\u09BF \u09B0\u0995\u09CD\u09A4\u09B8\u09C7\u09AC\u09BE \u0993 \u0986\u0987\u09B8\u09BF\u0987\u0989 \u09AE\u09CD\u09AF\u09BE\u09AA\u0964",
              "Explore verified medicine prices, generic alternatives, 20+ disease guides, emergency blood donors, and live ICU map."
            )}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative z-30 mb-4">
            <form
              onSubmit={handleFormSubmit}
              className={`bg-white rounded-2xl md:rounded-full p-1.5 flex items-center shadow-2xl transition-all duration-200 ${
                focused
                  ? "ring-4 ring-amber-400/50 scale-[1.01]"
                  : "ring-4 ring-white/15 hover:ring-white/25"
              }`}
            >
              <span className="pl-3.5 pr-1 text-slate-400 text-lg select-none">🔍</span>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 220)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setFocused(true);
                }}
                placeholder={t(
                  "\u0994\u09B7\u09A7\u09C7\u09B0 \u09A8\u09BE\u09AE, \u09A1\u09BF\u09AD\u09BE\u0987\u09B8 \u09AC\u09BE \u09B0\u09CB\u0997 \u09B2\u09BF\u0996\u09C7 \u0996\u09C1\u0981\u099C\u09C1\u09A8 (Napa, Sergel, Omron)...",
                  "Search medicine brand, generic or disease (e.g., Napa, Sergel)..."
                )}
                className="w-full px-2.5 py-3 text-slate-900 text-xs sm:text-sm font-semibold placeholder:font-normal placeholder:text-slate-400 focus:outline-none bg-transparent"
              />

              {query && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery("");
                    searchInputRef.current?.focus();
                  }}
                  className="text-slate-400 hover:text-rose-600 p-2 text-xs font-black transition"
                >
                  ✕
                </button>
              )}

              {/* Voice Search Button — Opens Interactive Voice Modal */}
              <button
                type="button"
                onClick={() => setVoiceModalOpen(true)}
                title={t("\u0995\u09A3\u09CD\u09A0\u09C7 \u09B8\u09BE\u09B0\u09CD\u099A \u0995\u09B0\u09C1\u09A8 (Voice Search)", "Voice Search")}
                className="w-10 h-10 mx-1 rounded-full bg-emerald-50 hover:bg-rose-600 text-[#0f4c3a] hover:text-white transition-all shrink-0 flex items-center justify-center cursor-pointer shadow-2xs"
              >
                <span className="text-base">🎙️</span>
              </button>

              <button
                type="submit"
                className="bg-[#0f4c3a] hover:bg-emerald-900 active:scale-95 text-white px-5 sm:px-7 py-3 rounded-xl md:rounded-full text-xs sm:text-sm font-black transition-all shrink-0 cursor-pointer shadow-sm"
              >
                {t("\u0996\u09C1\u0981\u099C\u09C1\u09A8", "Search")}
              </button>
            </form>

            {/* Instant Dropdown */}
            {focused && query.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden text-left z-50 divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {liveMatches.map((item) => (
                  <div
                    key={item.id}
                    onMouseDown={() => router.push(item.href)}
                    className="flex justify-between items-center px-4 py-3 hover:bg-emerald-50/80 cursor-pointer transition group"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-black text-slate-900 group-hover:text-[#0f4c3a] truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {item.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">{item.sub}</div>
                    </div>
                    <div className="text-right shrink-0">
                      {item.price && (
                        <div className="text-xs font-black text-[#0f4c3a] font-mono">{item.price}</div>
                      )}
                      <span className="text-[11px] font-bold text-emerald-700">→</span>
                    </div>
                  </div>
                ))}

                <div
                  onMouseDown={() => executeSearch(query)}
                  className="px-4 py-3 bg-emerald-50/60 hover:bg-emerald-100/80 text-xs font-black text-[#0f4c3a] cursor-pointer flex items-center justify-between transition"
                >
                  <span>🔍 {t(`"${query}" \u09A6\u09BF\u09DF\u09C7 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09A4\u09BE\u09B2\u09BF\u0995\u09BE\u09DF \u0996\u09C1\u0981\u099C\u09C1\u09A8`, `Search "${query}" in full catalog`)}</span>
                  <span>→</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Chips */}
          <div className="flex flex-wrap justify-center items-center gap-1.5 max-w-2xl mx-auto mb-7 relative z-10">
            {QUICK_TAGS.map((tag, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (tag.href) {
                    router.push(tag.href);
                  } else if (tag.query) {
                    setQuery(tag.query);
                    executeSearch(tag.query);
                  }
                }}
                className="text-[11px] font-bold bg-white/10 hover:bg-white hover:text-[#0f4c3a] text-emerald-50 px-3 py-1 rounded-full border border-white/15 transition-all cursor-pointer active:scale-95"
              >
                {t(tag.labelBn, tag.labelEn)}
              </button>
            ))}
          </div>

          {/* Quick Rx Upload Card */}
          <div className="max-w-xl mx-auto bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left transition-all relative z-10 shadow-lg">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-2xl shrink-0">
                📷
              </div>
              <div>
                <div className="font-extrabold text-sm text-amber-300">
                  {t("\u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8\u09C7\u09B0 \u099B\u09AC\u09BF \u09A4\u09C1\u09B2\u09C7 \u098F\u0995-\u0995\u09CD\u09B2\u09BF\u0995\u09C7 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0", "1-Click Prescription Photo Order")}
                </div>
                <div className="text-xs text-emerald-100/90 mt-0.5">
                  {t(
                    "\u0993\u09B7\u09C1\u09A7 \u0996\u09C1\u0981\u099C\u09A4\u09C7 \u09A8\u09BE \u099A\u09BE\u0987\u09B2\u09C7 \u099B\u09AC\u09BF \u09A6\u09BF\u09A8, \u09AB\u09BE\u09B0\u09CD\u09AE\u09BE\u09B8\u09BF\u09B8\u09CD\u099F \u09A8\u09BF\u099C\u09C7 \u09AC\u09BF\u09B2 \u0995\u09B0\u09C7 \u09AB\u09CB\u09A8 \u09A6\u09C7\u09AC\u09C7\u09A8\u0964",
                    "Upload a photo and our pharmacist will call you."
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setRxModalOpen(true)}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs transition shadow-md shrink-0 cursor-pointer"
            >
              {t("\u099B\u09AC\u09BF \u0986\u09AA\u09B2\u09CB\u09A1 \u0995\u09B0\u09C1\u09A8 \u203A", "Upload Rx \u203A")}
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex-1 w-full space-y-9">
        <div>
          <h2 className="text-base md:text-lg font-black text-slate-900 mb-4 flex items-center space-x-2">
            <span>✨</span>
            <span>{t("\u09AA\u09CD\u09B0\u09A7\u09BE\u09A8 \u09B8\u09C7\u09AC\u09BE\u09B8\u09AE\u09C2\u09B9 (Core Healthcare Features)", "Primary Healthcare Features")}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            <Link href="/medicines" prefetch={true} className="premium-card bg-white p-6 rounded-3xl border border-slate-200/90 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl mb-4">💊</div>
                <h3 className="text-base md:text-lg font-extrabold text-slate-900 mb-1">{t("\u0994\u09B7\u09A7 \u09A8\u09BF\u09B0\u09CD\u09A6\u09C7\u09B6\u09BF\u0995\u09BE", "Medicine Directory")}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{t("\u09E9\u09EB,\u09EF\u09EA\u09E7+ \u0993\u09B7\u09C1\u09A7\u09C7\u09B0 \u09AE\u09CB\u09DC\u0995, \u09A1\u09CB\u099C, \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0993 \u0995\u09CD\u09B2\u09BF\u09A8\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u09AC\u09BF\u09AC\u09B0\u09A3\u09C0\u0964", "Verified indications, dosage forms, and clinical precautions.")}</p>
              </div>
              <span className="text-xs font-extrabold text-[#0f4c3a]">{t("\u0994\u09B7\u09A7 \u0996\u09C1\u0981\u099C\u09C1\u09A8 \u2192", "Explore Items \u2192")}</span>
            </Link>

            <Link href="/compare" prefetch={true} className="premium-card bg-white p-6 rounded-3xl border border-slate-200/90 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-2xl mb-4">⚖️</div>
                <h3 className="text-base md:text-lg font-extrabold text-slate-900 mb-1">{t("\u09A6\u09BE\u09AE\u09C7\u09B0 \u09A4\u09C1\u09B2\u09A8\u09BE", "Price Comparison")}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{t("\u098F\u0995\u0987 \u099C\u09C7\u09A8\u09C7\u09B0\u09BF\u0995\u09C7\u09B0 \u09AC\u09BF\u09AD\u09BF\u09A8\u09CD\u09A8 \u0995\u09CB\u09AE\u09CD\u09AA\u09BE\u09A8\u09BF\u09B0 \u09AC\u09BF\u0995\u09B2\u09CD\u09AA \u09AC\u09CD\u09B0\u09CD\u09AF\u09BE\u09A8\u09CD\u09A1 \u0993 \u09B8\u09BE\u09B6\u09CD\u09B0\u09DF\u09C0 \u09A6\u09BE\u09AE\u0964", "Compare costs across top brands sharing the same generic molecule.")}</p>
              </div>
              <span className="text-xs font-extrabold text-[#0f4c3a]">{t("\u09AE\u09C2\u09B2\u09CD\u09AF \u09A4\u09C1\u09B2\u09A8\u09BE \u0995\u09B0\u09C1\u09A8 \u2192", "Compare Prices \u2192")}</span>
            </Link>

            <Link href="/videos" prefetch={true} className="premium-card bg-white p-6 rounded-3xl border border-slate-200/90 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl mb-4">🩺</div>
                <h3 className="text-base md:text-lg font-extrabold text-slate-900 mb-1">{t("\u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF \u0986\u09B0\u09CD\u099F\u09BF\u0995\u09C7\u09B2 (\u09E8\u09E6+ \u09B0\u09CB\u0997)", "Health Guides")}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{t("\u09A1\u09C7\u0999\u09CD\u0997\u09C1, \u0989\u099A\u09CD\u099A \u09B0\u0995\u09CD\u09A4\u099A\u09BE\u09AA, \u09A1\u09BE\u09DF\u09BE\u09AC\u09C7\u099F\u09BF\u09B8\u09B8\u09B9 \u09E8\u09E6+ \u09B0\u09CB\u0997\u09C7\u09B0 \u09AA\u09CD\u09B0\u09BE\u09A5\u09AE\u09BF\u0995 \u099A\u09BF\u0995\u09BF\u09CE\u09B8\u09BE \u0997\u09BE\u0987\u09A1\u0964", "Primary medical care and prevention guides for 20 common diseases.")}</p>
              </div>
              <span className="text-xs font-extrabold text-[#0f4c3a]">{t("\u0997\u09BE\u0987\u09A1 \u09AA\u09DC\u09C1\u09A8 \u2192", "Read Guides \u2192")}</span>
            </Link>

            <Link href="/map" prefetch={true} className="premium-card bg-white p-6 rounded-3xl border border-rose-200/80 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl mb-4">🚨</div>
                <h3 className="text-base md:text-lg font-extrabold text-slate-900 mb-1">{t("\u099C\u09B0\u09C1\u09B0\u09BF \u0993 \u0986\u0987\u09B8\u09BF\u0987\u0989 \u09AE\u09CD\u09AF\u09BE\u09AA", "ICU & Emergency Map")}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{t("\u09EF\u09EF\u09EF, \u09E7\u09EC\u09E8\u09EC\u09E9 \u09B9\u099F\u09B2\u09BE\u0987\u09A8 \u098F\u09AC\u0982 \u0997\u09C1\u0997\u09B2 \u09AE\u09CD\u09AF\u09BE\u09AA\u09C7 \u09A6\u09C7\u09B6\u09C7\u09B0 \u09B8\u0995\u09B2 \u0986\u0987\u09B8\u09BF\u0987\u0989 \u09B9\u09BE\u09B8\u09AA\u09BE\u09A4\u09BE\u09B2\u0964", "National emergency hotlines and live ICU hospital locations.")}</p>
              </div>
              <span className="text-xs font-extrabold text-rose-600">{t("\u09AE\u09CD\u09AF\u09BE\u09AA \u0993 \u09A8\u09AE\u09CD\u09AC\u09B0 \u09A6\u09C7\u0996\u09C1\u09A8 \u2192", "View ICU Map \u2192")}</span>
            </Link>
          </div>
        </div>

        {/* Specialized Services */}
        <div>
          <h2 className="text-base md:text-lg font-black text-slate-900 mb-4 flex items-center space-x-2">
            <span>⚡</span>
            <span>{t("\u099C\u09B0\u09C1\u09B0\u09BF \u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF\u09B8\u09C7\u09AC\u09BE \u0993 \u09B8\u09CD\u09AE\u09BE\u09B0\u09CD\u099F \u099F\u09C1\u09B2\u09B8 (Specialized Services)", "Specialized Healthcare Utilities")}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            <Link href="/blood-bank" prefetch={true} className="premium-card bg-white p-5 rounded-3xl border border-slate-200/90 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl">🩸</span>
                  <span className="text-[10px] font-black bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-200">
                    {t("\u099C\u09B0\u09C1\u09B0\u09BF \u09A8\u09C7\u099F\u0993\u09DF\u09BE\u09B0\u09CD\u0995", "Emergency Network")}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm mb-1">{t("\u09AC\u09CD\u09B2\u09BE\u09A1 \u09AC\u09CD\u09AF\u09BE\u0982\u0995 \u0993 \u09B0\u0995\u09CD\u09A4\u09A6\u09BE\u09A4\u09BE", "Blood Bank & Donors")}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t("\u09B0\u0995\u09CD\u09A4\u09C7\u09B0 \u0997\u09CD\u09B0\u09C1\u09AA \u0985\u09A8\u09C1\u09AF\u09BE\u09DF\u09C0 \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u09B0\u0995\u09CD\u09A4\u09A6\u09BE\u09A4\u09BE\u09A6\u09C7\u09B0 \u09AB\u09CB\u09A8 \u09A8\u09AE\u09CD\u09AC\u09B0 \u0993 \u099C\u09B0\u09C1\u09B0\u09BF \u09B0\u0995\u09CD\u09A4\u09C7\u09B0 \u0986\u09AC\u09C7\u09A6\u09A8\u0964", "Find blood donors by blood group or post emergency blood requisitions.")}</p>
              </div>
              <span className="text-xs font-extrabold text-rose-700 mt-3">{t("\u09B0\u0995\u09CD\u09A4\u09A6\u09BE\u09A4\u09BE \u0996\u09C1\u0981\u099C\u09C1\u09A8 \u2192", "Find Donors \u2192")}</span>
            </Link>

            <Link href="/refill" prefetch={true} className="premium-card bg-white p-5 rounded-3xl border border-slate-200/90 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl">🔄</span>
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {t("\u0985\u099F\u09CB-\u09B8\u09BE\u09AC\u09B8\u09CD\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8", "Auto-Refill")}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm mb-1">{t("\u09AE\u09BE\u09B8\u09BF\u0995 \u09B0\u09BF\u09AB\u09BF\u09B2 \u0993 \u09AA\u09BF\u09B2 \u09B0\u09BF\u09AE\u09BE\u0987\u09A8\u09CD\u09A1\u09BE\u09B0", "Monthly Refill Tracker")}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t("\u0993\u09B7\u09C1\u09A7 \u09B6\u09C7\u09B7 \u09B9\u0993\u09DF\u09BE\u09B0 \u09EB \u09A6\u09BF\u09A8 \u0986\u0997\u09C7 \u098F\u09B8\u098F\u09AE\u098F\u09B8 \u0985\u09CD\u09AF\u09BE\u09B2\u09BE\u09B0\u09CD\u099F \u0993 \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF\u09A4\u09C7 \u09B0\u09BF\u09AB\u09BF\u09B2\u0964", "Automatic monthly medicine reminders and repeat home deliveries.")}</p>
              </div>
              <span className="text-xs font-extrabold text-[#0f4c3a] mt-3">{t("\u09B0\u09BF\u09AB\u09BF\u09B2 \u099A\u09BE\u09B2\u09C1 \u0995\u09B0\u09C1\u09A8 \u2192", "Start Refill \u2192")}</span>
            </Link>

            <Link href="/ambulance" prefetch={true} className="premium-card bg-white p-5 rounded-3xl border border-slate-200/90 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl">🚑</span>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full">
                    {t("\u09E8\u09EA/\u09ED \u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8", "24/7 Service")}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm mb-1">{t("\u0985\u09CD\u09AF\u09BE\u09AE\u09CD\u09AC\u09C1\u09B2\u09C7\u09A8\u09CD\u09B8 \u0993 \u0985\u0995\u09CD\u09B8\u09BF\u099C\u09C7\u09A8 \u09B8\u09BF\u09B2\u09BF\u09A8\u09CD\u09A1\u09BE\u09B0", "Ambulance & Oxygen")}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t("\u0986\u0987\u09B8\u09BF\u0987\u0989 \u09AD\u09C7\u09A8\u09CD\u099F\u09BF\u09B2\u09C7\u099F\u09B0 \u0985\u09CD\u09AF\u09BE\u09AE\u09CD\u09AC\u09C1\u09B2\u09C7\u09A8\u09CD\u09B8 \u0993 \u09E8 \u0998\u09A3\u09CD\u099F\u09BE\u09DF \u0998\u09B0\u09C7 \u0985\u0995\u09CD\u09B8\u09BF\u099C\u09C7\u09A8 \u09B8\u09B0\u09AC\u09B0\u09BE\u09B9\u0964", "Directory of verified ambulance operators and oxygen cylinder delivery.")}</p>
              </div>
              <span className="text-xs font-extrabold text-[#0f4c3a] mt-3">{t("\u0995\u09B2 \u09A8\u09AE\u09CD\u09AC\u09B0 \u09A6\u09C7\u0996\u09C1\u09A8 \u2192", "View Numbers \u2192")}</span>
            </Link>

            <Link href="/lab-tests" prefetch={true} className="premium-card bg-white p-5 rounded-3xl border border-slate-200/90 flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-2 block">🧪</span>
                <h3 className="font-extrabold text-slate-900 text-sm mb-1">{t("\u09A1\u09BE\u09DF\u09BE\u0997\u09A8\u09B8\u09CD\u099F\u09BF\u0995 \u099F\u09C7\u09B8\u09CD\u099F \u0993 \u09B9\u09CB\u09AE \u09B8\u09CD\u09AF\u09BE\u09AE\u09CD\u09AA\u09B2", "Diagnostic Lab Tests")}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t("\u09B8\u09B0\u0995\u09BE\u09B0\u09BF \u09AC\u09A8\u09BE\u09AE \u09AC\u09C7\u09B8\u09B0\u0995\u09BE\u09B0\u09BF \u09B2\u09CD\u09AF\u09BE\u09AC \u0996\u09B0\u099A \u0993 \u09AC\u09BE\u09B8\u09BE \u09A5\u09C7\u0995\u09C7 \u09B8\u09CD\u09AF\u09BE\u09AE\u09CD\u09AA\u09B2 \u09AC\u09C1\u0995\u09BF\u0982\u0964", "Compare hospital test costs and book verified home phlebotomists.")}</p>
              </div>
              <span className="text-xs font-extrabold text-[#0f4c3a] mt-3">{t("\u09B2\u09CD\u09AF\u09BE\u09AC \u0996\u09B0\u099A \u09A6\u09C7\u0996\u09C1\u09A8 \u2192", "View Lab Tests \u2192")}</span>
            </Link>

            <Link href="/pediatric-dose" prefetch={true} className="premium-card bg-white p-5 rounded-3xl border border-slate-200/90 flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-2 block">👶</span>
                <h3 className="font-extrabold text-slate-900 text-sm mb-1">{t("\u09B6\u09BF\u09B6\u09C1\u09B0 \u09B8\u09BF\u09B0\u09BE\u09AA \u09A1\u09CB\u099C \u0995\u09CD\u09AF\u09BE\u09B2\u0995\u09C1\u09B2\u09C7\u099F\u09B0", "Pediatric Dose Calculator")}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t("\u09B6\u09BF\u09B6\u09C1\u09B0 \u0993\u099C\u09A8 \u0985\u09A8\u09C1\u09AF\u09BE\u09DF\u09C0 \u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09B8\u09BF\u099F\u09BE\u09AE\u09B2 \u0993 \u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u09BF\u09AC\u09BE\u09DF\u09CB\u099F\u09BF\u0995\u09C7\u09B0 \u09AE\u09BF\u09B2\u09BF \u09AA\u09B0\u09BF\u09AE\u09BE\u09AA\u0964", "Weight-based accurate pediatric syrup dosage in milliliters.")}</p>
              </div>
              <span className="text-xs font-extrabold text-[#0f4c3a] mt-3">{t("\u09AE\u09BE\u09A4\u09CD\u09B0\u09BE \u09B9\u09BF\u09B8\u09BE\u09AC \u0995\u09B0\u09C1\u09A8 \u2192", "Calculate Dose \u2192")}</span>
            </Link>

            <Link href="/track-order" prefetch={true} className="premium-card bg-white p-5 rounded-3xl border border-slate-200/90 flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-2 block">🚚</span>
                <h3 className="font-extrabold text-slate-900 text-sm mb-1">{t("\u09B2\u09BE\u0987\u09AD \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u0993 \u0995\u09CD\u09AF\u09BE\u09B6 \u09AE\u09C7\u09AE\u09CB", "Live Order Tracking")}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t("\u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u0986\u0987\u09A1\u09BF \u09A6\u09BF\u09DF\u09C7 \u09EB-\u09A7\u09BE\u09AA\u09C7\u09B0 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u0985\u0997\u09CD\u09B0\u0997\u09A4\u09BF \u0993 \u0995\u09CD\u09AF\u09BE\u09B6 \u09AE\u09C7\u09AE\u09CB \u09AA\u09CD\u09B0\u09BF\u09A8\u09CD\u099F\u0964", "Real-time order delivery progress bar and printable cash memo.")}</p>
              </div>
              <span className="text-xs font-extrabold text-[#0f4c3a] mt-3">{t("\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995 \u0995\u09B0\u09C1\u09A8 \u2192", "Track Status \u2192")}</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#072e23] text-slate-300 py-8 text-center text-xs mt-10 space-y-3">
        <p className="font-bold text-white text-sm">{t("\u099C\u09C0\u09AC\u09A8\u09AF\u09A4\u09CD\u09A8 (JibonJotno)", "JibonJotno Digital Health")}</p>
        <p className="text-emerald-200/80 max-w-xl mx-auto px-4">
          {t(
            "\u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6\u09C7\u09B0 \u09B8\u09BE\u09A7\u09BE\u09B0\u09A3 \u09AE\u09BE\u09A8\u09C1\u09B7\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09A8\u09BF\u09B0\u09CD\u09AD\u09B0\u09AF\u09CB\u0997\u09CD\u09AF, \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BF\u09A4 \u0993 \u09E7\u09E6\u09E6% \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF \u09A4\u09A5\u09CD\u09AF \u09B8\u09C7\u09AC\u09BE\u0964",
            "Encrypted, safe, and trusted 100% Cash on Delivery digital healthcare platform for Bangladesh."
          )}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-3 text-[11px] text-emerald-300/80 pt-2 border-t border-emerald-900/60">
          <Link href="/privacy" className="hover:text-white underline font-bold">
            🛡️ {t("\u0997\u09CB\u09AA\u09A8\u09C0\u09DF\u09A4\u09BE \u0993 \u09A1\u09C7\u099F\u09BE \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE \u09A8\u09C0\u09A4\u09BF", "Privacy Policy")}
          </Link>
          <span>•</span>
          <Link href="/blood-bank" className="hover:text-white underline">
            🩸 {t("\u09AC\u09CD\u09B2\u09BE\u09A1 \u09AC\u09CD\u09AF\u09BE\u0982\u0995", "Blood Bank")}
          </Link>
          <span>•</span>
          <Link href="/track-order" className="hover:text-white underline">
            🚚 {t("\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982", "Order Tracking")}
          </Link>
          <span>•</span>
          <span>🔒 256-Bit SSL Secured</span>
          <span>•</span>
          <span>&copy; 2026 JibonJotno</span>
        </div>
      </footer>
    </div>
  );
}