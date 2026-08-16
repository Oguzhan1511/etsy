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
  Copy,
  Tags,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  views: number;
  favs: number;
  estimatedSales24h: number;
  opportunityScore: number;
  isBestseller: boolean;
  shopName: string;
  imageUrl: string;
  url?: string;
  tags?: string[];
}

export default function ProductResearchPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [analyzedProduct, setAnalyzedProduct] = useState<Product | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [historyProducts, setHistoryProducts] = useState<Product[]>([]);
  const [copyToast, setCopyToast] = useState<{message: string, type: 'title' | 'tags'} | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const router = useRouter();

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
    setLoadingStatus(t("research.analyzing") || "Yapay zeka analiz motoru başlatılıyor...");

    try {
      const response = await fetch("/api/research/etsy-native", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: kw }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Sunucu yanıt vermedi (API Error)");
      }

      if (!response.ok) {
        throw new Error(data?.error || "Sunucudan beklenmeyen bir hata döndü");
      }

      if (data.error) {
        throw new Error(data.error);
      }
      
      setProducts(data.products || []);
      setActiveQuery(kw);
      setIsLoading(false);
      setLoadingStatus("");

    } catch (err: unknown) {
      console.error("Search error:", err);
      const msg = err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu";
      setError(msg);
      setIsLoading(false);
      setLoadingStatus("");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const hist = JSON.parse(localStorage.getItem("researched_products_history") || "[]");
        setHistoryProducts(hist);
      } catch {}

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
      setHistoryProducts(newHist);
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
    setProducts([]);
    setError(null);
    setSelectedProduct(null);
    setLoadingStatus("");
    setIsLoading(false);
  };

  const handleAIAnalyze = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    saveToHistory(product);
    setAnalysisLoading(true);
    // Simulate detailed AI analytics extraction
    setTimeout(() => {
      setAnalyzedProduct(product);
      setAnalysisLoading(false);
    }, 1500);
  };

  const showToast = (message: string, type: 'title' | 'tags') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setCopyToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setCopyToast(null);
    }, 2500);
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
            <span className="text-xs text-secondary">Premium Suite</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f1f0ff] to-[#a09cb0] bg-clip-text text-transparent">
            {t("research.title")}
          </h1>
          <p className="text-sm mt-1 text-secondary">
            {t("research.subtitle")}
          </p>
        </div>
        
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border backdrop-blur-md bg-white/[0.02]"
        >
          <div className="w-2 h-2 rounded-full bg-[#7c6af7] shadow-[0_0_8px_#7c6af7]" />
          <span className="text-xs font-semibold text-foreground">{t("research.premiumSuite")}</span>
        </div>
      </div>

      {/* Search & Filters Section */}
      <div 
        className="rounded-2xl p-6 border border-border backdrop-blur-xl relative overflow-hidden"
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
                className="w-full h-12 pl-11 pr-4 bg-black/30 border border-border focus:border-purple-500/80 rounded-xl text-sm text-foreground placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all backdrop-blur-sm"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="h-12 px-6 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-foreground shrink-0"
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
            <span className="text-muted font-medium mr-1">{t("research.activeCriteria")}</span>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-white/[0.02] text-secondary">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-foreground/90">{t("research.etsyOnly")}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-white/[0.02] text-secondary">
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              <span>{t("research.period")} <span className="font-semibold text-foreground/90">{t("research.last24h")}</span></span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-white/[0.02] text-secondary">
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
            className="p-1 hover:bg-white/5 rounded-lg text-foreground/40 hover:text-foreground/80 transition-colors cursor-pointer border border-transparent hover:border-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid Results */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>{t("research.premiumKeywordResults")}</span>
            {!isLoading && (
              <span className="text-xs font-normal text-secondary bg-white/[0.04] border border-border px-2 py-0.5 rounded-full">
                {products.length} {t("research.items")}
              </span>
            )}
          </h2>
          <div className="text-xs text-muted flex items-center gap-1">
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
                  className="rounded-xl border border-border p-4 space-y-4 animate-pulse bg-card"
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
          /* Empty / Initial State */
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-white/[0.01]">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4 text-purple-400 border border-purple-500/20">
              <Search className="w-6 h-6" />
            </div>
            {activeQuery ? (
              <>
                <h3 className="text-lg font-semibold text-foreground">{t("research.noProducts")}</h3>
                <p className="text-sm mt-1 max-w-sm mx-auto text-secondary">
                  {t("research.noMatches")} &quot;{activeQuery}&quot;. {t("research.tryTyping")}
                </p>
                <button
                  onClick={handleResetSearch}
                  className="mt-4 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 hover:border-purple-500/40 text-purple-300 font-semibold text-sm rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t("research.clearFilter")}</span>
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-foreground">Etsy Canlı Pazar Analizi</h3>
                <p className="text-sm mt-1 max-w-md mx-auto text-secondary">
                  Etsy üzerindeki trend ürünleri, tahmini 24 saatlik satışları ve fırsat skorlarını incelemek için yukarıdaki arama çubuğuna bir ürün veya niş kelimesi yazıp analizi başlatın.
                </p>
              </>
            )}
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
                      : "border-border bg-card hover:border-border-hover hover:bg-[#1a1a24] hover:translate-y-[-2px]"
                  }`}
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-neutral-900 border border-border">
                      {/* Product Image */}
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        unoptimized={false}
                      />
                      
                      {/* Etsy Badges Area */}
                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 items-start">
                        {product.isBestseller && (
                          <div className="bg-[#FBE88C] text-[#222222] text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md border border-[#FBE88C] flex items-center gap-1 leading-tight tracking-tight shadow-black/20">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            Bestseller
                          </div>
                        )}
                        {(product.estimatedSales24h > 0 || product.favs > 100) && (
                          <div className="bg-[#f0f0f0] text-[#222222] text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-md border border-white flex items-center shadow-black/20">
                            In {Math.min(20, Math.max(3, (product.estimatedSales24h * 5) + (product.favs > 1000 ? 10 : 0)))}+ carts
                          </div>
                        )}
                      </div>

                      {/* Opportunity Score Badge */}
                      <div className="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur-md border border-border text-foreground text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-md">
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
                            onClick={(e) => {
                              e.stopPropagation();
                              saveToHistory(product);
                            }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            saveToHistory(product);
                          }}
                          className="text-muted hover:text-purple-400 transition-colors cursor-pointer"
                          title="View on Etsy"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-medium leading-snug line-clamp-2 text-foreground mb-2 min-h-[40px] group-hover:text-purple-300/90 transition-colors">
                      {product.title}
                    </h3>

                    {/* Price */}
                    <div className="text-lg font-bold text-foreground mb-3">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>

                  <div>
                    {/* Live Metrics */}
                    <div className="grid grid-cols-2 gap-2 bg-black/25 border border-border rounded-lg p-2 text-[11px] text-secondary mb-4">
                      <div className="flex items-center gap-1">
                        <span aria-hidden="true" className="text-emerald-400">💰</span>
                        <span className="truncate">
                          {t("24h Sales:") || "24h Satış:"} <span className="font-bold text-emerald-400">{product.estimatedSales24h || 0}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 border-l border-border pl-2">
                        <span aria-hidden="true">🔥</span>
                        <span className="truncate">
                          {t("Score:") || "Skor:"} <span className="font-semibold text-purple-400">{product.opportunityScore}</span>
                        </span>
                      </div>
                    </div>

                    {/* Copy Buttons */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(product.title);
                          showToast('Başlık Kopyalandı!', 'title');
                        }}
                        className="py-1.5 px-2 rounded-lg text-[10px] font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        title="Başlığı Kopyala"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Başlık Kopyala</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (product.tags && product.tags.length > 0) {
                            navigator.clipboard.writeText(product.tags.join(', '));
                            showToast('Tagler Kopyalandı!', 'tags');
                          }
                        }}
                        disabled={!product.tags || product.tags.length === 0}
                        className="py-1.5 px-2 rounded-lg text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Tagleri Kopyala"
                      >
                        <Tags className="w-3 h-3" />
                        <span>Tag Kopyala</span>
                      </button>
                    </div>

                    {/* AI Button */}
                    <button
                      type="button"
                      onClick={(e) => handleAIAnalyze(product, e)}
                      className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-foreground transition-all duration-300 flex items-center justify-center gap-1.5 relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(124,106,247,0.35)] cursor-pointer"
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

      {/* History Section */}
      <div className="mt-12 space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <RotateCcw className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold text-foreground">
            {t("research.searchHistory") || "Geçmiş Aranan Ürünler"}
          </h2>
        </div>
        
        {historyProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-secondary space-y-3 bg-black/10 rounded-2xl border border-border border-dashed">
            <Search size={24} className="text-muted" />
            <p className="text-sm font-medium">Henüz incelenmiş bir ürününüz yok.</p>
            <p className="text-xs text-muted text-center max-w-sm">Yukarıdaki arama sonuçlarından bir ürüne tıkladığınızda buraya otomatik olarak kaydedilir.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {historyProducts.map((product) => (
              <div 
                key={`hist-${product.id}`}
                className={`group relative bg-card border border-border hover:border-purple-500/50 rounded-2xl p-3 md:p-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(124,106,247,0.15)] flex flex-col justify-between ${selectedProduct?.id === product.id ? 'ring-2 ring-purple-500 border-purple-500' : ''}`}
                onClick={() => handleCardClick(product)}
              >
                <div className="absolute top-5 md:top-6 left-5 md:left-6 z-10 flex gap-1.5 flex-col">
                  {product.isBestseller && (
                    <span className="bg-yellow-500/90 backdrop-blur text-black text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg shadow-black/50">
                      Bestseller
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="aspect-[4/3] w-full rounded-xl overflow-hidden relative border border-border/50 bg-black/40">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      unoptimized={false}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-purple-400 text-xs font-semibold hover:underline truncate">
                      {product.shopName}
                    </span>
                  </div>

                  <h3 className="text-sm font-medium leading-snug line-clamp-2 text-foreground mb-2 min-h-[40px] group-hover:text-purple-300/90 transition-colors">
                    {product.title}
                  </h3>

                  <div className="text-lg font-bold text-foreground mb-3">
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={(e) => handleAIAnalyze(product, e)}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-foreground transition-all duration-300 flex items-center justify-center gap-1.5 relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(124,106,247,0.35)] cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #7c6af7 0%, #8c7bf7 100%)",
                    }}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{t("research.aiAnalyzeDesign") || "Yapay Zeka ile Analiz Et"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Banner */}
      {selectedProduct && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl animate-slide-up">
          <div 
            className="flex items-center justify-between gap-4 p-3 md:p-4 rounded-2xl border border-border shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            style={{
              background: "linear-gradient(145deg, rgba(20, 20, 28, 0.85) 0%, rgba(10, 10, 15, 0.9) 100%)",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border bg-black/40">
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
                <div className="text-xs md:text-sm font-semibold text-foreground truncate max-w-[180px] sm:max-w-[280px] md:max-w-[340px]">
                  {selectedProduct.title}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleAIAnalyze(selectedProduct)}
                disabled={analysisLoading}
                className="bg-gradient-to-r from-[#7c6af7] to-[#a855f7] text-foreground hover:brightness-110 font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 shadow-[0_4px_12px_rgba(124,106,247,0.3)] cursor-pointer"
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
                className="p-1.5 text-foreground/40 hover:text-foreground/80 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-border"
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
            className="w-full max-w-lg rounded-2xl border border-border p-6 shadow-2xl relative overflow-hidden text-left"
            style={{
              background: "linear-gradient(145deg, #161622 0%, #0d0d14 100%)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#7c6af7] to-transparent" />
            
            <button
              onClick={() => setAnalyzedProduct(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-foreground/40 hover:text-foreground/80 hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-4 items-start mb-5">
              <div className="relative w-16 h-16 shrink-0 rounded-xl border border-border overflow-hidden">
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
                <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-tight">
                  {analyzedProduct.title}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold text-secondary tracking-wider border-b border-border pb-1.5">
                {t("research.aiAnalyticsRecommendations")}
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-border">
                  <p className="text-secondary mb-0.5">Opportunity Index</p>
                  <p className="text-lg font-bold text-emerald-400">{analyzedProduct.opportunityScore}/100</p>
                </div>
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-border">
                  <p className="text-secondary mb-0.5">Est. 24h Sales</p>
                  <p className="text-lg font-bold text-purple-400">{analyzedProduct.estimatedSales24h || 0} sales</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-secondary">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <p>
                    <strong className="text-foreground">{t("research.trend")}</strong> {t("research.highConv")} {analyzedProduct.category || "niche"} {t("research.sector")}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <p>
                    <strong className="text-foreground">{t("research.designTip")}</strong> {t("research.expandCategory")}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400">✦</span>
                  <p>
                    <strong className="text-foreground">{t("research.seoKeywords")}</strong> {t("research.useHighVol")} {analyzedProduct.category || "item"}&quot; {t("research.increaseTraffic")}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {analyzedProduct.url && (
                  <a
                    href={analyzedProduct.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 border border-border hover:bg-white/5 transition-all text-xs font-semibold text-center rounded-xl flex items-center justify-center gap-1.5 text-foreground"
                  >
                    <span>{t("research.viewListing")}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                
                <button
                  onClick={() => {
                    const encodedUrl = encodeURIComponent(analyzedProduct.imageUrl);
                    router.push(`/ai-design-studio?image=${encodedUrl}`);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#7c6af7] to-[#a855f7] hover:brightness-110 transition-all font-bold text-xs text-foreground rounded-xl flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(124,106,247,0.3)]"
                >
                  <span>{t("research.generateDesigns") || "Tasarımlar Oluştur"}</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {copyToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-fade-in pointer-events-none">
          <div className="bg-[#1a1a24] border border-border shadow-[0_8px_30px_rgba(0,0,0,0.5)] px-4 py-2.5 rounded-xl flex items-center gap-3 backdrop-blur-md">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${copyToast.type === 'title' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-foreground">{copyToast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
