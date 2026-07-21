"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Sparkles,
  Layers,
  Clock,
  ArrowRight,
  Package,
  TrendingUp,
  Search,
  Heart,
  ShoppingBag,
  Users
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

/* ─── Types & Interfaces ────────────────────────────────────────── */

interface MetricLine {
  name: string;
  label: string;
  color: string;
  path: string;
  areaPath: string;
  points: { cx: number; cy: number }[];
  gradientId: string;
  value: string;
  weeklyValues: string[];
}

interface CategoryDetail {
  name: string;
  sub: string;
  color: string;
  change: string;
  trend: "up" | "down" | "steady";
  monthlySales: string;
  avgPrice: string;
  competition: string;
  hotStyle: string;
  keywords: string[];
  recommendedModel: string;
  recommendedModelId: string;
  insight: string;
  lines: MetricLine[];
}

const categoryDetails: Record<string, CategoryDetail> = {
  "T-Shirts": {
    name: "T-Shirts",
    sub: "Bella+Canvas 3001 & Comfort Colors 1717",
    color: "#7c6af7",
    change: "+34.2% Up",
    trend: "up",
    monthlySales: "~12,400 orders",
    avgPrice: "$22.00 - $28.00",
    competition: "High",
    hotStyle: "Retro Floral, Y2K Aesthetic, Gothic Grunge",
    keywords: ["y2k aesthetic shirts", "retro custom tees", "oversized streetwear shirt"],
    recommendedModel: "Bella+Canvas 3001 Unisex Tee",
    recommendedModelId: "3",
    insight: "T-Shirts are experiencing extreme summer demand. Direct-to-garment (DTG) prints with retro typography and botanical elements are currently converting highest on Etsy.",
    lines: [
      {
        name: "Search Volume",
        label: "Search Volume",
        color: "#7c6af7",
        path: "M 50 140 C 115 125, 180 115, 245 80 S 375 45, 440 30",
        areaPath: "M 50 140 C 115 125, 180 115, 245 80 S 375 45, 440 30 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 140 }, { cx: 115, cy: 130 }, { cx: 180, cy: 110 }, { cx: 245, cy: 80 }, { cx: 310, cy: 60 }, { cx: 375, cy: 45 }, { cx: 440, cy: 30 }],
        gradientId: "purple-fade",
        value: "145k queries/mo",
        weeklyValues: ["140k", "130k", "110k", "80k", "60k", "45k", "30k"],
      },
      {
        name: "Active Sellers",
        label: "Active Sellers",
        color: "#3b82f6",
        path: "M 50 80 C 115 82, 180 78, 245 83 S 375 80, 440 75",
        areaPath: "M 50 80 C 115 82, 180 78, 245 83 S 375 80, 440 75 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 80 }, { cx: 115, cy: 82 }, { cx: 180, cy: 78 }, { cx: 245, cy: 83 }, { cx: 310, cy: 80 }, { cx: 375, cy: 80 }, { cx: 440, cy: 75 }],
        gradientId: "blue-fade",
        value: "14.2k shops",
        weeklyValues: ["14.2k", "14.2k", "14.1k", "14.3k", "14.2k", "14.2k", "14.3k"],
      },
      {
        name: "Favorites Rate",
        label: "Favorites Rate",
        color: "#f43f5e",
        path: "M 50 155 C 115 145, 180 135, 245 105 S 375 80, 440 65",
        areaPath: "M 50 155 C 115 145, 180 135, 245 105 S 375 80, 440 65 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 155 }, { cx: 115, cy: 145 }, { cx: 180, cy: 130 }, { cx: 245, cy: 105 }, { cx: 310, cy: 90 }, { cx: 375, cy: 75 }, { cx: 440, cy: 65 }],
        gradientId: "red-fade",
        value: "6.4% fav rate",
        weeklyValues: ["6.1%", "6.2%", "6.3%", "6.4%", "6.4%", "6.5%", "6.4%"],
      },
      {
        name: "Conversion Rate",
        label: "Conversion Rate",
        color: "#22c55e",
        path: "M 50 170 C 115 160, 180 150, 245 130 S 375 110, 440 95",
        areaPath: "M 50 170 C 115 160, 180 150, 245 130 S 375 110, 440 95 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 170 }, { cx: 115, cy: 160 }, { cx: 180, cy: 145 }, { cx: 245, cy: 130 }, { cx: 310, cy: 120 }, { cx: 375, cy: 110 }, { cx: 440, cy: 95 }],
        gradientId: "green-fade",
        value: "3.2% conversion",
        weeklyValues: ["3.0%", "3.1%", "3.1%", "3.2%", "3.2%", "3.3%", "3.2%"],
      },
    ],
  },
  "Sweatshirts": {
    name: "Sweatshirts",
    sub: "Gildan 18000 Heavy Blend",
    color: "#3b82f6",
    change: "+18.5% Up",
    trend: "up",
    monthlySales: "~8,150 orders",
    avgPrice: "$34.00 - $45.00",
    competition: "Medium-High",
    hotStyle: "Minimalist Sleeve Quotes, College Varsity Typography",
    keywords: ["custom sleeve print sweatshirt", "retro college crewneck", "cozy oversized jumper"],
    recommendedModel: "Gildan 18000 Sweatshirt",
    recommendedModelId: "12",
    insight: "Sweatshirts are seeing steady early autumn stock build-up. Custom sleeve printing (like Roman numerals or initials) is a high-margin opportunity.",
    lines: [
      {
        name: "Search Volume",
        label: "Search Volume",
        color: "#7c6af7",
        path: "M 50 160 C 115 152, 180 140, 245 118 S 375 80, 440 70",
        areaPath: "M 50 160 C 115 152, 180 140, 245 118 S 375 80, 440 70 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 160 }, { cx: 115, cy: 150 }, { cx: 180, cy: 140 }, { cx: 245, cy: 120 }, { cx: 310, cy: 100 }, { cx: 375, cy: 85 }, { cx: 440, cy: 70 }],
        gradientId: "purple-fade",
        value: "92k queries/mo",
        weeklyValues: ["90k", "91k", "91k", "92k", "92k", "93k", "92k"],
      },
      {
        name: "Active Sellers",
        label: "Active Sellers",
        color: "#3b82f6",
        path: "M 50 110 C 115 112, 180 108, 245 113 S 375 110, 440 105",
        areaPath: "M 50 110 C 115 112, 180 108, 245 113 S 375 110, 440 105 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 110 }, { cx: 115, cy: 112 }, { cx: 180, cy: 108 }, { cx: 245, cy: 113 }, { cx: 310, cy: 110 }, { cx: 375, cy: 110 }, { cx: 440, cy: 105 }],
        gradientId: "blue-fade",
        value: "8.8k shops",
        weeklyValues: ["8.8k", "8.8k", "8.7k", "8.9k", "8.8k", "8.8k", "8.9k"],
      },
      {
        name: "Favorites Rate",
        label: "Favorites Rate",
        color: "#f43f5e",
        path: "M 50 175 C 115 165, 180 155, 245 135 S 375 115, 440 100",
        areaPath: "M 50 175 C 115 165, 180 155, 245 135 S 375 115, 440 100 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 175 }, { cx: 115, cy: 165 }, { cx: 180, cy: 155 }, { cx: 245, cy: 135 }, { cx: 310, cy: 125 }, { cx: 375, cy: 115 }, { cx: 440, cy: 100 }],
        gradientId: "red-fade",
        value: "5.8% fav rate",
        weeklyValues: ["5.5%", "5.6%", "5.7%", "5.8%", "5.8%", "5.9%", "5.8%"],
      },
      {
        name: "Conversion Rate",
        label: "Conversion Rate",
        color: "#22c55e",
        path: "M 50 185 C 115 178, 180 170, 245 155 S 375 140, 440 125",
        areaPath: "M 50 185 C 115 178, 180 170, 245 155 S 375 140, 440 125 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 185 }, { cx: 115, cy: 178 }, { cx: 180, cy: 170 }, { cx: 245, cy: 155 }, { cx: 310, cy: 145 }, { cx: 375, cy: 140 }, { cx: 440, cy: 125 }],
        gradientId: "green-fade",
        value: "2.9% conversion",
        weeklyValues: ["2.7%", "2.8%", "2.8%", "2.9%", "2.9%", "3.0%", "2.9%"],
      },
    ],
  },
  "Soy Candles": {
    name: "Soy Candles",
    sub: "Soy Wax Eco-Friendly Glass Jar",
    color: "#22c55e",
    change: "+28.1% Up",
    trend: "up",
    monthlySales: "~5,400 orders",
    avgPrice: "$19.00 - $26.00",
    competition: "Low-Medium",
    hotStyle: "Funny Birthday Quotes, Sarcastic Corporate Gifts",
    keywords: ["funny candle gifts", "scented soy wax jar", "personalized bridesmaid candle"],
    recommendedModel: "Eco Soy Scented Candle",
    recommendedModelId: "727",
    insight: "Soy candles carry low catalog competition with high profit margins. Personalized gift items for birthdays and corporate coworker farewells have excellent traction.",
    lines: [
      {
        name: "Search Volume",
        label: "Search Volume",
        color: "#7c6af7",
        path: "M 50 185 C 115 170, 180 152, 245 120 S 375 75, 440 50",
        areaPath: "M 50 185 C 115 170, 180 152, 245 120 S 375 75, 440 50 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 185 }, { cx: 115, cy: 170 }, { cx: 180, cy: 152 }, { cx: 245, cy: 120 }, { cx: 310, cy: 95 }, { cx: 375, cy: 80 }, { cx: 440, cy: 50 }],
        gradientId: "purple-fade",
        value: "58k queries/mo",
        weeklyValues: ["45k", "48k", "52k", "55k", "56k", "57k", "58k"],
      },
      {
        name: "Active Sellers",
        label: "Active Sellers",
        color: "#3b82f6",
        path: "M 50 160 C 115 155, 180 150, 245 145 S 375 140, 440 135",
        areaPath: "M 50 160 C 115 155, 180 150, 245 145 S 375 140, 440 135 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 160 }, { cx: 115, cy: 155 }, { cx: 180, cy: 150 }, { cx: 245, cy: 145 }, { cx: 310, cy: 140 }, { cx: 375, cy: 140 }, { cx: 440, cy: 135 }],
        gradientId: "blue-fade",
        value: "2.1k shops",
        weeklyValues: ["2.0k", "2.1k", "2.1k", "2.1k", "2.1k", "2.1k", "2.1k"],
      },
      {
        name: "Favorites Rate",
        label: "Favorites Rate",
        color: "#f43f5e",
        path: "M 50 145 C 115 130, 180 110, 245 80 S 375 55, 440 40",
        areaPath: "M 50 145 C 115 130, 180 110, 245 80 S 375 55, 440 40 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 145 }, { cx: 115, cy: 130 }, { cx: 180, cy: 110 }, { cx: 245, cy: 80 }, { cx: 310, cy: 65 }, { cx: 375, cy: 55 }, { cx: 440, cy: 40 }],
        gradientId: "red-fade",
        value: "8.2% fav rate",
        weeklyValues: ["7.9%", "8.0%", "8.1%", "8.2%", "8.2%", "8.3%", "8.2%"],
      },
      {
        name: "Conversion Rate",
        label: "Conversion Rate",
        color: "#22c55e",
        path: "M 50 170 C 115 155, 180 135, 245 105 S 375 80, 440 65",
        areaPath: "M 50 170 C 115 155, 180 135, 245 105 S 375 80, 440 65 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 170 }, { cx: 115, cy: 155 }, { cx: 180, cy: 135 }, { cx: 245, cy: 105 }, { cx: 310, cy: 90 }, { cx: 375, cy: 80 }, { cx: 440, cy: 65 }],
        gradientId: "green-fade",
        value: "4.1% conversion",
        weeklyValues: ["3.8%", "3.9%", "3.9%", "4.1%", "4.1%", "4.2%", "4.1%"],
      },
    ],
  },
  "Ceramic Mugs": {
    name: "Ceramic Mugs",
    sub: "11oz & 15oz Accent Ceramic Mugs",
    color: "#a855f7",
    change: "+2.4% Steady",
    trend: "steady",
    monthlySales: "~6,200 orders",
    avgPrice: "$12.99 - $18.99",
    competition: "High",
    hotStyle: "Birth Flower Birthstone, Custom Photo Mug",
    keywords: ["birth flower mug", "custom office mug gift", "cute couple accent mugs"],
    recommendedModel: "Ceramic Mug 11oz",
    recommendedModelId: "69",
    insight: "Mugs are a stable year-round staple. Focus on birth flower illustrations or high-contrast office humor text designs to stand out in high-competition listings.",
    lines: [
      {
        name: "Search Volume",
        label: "Search Volume",
        color: "#7c6af7",
        path: "M 50 120 C 115 122, 180 118, 245 123 S 375 120, 440 115",
        areaPath: "M 50 120 C 115 122, 180 118, 245 123 S 375 120, 440 115 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 120 }, { cx: 115, cy: 122 }, { cx: 180, cy: 118 }, { cx: 245, cy: 123 }, { cx: 310, cy: 120 }, { cx: 375, cy: 120 }, { cx: 440, cy: 115 }],
        gradientId: "purple-fade",
        value: "74k queries/mo",
        weeklyValues: ["72k", "73k", "73k", "74k", "74k", "75k", "74k"],
      },
      {
        name: "Active Sellers",
        label: "Active Sellers",
        color: "#3b82f6",
        path: "M 50 90 C 115 92, 180 88, 245 93 S 375 90, 440 85",
        areaPath: "M 50 90 C 115 92, 180 88, 245 93 S 375 90, 440 85 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 90 }, { cx: 115, cy: 92 }, { cx: 180, cy: 88 }, { cx: 245, cy: 93 }, { cx: 310, cy: 90 }, { cx: 375, cy: 90 }, { cx: 440, cy: 85 }],
        gradientId: "blue-fade",
        value: "11.5k shops",
        weeklyValues: ["11.4k", "11.5k", "11.5k", "11.5k", "11.5k", "11.6k", "11.5k"],
      },
      {
        name: "Favorites Rate",
        label: "Favorites Rate",
        color: "#f43f5e",
        path: "M 50 140 C 115 138, 180 135, 245 142 S 375 135, 440 130",
        areaPath: "M 50 140 C 115 138, 180 135, 245 142 S 375 135, 440 130 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 140 }, { cx: 115, cy: 138 }, { cx: 180, cy: 135 }, { cx: 245, cy: 142 }, { cx: 310, cy: 138 }, { cx: 375, cy: 135 }, { cx: 440, cy: 130 }],
        gradientId: "red-fade",
        value: "4.2% fav rate",
        weeklyValues: ["4.0%", "4.1%", "4.1%", "4.2%", "4.2%", "4.3%", "4.2%"],
      },
      {
        name: "Conversion Rate",
        label: "Conversion Rate",
        color: "#22c55e",
        path: "M 50 160 C 115 158, 180 155, 245 162 S 375 155, 440 150",
        areaPath: "M 50 160 C 115 158, 180 155, 245 162 S 375 155, 440 150 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 160 }, { cx: 115, cy: 158 }, { cx: 180, cy: 155 }, { cx: 245, cy: 162 }, { cx: 310, cy: 158 }, { cx: 375, cy: 155 }, { cx: 440, cy: 150 }],
        gradientId: "green-fade",
        value: "2.1% conversion",
        weeklyValues: ["1.9%", "2.0%", "2.0%", "2.1%", "2.1%", "2.2%", "2.1%"],
      },
    ],
  },
  "Phone Cases": {
    name: "Phone Cases",
    sub: "iPhone & Samsung Tough Cases",
    color: "#ef4444",
    change: "-4.8% Down",
    trend: "down",
    monthlySales: "~3,800 orders",
    avgPrice: "$16.00 - $22.00",
    competition: "High",
    hotStyle: "Abstract Cyberpunk Art, Vintage Botanical Sketch",
    keywords: ["cyberpunk phone cover", "tough case iphone 15", "boho wildflower phone case"],
    recommendedModel: "Tough Phone Case",
    recommendedModelId: "phonecase",
    insight: "Phone case demand is currently consolidating. Aesthetic retro designs or high-protection dual-layer cases are preferred over generic patterns.",
    lines: [
      {
        name: "Search Volume",
        label: "Search Volume",
        color: "#7c6af7",
        path: "M 50 70 C 115 85, 180 102, 245 122 S 375 138, 440 155",
        areaPath: "M 50 70 C 115 85, 180 102, 245 122 S 375 138, 440 155 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 70 }, { cx: 115, cy: 85 }, { cx: 180, cy: 102 }, { cx: 245, cy: 122 }, { cx: 310, cy: 138 }, { cx: 375, cy: 140 }, { cx: 440, cy: 155 }],
        gradientId: "purple-fade",
        value: "41k queries/mo",
        weeklyValues: ["65k", "60k", "55k", "50k", "45k", "42k", "41k"],
      },
      {
        name: "Active Sellers",
        label: "Active Sellers",
        color: "#3b82f6",
        path: "M 50 100 C 115 102, 180 98, 245 103 S 375 100, 440 95",
        areaPath: "M 50 100 C 115 102, 180 98, 245 103 S 375 100, 440 95 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 100 }, { cx: 115, cy: 102 }, { cx: 180, cy: 98 }, { cx: 245, cy: 103 }, { cx: 310, cy: 100 }, { cx: 375, cy: 100 }, { cx: 440, cy: 95 }],
        gradientId: "blue-fade",
        value: "9.4k shops",
        weeklyValues: ["9.4k", "9.4k", "9.3k", "9.5k", "9.4k", "9.4k", "9.5k"],
      },
      {
        name: "Favorites Rate",
        label: "Favorites Rate",
        color: "#f43f5e",
        path: "M 50 90 C 115 105, 180 122, 245 142 S 375 158, 440 175",
        areaPath: "M 50 90 C 115 105, 180 122, 245 142 S 375 158, 440 175 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 90 }, { cx: 115, cy: 105 }, { cx: 180, cy: 122 }, { cx: 245, cy: 142 }, { cx: 310, cy: 158 }, { cx: 375, cy: 158 }, { cx: 440, cy: 175 }],
        gradientId: "red-fade",
        value: "3.9% fav rate",
        weeklyValues: ["4.2%", "4.1%", "4.0%", "3.9%", "3.9%", "3.8%", "3.9%"],
      },
      {
        name: "Conversion Rate",
        label: "Conversion Rate",
        color: "#22c55e",
        path: "M 50 110 C 115 125, 180 142, 245 162 S 375 178, 440 190",
        areaPath: "M 50 110 C 115 125, 180 142, 245 162 S 375 178, 440 190 L 440 160 L 50 160 Z",
        points: [{ cx: 50, cy: 110 }, { cx: 115, cy: 125 }, { cx: 180, cy: 142 }, { cx: 245, cy: 162 }, { cx: 310, cy: 178 }, { cx: 375, cy: 180 }, { cx: 440, cy: 190 }],
        gradientId: "green-fade",
        value: "1.8% conversion",
        weeklyValues: ["2.0%", "1.9%", "1.9%", "1.8%", "1.8%", "1.7%", "1.8%"],
      },
    ],
  },
};


