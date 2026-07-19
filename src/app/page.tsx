"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  Search,
  LayoutDashboard,
  ArrowRight,
  Database,
  CheckCircle,
  Activity,
  Zap,
  ChevronRight,
  Cpu
} from "lucide-react";
import Link from "next/link";

export default function OverviewPage() {
  const [apiKey] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("printify_api_key") || "";
    }
    return "";
  });

  const modules = [
    {
      title: "Üretici Dashboard",
      desc: "Niche projections, active sellers count, like rates, and conversion project curves.",
      href: "/producer-dashboard",
      icon: LayoutDashboard,
      color: "from-purple-500/20 to-purple-500/5",
      borderColor: "group-hover:border-purple-500/30",
      iconColor: "text-purple-400",
      status: "Direct Sync Live"
    },
    {
      title: "Product Research",
      desc: "Etsy niche analyzer, product keyword search volumes, and catalog tags analyzer.",
      href: "/product-research",
      icon: Search,
      color: "from-blue-500/20 to-blue-500/5",
      borderColor: "group-hover:border-blue-500/30",
      iconColor: "text-blue-400",
      status: "Ready"
    },
    {
      title: "AI Design Studio",
      desc: "Generate patterns, text artwork, and high-margin product designs using AI helpers.",
      href: "/ai-design-studio",
      icon: Sparkles,
      color: "from-amber-500/20 to-amber-500/5",
      borderColor: "group-hover:border-amber-500/30",
      iconColor: "text-amber-400",
      status: "Integrated"
    },
    {
      title: "Mockup & Publish",
      desc: "Apply designs to catalog blueprints, configure canvas options, and sync to Etsy.",
      href: "/mockup-publish",
      icon: Layers,
      color: "from-emerald-500/20 to-emerald-500/5",
      borderColor: "group-hover:border-emerald-500/30",
      iconColor: "text-emerald-400",
      status: "3 Drafts Pending"
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 animate-fade-in">
      
      {/* Overview Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f1f0ff] to-[#a09cb0] bg-clip-text text-transparent">
            Etsy Entegrasyon & Yönetim Merkezi
          </h1>
          <p className="text-sm mt-0.5 text-[#a09cb0]">
            Central overview of Printify catalog pipelines, design automation, and listing publishing channels.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-white/[0.08] backdrop-blur-md bg-white/[0.02]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="text-[#a09cb0]">
            Integration: <span className="text-white font-semibold">{apiKey ? "Live API Active" : "Sandbox Connected"}</span>
          </span>
        </div>
      </div>

      {/* Connection metrics top row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle size={18} />
          </div>
          <div>
            <span className="text-[10px] text-[#5e5a72] block uppercase font-bold tracking-wider">Etsy API Gateway</span>
            <span className="text-sm font-bold text-white">Online & Healthy</span>
          </div>
        </div>

        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
            <Database size={18} />
          </div>
          <div>
            <span className="text-[10px] text-[#5e5a72] block uppercase font-bold tracking-wider">Printify Catalog</span>
            <span className="text-sm font-bold text-white">987 Blueprints Synchronized</span>
          </div>
        </div>

        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
            <Cpu size={18} />
          </div>
          <div>
            <span className="text-[10px] text-[#5e5a72] block uppercase font-bold tracking-wider">AI Workers Status</span>
            <span className="text-sm font-bold text-white">Listening in Background</span>
          </div>
        </div>
      </div>

      {/* Module Navigation Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#a09cb0] flex items-center gap-2">
          <Activity size={14} className="text-purple-400" />
          <span>Core Platform Modules</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link href={m.href} key={m.title} className="group">
                <div className={`h-full rounded-xl border border-white/[0.06] bg-gradient-to-br ${m.color} p-5 transition-all duration-300 hover:scale-[1.01] hover:bg-white/[0.02] flex flex-col justify-between space-y-4 relative overflow-hidden`}>
                  
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white flex items-center gap-1.5 group-hover:text-purple-300 transition-colors">
                        <span>{m.title}</span>
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                      </h3>
                      <p className="text-xs text-[#a09cb0] leading-relaxed max-w-[280px]">
                        {m.desc}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl bg-black/30 border border-white/5 flex items-center justify-center ${m.iconColor}`}>
                      <Icon size={20} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/[0.04] pt-3 text-[10px]">
                    <span className="text-[#5e5a72] font-semibold">Status: <span className="text-[#a09cb0] font-normal">{m.status}</span></span>
                    <span className="text-white font-bold flex items-center gap-1 group-hover:underline">
                      <span>Launch</span>
                      <ArrowRight size={10} />
                    </span>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* System Activity Log */}
      <div className="bg-black/10 rounded-xl border border-white/[0.03] p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#a09cb0] flex items-center gap-1.5">
          <Zap size={13} className="text-purple-400" />
          <span>Recent Integration Activity Logs</span>
        </h3>

        <div className="space-y-3">
          {[
            { time: "Just now", event: "Draft publishing queue updated. 3 listings waiting for Etsy manual sync." },
            { time: "10 mins ago", event: "Synchronized product details for G180 Crewneck Sweatshirt blueprint." },
            { time: "1 hour ago", event: "Successfully parsed Etsy keyword volumes for 'Soy Candles' category." },
            { time: "3 hours ago", event: "Mockup render pipeline loaded new model template presets." }
          ].map((l, i) => (
            <div key={i} className="flex items-start gap-3 text-xs">
              <span className="text-[10px] text-[#5e5a72] font-mono shrink-0 w-20">{l.time}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500/60 mt-1.5 shrink-0" />
              <span className="text-[#a09cb0]">{l.event}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
