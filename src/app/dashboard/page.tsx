"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
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
  { key: "Revenue", name: "Revenue", color: "#10b981", isCurrency: true }
];

// Timeframe mapping datasets
const statsData = {
  daily: {
    activeListings: 124,
    draftListings: 12,
    orders: "12 orders",
    views: "850 views",
    favorites: "45 favs",
    revenue: "$345.00",
    chartData: [
      { name: "00:00", Sales: 1, Views: 45, Favorites: 2, Revenue: 25 },
      { name: "04:00", Sales: 0, Views: 20, Favorites: 1, Revenue: 0 },
      { name: "08:00", Sales: 3, Views: 120, Favorites: 5, Revenue: 85 },
      { name: "12:00", Sales: 5, Views: 240, Favorites: 12, Revenue: 140 },
      { name: "16:00", Sales: 2, Views: 280, Favorites: 15, Revenue: 60 },
      { name: "20:00", Sales: 1, Views: 145, Favorites: 10, Revenue: 35 }
    ]
  },
  weekly: {
    activeListings: 124,
    draftListings: 12,
    orders: "86 orders",
    views: "5,420 views",
    favorites: "312 favs",
    revenue: "$2,380.00",
    chartData: [
      { name: "Mon", Sales: 12, Views: 850, Favorites: 45, Revenue: 345 },
      { name: "Tue", Sales: 15, Views: 920, Favorites: 52, Revenue: 420 },
      { name: "Wed", Sales: 10, Views: 780, Favorites: 38, Revenue: 290 },
      { name: "Thu", Sales: 18, Views: 1100, Favorites: 65, Revenue: 510 },
      { name: "Fri", Sales: 14, Views: 890, Favorites: 48, Revenue: 395 },
      { name: "Sat", Sales: 9, Views: 560, Favorites: 30, Revenue: 250 },
      { name: "Sun", Sales: 8, Views: 320, Favorites: 34, Revenue: 170 }
    ]
  },
  monthly: {
    activeListings: 124,
    draftListings: 12,
    orders: "342 orders",
    views: "24,500 views",
    favorites: "1,240 favs",
    revenue: "$10,350.00",
    chartData: [
      { name: "Week 1", Sales: 86, Views: 5420, Favorites: 312, Revenue: 2380 },
      { name: "Week 2", Sales: 92, Views: 6100, Favorites: 345, Revenue: 2650 },
      { name: "Week 3", Sales: 78, Views: 4950, Favorites: 280, Revenue: 2150 },
      { name: "Week 4", Sales: 86, Views: 8030, Favorites: 303, Revenue: 3170 }
    ]
  },
  allTime: {
    activeListings: 124,
    draftListings: 12,
    orders: "1,845 orders",
    views: "145,200 views",
    favorites: "8,930 favs",
    revenue: "$59,380.00",
    chartData: [
      { name: "Jan", Sales: 240, Views: 18500, Favorites: 1100, Revenue: 7500 },
      { name: "Feb", Sales: 180, Views: 15200, Favorites: 950, Revenue: 5800 },
      { name: "Mar", Sales: 210, Views: 16800, Favorites: 1050, Revenue: 6400 },
      { name: "Apr", Sales: 280, Views: 21500, Favorites: 1350, Revenue: 8900 },
      { name: "May", Sales: 310, Views: 24000, Favorites: 1500, Revenue: 9800 },
      { name: "Jun", Sales: 285, Views: 22100, Favorites: 1420, Revenue: 9100 },
      { name: "Jul", Sales: 340, Views: 27100, Favorites: 1560, Revenue: 11880 }
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
  icon_url_fullxfull?: string;
}

export default function SellerDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "allTime">("allTime");
  const [selectedMetric, setSelectedMetric] = useState<string>("Sales");
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [etsyLoading, setEtsyLoading] = useState(true);
  const [etsyError, setEtsyError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    setEtsyLoading(true);
    setEtsyError(null);
    fetch('/api/etsy/shop', { headers: { 'x-user-id': user.id } })
      .then(res => res.json())
      .then(data => { 
        if (!data.error) {
          setShopData(data); 
        } else {
          setShopData(null); 
          setEtsyError(data.error);
        }
      })
      .catch(err => {
        console.error(err);
        setEtsyError("An unexpected error occurred.");
      })
      .finally(() => setEtsyLoading(false));
  }, [user?.id]);
  
  const handleDisconnectEtsy = async () => {
    if (!user?.id) return;
    setEtsyLoading(true);
    try {
      await fetch('/api/etsy/disconnect', { method: 'POST', headers: { 'x-user-id': user.id } });
      setShopData(null);
    } catch (err) {
      console.error(err);
    } finally {
      setEtsyLoading(false);
    }
  };
  
  // Real Data States
  const [realOrders, setRealOrders] = useState<any[]>([]);
  const [realBestSellers, setRealBestSellers] = useState<PerformanceItem[]>(bestSellersList);
  const [realMostFavorited, setRealMostFavorited] = useState<PerformanceItem[]>(mostFavoritedList);
  const [realSalesCount, setRealSalesCount] = useState<number | null>(null);
  const [realRevenue, setRealRevenue] = useState<string | null>(null);
  const [realRevenueRaw, setRealRevenueRaw] = useState<number | null>(null);
  const [realReceipts, setRealReceipts] = useState<any[]>([]);
  const [realViews, setRealViews] = useState<number | null>(null);
  const [realFavorites, setRealFavorites] = useState<number | null>(null);
  const [historicalStats, setHistoricalStats] = useState<any>(null);

  // Send snapshot and get history whenever all real data is loaded
  useEffect(() => {
    if (!user?.id || !shopData || realSalesCount === null || realRevenueRaw === null || realViews === null || realFavorites === null) return;
    
    fetch('/api/etsy/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
      body: JSON.stringify({
        views: realViews,
        favorites: realFavorites,
        salesCount: shopData.transaction_sold_count || 0,
        activeListings: shopData.listing_active_count || 0,
        revenue: realRevenueRaw
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setHistoricalStats(data.history);
      }
    })
    .catch(console.error);
  }, [user?.id, shopData, realSalesCount, realRevenueRaw, realViews, realFavorites]);

  useEffect(() => {
    if (!user?.id) return;

    // Fetch Orders Data
    fetch('/api/etsy/orders', { headers: { 'x-user-id': user.id } })
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.results) {
          const activeOnly = data.results.filter((r: any) => !r.is_shipped && r.status !== 'Canceled' && r.status !== 'Canceled');
          setRealOrders(activeOnly.slice(0, 4).map((r: any) => {
            const tx = r.transactions?.[0] || {};
            const listing = tx.listing || {};
            const imageUrl = listing?.Images?.[0]?.url_170x135 || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=100&q=80";
            return {
              id: r.receipt_id?.toString() || Math.random().toString(),
              orderId: `#${r.receipt_id}`,
              buyerName: r.name || "Etsy Buyer",
              product: tx.title || "Unknown Product",
              image: imageUrl,
              sku: tx.product_data?.sku || "-",
              orderedTime: r.create_timestamp ? new Date(r.create_timestamp * 1000).toLocaleDateString() : "-",
              shipBy: "Check Etsy",
              status: r.status || "Processing"
            };
          }));
          
          setRealSalesCount(data.count || 0);
          setRealReceipts(data.results || []);
          
          let rev = 0;
          let currency = 'USD';
          data.results.forEach((r: any) => {
             if (r.grandtotal && r.grandtotal.amount && r.grandtotal.divisor) {
                rev += (r.grandtotal.amount / r.grandtotal.divisor);
                currency = r.grandtotal.currency_code || currency;
             }
          });
          
          const formatter = new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', {
             style: 'currency',
             currency: currency
          });
          setRealRevenueRaw(rev);
          setRealRevenue(formatter.format(rev));
        }
      })
      .catch(console.error);

    // Fetch Listings Data
    fetch('/api/etsy/listings', { headers: { 'x-user-id': user.id } })
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.results) {
          const listings = data.results;
          
          let v = 0;
          let f = 0;
          listings.forEach((item: any) => {
            v += (item.views || 0);
            f += (item.num_favorers || 0);
          });
          setRealViews(v);
          setRealFavorites(f);
          
          const sortedByViews = [...listings].sort((a: any, b: any) => (b.views || 0) - (a.views || 0)).slice(0, 3);
          setRealBestSellers(sortedByViews.map((item: any) => ({
            id: item.listing_id?.toString() || Math.random().toString(),
            name: item.title || "Unknown Listing",
            image: item.Images?.[0]?.url_170x135 || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=100&q=80",
            value: `${item.views || 0} views`,
            secondaryVal: "Etsy Data",
            rate: item.price ? `$${(item.price.amount / item.price.divisor).toFixed(2)}` : "-"
          })));

          const sortedByFavs = [...listings].sort((a: any, b: any) => (b.num_favorers || 0) - (a.num_favorers || 0)).slice(0, 3);
          setRealMostFavorited(sortedByFavs.map((item: any) => ({
            id: item.listing_id?.toString() || Math.random().toString(),
            name: item.title || "Unknown Listing",
            image: item.Images?.[0]?.url_170x135 || "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=100&q=80",
            value: `${item.num_favorers || 0} favorites`,
            secondaryVal: "Etsy Data",
            rate: "Active"
          })));
        }
      })
      .catch(console.error);
  }, [user?.id]);

  // Compute Active Data based on Timeframe
  const computeActiveData = () => {
    const base = {
      activeListings: shopData?.listing_active_count || 0,
      draftListings: 0,
      sales: shopData?.transaction_sold_count || 0,
      views: realViews || 0,
      favorites: realFavorites || 0,
      revenue: realRevenueRaw || 0,
      profit: "$0.00"
    };

    if (timeframe === "allTime" || !historicalStats) return base;

    let past = null;
    if (timeframe === "daily") past = historicalStats.yesterday;
    if (timeframe === "weekly") past = historicalStats.lastWeek;
    if (timeframe === "monthly") past = historicalStats.lastMonth;

    if (!past) return { ...base, sales: 0, views: 0, favorites: 0, revenue: 0 }; // If no history, diff is 0

    return {
      activeListings: base.activeListings,
      draftListings: base.draftListings,
      sales: Math.max(0, base.sales - (past.salesCount || 0)),
      views: Math.max(0, base.views - (past.views || 0)),
      favorites: Math.max(0, base.favorites - (past.favorites || 0)),
      revenue: Math.max(0, base.revenue - (past.revenue || 0))
    };
  };

  const currentData = computeActiveData();
  const formatRev = (val: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val); 
  };

  const buildChartData = () => {
    // If we only have today's record (or none), we show just today
    if (!historicalStats?.allHistory || historicalStats.allHistory.length <= 1) {
      return [{
        name: "Bugün", 
        Sales: 0, 
        Views: 0, 
        Favorites: 0, 
        Revenue: 0
      }];
    }

    const grouped: Record<string, any> = {};

    const getWeek = (d: Date) => {
        const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
        const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    // We strictly use the historical stats recorded FROM the connection day
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const history = [...historicalStats.allHistory].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Start at i = 1 to only compute diffs, bypassing the base snapshot on day 0
    for (let i = 1; i < history.length; i++) {
      const current = history[i];
      const prev = history[i-1];
      const d = new Date(current.date);
      
      let key = "";
      if (timeframe === "daily") {
        key = d.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
      } else if (timeframe === "weekly") {
        key = `Hafta ${getWeek(d)}, '${d.getFullYear().toString().slice(-2)}`;
      } else {
        key = d.toLocaleDateString('tr-TR', { year: 'numeric', month: 'short' });
      }
      
      if (!grouped[key]) {
        grouped[key] = { name: key, Sales: 0, Revenue: 0, Views: 0, Favorites: 0, timestamp: d.getTime() };
      }
      
      const revDiff = Math.max(0, current.revenue - prev.revenue);
      // Since Etsy mostly uses USD, multiply by 33.5 to match the TRY display if we don't have currency data stored
      const revInTRY = revDiff * 33.5;

      grouped[key].Sales += Math.max(0, current.salesCount - prev.salesCount);
      grouped[key].Revenue += revInTRY;
      grouped[key].Views += Math.max(0, current.views - prev.views);
      grouped[key].Favorites += Math.max(0, current.favorites - prev.favorites);
    }

    // Convert to array and sort by timestamp
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result = Object.values(grouped).sort((a: any, b: any) => a.timestamp - b.timestamp);
    
    // Clean up timestamp before returning for Recharts
    result = result.map(item => {
      const { timestamp, ...rest } = item;
      return rest;
    });
    
    // For daily, if there are many days, just show the last 14 days to draw a proper line
    if (timeframe === "daily" && result.length > 14) {
      result = result.slice(-14);
    }
    
    return result;
  };

  const isConnected = !!shopData;
  const activeData = isConnected ? {
    activeListings: currentData.activeListings,
    draftListings: currentData.draftListings,
    orders: `${timeframe === 'allTime' ? (shopData?.transaction_sold_count || 0) : currentData.sales} orders`,
    views: `${timeframe === 'allTime' ? (realViews || 0) : currentData.views} views`,
    favorites: `${timeframe === 'allTime' ? (realFavorites || 0) : currentData.favorites} favs`,
    revenue: timeframe === 'allTime' ? (realRevenue || "$0.00") : formatRev(currentData.revenue),
    chartData: buildChartData()
  } : statsData[timeframe];

  const activeChartMetric = chartLines.find(l => l.key === selectedMetric) || chartLines[0];

  const formatYAxis = (value: number) => {
    const formatted = value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
    return activeChartMetric.isCurrency ? `₺${formatted}` : formatted;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fade-in">
      
      {/* Etsy Mağaza Başlığı (Personalized Shop Banner & Avatar) */}
      <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* Banner Image */}
        <div 
          className="h-24 w-full bg-cover bg-center relative"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80')" }}
        >
          {/* Tint Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#16161e] via-[#16161e]/40 to-transparent" />
          
          {/* Shop Tag Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-foreground bg-emerald-500/80 px-2.5 py-1 rounded-full border border-emerald-400/20 shadow-md">
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
                src={shopData?.icon_url_fullxfull ? shopData.icon_url_fullxfull : "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=150&q=80"} 
                alt="Shop Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="space-y-1 pb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 justify-center sm:justify-start">
                <span>{shopData ? shopData.shop_name : "Woodland Meadow Crafts"}</span>
                <CheckCircle size={18} className="text-purple-400 fill-purple-400/20" />
              </h1>
              <div className="flex items-center gap-3 text-xs text-secondary justify-center sm:justify-start">
                {shopData ? (
                  <>
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-foreground font-semibold">{shopData.review_average || '5.0'}</span> ({shopData.review_count} Reviews)
                    </span>
                    <span>•</span>
                    <span>Active Listings: <strong className="text-foreground">{shopData.listing_active_count}</strong></span>
                    <span>•</span>
                    <span>Sales: <strong className="text-foreground">{shopData.transaction_sold_count}</strong></span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-foreground font-semibold">4.9</span> (1,482 Reviews)
                    </span>
                    <span>•</span>
                    <span>Active Listings: <strong className="text-foreground">{activeData.activeListings}</strong></span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sync Connection state */}
          <div className="flex items-center gap-2">
            {!etsyLoading && !shopData && user?.id && (
              <a
                href={`/api/etsy/auth?userId=${user.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-colors shadow-lg"
              >
                {t("sellerDashboard.connectEtsyStore")}
              </a>
            )}
            <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-border text-xs">
              <div className={`w-2 h-2 rounded-full ${shopData ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-secondary">{t("sellerDashboard.etsySync")}</span>
              <span className="text-foreground font-bold">
                {shopData ? String(shopData.shop_name) : (etsyLoading ? '...' : 'Not Connected')}
              </span>
              {etsyError && (
              <div className="absolute top-full right-0 mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl max-w-sm w-max z-50">
                <p className="text-red-400 text-[10px] font-mono break-all">{etsyError}</p>
              </div>
            )}
          </div>
            {shopData && (
              <button
                onClick={handleDisconnectEtsy}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs transition-colors border border-red-500/30"
              >
                Bağlantıyı Kes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Aktif Siparişler (Active Orders Grid) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={13} className="text-purple-400" />
            <span>{t("sellerDashboard.activeOrders")}</span>
          </h3>
          <Link href="/orders" className="text-[10px] font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
            <span>{t("sellerDashboard.viewAllOrders")}</span>
            <ArrowRight size={10} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {realOrders.length === 0 ? (
            <div className="col-span-full p-8 flex items-center justify-center border border-border bg-black/5 rounded-xl">
              <span className="text-xs font-medium text-secondary">{t("sellerDashboard.noActiveOrders") || "Henüz aktif siparişiniz bulunmamaktadır."}</span>
            </div>
          ) : (
            realOrders.map((o) => (
            <Link href="/orders" key={o.id} className="group block">
              <div className="bg-card border border-border group-hover:border-purple-500/20 rounded-xl p-5 space-y-3 transition-all hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between min-h-[155px] h-auto">
                
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-foreground block group-hover:text-purple-300 transition-colors truncate">{o.buyerName}</span>
                    <span className="text-[9px] text-muted block mt-0.5 font-mono">{o.orderId}</span>
                  </div>
                  <span className="text-[8px] font-bold text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/15 shrink-0 uppercase">
                    {o.status === "Processing" ? t("sellerDashboard.processing") : t("sellerDashboard.readyToShip")}
                  </span>
                </div>

                <div className="flex gap-2.5 items-center min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-border overflow-hidden shrink-0">
                    <img src={o.image} alt={o.product} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[10px] text-foreground/95 block font-semibold truncate">{o.product}</span>
                    <span className="text-[9px] text-muted block font-mono truncate">{o.sku}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-2 flex flex-col gap-0.5 text-[9px] shrink-0">
                  <span className="text-secondary">{t("sellerDashboard.ordered")} <strong className="text-foreground font-medium">{o.orderedTime}</strong></span>
                  <span className="text-secondary">{t("sellerDashboard.shipBy")} <strong className="text-amber-400 font-semibold">{o.shipBy}</strong></span>
                </div>

              </div>
            </Link>
            ))
          )}
        </div>
      </div>

      {/* Unified Analytics Panel */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-5 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
        
        {/* Timeframe Selector Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex bg-white/[0.02] p-1 rounded-lg border border-border self-start">
            {[
              { id: "daily", label: t("sellerDashboard.daily") },
              { id: "weekly", label: t("sellerDashboard.weekly") },
              { id: "monthly", label: t("sellerDashboard.monthly") },
              { id: "allTime", label: t("sellerDashboard.allTime") }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id as "daily" | "weekly" | "monthly" | "allTime")}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  timeframe === tab.id
                    ? "bg-purple-500/20 border border-purple-500/35 text-foreground shadow-md font-extrabold"
                    : "text-secondary hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider px-2 sm:text-right">{t("sellerDashboard.storeAnalytics")}</span>
        </div>

        {/* Core Etsy Shop Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          
          {/* Metric 1: Aktif Ürünler */}
          <div className="bg-black/20 border border-border rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-border transition-colors">
            <span className="text-[9px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
              <Package size={10} className="text-purple-400" />
              <span>{t("sellerDashboard.activeListings").replace(":", "")}</span>
            </span>
            <div>
              <div className="text-2xl font-extrabold text-foreground leading-none">{activeData.activeListings}</div>
              <span className="text-[9px] text-muted block mt-1">{t("sellerDashboard.liveListings")}</span>
            </div>
          </div>

          {/* Metric 2: Draft Ürünler */}
          <div className="bg-black/20 border border-border rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-border transition-colors">
            <span className="text-[9px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
              <FileText size={10} className="text-blue-400" />
              <span>{t("sellerDashboard.draftListings")}</span>
            </span>
            <div>
              <div className="text-2xl font-extrabold text-foreground leading-none">{activeData.draftListings}</div>
              <span className="text-[9px] text-muted block mt-1">{t("sellerDashboard.pendingSync")}</span>
            </div>
          </div>

          {/* Metric 3: Satışlar */}
          <div className="bg-black/20 border border-border rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-border transition-colors">
            <span className="text-[9px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
              <ShoppingBag size={10} className="text-purple-400" />
              <span>{t("sellerDashboard.sales")}</span>
            </span>
            <div>
              <div className="text-2xl font-extrabold text-foreground leading-none">{activeData.orders.split(" ")[0]}</div>
              <span className="text-[9px] text-muted block mt-1">{t("sellerDashboard.totalOrders")}</span>
            </div>
          </div>

          {/* Metric 4: Görüntülenme */}
          <div className="bg-black/20 border border-border rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-border transition-colors">
            <span className="text-[9px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
              <Eye size={10} className="text-blue-400" />
              <span>{t("sellerDashboard.views")}</span>
            </span>
            <div>
              <div className="text-2xl font-extrabold text-foreground leading-none">{activeData.views.split(" ")[0]}</div>
              <span className="text-[9px] text-muted block mt-1">{t("sellerDashboard.storeVisits")}</span>
            </div>
          </div>

          {/* Metric 5: Ziyaretler (Visits) */}
          <div className="bg-black/20 border border-border rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-border transition-colors">
            <span className="text-[9px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
              <Eye size={10} className="text-pink-400" />
              <span>Visits</span>
            </span>
            <div>
              <div className="text-2xl font-extrabold text-foreground leading-none">{activeData.favorites.split(" ")[0]}</div>
              <span className="text-[9px] text-muted block mt-1">Total Store Visits</span>
            </div>
          </div>

          {/* Metric 6: Ciro */}
          <div className="bg-black/20 border border-border rounded-xl p-3.5 flex flex-col justify-between h-24 hover:border-border transition-colors">
            <span className="text-[9px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
              <DollarSign size={10} className="text-emerald-400" />
              <span>{t("sellerDashboard.revenue")}</span>
            </span>
            <div>
              <div className="text-2xl font-extrabold text-emerald-400 leading-none">{activeData.revenue}</div>
              <span className="text-[9px] text-muted block mt-1">{t("sellerDashboard.grossSales")}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Shop Metrics Projection Line Chart */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>{t("sellerDashboard.storePerformance")}</span>
            </h3>
            <p className="text-[11px] text-secondary">{t("sellerDashboard.metricDesc")}</p>
          </div>

          {/* Interactive Metric Selectors (Toggles) */}
          <div className="flex flex-wrap gap-2 text-[9px] text-secondary">
            {chartLines.map((l) => {
              const isSelected = selectedMetric === l.key;
              return (
                <button
                  key={l.key}
                  onClick={() => setSelectedMetric(l.key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white/10 border-border-hover text-foreground scale-[1.02] font-bold"
                      : "border-border bg-white/[0.01] hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: l.color }} />
                  <span>{t(`metric.${l.key}`)}</span>
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
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="var(--text-muted)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="var(--text-muted)" 
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
                  if (activeChartMetric.isCurrency) return [`₺${Number(value).toLocaleString()}`, activeChartMetric.name];
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
        <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>{t("sellerDashboard.topSelling")}</span>
            </h3>
            <button className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-3 py-1.5 rounded-md border border-purple-500/30 shadow-lg hover:bg-purple-500/30 transition-colors cursor-pointer">
              {t("sellerDashboard.ordersLeaderboard")}
            </button>
          </div>

          <div className="px-3 py-1 space-y-0 divide-y divide-white/[0.04]">
            {realBestSellers.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 py-3 px-2 hover:bg-white/[0.02] transition-colors rounded-md">
                <div className="flex items-center gap-3">
                  {/* Item Image */}
                  <div className="w-11 h-11 rounded-lg overflow-hidden border border-border shrink-0 bg-neutral-900 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground truncate max-w-[180px] sm:max-w-[280px]" title={item.name}>
                      {item.name}
                    </h4>
                    <span className="text-[9px] text-muted block mt-0.5">{item.secondaryVal}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-foreground block">{item.value}</span>
                  <span className="text-[10px] text-emerald-400 font-bold block">{item.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Most Favorited */}
        <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              <span>{t("sellerDashboard.mostFavorited")}</span>
            </h3>
            <button className="text-[10px] font-bold text-pink-300 bg-pink-500/20 px-3 py-1.5 rounded-md border border-pink-500/30 shadow-lg hover:bg-pink-500/30 transition-colors cursor-pointer">
              {t("sellerDashboard.engagementStatus")}
            </button>
          </div>

          <div className="px-3 py-1 space-y-0 divide-y divide-white/[0.04]">
            {realMostFavorited.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 py-3 px-2 hover:bg-white/[0.02] transition-colors rounded-md">
                <div className="flex items-center gap-3">
                  {/* Item Image */}
                  <div className="w-11 h-11 rounded-lg overflow-hidden border border-border shrink-0 bg-neutral-900 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground truncate max-w-[180px] sm:max-w-[280px]" title={item.name}>
                      {item.name}
                    </h4>
                    <span className="text-[9px] text-muted block mt-0.5">{item.secondaryVal}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-foreground block">{item.value}</span>
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
            <h4 className="text-xs font-bold text-foreground">{t("sellerDashboard.seoHealth")}</h4>
            <p className="text-[11px] text-secondary mt-0.5">
              {t("sellerDashboard.seoDesc")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto text-right">
          <div>
            <span className="text-lg font-extrabold text-foreground block leading-none">96%</span>
            <span className="text-[9px] text-muted block mt-0.5">{t("sellerDashboard.excellentHealth")}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle size={16} />
          </div>
        </div>
      </div>

    </div>
  );
}
