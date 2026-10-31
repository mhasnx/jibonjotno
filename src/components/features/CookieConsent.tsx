"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    try {
      const consent = localStorage.getItem("jj_cookie_consent");
      if (!consent) {
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("jj_cookie_consent", "accepted");
      localStorage.setItem("jj_cookie_consent_timestamp", new Date().toISOString());
    } catch {}
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem("jj_cookie_consent", "essential_only");
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie Consent Banner"
      className="fixed bottom-20 lg:bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in duration-300"
    >
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xl rounded-3xl p-5 md:p-6 text-slate-800 space-y-4">
        <div className="flex items-start space-x-3">
          <span className="text-2xl shrink-0">🍪</span>
          <div className="space-y-1">
            <h3 className="text-xs md:text-sm font-black text-slate-900">
              {t(
                "\u0995\u09C1\u0995\u09BF \u0993 \u0997\u09CB\u09AA\u09A8\u09C0\u09DF\u09A4\u09BE \u09B8\u09AE\u09CD\u09AE\u09A4\u09BF",
                "Cookie & Privacy Preferences"
              )}
            </h3>
            <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed">
              {t(
                "\u099C\u09C0\u09AC\u09A8\u09AF\u09A4\u09CD\u09A8 \u09AC\u09CD\u09B0\u09BE\u0989\u099C\u09BF\u0982 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE \u0989\u09A8\u09CD\u09A8\u09A4 \u0995\u09B0\u09A4\u09C7, Google AdSense \u09B8\u09C7\u09AC\u09BE \u09A6\u09BF\u09A4\u09C7 \u098F\u09AC\u0982 \u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8 \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0995\u09B0\u09A4\u09C7 \u0995\u09C1\u0995\u09BF \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7\u0964",
                "JibonJotno uses essential and analytical cookies to improve browsing experience, deliver Google AdSense services, and secure prescription orders."
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
          <Link
            href="/privacy"
            className="text-[11px] font-bold text-[#0f4c3a] underline hover:text-emerald-950"
          >
            {t("\u0997\u09CB\u09AA\u09A8\u09C0\u09DF\u09A4\u09BE \u09A8\u09C0\u09A4\u09BF \u203A", "Privacy Policy \u203A")}
          </Link>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDecline}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              {t("\u09AA\u09CD\u09B0\u09DF\u09CB\u099C\u09A8\u09C0\u09DF \u09B6\u09C1\u09A7\u09C1", "Essential Only")}
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="bg-[#0f4c3a] hover:bg-emerald-900 text-white px-4 py-1.5 rounded-xl text-[11px] font-black transition shadow-xs cursor-pointer"
            >
              {t("\u09B8\u09AE\u09CD\u09AE\u09A4\u09BF \u09A6\u09BF\u099A\u09CD\u099B\u09BF", "Accept All")}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}