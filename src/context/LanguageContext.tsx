"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "../locales/en";
import { tr } from "../locales/tr";

type Language = "en" | "tr";
type Dictionary = Record<string, string>;

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const dictionaries: Record<Language, Dictionary> = {
  en,
  tr,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("tr"); // Default is tr

  useEffect(() => {
    // Check local storage for saved preference on mount
    const savedLang = localStorage.getItem("preferred_language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "tr")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === "en" ? "tr" : "en";
      localStorage.setItem("preferred_language", newLang);
      return newLang;
    });
  };

  const t = (key: string): string => {
    return dictionaries[language][key] || key; // Fallback to key if translation is missing
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
