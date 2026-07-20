"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Search,
  Sparkles,
  Library,
  Layers,
  Zap,
  ChevronRight,
  ShoppingBag,
  Package,
  LogOut,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  {
    label: "Core Platform",
    items: [
      { icon: LayoutDashboard, label: "Satıcı Dashboard", href: "/" },
      { icon: LayoutDashboard, label: "Üretici Dashboard", href: "/producer-dashboard" },
      { icon: ShoppingBag, label: "Siparişler", href: "/orders" },
      { icon: Package, label: "Ürünler", href: "/products" },
      { icon: Search, label: "Product Research", href: "/product-research" },
      { icon: Sparkles, label: "AI Design Studio", href: "/ai-design-studio" },
      { icon: Library, label: "Design Library", href: "/design-library" },
      { icon: Layers, label: "Mockup & Publish", href: "/mockup-publish" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // Show minimal loading state while checking auth
  if (isLoading) {
    return (
      <aside
        className="hidden md:flex flex-col w-[220px] shrink-0 border-r items-center justify-center"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <Loader2 size={18} className="text-purple-500 animate-spin" />
      </aside>
    );
  }

  if (!user) return null;

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

      {/* User Profile Footer */}
      <div
        className="p-3 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        {/* Clickable profile row → /settings */}
        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-2 py-2 rounded-lg mb-1 transition-all duration-150 group"
          style={{
            background: pathname === "/settings" ? "var(--bg-elevated)" : "transparent",
          }}
          onMouseEnter={(e) => {
            if (pathname !== "/settings")
              (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
          }}
          onMouseLeave={(e) => {
            if (pathname !== "/settings")
              (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          {/* Avatar */}
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ring-2 ring-offset-1 ring-offset-[#16161e] transition-all ${pathname === "/settings" ? "ring-[#7c6af7]" : "ring-transparent"}`}
            style={{
              background: "linear-gradient(135deg, #7c6af7 0%, #a855f7 100%)",
              color: "#fff",
            }}
          >
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
              {user.name}
            </p>
            <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
              {user.email}
            </p>
          </div>
          <ChevronRight size={12} className="opacity-30 group-hover:opacity-60 transition-opacity" style={{ color: "var(--text-muted)" }} />
        </Link>

        {/* Plan badge + logout row */}
        <div className="flex items-center justify-between px-2">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(124,106,247,0.12)",
              color: "#9d8df5",
              border: "1px solid rgba(124,106,247,0.2)",
            }}
          >
            {user.plan}
          </span>
          <button
            onClick={logout}
            title="Çıkış Yap"
            className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg transition-all duration-150 cursor-pointer"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#f87171";
              (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <LogOut size={12} />
            <span>Çıkış</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
