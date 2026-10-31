"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CatalogItem } from "@/data/medicinesCatalog";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import StructuredData from "@/components/seo/StructuredData";

export default function MedicinePackagingModal({
  medicine,
  onClose,
}: {
  medicine: CatalogItem;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [imgErr, setImgErr] = useState(false);
  const [added, setAdded] = useState(false);

  if (!medicine) return null;

  const handleAdd = () => {
    addToCart({
      id: medicine.id,
      name: `${medicine.brand} (${medicine.strength})`,
      generic: medicine.generic,
      company: medicine.company,
      price: parseFloat(medicine.priceTk) || 5.0,
      requiresRx: medicine.requiresRx,
      dosageForm: medicine.dosageForm,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[70] flex items-center justify-center p-4"
    >
      {/* Dynamic Drug Schema.org JSON-LD Rich Snippet */}
      <StructuredData type="Drug" medicine={medicine} />

      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-black flex items-center justify-center transition cursor-pointer"
        >
          ✕
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          {medicine.imageUrl && !imgErr && !medicine.imageUrl.includes("scribd") ? (
            <div className="w-24 h-24 rounded-2xl border border-slate-200 bg-white p-2 flex items-center justify-center shrink-0">
              <img
                src={medicine.imageUrl}
                alt={medicine.brand}
                onError={() => setImgErr(true)}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0f4c3a] to-emerald-950 text-white p-3 flex flex-col justify-between shrink-0 shadow-md">
              <span className="text-[9px] font-black uppercase opacity-80">{medicine.dosageForm}</span>
              <div className="text-center">
                <div className="text-xs font-black truncate">{medicine.brand}</div>
                <div className="text-[9px] text-emerald-200 font-bold truncate">{medicine.strength}</div>
              </div>
              <span className="text-[8px] text-center bg-black/25 rounded py-0.5 font-mono truncate">
                3D Pack
              </span>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                {medicine.dosageForm}
              </span>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                {medicine.category}
              </span>
              {medicine.requiresRx ? (
                <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full">
                  Rx Prescription Required
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  OTC Safe
                </span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              {medicine.brand} <span className="text-sm font-bold text-slate-500">{medicine.strength}</span>
            </h2>
            <p className="text-xs font-bold text-emerald-800">{medicine.generic}</p>
            <p className="text-xs text-slate-500">{medicine.company}</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Unit Price & Pack Info</div>
            <div className="text-xl font-black text-[#0f4c3a] font-mono">
              BDT {medicine.priceTk} <span className="text-xs font-normal text-slate-500">/ unit</span>
            </div>
            {medicine.packInfoEn && (
              <div className="text-xs text-slate-600 mt-0.5">{t(medicine.packInfoBn, medicine.packInfoEn)}</div>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="w-full sm:w-auto bg-[#0f4c3a] hover:bg-emerald-900 text-white px-6 py-3 rounded-xl text-xs font-black transition shadow-md cursor-pointer"
          >
            {added ? "✓ Added to Bag!" : "+ Add to Pharmacy Bag (COD)"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
            <div className="font-black text-slate-900">Indications</div>
            <p className="text-slate-600 leading-relaxed">{t(medicine.indicationsBn, medicine.indicationsEn)}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
            <div className="font-black text-slate-900">Dosage & Administration</div>
            <p className="text-slate-600 leading-relaxed">{t(medicine.dosingBn, medicine.dosingEn)}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
            <div className="font-black text-slate-900">Side Effects</div>
            <p className="text-slate-600 leading-relaxed">{t(medicine.sideEffectsBn, medicine.sideEffectsEn)}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
            <div className="font-black text-slate-900">Precautions & Storage</div>
            <p className="text-slate-600 leading-relaxed">
              {t(medicine.precautionsBn, medicine.precautionsEn)} • {t(medicine.storageBn, medicine.storageEn)}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}