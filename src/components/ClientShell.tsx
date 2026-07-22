"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <>
      {!isLoginPage && <Sidebar />}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden relative">
        {/* Global Action Buttons for Authenticated Pages */}
        {!isLoginPage && (
          <div className="absolute top-6 right-8 flex items-center gap-3 z-50">
            <ThemeToggle />
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center w-12 h-10 rounded-xl transition-all duration-150 font-bold text-xs shadow-lg cursor-pointer bg-surface border border-border text-secondary hover:text-foreground hover:bg-hover"
              title={t("common.language")}
            >
              <Globe size={14} className="mr-1 opacity-70" />
              {language === "tr" ? "TR" : "EN"}
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </>
  );
}
