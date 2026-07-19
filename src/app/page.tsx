"use client";

import React, { useState } from "react";
import {
  Package,
  CheckCircle,
  TrendingUp,
  Heart,
  ShoppingBag,
  DollarSign,
  Eye,
  Star,
  Activity,
  FileText,
  Percent,
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

/* ─── Types & Interfaces ────────────────────────────────────────── */

interface PerformanceItem {
  id: string;
  name: string;
  image: string;
  value: string;
  secondaryVal: string;
  rate: string;
}

interface ActiveOrder {
  id: string;
  orderId: string;
  buyerName: string;
  product: string;
  sku: string;
  orderedTime: string;
  shipBy: string;
  status: string;
}

const activeOrders: ActiveOrder[] = [
  {
    id: "1",
    orderId: "#ET-14205",
    buyerName: "Olivia Vance",
    product: "Wildflower Garden Custom Canvas Tote Bag",
    sku: "SKU: TOTE-WF-GARDEN",
    orderedTime: "2 hours ago",
    shipBy: "Tomorrow, 2:00 PM",
    status: "Processing"
  },
  {
    id: "2",
    orderId: "#ET-14204",
    buyerName: "Liam Sterling",
    product: "Golden Meadows Fine Art Accent Mug 11oz",
    sku: "SKU: MUG-GM-ACC-11",
    orderedTime: "4 hours ago",
    shipBy: "Tomorrow, 5:00 PM",
    status: "Processing"
  },
  {
    id: "3",
    orderId: "#ET-14203",
    buyerName: "Sophia Martinez",
    product: "Retro Custom Botanical Unisex Tee",
    sku: "SKU: TEE-RET-BOT-M",
    orderedTime: "6 hours ago",
    shipBy: "Jul 21, 12:00 PM",
    status: "Ready to Ship"
  },
  {
    id: "4",
    orderId: "#ET-14202",
    buyerName: "Emma Watson",
    product: "Funny Sarcastic Soy Wax Jar Candle",
    sku: "SKU: CAND-SARC-SOY",
    orderedTime: "12 hours ago",
    shipBy: "Jul 21, 3:00 PM",
    status: "Ready to Ship"
  }
];

// Timeframe mapping datasets
const statsData = {
  daily: {
    activeListings: 124,
    draftListings: 12,
    orders: "28 orders",
    views: "840 views",
    favorites: "42 favs",
    revenue: "$616.00",
    profit: "$345.00",
    lines: [
      { name: "Satışlar", color: "#8b5cf6", points: [{ cx: 50, cy: 150 }, { cx: 115, cy: 140 }, { cx: 180, cy: 160 }, { cx: 245, cy: 130 }, { cx: 310, cy: 120 }, { cx: 375, cy: 90 }, { cx: 440, cy: 80 }], weeklyValues: ["2", "3", "1", "4", "4", "7", "7"], gradientId: "purple-fade" },
      { name: "Görüntülenme", color: "#3b82f6", points: [{ cx: 50, cy: 130 }, { cx: 115, cy: 120 }, { cx: 180, cy: 140 }, { cx: 245, cy: 110 }, { cx: 310, cy: 95 }, { cx: 375, cy: 70 }, { cx: 440, cy: 60 }], weeklyValues: ["80", "90", "75", "110", "120", "165", "200"], gradientId: "blue-fade" },
      { name: "Favoriler", color: "#ec4899", points: [{ cx: 50, cy: 160 }, { cx: 115, cy: 155 }, { cx: 180, cy: 162 }, { cx: 245, cy: 148 }, { cx: 310, cy: 135 }, { cx: 375, cy: 120 }, { cx: 440, cy: 110 }], weeklyValues: ["4", "3", "2", "5", "6", "10", "12"], gradientId: "pink-fade" },
      { name: "Ciro", color: "#10b981", points: [{ cx: 50, cy: 150 }, { cx: 115, cy: 142 }, { cx: 180, cy: 158 }, { cx: 245, cy: 132 }, { cx: 310, cy: 122 }, { cx: 375, cy: 95 }, { cx: 440, cy: 85 }], weeklyValues: ["$44", "$66", "$22", "$88", "$88", "$154", "$154"], gradientId: "green-fade" },
      { name: "Net Kâr", color: "#f59e0b", points: [{ cx: 50, cy: 155 }, { cx: 115, cy: 148 }, { cx: 180, cy: 162 }, { cx: 245, cy: 140 }, { cx: 310, cy: 130 }, { cx: 375, cy: 105 }, { cx: 440, cy: 95 }], weeklyValues: ["$25", "$37", "$12", "$50", "$50", "$85", "$86"], gradientId: "amber-fade" }
    ]
  },
  weekly: {
    activeListings: 124,
    draftListings: 12,
    orders: "194 orders",
    views: "5,840 views",
    favorites: "290 favs",
    revenue: "$4,268.00",
    profit: "$2,380.00",
    lines: [
      { name: "Satışlar", color: "#8b5cf6", points: [{ cx: 50, cy: 140 }, { cx: 115, cy: 130 }, { cx: 180, cy: 110 }, { cx: 245, cy: 80 }, { cx: 310, cy: 60 }, { cx: 375, cy: 45 }, { cx: 440, cy: 30 }], weeklyValues: ["15", "20", "25", "30", "32", "34", "38"], gradientId: "purple-fade" },
      { name: "Görüntülenme", color: "#3b82f6", points: [{ cx: 50, cy: 110 }, { cx: 115, cy: 95 }, { cx: 180, cy: 80 }, { cx: 245, cy: 75 }, { cx: 310, cy: 70 }, { cx: 375, cy: 65 }, { cx: 440, cy: 55 }], weeklyValues: ["650", "720", "840", "880", "900", "920", "930"], gradientId: "blue-fade" },
      { name: "Favoriler", color: "#ec4899", points: [{ cx: 50, cy: 155 }, { cx: 115, cy: 145 }, { cx: 180, cy: 130 }, { cx: 245, cy: 105 }, { cx: 310, cy: 90 }, { cx: 375, cy: 75 }, { cx: 440, cy: 65 }], weeklyValues: ["30", "34", "38", "42", "45", "49", "52"], gradientId: "pink-fade" },
      { name: "Ciro", color: "#10b981", points: [{ cx: 50, cy: 150 }, { cx: 115, cy: 138 }, { cx: 180, cy: 118 }, { cx: 245, cy: 88 }, { cx: 310, cy: 68 }, { cx: 375, cy: 53 }, { cx: 440, cy: 38 }], weeklyValues: ["$330", "$440", "$550", "$660", "$704", "$748", "$836"], gradientId: "green-fade" },
      { name: "Net Kâr", color: "#f59e0b", points: [{ cx: 50, cy: 155 }, { cx: 115, cy: 143 }, { cx: 180, cy: 125 }, { cx: 245, cy: 95 }, { cx: 310, cy: 78 }, { cx: 375, cy: 62 }, { cx: 440, cy: 48 }], weeklyValues: ["$185", "$246", "$308", "$370", "$394", "$418", "$469"], gradientId: "amber-fade" }
    ]
  },
  monthly: {
    activeListings: 124,
    draftListings: 12,
    orders: "840 orders",
    views: "24,800 views",
    favorites: "1,240 favs",
    revenue: "$18,480.00",
    profit: "$10,350.00",
    lines: [
      { name: "Satışlar", color: "#8b5cf6", points: [{ cx: 50, cy: 150 }, { cx: 115, cy: 120 }, { cx: 180, cy: 90 }, { cx: 245, cy: 105 }, { cx: 310, cy: 70 }, { cx: 375, cy: 50 }, { cx: 440, cy: 30 }], weeklyValues: ["80", "120", "160", "140", "180", "200", "220"], gradientId: "purple-fade" },
      { name: "Görüntülenme", color: "#3b82f6", points: [{ cx: 50, cy: 120 }, { cx: 115, cy: 100 }, { cx: 180, cy: 80 }, { cx: 245, cy: 90 }, { cx: 310, cy: 60 }, { cx: 375, cy: 45 }, { cx: 440, cy: 35 }], weeklyValues: ["2.2k", "3.1k", "4.0k", "3.6k", "4.5k", "5.1k", "5.7k"], gradientId: "blue-fade" },
      { name: "Favoriler", color: "#ec4899", points: [{ cx: 50, cy: 145 }, { cx: 115, cy: 130 }, { cx: 180, cy: 110 }, { cx: 245, cy: 120 }, { cx: 310, cy: 90 }, { cx: 375, cy: 80 }, { cx: 440, cy: 70 }], weeklyValues: ["120", "150", "180", "160", "200", "210", "220"], gradientId: "pink-fade" },
      { name: "Ciro", color: "#10b981", points: [{ cx: 50, cy: 150 }, { cx: 115, cy: 130 }, { cx: 180, cy: 110 }, { cx: 245, cy: 90 }, { cx: 310, cy: 70 }, { cx: 375, cy: 50 }, { cx: 440, cy: 30 }], weeklyValues: ["$1.7k", "$2.6k", "$3.5k", "$3.0k", "$3.9k", "$4.4k", "$4.8k"], gradientId: "green-fade" },
      { name: "Net Kâr", color: "#f59e0b", points: [{ cx: 50, cy: 155 }, { cx: 115, cy: 128 }, { cx: 180, cy: 98 }, { cx: 245, cy: 110 }, { cx: 310, cy: 78 }, { cx: 375, cy: 58 }, { cx: 440, cy: 38 }], weeklyValues: ["$980", "$1.4k", "$1.9k", "$1.6k", "$2.1k", "$2.4k", "$2.6k"], gradientId: "amber-fade" }
    ]
  },
  allTime: {
    activeListings: 124,
    draftListings: 12,
    orders: "4,820 orders",
    views: "142,400 views",
    favorites: "7,840 favs",
    revenue: "$106,040.00",
    profit: "$59,380.00",
    lines: [
      { name: "Satışlar", color: "#8b5cf6", points: [{ cx: 50, cy: 160 }, { cx: 115, cy: 140 }, { cx: 180, cy: 120 }, { cx: 245, cy: 90 }, { cx: 310, cy: 75 }, { cx: 375, cy: 50 }, { cx: 440, cy: 20 }], weeklyValues: ["320", "540", "680", "820", "950", "1.1k", "1.4k"], gradientId: "purple-fade" },
      { name: "Görüntülenme", color: "#3b82f6", points: [{ cx: 50, cy: 140 }, { cx: 115, cy: 120 }, { cx: 180, cy: 100 }, { cx: 245, cy: 70 }, { cx: 310, cy: 55 }, { cx: 375, cy: 35 }, { cx: 440, cy: 15 }], weeklyValues: ["10k", "16k", "22k", "28k", "32k", "38k", "46k"], gradientId: "blue-fade" },
      { name: "Favoriler", color: "#ec4899", points: [{ cx: 50, cy: 150 }, { cx: 115, cy: 130 }, { cx: 180, cy: 115 }, { cx: 245, cy: 85 }, { cx: 310, cy: 70 }, { cx: 375, cy: 45 }, { cx: 440, cy: 25 }], weeklyValues: ["500", "800", "1.1k", "1.4k", "1.6k", "1.9k", "2.3k"], gradientId: "pink-fade" },
      { name: "Ciro", color: "#10b981", points: [{ cx: 50, cy: 160 }, { cx: 115, cy: 138 }, { cx: 180, cy: 118 }, { cx: 245, cy: 88 }, { cx: 310, cy: 73 }, { cx: 375, cy: 48 }, { cx: 440, cy: 18 }], weeklyValues: ["$7.0k", "$11.8k", "$14.9k", "$18.0k", "$20.9k", "$24.2k", "$30.8k"], gradientId: "green-fade" },
      { name: "Net Kâr", color: "#f59e0b", points: [{ cx: 50, cy: 160 }, { cx: 115, cy: 140 }, { cx: 180, cy: 120 }, { cx: 245, cy: 92 }, { cx: 310, cy: 77 }, { cx: 375, cy: 52 }, { cx: 440, cy: 22 }], weeklyValues: ["$3.9k", "$6.6k", "$8.3k", "$10.0k", "$11.7k", "$13.5k", "$17.2k"], gradientId: "amber-fade" }
    ]
  }
};

const bestSellersList: PerformanceItem[] = [
  {
    id: "1",
    name: "Wildflower Garden Custom Canvas Tote Bag",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=100&q=80",
    value: "142 orders",
    secondaryVal: "4.8% conv",
    rate: "$3,550"
  },
  {
    id: "2",
    name: "Golden Meadows Fine Art Accent Mug 11oz",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=100&q=80",
    value: "96 orders",
    secondaryVal: "3.9% conv",
    rate: "$1,440"
  },
  {
    id: "3",
    name: "Retro Custom Botanical Unisex Tee",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80",
    value: "84 orders",
    secondaryVal: "5.1% conv",
    rate: "$2,100"
  }
];

const mostFavoritedList: PerformanceItem[] = [
  {
    id: "1",
    name: "Funny Sarcastic Soy Wax Jar Candle - Golden Meadows",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=100&q=80",
    value: "410 favorites",
    secondaryVal: "14 in carts",
    rate: "In Stock"
  },
  {
    id: "2",
    name: "Retro Wildflower Bella+Canvas 3001 Tee",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80",
    value: "284 favorites",
    secondaryVal: "8 in carts",
    rate: "In Stock"
  },
  {
    id: "3",
    name: "Vintage Art Deco Accent Mug 15oz",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=100&q=80",
    value: "196 favorites",
    secondaryVal: "3 in carts",
    rate: "Low Stock (5)"
  }
];

export default function SellerDashboard() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "allTime">("weekly");
  const [selectedMetric, setSelectedMetric] = useState<string>("Satışlar");

  const activeData = statsData[timeframe];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fade-in">
      
      {/* Etsy Mağaza Başlığı (Personalized Shop Banner & Avatar) */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#16161e] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* Banner Image */}
        <div 
          className="h-36 w-full bg-cover bg-center relative"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80')" }}
        >
          {/* Tint Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#16161e] via-[#16161e]/40 to-transparent" />
          
          {/* Shop Tag Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-white bg-emerald-500/80 px-2.5 py-1 rounded-full border border-emerald-400/20 shadow-md">
            <Star size={11} className="fill-white animate-spin-slow" />
            <span>ETSY STAR SELLER</span>
          </div>
        </div>

        {/* Shop Avatar & Name Block */}
        <div className="px-6 pb-6 -mt-10 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            {/* Avatar image */}
            <div className="w-20 h-20 rounded-full border-4 border-[#16161e] overflow-hidden bg-neutral-900 shadow-xl shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=150&q=80" 
                alt="Woodland Meadow Crafts Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="space-y-1 pb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                <span>Woodland Meadow Crafts</span>
                <CheckCircle size={18} className="text-purple-400 fill-purple-400/20" />
              </h1>
              <div className="flex items-center gap-3 text-xs text-[#a09cb0] justify-center sm:justify-start">
                <span className="flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-white font-semibold">4.9</span> (1,482 Reviews)
                </span>
                <span>•</span>
                <span>Active Listings: <strong className="text-white">{activeData.activeListings}</strong></span>
              </div>
            </div>
          </div>

          {/* Sync Connection state */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#a09cb0]">Etsy Sync:</span>
            <span className="text-white font-bold">StarSeller_Store_1</span>
          </div>
        </div>
      </div>

      {/* Aktif Siparişler (Active Orders Grid) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-[#a09cb0] uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={13} className="text-purple-400" />
            <span>Aktif Siparişler (Son 4 Sipariş)</span>
          </h3>
          <Link href="/orders" className="text-[10px] font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
            <span>Tüm Siparişleri Gör</span>
            <ArrowRight size={10} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {activeOrders.map((o) => (
            <Link href="/orders" key={o.id} className="group block">
              <div className="bg-[#16161e] border border-white/[0.05] group-hover:border-purple-500/20 rounded-xl p-3.5 space-y-3 transition-all hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between h-36">
                
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block group-hover:text-purple-300 transition-colors truncate">{o.buyerName}</span>
                    <span className="text-[9px] text-[#5e5a72] block mt-0.5 font-mono">{o.orderId}</span>
                  </div>
                  <span className="text-[8px] font-bold text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/15 shrink-0 uppercase">
                    {o.status === "Processing" ? "Hazırlanıyor" : "Kargoya Hazır"}
                  </span>
                </div>

                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] text-white/95 block font-semibold truncate">{o.product}</span>
                  <span className="text-[9px] text-[#5e5a72] block font-mono truncate">{o.sku}</span>
                </div>

                <div className="border-t border-white/[0.04] pt-2 flex flex-col gap-0.5 text-[9px] shrink-0">
                  <span className="text-[#a09cb0]">Sipariş: <strong className="text-white font-medium">{o.orderedTime}</strong></span>
                  <span className="text-[#a09cb0]">Gönderim: <strong className="text-amber-400 font-semibold">{o.shipBy}</strong></span>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Timeframe Selector Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/10 p-2.5 rounded-xl border border-white/[0.03]">
        <span className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider px-2">Store Analytics Overview</span>
        <div className="flex bg-white/[0.02] p-1 rounded-lg border border-white/[0.05] self-start sm:self-auto">
          {[
            { id: "daily", label: "Günlük" },
            { id: "weekly", label: "Haftalık" },
            { id: "monthly", label: "Aylık" },
            { id: "allTime", label: "Tüm Zamanlar" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeframe(tab.id as "daily" | "weekly" | "monthly" | "allTime")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                timeframe === tab.id
                  ? "bg-purple-500/20 border border-purple-500/35 text-white shadow-md font-extrabold"
                  : "text-[#a09cb0] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Core Etsy Shop Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        
        {/* Metric 1: Aktif Ürünler */}
        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-white/10 transition-colors">
          <span className="text-[9px] font-bold text-[#a09cb0] uppercase tracking-wider flex items-center gap-1">
            <Package size={10} className="text-purple-400" />
            <span>Aktif Ürünler</span>
          </span>
          <div>
            <div className="text-lg font-bold text-white leading-none">{activeData.activeListings}</div>
            <span className="text-[9px] text-[#5e5a72] block mt-1">Live Listings</span>
          </div>
        </div>

        {/* Metric 2: Draft Ürünler */}
        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-white/10 transition-colors">
          <span className="text-[9px] font-bold text-[#a09cb0] uppercase tracking-wider flex items-center gap-1">
            <FileText size={10} className="text-blue-400" />
            <span>Draft Ürünler</span>
          </span>
          <div>
            <div className="text-lg font-bold text-white leading-none">{activeData.draftListings}</div>
            <span className="text-[9px] text-[#5e5a72] block mt-1">Pending Sync</span>
          </div>
        </div>

        {/* Metric 3: Satışlar */}
        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-white/10 transition-colors">
          <span className="text-[9px] font-bold text-[#a09cb0] uppercase tracking-wider flex items-center gap-1">
            <ShoppingBag size={10} className="text-purple-400" />
            <span>Satışlar</span>
          </span>
          <div>
            <div className="text-lg font-bold text-white leading-none">{activeData.orders.split(" ")[0]}</div>
            <span className="text-[9px] text-[#5e5a72] block mt-1">Total Orders</span>
          </div>
        </div>

        {/* Metric 4: Görüntülenme */}
        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-white/10 transition-colors">
          <span className="text-[9px] font-bold text-[#a09cb0] uppercase tracking-wider flex items-center gap-1">
            <Eye size={10} className="text-blue-400" />
            <span>Görüntülenme</span>
          </span>
          <div>
            <div className="text-lg font-bold text-white leading-none">{activeData.views.split(" ")[0]}</div>
            <span className="text-[9px] text-[#5e5a72] block mt-1">Store Visits</span>
          </div>
        </div>

        {/* Metric 5: Favoriler */}
        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-white/10 transition-colors">
          <span className="text-[9px] font-bold text-[#a09cb0] uppercase tracking-wider flex items-center gap-1">
            <Heart size={10} className="text-pink-400" />
            <span>Favoriler</span>
          </span>
          <div>
            <div className="text-lg font-bold text-white leading-none">{activeData.favorites.split(" ")[0]}</div>
            <span className="text-[9px] text-[#5e5a72] block mt-1">Listing Favs</span>
          </div>
        </div>

        {/* Metric 6: Ciro */}
        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-white/10 transition-colors">
          <span className="text-[9px] font-bold text-[#a09cb0] uppercase tracking-wider flex items-center gap-1">
            <DollarSign size={10} className="text-emerald-400" />
            <span>Ciro</span>
          </span>
          <div>
            <div className="text-lg font-bold text-emerald-400 leading-none">{activeData.revenue}</div>
            <span className="text-[9px] text-[#5e5a72] block mt-1">Gross Sales</span>
          </div>
        </div>

        {/* Metric 7: Net Kâr */}
        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-white/10 transition-colors">
          <span className="text-[9px] font-bold text-[#a09cb0] uppercase tracking-wider flex items-center gap-1">
            <TrendingUp size={10} className="text-amber-400" />
            <span>Net Kâr</span>
          </span>
          <div>
            <div className="text-lg font-bold text-amber-400 leading-none">{activeData.profit}</div>
            <span className="text-[9px] text-[#5e5a72] block mt-1">Net Margins</span>
          </div>
        </div>

      </div>

      {/* Interactive Shop Metrics Projection Line Chart */}
      <div className="rounded-xl border border-white/[0.07] bg-[#16161e] p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Mağaza Performans Grafiği</span>
            </h3>
            <p className="text-[11px] text-[#a09cb0]">Select a sub-metric to plot its weekly trajectory with localized value vertices.</p>
          </div>

          {/* Interactive Metric Selectors (Toggles) */}
          <div className="flex flex-wrap gap-2 text-[9px] text-[#a09cb0]">
            {activeData.lines.map((l) => {
              const isSelected = selectedMetric === l.name;
              return (
                <button
                  key={l.name}
                  onClick={() => setSelectedMetric(l.name)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white/10 border-white/20 text-white scale-[1.02] font-bold"
                      : "border-white/[0.04] bg-white/[0.01] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: l.color }} />
                  <span>{l.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full h-[220px]">
          <svg viewBox="0 0 500 200" width="100%" height="100%" className="w-full h-full">
            <defs>
              <linearGradient id="purple-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="blue-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="pink-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="green-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="amber-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="40" y1="20" x2="470" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="40" y1="55" x2="470" y2="55" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="40" y1="90" x2="470" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="40" y1="125" x2="470" y2="125" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="40" y1="160" x2="470" y2="160" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

            {/* X Axis labels */}
            <text x="50" y="180" fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontWeight="500">Mon</text>
            <text x="115" y="180" fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontWeight="500">Tue</text>
            <text x="180" y="180" fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontWeight="500">Wed</text>
            <text x="245" y="180" fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontWeight="500">Thu</text>
            <text x="310" y="180" fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontWeight="500">Fri</text>
            <text x="375" y="180" fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontWeight="500">Sat</text>
            <text x="440" y="180" fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontWeight="500">Sun</text>

            {/* Y Axis labels */}
            <text x="30" y="24" fill="var(--text-muted)" fontSize="7" textAnchor="end" fontWeight="500">Max</text>
            <text x="30" y="94" fill="var(--text-muted)" fontSize="7" textAnchor="end" fontWeight="500">Mid</text>
            <text x="30" y="164" fill="var(--text-muted)" fontSize="7" textAnchor="end" fontWeight="500">Min</text>

            {/* Single Selected Metric Line & Vertices Value Labels */}
            {activeData.lines.map((l) => {
              const isVisible = selectedMetric === l.name;
              if (!isVisible) return null;
              
              // Standard curve interpolation
              const curvePath = `M ${l.points[0].cx} ${l.points[0].cy} C ${l.points[1].cx} ${l.points[1].cy}, ${l.points[2].cx} ${l.points[2].cy}, ${l.points[3].cx} ${l.points[3].cy} S ${l.points[5].cx} ${l.points[5].cy}, ${l.points[6].cx} ${l.points[6].cy}`;
              const fillPath = `${curvePath} L 440 160 L 50 160 Z`;

              return (
                <g key={l.name} className="transition-all duration-500">
                  <path d={fillPath} fill={`url(#${l.gradientId})`} />
                  <path d={curvePath} fill="none" stroke={l.color} strokeWidth="3" strokeLinecap="round" />
                  {l.points.map((p, i) => (
                    <g key={i} className="group/dot">
                      <circle cx={p.cx} cy={p.cy} r="4.5" fill={l.color} stroke="#16161e" strokeWidth="1.5" className="transition-transform group-hover/dot:scale-125" />
                      <text
                        x={p.cx}
                        y={p.cy - 10}
                        fill="#ffffff"
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none"
                        style={{ filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.95))" }}
                      >
                        {l.weeklyValues[i]}
                      </text>
                    </g>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 2-Column Section Grid (En Çok Satan Ürünler + En Çok Favorilenenler) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: En Çok Satan Ürünler */}
        <div className="rounded-xl border border-white/[0.07] bg-[#16161e] overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>En Çok Satan Mağaza Ürünleri</span>
            </h3>
            <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/15 font-semibold">Orders Leaderboard</span>
          </div>

          <div className="p-4 space-y-4">
            {bestSellersList.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 p-2.5 rounded-lg border border-white/[0.03] bg-black/10 hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-3">
                  {/* Item Image */}
                  <div className="w-11 h-11 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-neutral-900 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-[280px]" title={item.name}>
                      {item.name}
                    </h4>
                    <span className="text-[9px] text-[#5e5a72] block mt-0.5">{item.secondaryVal}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white block">{item.value}</span>
                  <span className="text-[10px] text-emerald-400 font-bold block">{item.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: En Çok Favori Alanlar */}
        <div className="rounded-xl border border-white/[0.07] bg-[#16161e] overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              <span>En Çok Favori Alan Ürünler</span>
            </h3>
            <span className="text-[10px] text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/15 font-semibold">Engagement Status</span>
          </div>

          <div className="p-4 space-y-4">
            {mostFavoritedList.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 p-2.5 rounded-lg border border-white/[0.03] bg-black/10 hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-3">
                  {/* Item Image */}
                  <div className="w-11 h-11 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-neutral-900 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-[280px]" title={item.name}>
                      {item.name}
                    </h4>
                    <span className="text-[9px] text-[#5e5a72] block mt-0.5">{item.secondaryVal}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white block">{item.value}</span>
                  <span className={`text-[10px] font-bold block ${item.rate.includes("Low") ? "text-amber-400" : "text-emerald-400"}`}>
                    {item.rate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Etsy Listing SEO & Health Diagnostics */}
      <div className="bg-black/10 rounded-xl border border-white/[0.03] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center text-purple-400 shrink-0">
            <Percent size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Etsy SEO & Mağaza Sağlığı Skoru</h4>
            <p className="text-[11px] text-[#a09cb0] mt-0.5">
              100% of listings contain tags and image alt-texts. Shipping dispatch latency is optimized at 1-2 days.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto text-right">
          <div>
            <span className="text-lg font-extrabold text-white block leading-none">96%</span>
            <span className="text-[9px] text-[#5e5a72] block mt-0.5">Excellent Health</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle size={16} />
          </div>
        </div>
      </div>

    </div>
  );
}
