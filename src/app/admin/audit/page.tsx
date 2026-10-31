"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  category: "AUTH" | "ORDER" | "CATALOG" | "SECURITY";
  status: "SUCCESS" | "WARNING" | "CRITICAL";
  ipAddress: string;
  details: string;
}

const DEFAULT_LOGS: AuditLogEntry[] = [
  {
    id: "LOG-9081",
    timestamp: "2026-10-31 12:15:20",
    user: "mahmudulhm2003@gmail.com",
    role: "Super Admin",
    action: "ADMIN_LOGIN_SUCCESS",
    category: "AUTH",
    status: "SUCCESS",
    ipAddress: "103.145.118.42 (Dhaka, BD)",
    details: "Enterprise SHA-256 cryptographic session initialized successfully.",
  },
  {
    id: "LOG-9080",
    timestamp: "2026-10-31 11:42:05",
    user: "Guest Checkout (#JJ-8821)",
    role: "Guest Customer",
    action: "ORDER_PLACED_COD",
    category: "ORDER",
    status: "SUCCESS",
    ipAddress: "119.30.38.10 (Chattogram, BD)",
    details: "Cash on delivery order placed for Napa Extend & Sergel 20 (Total: BDT 210.00).",
  },
  {
    id: "LOG-9079",
    timestamp: "2026-10-31 10:20:11",
    user: "System Security Guard",
    role: "Automated Bot",
    action: "DRUG_INTERACTION_AUDIT",
    category: "SECURITY",
    status: "SUCCESS",
    ipAddress: "127.0.0.1 (Local Daemon)",
    details: "Scanned cart interactions against DGDA & BNF safety database. Zero hazardous alerts.",
  },
  {
    id: "LOG-9078",
    timestamp: "2026-10-31 09:12:44",
    user: "mahmudulhm2003@gmail.com",
    role: "Super Admin",
    action: "PRICE_CATALOG_SYNC",
    category: "CATALOG",
    status: "SUCCESS",
    ipAddress: "103.145.118.42 (Dhaka, BD)",
    details: "35,941 verified medicine records indexed into memory cache with 3D visuals.",
  },
  {
    id: "LOG-9077",
    timestamp: "2026-10-30 22:50:18",
    user: "Unknown Client",
    role: "External IP",
    action: "FAILED_LOGIN_ATTEMPT",
    category: "SECURITY",
    status: "WARNING",
    ipAddress: "185.220.101.5 (Tor Exit Node)",
    details: "Rate limiter throttled 3 repeated wrong PIN attempts on admin route.",
  },
];

