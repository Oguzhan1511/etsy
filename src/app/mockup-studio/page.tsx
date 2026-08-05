/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Camera, 
  Sparkles, 
  UploadCloud, 
  Library, 
  Loader2, 
  Download, 
  CheckCircle2, 
  Eye, 
  X, 
  Coins, 
  Zap, 
  Check, 
  Shirt, 
  Sliders, 
  ArrowRight,
  Info,
  Maximize2
} from "lucide-react";
import { get, set } from "idb-keyval";
import { useLanguage } from "@/context/LanguageContext";
import { useTokens } from "@/context/TokenContext";

interface DesignItem {
  id: string;
  name: string;
  url: string;
  createdAt: number;
}

export default function MockupStudioPage() {
  const { t } = useLanguage();
  const { availableTokens, refreshTokens } = useTokens();

  // Design selection states
  const [libraryDesigns, setLibraryDesigns] = useState<DesignItem[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<DesignItem | null>(null);
  const [customUploadUrl, setCustomUploadUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");

  // Configurator states
  const [productType, setProductType] = useState<string>("tshirt");
  const [modelGender, setModelGender] = useState<string>("female");
  const [productColor, setProductColor] = useState<string>("white");
  const [environment, setEnvironment] = useState<string>("studio");
  const [customPrompt, setCustomPrompt] = useState<string>("");

  // Generation & Result states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMockups, setGeneratedMockups] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load designs and refresh tokens from DB on mount
  useEffect(() => {
    refreshTokens();
    const loadSavedDesigns = async () => {
      try {
        const stored = await get<DesignItem[]>("ai_designs_library");
        if (stored && Array.isArray(stored)) {
          const realDesigns = stored.filter(d => 
            d && 
            d.id && 
            !d.id.startsWith("mock-") && 
            !d.url?.includes("unsplash.com")
          );
          setLibraryDesigns(realDesigns);
          if (realDesigns.length > 0) {
            setSelectedDesign(realDesigns[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load designs:", err);
      }
    };
    loadSavedDesigns();

    // Check query params if directed from another page
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const imgParam = params.get("image");
      const nameParam = params.get("name") || "Seçilen Tasarım";
      if (imgParam) {
        const directDesign: DesignItem = {
          id: "param-design",
          name: nameParam,
          url: imgParam,
          createdAt: Date.now(),
        };
        setSelectedDesign(directDesign);
        setCustomUploadUrl(imgParam);
        setActiveTab("upload");
      }
    }
  }, [refreshTokens]);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCustomUploadUrl(base64);
        setSelectedDesign({
          id: crypto.randomUUID(),
          name: file.name.replace(/\.[^/.]+$/, ""),
          url: base64,
          createdAt: Date.now()
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Product types config
  const productOptions = [
    { id: "tshirt", label: "Klasik Tişört", icon: "👕", desc: "Crewneck Regular Fit" },
    { id: "oversized_tshirt", label: "Oversized Tişört", icon: "🛹", desc: "Streetwear Dropped Shoulder" },
    { id: "hoodie", label: "Kapüşonlu Hoodie", icon: "🧥", desc: "Heavyweight Pullover" },
    { id: "sweatshirt", label: "Sweatshirt", icon: "🧶", desc: "Cozy Crewneck Fleece" },
    { id: "totebag", label: "Bez Çanta", icon: "👜", desc: "Eco Canvas Tote Bag" },
    { id: "mug", label: "Kupa Bardak", icon: "☕", desc: "11oz Seramik Kupa" },
    { id: "pillow", label: "Kırlent / Yastık", icon: "🛋️", desc: "Kare Dekoratif Yastık" },
    { id: "tanktop", label: "Askılı Atlet", icon: "🎽", desc: "Sleeveless Summer Fit" },
  ];

  // Model genders config
  const genderOptions = [
    { id: "female", label: "Kadın Model", badge: "Popüler", desc: "Zarif ve modern kadın manken" },
    { id: "male", label: "Erkek Model", badge: "Trend", desc: "Karizmatik ve şık erkek manken" },
    { id: "unisex", label: "Unisex / Sokak Modeli", badge: "Genç", desc: "Dinamik çağdaş sokak tarzı" },
  ];

  // Color options config (20 popular Etsy POD colors)
  const colorOptions = [
    // Neutrals & Classics
    { id: "white", label: "Beyaz", hex: "#FFFFFF", border: "border-neutral-300", isLight: true },
    { id: "black", label: "Siyah", hex: "#18181B", border: "border-neutral-700", isLight: false },
    { id: "sand", label: "Doğal / Kum", hex: "#F4F0EA", border: "border-neutral-300", isLight: true },
    { id: "beige", label: "Bej / Krem", hex: "#E7DEC8", border: "border-amber-200/50", isLight: true },
    { id: "heather_grey", label: "Açık Gri", hex: "#D1D5DB", border: "border-neutral-400", isLight: true },
    { id: "charcoal", label: "Antrasit / Füme", hex: "#374151", border: "border-neutral-600", isLight: false },
    // Blues
    { id: "navy", label: "Lacivert", hex: "#1E293B", border: "border-blue-900", isLight: false },
    { id: "royal_blue", label: "Saks Mavisi", hex: "#1D4ED8", border: "border-blue-700", isLight: false },
    { id: "light_blue", label: "Pastel Mavi", hex: "#BAE6FD", border: "border-sky-300", isLight: true },
    // Greens
    { id: "forest_green", label: "Orman Yeşili", hex: "#1B4332", border: "border-emerald-900", isLight: false },
    { id: "military_green", label: "Haki / Askeri Yeşil", hex: "#4B5320", border: "border-lime-900", isLight: false },
    { id: "sage_green", label: "Adaçayı Yeşili", hex: "#87A987", border: "border-emerald-300", isLight: true },
    // Reds & Pinks
    { id: "maroon", label: "Bordo / Şarap", hex: "#6B1D2F", border: "border-rose-900", isLight: false },
    { id: "red", label: "Klasik Kırmızı", hex: "#DC2626", border: "border-red-700", isLight: false },
    { id: "pink", label: "Pastel Pembe", hex: "#FBCFE8", border: "border-pink-300", isLight: true },
    { id: "dusty_rose", label: "Gül Kurusu", hex: "#D4A5A5", border: "border-rose-300", isLight: true },
    // Warm Earth & Pastels
    { id: "brown", label: "Çikolata Kahve", hex: "#4A2E1B", border: "border-amber-900", isLight: false },
    { id: "mustard", label: "Hardal Sarısı", hex: "#D97706", border: "border-amber-500", isLight: false },
    { id: "terracotta", label: "Kiremit / Pas", hex: "#C2410C", border: "border-orange-800", isLight: false },
    { id: "lavender", label: "Lavanta / Lila", hex: "#DDD6FE", border: "border-purple-300", isLight: true },
  ];

  // Environment options
  const environmentOptions = [
    { id: "studio", label: "Minimal Stüdyo", desc: "Aydınlık, yumuşak nötr fon" },
    { id: "urban_street", label: "Şehir / Sokak", desc: "Güneşli modern cadde çekimi" },
    { id: "aesthetic_cafe", label: "Estetik Kafe", desc: "Sıcak iç mekan & kahve ambiyansı" },
    { id: "nature_outdoor", label: "Açık Hava & Doğa", desc: "Gün batımı doğal ışık" },
  ];

  // Generate 3 live model mockups
  const handleGenerateMockups = async () => {
    if (!selectedDesign?.url) {
      setErrorMessage("Lütfen önce bir tasarım seçin veya yükleyin.");
      return;
    }

    if (availableTokens < 3) {
      setErrorMessage("Yetersiz bakiye. 3 adet canlı mockup seti üretmek için 3 Token gereklidir.");
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    setGeneratedMockups([]);

    try {
      let currentUserId = "";
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("printysell-auth-user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed?.id) currentUserId = parsed.id;
          } catch {}
        }
      }

      const res = await fetch("/api/mockup-generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(currentUserId ? { "x-user-id": currentUserId } : {})
        },
        body: JSON.stringify({
          designImage: selectedDesign.url,
          productType,
          modelGender,
          color: productColor,
          environment,
          customPrompt,
          userId: currentUserId
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Görseller oluşturulurken hata meydana geldi.");
      }

      if (data.mockups && Array.isArray(data.mockups)) {
        setGeneratedMockups(data.mockups);
        await refreshTokens(); // refresh token balance
      } else {
        throw new Error("API'den beklenmeyen görsel verisi döndü.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata oluştu";
      setErrorMessage(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download mockup
  const handleDownload = (imgUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `live_mockup_${productType}_${modelGender}_angle${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save generated mockup to custom mockups library
  const handleSaveToMockupLibrary = async (imgUrl: string, index: number) => {
    try {
      const stored = await get<any[]>("custom_mockups_library");
      const list = stored && Array.isArray(stored) ? stored : [];
      const newTemplate = {
        id: crypto.randomUUID(),
        url: imgUrl,
        createdAt: Date.now()
      };
      list.unshift(newTemplate);
      await set("custom_mockups_library", list);
      setSavedIndex(index);
      setTimeout(() => setSavedIndex(null), 3000);
    } catch (err) {
      console.error("Failed to save to mockups library:", err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 animate-fade-in relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5 shadow-sm">
              <Camera size={12} className="text-purple-400" />
              {t("mockupStudio.tag")}
            </span>
            <span className="text-xs text-secondary font-medium">Hyperrealistic Photoshoots</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[#f1f0ff] to-[#a09cb0] bg-clip-text text-transparent">
            {t("mockupStudio.title")}
          </h1>
          <p className="text-sm mt-1 text-secondary max-w-2xl">
            {t("mockupStudio.desc")}
          </p>
        </div>

        {/* Tokens & Nav links */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold shadow-md transition-all ${
            availableTokens < 3
              ? "bg-red-500/10 border-red-500/30 text-red-300"
              : "bg-amber-500/10 border-amber-500/20 text-amber-300"
          }`}>
            <Coins size={14} />
            <span>{availableTokens} Token</span>
          </div>
          <Link
            href="/mockup-publish"
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border hover:border-purple-500/50 rounded-xl text-sm font-semibold text-foreground transition-all hover:bg-white/[0.02]"
          >
            <span>Katalog & Yayınlama</span>
            <ArrowRight size={14} className="text-purple-400" />
          </Link>
        </div>
      </div>

      {/* Token Error Alert */}
      {errorMessage && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 animate-fade-in">
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-red-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-300">İşlem Gerçekleştirilemedi</p>
              <p className="text-xs text-red-400/80 mt-0.5">{errorMessage}</p>
            </div>
          </div>
          {availableTokens < 3 && (
            <Link
              href="/token-management"
              className="shrink-0 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold rounded-xl hover:brightness-110 shadow-lg transition-all"
            >
              Token Yükle →
            </Link>
          )}
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Design & Configurator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Step 1: Design Selector Card */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-extrabold">1</span>
                  {t("mockupStudio.step1")}
                </h2>
                <p className="text-xs text-secondary mt-0.5">{t("mockupStudio.step1Desc")}</p>
              </div>

              {/* Tabs */}
              <div className="flex bg-black/40 p-1 rounded-xl border border-border text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab("library")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === "library" ? "bg-purple-500 text-white shadow-md" : "text-secondary hover:text-foreground"
                  }`}
                >
                  {t("mockupStudio.fromLibrary")}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === "upload" ? "bg-purple-500 text-white shadow-md" : "text-secondary hover:text-foreground"
                  }`}
                >
                  {t("mockupStudio.uploadNew")}
                </button>
              </div>
            </div>

            {/* Tab: Library selector */}
            {activeTab === "library" ? (
              <div>
                {libraryDesigns.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-border rounded-xl px-4 bg-black/20 space-y-3">
                    <Library className="w-8 h-8 text-secondary/50 mx-auto" />
                    <p className="text-xs text-secondary">{t("mockupStudio.noDesigns")}</p>
                    <Link
                      href="/ai-design-studio"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-xs font-bold transition-all"
                    >
                      <Sparkles size={12} />
                      AI Studio'da Tasarla
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto pr-1 p-1">
                    {libraryDesigns.map((d) => {
                      const isSelected = selectedDesign?.url === d.url;
                      return (
                        <div
                          key={d.id}
                          onClick={() => setSelectedDesign(d)}
                          className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group bg-black/50 ${
                            isSelected ? "border-purple-500 ring-2 ring-purple-500/30 scale-[1.02]" : "border-border hover:border-purple-500/50"
                          }`}
                        >
                          <img src={d.url} alt={d.name} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-purple-500 text-white rounded-full p-0.5 shadow-md">
                              <Check size={12} />
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-xs py-1 px-1.5 text-[9px] text-white truncate text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {d.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Tab: Upload direct */
              <div>
                {customUploadUrl ? (
                  <div className="relative w-full h-44 bg-black/40 rounded-xl overflow-hidden border border-border group flex items-center justify-center">
                    <img src={customUploadUrl} alt="Uploaded" className="max-h-full max-w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => {
                        setCustomUploadUrl(null);
                        setSelectedDesign(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-44 bg-black/30 border border-dashed border-white/15 hover:border-purple-500/50 hover:bg-black/50 rounded-xl cursor-pointer transition-all group">
                    <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center mb-2 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                      <UploadCloud size={20} className="text-secondary group-hover:text-purple-400" />
                    </div>
                    <span className="text-xs text-foreground font-semibold">Tasarım Görseli Yükleyin</span>
                    <span className="text-[10px] text-muted mt-1">PNG, JPG veya WebP</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                )}
              </div>
            )}

            {/* Active Selected Design Preview Mini-Bar */}
            {selectedDesign && (
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-purple-500/30 shrink-0 bg-black">
                  <img src={selectedDesign.url} alt="Selected" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{selectedDesign.name || "Seçili Tasarım"}</p>
                  <p className="text-[10px] text-purple-300 font-medium">Kalıba aktarılmaya hazır</p>
                </div>
                <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                  Seçildi
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Product & Model Configurator */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-xl space-y-6">
            <div className="border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-extrabold">2</span>
                {t("mockupStudio.step2")}
              </h2>
              <p className="text-xs text-secondary mt-0.5">Ürünü, manken tarzını ve çekim ortamını belirleyin.</p>
            </div>

            {/* Product Type Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Shirt size={14} className="text-purple-400" />
                {t("mockupStudio.productType")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {productOptions.map((p) => {
                  const isSelected = productType === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProductType(p.id)}
                      className={`flex flex-col items-center text-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-purple-500/15 border-purple-500 text-foreground font-bold shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                          : "bg-black/30 border-border text-secondary hover:border-white/20 hover:text-foreground"
                      }`}
                    >
                      <span className="text-xl mb-1">{p.icon}</span>
                      <span className="text-xs font-semibold leading-tight">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model Gender / Style Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Camera size={14} className="text-purple-400" />
                {t("mockupStudio.modelGender")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {genderOptions.map((g) => {
                  const isSelected = modelGender === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setModelGender(g.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected 
                          ? "bg-purple-500/15 border-purple-500 text-foreground shadow-md" 
                          : "bg-black/30 border-border text-secondary hover:border-white/20 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-xs font-bold text-foreground">{g.label}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">{g.badge}</span>
                      </div>
                      <span className="text-[10px] text-muted leading-snug">{g.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color & Environment Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Product Color */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    {t("mockupStudio.productColor")}
                  </label>
                  <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                    {colorOptions.find((c) => c.id === productColor)?.label || productColor}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap bg-black/30 p-2.5 rounded-xl border border-border max-h-[140px] overflow-y-auto custom-scrollbar">
                  {colorOptions.map((c) => {
                    const isSelected = productColor === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setProductColor(c.id)}
                        title={c.label}
                        className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer relative ${
                          c.border
                        } ${isSelected ? "scale-115 ring-2 ring-purple-500 shadow-lg shadow-purple-500/20 z-10" : "hover:scale-110 opacity-80 hover:opacity-100"}`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected && (
                          <Check size={12} className={c.isLight ? "text-black stroke-[3]" : "text-white stroke-[3]"} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Environment */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  {t("mockupStudio.environment")}
                </label>
                <select
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  className="w-full bg-black/40 border border-border text-xs text-foreground rounded-xl p-2.5 focus:outline-none focus:border-purple-500/50 cursor-pointer"
                >
                  {environmentOptions.map((env) => (
                    <option key={env.id} value={env.id} className="bg-neutral-900 text-white">
                      {env.label} ({env.desc})
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Optional Custom Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sliders size={12} className="text-purple-400" />
                {t("mockupStudio.customNote")}
              </label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={t("mockupStudio.customNotePlaceholder")}
                className="w-full bg-black/40 border border-border text-xs text-foreground rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-muted"
              />
            </div>

            {/* Generate Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerateMockups}
                disabled={isGenerating || !selectedDesign?.url || availableTokens < 3}
                className="w-full relative group overflow-hidden py-4 rounded-xl font-extrabold text-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #7c6af7 0%, #a855f7 100%)",
                  boxShadow: "0 6px 25px rgba(124,106,247,0.35)",
                }}
              >
                <div className="flex items-center justify-center gap-2 relative z-10">
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t("mockupStudio.generating")}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      <span>{t("mockupStudio.generateBtn")} (3 Token)</span>
                    </>
                  )}
                </div>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              </button>

              <p className="text-[11px] text-muted text-center mt-2 flex items-center justify-center gap-1">
                <Info size={12} className="text-purple-400" />
                {t("mockupStudio.tokenCostNotice")}
              </p>
            </div>

          </div>

        </div>

        {/* Right Column: Generated 3-Mockup Showcase (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-xl min-h-[620px] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-400" />
                  {t("mockupStudio.resultsTitle")}
                </h2>
                <p className="text-xs text-secondary mt-0.5">E-ticaret ve Etsy ilanlarında yüksek dönüşüm sağlayan 3 farklı canlı model çekimi</p>
              </div>

              {generatedMockups.length > 0 && (
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 size={13} />
                  <span>3 Görsel Hazır</span>
                </div>
              )}
            </div>

            {/* Results Grid or Empty / Loading State */}
            <div className="flex-1 flex flex-col justify-center">
              
              {isGenerating ? (
                /* Dynamic Loading Animation */
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-5">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-purple-500/20 rounded-full animate-spin border-t-purple-500" />
                    <Sparkles className="w-8 h-8 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h3 className="text-base font-bold text-foreground">{t("mockupStudio.generating")}</h3>
                    <p className="text-xs text-secondary leading-relaxed">{t("mockupStudio.generatingDesc")}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 text-[11px] text-purple-300 bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-500/20 animate-pulse">
                    <span>Stüdyo Portre + Lifestyle Sokak + Yakın Detay</span>
                  </div>
                </div>
              ) : generatedMockups.length > 0 ? (
                /* 3 Mockup Showcase Cards */
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {generatedMockups.map((imgUrl, index) => {
                      const shotTitles = [
                        t("mockupStudio.shot1"),
                        t("mockupStudio.shot2"),
                        t("mockupStudio.shot3"),
                      ];
                      const isSaved = savedIndex === index;

                      return (
                        <div
                          key={index}
                          className="group relative flex flex-col bg-black/40 rounded-2xl border border-border overflow-hidden hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:-translate-y-1"
                        >
                          {/* Badge */}
                          <div className="absolute top-2 left-2 z-10 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-white border border-white/10 flex items-center gap-1 shadow-md">
                            <span>{shotTitles[index] || `Açı ${index + 1}`}</span>
                          </div>

                          {/* Image Container */}
                          <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden">
                            <img
                              src={imgUrl}
                              alt={`Live Model Mockup Angle ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                              <button
                                type="button"
                                onClick={() => setPreviewImage(imgUrl)}
                                className="p-2.5 bg-white/15 hover:bg-white/25 text-white rounded-full transition-colors cursor-pointer shadow-lg"
                                title={t("mockupStudio.preview")}
                              >
                                <Maximize2 size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownload(imgUrl, index)}
                                className="p-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-colors cursor-pointer shadow-lg"
                                title={t("mockupStudio.downloadHD")}
                              >
                                <Download size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Card Action Footer */}
                          <div className="p-3 bg-card border-t border-border flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => handleSaveToMockupLibrary(imgUrl, index)}
                              disabled={isSaved}
                              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                isSaved
                                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                  : "bg-white/[0.04] hover:bg-white/[0.08] text-secondary hover:text-foreground border border-border"
                              }`}
                            >
                              {isSaved ? (
                                <>
                                  <CheckCircle2 size={12} className="text-green-400" />
                                  <span>{t("mockupStudio.saved")}</span>
                                </>
                              ) : (
                                <>
                                  <Library size={12} />
                                  <span>{t("mockupStudio.saveToLibrary")}</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDownload(imgUrl, index)}
                              className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-colors cursor-pointer"
                              title="İndir"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Direct Publish / Export Banner */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/20 via-violet-900/20 to-black border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Mockuplar Hazır!</h4>
                      <p className="text-[11px] text-secondary">Görselleri bilgisayarınıza indirebilir veya Etsy mağazanızda yayınlamak için kullanabilirsiniz.</p>
                    </div>
                    <Link
                      href="/mockup-publish"
                      className="shrink-0 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <span>Etsy'de Yayınla</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Clean Empty State */
                <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Camera size={28} />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-base font-bold text-foreground">Canlı Model Mockup Stüdyosu</h3>
                    <p className="text-xs text-secondary leading-relaxed">
                      Sol panelden tasarımınızı ve ürün tercihinizi seçip <strong>"3 Adet Canlı Mockup Üret"</strong> butonuna basın.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* Large Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-card rounded-2xl border border-border p-4 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-secondary hover:text-foreground transition-colors z-10 cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden rounded-xl bg-black">
              <img src={previewImage} alt="Large Preview" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <a
                href={previewImage}
                download="live_mockup_hd.png"
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
              >
                <Download size={14} />
                <span>Orijinal HD İndir</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
