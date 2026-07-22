"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Wand2, Loader2, Download, Library, CheckCircle2, Image as ImageIcon, UploadCloud, X, Zap, Coins } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useTokens } from "@/context/TokenContext";

interface DesignItem {
  id: string;
  name: string;
  url: string;
  createdAt: number;
  printifyImageId?: string;
}

export default function AIDesignStudioPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { availableTokens, useToken } = useTokens();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const imgUrl = params.get("image");
      const initPrompt = params.get("prompt");
      setTimeout(() => {
        if (imgUrl) setReferenceImage(imgUrl);
        if (initPrompt) setPrompt(initPrompt);
      }, 0);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Token check
    if (availableTokens <= 0) {
      setTokenError(true);
      return;
    }

    // Deduct 1 token immediately
    const tokenConsumed = useToken();
    if (!tokenConsumed) {
      setTokenError(true);
      return;
    }

    setTokenError(false);
    setIsGenerating(true);
    setGeneratedImage(null);
    setIsSaved(false);

    try {
      const res = await fetch('/api/openai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image: referenceImage, prompt })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || t("aiDesign.serverError"));
      }

      if (data.url) {
        // Preload image to avoid showing broken state
        const img = new Image();
        img.src = data.url;
        img.onload = () => {
          setGeneratedImage(data.url);
          setIsGenerating(false);
        };
        img.onerror = () => {
          setGeneratedImage(data.url); // fallback
          setIsGenerating(false);
        };
      } else {
        throw new Error(t("aiDesign.urlError"));
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : t("aiDesign.unknownError");
      alert(t("aiDesign.errorPrefix") + errorMessage);
      setIsGenerating(false);
    }
  };

  const saveToLibrary = () => {
    if (!generatedImage) return;

    const newDesign: DesignItem = {
      id: crypto.randomUUID(),
      name: prompt.slice(0, 40) + (prompt.length > 40 ? "..." : ""),
      url: generatedImage,
      createdAt: Date.now(),
    };

    try {
      const stored = localStorage.getItem("ai_designs_library");
      const designs: DesignItem[] = stored ? JSON.parse(stored) : [];
      designs.unshift(newDesign);
      localStorage.setItem("ai_designs_library", JSON.stringify(designs));
      setIsSaved(true);

      // Background sync to Printify
      const syncDesign = async () => {
        try {
          const headers: Record<string, string> = { "Content-Type": "application/json" };
          const savedKey = localStorage.getItem("printify_api_key");
          if (savedKey) headers["x-printify-api-key"] = savedKey;

          const res = await fetch("/api/printify?action=upload-image", {
            method: "POST",
            headers,
            body: JSON.stringify({ url: generatedImage })
          });
          const data = await res.json();
          if (data.success && data.imageId) {
            // Update local storage
            const currentStored = localStorage.getItem("ai_designs_library");
            if (currentStored) {
              const currentDesigns = JSON.parse(currentStored);
              const updatedDesigns = currentDesigns.map((d: DesignItem) => 
                d.id === newDesign.id ? { ...d, printifyImageId: data.imageId } : d
              );
              localStorage.setItem("ai_designs_library", JSON.stringify(updatedDesigns));
            }
          }
        } catch (err) {
          console.error("Auto-sync to Printify failed:", err);
        }
      };
      syncDesign();
      
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      console.error("Failed to save design:", e);
      alert(t("aiDesign.saveError"));
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Creative Engine
            </span>
            <span className="text-xs text-secondary">PrintySell AI</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f1f0ff] to-[#a09cb0] bg-clip-text text-transparent flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            AI Design Studio
          </h1>
          <p className="text-sm mt-1 text-secondary max-w-xl">
            {t("aiDesign.desc")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Token badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
            availableTokens <= 5
              ? "bg-red-500/10 border-red-500/30 text-red-300"
              : "bg-amber-500/10 border-amber-500/20 text-amber-300"
          }`}>
            <Coins size={12} />
            <span>{availableTokens} Token</span>
          </div>
          <Link 
            href="/design-library"
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border hover:border-purple-500/50 rounded-lg text-sm text-foreground transition-all group"
          >
            <Library className="w-4 h-4 text-secondary group-hover:text-purple-400 transition-colors" />
            {t("aiDesign.goToLibrary")}
          </Link>
        </div>
      </div>

      {/* Token error banner */}
      {tokenError && (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
          <Zap size={20} className="text-red-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-300">Token Bakiyeniz Yetersiz!</p>
            <p className="text-xs text-red-400/80 mt-0.5">Yapay zeka tasarımı oluşturabilmek için Token satın almanız gerekiyor.</p>
          </div>
          <Link
            href="/token-management"
            className="shrink-0 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all"
          >
            Token Satın Al →
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Col: Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-2xl">
            <form onSubmit={handleGenerate} className="space-y-6">
              
              {/* Reference Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-purple-400" />
                  {t("aiDesign.uploadRef")}
                </label>
                {referenceImage ? (
                  <div className="relative w-full h-64 bg-black/40 rounded-xl overflow-hidden border border-border group">
                    <img src={referenceImage} alt="Reference" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button 
                        type="button"
                        onClick={() => setReferenceImage(null)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 bg-black/40 border border-dashed border-white/[0.15] hover:border-purple-500/50 hover:bg-black/60 rounded-xl cursor-pointer transition-all group">
                    <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center mb-3 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                      <UploadCloud className="w-5 h-5 text-secondary group-hover:text-purple-400" />
                    </div>
                    <span className="text-sm text-foreground font-medium">{t("aiDesign.clickToUpload")}</span>
                    <span className="text-[10px] text-muted mt-1">{t("aiDesign.dragDrop")}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-purple-400" />
                  {t("aiDesign.promptLabel")}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t("aiDesign.promptPlaceholder")}
                  className="w-full h-24 bg-black/40 border border-border text-sm text-foreground rounded-xl p-4 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none placeholder:text-muted"
                  required
                />
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden mt-2"
                style={{
                  background: "linear-gradient(135deg, #7c6af7 0%, #a855f7 100%)",
                  boxShadow: "0 4px 20px rgba(124,106,247,0.3)",
                }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t("aiDesign.generating")}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>{t("aiDesign.generateBtn")}</span>
                  </>
                )}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Preview */}
        <div className="lg:col-span-7">
          <div className="bg-card rounded-2xl border border-border p-6 h-full min-h-[500px] flex flex-col relative overflow-hidden shadow-2xl">
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                {t("aiDesign.preview")}
              </h2>
              {generatedImage && (
                <div className="flex gap-2">
                  <button 
                    onClick={saveToLibrary}
                    disabled={isSaved}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                      isSaved 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-white/5 hover:bg-white/10 text-foreground border border-border'
                    }`}
                  >
                    {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Library className="w-4 h-4" />}
                    {isSaved ? t("aiDesign.savedToLibrary") : t("aiDesign.saveToLibrary")}
                  </button>
                  <a 
                    href={generatedImage}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 rounded-lg text-sm font-semibold transition-all"
                  >
                    <Download className="w-4 h-4" />
                    {t("aiDesign.download")}
                  </a>
                </div>
              )}
            </div>

            <div className="flex-1 rounded-xl bg-black/40 border border-border relative flex items-center justify-center overflow-hidden">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4 text-purple-400">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/20 rounded-full animate-spin border-t-purple-500" />
                    <Sparkles className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <p className="text-sm font-medium animate-pulse">{t("aiDesign.weaving")}</p>
                </div>
              ) : generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Generated AI Design" 
                  className="w-full h-full object-contain animate-fade-in"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.02] flex items-center justify-center border border-border">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-sm">{t("aiDesign.emptyState")}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