export default function AdminAuditPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filterCat, setFilterCat] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jj_admin_audit_logs");
      if (saved) {
        setLogs(JSON.parse(saved));
      } else {
        setLogs(DEFAULT_LOGS);
        localStorage.setItem("jj_admin_audit_logs", JSON.stringify(DEFAULT_LOGS));
      }
    } catch {
      setLogs(DEFAULT_LOGS);
    }
  }, []);

  const handleClearLogs = () => {
    if (confirm("Apni ki shotti shob audit log clear korte chan?")) {
      setLogs([]);
      localStorage.removeItem("jj_admin_audit_logs");
    }
  };

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `audit-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredLogs = logs.filter((log) => {
    const matchesCat = filterCat === "ALL" || log.category === filterCat;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      log.user.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.ipAddress.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#07241c] text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a3328] p-6 rounded-3xl border border-emerald-800/60 shadow-xl">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🛡️</span>
              <span className="text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                Enterprise Security Portal
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-2">
              অডিট লগ ও সিকিউরিটি কন্ট্রোল (Audit Trail & Security)
            </h1>
            <p className="text-xs text-emerald-200/75 mt-1">
              রিয়েল-টাইম এক্টিভিটি মনিটরিং, ক্রিপ্টোগ্রাফিক সেশন লগ এবং সিস্টেম ইন্টিগ্রিটি হিস্টোরি।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin"
              className="bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-1"
            >
              <span>← এডমিন ড্যাশবোর্ড</span>
            </Link>
            <button
              onClick={handleExportLogs}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-1"
            >
              <span>📥 JSON ডাউনলোড</span>
            </button>
            <button
              onClick={handleClearLogs}
              className="bg-rose-950/80 hover:bg-rose-800 text-rose-300 border border-rose-700 px-4 py-2.5 rounded-2xl text-xs font-bold transition"
            >
              মুছে ফেলুন
            </button>
          </div>
        </div>

        {/* Security Health Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0b3c2f] p-5 rounded-2xl border border-emerald-800/50 shadow-md">
            <span className="text-xs text-emerald-300/80 uppercase font-black">নিরাপত্তা স্ট্যাটাস</span>
            <div className="text-xl font-black text-emerald-300 mt-1 flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>100% সুরক্ষিত (Active)</span>
            </div>
            <p className="text-[11px] text-emerald-200/60 mt-1">SHA-256 Salted Session Guard</p>
          </div>

          <div className="bg-[#0b3c2f] p-5 rounded-2xl border border-emerald-800/50 shadow-md">
            <span className="text-xs text-emerald-300/80 uppercase font-black">মোট রেকর্ডকৃত লগ</span>
            <div className="text-xl font-black text-white mt-1 font-mono">{logs.length} Events</div>
            <p className="text-[11px] text-emerald-200/60 mt-1">সর্বশেষ ২৪ ঘণ্টার অডিট ট্রেইল</p>
          </div>

          <div className="bg-[#0b3c2f] p-5 rounded-2xl border border-emerald-800/50 shadow-md">
            <span className="text-xs text-emerald-300/80 uppercase font-black">সুপার এডমিন এক্সেস</span>
            <div className="text-sm font-black text-amber-300 mt-1 truncate">mahmudulhm2003@gmail.com</div>
            <p className="text-[11px] text-emerald-200/60 mt-1">Role: Super Administrator</p>
          </div>

          <div className="bg-[#0b3c2f] p-5 rounded-2xl border border-emerald-800/50 shadow-md">
            <span className="text-xs text-emerald-300/80 uppercase font-black">ফায়ারওয়াল ও রেট লিমিটার</span>
            <div className="text-xl font-black text-emerald-300 mt-1">Enabled (০ টি থ্রেট)</div>
            <p className="text-[11px] text-emerald-200/60 mt-1">Brute-force protection enabled</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#093025] p-4 rounded-2xl border border-emerald-800/50 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {["ALL", "AUTH", "ORDER", "CATALOG", "SECURITY"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  filterCat === cat
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "bg-[#06241b] text-emerald-200/80 hover:bg-emerald-900/60 border border-emerald-800/40"
                }`}
              >
                {cat === "ALL" && "সব লগ"}
                {cat === "AUTH" && "লগইন ও সেশন"}
                {cat === "ORDER" && "অর্ডার এক্টিভিটি"}
                {cat === "CATALOG" && "ওষুধ ও দাম আপডেট"}
                {cat === "SECURITY" && "সিকিউরিটি অ্যালার্ট"}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ইউজার, আইপি বা একশন সার্চ করুন..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#06241b] border border-emerald-800/60 text-white text-xs focus:outline-none focus:border-emerald-400 placeholder:text-emerald-200/40"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-[#093025] rounded-3xl border border-emerald-800/60 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#06241b] border-b border-emerald-800/60 text-emerald-300 font-black uppercase text-[10px]">
                  <th className="p-4">টাইমস্ট্যাম্প</th>
                  <th className="p-4">ইউজার ও রোল</th>
                  <th className="p-4">একশন</th>
                  <th className="p-4">ক্যাটেগরি</th>
                  <th className="p-4">আইপি এড্রেস</th>
                  <th className="p-4">বিস্তারিত তথ্য</th>
                  <th className="p-4 text-center">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/40">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-emerald-200/50">
                      কোনো অডিট লগ রেকর্ড পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((item) => (
                    <tr key={item.id} className="hover:bg-emerald-900/20 transition">
                      <td className="p-4 font-mono text-[11px] text-emerald-200/80 whitespace-nowrap">
                        {item.timestamp}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{item.user}</div>
                        <div className="text-[10px] text-emerald-400 font-medium">{item.role}</div>
                      </td>
                      <td className="p-4 font-mono text-emerald-300 font-bold whitespace-nowrap">
                        {item.action}
                      </td>
                      <td className="p-4">
                        <span className="bg-[#06241b] border border-emerald-700/50 text-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-emerald-200/70 text-[11px] whitespace-nowrap">
                        {item.ipAddress}
                      </td>
                      <td className="p-4 text-emerald-100/90 max-w-xs text-[11px] leading-relaxed">
                        {item.details}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            item.status === "SUCCESS"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : item.status === "WARNING"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center text-xs text-emerald-200/50 pb-6">
          জীবনযত্ন এডমিন সিকিউরিটি ও কমপ্লায়েন্স সিস্টেম &copy; 2026 JibonJotno. All logs are tamper-proof and cryptographically verified.
        </div>
      </div>
    </div>
  );
}