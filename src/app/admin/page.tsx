"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { MASTER_CATALOG, CatalogItem } from "@/data/medicinesCatalog";

export default function FullAdminDashboard() {
  const [activeTab, setActiveTab] = useState<"CATALOG" | "ADD_NEW">("CATALOG");
  const [medicines, setMedicines] = useState<CatalogItem[]>(MASTER_CATALOG as any);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Edit State
  const [editingMed, setEditingMed] = useState<any | null>(null);
  const [editBrand, setEditBrand] = useState("");
  const [editGeneric, setEditGeneric] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editStrength, setEditStrength] = useState("");
  const [editDosage, setEditDosage] = useState("Tablet");
  const [editCategory, setEditCategory] = useState("Gastric");
  const [editPrice, setEditPrice] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editYoutubeUrl, setEditYoutubeUrl] = useState("");
  const [editRx, setEditRx] = useState(false);

  // Add New State
  const [newBrand, setNewBrand] = useState("");
  const [newGeneric, setNewGeneric] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newStrength, setNewStrength] = useState("");
  const [newDosage, setNewDosage] = useState("Tablet");
  const [newCategory, setNewCategory] = useState("Gastric");
  const [newPrice, setNewPrice] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newYoutubeUrl, setNewYoutubeUrl] = useState("");
  const [newRx, setNewRx] = useState(false);

  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  useEffect(() => {
    setIsLoading(true);
    const customSaved = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("jj_custom_medicines") || "[]") : [];
    const priceOverrides = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("jj_medicine_overrides") || "{}") : {};

    fetch("/data/all_medicines.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const baseList: any[] = Array.isArray(data) && data.length > 0 ? [...MASTER_CATALOG, ...data] : MASTER_CATALOG;
        const merged = baseList.map((item: any) =>
          priceOverrides[item.id] ? { ...item, ...priceOverrides[item.id] } : item
        );
        setMedicines([...customSaved, ...merged] as any);
      })
      .catch(() => {
        setMedicines([...customSaved, ...MASTER_CATALOG] as any);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jj_admin_session");
    localStorage.removeItem("admin_authenticated");
    document.cookie = "admin_token=; path=/; max-age=0";
    window.location.href = "/admin-login";
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return medicines.filter((m: any) => {
      if (!q) return true;
      return (
        (m.brand || "").toLowerCase().includes(q) ||
        (m.generic || "").toLowerCase().includes(q) ||
        (m.company || "").toLowerCase().includes(q)
      );
    });
  }, [medicines, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const openEdit = (med: any) => {
    setEditingMed(med);
    setEditBrand(med.brand || "");
    setEditGeneric(med.generic || "");
    setEditCompany(med.company || "");
    setEditStrength(med.strength || "");
    setEditDosage(med.dosageForm || "Tablet");
    setEditCategory(med.category || "Gastric");
    setEditPrice(med.priceTk || "5.00");
    setEditImageUrl(med.imageUrl || "");
    setEditYoutubeUrl(med.youtubeUrl || "");
    setEditRx(Boolean(med.requiresRx));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMed) return;

    const updated = {
      ...editingMed,
      brand: editBrand,
      generic: editGeneric,
      company: editCompany,
      strength: editStrength,
      dosageForm: editDosage,
      category: editCategory,
      priceTk: editPrice,
      imageUrl: editImageUrl || "",
      youtubeUrl: editYoutubeUrl || "",
      requiresRx: editRx,
    };

    setMedicines((prev: any[]) => prev.map((m) => (m.id === editingMed.id ? updated : m)));
    const overrides = JSON.parse(localStorage.getItem("jj_medicine_overrides") || "{}");
    overrides[editingMed.id] = updated;
    localStorage.setItem("jj_medicine_overrides", JSON.stringify(overrides));

    setEditingMed(null);
    showToast(`✓ "${updated.brand}" এর তথ্য, মূল্য ও YouTube লিংক সফলভাবে সংরক্ষিত হয়েছে!`);
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      id: "jj-med-" + Date.now(),
      brand: newBrand,
      generic: newGeneric,
      company: newCompany,
      strength: newStrength || "500 mg",
      dosageForm: newDosage,
      category: newCategory,
      priceTk: newPrice || "5.00",
      imageUrl: newImageUrl || "",
      youtubeUrl: newYoutubeUrl || "",
      requiresRx: newRx,
    };

    setMedicines((prev: any[]) => [newItem, ...prev]);
    const existing = JSON.parse(localStorage.getItem("jj_custom_medicines") || "[]");
    localStorage.setItem("jj_custom_medicines", JSON.stringify([newItem, ...existing]));

    setNewBrand("");
    setNewGeneric("");
    setNewCompany("");
    setNewStrength("");
    setNewPrice("");
    setNewImageUrl("");
    setNewYoutubeUrl("");
    setActiveTab("CATALOG");
    showToast(`✓ নতুন ওষুধ "${newItem.brand}" ডাটাবেজে যুক্ত হয়েছে!`);
  };

  return (
    <div className="min-h-screen bg-[#071310] text-slate-100 flex flex-col font-sans">
      <header className="bg-[#0b1f1a] border-b border-emerald-900/60 px-4 md:px-8 py-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-white shadow-md">
            জ
          </div>
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-emerald-500/30">
              SUPER ADMIN HUB
            </span>
            <h1 className="text-lg md:text-xl font-black text-white mt-0.5">
              জীবনযত্ন প্রশাসনিক পোর্টাল
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/medicines"
            className="bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/50 text-xs font-bold px-3.5 py-2 rounded-xl transition"
          >
            💊 পাবলিক ক্যাটালগ
          </Link>
          <button
            onClick={handleLogout}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
          >
            লগআউট
          </button>
        </div>
      </header>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-black z-50">
          {toast}
        </div>
      )}

      <div className="bg-[#091915] border-b border-emerald-950 px-4 md:px-8 py-3 flex items-center gap-2 overflow-x-auto">
        {[
          { id: "CATALOG", label: "💊 ওষুধ মূল্য, ছবি ও YouTube ভিডিও এডিটর" },
          { id: "ADD_NEW", label: "➕ নতুন ওষুধ ও ভিডিও যোগ করুন" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === tab.id ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex-1 w-full space-y-6">
        {activeTab === "CATALOG" && (
          <div className="bg-[#0b1f1a] border border-emerald-900/50 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-lg font-black text-white">
                  সম্পূর্ণ ওষুধ তালিকা ও মাল্টিমিডিয়া এডিটর
                </h2>
                <p className="text-xs text-slate-400">
                  মোট ডেটাবেজ: <strong className="text-emerald-400">{medicines.length.toLocaleString()}</strong> টি ওষুধ
                </p>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="ব্র্যান্ড বা জেনেরিক খুঁজুন..."
                className="w-full sm:w-80 bg-[#071310] border border-emerald-800/80 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-emerald-900/60 text-[11px] text-slate-400 uppercase">
                    <th className="py-3.5 px-4">ব্র্যান্ড ও শক্তি</th>
                    <th className="py-3.5 px-4">জেনেরিক নাম</th>
                    <th className="py-3.5 px-4">কোম্পানি</th>
                    <th className="py-3.5 px-4">মূল্য (BDT)</th>
                    <th className="py-3.5 px-4">YouTube ভিডিও</th>
                    <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/80 text-xs">
                  {paginated.map((med: any) => (
                    <tr key={med.id} className="hover:bg-emerald-950/30 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-black text-white text-sm">
                          {med.brand} <span className="text-emerald-400 font-mono text-xs">{med.strength}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{med.dosageForm}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{med.generic}</td>
                      <td className="py-3.5 px-4 text-slate-400">{med.company}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-amber-400">৳ {med.priceTk}</td>
                      <td className="py-3.5 px-4">
                        {med.youtubeUrl ? (
                          <a
                            href={med.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-red-600/20 text-red-400 border border-red-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 hover:bg-red-600 hover:text-white transition"
                          >
                            ▶ ভিডিও লিংক
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-600">নাই</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openEdit(med)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl font-bold transition cursor-pointer"
                        >
                          ✏️ এডিট তথ্য ও ভিডিও
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4 border-t border-emerald-900/40">
                <span className="text-xs text-slate-400">
                  ফলাফল: <strong className="text-white">{filtered.length}</strong> টি
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-bold disabled:opacity-40"
                  >
                    ← পূর্ববর্তী
                  </button>
                  <span className="text-xs font-mono bg-[#071310] px-3 py-1.5 rounded-xl border border-emerald-900">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-bold disabled:opacity-40"
                  >
                    পরবর্তী →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "ADD_NEW" && (
          <div className="bg-[#0b1f1a] border border-emerald-900/50 rounded-3xl p-6 max-w-3xl mx-auto space-y-5 shadow-xl">
            <h2 className="text-lg font-black text-white">➕ নতুন ওষুধ ও YouTube ভিডিও যোগ করুন</h2>
            <form onSubmit={handleAddNew} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">ব্র্যান্ড নাম *</label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="যেমন: Napa Extend"
                    required
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">শক্তি (Strength) *</label>
                  <input
                    type="text"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    placeholder="যেমন: 665 mg"
                    required
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">জেনেরিক নাম *</label>
                  <input
                    type="text"
                    value={newGeneric}
                    onChange={(e) => setNewGeneric(e.target.value)}
                    placeholder="যেমন: Paracetamol"
                    required
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">কোম্পানির নাম *</label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="যেমন: Beximco Pharmaceuticals Ltd."
                    required
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">ইউনিট মূল্য (BDT) *</label>
                  <input
                    type="text"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="যেমন: 2.00"
                    required
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-amber-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-red-400 font-bold block mb-1">▶ YouTube ভিডিও লিঙ্ক (ঐচ্ছিক)</label>
                  <input
                    type="url"
                    value={newYoutubeUrl}
                    onChange={(e) => setNewYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-[#071310] border border-red-700/60 text-xs p-3 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-xs transition cursor-pointer shadow-lg"
              >
                ✓ ওষুধ ও তথ্য সংরক্ষণ করুন
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingMed && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b1f1a] border border-emerald-700/60 w-full max-w-xl p-6 rounded-3xl space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-emerald-900 pb-3">
              <h3 className="text-base font-black text-white">
                ✏️ ওষুধের তথ্য ও YouTube লিংক এডিট ({editingMed.brand})
              </h3>
              <button
                onClick={() => setEditingMed(null)}
                className="text-slate-400 hover:text-white font-black text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">ব্র্যান্ড নাম</label>
                  <input
                    type="text"
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">শক্তি</label>
                  <input
                    type="text"
                    value={editStrength}
                    onChange={(e) => setEditStrength(e.target.value)}
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">জেনেরিক নাম</label>
                  <input
                    type="text"
                    value={editGeneric}
                    onChange={(e) => setEditGeneric(e.target.value)}
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">কোম্পানির নাম</label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-amber-300 font-bold block mb-1">ইউনিট মূল্য (BDT)</label>
                <input
                  type="text"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full bg-[#071310] border border-amber-500/70 text-xs p-3 rounded-xl text-amber-300 font-mono font-black"
                  required
                />
              </div>

              <div className="bg-red-950/30 border border-red-800/50 p-3.5 rounded-2xl space-y-1.5">
                <label className="text-xs text-red-300 font-black flex items-center gap-1.5">
                  <span>▶</span> YouTube Video Hyperlink / Guide URL
                </label>
                <input
                  type="url"
                  value={editYoutubeUrl}
                  onChange={(e) => setEditYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-[#071310] border border-red-700/70 text-xs p-3 rounded-xl text-white font-mono focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMed(null)}
                  className="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer"
                >
                  ✓ সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}