"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  showWhatsAppCTA?: boolean;
  userQuery?: string;
}

const WHATSAPP_NUMBER_DISPLAY = "01516563085";
const WHATSAPP_NUMBER_INTL = "8801516563085";

export default function WhatsAppButton() {
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text:
        lang === "bn"
          ? "\u0986\u09B8\u09B8\u09BE\u09B2\u09BE\u09AE\u09C1 \u0986\u09B2\u09BE\u0987\u0995\u09C1\u09AE! \u0986\u09AE\u09BF \u099C\u09C0\u09AC\u09A8\u09AF\u09A4\u09CD\u09A8 \u09B8\u09CD\u09AE\u09BE\u09B0\u09CD\u099F \u09B9\u09C7\u09B2\u09A5 \u0985\u09CD\u09AF\u09BE\u09B8\u09BF\u09B8\u09CD\u099F\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u0964 \u0993\u09B7\u09C1\u09A7\u09C7\u09B0 \u09A6\u09BE\u09AE, \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09AC\u09BE \u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09A8\u09BF\u09DF\u09C7 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u0995\u09B0\u09C1\u09A8!"
          : "Hello! I am JibonJotno AI Assistant. Ask me about medicine prices, delivery charges, or prescription orders!",
    },
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, expanded]);

  // Smart Knowledge Base Engine
  const generateBotReply = (rawQuestion: string): { reply: string; needsWhatsApp: boolean } => {
    const q = rawQuestion.toLowerCase().trim();

    // 1. Delivery Charge & Time
    if (
      q.includes("delivery") ||
      q.includes("charge") ||
      q.includes("fee") ||
      q.includes("\u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF") ||
      q.includes("\u099A\u09BE\u09B0\u09CD\u099C") ||
      q.includes("koto din") ||
      q.includes("somoy")
    ) {
      return {
        reply: t(
          "\u09A2\u09BE\u0995\u09BE \u09B8\u09BF\u099F\u09BF\u09A4\u09C7 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u099A\u09BE\u09B0\u09CD\u099C \u09AE\u09BE\u09A4\u09CD\u09B0 \u09EC\u09E6 \u099F\u09BE\u0995\u09BE (\u09E8-\u09EC \u0998\u09A3\u09CD\u099F\u09BE\u09DF \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF) \u098F\u09AC\u0982 \u09A2\u09BE\u0995\u09BE\u09B0 \u09AC\u09BE\u0987\u09B0\u09C7 \u09E7\u09E8\u09E6 \u099F\u09BE\u0995\u09BE\u0964 \u09B8\u09AC \u0985\u09B0\u09CD\u09A1\u09BE\u09B0\u09C7 \u09E7\u09E6\u09E6% \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE \u09B0\u09DF\u09C7\u099B\u09C7\u0964",
          "Delivery fee inside Dhaka City is BDT 60 (within 2-6 hours) and outside Dhaka is BDT 120. All orders are 100% Cash on Delivery!"
        ),
        needsWhatsApp: false,
      };
    }

    // 2. Payment / Cash on Delivery / Guest Order
    if (
      q.includes("payment") ||
      q.includes("cod") ||
      q.includes("cash") ||
      q.includes("bkash") ||
      q.includes("login") ||
      q.includes("\u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F") ||
      q.includes("\u0995\u09CD\u09AF\u09BE\u09B6") ||
      q.includes("order") ||
      q.includes("\u0985\u09B0\u09CD\u09A1\u09BE\u09B0")
    ) {
      return {
        reply: t(
          "\u0986\u09AA\u09A8\u09BF \u09B2\u0997\u0987\u09A8 \u099B\u09BE\u09DC\u09BE\u0987 \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u0997\u09C7\u09B8\u09CD\u099F \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u09A8\u0964 \u0995\u09CB\u09A8\u09CB \u0985\u0997\u09CD\u09B0\u09BF\u09AE \u099F\u09BE\u0995\u09BE \u09A6\u09BF\u09A4\u09C7 \u09B9\u09AC\u09C7 \u09A8\u09BE\u2014\u0993\u09B7\u09C1\u09A7 \u09B9\u09BE\u09A4\u09C7 \u09AA\u09C7\u09DF\u09C7 \u09AE\u09C2\u09B2\u09CD\u09AF \u09AA\u09B0\u09BF\u09B6\u09CB\u09A7 \u0995\u09B0\u09AC\u09C7\u09A8 (100% Cash on Delivery)\u0964",
          "You can order as a Guest without logging in! No advance payment is required—pay 100% Cash on Delivery when you receive your medicines."
        ),
        needsWhatsApp: false,
      };
    }

    // 3. Prescription Upload
    if (
      q.includes("prescription") ||
      q.includes("rx") ||
      q.includes("chobi") ||
      q.includes("photo") ||
      q.includes("\u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8") ||
      q.includes("\u099B\u09AC\u09BF")
    ) {
      return {
        reply: t(
          "\u09B9\u09CB\u09AE\u09AA\u09C7\u099C\u09C7\u09B0 'Upload Rx' \u09AC\u09BE\u099F\u09A8\u09C7 \u0995\u09CD\u09B2\u09BF\u0995 \u0995\u09B0\u09C7 \u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8\u09C7\u09B0 \u099B\u09AC\u09BF \u09A6\u09BF\u09A8 \u0985\u09A5\u09AC\u09BE \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u0986\u09AE\u09BE\u09A6\u09C7\u09B0 WhatsApp (" + WHATSAPP_NUMBER_DISPLAY + ") \u09A8\u09AE\u09CD\u09AC\u09B0\u09C7 \u09AA\u09BE\u09A0\u09BF\u09DF\u09C7 \u09A6\u09BF\u09A8\u0964",
          "Click the 'Upload Rx' button on the homepage to upload your prescription photo, or send it directly to our WhatsApp (" + WHATSAPP_NUMBER_DISPLAY + ")."
        ),
        needsWhatsApp: true,
      };
    }

    // 4. Common Medicine Prices
    if (q.includes("napa") || q.includes("paracetamol") || q.includes("\u09A8\u09BE\u09AA\u09BE")) {
      return {
        reply: t(
          "Napa 500mg \u09AA\u09CD\u09B0\u09A4\u09BF \u09AA\u09BF\u09B8 \u09EE \u09E7.\u09E8\u09E6 \u098F\u09AC\u0982 Napa Extend (665mg) \u09AA\u09CD\u09B0\u09A4\u09BF \u09AA\u09BF\u09B8 \u09EE \u09E8.\u09E6\u09E6\u0964 'Medicines' \u09AA\u09C7\u099C \u09A5\u09C7\u0995\u09C7 \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u09A8\u0964",
          "Napa 500mg is BDT 1.20/unit and Napa Extend (665mg) is BDT 2.00/unit. You can order directly from the Pharmacy or Medicines page."
        ),
        needsWhatsApp: false,
      };
    }

    if (q.includes("sergel") || q.includes("seclo") || q.includes("maxpro") || q.includes("gastric") || q.includes("\u0997\u09CD\u09AF\u09BE\u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0995")) {
      return {
        reply: t(
          "Sergel 20mg (\u09EE \u09ED.\u09E6\u09E6), Seclo 20mg (\u09EE \u09EC.\u09E6\u09E6) \u098F\u09AC\u0982 Maxpro 20mg (\u09EE \u09ED.\u09E6\u09E6) \u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09AB\u09BE\u09B0\u09CD\u09AE\u09C7\u09B8\u09BF\u09A4\u09C7 \u09B8\u09CD\u099F\u0995\u09C7 \u0986\u099B\u09C7\u0964",
          "Sergel 20mg (BDT 7.00), Seclo 20mg (BDT 6.00), and Maxpro 20mg (BDT 7.00) are in stock and ready for delivery."
        ),
        needsWhatsApp: false,
      };
    }

    // 5. Emergency / Ambulance / Blood / ICU
    if (
      q.includes("emergency") ||
      q.includes("icu") ||
      q.includes("blood") ||
      q.includes("ambulance") ||
      q.includes("\u09B0\u0995\u09CD\u09A4") ||
      q.includes("\u0986\u0987\u09B8\u09BF\u0987\u0989") ||
      q.includes("\u0985\u09CD\u09AF\u09BE\u09AE\u09CD\u09AC\u09C1\u09B2\u09C7\u09A8\u09CD\u09B8")
    ) {
      return {
        reply: t(
          "\u099C\u09B0\u09C1\u09B0\u09BF \u0986\u0987\u09B8\u09BF\u0987\u0989 \u09AE\u09CD\u09AF\u09BE\u09AA, \u09AC\u09CD\u09B2\u09BE\u09A1 \u09AC\u09CD\u09AF\u09BE\u0982\u0995 \u098F\u09AC\u0982 \u09E8\u09EA/\u09ED \u0985\u09CD\u09AF\u09BE\u09AE\u09CD\u09AC\u09C1\u09B2\u09C7\u09A8\u09CD\u09B8 \u09A8\u09AE\u09CD\u09AC\u09B0 \u0989\u09AA\u09B0\u09C7\u09B0 'Emergency' \u09AC\u09BE 'More Services' \u09AE\u09C7\u09A8\u09C1\u09A4\u09C7 \u09AA\u09BE\u09AC\u09C7\u09A8\u0964 \u099C\u09BE\u09A4\u09C0\u09DF \u099C\u09B0\u09C1\u09B0\u09BF \u09B9\u099F\u09B2\u09BE\u0987\u09A8: 999 | \u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF \u09AC\u09BE\u09A4\u09BE\u09DF\u09A8: 16263\u0964",
          "Find live ICU Maps, Blood Donors, and 24/7 Ambulances under 'Emergency' or 'More Services'. National Hotlines: 999 | Health Line: 16263."
        ),
        needsWhatsApp: false,
      };
    }

    // 6. Fallback when Bot does not have the exact answer -> Direct to WhatsApp 01516563085
    return {
      reply: t(
        "\u09A6\u09C1\u0983\u0996\u09BF\u09A4, \u098F\u0987 \u09AC\u09BF\u09B7\u09DF\u099F\u09BF\u09B0 \u09B8\u09A0\u09BF\u0995 \u0989\u09A4\u09CD\u09A4\u09B0 \u098F\u0987 \u09AE\u09C1\u09B9\u09C2\u09B0\u09CD\u09A4\u09C7 \u0986\u09AE\u09BE\u09B0 \u09A1\u09BE\u099F\u09BE\u09AC\u09C7\u09B8\u09C7 \u09A8\u09C7\u0987\u0964 \u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF WhatsApp \u09B8\u09BE\u09AA\u09CB\u09B0\u09CD\u099F \u09A8\u09AE\u09CD\u09AC\u09B0\u09C7 (" + WHATSAPP_NUMBER_DISPLAY + ") \u09AE\u09C7\u09B8\u09C7\u099C \u09AC\u09BE \u0995\u09B2 \u0995\u09B0\u09C1\u09A8, \u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09AA\u09CD\u09B0\u09A4\u09BF\u09A8\u09BF\u09A7\u09BF \u098F\u0996\u09A8\u0987 \u09B8\u09BE\u09B9\u09BE\u09AF\u09CD\u09AF \u0995\u09B0\u09AC\u09C7\u09A8!",
        "I don't have the exact answer to that right now. Please contact our representative directly on WhatsApp (" + WHATSAPP_NUMBER_DISPLAY + ") using the button below!"
      ),
      needsWhatsApp: true,
    };
  };

  const handleAskQuestion = (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: trimmed,
    };

    const { reply, needsWhatsApp } = generateBotReply(trimmed);

    const botMsg: ChatMessage = {
      id: `b-${Date.now() + 1}`,
      sender: "bot",
      text: reply,
      showWhatsAppCTA: needsWhatsApp,
      userQuery: trimmed,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputVal("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAskQuestion(inputVal);
  };

  const quickQuestions = [
    {
      labelBn: "🚚 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u099A\u09BE\u09B0\u09CD\u099C \u0995\u09A4?",
      labelEn: "🚚 Delivery Charge?",
      q: "Delivery charge koto?",
    },
    {
      labelBn: "💵 \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09A8\u09BF\u09DF\u09AE",
      labelEn: "💵 Cash on Delivery?",
      q: "Cash on delivery order kivabe korbo?",
    },
    {
      labelBn: "📷 \u09AA\u09CD\u09B0\u09C7\u09B8\u0995\u09CD\u09B0\u09BF\u09AA\u09B6\u09A8 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0",
      labelEn: "📷 Prescription Order",
      q: "How to order with prescription?",
    },
    {
      labelBn: "💊 Napa / Sergel \u09A6\u09BE\u09AE",
      labelEn: "💊 Medicine Prices",
      q: "Napa price?",
    },
  ];

  const getWhatsAppLink = (customQuery?: string) => {
    const msg = customQuery
      ? `আসসালামু আলাইকুম জীবনযত্ন টিম! আমার প্রশ্ন: "${customQuery}"`
      : "আসসালামু আলাইকুম জীবনযত্ন (JibonJotno) টিম! আমি ওষুধ অর্ডার বা স্বাস্থ্য তথ্য বিষয়ে সহায়তা চাচ্ছি।";
    return `https://wa.me/${WHATSAPP_NUMBER_INTL}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 md:left-6 z-[55] flex flex-col items-start space-y-2">
      {isOffline && (
        <div className="bg-rose-600 text-white px-3.5 py-2 rounded-2xl shadow-xl text-[11px] font-black flex items-center space-x-2 border border-white/20">
          <span>📡 {t("\u0985\u09AB\u09B2\u09BE\u0987\u09A8 \u099C\u09B0\u09C1\u09B0\u09BF \u09B9\u099F\u09B2\u09BE\u0987\u09A8: 999 | 16263", "Offline Emergency: 999 | 16263")}</span>
        </div>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 14 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-2xl border border-emerald-200 w-[330px] sm:w-[360px] text-slate-800 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0f4c3a] to-emerald-800 text-white p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-lg">
                  🤖
                </div>
                <div>
                  <div className="text-xs font-black">
                    {t("\u099C\u09C0\u09AC\u09A8\u09AF\u09A4\u09CD\u09A8 AI \u099A\u09CD\u09AF\u09BE\u099F \u0993 WhatsApp", "JibonJotno AI & WhatsApp")}
                  </div>
                  <div className="text-[10px] text-emerald-200 font-semibold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>WhatsApp: {WHATSAPP_NUMBER_DISPLAY}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="text-white/80 hover:text-white text-xs font-black w-7 h-7 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className="p-3.5 space-y-2.5 max-h-64 overflow-y-auto bg-slate-50/70 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      m.sender === "user"
                        ? "bg-[#0f4c3a] text-white font-semibold rounded-br-xs"
                        : "bg-white border border-slate-200/90 text-slate-800 shadow-2xs rounded-bl-xs"
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.showWhatsAppCTA && (
                    <a
                      href={getWhatsAppLink(m.userQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center space-x-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white px-3.5 py-2 rounded-xl text-[11px] font-black shadow-sm transition"
                    >
                      <span>💬</span>
                      <span>
                        {t(
                          `WhatsApp-এ কথা বলুন (${WHATSAPP_NUMBER_DISPLAY})`,
                          `Chat on WhatsApp (${WHATSAPP_NUMBER_DISPLAY})`
                        )}
                      </span>
                    </a>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick FAQ Chips */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
              {quickQuestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAskQuestion(item.q)}
                  className="text-[10px] font-bold bg-emerald-50 hover:bg-[#0f4c3a] text-[#0f4c3a] hover:text-white px-2.5 py-1 rounded-full border border-emerald-200 transition cursor-pointer"
                >
                  {t(item.labelBn, item.labelEn)}
                </button>
              ))}
            </div>

            {/* User Input Box */}
            <form
              onSubmit={handleFormSubmit}
              className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-1.5"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={t(
                  "\u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09B2\u09BF\u0996\u09C1\u09A8...",
                  "Type your question here..."
                )}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f4c3a]"
              />
              <button
                type="submit"
                className="bg-[#0f4c3a] hover:bg-emerald-900 text-white px-3.5 py-2 rounded-xl text-xs font-black shrink-0 cursor-pointer transition"
              >
                {t("\u09AA\u09BE\u09A0\u09BE\u09A8", "Ask")}
              </button>
            </form>

            {/* Direct WhatsApp & Emergency Footer */}
            <div className="px-3.5 py-2.5 bg-slate-100 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-[#15803d] hover:underline flex items-center space-x-1"
              >
                <span>📞 WhatsApp: {WHATSAPP_NUMBER_DISPLAY}</span>
              </a>
              <span className="text-rose-700 font-bold">🚨 999 | 16263</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setExpanded(!expanded)}
        className="bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-3 rounded-full shadow-2xl flex items-center space-x-2 border-2 border-white cursor-pointer"
        aria-label="WhatsApp & AI Support"
      >
        <span className="text-lg">💬</span>
        <span className="text-xs font-black">
          {t("\u09B8\u09B9\u09BE\u09DF\u09A4\u09BE / WhatsApp", "WhatsApp / Help")}
        </span>
      </motion.button>
    </div>
  );
}