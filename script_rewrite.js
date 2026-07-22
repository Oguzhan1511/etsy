const fs = require('fs');
const path = '/Users/mac/Desktop/bot-etsy/src/app/mockup-publish/page.tsx';

const newContent = `/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { Package, Search, ChevronDown, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ProductModel {
  id: string; // Printify Blueprint ID
  name: string;
  baseCost: number;
  defaultPrice: number;
  colors: string[];
  images: Record<string, string>;
  description: string;
  providers: string;
  shipsFrom: string;
  isBestseller: boolean;
  brand?: string;
}

export default function MockupPublishPage() {
  const { t } = useLanguage();

  const [allBlueprints, setAllBlueprints] = useState<ProductModel[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  
  const [catalogSearch, setCatalogSearch] = useState("");
  const [activeRootCat, setActiveRootCat] = useState<string>("Katalog");
  const [activeSubCat, setActiveSubCat] = useState<string>("Shirt");
  const [expandedRoots, setExpandedRoots] = useState<Record<string, boolean>>({ "Katalog": true });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoadingCatalog(true);
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        const savedKey = typeof window !== "undefined" ? localStorage.getItem("printify_api_key") : null;
        if (savedKey) headers["x-printify-api-key"] = savedKey;

        const response = await fetch("/api/printify?action=blueprints", { headers });
        if (!response.ok) throw new Error("Catalog fetch failed");
        
        const data = await response.json();
        const payload = Array.isArray(data) ? data : (data.data || []);
        
        const mappedModels: ProductModel[] = payload.map((bp: any) => {
          const modelName = bp.title || bp.name || "Printify Product";
          const brandName = bp.brand || "Generic";
          return {
            id: String(bp.id),
            name: brandName !== "Generic" ? \`\${brandName} \${modelName}\` : modelName,
            baseCost: 8.50,
            defaultPrice: 24.99,
            colors: ["Black", "White"],
            images: { "default": bp.images?.[0] || "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80" },
            description: bp.description || "",
            providers: "Multiple Providers",
            shipsFrom: "Global",
            isBestseller: bp.is_bestseller || false,
            brand: brandName
          };
        });

        // Filter models to only valid categories immediately to save memory
        const filtered = mappedModels.filter(bp => {
          const titleLower = bp.name.toLowerCase();
          return /\\b(tee|t-shirt|t shirt|shirt|v-neck|mug|cup|tumbler|hoodie|sweatshirt|crewneck|sweater|bag|tote|backpack|duffel|fanny|candle|wax|ornament|bauble|canvas|poster|print|art|phone|case|cover|pet|dog|cat|collar|bandana|leash|bowl|bed)\\b/.test(titleLower);
        });

        setAllBlueprints(filtered);
        setCatalogError(null);
      } catch (err: any) {
        setCatalogError("API'den ürünler alınamadı. Lütfen sayfayı yenileyin.");
      } finally {
        setIsLoadingCatalog(false);
      }
    };
    fetchCatalog();
  }, []);

  const groupBlueprintsToTaxonomy = () => {
    const tree: Record<string, Record<string, ProductModel[]>> = {
      "Katalog": {
        "Shirt": [], "Mugs": [], "Sweatshirt Hoodie": [], "Bags": [],
        "Candles": [], "Ornaments": [], "Canvas & Poster": [], "Phone Cases": [], "Pets": [],
      }
    };

    allBlueprints.forEach((bp) => {
      const titleLower = bp.name.toLowerCase();
      let sub: string | null = null;

      if (/\\b(tee|t-shirt|t shirt|shirt|v-neck)\\b/.test(titleLower)) sub = "Shirt";
      else if (/\\b(mug|cup|tumbler)\\b/.test(titleLower)) sub = "Mugs";
      else if (/\\b(hoodie|sweatshirt|crewneck|sweater)\\b/.test(titleLower)) sub = "Sweatshirt Hoodie";
      else if (/\\b(bag|tote|backpack|duffel|fanny)\\b/.test(titleLower)) sub = "Bags";
      else if (/\\b(candle|wax)\\b/.test(titleLower)) sub = "Candles";
      else if (/\\b(ornament|bauble)\\b/.test(titleLower)) sub = "Ornaments";
      else if (/\\b(canvas|poster|print|art)\\b/.test(titleLower)) sub = "Canvas & Poster";
      else if (/\\b(phone|case|cover)\\b/.test(titleLower) && !/\\b(pillow)\\b/.test(titleLower)) sub = "Phone Cases";
      else if (/\\b(pet|dog|cat|collar|bandana|leash|bowl|bed)\\b/.test(titleLower)) sub = "Pets";

      if (sub) {
        tree["Katalog"][sub].push(bp);
      }
    });
    return tree;
  };

  const taxonomyTree = groupBlueprintsToTaxonomy();

  const getFilteredModelsList = () => {
    const list = taxonomyTree[activeRootCat]?.[activeSubCat] || [];
    if (!catalogSearch) return list;
    return list.filter(m => 
      m.name.toLowerCase().includes(catalogSearch.toLowerCase()) || 
      (m.brand || "").toLowerCase().includes(catalogSearch.toLowerCase())
    );
  };

  const filteredModels = getFilteredModelsList();
  const paginatedModels = filteredModels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSubCategorySelect = (root: string, sub: string) => {
    setActiveRootCat(root);
    setActiveSubCat(sub);
    setCurrentPage(1);
  };

  const toggleRootFolder = (root: string) => {
    setExpandedRoots(prev => ({ ...prev, [root]: !prev[root] }));
  };

  const handleModelSelect = (model: ProductModel) => {
    window.open(\`https://printify.com/app/products/\${model.id}\`, "_blank");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 animate-pulse">
              {t("mockupPublish.studioMatrixPro")}
            </span>
            <span className="text-xs text-[#a09cb0]">Printify Yönlendirme Merkezi</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f1f0ff] to-[#a09cb0] bg-clip-text text-transparent">
            Statik Katalog
          </h1>
          <p className="text-sm mt-1 text-[#a09cb0]">
            Baskı yapmak istediğiniz ürünü seçip anında Printify üzerinden işleminize devam edebilirsiniz.
          </p>
        </div>
      </div>

      {catalogError && (
        <div className="max-w-7xl mx-auto px-6 py-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
          <div className="flex-1">
            <h3 className="text-red-400 font-bold text-sm">Veriler Yüklenirken Hata Oluştu</h3>
            <p className="text-red-300 text-xs mt-1">{catalogError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in-fast">
        <div className="lg:col-span-3 rounded-xl border border-white/[0.07] p-4 space-y-4 backdrop-blur-md bg-white/[0.01]">
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5 pb-2 border-b border-white/[0.06]">
            <Package className="w-4 h-4 text-purple-400" />
            <span>Katalog Ağacı</span>
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5e5a72]" />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => {
                setCatalogSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Katalog ürünlerini ara..."
              className="w-full h-8 pl-9 pr-3 bg-black/30 border border-white/[0.08] focus:border-purple-500/80 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none"
            />
          </div>
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {Object.entries(taxonomyTree).map(([rootKey, subTree]) => {
              const isExpanded = expandedRoots[rootKey];
              const totalRootItems = Object.values(subTree).reduce((acc, list) => acc + list.length, 0);

              return (
                <div key={rootKey} className="space-y-1">
                  <button onClick={() => toggleRootFolder(rootKey)} className="w-full py-1.5 flex items-center justify-between text-xs font-bold text-[#f1f0ff] hover:text-white cursor-pointer">
                    <div className="flex items-center gap-1">
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span>{rootKey}</span>
                    </div>
                    <span className="text-[10px] text-[#5e5a72] font-semibold">({totalRootItems})</span>
                  </button>
                  {isExpanded && (
                    <div className="pl-4 border-l border-white/[0.04] space-y-0.5">
                      {Object.entries(subTree).map(([subKey, itemsList]) => {
                        const isLeafSelected = activeRootCat === rootKey && activeSubCat === subKey;
                        return (
                          <button
                            key={subKey}
                            onClick={() => handleSubCategorySelect(rootKey, subKey)}
                            className={\`w-full text-left py-1 px-2 rounded-md text-[11px] font-medium transition-all flex items-center justify-between cursor-pointer \${
                              isLeafSelected ? "bg-purple-500/10 text-purple-300 font-bold border border-purple-500/15" : "text-[#a09cb0] hover:text-white hover:bg-white/[0.02]"
                            }\`}
                          >
                            <span>{subKey}</span>
                            <span className="text-[9px] text-[#5e5a72]">({itemsList.length})</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-9 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <h3 className="font-bold text-[#f1f0ff] uppercase tracking-wider flex items-center gap-1.5">
              <span>{activeSubCat} Katalog ({filteredModels.length} Ürün)</span>
              {catalogSearch && <span className="text-[#5e5a72] font-medium lowercase">"{catalogSearch}" için filtrelendi</span>}
            </h3>
            {isLoadingCatalog ? (
              <span className="text-[11px] text-amber-400 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Yükleniyor...
              </span>
            ) : (
              <span className="text-[11px] text-green-400">⚡ API Synced</span>
            )}
          </div>

          {isLoadingCatalog ? (
            <div className="flex flex-col items-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              <p className="text-xs text-[#a09cb0]">Printify Modelleri Getiriliyor...</p>
            </div>
          ) : filteredModels.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-dashed border-white/10 bg-white/[0.01]">
              <p className="text-sm font-semibold text-[#a09cb0]">Ürün bulunamadı.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedModels.map((model) => (
                <div
                  key={model.id}
                  onClick={() => handleModelSelect(model)}
                  className="group relative rounded-xl border border-white/[0.07] bg-[#16161e] p-4 cursor-pointer transition-all duration-300 hover:border-purple-500/30 hover:bg-[#1a1a24] hover:translate-y-[-2px] flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-neutral-900 border border-white/[0.04]">
                      <img src={model.images["default"]} alt={model.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      {model.isBestseller && (
                        <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-[#7c6af7] to-[#a855f7] text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow border border-white/10">
                          BEST SELLER
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-0.5">{model.brand}</h4>
                    <h3 className="text-sm font-bold text-white line-clamp-1 mb-2 group-hover:text-purple-300 transition-colors">{model.name}</h3>
                    <div className="text-[11px] text-[#a09cb0] space-y-1 mb-4">
                      <p className="flex items-center gap-1.5"><span aria-hidden="true">🏢</span><span>{model.providers}</span></p>
                      <p className="flex items-center gap-1.5"><span aria-hidden="true">📍</span><span>{model.shipsFrom}</span></p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-[#5e5a72] block uppercase font-bold tracking-wider">Taban Fiyat</span>
                      <span className="text-sm font-bold text-white">\${model.baseCost.toFixed(2)}</span>
                    </div>
                    <button className="px-4 py-1.5 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 rounded-lg text-xs font-bold transition-colors">
                      Printify'da Aç ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
\`;

fs.writeFileSync(path, newContent);
console.log('Successfully wrote new page.tsx');
