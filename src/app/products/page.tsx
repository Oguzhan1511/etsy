"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  Edit2,
  Trash2,
  EyeOff,
  Eye,
  MoreVertical,
  DollarSign,
  TrendingUp,
  Heart,
  ShoppingCart,
  ShoppingBag,
  CheckCircle,
  X,
  AlertCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  Loader2
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ProductImage {
  id: string;
  url: string;
  active: boolean;
}

interface ListingProduct {
  id: string;
  title: string;
  sku: string;
  image: string; // primary thumbnail
  salesCount: number;
  cartCount: number;
  favoritesCount: number;
  revenue: number;
  profit: number;
  status: "Active" | "Inactive";
  description: string;
  tags: string[];
  images: ProductImage[];
}

interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  tags: string[];
  visible: boolean;
  images: { src: string; is_default: boolean }[];
  variants: { price: number }[];
  shop_id?: string;
}

export default function ProductsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<ListingProduct[]>([]);
  const [printifyDrafts, setPrintifyDrafts] = useState<PrintifyProduct[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean; type?: "success" | "error" }>({ message: "", visible: false });

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ message: msg, visible: true, type });
    setTimeout(() => setToast({ message: "", visible: false }), 4000);
  };

  useEffect(() => {
    fetch('/api/etsy/listings')
      .then(res => res.json())
      .then(data => {
        if (!data.error && Array.isArray(data)) {
          const formatted = data.map((item: Record<string, unknown>) => {
             const imgs = item.images as Array<Record<string, unknown>>;
             const images = imgs ? imgs.map((rawImg: unknown, idx: number) => {
               const img = rawImg as Record<string, unknown>;
               return {
                 id: String(img.listing_image_id),
                 url: String(img.url_570xN || ""),
                 active: idx === 0
               };
             }) : [];

             return {
                id: String(item.listing_id),
                title: String(item.title),
                status: (String(item.state) === "active" ? "Active" : "Inactive") as "Active" | "Inactive",
                sku: "",
                image: images.length > 0 ? String(images[0].url) : "",
                salesCount: 0,
                cartCount: 0,
                favoritesCount: Number(item.num_favorers) || 0,
                revenue: 0,
                profit: 0,
                description: String(item.description || ""),
                tags: (item.tags as string[]) || [],
                images
             };
          });
          setProducts(formatted.filter((p: ListingProduct) => p.status === "Active"));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const [filterTab, setFilterTab] = useState<"Active" | "Inactive">("Active");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    if (filterTab === "Inactive" && printifyDrafts.length === 0 && !loadingDrafts) {
      setLoadingDrafts(true);
      fetch('/api/printify?action=products')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.data)) {
             const drafts = data.data.filter((p: any) => !p.visible);
             setPrintifyDrafts(drafts);
          } else if (Array.isArray(data)) {
             const drafts = data.filter((p: any) => !p.visible);
             setPrintifyDrafts(drafts);
          } else {
             showToast(t("products.fetchPrintifyDraftsError"), "error");
          }
        })
        .catch(() => showToast(t("products.fetchPrintifyDraftsError"), "error"))
        .finally(() => setLoadingDrafts(false));
    }
  }, [filterTab]);

  // Edit Product Modal State (Etsy)
  const [editingProduct, setEditingProduct] = useState<ListingProduct | null>(null);
  
  // Edit Printify Draft State
  const [editingDraft, setEditingDraft] = useState<PrintifyProduct | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editSku, setEditSku] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editImages, setEditImages] = useState<ProductImage[]>([]);
  const [largePreviewUrl, setLargePreviewUrl] = useState<string>("");

  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm(t("products.deleteConfirm"))) {
      setProducts(prev => prev.filter(p => p.id !== id));
      setOpenDropdownId(null);
    }
  };

  const startEdit = (product: ListingProduct) => {
    setEditingProduct(product);
    setEditTitle(product.title);
    setEditSku(product.sku);
    setEditDescription(product.description || "");
    setEditTags(product.tags ? product.tags.join(", ") : "");
    const copiedImages = product.images ? product.images.map(img => ({ ...img })) : [];
    setEditImages(copiedImages);
    const firstActive = copiedImages.find(i => i.active);
    setLargePreviewUrl(firstActive ? firstActive.url : product.image);
    setOpenDropdownId(null);
    setShowExitConfirm(false);
  };

  const startEditDraft = (draft: PrintifyProduct) => {
    setEditingDraft(draft);
    setEditTitle(draft.title);
    setEditDescription(draft.description || "");
    setEditTags(draft.tags ? draft.tags.join(", ") : "");
    setOpenDropdownId(null);
    setShowExitConfirm(false);
  };

  const handlePublishDraft = async (draft: PrintifyProduct) => {
    if (!draft.shop_id) {
       // Since shop_id is required for publishing via Printify proxy, try fetching from api first
       // or fallback to global store shopId. Assuming the API can infer the shopId if missing.
    }
    setPublishingId(draft.id);
    try {
      const res = await fetch("/api/printify?action=publish-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId: draft.shop_id || localStorage.getItem("printify_shop_id"), productId: draft.id })
      });
      if (res.ok) {
         showToast(t("products.publishSuccess"));
         // Remove item with animation delay
         setTimeout(() => {
           setPrintifyDrafts(prev => prev.filter(p => p.id !== draft.id));
         }, 400);
      } else {
         showToast("Yayınlama başarısız oldu.", "error");
      }
    } catch {
       showToast("Yayınlama hatası.", "error");
    } finally {
       setPublishingId(null);
    }
  };

  const saveEditDraft = async () => {
    if (!editTitle.trim() || !editingDraft) return;

    try {
      const res = await fetch("/api/printify?action=update-product", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           shopId: editingDraft.shop_id || localStorage.getItem("printify_shop_id"),
           productId: editingDraft.id,
           title: editTitle,
           description: editDescription,
           tags: editTags ? editTags.split(",").map(t => t.trim()).filter(t => t !== "") : []
        })
      });

      if (res.ok) {
         showToast("Ürün başarıyla güncellendi.");
         setPrintifyDrafts(prev =>
            prev.map(p =>
               p.id === editingDraft.id ? {
                 ...p,
                 title: editTitle,
                 description: editDescription,
                 tags: editTags ? editTags.split(",").map(t => t.trim()).filter(t => t !== "") : []
               } : p
            )
         );
         setEditingDraft(null);
      } else {
         showToast("Güncelleme başarısız oldu.", "error");
      }
    } catch {
      showToast("Bir hata oluştu.", "error");
    }
  };

  const checkUnsavedChanges = () => {
    if (editingProduct) {
      const metaChanged =
        editTitle !== editingProduct.title ||
        editSku !== editingProduct.sku ||
        editDescription !== (editingProduct.description || "") ||
        editTags !== (editingProduct.tags ? editingProduct.tags.join(", ") : "");
      if (metaChanged) return true;
      if (!editingProduct.images || editImages.length !== editingProduct.images.length) return true;
      for (let i = 0; i < editImages.length; i++) {
        if (editImages[i].url !== editingProduct.images[i].url) return true;
        if (editImages[i].active !== editingProduct.images[i].active) return true;
      }
    }
    if (editingDraft) {
      const metaChanged =
        editTitle !== editingDraft.title ||
        editDescription !== (editingDraft.description || "") ||
        editTags !== (editingDraft.tags ? editingDraft.tags.join(", ") : "");
      return metaChanged;
    }
    return false;
  };

  const handleCloseAttempt = () => {
    if (checkUnsavedChanges()) {
      setShowExitConfirm(true);
    } else {
      setEditingProduct(null);
      setEditingDraft(null);
    }
  };

  const saveEditEtsy = () => {
    if (!editTitle.trim()) return;
    const firstActiveImage = editImages.find(img => img.active);
    const primaryThumbnail = firstActiveImage ? firstActiveImage.url : (editImages[0]?.url || "");

    setProducts(prev =>
      prev.map(p =>
        p.id === editingProduct?.id
          ? {
              ...p,
              title: editTitle,
              sku: editSku,
              description: editDescription,
              image: primaryThumbnail,
              images: editImages,
              tags: editTags ? editTags.split(",").map(t => t.trim()).filter(t => t !== "") : []
            }
          : p
      )
    );
    setEditingProduct(null);
  };

  const handleMoveImageLeft = (index: number) => {
    if (index === 0) return;
    setEditImages(prev => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index - 1];
      next[index - 1] = temp;
      return next;
    });
  };

  const handleMoveImageRight = (index: number) => {
    if (index === editImages.length - 1) return;
    setEditImages(prev => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index + 1];
      next[index + 1] = temp;
      return next;
    });
  };

  const handleMakePrimary = (index: number) => {
    setEditImages(prev => {
      const next = [...prev];
      const [selected] = next.splice(index, 1);
      const activated = { ...selected, active: true }; // immutable — no mutation
      next.unshift(activated);
      setLargePreviewUrl(activated.url);
      return next;
    });
  };

  const handleToggleImageActive = (index: number) => {
    setEditImages(prev =>
      prev.map((img, i) =>
        i === index ? { ...img, active: !img.active } : img
      )
    );
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredDrafts = printifyDrafts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fade-in relative">
      
      {toast.visible && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-md animate-fade-in shadow-xl ${
          toast.type === 'error' ? 'bg-red-500/10 border-red-500/30' : 'bg-[#1e1b2e] border-purple-500/30'
        }`}>
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400" />
          ) : (
            <span className="text-green-400 text-lg">✓</span>
          )}
          <p className={`text-sm font-medium ${toast.type === 'error' ? 'text-red-300' : 'text-white'}`}>{toast.message}</p>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f1f0ff] to-[#a09cb0] bg-clip-text text-transparent">
            {t("products.title")}
          </h1>
          <p className="text-sm mt-0.5 text-[#a09cb0]">
            {t("products.subtitle")}
          </p>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#5e5a72] block uppercase font-bold tracking-wider">{t("products.activeProducts")}</span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {products.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Package size={18} />
          </div>
        </div>

        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#5e5a72] block uppercase font-bold tracking-wider">{t("products.inactiveProducts")}</span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {printifyDrafts.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <EyeOff size={18} />
          </div>
        </div>

        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#5e5a72] block uppercase font-bold tracking-wider">{t("products.totalInventoryRevenue")}</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block">
              ${products.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <DollarSign size={18} />
          </div>
        </div>

        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#5e5a72] block uppercase font-bold tracking-wider">{t("products.netInventoryProfit")}</span>
            <span className="text-2xl font-bold text-amber-400 mt-1 block">
              ${products.reduce((acc, curr) => acc + curr.profit, 0).toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <TrendingUp size={18} />
          </div>
        </div>
      </div>

      {/* Search and Filters Controller bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-black/10 p-3 rounded-xl border border-white/[0.03]">
        <div className="flex bg-white/[0.02] p-1 rounded-lg border border-white/[0.05] self-start">
          {[
            { id: "Active", label: t("products.activeProducts") },
            { id: "Inactive", label: t("products.inactiveProducts") }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setFilterTab(tab.id as "Active" | "Inactive"); setOpenDropdownId(null); }}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                filterTab === tab.id
                  ? "bg-purple-500/20 border border-purple-500/35 text-white"
                  : "text-[#a09cb0] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e5a72]" />
          <input
            type="text"
            placeholder={t("products.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-white/[0.08] bg-[#16161e] text-xs text-white placeholder-[#5e5a72] focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Listing Stack / Rows */}
      <div className="space-y-3 relative">
        {filterTab === "Active" ? (
          // ETSY ACTIVE PRODUCTS RENDER
          filteredProducts.length === 0 ? (
            <div className="p-12 text-center border border-white/[0.05] bg-black/5 rounded-xl space-y-2">
              <EyeOff className="w-8 h-8 text-[#5e5a72] mx-auto" />
              <p className="text-xs text-[#a09cb0]">{t("products.noProductsFound")}</p>
            </div>
          ) : (
            filteredProducts.map(p => (
              <div 
                key={p.id}
                className="bg-[#16161e] border border-white/[0.05] hover:border-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0 md:w-1/3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-neutral-900 flex items-center justify-center">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-normal truncate" title={p.title}>
                      {p.title}
                    </h3>
                    <span className="text-[9px] text-[#5e5a72] font-mono block">{p.sku}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:flex md:items-center md:justify-around md:flex-1 text-center md:text-left px-2">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-[#5e5a72] uppercase font-bold tracking-wider block">{t("products.sales")}</span>
                    <span className="text-xs font-bold text-white flex items-center gap-1 justify-center md:justify-start">
                      <ShoppingBag size={11} className="text-purple-400" />
                      <span>{p.salesCount}</span>
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-[#5e5a72] uppercase font-bold tracking-wider block">{t("products.cart")}</span>
                    <span className="text-xs font-bold text-white flex items-center gap-1 justify-center md:justify-start">
                      <ShoppingCart size={11} className="text-blue-400" />
                      <span>{p.cartCount}</span>
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-[#5e5a72] uppercase font-bold tracking-wider block">{t("products.favorite")}</span>
                    <span className="text-xs font-bold text-white flex items-center gap-1 justify-center md:justify-start">
                      <Heart size={11} className="text-pink-400" />
                      <span>{p.favoritesCount}</span>
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-[#5e5a72] uppercase font-bold tracking-wider block">{t("products.revenue")}</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5 justify-center md:justify-start">
                      <span>${p.revenue.toLocaleString()}</span>
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-[#5e5a72] uppercase font-bold tracking-wider block">{t("products.profit")}</span>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5 justify-center md:justify-start">
                      <span>${p.profit.toLocaleString()}</span>
                    </span>
                  </div>
                </div>

                <div className="relative self-end md:self-auto shrink-0 z-20">
                  <button
                    onClick={() => setOpenDropdownId(openDropdownId === p.id ? null : p.id)}
                    className="w-8 h-8 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 flex items-center justify-center text-[#a09cb0] hover:text-white cursor-pointer"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {openDropdownId === p.id && (
                    <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-[#16161e] border border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.5)] p-1.5 space-y-1 z-30">
                      <button
                        onClick={() => startEdit(p)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-[11px] text-white font-semibold cursor-pointer text-left"
                      >
                        <Edit2 size={12} className="text-[#a09cb0]" />
                        <span>{t("products.edit")}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-[11px] text-white font-semibold cursor-pointer text-left"
                      >
                        <Trash2 size={12} className="text-red-400" />
                        <span>{t("products.delete")}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )
        ) : (
          // PRINTIFY DRAFTS RENDER
          loadingDrafts ? (
            <div className="flex flex-col items-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              <p className="text-xs text-[#a09cb0]">Printify taslakları yükleniyor...</p>
            </div>
          ) : filteredDrafts.length === 0 ? (
            <div className="p-12 text-center border border-white/[0.05] bg-black/5 rounded-xl space-y-2">
              <EyeOff className="w-8 h-8 text-[#5e5a72] mx-auto" />
              <p className="text-xs text-[#a09cb0]">{t("products.noProductsFound")}</p>
            </div>
          ) : (
            filteredDrafts.map(p => {
              const mainImage = p.images?.find(i => i.is_default)?.src || p.images?.[0]?.src || "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80";
              const priceArr = p.variants?.map(v => v.price) || [0];
              const minPrice = Math.min(...priceArr) / 100;
              const maxPrice = Math.max(...priceArr) / 100;
              const priceDisplay = minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
              const isPublishing = publishingId === p.id;

              return (
                <div 
                  key={p.id}
                  className={`bg-[#16161e] border border-white/[0.05] hover:border-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-500 ${isPublishing ? 'opacity-0 translate-x-full scale-95' : 'opacity-100 translate-x-0 scale-100'}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 md:w-1/2">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-neutral-900 flex items-center justify-center">
                      <img src={mainImage} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 space-y-1.5">
                      <h3 className="text-sm font-bold text-white leading-normal line-clamp-2" title={p.title}>
                        {p.title}
                      </h3>
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-semibold border border-purple-500/20">
                          {t("products.variantCount")}: {p.variants?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 px-2 md:px-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-[#5e5a72] uppercase font-bold tracking-wider block mb-0.5">Satış Fiyatı</span>
                      <span className="text-sm font-bold text-emerald-400 block">{priceDisplay}</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => startEditDraft(p)}
                        className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/[0.08] text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-none cursor-pointer"
                      >
                        <Edit2 size={12} className="text-[#a09cb0]" />
                        Düzenle
                      </button>
                      <button
                        onClick={() => handlePublishDraft(p)}
                        disabled={isPublishing}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 border border-emerald-500/50 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-none shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPublishing ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={14} />}
                        {t("products.publishToEtsy")}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )
        )}
      </div>

      {/* Edit Product Modal Dialog (Etsy Version) */}
      {editingProduct && filterTab === "Active" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-[#16161e] border border-white/[0.08] w-full max-w-xl rounded-2xl p-5 shadow-[0_16px_48px_rgba(0,0,0,0.6)] space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit2 size={14} className="text-purple-400" />
                <span>{t("products.editProduct")}</span>
              </h3>
              <button 
                type="button"
                onClick={handleCloseAttempt}
                className="w-6 h-6 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#a09cb0] hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider block">{t("products.productImagesDrag")}</label>
                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/[0.06] bg-neutral-950 flex items-center justify-center">
                  <img src={largePreviewUrl} alt="Large preview" className="h-full object-contain" />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/75 rounded-lg text-[9px] text-white/80 font-medium">
                    {t("products.largePreview")}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2.5 pt-1">
                  {editImages.map((img, index) => {
                    const isPrimary = index === 0;
                    const isSelected = largePreviewUrl === img.url;
                    return (
                      <div
                        key={img.id}
                        className={`relative group rounded-xl overflow-hidden border transition-all duration-300 aspect-square bg-neutral-900 ${
                          isSelected ? "border-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.4)]" : img.active ? isPrimary ? "border-purple-500/50" : "border-white/[0.08]" : "border-white/[0.04]"
                        }`}
                      >
                        <button type="button" onClick={() => setLargePreviewUrl(img.url)} className="absolute inset-0 w-full h-full cursor-pointer z-0">
                          <img src={img.url} alt={`Thumbnail ${index}`} className={`w-full h-full object-cover transition-[filter,opacity] duration-300 ease-in-out ${img.active ? "grayscale-0 opacity-100" : "grayscale opacity-30"}`} />
                        </button>
                        <div className="absolute top-1 left-1.5 flex gap-1 z-20 pointer-events-none">
                          {isPrimary && img.active && <span className="text-[8px] font-bold text-white bg-purple-500 px-1 py-0.5 rounded leading-none">{t("products.primary")}</span>}
                          {!img.active && <span className="text-[8px] font-bold text-white/80 bg-black/60 px-1 py-0.5 rounded leading-none uppercase">{t("products.passive")}</span>}
                          {isSelected && <span className="text-[8px] font-bold text-white bg-purple-500/80 px-1 py-0.5 rounded leading-none">●</span>}
                        </div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                          <div className="absolute inset-0 bg-black/50 pointer-events-none" />
                          <div className="absolute top-1 right-1 flex gap-1 pointer-events-auto">
                            <button type="button" onClick={(e) => { e.stopPropagation(); handleMoveImageLeft(index); }} disabled={index === 0} className="w-5 h-5 bg-black/60 hover:bg-black/90 rounded flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"><ChevronLeft size={12} /></button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); handleMoveImageRight(index); }} disabled={index === editImages.length - 1} className="w-5 h-5 bg-black/60 hover:bg-black/90 rounded flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"><ChevronRight size={12} /></button>
                          </div>
                          <div className="absolute bottom-1 right-1 flex gap-1 pointer-events-auto">
                            {img.active && <button type="button" onClick={(e) => { e.stopPropagation(); handleMakePrimary(index); }} className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-colors ${isPrimary ? "bg-purple-500 text-white" : "bg-black/60 hover:bg-purple-500 text-white"}`}><Star size={11} className={isPrimary ? "fill-white" : ""} /></button>}
                            <button type="button" onClick={(e) => { e.stopPropagation(); handleToggleImageActive(index); }} className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-colors ${img.active ? "bg-black/60 hover:bg-white/20 text-white" : "bg-white/10 hover:bg-emerald-500/60 text-white/60 hover:text-white"}`}>{img.active ? <Eye size={11} /> : <EyeOff size={11} />}</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider">{t("products.productTitle")}</label>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider">{t("products.skuCode")}</label>
                <input type="text" value={editSku} onChange={(e) => setEditSku(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider">{t("products.productDesc")}</label>
                <textarea rows={3} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50 resize-none leading-relaxed" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider">{t("products.productTags")}</label>
                <input type="text" placeholder={t("products.tagsPlaceholder")} value={editTags} onChange={(e) => setEditTags(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.04]">
              <button type="button" onClick={handleCloseAttempt} className="px-4 py-2 border border-white/[0.06] hover:bg-white/5 text-[#a09cb0] hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer">{t("products.cancel")}</button>
              <button type="button" onClick={saveEditEtsy} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:brightness-110 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-500/10"><CheckCircle size={12} /><span>{t("products.confirm")}</span></button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal Dialog (Printify Draft Version) */}
      {editingDraft && filterTab === "Inactive" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-[#16161e] border border-white/[0.08] w-full max-w-xl rounded-2xl p-5 shadow-[0_16px_48px_rgba(0,0,0,0.6)] space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit2 size={14} className="text-purple-400" />
                <span>Printify Taslağını Düzenle</span>
              </h3>
              <button 
                type="button"
                onClick={handleCloseAttempt}
                className="w-6 h-6 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#a09cb0] hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider">{t("products.productTitle")}</label>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider">{t("products.productDesc")}</label>
                <textarea rows={6} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50 resize-none leading-relaxed" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider">{t("products.productTags")} (Virgül ile ayırın)</label>
                <input type="text" placeholder={t("products.tagsPlaceholder")} value={editTags} onChange={(e) => setEditTags(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.04]">
              <button type="button" onClick={handleCloseAttempt} className="px-4 py-2 border border-white/[0.06] hover:bg-white/5 text-[#a09cb0] hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer">{t("products.cancel")}</button>
              <button type="button" onClick={saveEditDraft} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:brightness-110 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-500/10"><CheckCircle size={12} /><span>Kaydet ve Kapat</span></button>
            </div>
          </div>
        </div>
      )}

      {/* Unsaved Changes Confirmation Dialog Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#181822] border border-white/[0.08] w-full max-w-sm rounded-xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-4 text-center animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto">
              <AlertCircle size={22} className="animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-white">{t("products.unsavedChanges")}</h4>
              <p className="text-xs text-[#a09cb0] leading-relaxed px-2">
                {t("products.unsavedChangesDesc")}
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => { setShowExitConfirm(false); setEditingProduct(null); setEditingDraft(null); }} className="px-4 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold transition-all cursor-pointer">{t("products.cancelExit")}</button>
              <button onClick={() => setShowExitConfirm(false)} className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-white rounded-lg text-xs font-bold transition-all cursor-pointer">{t("products.continueEdit")}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
