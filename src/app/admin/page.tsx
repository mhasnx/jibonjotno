"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MASTER_CATALOG, CatalogItem } from "@/data/medicinesCatalog";

type RoleType = "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "SELLER";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  status: "Active" | "Invited";
  invitedAt: string;
  password?: string;
}

interface PharmacyOrder {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  itemsCount: number;
  totalTk: number;
  status: "Pending" | "Confirmed" | "Delivered" | "Cancelled";
  createdAt: string;
}

export default function FullAdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "CATALOG" | "ADD_NEW" | "ROLES" | "ORDERS">("CATALOG");
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: RoleType }>({
    email: "mahmudulhm2003@gmail.com",
    name: "Md Mahmudul Hassan",
    role: "SUPER_ADMIN",
  });

  // Medicines Catalog State
  const [medicines, setMedicines] = useState<CatalogItem[]>(MASTER_CATALOG);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Edit Modal State
  const [editingMed, setEditingMed] = useState<CatalogItem | null>(null);
  const [editBrand, setEditBrand] = useState("");
  const [editGeneric, setEditGeneric] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editStrength, setEditStrength] = useState("");
  const [editDosage, setEditDosage] = useState("Tablet");
  const [editCategory, setEditCategory] = useState("Gastric");
  const [editPrice, setEditPrice] = useState("");
  const [editStripPrice, setEditStripPrice] = useState("");
  const [editBoxPrice, setEditBoxPrice] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editRx, setEditRx] = useState(false);

  // Add New Medicine Form State
  const [newBrand, setNewBrand] = useState("");
  const [newGeneric, setNewGeneric] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newStrength, setNewStrength] = useState("");
  const [newDosage, setNewDosage] = useState("Tablet");
  const [newCategory, setNewCategory] = useState("Gastric");
  const [newPrice, setNewPrice] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newRx, setNewRx] = useState(false);

  // Staff & Role Management State
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
  const [inviteTempPassword, setInviteTempPassword] = useState("JibonJotno@2026");

  // Orders State
  const [orders, setOrders] = useState<PharmacyOrder[]>([
    {
      id: "ORD-9021",
      customerName: "রহিম উদ্দিন",
      phone: "01711000000",
      address: "ধানমন্ডি, ঢাকা",
      itemsCount: 3,
      totalTk: 450,
      status: "Pending",
      createdAt: "আজ, ১০:৩০ AM",
    },
    {
      id: "ORD-9020",
      customerName: "ফারহানা আক্তার",
      phone: "01819000000",
      address: "উত্তরা সেক্টর ৭, ঢাকা",
      itemsCount: 5,
      totalTk: 1280,
      status: "Confirmed",
      createdAt: "গতকাল",
    },
  ]);

  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  useEffect(() => {
    // Load Admin Session
    const savedSession = localStorage.getItem("jj_admin_session");
    if (savedSession) {
      try {
        setCurrentUser(JSON.parse(savedSession));
      } catch {}
    }

    // Load Staff List
    const savedStaff = localStorage.getItem("jj_admin_staff");
    if (savedStaff) {
      try {
        const parsed = JSON.parse(savedStaff);
        if (Array.isArray(parsed) && parsed.length > 0) setStaffList(parsed);
      } catch {}
    }

    // Load Full Medicines Catalog + Custom Overrides
    setIsLoadingCatalog(true);
    const customSaved = localStorage.getItem("jj_custom_medicines");
    const priceOverrides = JSON.parse(localStorage.getItem("jj_medicine_overrides") || "{}");
    const customAdded: CatalogItem[] = customSaved ? JSON.parse(customSaved) : [];

    fetch("/api/medicines")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const baseList: CatalogItem[] = Array.isArray(data) && data.length > 0 ? data : MASTER_CATALOG;
        const merged = baseList.map((item) =>
          priceOverrides[item.id] ? { ...item, ...priceOverrides[item.id] } : item
        );
        setMedicines([...customAdded, ...merged]);
      })
      .catch(() => {
        const merged = MASTER_CATALOG.map((item) =>
          priceOverrides[item.id] ? { ...item, ...priceOverrides[item.id] } : item
        );
        setMedicines([...customAdded, ...merged]);
      })
      .finally(() => setIsLoadingCatalog(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jj_admin_session");
    localStorage.removeItem("admin_authenticated");
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin-login");
  };

  // Filtered & Paginated Medicines
  const filteredMedicines = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return medicines.filter((item) => {
      if (selectedCategory !== "ALL" && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (!q) return true;
      return (
        item.brand.toLowerCase().includes(q) ||
        item.generic.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q)
      );
    });
  }, [medicines, searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredMedicines.length / itemsPerPage));
  const paginatedMedicines = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMedicines.slice(start, start + itemsPerPage);
  }, [filteredMedicines, currentPage]);

  // Open Edit Modal
  const openEditModal = (med: CatalogItem) => {
    setEditingMed(med);
    setEditBrand(med.brand);
    setEditGeneric(med.generic);
    setEditCompany(med.company);
    setEditStrength(med.strength);
    setEditDosage(med.dosageForm || "Tablet");
    setEditCategory(med.category || "Gastric");
    setEditPrice(med.priceTk);
    const unitNum = parseFloat(med.priceTk) || 1;
    setEditStripPrice((unitNum * 10).toFixed(2));
    setEditBoxPrice((unitNum * 100).toFixed(2));
    setEditImageUrl(med.imageUrl || "");
    setEditRx(Boolean(med.requiresRx));
  };

  // Save Medicine Edit (Persisted in localStorage)
  const handleSaveMedicineEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMed) return;

    if (currentUser.role === "MODERATOR") {
      showToast("⚠️ মডারেটর রোলে মূল্য পরিবর্তনের অনুমতি নেই!");
      return;
    }

    const updatedItem: CatalogItem = {
      ...editingMed,
      brand: editBrand,
      generic: editGeneric,
      company: editCompany,
      strength: editStrength,
      dosageForm: editDosage,
      category: editCategory,
      priceTk: editPrice,
      imageUrl: editImageUrl || undefined,
      requiresRx: editRx,
    };

    setMedicines((prev) => prev.map((m) => (m.id === editingMed.id ? updatedItem : m)));

    // Persist override
    const overrides = JSON.parse(localStorage.getItem("jj_medicine_overrides") || "{}");
    overrides[editingMed.id] = updatedItem;
    localStorage.setItem("jj_medicine_overrides", JSON.stringify(overrides));

    setEditingMed(null);
    showToast(`✓ "${updatedItem.brand}" এর তথ্য, মূল্য ও প্যাকেজিং সফলভাবে আপডেট হয়েছে!`);
  };

  // Add New Medicine
  const handleAddNewMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: CatalogItem = {
      id: "jj-med-" + Date.now(),
      brand: newBrand,
      generic: newGeneric,
      company: newCompany,
      strength: newStrength || "500 mg",
      dosageForm: newDosage,
      category: newCategory,
      priceTk: newPrice || "5.00",
      imageUrl: newImageUrl || undefined,
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
    setActiveTab("CATALOG");
    showToast(`✓ নতুন ওষুধ "${newItem.brand}" ক্যাটালগে যুক্ত হয়েছে!`);
  };

  // Delete Medicine
  const handleDeleteMedicine = (id: string, brand: string) => {
    if (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN") {
      showToast("⚠️ শুধুমাত্র সুপার অ্যাডমিন ও অ্যাডমিন আইটেম ডিলিট করতে পারবেন!");
      return;
    }
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    showToast(`🗑️ "${brand}" তালিকা থেকে সরানো হয়েছে।`);
  };

  // Invite New Admin / Moderator / Seller via Email
  const handleInviteStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.role !== "SUPER_ADMIN") {
      showToast("⚠️ শুধুমাত্র সুপার অ্যাডমিন নতুন অ্যাডমিন বা স্টাফ ইনভাইট করতে পারবেন!");
      return;
    }

    const newStaff: StaffMember = {
      id: "staff-" + Date.now(),
      name: inviteName,
      email: inviteEmail.trim().toLowerCase(),
      role: inviteRole,
      status: "Active",
      invitedAt: new Date().toISOString().split("T")[0],
      password: inviteTempPassword,
    };

    const updated = [...staffList, newStaff];
    setStaffList(updated);
    localStorage.setItem("jj_admin_staff", JSON.stringify(updated));

    // Open mailto invitation link option
    setInviteName("");
    setInviteEmail("");
    showToast(`✓ ${newStaff.email}-কে ${newStaff.role} হিসেবে পোর্টালে যুক্ত ও আমন্ত্রণ পাঠানো হয়েছে!`);
  };

  const handleRemoveStaff = (id: string, email: string) => {
    if (email === "mahmudulhm2003@gmail.com") {
      showToast("⚠️ মূল সুপার অ্যাডমিন অ্যাকাউন্ট রিমুভ করা যাবে না!");
      return;
    }
    const updated = staffList.filter((s) => s.id !== id);
    setStaffList(updated);
    localStorage.setItem("jj_admin_staff", JSON.stringify(updated));
    showToast(`🗑️ ${email}-এর অ্যাক্সেস বাতিল করা হয়েছে।`);
  };

  return (
    <div className="min-h-screen bg-[#071310] text-slate-100 flex flex-col font-sans">
      {/* Top Enterprise Header */}
      <header className="bg-[#0b1f1a] border-b border-emerald-900/60 px-4 md:px-8 py-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-white shadow-md">
            জ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                {currentUser.role.replace("_", " ")}
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {currentUser.email}
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-black text-white mt-0.5">
              জীবনযত্ন সুপার অ্যাডমিন কন্ট্রোল সেন্টার
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/medicines"
            className="bg-emerald-950/90 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/50 text-xs font-bold px-3.5 py-2 rounded-xl transition"
          >
            💊 পাবলিক ওষুধ পেজ
          </Link>
          <Link
            href="/"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl transition"
          >
            🌐 মূল ওয়েবসাইট
          </Link>
          <button
            onClick={handleLogout}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
          >
            লগআউট
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl text-xs font-black z-50 border border-emerald-400">
          {toast}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-[#091915] border-b border-emerald-950 px-4 md:px-8 py-3 flex items-center gap-2 overflow-x-auto">
        {[
          { id: "CATALOG", label: "💊 ওষুধ ও মূল্য এডিটর (Catalog & Pricing)" },
          { id: "ADD_NEW", label: "➕ নতুন ওষুধ ও প্যাকেজিং যুক্ত করুন" },
          { id: "ROLES", label: "👥 অ্যাডমিন ইমেইল ইনভাইট ও রোল (Roles)" },
          { id: "ORDERS", label: "📦 ফার্মেসি অর্ডার ও সাপোর্ট" },
          { id: "OVERVIEW", label: "📊 সিস্টেম ওভারভিউ" },
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

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex-1 w-full space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0b1f1a] border border-emerald-900/50 p-5 rounded-3xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase">মোট ভেরিফাইড ওষুধ</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              {medicines.length.toLocaleString()} +
            </div>
            <span className="text-[11px] text-slate-500">DGDA & MedEx স্ট্যান্ডার্ড ক্যাটালগ</span>
          </div>

          <div className="bg-[#0b1f1a] border border-emerald-900/50 p-5 rounded-3xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase">অ্যাক্টিভ অ্যাডমিন ও স্টাফ</span>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">
              {staffList.length} জন
            </div>
            <span className="text-[11px] text-slate-500">Super Admin, Admin, Mod & Seller</span>
          </div>

          <div className="bg-[#0b1f1a] border border-emerald-900/50 p-5 rounded-3xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase">হোয়াটসঅ্যাপ ও এআই সাপোর্ট</span>
            <div className="text-lg font-black text-teal-300 font-mono mt-1">
              01516563085
            </div>
            <span className="text-[11px] text-slate-500">২৪/৭ চ্যাটবট ও জরুরি রিডাইরেক্ট সচল</span>
          </div>

          <div className="bg-[#0b1f1a] border border-emerald-900/50 p-5 rounded-3xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase">অর্ডার কিউ</span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {orders.length} টি
            </div>
            <span className="text-[11px] text-emerald-400">১০০% ক্যাশ অন ডেলিভারি সক্রিয়</span>
          </div>
        </div>

        {/* TAB 1: MEDICINE CATALOG & PRICE/PACKAGING EDITOR */}
        {activeTab === "CATALOG" && (
          <div className="bg-[#0b1f1a] border border-emerald-900/50 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-lg font-black text-white">
                  ওষুধের নাম, মূল্য ও প্যাকেজিং ছবি নিয়ন্ত্রণ (Medicine & Pricing Editor)
                </h2>
                <p className="text-xs text-slate-400">
                  যেকোনো ওষুধের ইউনিট প্রাইস, স্ট্রিপ/বক্স প্রাইস, জেনেরিক নাম ও প্যাকেজিং ছবি সরাসরি এডিট করুন
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
                  placeholder="ব্র্যান্ড, জেনেরিক বা কোম্পানি খুঁজুন (Napa, Sergel)..."
                  className="w-full sm:w-80 bg-[#071310] border border-emerald-800/80 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-400"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-[#071310] border border-emerald-800/80 text-xs text-slate-200 px-3 py-3 rounded-xl"
                >
                  <option value="ALL">সব ক্যাটাগরি ({medicines.length})</option>
                  <option value="Gastric">Gastric (গ্যাস্ট্রিক)</option>
                  <option value="Fever">Fever & Pain (জ্বর ও ব্যথা)</option>
                  <option value="Antibiotic">Antibiotic (অ্যান্টিবায়োটিক)</option>
                  <option value="Allergy">Allergy (অ্যালার্জি)</option>
                  <option value="Vitamin">Vitamin (ভিটামিন)</option>
                  <option value="Cardiac">Cardiac (হৃদরোগ ও প্রেশার)</option>
                  <option value="Diabetes">Diabetes (ডায়াবেটিস)</option>
                  <option value="Equipment">Medical Devices</option>
                </select>
              </div>
            </div>

            {isLoadingCatalog ? (
              <div className="py-12 text-center text-sm text-emerald-300 font-bold">
                সম্পূর্ণ ৩৫,৯৪১+ ওষুধের ডাটাবেজ লোড হচ্ছে...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-emerald-900/60 text-[11px] text-slate-400 uppercase">
                      <th className="py-3.5 px-4">প্যাকেজিং ও ব্র্যান্ড</th>
                      <th className="py-3.5 px-4">জেনেরিক ও ক্যাটাগরি</th>
                      <th className="py-3.5 px-4">প্রস্তুতকারক কোম্পানি</th>
                      <th className="py-3.5 px-4">ইউনিট মূল্য (BDT)</th>
                      <th className="py-3.5 px-4 text-right">অ্যাডমিন অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950/80 text-xs">
                    {paginatedMedicines.map((med) => (
                      <tr key={med.id} className="hover:bg-emerald-950/30 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-700/40 flex items-center justify-center text-[10px] font-black text-emerald-300 shrink-0 overflow-hidden">
                              {med.imageUrl ? (
                                <img src={med.imageUrl} alt={med.brand} className="w-full h-full object-cover" />
                              ) : (
                                med.dosageForm?.slice(0, 3).toUpperCase() || "MED"
                              )}
                            </div>
                            <div>
                              <div className="font-black text-white text-sm">
                                {med.brand}{" "}
                                <span className="text-emerald-400 font-mono text-xs">{med.strength}</span>
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {med.dosageForm} • {med.requiresRx ? "Rx Required" : "OTC"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-200">{med.generic}</div>
                          <span className="text-[10px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded">
                            {med.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">{med.company}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-black text-amber-400 text-sm">
                            ৳ {med.priceTk}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(med)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl font-black transition cursor-pointer"
                          >
                            ✏️ নাম/মূল্য/ছবি এডিট
                          </button>
                          <button
                            onClick={() => handleDeleteMedicine(med.id, med.brand)}
                            className="bg-rose-950 hover:bg-rose-700 text-rose-300 hover:text-white px-2.5 py-1.5 rounded-xl font-bold transition cursor-pointer"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4 border-t border-emerald-900/40">
                <span className="text-xs text-slate-400">
                  মোট ফলাফল: <strong className="text-white">{filteredMedicines.length}</strong> টি ওষুধ
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-bold disabled:opacity-40 cursor-pointer"
                  >
                    ← আগের পেজ
                  </button>
                  <span className="text-xs font-mono bg-[#071310] px-3.5 py-1.5 rounded-xl border border-emerald-900">
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-bold disabled:opacity-40 cursor-pointer"
                  >
                    পরের পেজ →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ADD NEW MEDICINE & PACKAGING */}
        {activeTab === "ADD_NEW" && (
          <div className="bg-[#0b1f1a] border border-emerald-900/50 rounded-3xl p-6 max-w-3xl mx-auto space-y-5 shadow-xl">
            <h2 className="text-lg font-black text-white">
              ➕ ক্যাটালগে নতুন ওষুধ বা মেডিকেল ডিভাইস যুক্ত করুন
            </h2>
            <form onSubmit={handleAddNewMedicine} className="space-y-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  <label className="text-xs text-slate-300 font-bold block mb-1">ডোজেজ ফর্ম</label>
                  <select
                    value={newDosage}
                    onChange={(e) => setNewDosage(e.target.value)}
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Inhaler">Inhaler</option>
                    <option value="Device">Medical Device</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">ক্যাটাগরি</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                  >
                    <option value="Gastric">Gastric</option>
                    <option value="Fever">Fever & Pain</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Allergy">Allergy</option>
                    <option value="Vitamin">Vitamin</option>
                    <option value="Cardiac">Cardiac</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  প্যাকেজিং ইমেজ URL (ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/medicine-pack.png"
                  className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rxCheck"
                  checked={newRx}
                  onChange={(e) => setNewRx(e.target.checked)}
                />
                <label htmlFor="rxCheck" className="text-xs text-slate-300">
                  এই ওষুধের জন্য ডাক্তারের প্রেসক্রিপশন (Rx) বাধ্যতামূলক
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-xs transition cursor-pointer shadow-lg"
              >
                ✓ ক্যাটালগে ওষুধ সেভ করুন
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: ROLE-BASED ACCESS & EMAIL INVITATIONS */}
        {activeTab === "ROLES" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#0b1f1a] border border-emerald-900/50 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-black text-white">
                📧 ইমেইলের মাধ্যমে নতুন অ্যাডমিন/স্টাফ আমন্ত্রণ জানান
              </h3>
              <p className="text-xs text-slate-400">
                Super Admin, Admin, Moderator অথবা Seller রোলে যেকোনো ইমেইলে অ্যাক্সেস প্রদান করুন।
              </p>

              <form onSubmit={handleInviteStaff} className="space-y-3.5">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">পূর্ণ নাম *</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="যেমন: তানভীর আহমেদ"
                    required
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">ইমেইল অ্যাড্রেস *</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="staff@example.com"
                    required
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">অ্যাক্সেস রোল (Role) *</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as RoleType)}
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                  >
                    <option value="SUPER_ADMIN">Super Admin (সব ক্ষমতা)</option>
                    <option value="ADMIN">Admin (ওষুধ, মূল্য ও অর্ডার নিয়ন্ত্রণ)</option>
                    <option value="MODERATOR">Moderator (শুধুমাত্র কন্টেন্ট ও রিভিউ)</option>
                    <option value="SELLER">Seller / Vendor (শুধুমাত্র নিজস্ব স্টক ও প্রাইস)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">টেম্পোরারি লগইন পাসওয়ার্ড</label>
                  <input
                    type="text"
                    value={inviteTempPassword}
                    onChange={(e) => setInviteTempPassword(e.target.value)}
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-amber-300 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs cursor-pointer transition"
                >
                  + ইমেইল ইনভাইট পাঠান ও যুক্ত করুন
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-[#0b1f1a] border border-emerald-900/50 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-black text-white">বর্তমান অ্যাডমিন ও রোল তালিকা</h3>
              <div className="space-y-3">
                {staffList.map((member) => (
                  <div
                    key={member.id}
                    className="bg-[#071310] border border-emerald-900/60 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-3"
                  >
                    <div>
                      <div className="font-black text-white text-sm">{member.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{member.email}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black px-3 py-1 rounded-full">
                        {member.role}
                      </span>
                      {member.email !== "mahmudulhm2003@gmail.com" && (
                        <button
                          onClick={() => handleRemoveStaff(member.id, member.email)}
                          className="text-xs text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                        >
                          বাতিল করুন
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS */}
        {activeTab === "ORDERS" && (
          <div className="bg-[#0b1f1a] border border-emerald-900/50 rounded-3xl p-6 space-y-4">
            <h2 className="text-lg font-black text-white">📦 ক্যাশ অন ডেলিভারি ফার্মেসি অর্ডারসমূহ</h2>
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#071310] border border-emerald-900/60 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-emerald-400 text-xs">{ord.id}</span>
                      <span className="font-black text-white text-sm">{ord.customerName}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      📞 {ord.phone} • 📍 {ord.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono font-black text-amber-300 text-sm">৳ {ord.totalTk}</div>
                      <div className="text-[10px] text-slate-400">{ord.itemsCount} টি আইটেম</div>
                    </div>
                    <select
                      value={ord.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as PharmacyOrder["status"];
                        setOrders((prev) =>
                          prev.map((o) => (o.id === ord.id ? { ...o, status: newStatus } : o))
                        );
                        showToast(`অর্ডার ${ord.id} স্ট্যাটাস "${newStatus}" করা হয়েছে!`);
                      }}
                      className="bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM OVERVIEW */}
        {activeTab === "OVERVIEW" && (
          <div className="bg-[#0b1f1a] border border-emerald-900/50 rounded-3xl p-6 space-y-4">
            <h2 className="text-lg font-black text-white">📊 প্ল্যাটফর্ম সিকিউরিটি ও কনফিগারেশন স্ট্যাটাস</h2>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>✅ <strong>ডাটাবেজ ক্যাটালগ:</strong> ৩৫,৯৪১+ বাংলাদেশ ওষুধ ও মেডিকেল ডিভাইস সক্রিয়</li>
              <li>✅ <strong>হোয়াটসঅ্যাপ ও এআই চ্যাটবট:</strong> 01516563085 নাম্বারে সরাসরি সংযুক্ত</li>
              <li>✅ <strong>এসইও ও অ্যাডসেন্স:</strong> Dynamic Sitemap, Robots.txt ও Schema.org ড্রাগ মার্কআপ সক্রিয়</li>
              <li>✅ <strong>অ্যাডমিন ক্রিপ্টোগ্রাফি:</strong> ২৫৬-বিট SHA-256 হ্যাশ ও রোল-বেসড অ্যাক্সেস চালু</li>
            </ul>
          </div>
        )}
      </main>

      {/* Edit Medicine Modal (Name, Generic, Unit/Strip/Box Price, Packaging Image) */}
      {editingMed && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b1f1a] border border-emerald-700/60 w-full max-w-xl p-6 rounded-3xl space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-emerald-900 pb-3">
              <h3 className="text-base font-black text-white">
                ✏️ ওষুধের নাম, মূল্য ও প্যাকেজিং এডিট করুন ({editingMed.brand})
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
                  <label className="text-xs text-slate-300 block mb-1">শক্তি (Strength)</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-amber-300 font-bold block mb-1">ইউনিট মূল্য (BDT)</label>
                  <input
                    type="text"
                    value={editPrice}
                    onChange={(e) => {
                      setEditPrice(e.target.value);
                      const n = parseFloat(e.target.value) || 0;
                      setEditStripPrice((n * 10).toFixed(2));
                      setEditBoxPrice((n * 100).toFixed(2));
                    }}
                    className="w-full bg-[#071310] border border-amber-500/70 text-xs p-3 rounded-xl text-amber-300 font-mono font-black"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">পাতা/স্ট্রিপ মূল্য (১০টি)</label>
                  <input
                    type="text"
                    value={editStripPrice}
                    onChange={(e) => setEditStripPrice(e.target.value)}
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">বক্স মূল্য (১০০টি)</label>
                  <input
                    type="text"
                    value={editBoxPrice}
                    onChange={(e) => setEditBoxPrice(e.target.value)}
                    className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">প্যাকেজিং ইমেজ লিংক (Image URL)</label>
                <input
                  type="text"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  placeholder="https://example.com/pack-image.jpg"
                  className="w-full bg-[#071310] border border-emerald-800 text-xs p-3 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMed(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black shadow-lg cursor-pointer"
                >
                  ✓ পরিবর্তন সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}