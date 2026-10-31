"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import QuickRxOrderModal from "@/components/features/QuickRxOrderModal";
import AuthModal from "@/components/features/AuthModal";

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [rxModalOpen, setRxModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const { totalItems } = useCart();
  const { currentUser, logout } = useAuth();

  const mainLinks = [
    { name: t("\u09B9\u09CB\u09AE", "Home"), href: "/", icon: "🏠" },
    { name: t("\u0994\u09B7\u09A7 \u09A8\u09BF\u09B0\u09CD\u09A6\u09C7\u09B6\u09BF\u0995\u09BE", "Medicines"), href: "/medicines", icon: "💊" },
    { name: t("\u09A6\u09BE\u09AE\u09C7\u09B0 \u09A4\u09C1\u09B2\u09A8\u09BE", "Compare"), href: "/compare", icon: "⚖️" },
    { name: t("\u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF \u0986\u09B0\u09CD\u099F\u09BF\u0995\u09C7\u09B2", "Guides"), href: "/videos", icon: "🩺" },
    { name: t("\u0986\u0987\u09B8\u09BF\u0987\u0989 \u0993 \u09AE\u09CD\u09AF\u09BE\u09AA", "ICU Map"), href: "/map", icon: "🏥" },
  ];

  const serviceItems = [
    { name: t("\u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8 \u0986\u09AA\u09B2\u09CB\u09A1 \u0995\u09B0\u09C7 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0", "Upload Prescription Order"), onClick: () => setRxModalOpen(true), icon: "📷" },
    { name: t("\u09B2\u0995\u09CD\u09B7\u09A3 \u09AF\u09BE\u099A\u09BE\u0987 (Symptom Checker)", "Symptom Checker"), href: "/symptom-checker", icon: "⚡" },
    { name: t("\u099C\u09B0\u09C1\u09B0\u09BF \u09AC\u09CD\u09B2\u09BE\u09A1 \u09AC\u09CD\u09AF\u09BE\u0982\u0995 \u0993 \u09B0\u0995\u09CD\u09A4\u09A6\u09BE\u09A4\u09BE", "Blood Bank & Donors"), href: "/blood-bank", icon: "🩸" },
    { name: t("\u09B2\u09CD\u09AF\u09BE\u09AC \u099F\u09C7\u09B8\u09CD\u099F \u0993 \u09B9\u09CB\u09AE \u09B8\u09CD\u09AF\u09BE\u09AE\u09CD\u09AA\u09B2", "Diagnostic Lab Tests"), href: "/lab-tests", icon: "🧪" },
    { name: t("\u09B6\u09BF\u09B6\u09C1\u09B0 \u09B8\u09BF\u09B0\u09BE\u09AA \u09A1\u09CB\u099C \u0995\u09CD\u09AF\u09BE\u09B2\u0995\u09C1\u09B2\u09C7\u099F\u09B0", "Pediatric Syrup Dose"), href: "/pediatric-dose", icon: "👶" },
    { name: t("\u09AE\u09BE\u09B8\u09BF\u0995 \u09B0\u09BF\u09AB\u09BF\u09B2 \u0993 \u09AA\u09BF\u09B2 \u09B0\u09BF\u09AE\u09BE\u0987\u09A8\u09CD\u09A1\u09BE\u09B0", "Monthly Refill Tracker"), href: "/refill", icon: "🔄" },
    { name: t("\u099C\u09B0\u09C1\u09B0\u09BF \u0985\u09CD\u09AF\u09BE\u09AE\u09CD\u09AC\u09C1\u09B2\u09C7\u09A8\u09CD\u09B8 \u0993 \u0985\u0995\u09CD\u09B8\u09BF\u099C\u09C7\u09A8", "Ambulance & Oxygen"), href: "/ambulance", icon: "🚑" },
    { name: t("\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u0993 \u0995\u09CD\u09AF\u09BE\u09B6 \u09AE\u09C7\u09AE\u09CB", "Track Order & Memo"), href: "/track-order", icon: "🚚" },
    { name: t("\u0997\u09CB\u09AA\u09A8\u09C0\u09DF\u09A4\u09BE \u0993 \u09A1\u09C7\u099F\u09BE \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE", "Privacy & Security"), href: "/privacy", icon: "🛡️" },
  ];

  return (
    <div className="w-full">
      <QuickRxOrderModal isOpen={rxModalOpen} onClose={() => setRxModalOpen(false)} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
          <Link href="/" prefetch={true} className="flex items-center space-x-2 group shrink-0">
            <span className="text-2xl font-black text-[#0f4c3a] tracking-tight">
              {t("\u099C\u09C0\u09AC\u09A8\u09AF\u09A4\u09CD\u09A8", "JibonJotno")}
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              {t("\u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF", "Health Portal")}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {mainLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                    isActive
                      ? "bg-[#0f4c3a] text-white shadow-xs"
                      : "text-slate-600 hover:text-[#0f4c3a] hover:bg-emerald-50/70"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="relative">
              <button
                type="button"
                onClick={() => setServicesDropdown(!servicesDropdown)}
                onBlur={() => setTimeout(() => setServicesDropdown(false), 220)}
                className="px-3 py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center space-x-1 text-slate-600 hover:text-[#0f4c3a] hover:bg-emerald-50/70 cursor-pointer"
              >
                <span>{t("\u0985\u09A8\u09CD\u09AF\u09BE\u09A8\u09CD\u09AF \u09B8\u09C7\u09AC\u09BE", "More Services")}</span>
                <span className="text-[10px] ml-0.5">▼</span>
              </button>

              <AnimatePresence>
                {servicesDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 6 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2.5 z-50 grid grid-cols-1 divide-y divide-slate-100"
                  >
                    {serviceItems.map((s, idx) =>
                      s.onClick ? (
                        <button
                          key={idx}
                          onClick={() => {
                            setServicesDropdown(false);
                            s.onClick();
                          }}
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-xs font-bold transition text-left text-slate-700 hover:bg-emerald-50 hover:text-[#0f4c3a] cursor-pointer"
                        >
                          <span className="text-base">{s.icon}</span>
                          <span>{s.name}</span>
                        </button>
                      ) : (
                        <Link
                          key={idx}
                          href={s.href!}
                          prefetch={true}
                          onClick={() => setServicesDropdown(false)}
                          className={`flex items-center space-x-2.5 px-4 py-2.5 text-xs font-bold transition ${
                            pathname === s.href ? "bg-emerald-50 text-[#0f4c3a]" : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-base">{s.icon}</span>
                          <span>{s.name}</span>
                        </Link>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex items-center space-x-2 shrink-0">
            <Link
              href="/map"
              prefetch={true}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-full text-xs font-bold transition flex items-center space-x-1 shadow-xs"
            >
              <span>🚨 {t("\u099C\u09B0\u09C1\u09B0\u09BF", "Emergency")}</span>
            </Link>

            <Link
              href="/pharmacy"
              prefetch={true}
              className="bg-[#0f4c3a] hover:bg-emerald-950 text-white px-3.5 py-2 rounded-full text-xs font-bold transition flex items-center space-x-1.5 shadow-xs relative"
            >
              <span>💊 {t("\u09AB\u09BE\u09B0\u09CD\u09AE\u09C7\u09B8\u09BF", "Pharmacy")}</span>
              {totalItems > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-xs">
                <span className="font-extrabold text-emerald-900 truncate max-w-[110px]">👤 {currentUser.name}</span>
                <button
                  onClick={logout}
                  className="text-rose-700 font-bold hover:underline ml-1 cursor-pointer"
                  title="Logout"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:flex bg-[#0f4c3a] hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-xs items-center space-x-1 cursor-pointer"
              >
                <span>👤 {t("\u09B2\u0997\u0987\u09A8", "Login")}</span>
              </button>
            )}

            {/* Fixed Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200">
              <button
                type="button"
                onClick={() => setLang("bn")}
                className={`px-2.5 py-1 rounded-full text-xs font-extrabold transition cursor-pointer ${
                  lang === "bn" ? "bg-[#0f4c3a] text-white shadow-xs" : "text-slate-600"
                }`}
              >
                {"\u09AC\u09BE\u0982\u09B2\u09BE"}
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-full text-xs font-extrabold transition cursor-pointer ${
                  lang === "en" ? "bg-[#0f4c3a] text-white shadow-xs" : "text-slate-600"
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Framer Motion Animated Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-1 shadow-lg max-h-[82vh] overflow-y-auto"
            >
              {currentUser ? (
                <div className="p-3 bg-emerald-50 rounded-2xl flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-emerald-950">👤 {currentUser.name}</span>
                  <button onClick={logout} className="text-xs font-bold text-rose-700">
                    {t("\u09B2\u0997\u0986\u0989\u099F", "Logout")}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-[#0f4c3a] text-white rounded-xl text-xs font-bold mb-2 shadow-xs"
                >
                  👤 {t("\u09B2\u0997\u0987\u09A8", "Login")}
                </button>
              )}

              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                {t("\u09AA\u09CD\u09B0\u09A7\u09BE\u09A8 \u09AB\u09BF\u099A\u09BE\u09B0 (Main Pages)", "Main Pages")}
              </div>
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                    pathname === link.href ? "bg-[#0f4c3a] text-white" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}

              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1 border-t border-slate-100">
                {t("\u099C\u09B0\u09C1\u09B0\u09BF \u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF\u09B8\u09C7\u09AC\u09BE \u0993 \u099F\u09C1\u09B2\u09B8", "Health Utilities")}
              </div>
              {serviceItems.map((item, idx) =>
                item.onClick ? (
                  <button
                    key={idx}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      item.onClick();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition text-left bg-emerald-50 text-[#0f4c3a]"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <Link
                    key={idx}
                    href={item.href!}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                      pathname === item.href ? "bg-emerald-50 text-[#0f4c3a]" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-[45] flex justify-around items-center py-2 px-1 shadow-lg pb-[env(safe-area-inset-bottom)]">
        <Link href="/" className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold ${pathname === "/" ? "text-[#0f4c3a]" : "text-slate-500"}`}>
          <span className="text-base mb-0.5">🏠</span>
          <span>{t("\u09B9\u09CB\u09AE", "Home")}</span>
        </Link>
        <Link href="/medicines" className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold ${pathname === "/medicines" ? "text-[#0f4c3a]" : "text-slate-500"}`}>
          <span className="text-base mb-0.5">💊</span>
          <span>{t("\u0994\u09B7\u09A7", "Meds")}</span>
        </Link>
        <button onClick={() => setRxModalOpen(true)} className="flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold text-amber-600">
          <span className="text-base mb-0.5">📷</span>
          <span>{t("Rx \u0985\u09B0\u09CD\u09A1\u09BE\u09B0", "Upload")}</span>
        </button>
        <Link href="/blood-bank" className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold ${pathname === "/blood-bank" ? "text-rose-600" : "text-slate-500"}`}>
          <span className="text-base mb-0.5">🩸</span>
          <span>{t("\u09B0\u0995\u09CD\u09A4", "Blood")}</span>
        </Link>
        <Link href="/track-order" className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold ${pathname === "/track-order" ? "text-[#0f4c3a]" : "text-slate-500"}`}>
          <span className="text-base mb-0.5">🚚</span>
          <span>{t("\u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995", "Track")}</span>
        </Link>
      </nav>
    </div>
  );
}