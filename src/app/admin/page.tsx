"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { MASTER_CATALOG, CatalogItem } from "@/data/medicinesCatalog";

type RoleType = "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "SELLER";

interface ExtendedMedicine extends CatalogItem {
  youtubeUrl?: string;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  status: "Active" | "Invited";
  invitedAt: string;
}

export default function FullAdminDashboard() {
  const [activeTab, setActiveTab] = useState<"CATALOG" | "ADD_NEW" | "ROLES" | "ORDERS">("CATALOG");
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: RoleType }>({
    email: "mahmudulhm2003@gmail.com",
    name: "Md Mahmudul Hassan",
    role: "SUPER_ADMIN",
  });

  const [medicines, setMedicines] = useState<ExtendedMedicine[]>(MASTER_CATALOG);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Edit State
  const [editingMed, setEditingMed] = useState<ExtendedMedicine | null>(null);
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

  // Staff
  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: "staff-1",
      name: "Md Mahmudul Hassan",
      email: "mahmudulhm2003@gmail.com",
      role: "SUPER_ADMIN",
      status: "Active",
      invitedAt: "2026-10-01",
    },
  ]);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<RoleType>("ADMIN");

  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  useEffect(() => {
    const savedSession = localStorage.getItem("jj_admin_session");
    if (savedSession) {
      try {
        setCurrentUser(JSON.parse(savedSession));
      } catch {}
    }

    const savedStaff = localStorage.getItem("jj_admin_staff");
    if (savedStaff) {
      try {
        const parsed = JSON.parse(savedStaff);
        if (Array.isArray(parsed) && parsed.length > 0) setStaffList(parsed);
      } catch {}
    }

    setIsLoadingCatalog(true);
    const customSaved = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("jj_custom_medicines") || "[]") : [];
    const priceOverrides = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("jj_medicine_overrides") || "{}") : {};

    fetch("/data/all_medicines.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const baseList = Array.isArray(data) && data.length > 0 ? [...MASTER_CATALOG, ...data] : MASTER_CATALOG;
        const merged = baseList.map((item: any) =>
          priceOverrides[item.id] ? { ...item, ...priceOverrides[item.id] } : item
        );
        setMedicines([...customSaved, ...merged]);
      })
      .catch(() => {
        const merged = MASTER_CATALOG.map((item) =>
          priceOverrides[item.id] ? { ...item, ...priceOverrides[item.id] } : item
        );
        setMedicines([...customSaved, ...merged]);
      })
      .finally(() => setIsLoadingCatalog(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jj_admin_session");
    localStorage.removeItem("admin_authenticated");
    document.cookie = "admin_token=; path=/; max-age=0";
    window.location.href = "/admin-login";
  };

  const filteredMedicines = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return medicines.filter((item) => {
      if (selectedCategory !== "ALL" && item.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (!q) return true;
      return (
        item.brand?.toLowerCase().includes(q) ||
        item.generic?.toLowerCase().includes(q) ||
        item.company?.toLowerCase().includes(q)
      );
    });
  }, [medicines, searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredMedicines.length / itemsPerPage));
  const paginatedMedicines = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMedicines.slice(start, start + itemsPerPage);
  }, [filteredMedicines, currentPage]);

  const openEditModal = (med: ExtendedMedicine) => {
    setEditingMed(med);
    setEditBrand(med.brand);
    setEditGeneric(med.generic);
    setEditCompany(med.company);
    setEditStrength(med.strength);
    setEditDosage(med.dosageForm || "Tablet");
    setEditCategory(med.category || "Gastric");
    setEditPrice(med.priceTk);
    setEditImageUrl(med.imageUrl || "");
    setEditYoutubeUrl(med.youtubeUrl || "");
    setEditRx(Boolean(med.requiresRx));
  };

  const handleSaveMedicineEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMed) return;

    const updatedItem: ExtendedMedicine = {
      ...editingMed,
      brand: editBrand,
      generic: editGeneric,
      company: editCompany,
      strength: editStrength,
      dosageForm: editDosage,
      category: editCategory,
      priceTk: editPrice,
      imageUrl: editImageUrl || undefined,
      youtubeUrl: editYoutubeUrl || undefined,
      requiresRx: editRx,
    };

    setMedicines((prev) => prev.map((m) => (m.id === editingMed.id ? updatedItem : m)));

    const overrides = JSON.parse(localStorage.getItem("jj_medicine_overrides") || "{}");
    overrides[editingMed.id] = updatedItem;
    localStorage.setItem("jj_medicine_overrides", JSON.stringify(overrides));

    setEditingMed(null);
    showToast(`✓ "${updatedItem.brand}" er price, info o YouTube video link save hoyeche!`);
  };

  const handleAddNewMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: ExtendedMedicine = {
      id: "jj-med-" + Date.now(),
      brand: newBrand,
      generic: newGeneric,
      company: newCompany,
      strength: newStrength || "500 mg",
      dosageForm: newDosage,
      category: newCategory,
      priceTk: newPrice || "5.00",
      imageUrl: newImageUrl || undefined,
      youtubeUrl: newYoutubeUrl || undefined,
      requiresRx: newRx,
    };

    setMedicines((prev) => [newItem, ...prev]);

    const existingCustom = JSON.parse(localStorage.getItem("jj_custom_medicines") || "[]");
    localStorage.setItem("jj_custom_medicines", JSON.stringify([newItem, ...existingCustom]));

    setNewBrand("");
    setNewGeneric("");
    setNewCompany("");
    setNewStrength("");
    setNewPrice("");
    setNewImageUrl("");
    setNewYoutubeUrl("");
    setActiveTab("CATALOG");
    showToast(`✓ Notun medicine "${newItem.brand}" catalog-e add hoyeche!`);
  };

  return (
    <div className="min-h-screen bg-[#071310] text-slate-100 flex flex-col font-sans">
      <header className="bg-[#0b1f1a] border-b border-emerald-900/60 px-4 md:px-8 py-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-white shadow-md">
            জ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                {currentUser.role}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {currentUser.email}
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-black text-white mt-0.5">
              JibonJotno Admin Control Center
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/medicines"
            className="bg-emerald-950/90 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/50 text-xs font-bold px-3.5 py-2 rounded-xl transition"
          >
            💊 Public Medicines
          </Link>
          <Link
            href="/"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl transition"
          >
            🌐 Live Website
          </Link>
          <button
            onClick={handleLogout}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
          >
            Logout
          </button>
        </div>
      </header>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl text-xs font-black z-50 border border-emerald-400">
          {toast}
        </div>
      )}

      <div className="bg-[#091915] border-b border-emerald-950 px-4 md:px-8 py-3 flex items-center gap-2 overflow-x-auto">
        {[
          { id: "CATALOG", label: "💊 Medicine, Price & YouTube Video Editor" },
          { id: "ADD_NEW", label: "➕ Notun Medicine Add Korun" },
          { id: "ROLES", label: "👥 Admin Email Invite & Roles" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black shrink-0 transition cursor-pointer ${
              activeTab === tab.id
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-slate-900/90 text-slate-300 hover:bg-slate-800"
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
                  Medicine Catalog & Price/YouTube Video Editor
                </h2>
                <p className="text-xs text-slate-400">
                  Total Medicines: {medicines.length.toLocaleString()}+ | Edit Price, Packaging & YouTube Video Hyperlink
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Brand ba Generic search korun..."
                  className="w-full sm:w-80 bg-[#071310] border border-emerald-800/80 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-emerald-900/60 text-[11px] text-slate-400 uppercase">
                    <th className="py-3.5 px-4">Brand & Strength</th>
                    <th className="py-3.5 px-4">Generic Name</th>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Unit Price (BDT)</th>
                    <th className="py-3.5 px-4">YouTube Video</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/80 text-xs">
                  {paginatedMedicines.map((med) => (
                    <tr key={med.id} className="hover:bg-emerald-950/30 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-black text-white text-sm">
                          {med.brand} <span className="text-emerald-400 font-mono text-xs">{med.strength}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{med.dosageForm}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{med.generic}</td>
                      <td className="py-3.5 px-4 text-slate-400">{med.company}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-amber-400 text-sm">
                        ৳ {med.priceTk}
                      </td>
                      <td className="py-3.5 px-4">
                        {med.youtubeUrl ? (
                          <a
                            href={med.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-red-600/20 text-red-400 hover:text-white hover:bg-red-600 border border-red-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full transition"
                          >
                            ▶ Watch Video
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-600">No Video</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openEditModal(med)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl font-black transition cursor-pointer"
                        >
                          ✏️ Edit Info & Video
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
                  Total: <strong className="text-white">{filteredMedicines.length}</strong> items
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-bold disabled:opacity-40 cursor-pointer"
                  >
                    ← Prev
                  </button>
                  <span className="text-xs font-mono bg-[#071310] px-3.5 py-1.5 rounded-xl border border-emerald-900">
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-bold disabled:opacity-40 cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add New Tab */}
        {activeTab === "ADD_NEW" && (
          <div className="bg-[#0b1f1a] border border-emerald-900/50 rounded-3xl p-6 max-w-3xl mx-auto space-y-5 shadow-xl">
            <h2 className="text-lg font-black text-white">➕ Notun Medicine & YouTube Video Add Korun</h2>
            <form onSubmit={handleAddNewMedicine} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="e.g. Napa Extend"
                    required
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Strength *</label>
                  <input
                    type="text"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    placeholder="e.g. 665 mg"
                    required
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Generic Name *</label>
                  <input
                    type="text"
                    value={newGeneric}
                    onChange={(e) => setNewGeneric(e.target.value)}
                    placeholder="e.g. Paracetamol"
                    required
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Company Name *</label>
                  <input
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Beximco Pharmaceuticals"
                    required
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Unit Price (BDT) *</label>
                  <input
                    type="text"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g. 2.00"
                    required
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-amber-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-red-400 font-bold block mb-1">▶ YouTube Video Link (URL)</label>
                  <input
                    type="url"
                    value={newYoutubeUrl}
                    onChange={(e) => setNewYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-[#071310] border border-red-700/60 text-xs p-3 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Packaging Image URL</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-xs cursor-pointer shadow-lg"
              >
                ✓ Medicine & Video Save Korun
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Edit Modal with YouTube URL input */}
      {editingMed && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b1f1a] border border-emerald-700/60 w-full max-w-xl p-6 rounded-3xl space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-emerald-900 pb-3">
              <h3 className="text-base font-black text-white">
                ✏️ Edit Medicine & YouTube Video ({editingMed.brand})
              </h3>
              <button
                onClick={() => setEditingMed(null)}
                className="text-slate-400 hover:text-white font-black text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMedicineEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Strength</label>
                  <input
                    type="text"
                    value={editStrength}
                    onChange={(e) => setEditStrength(e.target.value)}
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Generic Name</label>
                  <input
                    type="text"
                    value={editGeneric}
                    onChange={(e) => setEditGeneric(e.target.value)}
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Company Name</label>
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
                <label className="text-xs text-amber-300 font-bold block mb-1">Unit Price (BDT)</label>
                <input
                  type="text"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full bg-[#071310] border border-amber-500/70 text-xs p-3 rounded-xl text-amber-300 font-mono font-black"
                  required
                />
              </div>

              {/* YouTube Video Hyperlink Field */}
              <div className="bg-red-950/30 border border-red-800/50 p-3.5 rounded-2xl space-y-1.5">
                <label className="text-xs text-red-300 font-black flex items-center gap-1.5">
                  <span>▶</span> YouTube Video Hyperlink / Guide URL
                </label>
                <input
                  type="url"
                  value={editYoutubeUrl}
                  onChange={(e) => setEditYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-[#071310] border border-red-700/70 text-xs p-3 rounded-xl text-white font-mono focus:outline-none focus:border-red-400"
                />
                <span className="text-[10px] text-slate-400 block">
                  Eikhane YouTube video link dile public details modal-e user-ra shorasori video play kore dekhte parbe.
                </span>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Packaging Image URL</label>
                <input
                  type="text"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMed(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black shadow-lg cursor-pointer"
                >
                  ✓ Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}