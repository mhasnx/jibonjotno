"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MASTER_CATALOG, CatalogItem } from "@/data/medicinesCatalog";

function AdminMedicineThumb({ item }: { item: CatalogItem }) {
  const [imgErr, setImgErr] = useState(false);

  const badgeGradients: Record<string, string> = {
    Gastric: "from-emerald-700 to-teal-800",
    Fever: "from-amber-600 to-orange-700",
    Pain: "from-rose-600 to-red-800",
    Antibiotic: "from-indigo-600 to-blue-900",
    Allergy: "from-cyan-600 to-sky-800",
    Vitamin: "from-teal-600 to-emerald-800",
    Cardiac: "from-red-600 to-rose-900",
    Diabetes: "from-purple-600 to-indigo-900",
    Equipment: "from-slate-700 to-slate-900",
  };

  const gradient = badgeGradients[item.category] || "from-emerald-700 to-teal-900";

  if (item.imageUrl && !imgErr && !item.imageUrl.includes("scribd")) {
    return (
      <div className="w-12 h-12 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
        <img
          src={item.imageUrl}
          alt={item.brand}
          onError={() => setImgErr(true)}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  }

  // Clean 3D Pharmaceutical Visual Box Fallback (No Broken Image Icons!)
  return (
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white flex flex-col justify-between p-1 shrink-0 shadow-2xs select-none border border-black/10`}>
      <span className="text-[7px] font-black uppercase tracking-tighter truncate opacity-85">
        {item.dosageForm}
      </span>
      <div className="text-center">
        <span className="text-[9px] font-black leading-none block truncate">
          {item.brand.slice(0, 5)}
        </span>
      </div>
      <span className="text-[6px] font-bold text-center opacity-75 truncate">
        {item.strength}
      </span>
    </div>
  );
}

export default function AdminMedicinesPage() {
  const [mounted, setMounted] = useState(false);
  const [medicines, setMedicines] = useState<CatalogItem[]>(MASTER_CATALOG);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const itemsPerPage = 20;

  useEffect(() => {
    setMounted(true);
    fetch("/data/all_medicines.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMedicines([...MASTER_CATALOG, ...data]);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return medicines;
    return medicines.filter(
      (m) =>
        m.brand.toLowerCase().includes(q) ||
        m.generic.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q)
    );
  }, [medicines, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleDelete = (id: string) => {
    if (confirm("Apni ki shotti ei oushodh-ti talika theke muche felte chan?")) {
      setMedicines((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setMedicines((prev) =>
      prev.map((m) => (m.id === editingItem.id ? editingItem : m))
    );
    setEditingItem(null);
  };

  const handleSaveNew = (newItem: CatalogItem) => {
    setMedicines((prev) => [newItem, ...prev]);
    setIsAddOpen(false);
  };

  if (!mounted) {
    return (
      <div className="p-8 text-center text-xs font-bold text-slate-400">
        অ্যাডমিন ক্যাটালগ লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            ঔষধ ক্যাটালগ ম্যানেজমেন্ট (Medicine Database)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            এখান থেকে প্রতিটি ওষুধের ছবি, জেনেরিক, কোম্পানি, দাম ও বিবরণী এডিট বা নতুন পণ্য যুক্ত করতে পারবেন।
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-[#0f4c3a] hover:bg-emerald-950 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-xs flex items-center space-x-1.5 shrink-0"
        >
          <span>➕ নতুন ঔষধ যোগ করুন</span>
        </button>
      </div>

      {/* Search & Counter Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="text-xs font-bold text-slate-700">
          মোট নিবন্ধিত ঔষধ: <strong className="text-[#0f4c3a]">{filtered.length}</strong> টি • পৃষ্ঠা {currentPage} / {totalPages}
        </div>
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="ব্র্যান্ড বা জেনেরিক দিয়ে খুঁজুন..."
            className="w-full pl-3 pr-8 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">মোড়ক ও ব্র্যান্ড</th>
                <th className="py-3.5 px-4">জেনেরিক ও কোম্পানি</th>
                <th className="py-3.5 px-4">শক্তি ও ফর্ম</th>
                <th className="py-3.5 px-4">মূল্য (টাকা)</th>
                <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
                <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50/70 transition">
                  {/* Morok o Brand */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <AdminMedicineThumb item={med} />
                      <div className="min-w-0">
                        <div className="font-extrabold text-slate-900 text-sm truncate max-w-[160px]">
                          {med.brand}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {med.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Generic o Company */}
                  <td className="py-3 px-4 max-w-[220px]">
                    <div className="font-bold text-emerald-800 text-xs truncate">
                      🧬 {med.generic}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      🏢 {med.company}
                    </div>
                  </td>

                  {/* Strength o Form */}
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-200">
                      {med.dosageForm} • {med.strength}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-black text-slate-900 text-sm font-mono">
                    ৳ {med.priceTk}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center">
                    {med.requiresRx ? (
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded">
                        Rx প্রেসক্রিপশন
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                        OTC নিরাপদ
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => setEditingItem(med)}
                        className="bg-slate-900 hover:bg-black text-white px-3 py-1 rounded-lg text-xs font-bold transition shadow-2xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(med.id)}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition shadow-2xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-4 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              ← Previous
            </button>
            <span className="text-xs font-bold text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Edit Medicine Details
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{editingItem.brand}</h3>
              </div>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 font-bold text-base">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Brand Name *</label>
                <input
                  type="text"
                  value={editingItem.brand}
                  onChange={(e) => setEditingItem({ ...editingItem, brand: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1">Generic Formula *</label>
                  <input
                    type="text"
                    value={editingItem.generic}
                    onChange={(e) => setEditingItem({ ...editingItem, generic: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Strength (মাত্রা)</label>
                  <input
                    type="text"
                    value={editingItem.strength}
                    onChange={(e) => setEditingItem({ ...editingItem, strength: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1">Manufacturer (Company)</label>
                  <input
                    type="text"
                    value={editingItem.company}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Unit Price (টাকা) *</label>
                  <input
                    type="text"
                    value={editingItem.priceTk}
                    onChange={(e) => setEditingItem({ ...editingItem, priceTk: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Packaging Image URL (Online Photo Link)</label>
                <input
                  type="url"
                  value={editingItem.imageUrl || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-[#0f4c3a] text-white px-5 py-2 rounded-xl font-bold transition shadow-xs"
                >
                  ✓ তথ্য আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Medicine Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  New Medicine Creation
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">নতুন ঔষধ অন্তর্ভুক্ত করুন</h3>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 font-bold text-base">✕</button>
            </div>

            <form
              onSubmit={(e: any) => {
                e.preventDefault();
                const form = e.target;
                const newItem: CatalogItem = {
                  id: `med-${Date.now()}`,
                  brand: form.brand.value,
                  generic: form.generic.value,
                  strength: form.strength.value || "Standard",
                  dosageForm: form.dosageForm.value || "Tablet",
                  company: form.company.value || "Verified Pharma Ltd.",
                  category: form.category.value || "Gastric",
                  priceTk: form.priceTk.value || "5.00",
                  stripPriceTk: (parseFloat(form.priceTk.value || "5.00") * 10).toFixed(2),
                  packInfoBn: `প্রতি পাতা (১০টি): ৳ ${(parseFloat(form.priceTk.value || "5.00") * 10).toFixed(2)}`,
                  packInfoEn: `Per Strip (10 Units): ৳ ${(parseFloat(form.priceTk.value || "5.00") * 10).toFixed(2)}`,
                  imageUrl: form.imageUrl.value || "",
                  requiresRx: form.requiresRx.checked,
                  indicationsBn: `${form.brand.value} চিকিৎসকের পরামর্শ অনুযায়ী সেব্য।`,
                  indicationsEn: `Indicated for clinical treatments.`,
                  dosingBn: "চিকিৎসকের পরামর্শ অনুযায়ী সেব্য।",
                  dosingEn: "As directed by physician.",
                  sideEffectsBn: "সুনির্দিষ্ট পার্শ্বপ্রতিক্রিয়া নেই।",
                  sideEffectsEn: "No significant adverse effects reported.",
                  pregnancyBn: "গর্ভাবস্থায় ব্যবহারের পূর্বে চিকিৎসকের পরামর্শ আবশ্যক।",
                  pregnancyEn: "Consult physician before use.",
                  precautionsBn: "শিশুদের নাগালের বাইরে রাখুন।",
                  precautionsEn: "Keep out of reach of children.",
                  storageBn: "শুষ্ক ও শীতল স্থানে রাখুন।",
                  storageEn: "Store in a cool dry place."
                };
                handleSaveNew(newItem);
              }}
              className="space-y-3 text-xs font-semibold"
            >
              <div>
                <label className="block text-slate-700 mb-1">Brand Name *</label>
                <input name="brand" type="text" placeholder="যেমন: Napa Extra" className="w-full p-2.5 rounded-xl border border-slate-200" required />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1">Generic Formula *</label>
                  <input name="generic" type="text" placeholder="Paracetamol + Caffeine" className="w-full p-2.5 rounded-xl border border-slate-200" required />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Strength (মাত্রা)</label>
                  <input name="strength" type="text" placeholder="500mg+65mg" className="w-full p-2.5 rounded-xl border border-slate-200" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1">Dosage Form</label>
                  <select name="dosageForm" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white">
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Injection">Injection</option>
                    <option value="Device">Device</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Category</label>
                  <select name="category" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white">
                    <option value="Gastric">Gastric</option>
                    <option value="Fever">Fever</option>
                    <option value="Pain">Pain</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Allergy">Allergy</option>
                    <option value="Vitamin">Vitamin</option>
                    <option value="Cardiac">Cardiac</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1">Company *</label>
                  <input name="company" type="text" placeholder="Beximco Pharma" className="w-full p-2.5 rounded-xl border border-slate-200" required />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Unit Price (টাকা) *</label>
                  <input name="priceTk" type="text" placeholder="2.50" className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold" required />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Image URL (Optional)</label>
                <input name="imageUrl" type="url" placeholder="https://..." className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-[11px]" />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input type="checkbox" name="requiresRx" id="rx-check-new" className="accent-emerald-700" />
                <label htmlFor="rx-check-new" className="text-slate-700 cursor-pointer">প্রেসক্রিপশন আবশ্যক (Rx Only)</label>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold">বাতিল</button>
                <button type="submit" className="bg-[#0f4c3a] text-white px-5 py-2 rounded-xl font-bold transition shadow-xs">✓ ক্যাটালগে সেভ করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}