"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MASTER_CATALOG, CatalogItem } from "@/data/medicinesCatalog";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<CatalogItem[]>(MASTER_CATALOG);
  const [totalCount, setTotalCount] = useState(35941);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Form states (including imageUrl / Picture URL)
  const [formBrand, setFormBrand] = useState("");
  const [formGeneric, setFormGeneric] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formStrength, setFormStrength] = useState("");
  const [formCategory, setFormCategory] = useState("Gastric");
  const [formDosageForm, setFormDosageForm] = useState("Tablet");
  const [formRequiresRx, setFormRequiresRx] = useState(false);
  const [formImageUrl, setFormImageUrl] = useState("");

  // Server API call for dynamic 35,941+ items search & pagination
  useEffect(() => {
    setIsLoading(true);
    const queryStr = new URLSearchParams({
      q: searchTerm,
      limit: "50",
      page: currentPage.toString(),
    }).toString();

    fetch(`/api/medicines?${queryStr}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          setMedicines(data.items);
          setTotalCount(data.total || 35941);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [searchTerm, currentPage]);

  const handleLogout = () => {
    document.cookie = "admin_token=; path=/; max-age=0";
    document.cookie = "admin_auth=; path=/; max-age=0";
    if (typeof window !== "undefined") {
      localStorage.removeItem("jibonjotno_admin_auth");
    }
    window.location.href = "/admin-login";
  };

  const startEditing = (med: CatalogItem) => {
    setEditingItem(med);
    setFormBrand(med.brand || "");
    setFormGeneric(med.generic || "");
    setFormCompany(med.company || "");
    setFormPrice(med.priceTk || "5.00");
    setFormStrength(med.strength || "");
    setFormCategory(med.category || "Gastric");
    setFormDosageForm(med.dosageForm || "Tablet");
    setFormRequiresRx(!!med.requiresRx);
    setFormImageUrl(med.imageUrl || "");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updatedList = medicines.map((med) => {
      if (med.id === editingItem.id) {
        return {
          ...med,
          brand: formBrand,
          generic: formGeneric,
          company: formCompany,
          priceTk: formPrice,
          strength: formStrength,
          category: formCategory,
          dosageForm: formDosageForm,
          requiresRx: formRequiresRx,
          imageUrl: formImageUrl,
        };
      }
      return med;
    });

    setMedicines(updatedList);
    setSuccessMsg(`"${formBrand}"-à¦à¦° à¦®à§‚à¦²à§à¦¯, à¦›à¦¬à¦¿ à¦“ à¦¤à¦¥à§à¦¯ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦¹à§Ÿà§‡à¦›à§‡!`);
    setEditingItem(null);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: CatalogItem = {
      id: "med-" + Date.now(),
      brand: formBrand,
      generic: formGeneric,
      company: formCompany,
      priceTk: formPrice || "10.00",
      strength: formStrength || "500mg",
      category: formCategory,
      dosageForm: formDosageForm || "Tablet",
      requiresRx: formRequiresRx,
      imageUrl: formImageUrl || undefined,
    };

    setMedicines([newItem, ...medicines]);
    setTotalCount((prev) => prev + 1);
    setSuccessMsg(`à¦¨à¦¤à§à¦¨ à¦“à¦·à§à¦§ "${formBrand}" à¦¸à¦«à¦²à¦­à¦¾à¦¬à§‡ à¦¯à§à¦•à§à¦¤ à¦¹à§Ÿà§‡à¦›à§‡!`);
    setIsAddingNew(false);
    resetForm();
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const resetForm = () => {
    setFormBrand("");
    setFormGeneric("");
    setFormCompany("");
    setFormPrice("");
    setFormStrength("");
    setFormCategory("Gastric");
    setFormDosageForm("Tablet");
    setFormRequiresRx(false);
    setFormImageUrl("");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans pb-12">
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider">
            Super Admin Hub
          </span>
          <h1 className="text-xl font-black text-white">à¦œà§€à¦¬à¦¨à¦¯à¦¤à§à¦¨ à¦ªà§à¦°à¦¶à¦¾à¦¸à¦¨à¦¿à¦• à¦ªà§‹à¦°à§à¦Ÿà¦¾à¦²</h1>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="/"
            target="_blank"
            className="text-xs font-bold text-slate-300 hover:text-emerald-400 transition"
          >
            ðŸŒ à¦­à¦¿à¦œà¦¿à¦Ÿ à¦²à¦¾à¦‡à¦­ à¦¸à¦¾à¦‡à¦Ÿ
          </a>
          <button
            onClick={handleLogout}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-sm"
          >
            à¦²à¦—à¦†à¦‰à¦Ÿ à¦•à¦°à§à¦¨
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-1 w-full space-y-6">
        {successMsg && (
          <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-5 py-3 rounded-2xl text-sm font-bold flex items-center space-x-2">
            <span>âœ“ {successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase">à¦®à§‹à¦Ÿ à¦“à¦·à§à¦§ à¦¡à¦¾à¦Ÿà¦¾à¦¬à§‡à¦œ</span>
            <div className="text-3xl font-black text-emerald-400 font-mono mt-2">
              {totalCount.toLocaleString()} +
            </div>
            <span className="text-[11px] text-slate-500 mt-1">à¦¸à¦•à§à¦°à¦¿à¦¯à¦¼ à¦•à§à¦¯à¦¾à¦Ÿà¦¾à¦²à¦— à¦†à¦‡à¦Ÿà§‡à¦®</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase">à¦¨à¦¤à§à¦¨ à¦“à¦·à§à¦§ à¦¯à§à¦•à§à¦¤ à¦•à¦°à§à¦¨</span>
            <button
              onClick={() => {
                resetForm();
                setIsAddingNew(true);
                setEditingItem(null);
              }}
              className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2.5 px-4 rounded-xl transition cursor-pointer shadow-md"
            >
              + à¦¨à¦¤à§à¦¨ à¦“à¦·à§à¦§ à¦à¦¨à§à¦Ÿà§à¦°à¦¿ à¦•à¦°à§à¦¨
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase">à¦à¦¡à¦®à¦¿à¦¨ à¦¸à§à¦Ÿà§à¦¯à¦¾à¦Ÿà¦¾à¦¸</span>
            <div className="text-sm font-black text-amber-400 mt-2 flex items-center space-x-1.5">
              <span>ðŸ›¡ï¸ Full Edit & Picture Upload Active</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">à¦…à§à¦¯à¦¾à¦•à§à¦¸à§‡à¦¸ à¦²à§‡à¦­à§‡à¦²: à¦¸à§à¦ªà¦¾à¦° à¦…à§à¦¯à¦¾à¦¡à¦®à¦¿à¦¨</span>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-black text-white">à¦“à¦·à§à¦§à§‡à¦° à¦®à§‚à¦²à§à¦¯, à¦›à¦¬à¦¿ à¦“ à¦•à§à¦¯à¦¾à¦Ÿà¦¾à¦²à¦— à¦®à§à¦¯à¦¾à¦¨à§‡à¦œà¦®à§‡à¦¨à§à¦Ÿ</h2>
              <p className="text-xs text-slate-400">à§©à§«,à§¯à§ªà§§+ à¦¡à¦¾à¦Ÿà¦¾à¦¬à§‡à¦œ à¦¥à§‡à¦•à§‡ à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦“à¦·à§à¦§ à¦–à§à¦à¦œà§à¦¨ à¦à¦¬à¦‚ à¦à¦¡à¦¿à¦Ÿ à¦•à¦°à§à¦¨</p>
            </div>
            <div className="w-full md:w-96">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="à¦“à¦·à§à¦§, à¦œà§‡à¦¨à§‡à¦°à¦¿à¦• à¦¬à¦¾ à¦•à§‹à¦®à§à¦ªà¦¾à¦¨à¦¿à¦° à¦¨à¦¾à¦® à¦¦à¦¿à¦¯à¦¼à§‡ à¦–à§à¦à¦œà§à¦¨..."
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">à¦›à¦¬à¦¿</th>
                  <th className="py-3 px-4">à¦¬à§à¦°à§à¦¯à¦¾à¦¨à§à¦¡ à¦“ à¦¶à¦•à§à¦¤à¦¿</th>
                  <th className="py-3 px-4">à¦œà§‡à¦¨à§‡à¦°à¦¿à¦• à¦¨à¦¾à¦®</th>
                  <th className="py-3 px-4">à¦•à§‹à¦®à§à¦ªà¦¾à¦¨à¦¿</th>
                  <th className="py-3 px-4">à¦®à§‚à¦²à§à¦¯ (BDT)</th>
                  <th className="py-3 px-4 text-right">à¦…à§à¦¯à¦¾à¦•à¦¶à¦¨</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      à¦¡à¦¾à¦Ÿà¦¾à¦¬à§‡à¦œ à¦²à§‹à¦¡ à¦¹à¦šà§à¦›à§‡...
                    </td>
                  </tr>
                ) : medicines.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      à¦•à§‹à¦¨à§‹ à¦“à¦·à§à¦§ à¦ªà¦¾à¦“à§Ÿà¦¾ à¦¯à¦¾à§Ÿà¦¨à¦¿à¥¤
                    </td>
                  </tr>
                ) : (
                  medicines.map((med) => (
                    <tr key={med.id} className="hover:bg-slate-900/50 transition">
                      <td className="py-3 px-4">
                        {med.imageUrl ? (
                          <img
                            src={med.imageUrl}
                            alt={med.brand}
                            className="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-slate-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-400">
                            No Pic
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {med.brand}{" "}
                        <span className="text-emerald-400 font-mono text-[11px]">{med.strength}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{med.generic}</td>
                      <td className="py-3.5 px-4 text-slate-400">{med.company}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-amber-300">
                        à§³ {med.priceTk}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => startEditing(med)}
                          className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer"
                        >
                          âœï¸ à¦à¦¡à¦¿à¦Ÿ à¦®à§‚à¦²à§à¦¯/à¦›à¦¬à¦¿
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              Page {currentPage} (Showing {medicines.length} items)
            </span>
            <div className="space-x-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 disabled:opacity-40"
              >
                â† Prev
              </button>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
              >
                Next â†’
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* EDIT MODAL WITH LIVE IMAGE PREVIEW */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-lg p-6 rounded-3xl space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">à¦“à¦·à§à¦§à§‡à¦° à¦¤à¦¥à§à¦¯, à¦®à§‚à¦²à§à¦¯ à¦“ à¦›à¦¬à¦¿ à¦à¦¡à¦¿à¦Ÿ à¦•à¦°à§à¦¨</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white font-black text-sm"
              >
                âœ•
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">à¦¬à§à¦°à§à¦¯à¦¾à¦¨à§à¦¡ à¦¨à¦¾à¦® à¦“ à¦¶à¦•à§à¦¤à¦¿</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs p-3 rounded-xl text-white"
                    required
                  />
                  <input
                    type="text"
                    value={formStrength}
                    onChange={(e) => setFormStrength(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs p-3 rounded-xl text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">à¦œà§‡à¦¨à§‡à¦°à¦¿à¦• à¦¨à¦¾à¦®</label>
                <input
                  type="text"
                  value={formGeneric}
                  onChange={(e) => setFormGeneric(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs p-3 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">à¦•à§‹à¦®à§à¦ªà¦¾à¦¨à¦¿à¦° à¦¨à¦¾à¦®</label>
                <input
                  type="text"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs p-3 rounded-xl text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">à¦®à§‚à¦²à§à¦¯ (BDT)</label>
                  <input
                    type="text"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs p-3 rounded-xl text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">à¦•à§à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs p-3 rounded-xl text-white"
                  >
                    <option value="Gastric">Gastric</option>
                    <option value="Fever">Fever & Pain</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Allergy">Allergy</option>
                    <option value="Vitamin">Vitamin</option>
                    <option value="Cardiac">Cardiac</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Equipment">Medical Device</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  à¦›à¦¬à¦¿ / Picture URL (à¦…à¦¨à¦²à¦¾à¦‡à¦¨ à¦‡à¦®à§‡à¦œ à¦²à¦¿à¦™à§à¦•)
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://example.com/medicine-image.jpg"
                  className="w-full bg-slate-900 border border-slate-700 text-xs p-3 rounded-xl text-white"
                />
                {formImageUrl && (
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-[10px] text-slate-400">à¦²à¦¾à¦‡à¦­ à¦ªà§à¦°à¦¿à¦­à¦¿à¦‰:</span>
                    <img src={formImageUrl} alt="Preview" className="w-9 h-9 object-contain rounded bg-white p-1 border border-slate-700" />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold"
                >
                  à¦¬à¦¾à¦¤à¦¿à¦²
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md cursor-pointer"
                >
                  à¦¸à¦‚à¦°à¦•à§à¦·à¦£ à¦•à¦°à§à¦¨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW MODAL WITH PICTURE URL */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-lg p-6 rounded-3xl space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">à¦¨à¦¤à§à¦¨ à¦“à¦·à§à¦§ à¦¯à§à¦•à§à¦¤ à¦•à¦°à§à¦¨ (à¦›à¦¬à¦¿ à¦¸à¦¹)</h3>
              <button
                onClick={() => setIsAddingNew(false)}
                className="text-slate-400 hover:text-white font-black text-sm"
              >
                âœ•
              </button>
            </div>

            <form onSubmit={handleAddNew} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">à¦¬à§à¦°à§à¦¯à¦¾à¦¨à§à¦¡ à¦¨à¦¾à¦® à¦“ à¦¶à¦•à§à¦¤à¦¿</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="à¦¯à§‡à¦®à¦¨: Napa Extra"
                    className="bg-slate-900 border border-slate-700 text-xs p-3 rounded-xl text-white"
                    required
                  />
                  <input
                    type="text"
                    value={formStrength}
                    onChange={(e) => setFormStrength(e.target.value)}
                    placeholder="à¦¯à§‡à¦®à¦¨: 500mg"
                    className="bg-slate-900 border border-slate-700 text-xs p-3 rounded-xl text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">à¦œà§‡à¦¨à§‡à¦°à¦¿à¦• à¦¨à¦¾à¦®</label>
                <input
                  type="text"
                  value={formGeneric}
                  onChange={(e) => setFormGeneric(e.target.value)}
                  placeholder="à¦¯à§‡à¦®à¦¨: Paracetamol"
                  className="w-full bg-slate-900 border border-slate-700 text-xs p-3 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">à¦•à§‹à¦®à§à¦ªà¦¾à¦¨à¦¿à¦° à¦¨à¦¾à¦®</label>
                <input
                  type="text"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  placeholder="à¦¯à§‡à¦®à¦¨: Beximco Pharmaceuticals"
                  className="w-full bg-slate-900 border border-slate-700 text-xs p-3 rounded-xl text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">à¦®à§‚à¦²à§à¦¯ (BDT)</label>
                  <input
                    type="text"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="à¦¯à§‡à¦®à¦¨: 2.50"
                    className="w-full bg-slate-900 border border-slate-700 text-xs p-3 rounded-xl text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">à¦•à§à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs p-3 rounded-xl text-white"
                  >
                    <option value="Gastric">Gastric</option>
                    <option value="Fever">Fever & Pain</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Allergy">Allergy</option>
                    <option value="Vitamin">Vitamin</option>
                    <option value="Cardiac">Cardiac</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Equipment">Medical Device</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  à¦›à¦¬à¦¿ / Picture URL (à¦…à¦¨à¦²à¦¾à¦‡à¦¨ à¦‡à¦®à§‡à¦œ à¦²à¦¿à¦™à§à¦•)
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://example.com/medicine-image.jpg"
                  className="w-full bg-slate-900 border border-slate-700 text-xs p-3 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold"
                >
                  à¦¬à¦¾à¦¤à¦¿à¦²
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md cursor-pointer"
                >
                  à¦“à¦·à§à¦§ à¦¸à§‡à¦­ à¦•à¦°à§à¦¨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}