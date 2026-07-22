/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { Package, Search, ChevronDown, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ProductModel {
  id: string;
  name: string;
  baseCost: number;
  images: Record<string, string>;
  isBestseller: boolean;
  brand?: string;
  originalIndex: number;
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
  const [genderFilter, setGenderFilter] = useState<string>("Tümü");
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
  const itemsPerPage = 20;

  const showToast = (msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 4000);
  };

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

        const mappedModels: ProductModel[] = payload.map((bp: any, index: number) => {
          const modelName = bp.title || bp.name || "Printify Product";
          const brandName = bp.brand || "";

          const rawImg = bp.images?.[0];
          let imageUrl = "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80";
          if (rawImg) {
            imageUrl = rawImg.startsWith("http") ? rawImg : `https://images.printify.com/${rawImg}`;
          }

          return {
            id: String(bp.id),
            name: modelName,
            baseCost: 8.50,
            images: { default: imageUrl },
            isBestseller: bp.is_bestseller || false,
            brand: brandName,
            originalIndex: index,
          };
        });

        setAllBlueprints(mappedModels);
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
        "Shirt": [],
        "Sweatshirt Hoodie": [],
        "Mugs": [],
        "Bags": [],
        "Canvas & Poster": [],
        "Phone Cases": [],
        "Ornaments": [],
        "Pets": [],
        "Candles": [],
        "Ev & Yaşam": [],
        "Aksesuar": [],
        "Diğer": [],
      },
    };

    allBlueprints.forEach((bp) => {
      const t = bp.name.toLowerCase();
      let sub: string;

      if (/hoodie|sweatshirt|crewneck|crew neck|sweater|fleece|pullover|zip.up|jacket|windbreaker|coat|quarter.zip/.test(t)) {
        sub = "Sweatshirt Hoodie";
      } else if (/mug\b|cup\b|tumbler|travel mug|stein\b|flask|can holder|can cooler/.test(t)) {
        sub = "Mugs";
      } else if (/\bbag\b|tote\b|backpack|duffel|fanny|pouch\b|purse\b|satchel|drawstring|lunch bag/.test(t)) {
        sub = "Bags";
      } else if (/canvas|tapestry|wall art|metal print|wood print|acrylic print|art board|photo tile|wall decal|photo\.?frame/.test(t)) {
        sub = "Canvas & Poster";
      } else if (/\bposter\b|framed poster/.test(t)) {
        sub = "Canvas & Poster";
      } else if (/sticker|decal|magnet|transfer/.test(t)) {
        sub = "Canvas & Poster";
      } else if (/phone|iphone|samsung|galaxy|android|airpod|ipad|tablet|kindle|laptop sleeve|mouse pad/.test(t)) {
        sub = "Phone Cases";
      } else if (/ornament|bauble|christmas tree ornament|holiday decoration|wreath|christmas stocking|stockings/.test(t)) {
        sub = "Ornaments";
      } else if (/\bpet\b|dog\b|\bcat\b|collar|bandana|leash|paw|pet bed/.test(t)) {
        sub = "Pets";
      } else if (/candle|wax melt|diffuser|aromatherapy/.test(t)) {
        sub = "Candles";
      } else if (/pillow|cushion|blanket|comforter|throw|duvet|shower curtain|bath mat|beach towel|towel|wall clock|clock|rug\b|lamp\b|apron\b|coaster|tablecloth|cutting board|dish|placemat/.test(t)) {
        sub = "Ev & Yaşam";
      } else if (/journal|notebook|book\b|planner|calendar|card\b|poster\b|banner\b/.test(t)) {
        sub = "Aksesuar";
      } else if (/socks|sock\b|beanie|hat\b|\bcap\b|glove|scarf|belt|wallet|watch|sunglasses|glasses|headband|face mask|underwear|boxer|briefs|bra\b|lingerie|swimsuit|bikini|swimwear|swim/.test(t)) {
        sub = "Aksesuar";
      } else if (/\bt.?shirt\b|tee\b|tank|polo\b|jersey\b|raglan|singlet|camisole|v.neck|henley|bodysuit|onesie|crop|shorts|legging|skirt|dress|sneaker|shoe|boots|pant\b|pants\b|cardigan|vest\b|sleeve|button.down/.test(t)) {
        sub = "Shirt";
      } else {
        sub = "Diğer";
      }

      tree["Katalog"][sub].push(bp);
    });

    return tree;
  };

  const taxonomyTree = groupBlueprintsToTaxonomy();

  const getFilteredModelsList = () => {
    let list = taxonomyTree[activeRootCat]?.[activeSubCat] || [];

    if (activeSubCat === "Shirt" || activeSubCat === "Sweatshirt Hoodie") {
      if (genderFilter !== "Tümü") {
        list = list.filter((m) => {
          const n = m.name.toLowerCase();
          let gender = "Unisex";
          if (/women|womens|women's|ladies|lady|girls|girl|female/.test(n)) gender = "Kadın";
          else if (/\bmen's\b|mens\b|\bman\b|\bboys\b|\bboy\b|\bmale\b/.test(n)) gender = "Erkek";
          else if (/youth|kids|kid|toddler|infant|baby|onesie|creeper|children/.test(n)) gender = "Çocuk";
          return gender === genderFilter;
        });
      }
    }

    if (catalogSearch) {
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
          (m.brand || "").toLowerCase().includes(catalogSearch.toLowerCase())
      );
    }

    return list.sort((a, b) => a.originalIndex - b.originalIndex);
  };

  const filteredModels = getFilteredModelsList();
  const totalPages = Math.ceil(filteredModels.length / itemsPerPage);
  const paginatedModels = filteredModels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSubCategorySelect = (root: string, sub: string) => {
    setActiveRootCat(root);
    setActiveSubCat(sub);
    setGenderFilter("Tümü");
    setCurrentPage(1);
  };

  const toggleRootFolder = (root: string) => {
    setExpandedRoots((prev) => ({ ...prev, [root]: !prev[root] }));
  };

  const handleModelSelect = async (model: ProductModel) => {
    // Build the correct Printify URL: /app/products/{id}/{brand-slug}/{title-slug}
    const slugify = (str: string) =>
      str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const brandSlug = slugify(model.brand || "printify");
    const titleSlug = slugify(model.name);
    const url = `https://printify.com/app/products/${model.id}/${brandSlug}/${titleSlug}`;

    window.open(url, "_blank");
    showToast(`Printify'da açılıyor: ${model.name}`);
  };

  const isApparelCategory = activeSubCat === "Shirt" || activeSubCat === "Sweatshirt Hoodie";
  const genderOptions = ["Tümü", "Unisex", "Erkek", "Kadın", "Çocuk"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 animate-fade-in relative">
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl bg-surface border border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.25)] backdrop-blur-md">
          <span className="text-green-400 text-lg">✓</span>
          <p className="text-sm text-foreground font-medium">{toast.message}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 animate-pulse">
              {t("mockupPublish.studioMatrixPro")}
            </span>
            <span className="text-xs text-secondary">{t("mockupPublish.printifyCenter")}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f1f0ff] to-[#a09cb0] bg-clip-text text-transparent">
            {t("mockupPublish.catalog")}
          </h1>
          <p className="text-sm mt-1 text-secondary">
            {t("mockupPublish.desc1")} {" "}
            <span className="text-amber-400 font-medium">{t("mockupPublish.desc2")}</span>
          </p>
        </div>
      </div>

      {catalogError && (
        <div className="px-6 py-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
          <div className="flex-1">
            <h3 className="text-red-400 font-bold text-sm">Veriler Yüklenirken Hata Oluştu</h3>
            <p className="text-red-300 text-xs mt-1">{catalogError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar */}
        <div className="lg:col-span-3 rounded-xl border border-border p-4 space-y-4 backdrop-blur-md bg-white/[0.01]">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5 pb-2 border-b border-border">
            <Package className="w-4 h-4 text-purple-400" />
            <span>{t("mockupPublish.catalogTree")}</span>
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => { setCatalogSearch(e.target.value); setCurrentPage(1); }}
              placeholder={t("mockupPublish.searchProduct")}
              className="w-full h-8 pl-9 pr-3 bg-black/30 border border-border focus:border-purple-500/80 rounded-lg text-xs text-foreground placeholder-white/30 focus:outline-none"
            />
          </div>
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {Object.entries(taxonomyTree).map(([rootKey, subTree]) => {
              const isExpanded = expandedRoots[rootKey];
              const totalRootItems = Object.values(subTree).reduce((acc, list) => acc + list.length, 0);
              return (
                <div key={rootKey} className="space-y-1">
                  <button
                    onClick={() => toggleRootFolder(rootKey)}
                    className="w-full py-1.5 flex items-center justify-between text-xs font-bold text-foreground hover:text-foreground cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span>{rootKey}</span>
                    </div>
                    <span className="text-[10px] text-muted font-semibold">({totalRootItems})</span>
                  </button>
                  {isExpanded && (
                    <div className="pl-4 border-l border-border space-y-0.5">
                      {Object.entries(subTree).map(([subKey, itemsList]) => {
                        const isSelected = activeRootCat === rootKey && activeSubCat === subKey;
                        return (
                          <button
                            key={subKey}
                            onClick={() => handleSubCategorySelect(rootKey, subKey)}
                            className={`w-full text-left py-1 px-2 rounded-md text-[11px] font-medium transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? "bg-purple-500/10 text-purple-300 font-bold border border-purple-500/15"
                                : "text-secondary hover:text-foreground hover:bg-white/[0.02]"
                            }`}
                          >
                            <span>{subKey}</span>
                            <span className="text-[9px] text-muted">({itemsList.length})</span>
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

        {/* Product Grid */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <div className="space-y-2">
              <h3 className="font-bold text-foreground uppercase tracking-wider">
                {activeSubCat} {t("mockupPublish.catalogUpper")} ({filteredModels.length} {t("mockupPublish.products")})
                {catalogSearch && <span className="text-muted font-medium normal-case ml-2">"{catalogSearch}" için</span>}
              </h3>
              {isApparelCategory && (
                <div className="flex items-center gap-2 flex-wrap">
                  {genderOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => { setGenderFilter(option); setCurrentPage(1); }}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all border ${
                        genderFilter === option
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                          : "bg-black/30 text-secondary border-border hover:bg-white/[0.05] hover:text-foreground"
                      }`}
                    >
                      {t(`mockupPublish.gender_${option}`)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {isLoadingCatalog ? (
              <span className="text-[11px] text-amber-400 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Yükleniyor...
              </span>
            ) : (
              <span className="text-[11px] text-green-400 shrink-0">⚡ {allBlueprints.length} {t("mockupPublish.productsLoaded")}</span>
            )}
          </div>

          {isLoadingCatalog ? (
            <div className="flex flex-col items-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              <p className="text-xs text-secondary">Printify Kataloğu Getiriliyor...</p>
            </div>
          ) : filteredModels.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-dashed border-border bg-white/[0.01]">
              <p className="text-sm font-semibold text-secondary">Ürün bulunamadı.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginatedModels.map((model) => (
                <div
                  key={model.id}
                  className="group relative rounded-xl border border-border bg-card p-4 cursor-pointer transition-all duration-300 hover:border-purple-500/30 hover:bg-[#1a1a24] hover:translate-y-[-2px] flex flex-col"
                  onClick={() => handleModelSelect(model)}
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-neutral-900 border border-border">
                    <img
                      src={model.images["default"]}
                      alt={model.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                    {model.isBestseller && (
                      <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-[#7c6af7] to-[#a855f7] text-foreground text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow">
                        BEST SELLER
                      </span>
                    )}
                  </div>
                  {model.brand && (
                    <h4 className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-0.5">{model.brand}</h4>
                  )}
                  <h3 className="text-sm font-bold text-foreground line-clamp-2 mb-1 group-hover:text-purple-300 transition-colors flex-1">
                    {model.name}
                  </h3>
                  <p className="text-[10px] text-muted mb-3">ID #{model.id}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleModelSelect(model); }}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-lg text-xs font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                    Printify&apos;da Mokap Oluştur
                  </button>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <span className="text-xs text-secondary">
                Toplam <strong className="text-foreground">{filteredModels.length}</strong> üründen{" "}
                <strong className="text-foreground">
                  {(currentPage - 1) * itemsPerPage + 1} – {Math.min(currentPage * itemsPerPage, filteredModels.length)}
                </strong>{" "}
                arası
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-foreground bg-black/20 hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Önceki
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((p, i, arr) => (
                      <React.Fragment key={p}>
                        {i > 0 && arr[i - 1] !== p - 1 && (
                          <span className="text-foreground/30 text-xs px-1">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${
                            currentPage === p
                              ? "bg-purple-500 text-foreground border border-purple-400/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                              : "text-secondary hover:bg-white/[0.05] hover:text-foreground"
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    ))}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-foreground bg-black/20 hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Sonraki
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