const FallbackImage = ({ src, alt }: { src: string, alt: string }) => {
  const [error, setError] = React.useState(false);
  return error ? (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-[#5e5a72]">
      <Package size={16} className="mb-0.5 opacity-50"/>
    </div>
  ) : (
    <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setError(true)} />
  );
};

export default function ProducerDashboardPage() {
  const { t } = useLanguage();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [activeCat, setActiveCat] = useState<CategoryDetail>(categoryDetails["T-Shirts"]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["Search Volume"]);

  const handleSearch = (kw: string) => {
    if (!kw.trim()) return;
    const lowerKw = kw.trim().toLowerCase();
    
    // Predefined lookup
    const existingKey = Object.keys(categoryDetails).find(k => k.toLowerCase() === lowerKw);
    if (existingKey) {
       setActiveCat(categoryDetails[existingKey]);
       return;
    }

    // Dynamic mock generation based on hash
    const hash = lowerKw.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const searchVol = 10 + (hash % 150); // 10k to 160k
    const activeSellers = 1 + (hash % 20); // 1k to 21k
    const favRate = (3 + (hash % 50) / 10).toFixed(1); // 3.0% to 8.0%
    const convRate = (1 + (hash % 30) / 10).toFixed(1); // 1.0% to 4.0%
    
    const baseWeekly = (base: number, volatility: number) => {
      return Array.from({length: 7}, (_, i) => {
        const variation = (Math.sin(hash + i) * volatility);
        return Math.max(1, base + variation);
      });
    };

    const searchVolWeekly = baseWeekly(searchVol, searchVol * 0.2).map(v => Math.round(v) + "k");
    const activeSellersWeekly = baseWeekly(activeSellers, activeSellers * 0.05).map(v => v.toFixed(1) + "k");
    const favRateWeekly = baseWeekly(parseFloat(favRate), 0.5).map(v => v.toFixed(1) + "%");
    const convRateWeekly = baseWeekly(parseFloat(convRate), 0.3).map(v => v.toFixed(1) + "%");

    const newMock: CategoryDetail = {
      name: kw.trim(),
      sub: "Custom Merch",
      color: "#7c6af7",
      change: "+12.4% Up",
      trend: "up",
      monthlySales: "~" + (Math.round((searchVol * parseFloat(convRate)) * 10)).toLocaleString() + " orders",
      avgPrice: "$15.00 - $35.00",
      competition: searchVol > 100 ? "High" : (searchVol > 50 ? "Medium" : "Low"),
      hotStyle: "Trendy, Custom Design",
      keywords: [lowerKw, lowerKw + " gift", "custom " + lowerKw],
      recommendedModel: "Premium " + kw.trim(),
      recommendedModelId: "3",
      insight: `${kw.trim()} is showing steady activity. Focus on unique designs and high-quality mockups to stand out in this niche.`,
      lines: [
        {
          name: "Search Volume",
          label: "Search Volume",
          color: "#7c6af7",
          path: "", areaPath: "", points: [], gradientId: "purple-fade",
          value: searchVol + "k queries/mo",
          weeklyValues: searchVolWeekly,
        },
        {
          name: "Active Sellers",
          label: "Active Sellers",
          color: "#3b82f6",
          path: "", areaPath: "", points: [], gradientId: "blue-fade",
          value: activeSellers.toFixed(1) + "k shops",
          weeklyValues: activeSellersWeekly,
        },
        {
          name: "Favorites Rate",
          label: "Favorites Rate",
          color: "#f43f5e",
          path: "", areaPath: "", points: [], gradientId: "red-fade",
          value: favRate + "% fav rate",
          weeklyValues: favRateWeekly,
        },
        {
          name: "Conversion Rate",
          label: "Conversion Rate",
          color: "#22c55e",
          path: "", areaPath: "", points: [], gradientId: "green-fade",
          value: convRate + "% conversion",
          weeklyValues: convRateWeekly,
        }
      ]
    };
    
    setActiveCat(newMock);
  };
  const activeLines = activeCat.lines.filter(l => selectedMetrics.includes(l.name));
  if (activeLines.length === 0) activeLines.push(activeCat.lines[0]);
  
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartData = days.map((day, i) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataObj: any = { name: day };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalString: any = {};
    activeLines.forEach(line => {
       const rawValue = line.weeklyValues[i];
       const numVal = parseFloat(rawValue.replace(/[^0-9.]/g, ''));
       dataObj[line.name] = numVal;
       originalString[line.name] = rawValue;
    });
    dataObj.originalString = originalString;
    return dataObj;
  });

  const [apiKey] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("printify_api_key") || "";
    }
    return "";
  });

  const [totalBlueprints] = useState(() => {
    if (typeof window !== "undefined" && localStorage.getItem("printify_api_key")) {
      return 1430;
    }
    return 987;
  });

  const [designedCount] = useState(() => {
    if (typeof window !== "undefined" && localStorage.getItem("printify_api_key")) {
      return 284;
    }
    return 148;
  });

  const [draftCount] = useState(() => {
    if (typeof window !== "undefined" && localStorage.getItem("printify_api_key")) {
      return 47;
    }
    return 36;
  });

  const [publishedCount, setPublishedCount] = useState(() => {
    if (typeof window !== "undefined" && localStorage.getItem("printify_api_key")) {
      return 118;
    }
    return 64;
  });

  interface ShopData {
    shop_name: string;
    review_average: number | string;
    review_count: number;
    listing_active_count: number;
    transaction_sold_count: number;
  }

  const [shopData, setShopData] = useState<ShopData | null>(null);

  useEffect(() => {
    fetch('/api/etsy/shop')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setShopData(data);
          setPublishedCount(data.listing_active_count || 0);
        }
      })
      .catch(console.error);
  }, []);

  interface ResearchedProduct {
    id: string;
    title: string;
    shopName: string;
    price: string;
    opportunityScore: number;
    url: string;
    imageUrl: string;
  }

  const [researchHistory, setResearchHistory] = useState<ResearchedProduct[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const hist = JSON.parse(localStorage.getItem("researched_products_history") || "[]");
        setTimeout(() => {
          setResearchHistory(hist);
        }, 0);
      } catch {
        // ignore JSON parse errors
      }
    }
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fade-in">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f1f0ff] to-[#a09cb0] bg-clip-text text-transparent">
            {t("dashboard.producer")}
          </h1>
          <p className="text-sm mt-0.5 text-[#a09cb0]">
            {t("dashboard.producerDesc")}
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-white/[0.08] backdrop-blur-md bg-white/[0.02]"
        >
          <div className={`w-1.5 h-1.5 rounded-full ${shopData ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-red-500'} `} />
          <span className="text-[#a09cb0]">
            {t("dashboard.connection")} <span className="text-white font-semibold">{shopData ? t("dashboard.liveApi") : t("dashboard.sandbox")}</span>
          </span>
        </div>
      </div>

      {/* Üretici İstatistikleri Panel (Stats Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Discovered Blueprints */}
        <div className="group rounded-xl p-5 border border-white/[0.07] bg-[#16161e] hover:border-white/[0.14] transition-all hover:-translate-y-0.5 cursor-default">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a09cb0]">
              {t("dashboard.discoveredBlueprints")}
            </span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-400 group-hover:scale-105 transition-transform">
              <Package size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-extrabold tracking-tight text-white">
                {totalBlueprints}
              </span>
              <span className="text-[10px] text-[#5e5a72] block mt-0.5">{t("dashboard.catalogBlueprints")}</span>
            </div>
            <div className="text-[10px] font-semibold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30 text-xs">
              {t("dashboard.syncActive")}
            </div>
          </div>
        </div>

        {/* Card 2: Rendered Mockups */}
        <div className="group rounded-xl p-5 border border-white/[0.07] bg-[#16161e] hover:border-white/[0.14] transition-all hover:-translate-y-0.5 cursor-default">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a09cb0]">
              {t("dashboard.renderedMockups")}
            </span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-400 group-hover:scale-105 transition-transform">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-extrabold tracking-tight text-white">
                {designedCount}
              </span>
              <span className="text-[10px] text-[#5e5a72] block mt-0.5">{t("dashboard.mockupRenderFiles")}</span>
            </div>
            <div className="text-[10px] font-semibold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30 text-xs">
              {t("dashboard.weeklyGrowth")}
            </div>
          </div>
        </div>

        {/* Card 3: Draft Blueprints */}
        <div className="group rounded-xl p-5 border border-white/[0.07] bg-[#16161e] hover:border-white/[0.14] transition-all hover:-translate-y-0.5 cursor-default">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a09cb0]">
              {t("dashboard.draftBlueprints")}
            </span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
              <Clock size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-extrabold tracking-tight text-white">
                {draftCount}
              </span>
              <span className="text-[10px] text-[#5e5a72] block mt-0.5">{t("dashboard.notSyncEtsy")}</span>
            </div>
            <div className="text-[10px] font-semibold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 text-xs">
              {t("dashboard.pendingSync")}
            </div>
          </div>
        </div>

        {/* Card 4: Active Listings */}
        <div className="group rounded-xl p-5 border border-white/[0.07] bg-[#16161e] hover:border-white/[0.14] transition-all hover:-translate-y-0.5 cursor-default">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a09cb0]">
              {t("dashboard.activeListings")}
            </span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
              <Layers size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-extrabold tracking-tight text-white">
                {publishedCount}
              </span>
              <span className="text-[10px] text-[#5e5a72] block mt-0.5">{t("dashboard.activeEtsyListings")}</span>
            </div>
            <div className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 text-xs">
              {t("dashboard.liveStores")}
            </div>
          </div>
        </div>

      </div>

      {/* Etsy Category Sales Volume Trends Chart - Full Width */}
      <div
        className="rounded-xl border border-white/[0.07] p-5 space-y-5 backdrop-blur-md"
        style={{ background: "var(--bg-card)" }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>{t("dashboard.categorySales")}</span>
            </h2>
            <p className="text-[11px] text-[#a09cb0] mt-0.5">{t("dashboard.categorySalesDesc")}</p>
          </div>

          {/* Keyword Search Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(searchKeyword); }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e5a72]" />
              <input 
                type="text" 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder={t("dashboard.searchPlaceholder")}
                className="bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50 w-64 transition-colors placeholder:text-[#5e5a72]"
              />
            </div>
            <button 
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
            >
              {t("dashboard.analyze")}
            </button>
          </form>
        </div>

        {/* 2-Column Grid: SVG Line Chart (Left) + Niche Insights (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Chart Container (2/3 width) */}
          <div className="lg:col-span-2 flex flex-col justify-between bg-black/10 rounded-xl border border-white/[0.03] p-4 relative">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
              <span className="text-[10px] text-[#5e5a72] font-semibold">{t("dashboard.weeklyProjection")}</span>
              
              {/* Interactive metric selectors */}
              <div className="flex flex-wrap gap-2 text-[9px] text-[#a09cb0]">
                {activeCat.lines.map((l) => {
                  const isHoveredOrClicked = selectedMetrics.includes(l.name);
                  return (
                    <button
                      key={l.name}
                      
                      onClick={() => {
                          if (selectedMetrics.includes(l.name)) {
                            if (selectedMetrics.length > 1) {
                              setSelectedMetrics(selectedMetrics.filter(m => m !== l.name));
                            }
                          } else {
                            setSelectedMetrics([...selectedMetrics, l.name]);
                          }
                        }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        isHoveredOrClicked
                          ? "bg-white/10 border-white/20 text-white scale-[1.02] shadow-[0_2px_8px_rgba(255,255,255,0.05)] font-bold"
                          : "border-white/[0.04] bg-white/[0.01] hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: l.color }} />
                      <span className="font-semibold">{l.name}</span>
                      <span className="opacity-60 text-[8px] font-mono">({l.value})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 25, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    {activeLines.map(line => (
                      <linearGradient key={line.name} id={`grad-${line.name.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={line.color} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={line.color} stopOpacity={0}/>
                      </linearGradient>
                    ))}
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
                    width={40}
                    tickFormatter={(value) => {
                      if (activeLines[0].value.includes('%')) return `${value}%`;
                      if (activeLines[0].value.includes('k')) return `${value}k`;
                      return value.toString();
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#16161e', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 14px' }}
                    itemStyle={{ fontWeight: 'bold', fontSize: '13px' }}
                    labelStyle={{ color: '#a09cb0', fontWeight: 'bold', marginBottom: '6px', fontSize: '11px', textTransform: 'uppercase' }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any, name: any, props: any) => {
                      return [props.payload.originalString[name], name];
                    }}
                  />
                  {activeLines.map(line => (
                    <Area 
                      key={line.name}
                      type="monotone" 
                      dataKey={line.name} 
                      stroke={line.color} 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill={`url(#grad-${line.name.replace(/\s+/g, '-')})`}
                      activeDot={{ r: 7, strokeWidth: 2, stroke: '#16161e' }}
                      animationDuration={600}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Niche Insights Panel (1/3 width) */}
          <div className="flex flex-col justify-between space-y-4 bg-black/15 p-4 rounded-xl border border-white/[0.04]">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{t("dashboard.marketIntelligence")}</span>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{activeCat.name} {t("dashboard.nicheDetails")}</span>
              </h3>
              <p className="text-xs text-[#a09cb0] leading-relaxed">
                {activeCat.insight}
              </p>
            </div>

            {/* Market Statistics Grid (Satıcı Sayısı, Search Volume, Beğeni & Conversion Rate) */}
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Active Sellers Ratio */}
              <div className="bg-black/25 p-2.5 rounded-lg border border-white/[0.03] space-y-1">
                <div className="flex items-center gap-1 text-[9px] text-[#5e5a72] font-semibold uppercase">
                  <Users className="w-3 h-3 text-purple-400" />
                  <span>{t("dashboard.activeSellers")}</span>
                </div>
                <div className="text-[11px] font-bold text-white">
                  {activeCat.lines.find(l => l.name === "Active Sellers")?.value}
                </div>
              </div>

              {/* Search Rate */}
              <div className="bg-black/25 p-2.5 rounded-lg border border-white/[0.03] space-y-1">
                <div className="flex items-center gap-1 text-[9px] text-[#5e5a72] font-semibold uppercase">
                  <Search className="w-3 h-3 text-blue-400" />
                  <span>{t("dashboard.searchVolume")}</span>
                </div>
                <div className="text-[11px] font-bold text-white">
                  {activeCat.lines.find(l => l.name === "Search Volume")?.value}
                </div>
              </div>

              {/* Favorite Rate */}
              <div className="bg-black/25 p-2.5 rounded-lg border border-white/[0.03] space-y-1">
                <div className="flex items-center gap-1 text-[9px] text-[#5e5a72] font-semibold uppercase">
                  <Heart className="w-3 h-3 text-pink-400" />
                  <span>{t("dashboard.favoritesRate")}</span>
                </div>
                <div className="text-[11px] font-bold text-white">
                  {activeCat.lines.find(l => l.name === "Favorites Rate")?.value}
                </div>
              </div>

              {/* Purchase Conversion Rate */}
              <div className="bg-black/25 p-2.5 rounded-lg border border-white/[0.03] space-y-1">
                <div className="flex items-center gap-1 text-[9px] text-[#5e5a72] font-semibold uppercase">
                  <ShoppingBag className="w-3 h-3 text-emerald-400" />
                  <span>{t("dashboard.conversionRate")}</span>
                </div>
                <div className="text-[11px] font-bold text-white">
                  {activeCat.lines.find(l => l.name === "Conversion Rate")?.value}
                </div>
              </div>

            </div>

            {/* Metrics Checklist Stack */}
            <div className="space-y-1.5 bg-black/10 p-2.5 rounded-lg border border-white/[0.02]">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#5e5a72]">{t("dashboard.monthlyOrderVol")}</span>
                <span className="font-semibold text-white">{activeCat.monthlySales}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-[#5e5a72]">{t("dashboard.avgRetailPrice")}</span>
                <span className="font-semibold text-white">{activeCat.avgPrice}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-[#5e5a72]">{t("dashboard.etsyCompetition")}</span>
                <span className={`font-semibold ${
                  activeCat.competition === "Low" ? "text-emerald-400" : "text-amber-400"
                }`}>
                  {activeCat.competition}
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-[#5e5a72]">{t("dashboard.bestSellingStyles")}</span>
                <span className="font-semibold text-purple-300 truncate max-w-[140px]" title={activeCat.hotStyle}>
                  {activeCat.hotStyle}
                </span>
              </div>
            </div>

            {/* Suggested Etsy Tags */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-[#5e5a72] uppercase tracking-wider">{t("dashboard.suggestedSeo")}</span>
              <div className="flex flex-wrap gap-1.5">
                {activeCat.keywords.map((kw, i) => (
                  <span key={i} className="text-[10px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] px-2 py-0.5 rounded text-[#a09cb0] transition-colors cursor-default">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Start Designing Action Button */}
            <Link
              href={`/product-research?q=${encodeURIComponent(activeCat.name)}`}
              className="w-full py-2 bg-gradient-to-r from-[#7c6af7] to-[#a855f7] hover:brightness-110 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(124,106,247,0.25)] transition-all cursor-pointer animate-pulse"
            >
              <span>{t("dashboard.researchProducts").replace("Products", activeCat.name + " Products")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>

      {/* Recent Product Analysis History */}
      <div
        className="rounded-xl overflow-hidden border border-white/[0.07]"
        style={{ background: "var(--bg-card)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-purple-400" />
            <span className="text-sm font-bold text-white">
              {t("dashboard.recentHistory")}
            </span>
          </div>
          
          <Link
            href="/product-research"
            className="flex items-center gap-1 text-xs font-bold transition-colors text-purple-400 hover:text-purple-300"
          >
            <span>{t("dashboard.openResearch")}</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(255, 255, 255, 0.01)" }}>
                {[t("dashboard.colProduct"), t("dashboard.colShop"), t("dashboard.colPrice"), t("dashboard.colScore"), t("dashboard.colAction")].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#5e5a72]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {researchHistory.length > 0 ? researchHistory.map((p) => (
                <tr
                  key={p.id}
                  className="transition-all hover:bg-white/[0.01]"
                >
                  <td className="px-5 py-4 font-semibold text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center">
                      <FallbackImage src={p.imageUrl} alt={p.title} />
                    </div>
                    <span className="truncate max-w-[280px]">{p.title}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 text-xs rounded-lg bg-white/[0.03] border border-white/[0.06] font-semibold text-[#a09cb0]">
                      {p.shopName}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-white">
                    {p.price}
                  </td>
                  <td className="px-5 py-4 font-bold text-purple-300">
                    {p.opportunityScore}/100
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-1.5 w-max rounded-lg text-xs font-bold text-white bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500 hover:text-white transition-all cursor-pointer"
                    >
                      <ArrowRight size={14} />
                      <span>{t("dashboard.viewEtsy")}</span>
                    </a>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#5e5a72] text-xs">
                    {t("dashboard.noHistory")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
