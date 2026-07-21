"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Sparkles,
  TrendingUp,
  Loader2,
  X,
  Zap,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  views: number;
  favs: number;
  opportunityScore: number;
  isBestseller: boolean;
  shopName: string;
  imageUrl: string;
  url?: string;
}

const mockProducts: Product[] = [
  {
    id: "prod_1",
    title: "Cozy Autumn Sweatshirt - Unisex Heavy Blend Crewneck Sweatshirt",
    category: "sweat",
    price: 34.90,
    views: 3420,
    favs: 890,
    opportunityScore: 96,
    isBestseller: true,
    shopName: "CozyVibesApparel",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "prod_2",
    title: "Custom Birth Flower Mug - Personalized Ceramic Coffee Mug Gift",
    category: "mug",
    price: 16.50,
    views: 4120,
    favs: 920,
    opportunityScore: 94,
    isBestseller: true,
    shopName: "PetalAndClay",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "prod_3",
    title: "14K Gold Personalized Name Necklace - Custom Dainty Jewelry for Her",
    category: "jewelry",
    price: 48.00,
    views: 2890,
    favs: 710,
    opportunityScore: 92,
    isBestseller: true,
    shopName: "AureliaStudio",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "prod_4",
    title: "Organic Cotton Canvas Tote Bag - Aesthetic Reusable Grocery Bag",
    category: "bag",
    price: 19.99,
    views: 1450,
    favs: 310,
    opportunityScore: 88,
    isBestseller: false,
    shopName: "EarthBoundGoods",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "prod_5",
    title: "Retro Wildflower T-Shirt - Aesthetic Vintage Graphic Tee Shirt",
    category: "t-shirt",
    price: 24.95,
    views: 2150,
    favs: 640,
    opportunityScore: 91,
    isBestseller: false,
    shopName: "WildFlowerPrints",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "prod_6",
    title: "Minimalist Wooden Jewelry Box - Custom Engraved Organizer Chest",
    category: "jewelry",
    price: 39.00,
    views: 1250,
    favs: 410,
    opportunityScore: 89,
    isBestseller: false,
    shopName: "TimberCraftCo",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "prod_7",
    title: "Oversized Acid Wash Hoodie - Premium Streetwear Graphic Sweatshirt",
    category: "sweat",
    price: 59.99,
    views: 1800,
    favs: 530,
    opportunityScore: 86,
    isBestseller: false,
    shopName: "UrbanPrintLabs",
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "prod_8",
    title: "Personalized Enamel Camping Mug - Retro Outdoor Coffee Cup",
    category: "mug",
    price: 15.99,
    views: 980,
    favs: 310,
    opportunityScore: 85,
    isBestseller: false,
    shopName: "CampfireStories",
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
  },
];

