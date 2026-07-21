"use client";

import { Bell, Search, Command, Plus } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Header() {
  const { language, toggleLanguage, t } = useLanguage();
  
  return (
    <header
      className="flex items-center h-14 px-5 gap-4 border-b shrink-0"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* Search bar */}
      <button
        className="flex items-center gap-2 flex-1 max-w-sm h-8 px-3 rounded-lg text-sm transition-all duration-150"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        }}
      >
        <Search size={13} />
        <span className="flex-1 text-left text-[13px]">{t("header.search")}</span>
        <span
          className="flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded"
          style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}
        >
          <Command size={10} />K
        </span>
      </button>

      <div className="flex items-center gap-2 ml-auto">
        {/* New button */}
        <button
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-sm font-medium transition-all duration-150"
          style={{
            background: "linear-gradient(135deg, #7c6af7 0%, #a855f7 100%)",
            color: "#fff",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "0.88";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "1";
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline">{t("header.new")}</span>
        </button>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 font-bold text-xs"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
          }}
          title={t("common.language")}
        >
          {language === "tr" ? "TR" : "EN"}
        </button>

        {/* Notifications */}
        <button
          className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
          }}
        >
          <Bell size={14} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--accent)" }}
          />
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #7c6af7 0%, #a855f7 100%)",
            color: "#fff",
          }}
        >
          BE
        </div>
      </div>
    </header>
  );
}
