"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Sparkles,
  Library,
  Layers,
  Settings,
  Zap,
  ChevronRight,
} from "lucide-react";

const navItems = [
  {
    label: "Core Platform",
    items: [
      { icon: LayoutDashboard, label: "Satıcı Dashboard", href: "/" },
      { icon: LayoutDashboard, label: "Üretici Dashboard", href: "/producer-dashboard" },
      { icon: Search, label: "Product Research", href: "/product-research" },
      { icon: Sparkles, label: "AI Design Studio", href: "/ai-design-studio" },
      { icon: Library, label: "Design Library", href: "/design-library" },
      { icon: Layers, label: "Mockup & Publish", href: "/mockup-publish" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: Settings, label: "Settings", href: "/settings" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col w-[220px] shrink-0 border-r"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 h-14 px-5 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #7c6af7 0%, #a855f7 100%)",
          }}
        >
          <Zap size={14} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-sm tracking-tight" style={{ color: "var(--text-primary)" }}>
          Bot Etsy
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navItems.map((group) => (
          <div key={group.label}>
            <p
              className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ icon: Icon, label, href }) => {
                const active = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                      style={{
                        color: active ? "var(--text-primary)" : "var(--text-secondary)",
                        background: active ? "var(--bg-elevated)" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
                          (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                        }
                      }}
                    >
                      <Icon
                        size={16}
                        strokeWidth={active ? 2.2 : 1.8}
                        style={{ color: active ? "var(--accent)" : "inherit" }}
                      />
                      {label}
                      {active && (
                        <ChevronRight
                          size={12}
                          className="ml-auto opacity-50"
                          style={{ color: "var(--accent)" }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div
        className="p-3 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          className="w-full flex items-center gap-2.5 p-2 rounded-lg transition-all duration-150 text-left"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
          }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              background: "linear-gradient(135deg, #7c6af7 0%, #a855f7 100%)",
              color: "#fff",
            }}
          >
            BE
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
              Bot Etsy
            </p>
            <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
              Pro Plan
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
}
