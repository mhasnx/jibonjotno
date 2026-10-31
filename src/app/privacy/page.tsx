"use client";

import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex flex-col justify-between font-sans text-slate-800 pb-20 lg:pb-0">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-10 flex-1 w-full space-y-8">
        <div className="bg-[#0f4c3a] text-white rounded-3xl p-8 md:p-10 shadow-xl space-y-3">
          <div className="inline-block bg-emerald-100 text-emerald-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            {t("\u09A8\u09BF\u09B0\u09BE\u09AA\u09A4\u09CD\u09A4\u09BE \u0993 \u0986\u0987\u09A8\u0997\u09A4 \u09B8\u09CD\u09AC\u099A\u09CD\u099B\u09A4\u09BE", "Security & Regulatory Compliance")}
          </div>
          <h1 className="text-2xl md:text-4xl font-black">
            {t("\u0997\u09CB\u09AA\u09A8\u09C0\u09DF\u09A4\u09BE \u09A8\u09C0\u09A4\u09BF \u0993 \u09A1\u09C7\u099F\u09BE \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE", "Privacy Policy & Data Protection")}
          </h1>
          <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
            {t(
              "\u099C\u09C0\u09AC\u09A8\u09AF\u09A4\u09CD\u09A8 \u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u099F\u09AB\u09B0\u09CD\u09AE \u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u0997\u09A4 \u09A4\u09A5\u09CD\u09AF, \u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8 \u0987\u09AE\u09C7\u099C \u098F\u09AC\u0982 \u09A1\u09BF\u099C\u09BF\u099F\u09BE\u09B2 \u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE\u09DF \u09AA\u09CD\u09B0\u09A4\u09BF\u09B6\u09CD\u09B0\u09C1\u09A4\u09BF\u09AC\u09A6\u09CD\u09A7\u0964",
              "JibonJotno is committed to protecting your personal data, medical prescriptions, and health privacy."
            )}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/90 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed text-slate-700">
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              📋 {t("1. \u0986\u09AE\u09B0\u09BE \u0995\u09C0 \u0995\u09C0 \u09A4\u09A5\u09CD\u09AF \u09B8\u0982\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09BF", "1. Information We Collect")}
            </h2>
            <p>
              {t(
                "\u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF\u09A4\u09C7 \u0993\u09B7\u09C1\u09A7 \u09B8\u09B0\u09AC\u09B0\u09BE\u09B9 \u0993 \u09AB\u09BE\u09B0\u09CD\u09AE\u09BE\u09B8\u09BF\u0989\u099F\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u09AF\u09BE\u099A\u09BE\u0987\u0995\u09B0\u09A3\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0986\u09AE\u09B0\u09BE \u0997\u09CD\u09B0\u09BE\u09B9\u0995\u09C7\u09B0 \u09A8\u09BE\u09AE, \u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u09A8\u09AE\u09CD\u09AC\u09B0, \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09A0\u09BF\u0995\u09BE\u09A8\u09BE \u098F\u09AC\u0982 \u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8\u09C7\u09B0 \u099B\u09AC\u09BF \u09B8\u0982\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09BF\u0964",
                "To deliver medications via Cash on Delivery and verify prescription accuracy, we collect customer name, phone number, delivery address, and uploaded prescription photos."
              )}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              🩺 {t("2. \u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8 \u0993 \u09AE\u09C7\u09A1\u09BF\u0995\u09C7\u09B2 \u09A4\u09A5\u09CD\u09AF\u09C7\u09B0 \u09A8\u09BF\u09B0\u09BE\u09AA\u09A4\u09CD\u09A4\u09BE", "2. Medical Prescription Security & Auditing")}
            </h2>
            <p>
              {t(
                "\u0986\u09AA\u09B2\u09CB\u09A1\u0995\u09C3\u09A4 \u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8 \u0995\u09CB\u09A8\u09CB \u09A4\u09C3\u09A4\u09C0\u09DF \u09AA\u0995\u09CD\u09B7\u09C7\u09B0 \u09A8\u09BF\u0995\u099F \u09AC\u09BF\u0995\u09CD\u09B0\u09DF \u09AC\u09BE \u09B6\u09C7\u09DF\u09BE\u09B0 \u0995\u09B0\u09BE \u09B9\u09DF \u09A8\u09BE\u0964 \u09B6\u09C1\u09A7\u09C1\u09AE\u09BE\u09A4\u09CD\u09B0 DGDA \u09A8\u09BF\u09B0\u09CD\u09A6\u09C7\u09B6\u09BF\u0995\u09BE \u0993 \u09AB\u09BE\u09B0\u09CD\u09AE\u09BE\u09B8\u09BF\u09B8\u09CD\u099F \u0985\u09A1\u09BF\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09AC\u09CD\u09AF\u09AC\u09B9\u09C3\u09A4 \u09B9\u09DF\u0964",
                "Uploaded prescriptions are never shared or sold to third parties. They are strictly audited by registered pharmacists to comply with DGDA pharmacy standards."
              )}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              📢 {t("3. Google AdSense \u0993 \u0995\u09C1\u0995\u09BF \u09A8\u09C0\u09A4\u09BF", "3. Google AdSense & Third-Party Cookies")}
            </h2>
            <p>
              {t(
                "\u099C\u09C0\u09AC\u09A8\u09AF\u09A4\u09CD\u09A8 \u0993\u09DF\u09C7\u09AC\u09B8\u09BE\u0987\u099F\u09C7 Google \u098F\u0995\u099C\u09A8 \u09A5\u09BE\u09B0\u09CD\u09A1-\u09AA\u09BE\u09B0\u09CD\u099F\u09BF \u09AD\u09C7\u09A8\u09CD\u09A1\u09B0 \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 DoubleClick DART \u0995\u09C1\u0995\u09BF \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7 \u09AC\u09BF\u099C\u09CD\u099E\u09BE\u09AA\u09A8 \u09AA\u09CD\u09B0\u09A6\u09B0\u09CD\u09B6\u09A8 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u0964 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u0995\u09BE\u09B0\u09C0 Google Ad Settings \u09A5\u09C7\u0995\u09C7 DART \u0995\u09C1\u0995\u09BF opt-out \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u09A8\u0964",
                "JibonJotno uses Google AdSense to serve advertisements. Google uses DoubleClick DART cookies to serve ads based on visit history. Users may opt out via Google Ad Settings."
              )}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              💵 {t("4. 100% \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09A8\u09BF\u09B0\u09BE\u09AA\u09A4\u09CD\u09A4\u09BE", "4. 100% Cash on Delivery Financial Security")}
            </h2>
            <p>
              {t(
                "\u0986\u09AE\u09B0\u09BE \u0995\u09CB\u09A8\u09CB \u0995\u09CD\u09B0\u09C7\u09A1\u09BF\u099F/\u09A1\u09C7\u09AC\u09BF\u099F \u0995\u09BE\u09B0\u09CD\u09A1 \u09AC\u09BE \u09AC\u09CD\u09AF\u09BE\u0982\u0995\u09BF\u0982 \u09AA\u09BE\u09B8\u0993\u09DF\u09BE\u09B0\u09CD\u09A1 \u09B8\u0982\u09B0\u0995\u09CD\u09B7\u09A3 \u0995\u09B0\u09BF \u09A8\u09BE\u0964 \u09B8\u0995\u09B2 \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u09AA\u09A3\u09CD\u09AF \u09B9\u09BE\u09A4\u09C7 \u09AA\u09C7\u09DF\u09C7 \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF\u09A4\u09C7 \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u09B9\u09DF\u0964",
                "We do not collect or store credit/debit card or banking credentials. All orders are fulfilled via 100% Cash on Delivery."
              )}
            </p>
          </section>
        </div>

        <div className="text-center pt-2">
          <Link href="/" className="inline-flex items-center space-x-1 text-xs font-black text-[#0f4c3a] hover:underline">
            <span>← {t("\u09B9\u09CB\u09AE \u09AA\u09C7\u099C\u09C7 \u09AB\u09BF\u09B0\u09C7 \u09AF\u09BE\u09A8", "Back to Home")}</span>
          </Link>
        </div>
      </main>

      <footer className="bg-[#072e23] text-slate-300 py-8 text-center text-xs mt-10">
        <p className="font-bold text-white text-sm mb-1">JibonJotno Digital Health</p>
        <p className="text-slate-400">&copy; 2026 JibonJotno. All rights reserved.</p>
      </footer>
    </div>
  );
}