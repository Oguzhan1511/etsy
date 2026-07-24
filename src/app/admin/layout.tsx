"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  AlertTriangle,
  Settings,
  LogOut,
  Zap
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Genel Bakış", href: "/admin", icon: LayoutDashboard },
    { name: "Kullanıcılar", href: "/admin/users", icon: Users },
    { name: "İşlemler (Gelir)", href: "/admin/transactions", icon: CreditCard },
    { name: "Sistem Hataları", href: "/admin/errors", icon: AlertTriangle },
  ];

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black text-foreground flex font-sans overflow-hidden">
      
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none translate-x-1/3 translate-y-1/3" />

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-white/[0.02] backdrop-blur-2xl flex flex-col relative z-10">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.5)]">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[inset_0_0_15px_rgba(168,85,247,0.1)]" 
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-purple-400" : "text-white/40"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all">
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 custom-scrollbar">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
