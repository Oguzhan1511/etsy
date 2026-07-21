"use client";

import React, { useState, useEffect } from "react";
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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts";

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
  image: string;
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
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=100&q=80",
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
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=100&q=80",
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
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80",
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
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=100&q=80",
    sku: "SKU: CAND-SARC-SOY",
    orderedTime: "12 hours ago",
    shipBy: "Jul 21, 3:00 PM",
    status: "Ready to Ship"
  }
];

const chartLines = [
  { key: "Sales", name: "Sales", color: "#8b5cf6" },
  { key: "Views", name: "Views", color: "#3b82f6" },
  { key: "Favorites", name: "Favorites", color: "#ec4899" },
  { key: "Revenue", name: "Revenue", color: "#10b981", isCurrency: true },
  { key: "NetMargin", name: "Net Margin", color: "#f59e0b", isCurrency: true }
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
    chartData: [
      { name: "Mon", Sales: 2, Views: 80, Favorites: 4, Revenue: 44, NetMargin: 25 },
      { name: "Tue", Sales: 3, Views: 90, Favorites: 3, Revenue: 66, NetMargin: 37 },
      { name: "Wed", Sales: 1, Views: 75, Favorites: 2, Revenue: 22, NetMargin: 12 },
      { name: "Thu", Sales: 4, Views: 110, Favorites: 5, Revenue: 88, NetMargin: 50 },
      { name: "Fri", Sales: 4, Views: 120, Favorites: 6, Revenue: 88, NetMargin: 50 },
      { name: "Sat", Sales: 7, Views: 165, Favorites: 10, Revenue: 154, NetMargin: 85 },
      { name: "Sun", Sales: 7, Views: 200, Favorites: 12, Revenue: 154, NetMargin: 86 }
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
    chartData: [
      { name: "Mon", Sales: 15, Views: 650, Favorites: 30, Revenue: 330, NetMargin: 185 },
      { name: "Tue", Sales: 20, Views: 720, Favorites: 34, Revenue: 440, NetMargin: 246 },
      { name: "Wed", Sales: 25, Views: 840, Favorites: 38, Revenue: 550, NetMargin: 308 },
      { name: "Thu", Sales: 30, Views: 880, Favorites: 42, Revenue: 660, NetMargin: 370 },
      { name: "Fri", Sales: 32, Views: 900, Favorites: 45, Revenue: 704, NetMargin: 394 },
      { name: "Sat", Sales: 34, Views: 920, Favorites: 49, Revenue: 748, NetMargin: 418 },
      { name: "Sun", Sales: 38, Views: 930, Favorites: 52, Revenue: 836, NetMargin: 469 }
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
    chartData: [
      { name: "Week 1", Sales: 80, Views: 2200, Favorites: 120, Revenue: 1700, NetMargin: 980 },
      { name: "Week 2", Sales: 120, Views: 3100, Favorites: 150, Revenue: 2600, NetMargin: 1400 },
      { name: "Week 3", Sales: 160, Views: 4000, Favorites: 180, Revenue: 3500, NetMargin: 1900 },
      { name: "Week 4", Sales: 140, Views: 3600, Favorites: 160, Revenue: 3000, NetMargin: 1600 },
      { name: "Week 5", Sales: 180, Views: 4500, Favorites: 200, Revenue: 3900, NetMargin: 2100 },
      { name: "Week 6", Sales: 200, Views: 5100, Favorites: 210, Revenue: 4400, NetMargin: 2400 },
      { name: "Week 7", Sales: 220, Views: 5700, Favorites: 220, Revenue: 4800, NetMargin: 2600 }
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
    chartData: [
      { name: "Jan", Sales: 320, Views: 10000, Favorites: 500, Revenue: 7000, NetMargin: 3900 },
      { name: "Feb", Sales: 540, Views: 16000, Favorites: 800, Revenue: 11800, NetMargin: 6600 },
      { name: "Mar", Sales: 680, Views: 22000, Favorites: 1100, Revenue: 14900, NetMargin: 8300 },
      { name: "Apr", Sales: 820, Views: 28000, Favorites: 1400, Revenue: 18000, NetMargin: 10000 },
      { name: "May", Sales: 950, Views: 32000, Favorites: 1600, Revenue: 20900, NetMargin: 11700 },
      { name: "Jun", Sales: 1100, Views: 38000, Favorites: 1900, Revenue: 24200, NetMargin: 13500 },
      { name: "Jul", Sales: 1400, Views: 46000, Favorites: 2300, Revenue: 30800, NetMargin: 17200 }
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

interface ShopData {
  shop_name: string;
  review_average: number | string;
  review_count: number;
  listing_active_count: number;
  transaction_sold_count: number;
}

export default function SellerDashboard() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "allTime">("weekly");
  const [selectedMetric, setSelectedMetric] = useState<string>("Sales");
  const [shopData, setShopData] = useState<ShopData | null>(null);

  useEffect(() => {
    fetch('/api/etsy/shop')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setShopData(data);
      })
      .catch(console.error);
  }, []);

  const activeData = statsData[timeframe];
  const activeChartMetric = chartLines.find(l => l.key === selectedMetric) || chartLines[0];

  const formatYAxis = (value: number) => {
    const formatted = value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
    return activeChartMetric.isCurrency ? `$${formatted}` : formatted;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fade-in">
      
      {/* Etsy Mağaza Başlığı (Personalized Shop Banner & Avatar) */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#16161e] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* Banner Image */}
        <div 
          className="h-24 w-full bg-cover bg-center relative"
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
        <div className="px-6 pb-6 -mt-8 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            {/* Avatar image */}
            <div className="w-20 h-20 rounded-full border-4 border-[#16161e] overflow-hidden bg-neutral-900 shadow-xl shrink-0">
              <img 
                src={shopData ? shopData.icon_url_fullxfull : "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=150&q=80"} 
                alt="Shop Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="space-y-1 pb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                <span>{shopData ? shopData.shop_name : "Woodland Meadow Crafts"}</span>
                <CheckCircle size={18} className="text-purple-400 fill-purple-400/20" />
              </h1>
              <div className="flex items-center gap-3 text-xs text-[#a09cb0] justify-center sm:justify-start">
                {shopData ? (
                  <>
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-white font-semibold">{shopData.review_average || '5.0'}</span> ({shopData.review_count} Reviews)
                    </span>
                    <span>•</span>
                    <span>Active Listings: <strong className="text-white">{shopData.listing_active_count}</strong></span>
                    <span>•</span>
                    <span>Sales: <strong className="text-white">{shopData.transaction_sold_count}</strong></span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-white font-semibold">4.9</span> (1,482 Reviews)
                    </span>
                    <span>•</span>
                    <span>Active Listings: <strong className="text-white">{activeData.activeListings}</strong></span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sync Connection state */}
          <div className="flex items-center gap-2">
            {!shopData ? (
              <a href="/api/etsy/auth" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-colors shadow-lg">
                Connect Etsy Shop
              </a>
            ) : null}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
              <div className={`w-2 h-2 rounded-full ${shopData ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[#a09cb0]">Etsy Sync:</span>
            <span className="text-white font-bold">StarSeller_Store_1</span>
          </div>
        </div>
      </div>
      </div>

      {/* Aktif Siparişler (Active Orders Grid) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-[#a09cb0] uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={13} className="text-purple-400" />
            <span>Active Orders (Last 4)</span>
          </h3>
          <Link href="/orders" className="text-[10px] font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
            <span>View All Orders</span>
            <ArrowRight size={10} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {activeOrders.map((o) => (
            <Link href="/orders" key={o.id} className="group block">
              <div className="bg-[#16161e] border border-white/[0.05] group-hover:border-purple-500/20 rounded-xl p-5 space-y-3 transition-all hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between min-h-[155px] h-auto">
                
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block group-hover:text-purple-300 transition-colors truncate">{o.buyerName}</span>
                    <span className="text-[9px] text-[#5e5a72] block mt-0.5 font-mono">{o.orderId}</span>
                  </div>
                  <span className="text-[8px] font-bold text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/15 shrink-0 uppercase">
                    {o.status === "Processing" ? "Processing" : "Ready to Ship"}
                  </span>
                </div>

                <div className="flex gap-2.5 items-center min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-white/10 overflow-hidden shrink-0">
                    <img src={o.image} alt={o.product} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[10px] text-white/95 block font-semibold truncate">{o.product}</span>
                    <span className="text-[9px] text-[#5e5a72] block font-mono truncate">{o.sku}</span>
                  </div>
                </div>

                <div className="border-t border-white/[0.04] pt-2 flex flex-col gap-0.5 text-[9px] shrink-0">
                  <span className="text-[#a09cb0]">Ordered: <strong className="text-white font-medium">{o.orderedTime}</strong></span>
                  <span className="text-[#a09cb0]">Ship by: <strong className="text-amber-400 font-semibold">{o.shipBy}</strong></span>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Unified Analytics Panel */}
      <div className="bg-[#16161e] border border-white/[0.07] rounded-xl p-5 space-y-5 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
        
        {/* Timeframe Selector Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.05]">
          <div className="flex bg-white/[0.02] p-1 rounded-lg border border-white/[0.05] self-start">
            {[
              { id: "daily", label: "Daily" },
              { id: "weekly", label: "Weekly" },
              { id: "monthly", label: "Monthly" },
              { id: "allTime", label: "All Time" }
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
          <span className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider px-2 sm:text-right">Store Analytics Overview</span>
        </div>

        {/* Core Etsy Shop Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          
          {/* Metric 1: Aktif Ürünler */}
          <div className="bg-black/20 border border-white/[0.04] rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-white/10 transition-colors">
            <span className="text-[9px] font-bold text-[#a09cb0] uppercase tracking-wider flex items-center gap-1">
              <Package size={10} className="text-purple-400" />
              <span>Active Listings</span>
            </span>
            <div>
              <div className="text-2xl font-extrabold text-white leading-none">{activeData.activeListings}</div>
              <span className="text-[9px] text-[#5e5a72] block mt-1">Live Listings</span>
            </div>
          </div>

          {/* Metric 2: Draft Ürünler */}
          <div className="bg-black/20 border border-white/[0.04] rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-white/10 transition-colors">
            <span className="text-[9px] font-bold text-[#a09cb0] uppercase tracking-wider flex items-center gap-1">
              <FileText size={10} className="text-blue-400" />
              <span>Draft Listings</span>
            </span>
            <div>
              <div className="text-2xl font-extrabold text-white leading-none">{activeData.draftListings}</div>
              <span className="text-[9px] text-[#5e5a72] block mt-1">Pending Sync</span>
            </div>
          </div>

          {/* Metric 3: Satışlar */}
          <div className="bg-black/20 border border-white/[0.04] rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-white/10 transition-colors">
            <span className="text-[9px] font-bold text-[#a09cb0] uppercase tracking-wider flex items-center gap-1">
              <ShoppingBag size={10} className="text-purple-400" />
              <span>Sales</span>
            </span>
            <div>
              <div className="text-2xl font-extrabold text-white leading-none">{activeData.orders.split(" ")[0]}</div>
              <span className="text-[9px] text-[#5e5a72] block mt-1">Total Orders</span>
            </div>
          </div>

          {/* Metric 4: Görüntülenme */}
          <div className="bg-black/20 border border-white/[0.04] rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-white/10 transition-colors">
            <span className="text-[9px] font-bold text-[#a09cb0] uppercase tracking-wider flex items-center gap-1">
              <Eye size={10} className="text-blue-400" />
              <span>Views</span>
            </span>
            <div>
              <div className="text-2xl font-extrabold text-white leading-none">{activeData.views.split(" ")[0]}</div>
              <span className="text-[9px] text-[#5e5a72] block mt-1">Store Visits</span>
            </div>
          </div>

          {/* Metric 5: Favoriler */}
          <div className="bg-black/20 border border-white/[0.04] rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-white/10 transition-colors">
            <span className="text-[9px] font-bold text-[#a09cb0] uppercase tracking-wider flex items-center gap-1">
              <Heart size={10} className="text-pink-400" />
              <span>Favorites</span>
            </span>
            <div>
              <div className="text-2xl font-extrabold text-white leading-none">{activeData.favorites.split(" ")[0]}</div>
              <span className="text-[9px] text-[#5e5a72] block mt-1">Listing Favs</span>
            </div>
          </div>

          {/* Metric 6: Ciro */}
          <div className="bg-black/20 border border-white/[0.04] rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-white/10 transition-colors">
            <span className="text-[9px] font-bold text-[#a09cb0] uppercase tracking-wider flex items-center gap-1">
              <DollarSign size={10} className="text-emerald-400" />
              <span>Revenue</span>
            </span>
            <div>
              <div className="text-2xl font-extrabold text-emerald-400 leading-none">{activeData.revenue}</div>
              <span className="text-[9px] text-[#5e5a72] block mt-1">Gross Sales</span>
            </div>
          </div>

          {/* Metric 7: Net Kâr */}
          <div className="bg-black/20 border border-white/[0.04] rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-white/10 transition-colors">
            <span className="text-[9px] font-bold text-[#a09cb0] uppercase tracking-wider flex items-center gap-1">
              <TrendingUp size={10} className="text-amber-400" />
              <span>Net Margin</span>
            </span>
            <div>
              <div className="text-2xl font-extrabold text-amber-400 leading-none">{activeData.profit}</div>
              <span className="text-[9px] text-[#5e5a72] block mt-1">Net Margins</span>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Shop Metrics Projection Line Chart */}
      <div className="rounded-xl border border-white/[0.07] bg-[#16161e] p-5 space-y-4 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Store Performance</span>
            </h3>
            <p className="text-[11px] text-[#a09cb0]">Select a sub-metric to plot its weekly trajectory with localized value vertices.</p>
          </div>

          {/* Interactive Metric Selectors (Toggles) */}
          <div className="flex flex-wrap gap-2 text-[9px] text-[#a09cb0]">
            {chartLines.map((l) => {
              const isSelected = selectedMetric === l.key;
              return (
                <button
                  key={l.key}
                  onClick={() => setSelectedMetric(l.key)}
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

        {/* Recharts Area Chart */}
        <div className="w-full h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeData.chartData} margin={{ top: 25, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${activeChartMetric.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeChartMetric.color} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={activeChartMetric.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#5e5a72" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#5e5a72" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={formatYAxis}
                width={50}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#16161e', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 14px' }}
                itemStyle={{ color: activeChartMetric.color, fontWeight: 'bold', fontSize: '13px' }}
                labelStyle={{ color: '#a09cb0', fontWeight: 'bold', marginBottom: '6px', fontSize: '11px', textTransform: 'uppercase' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => {
                  if (activeChartMetric.isCurrency) return [`$${Number(value).toLocaleString()}`, activeChartMetric.name];
                  return [Number(value).toLocaleString(), activeChartMetric.name];
                }}
              />
              <Area 
                type="monotone" 
                dataKey={activeChartMetric.key} 
                stroke={activeChartMetric.color} 
                strokeWidth={3}
                fillOpacity={1} 
                fill={`url(#gradient-${activeChartMetric.key})`}
                activeDot={{ r: 7, strokeWidth: 2, stroke: '#16161e' }}
                animationDuration={600}
              >
                <LabelList 
                  dataKey={activeChartMetric.key} 
                  position="top" 
                  offset={12}
                  fill="#ffffff"
                  fontSize={10}
                  fontWeight="bold"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => {
                    const numVal = Number(value);
                    if (activeChartMetric.isCurrency) return `$${numVal >= 1000 ? (numVal/1000).toFixed(1) + 'k' : numVal}`;
                    return numVal >= 1000 ? (numVal/1000).toFixed(1) + 'k' : numVal;
                  }}
                />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-Column Section Grid (En Çok Satan Ürünler + En Çok Favorilenenler) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Top Selling Products */}
        <div className="rounded-xl border border-white/[0.07] bg-[#16161e] overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>Top Selling Products</span>
            </h3>
            <button className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-3 py-1.5 rounded-md border border-purple-500/30 shadow-lg hover:bg-purple-500/30 transition-colors cursor-pointer">
              Orders Leaderboard
            </button>
          </div>

          <div className="px-3 py-1 space-y-0 divide-y divide-white/[0.04]">
            {bestSellersList.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 py-3 px-2 hover:bg-white/[0.02] transition-colors rounded-md">
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

        {/* Right Column: Most Favorited */}
        <div className="rounded-xl border border-white/[0.07] bg-[#16161e] overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              <span>Most Favorited</span>
            </h3>
            <button className="text-[10px] font-bold text-pink-300 bg-pink-500/20 px-3 py-1.5 rounded-md border border-pink-500/30 shadow-lg hover:bg-pink-500/30 transition-colors cursor-pointer">
              Engagement Status
            </button>
          </div>

          <div className="px-3 py-1 space-y-0 divide-y divide-white/[0.04]">
            {mostFavoritedList.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 py-3 px-2 hover:bg-white/[0.02] transition-colors rounded-md">
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
            <h4 className="text-xs font-bold text-white">Etsy SEO & Store Health Score</h4>
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
