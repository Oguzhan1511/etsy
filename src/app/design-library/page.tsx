/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { Search, Download, Trash2, Edit2, Check, X, CalendarDays, ImageIcon, Eye } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface DesignItem {
  id: string;
  name: string;
  url: string;
  createdAt: number;
  printifyImageId?: string;
}

const DEFAULT_MOCK_DESIGNS: DesignItem[] = [
  {
    id: "1",
    name: "Golden Meadows",
    url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80",
    createdAt: Date.now() - 1000000,
  },
  {
    id: "2",
    name: "Abstract Neon Wave",
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80",
    createdAt: Date.now() - 2000000,
  },
  {
    id: "3",
    name: "Retro Solar Circle",
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    createdAt: Date.now() - 3000000,
  },
  {
    id: "4",
    name: "Cyberpunk Cityscape",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    createdAt: Date.now() - 4000000,
  },
];

export default function DesignLibraryPage() {
  const { t } = useLanguage();
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  
  // Renaming state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Preview state
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Sync state
  const [syncWarning, setSyncWarning] = useState<string | null>(null);

  useEffect(() => {
    // Load from local storage
    const stored = localStorage.getItem("ai_designs_library");
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setDesigns(JSON.parse(stored));
      } catch {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setDesigns(DEFAULT_MOCK_DESIGNS);
      }
    } else {
      setDesigns(DEFAULT_MOCK_DESIGNS);
      localStorage.setItem("ai_designs_library", JSON.stringify(DEFAULT_MOCK_DESIGNS));
    }
  }, []);

  // Background Sync Effect
  useEffect(() => {
    const performBackgroundSync = async () => {
      if (designs.length === 0) return;
      
      const unsyncedDesigns = designs.filter(d => !d.printifyImageId);
      if (unsyncedDesigns.length === 0) return;

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const savedKey = localStorage.getItem("printify_api_key");
      if (!savedKey) {
        setSyncWarning("Printify API Anahtarınız ayarlanmadığı için otomatik eşzamanlama yapılamıyor. Lütfen Ayarlar'dan anahtarınızı girin.");
        return; // cannot sync without key
      }
      setSyncWarning(null);
      headers["x-printify-api-key"] = savedKey;

      let hasChanges = false;
      const updatedDesigns = [...designs];

      for (const design of unsyncedDesigns) {
        try {
          const res = await fetch("/api/printify?action=upload-image", {
            method: "POST",
            headers,
            body: JSON.stringify({ url: design.url })
          });
          const data = await res.json();
          if (data.success && data.imageId) {
            const index = updatedDesigns.findIndex(d => d.id === design.id);
            if (index !== -1) {
              updatedDesigns[index] = { ...updatedDesigns[index], printifyImageId: data.imageId };
              hasChanges = true;
            }
          }
        } catch (err) {
          console.error("Background sync failed for design", design.id, err);
        }
      }

      if (hasChanges) {
        setDesigns(updatedDesigns);
        localStorage.setItem("ai_designs_library", JSON.stringify(updatedDesigns));
      }
    };

    // Run sync quickly
    const timer = setTimeout(performBackgroundSync, 500);
    return () => clearTimeout(timer);
  }, [designs.length]);

  const saveDesigns = (newDesigns: DesignItem[]) => {
    setDesigns(newDesigns);
    localStorage.setItem("ai_designs_library", JSON.stringify(newDesigns));
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t("designLibrary.deleteConfirm"))) {
      const newDesigns = designs.filter((d) => d.id !== id);
      saveDesigns(newDesigns);
    }
  };

  const handleDownload = (url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_').toLowerCase()}_design.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const startRename = (design: DesignItem) => {
    setEditingId(design.id);
    setEditName(design.name);
  };

  const saveRename = (id: string) => {
    const newDesigns = designs.map(d => d.id === id ? { ...d, name: editName || t("designLibrary.untitled") } : d);
    saveDesigns(newDesigns);
    setEditingId(null);
  };

  const filteredDesigns = designs.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedDesigns = [...filteredDesigns].sort((a, b) => {
    if (sortOption === "newest") return b.createdAt - a.createdAt;
    if (sortOption === "oldest") return a.createdAt - b.createdAt;
    if (sortOption === "az") return a.name.localeCompare(b.name);
    if (sortOption === "za") return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 animate-fade-in relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {t("designLibrary.storageVault")}
            </span>
            <span className="text-xs text-[#a09cb0]">AI Design Studio</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f1f0ff] to-[#a09cb0] bg-clip-text text-transparent">
            {t("designLibrary.title")}
          </h1>
          <p className="text-sm mt-1 text-[#a09cb0]">
            {t("designLibrary.desc")}
          </p>
        </div>
      </div>

      {/* Controls: Search and Sort */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#16161f] p-4 rounded-xl border border-white/[0.06]">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a09cb0]" />
          <input
            type="text"
            placeholder={t("designLibrary.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/[0.08] text-sm text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <span className="text-xs font-semibold text-[#a09cb0] hidden sm:block">{t("designLibrary.sortBy")}</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full sm:w-auto bg-black/40 border border-white/[0.08] text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
          >
            <option value="newest">{t("designLibrary.sortNewest")}</option>
            <option value="oldest">{t("designLibrary.sortOldest")}</option>
            <option value="az">{t("designLibrary.sortAZ")}</option>
            <option value="za">{t("designLibrary.sortZA")}</option>
          </select>
        </div>
      </div>

      {syncWarning && (
        <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-4">
          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          <p className="text-xs text-yellow-300">{syncWarning}</p>
        </div>
      )}

      {/* Grid Layout */}
      {sortedDesigns.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-purple-500/10 border border-purple-500/20">
              <ImageIcon className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t("designLibrary.noDesigns")}</h3>
          <p className="text-sm text-[#a09cb0] max-w-md mx-auto">
            {searchQuery 
              ? t("designLibrary.noMatch")
              : t("designLibrary.empty")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedDesigns.map((design) => (
            <div 
              key={design.id}
              className="group relative flex flex-col bg-[#16161f] rounded-2xl border border-white/[0.06] overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(124,106,247,0.1)] hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative aspect-square w-full bg-neutral-900 overflow-hidden">
                <img 
                  src={design.url} 
                  alt={design.name} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Sync Indicator */}
                {design.printifyImageId && (
                  <div className="absolute top-2 right-2 bg-emerald-500/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                    <Check className="w-3 h-3" />
                    Synced
                  </div>
                )}
                
                {/* Hover Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <button 
                    onClick={() => setPreviewImage(design.url)}
                    className="p-2.5 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 rounded-full text-blue-300 transition-colors cursor-pointer"
                    title={t("designLibrary.preview")}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDownload(design.url, design.name)}
                    className="p-2.5 bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors cursor-pointer"
                    title={t("designLibrary.download")}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => startRename(design)}
                    className="p-2.5 bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/30 rounded-full text-purple-300 transition-colors cursor-pointer"
                    title={t("designLibrary.rename")}
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(design.id)}
                    className="p-2.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded-full text-red-300 transition-colors cursor-pointer"
                    title={t("designLibrary.delete")}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Meta Info */}
              <div className="p-4 flex flex-col gap-1">
                {editingId === design.id ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveRename(design.id)}
                      className="w-full bg-black/50 border border-purple-500/50 text-sm text-white rounded px-2 py-1 focus:outline-none"
                    />
                    <button 
                      onClick={() => saveRename(design.id)}
                      className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="p-1.5 bg-white/10 text-[#a09cb0] rounded hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <h3 className="text-sm font-bold text-white truncate" title={design.name}>
                    {design.name}
                  </h3>
                )}
                <div className="flex items-center gap-1.5 text-[10px] text-[#5e5a72] font-semibold">
                  <CalendarDays className="w-3 h-3" />
                  <span>
                    {new Date(design.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