export default function ProductResearchPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [analyzedProduct, setAnalyzedProduct] = useState<Product | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear polling interval on component unmount
  useEffect(() => {
    const currentPollRef = pollIntervalRef.current;
    return () => {
      if (currentPollRef) {
        clearInterval(currentPollRef);
      }
    };
  }, []);

  const performSearch = async (kw: string) => {
    if (!kw.trim()) return;

    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    setIsLoading(true);
    setError(null);
    setSelectedProduct(null);
    setLoadingStatus("Fetching live data from Etsy servers...");

    try {
      const response = await fetch("/api/research/etsy-native", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: kw }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to Etsy Research API");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setProducts(data.products || []);
      setActiveQuery(kw);
      setIsLoading(false);
      setLoadingStatus("");
    } catch (err: unknown) {
      console.error("Search error:", err);
      const msg = err instanceof Error ? err.message : "Temporary connection issue, please try again";
      setError(msg.includes("Failed") || msg.includes("Etsy Research") ? "Temporary connection issue, please try again" : msg);
      setIsLoading(false);
      setLoadingStatus("");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q) {
        setTimeout(() => {
          setSearchTerm(q);
          performSearch(q);
        }, 0);
      }
    }
  }, []);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  const saveToHistory = (product: Product) => {
    if (typeof window === "undefined") return;
    try {
      const hist = JSON.parse(localStorage.getItem("researched_products_history") || "[]");
      const newHist = [product, ...hist.filter((p: Product) => p.id !== product.id)].slice(0, 10);
      localStorage.setItem("researched_products_history", JSON.stringify(newHist));
    } catch {
      // Ignore local storage errors
    }
  };

  const handleCardClick = (product: Product) => {
    if (selectedProduct?.id === product.id) {
      setSelectedProduct(null);
    } else {
      setSelectedProduct(product);
      saveToHistory(product);
    }
  };

  const handleResetSearch = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    setSearchTerm("");
    setActiveQuery("");
    setProducts(mockProducts);
    setError(null);
    setSelectedProduct(null);
    setLoadingStatus("");
    setIsLoading(false);
  };

  const handleAIAnalyze = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAnalysisLoading(true);
    // Simulate detailed AI analytics extraction
    setTimeout(() => {
      setAnalyzedProduct(product);
      setAnalysisLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 relative animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              AI Tools
            </span>
            <span className="text-xs text-[#a09cb0]">Premium Suite</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f1f0ff] to-[#a09cb0] bg-clip-text text-transparent">
            {t("research.title")}
          </h1>
          <p className="text-sm mt-1 text-[#a09cb0]">
            {t("research.subtitle")}
          </p>
        </div>
        
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.08] backdrop-blur-md bg-white/[0.02]"
        >
          <div className="w-2 h-2 rounded-full bg-[#7c6af7] shadow-[0_0_8px_#7c6af7]" />
          <span className="text-xs font-semibold text-[#f1f0ff]">{t("research.premiumSuite")}</span>
        </div>
      </div>

      {/* Search & Filters Section */}
      <div 
        className="rounded-2xl p-6 border border-white/[0.07] backdrop-blur-xl relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(22, 22, 30, 0.7) 0%, rgba(13, 13, 18, 0.8) 100%)",
          boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)"
        }}
      >
        <div className="absolute top-0 right-0 w-80 h-32 bg-purple-600/5 blur-[80px] rounded-full pointer-events-none" />
        
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/80 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("research.searchPlaceholder")}
                className="w-full h-12 pl-11 pr-4 bg-black/30 border border-white/[0.08] focus:border-purple-500/80 rounded-xl text-sm text-[#f1f0ff] placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all backdrop-blur-sm"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="h-12 px-6 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-white shrink-0"
              style={{
                background: "linear-gradient(135deg, #7c6af7 0%, #a855f7 100%)",
                boxShadow: "0 4px 20px rgba(124,106,247,0.25)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(124,106,247,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,106,247,0.25)";
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t("research.analyzing")}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t("research.analyzeKeyword")}</span>
                </>
              )}
            </button>
          </div>

          {/* Badges Container */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-[#5e5a72] font-medium mr-1">{t("research.activeCriteria")}</span>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[#a09cb0]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-white/90">{t("research.etsyOnly")}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[#a09cb0]">
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              <span>{t("research.period")} <span className="font-semibold text-white/90">{t("research.last24h")}</span></span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[#a09cb0]">
              <span className="text-[10px] uppercase font-bold text-purple-400 px-1 bg-purple-500/10 rounded">{t("research.limit")}</span>
              <span>{t("research.premiumProducts")}</span>
            </div>
            
            {activeQuery && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-colors ml-auto cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t("research.resetFilter")} &quot;{activeQuery}&quot;)</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 backdrop-blur-md text-red-400 flex items-center justify-between text-sm animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-base" aria-hidden="true">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="p-1 hover:bg-white/5 rounded-lg text-white/40 hover:text-white/80 transition-colors cursor-pointer border border-transparent hover:border-white/[0.05]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid Results */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span>{t("research.premiumKeywordResults")}</span>
            {!isLoading && (
              <span className="text-xs font-normal text-[#a09cb0] bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
                {products.length} {t("research.items")}
              </span>
            )}
          </h2>
          <div className="text-xs text-[#5e5a72] flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            <span>{t("research.clickCards")}</span>
          </div>
        </div>

        {isLoading ? (
          /* Skeleton Loader Grid with status message */
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl border border-purple-500/15 bg-purple-500/5 text-purple-300 text-xs animate-pulse max-w-lg mx-auto backdrop-blur-md">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span className="font-semibold text-center">{loadingStatus}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/[0.05] p-4 space-y-4 animate-pulse bg-[#16161e]"
                >
                  <div className="aspect-square bg-white/[0.04] rounded-lg w-full" />
                  <div className="space-y-3">
                    <div className="h-3 bg-white/[0.04] rounded w-1/4" />
                    <div className="h-4 bg-white/[0.04] rounded w-5/6" />
                    <div className="h-4 bg-white/[0.04] rounded w-1/2" />
                    <div className="h-8 bg-white/[0.04] rounded w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          /* Empty Search State */
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4 text-purple-400 border border-purple-500/20">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">{t("research.noProducts")}</h3>
            <p className="text-sm mt-1 max-w-sm mx-auto text-[#a09cb0]">
              {t("research.noMatches")} &quot;{activeQuery}&quot;. {t("research.tryTyping")}
            </p>
            <button
              onClick={handleResetSearch}
              className="mt-4 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 hover:border-purple-500/40 text-purple-300 font-semibold text-sm rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t("research.clearFilter")}</span>
            </button>
          </div>
        ) : (
          /* Actual Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const isSelected = selectedProduct?.id === product.id;
              return (
                <div
                  key={product.id}
                  onClick={() => handleCardClick(product)}
                  className={`group relative rounded-xl border p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? "border-[#7c6af7] bg-[#161625] shadow-[0_0_20px_rgba(124,106,247,0.15)] ring-2 ring-[#7c6af7]/50"
                      : "border-white/[0.07] bg-[#16161e] hover:border-white/[0.14] hover:bg-[#1a1a24] hover:translate-y-[-2px]"
                  }`}
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-neutral-900 border border-white/[0.04]">
                      {/* Product Image */}
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        unoptimized={false}
                      />
                      
                      {/* Bestseller Badge */}
                      {product.isBestseller && (
                        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-[#7c6af7] to-[#a855f7] text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md shadow-lg border border-white/10">
                          Bestseller
                        </div>
                      )}

                      {/* Opportunity Score Badge */}
                      <div className="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-md">
                        {t("research.opportunity")} <span className="text-purple-400 font-bold">{product.opportunityScore}/100</span>
                      </div>
                    </div>

                    {/* Shop Name & Link */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-purple-400 text-xs font-semibold hover:underline truncate">
                        {product.url ? (
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {product.shopName}
                          </a>
                        ) : (
                          product.shopName
                        )}
                      </span>
                      {product.url && (
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#5e5a72] hover:text-purple-400 transition-colors cursor-pointer"
                          title="View on Etsy"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-medium leading-snug line-clamp-2 text-[#f1f0ff] mb-2 min-h-[40px] group-hover:text-purple-300/90 transition-colors">
                      {product.title}
                    </h3>

                    {/* Price */}
                    <div className="text-lg font-bold text-white mb-3">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>

                  <div>
                    {/* Live Metrics */}
                    <div className="grid grid-cols-2 gap-2 bg-black/25 border border-white/[0.04] rounded-lg p-2 text-[11px] text-[#a09cb0] mb-4">
                      <div className="flex items-center gap-1">
                        <span aria-hidden="true">🔥</span>
                        <span className="truncate">
                          {t("research.views24h")} <span className="font-semibold text-white">{product.views}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 border-l border-white/[0.06] pl-2">
                        <span aria-hidden="true">💖</span>
                        <span className="truncate">
                          {t("research.favs24h")} <span className="font-semibold text-white">{product.favs}</span>
                        </span>
                      </div>
                    </div>

                    {/* AI Button */}
                    <button
                      type="button"
                      onClick={(e) => handleAIAnalyze(product, e)}
                      className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-white transition-all duration-300 flex items-center justify-center gap-1.5 relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(124,106,247,0.35)] cursor-pointer"
                      style={{
                        background: "linear-gradient(135deg, #7c6af7 0%, #8c7bf7 100%)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = "brightness(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = "brightness(1)";
                      }}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{t("research.aiAnalyzeDesign")}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Banner */}
      {selectedProduct && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl animate-slide-up">
          <div 
            className="flex items-center justify-between gap-4 p-3 md:p-4 rounded-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            style={{
              background: "linear-gradient(145deg, rgba(20, 20, 28, 0.85) 0%, rgba(10, 10, 15, 0.9) 100%)",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black/40">
                <Image
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.title}
                  fill
                  className="object-cover"
                  unoptimized={false}
                />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">
                  {t("research.selectedItem")}
                </div>
                <div className="text-xs md:text-sm font-semibold text-white truncate max-w-[180px] sm:max-w-[280px] md:max-w-[340px]">
                  {selectedProduct.title}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleAIAnalyze(selectedProduct)}
                disabled={analysisLoading}
                className="bg-gradient-to-r from-[#7c6af7] to-[#a855f7] text-white hover:brightness-110 font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 shadow-[0_4px_12px_rgba(124,106,247,0.3)] cursor-pointer"
              >
                {analysisLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>{t("research.nextStepAi")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 text-white/40 hover:text-white/80 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/[0.05]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Detailed Analysis Modal Backdrop / Overlay */}
      {analyzedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-fast">
          <div 
            className="w-full max-w-lg rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden text-left"
            style={{
              background: "linear-gradient(145deg, #161622 0%, #0d0d14 100%)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#7c6af7] to-transparent" />
            
            <button
              onClick={() => setAnalyzedProduct(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-4 items-start mb-5">
              <div className="relative w-16 h-16 shrink-0 rounded-xl border border-white/10 overflow-hidden">
                <Image
                  src={analyzedProduct.imageUrl}
                  alt={analyzedProduct.title}
                  fill
                  className="object-cover"
                  unoptimized={false}
                />
              </div>
              <div>
                <span className="text-xs text-purple-400 font-semibold">{analyzedProduct.shopName}</span>
                <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight">
                  {analyzedProduct.title}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold text-[#a09cb0] tracking-wider border-b border-white/[0.06] pb-1.5">
                {t("research.aiAnalyticsRecommendations")}
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04]">
                  <p className="text-[#a09cb0] mb-0.5">{t("research.opportunityIndex")}</p>
                  <p className="text-lg font-bold text-emerald-400">{analyzedProduct.opportunityScore}/100</p>
                </div>
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04]">
                  <p className="text-[#a09cb0] mb-0.5">{t("research.demandRating")}</p>
                  <p className="text-lg font-bold text-purple-400">{t("research.extremelyHigh")}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#a09cb0]">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <p>
                    <strong className="text-white">{t("research.trend")}</strong> {t("research.highConv")} {analyzedProduct.category || "niche"} {t("research.sector")}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <p>
                    <strong className="text-white">{t("research.designTip")}</strong> {t("research.expandCategory")}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400">✦</span>
                  <p>
                    <strong className="text-white">{t("research.seoKeywords")}</strong> {t("research.useHighVol")} {analyzedProduct.category || "item"}&quot; {t("research.increaseTraffic")}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {analyzedProduct.url && (
                  <a
                    href={analyzedProduct.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 border border-white/10 hover:bg-white/5 transition-all text-xs font-semibold text-center rounded-xl flex items-center justify-center gap-1.5 text-white"
                  >
                    <span>{t("research.viewListing")}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                
                <button
                  onClick={() => setAnalyzedProduct(null)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#7c6af7] to-[#a855f7] hover:brightness-110 transition-all font-bold text-xs text-white rounded-xl flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(124,106,247,0.3)]"
                >
                  <span>{t("research.generateDesigns")}</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
