"use client";

import React, { useState, useEffect } from "react";
import { CatalogItem, MASTER_CATALOG } from "@/data/medicinesCatalog";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

interface Props {
  medicine: CatalogItem & { youtubeUrl?: string };
  allMedicines?: CatalogItem[];
  onClose: () => void;
  onSelectAlternative?: (med: CatalogItem) => void;
}

export default function MedicinePackagingModal({
  medicine,
  allMedicines = [],
  onClose,
  onSelectAlternative,
}: Props) {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<"IMAGE" | "PACK" | "STRIP">("IMAGE");
  const [imgError, setImgError] = useState(false);
  const [alternatives, setAlternatives] = useState<CatalogItem[]>([]);
  const [addedMsg, setAddedMsg] = useState(false);

  const unitPrice = parseFloat(medicine.priceTk) || 5.0;
  const stripPrice = (unitPrice * 10).toFixed(2);
  const boxPrice = (unitPrice * 60).toFixed(2);

  // Fallback image resolver from BD pharma CDNs if imageUrl is missing
  const getMedicineImage = (med: CatalogItem) => {
    if (med.imageUrl && !imgError && med.imageUrl.startsWith("http")) {
      return med.imageUrl;
    }
    const cleanBrand = encodeURIComponent(med.brand.trim());
    return `https://medex.com.bd/cdn/img/medicines/${cleanBrand.toLowerCase()}.png`;
  };

  const currentImageSrc = getMedicineImage(medicine);

  // Extract YouTube Embed URL
  const getYoutubeEmbed = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const ytEmbed = getYoutubeEmbed((medicine as any).youtubeUrl);

  useEffect(() => {
    setImgError(false);
    setViewMode("IMAGE");

    const pool = allMedicines.length > 0 ? allMedicines : MASTER_CATALOG;
    const matched = pool
      .filter(
        (m) =>
          m.generic?.toLowerCase() === medicine.generic?.toLowerCase() &&
          m.brand?.toLowerCase() !== medicine.brand?.toLowerCase()
      )
      .slice(0, 6);
    setAlternatives(matched);
  }, [medicine, allMedicines]);

  const handleOrder = () => {
    addToCart({
      id: medicine.id,
      name: `${medicine.brand} (${medicine.strength})`,
      generic: medicine.generic,
      company: medicine.company,
      price: unitPrice,
      requiresRx: medicine.requiresRx,
      dosageForm: medicine.dosageForm,
    });
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-emerald-900/20 my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header With Real Packaging Picture & Medicine Identity */}
        <div className="bg-gradient-to-br from-[#0a3528] via-[#0f4c3a] to-[#06231b] text-white p-5 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-rose-600 text-white flex items-center justify-center font-black transition cursor-pointer"
          >
            ✕
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Real Packaging Image & 3D Switcher Box */}
            <div className="w-full md:w-64 shrink-0 flex flex-col items-center">
              {viewMode === "IMAGE" && !imgError ? (
                <div className="w-60 h-44 bg-white rounded-2xl p-2.5 flex items-center justify-center shadow-xl border-2 border-emerald-300 relative overflow-hidden group">
                  <img
                    src={currentImageSrc}
                    alt={medicine.brand}
                    referrerPolicy="no-referrer"
                    onError={() => {
                      setImgError(true);
                      setViewMode("PACK");
                    }}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-1 right-2 bg-slate-900/70 text-[9px] font-bold text-white px-2 py-0.5 rounded">
                    অরিজিনাল মোড়ক
                  </span>
                </div>
              ) : viewMode === "PACK" || imgError ? (
                /* Realistic 3D Box Packaging Mockup */
                <div className="w-60 h-44 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-emerald-50 text-slate-900 p-4 shadow-2xl border-2 border-emerald-300 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0f4c3a] via-emerald-500 to-amber-500" />
                  <div className="flex justify-between items-start pt-1">
                    <span className="text-[9px] font-black uppercase tracking-wider bg-[#0f4c3a] text-white px-2 py-0.5 rounded">
                      {medicine.dosageForm}
                    </span>
                    <span className="text-[9px] font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                      {medicine.requiresRx ? "Rx Only" : "OTC"}
                    </span>
                  </div>

                  <div className="my-auto py-1 border-y border-slate-200/80">
                    <h4 className="text-xl font-black text-[#0f4c3a] leading-tight truncate">
                      {medicine.brand}®
                    </h4>
                    <p className="text-xs font-extrabold text-amber-700">{medicine.strength}</p>
                    <p className="text-[10px] font-bold text-slate-600 truncate mt-0.5">
                      {medicine.generic}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                    <span className="truncate max-w-[130px]">🏢 {medicine.company}</span>
                    <span className="font-mono text-[#0f4c3a] font-black">10x10's Box</span>
                  </div>
                </div>
              ) : (
                /* Realistic Blister Foil Strip */
                <div className="w-60 h-44 rounded-2xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 text-slate-800 p-3.5 shadow-2xl border-2 border-slate-400 flex flex-col justify-between">
                  <div className="text-[9px] font-black text-center text-slate-600 uppercase tracking-widest border-b border-slate-300 pb-1">
                    {medicine.brand} • Blister Foil Strip (10 Units)
                  </div>
                  <div className="grid grid-cols-5 gap-2 my-auto py-2 px-1">
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-7 rounded-full bg-gradient-to-b from-white to-emerald-100 border border-slate-400 shadow-inner flex items-center justify-center"
                      >
                        <div className="w-3 h-1.5 rounded-full bg-emerald-600/60" />
                      </div>
                    ))}
                  </div>
                  <div className="text-[8px] font-mono text-center text-slate-600">
                    {medicine.company} • পাতা: ৳{stripPrice}
                  </div>
                </div>
              )}

              {/* View Switch Buttons */}
              <div className="flex gap-1.5 mt-2.5">
                {!imgError && (
                  <button
                    type="button"
                    onClick={() => setViewMode("IMAGE")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition ${
                      viewMode === "IMAGE" ? "bg-amber-400 text-slate-950" : "bg-white/15 text-emerald-100 hover:bg-white/25"
                    }`}
                  >
                    📷 ছবি
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewMode("PACK")}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition ${
                    viewMode === "PACK" ? "bg-amber-400 text-slate-950" : "bg-white/15 text-emerald-100 hover:bg-white/25"
                  }`}
                >
                  📦 ৩ডি বক্স
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("STRIP")}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition ${
                    viewMode === "STRIP" ? "bg-amber-400 text-slate-950" : "bg-white/15 text-emerald-100 hover:bg-white/25"
                  }`}
                >
                  💊 পাতা (Strip)
                </button>
              </div>
            </div>

            {/* Main Header Specs */}
            <div className="flex-1 space-y-2.5 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-[10px] font-black px-3 py-0.5 rounded-full uppercase">
                  {medicine.dosageForm}
                </span>
                <span className="bg-amber-400/20 text-amber-200 text-[10px] font-black px-3 py-0.5 rounded-full">
                  {medicine.category}
                </span>
                <span className="bg-white/10 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  DGDA Verified
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {medicine.brand}{" "}
                <span className="text-base sm:text-lg font-extrabold text-amber-300">
                  {medicine.strength}
                </span>
              </h2>

              <p className="text-xs sm:text-sm font-bold text-emerald-200">
                🧬 জেনেরিক (Generic): <span className="underline">{medicine.generic}</span>
              </p>
              <p className="text-xs text-slate-300 font-semibold">
                🏢 প্রস্তুতকারক (Manufacturer): {medicine.company}
              </p>

              {(medicine as any).youtubeUrl && (
                <div className="pt-1">
                  <a
                    href={(medicine as any).youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition cursor-pointer"
                  >
                    <span>▶</span> YouTube ভিডিও গাইড দেখুন
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Details & Clinical Info */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5 bg-slate-50/70 flex-1">
          {/* YouTube Video Player Embed if present */}
          {ytEmbed && (
            <div className="bg-white rounded-2xl p-4 border border-red-200 shadow-sm space-y-2">
              <h4 className="text-xs font-black text-red-600 uppercase flex items-center gap-1.5">
                <span>▶</span> অফিসিয়াল মেডিসিন ভিডিও নির্দেশিকা
              </h4>
              <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden bg-black shadow-inner">
                <iframe
                  src={ytEmbed}
                  title={medicine.brand}
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Pricing Info & Order Action */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                UNIT PRICE & PACK INFO (মূল্য তালিকা)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#0f4c3a] font-mono">
                  BDT {unitPrice.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-semibold">/ প্রতি ইউনিট</span>
              </div>
              <div className="flex flex-wrap gap-2.5 text-xs font-bold text-slate-600 pt-0.5">
                <span className="bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-200">
                  ১ পাতা (10 Units): ৳ {stripPrice}
                </span>
                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                  বক্স মূল্য: ৳ {boxPrice}
                </span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              className="w-full sm:w-auto bg-[#0f4c3a] hover:bg-emerald-950 text-white font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg transition cursor-pointer"
            >
              {addedMsg ? "✓ ব্যাগে যুক্ত হয়েছে!" : "+ ক্যাশ অন ডেলিভারি অর্ডার"}
            </button>
          </div>

          {/* Clinical Monograph */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="text-xs font-black text-[#0f4c3a] uppercase">🩺 সেবন নির্দেশিকা (Indications)</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {(medicine as any).indications ||
                  `${medicine.brand} (${medicine.generic}) প্রধানত ${medicine.category} সংক্রান্ত উপসর্গ ও রোগের চিকিৎসায় নির্দেশিত। রেজিস্টার্ড চিকিৎসকের পরামর্শ অনুযায়ী সেব্য।`}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="text-xs font-black text-[#0f4c3a] uppercase">🥄 মাত্রা ও সেবনবিধি (Dosage)</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {(medicine as any).dosage ||
                  "প্রাপ্তবয়স্ক: প্রতিদিন ১টি করে ট্যাবলেট/ক্যাপসুল দিনে ১ থেকে ২ বার খাবার পূর্বে বা পরে অথবা ডাক্তারের পরামর্শ অনুযায়ী সেব্য।"}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="text-xs font-black text-rose-700 uppercase">⚠️ পার্শ্বপ্রতিক্রিয়া (Side Effects)</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {(medicine as any).sideEffects ||
                  "সাধারণত সুসহনীয়। তবে কিছু ক্ষেত্রে হালকা বমি ভাব, মাথা ঘোরা, পেটে গ্যাস বা অস্বস্তি দেখা দিতে পারে।"}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="text-xs font-black text-amber-800 uppercase">🛡️ সতর্কতা ও সংরক্ষণ (Storage)</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                আলো ও আর্দ্রতা থেকে দূরে, ৩০° সে. তাপমাত্রার নিচে সংরক্ষণ করুন। শিশুদের নাগালের বাইরে রাখুন।
              </p>
            </div>
          </div>

          {/* Alternative Brands List with Savings */}
          {alternatives.length > 0 && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  🔄 একই জেনেরিকের বিকল্প ব্র্যান্ড ও মূল্যের তুলনা ({medicine.generic})
                </h4>
                <a
                  href={`/compare?generic=${encodeURIComponent(medicine.generic)}`}
                  className="text-xs font-black text-[#0f4c3a] hover:underline"
                >
                  সবগুলোর দাম তুলনা করুন →
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {alternatives.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => onSelectAlternative && onSelectAlternative(alt)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-[#0f4c3a] bg-slate-50 hover:bg-emerald-50/40 transition flex justify-between items-center cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-black text-slate-900 truncate">
                        {alt.brand} <span className="text-[10px] text-slate-500">{alt.strength}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{alt.company}</div>
                    </div>
                    <span className="text-xs font-black font-mono text-[#0f4c3a] shrink-0">
                      ৳{alt.priceTk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}