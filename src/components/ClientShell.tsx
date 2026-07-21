"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <>
      {!isLoginPage && <Sidebar />}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden relative">
        
        {/* Global Language Toggle for Authenticated Pages */}
        {!isLoginPage && (
          <button
            onClick={toggleLanguage}
            className="absolute top-6 right-8 flex items-center justify-center w-12 h-10 rounded-xl transition-all duration-150 font-bold text-xs shadow-lg z-50 cursor-pointer"
            style={{
              background: "rgba(22, 22, 30, 0.8)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-secondary)",
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(124,106,247,0.15)";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(22, 22, 30, 0.8)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
            }}
            title={t("common.language")}
          >
            <Globe size={14} className="mr-1 opacity-70" />
            {language === "tr" ? "TR" : "EN"}
          </button>
        )}

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </>
  );
}
