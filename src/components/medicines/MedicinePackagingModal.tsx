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
  const [imgError, setImgError] = useState(false);
  const [viewMode, setViewMode] = useState<"PACK" | "STRIP">("PACK");
  const [alternatives, setAlternatives] = useState<CatalogItem[]>([]);
  const [addedMsg, setAddedMsg] = useState(false);

  const unitPrice = parseFloat(medicine.priceTk) || 5.0;
  const stripPrice = (unitPrice * 10).toFixed(2);
  const boxPrice = (unitPrice * 60).toFixed(2);

  // Helper to extract YouTube Embed ID
  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const ytEmbed = getEmbedUrl((medicine as any).youtubeUrl);

  useEffect(() => {
    setImgError(false);
    const localPool = allMedicines.length > 0 ? allMedicines : MASTER_CATALOG;
    const localMatches = localPool
      .filter(
        (m) =>
          m.generic?.toLowerCase() === medicine.generic?.toLowerCase() &&
          m.brand?.toLowerCase() !== medicine.brand?.toLowerCase()
      )
      .slice(0, 6);
    setAlternatives(localMatches);
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
      className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-[#0f4c3a] via-[#0b3b2d] to-[#06231b] text-white p-5 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-rose-600 text-white flex items-center justify-center font-black transition cursor-pointer"
          >
            ✕
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-64 shrink-0 flex flex-col items-center">
              {viewMode === "PACK" ? (
                <div className="w-60 h-44 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-emerald-50 text-slate-900 p-4 shadow-2xl border-2 border-emerald-300 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#0f4c3a] via-emerald-500 to-amber-500" />
                  <div className="flex justify-between items-start pt-1">
                    <span className="text-[9px] font-black uppercase tracking-wider bg-[#0f4c3a] text-white px-2 py-0.5 rounded">
                      {medicine.dosageForm}
                    </span>
                    <span className="text-[9px] font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                      {medicine.requiresRx ? "Rx Only" : "OTC Verified"}
                    </span>
                  </div>

                  <div className="my-auto py-1 border-y border-slate-200/80">
                    <h4 className="text-lg font-black text-[#0f4c3a] leading-tight truncate">
                      {medicine.brand}®
                    </h4>
                    <p className="text-[11px] font-extrabold text-amber-700">{medicine.strength}</p>
                    <p className="text-[10px] font-bold text-slate-600 truncate mt-0.5">
                      {medicine.generic}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                    <span className="truncate max-w-[140px]">🏢 {medicine.company}</span>
                    <span className="font-mono text-[#0f4c3a] font-black">Pack Info</span>
                  </div>
                </div>
              ) : (
                <div className="w-60 h-44 rounded-2xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 text-slate-800 p-3.5 shadow-2xl border-2 border-slate-400 flex flex-col justify-between">
                  <div className="text-[9px] font-black text-center text-slate-600 uppercase tracking-widest border-b border-slate-300 pb-1">
                    {medicine.brand} • Blister Strip (10 Units)
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
                    {medicine.company} • ৳{stripPrice}
                  </div>
                </div>
              )}

              <div className="flex gap-1.5 mt-2.5">
                <button
                  type="button"
                  onClick={() => setViewMode("PACK")}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black cursor-pointer transition ${
                    viewMode === "PACK" ? "bg-amber-400 text-slate-950" : "bg-white/15 text-emerald-100"
                  }`}
                >
                  📦 Packet View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("STRIP")}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black cursor-pointer transition ${
                    viewMode === "STRIP" ? "bg-amber-400 text-slate-950" : "bg-white/15 text-emerald-100"
                  }`}
                >
                  💊 Strip View
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-2.5 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {medicine.brand}{" "}
                <span className="text-base sm:text-lg font-extrabold text-amber-300">
                  {medicine.strength}
                </span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-emerald-200">
                🧬 Generic: <span className="underline">{medicine.generic}</span>
              </p>
              <p className="text-xs text-slate-300 font-semibold">
                🏢 Company: {medicine.company}
              </p>

              {(medicine as any).youtubeUrl && (
                <div className="pt-1">
                  <a
                    href={(medicine as any).youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition"
                  >
                    <span>▶</span> YouTube Video Guide Dekhun
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-7 overflow-y-auto space-y-5 bg-slate-50/70 flex-1">
          {/* YouTube Video Player Embed if provided */}
          {ytEmbed && (
            <div className="bg-white rounded-2xl p-4 border border-red-200 shadow-sm space-y-2">
              <h4 className="text-xs font-black text-red-600 uppercase flex items-center gap-1.5">
                <span>▶</span> Official Medicine Video Guide
              </h4>
              <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden bg-black">
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

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                UNIT PRICE & PACK INFO
              </span>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-2xl font-black text-[#0f4c3a] font-mono">
                  BDT {unitPrice.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-semibold">/ unit</span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-600 pt-0.5">
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
              {addedMsg ? "✓ Added to Bag!" : "+ Order (Cash on Delivery)"}
            </button>
          </div>

          {/* Clinical Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="text-xs font-black text-[#0f4c3a] uppercase">🩺 Indications</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {(medicine as any).indications || `${medicine.brand} (${medicine.generic}) is indicated for ${medicine.category} conditions.`}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="text-xs font-black text-[#0f4c3a] uppercase">🥄 Dosage & Administration</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {(medicine as any).dosage || "Adults: 1 tablet once or twice daily as directed by registered physician."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}