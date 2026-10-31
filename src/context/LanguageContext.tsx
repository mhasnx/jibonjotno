"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Lang = "bn" | "en";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (bnText: string, enText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jibonjotno_lang") as Lang | null;
      if (saved === "bn" || saved === "en") {
        setLangState(saved);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("jibonjotno_lang", l);
    } catch {
      // ignore storage errors
    }
  };

  const toggleLang = () => {
    setLang(lang === "bn" ? "en" : "bn");
  };

  const t = (bnText: string, enText: string) => (lang === "bn" ? bnText : enText);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}