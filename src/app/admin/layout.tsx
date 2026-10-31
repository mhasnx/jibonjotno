"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdminSession } from "@/lib/auth/clearAdminClientSession";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    setMounted(true);

    async function verifySession() {
      try {
        const response = await fetch("/api/auth/session", { credentials: "include" });
        if (!response.ok) {
          await logoutAdminSession();
          if (!cancelled) router.push("/admin-login");
          return;
        }
        const data = await response.json();
        const email = data?.user?.email || "";
        if (!email) {
          await logoutAdminSession();
          if (!cancelled) router.push("/admin-login");
          return;
        }
        try {
          localStorage.setItem(
            "jj_admin_session",
            JSON.stringify({ email, name: "Md Mahmudul Hassan", role: "SUPER_ADMIN" })
          );
        } catch {
          // ignore storage errors
        }
        if (!cancelled) {
          setAdminEmail(email);
          setAuthenticated(true);
        }
      } catch {
        if (!cancelled) router.push("/admin-login");
      }
    }

    verifySession();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!mounted || !authenticated) {
    return (
      <div
        suppressHydrationWarning
        className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs font-bold font-sans select-none"
      >
        <div suppressHydrationWarning className="flex items-center space-x-2">
          <span>🔒</span>
          <span>Security Session Verifying...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "ঔষধ ক্যাটালগ (Medicines)", href: "/admin/medicines", icon: "💊" },
    { name: "অর্ডার ম্যানেজমেন্ট (Orders)", href: "/admin/orders", icon: "📦" },
    { name: "টিম ও রোল (Team & RBAC)", href: "/admin/team", icon: "👥" },
    { name: "অডিট লগ ও সিকিউরিটি", href: "/admin/audit", icon: "🛡️" },
  ];

  const handleLogout = async () => {
    await logoutAdminSession();
    router.push("/admin-login");
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800">
      {/* Sidebar */}
      <aside suppressHydrationWarning className="w-64 bg-[#0a382b] text-slate-200 hidden md:flex flex-col justify-between shrink-0 p-5 border-r border-emerald-950">
        <div suppressHydrationWarning className="space-y-6">
          <div suppressHydrationWarning className="border-b border-emerald-900 pb-4">
            <Link href="/" className="text-xl font-black text-white block">
              জীবনযত্ন <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-semibold">Admin</span>
            </Link>
            <div className="text-[11px] text-emerald-300 font-mono mt-1 truncate">
              {adminEmail}
            </div>
          </div>

          <nav suppressHydrationWarning className="space-y-1 text-xs font-bold">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl transition ${
                    active ? "bg-emerald-800 text-white shadow-xs" : "hover:bg-emerald-900/60 text-slate-300"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div suppressHydrationWarning className="space-y-2 border-t border-emerald-900 pt-4 text-xs font-bold">
          <Link
            href="/"
            className="flex items-center space-x-2 text-slate-300 hover:text-white px-2 py-1.5 rounded-lg transition"
          >
            <span>🌐 পাবলিক সাইট দেখুন</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 text-rose-300 hover:bg-rose-900/40 px-2 py-2 rounded-xl transition text-left"
          >
            <span>🚪 লগআউট (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div suppressHydrationWarning className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header suppressHydrationWarning className="bg-white border-b border-slate-200 px-6 py-3.5 flex justify-between items-center sticky top-0 z-30 shadow-2xs">
          <div suppressHydrationWarning className="flex items-center space-x-2 text-xs">
            <span className="font-extrabold text-[#0f4c3a]">Super Admin Session:</span>
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-mono font-bold text-[11px]">
              {adminEmail}
            </span>
          </div>

          <div suppressHydrationWarning className="flex items-center space-x-2">
            <Link
              href="/"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition"
            >
              Public Site ↗
            </Link>
            <button
              onClick={handleLogout}
              className="bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded-xl text-xs font-bold transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Children */}
        <main suppressHydrationWarning className="p-6 md:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
