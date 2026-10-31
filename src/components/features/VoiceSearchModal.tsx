"use client";

import React, { useEffect, useState, useRef } from "react";
import { normalizeVoiceQuery } from "@/lib/medical/voiceSearchHelper";
import { useLanguage } from "@/context/LanguageContext";

export default function VoiceSearchModal({
  isOpen,
  onClose,
  onResult,
}: {
  isOpen: boolean;
  onClose: () => void;
  onResult: (queryText: string) => void;
}) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"starting" | "listening" | "error" | "unsupported">("starting");
  const [liveText, setLiveText] = useState("");
  const [errorDetail, setErrorDetail] = useState("");
  const [recLang, setRecLang] = useState<"en-US" | "bn-BD">("en-US");
  const recognitionRef = useRef<any>(null);

  const stopRecognition = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
    } catch {}
  };

  const startListeningSession = async (selectedLang: "en-US" | "bn-BD") => {
    stopRecognition();
    setLiveText("");
    setErrorDetail("");
    setStatus("starting");

    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("unsupported");
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch {
      setStatus("error");
      setErrorDetail(
        t(
          "মাইক্রোফোন পারমিশন পাওয়া যায়নি। ব্রাউজারের URL বারের কাছে মাইক্রোফোন Allow করুন।",
          "Microphone access denied. Please allow microphone access."
        )
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = selectedLang;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setStatus("listening");
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        let finalStr = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalStr += transcript;
          } else {
            interim += transcript;
          }
        }

        const raw = finalStr || interim;
        const normalized = normalizeVoiceQuery(raw);
        setLiveText(normalized || raw);

        if (finalStr) {
          const finalQuery = normalizeVoiceQuery(finalStr);
          if (finalQuery) {
            setTimeout(() => {
              stopRecognition();
              onResult(finalQuery);
              onClose();
            }, 300);
          }
        }
      };

      recognition.onerror = (event: any) => {
        // Safely extract error string instead of rejecting with raw Event object!
        const errType = event?.error || "unknown";
        setStatus("error");
        if (errType === "no-speech") {
          setErrorDetail(t("কোনো কথা শোনা যায়নি। আবার বলুন।", "No speech detected. Try again."));
        } else {
          setErrorDetail(t(`ভয়েস সমস্যা (${errType})। নিচে থেকে সিলেক্ট করুন।`, `Voice error (${errType}). Select below.`));
        }
      };

      recognition.onend = () => {
        setStatus((prev) => (prev === "listening" ? "error" : prev));
      };

      recognition.start();
    } catch {
      setStatus("error");
      setErrorDetail("Could not initialize speech engine.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      startListeningSession(recLang);
    } else {
      stopRecognition();
    }
    return () => stopRecognition();
  }, [isOpen, recLang]);

  if (!isOpen) return null;

  const quickVoicePresets = ["Napa Extend", "Sergel 20", "Seclo 20", "Maxpro 20", "Paracetamol", "Cefixime", "Omron"];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200 text-center space-y-5 relative">
        <button
          onClick={() => {
            stopRecognition();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-black flex items-center justify-center transition cursor-pointer"
        >
          ✕
        </button>

        {/* Language Switcher */}
        <div className="inline-flex bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setRecLang("en-US")}
            className={`px-3 py-1 rounded-full transition cursor-pointer ${
              recLang === "en-US" ? "bg-[#0f4c3a] text-white" : "text-slate-600"
            }`}
          >
            English (Napa)
          </button>
          <button
            type="button"
            onClick={() => setRecLang("bn-BD")}
            className={`px-3 py-1 rounded-full transition cursor-pointer ${
              recLang === "bn-BD" ? "bg-[#0f4c3a] text-white" : "text-slate-600"
            }`}
          >
            বাংলা (নাপা)
          </button>
        </div>

        {/* Mic Circle */}
        <div className="py-2 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={() => startListeningSession(recLang)}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all cursor-pointer shadow-xl ${
              status === "listening"
                ? "bg-rose-600 text-white voice-active-ring scale-105"
                : "bg-emerald-50 text-[#0f4c3a] border-2 border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            🎙️
          </button>

          <h3 className="text-base font-black text-slate-900 mt-3">
            {status === "starting" && t("মাইক্রোফোন চালু হচ্ছে...", "Starting Mic...")}
            {status === "listening" && t("শুনছি... ওষুধের নাম বলুন", "Listening... Speak now")}
            {status === "error" && t("আবার চেষ্টা করুন", "Tap to Retry")}
            {status === "unsupported" && "Browser Not Supported"}
          </h3>

          {liveText ? (
            <div className="mt-2.5 px-4 py-2 bg-emerald-50 border border-emerald-300 text-[#0f4c3a] rounded-2xl text-sm font-black">
              &ldquo;{liveText}&rdquo;
            </div>
          ) : (
            <p className="text-xs text-slate-500 mt-1">
              {t("যেমন: Napa, Sergel, Seclo", "Say: Napa, Sergel, Seclo")}
            </p>
          )}

          {errorDetail && (
            <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900">
              {errorDetail}
            </div>
          )}
        </div>

        {/* Quick Presets */}
        <div className="border-t border-slate-100 pt-3 text-left space-y-2">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase text-center">
            {t("অথवा এক-ক্লিক করুন:", "Or pick instant preset:")}
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {quickVoicePresets.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  stopRecognition();
                  onResult(item);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#0f4c3a] hover:text-white text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                🎙️ {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}