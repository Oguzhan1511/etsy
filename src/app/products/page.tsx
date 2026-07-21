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
  ChevronLeft,
  ChevronRight,
  Star
} from "lucide-react";

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

export default function ProductsPage() {
  const [products, setProducts] = useState<ListingProduct[]>([]);
  const [loading, setLoading] = useState(true);

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
          setProducts(formatted);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  const [filterTab, setFilterTab] = useState<"Active" | "Inactive">("Active");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<ListingProduct | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSku, setEditSku] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editImages, setEditImages] = useState<ProductImage[]>([]);
  const [largePreviewUrl, setLargePreviewUrl] = useState<string>("");

  // Unsaved changes confirmation dialog state
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleDeactivate = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, status: "Inactive" } : p))
    );
    setOpenDropdownId(null);
  };

  const handleReactivate = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, status: "Active" } : p))
    );
    setOpenDropdownId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
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
    // Copy the images array deeply
    const copiedImages = product.images ? product.images.map(img => ({ ...img })) : [];
    setEditImages(copiedImages);
    
    // Set default large preview to the active primary image
    const firstActive = copiedImages.find(i => i.active);
    setLargePreviewUrl(firstActive ? firstActive.url : product.image);

    setOpenDropdownId(null);
    setShowExitConfirm(false);
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

  const checkUnsavedChanges = () => {
    if (!editingProduct) return false;
    
    // Check if titles or metadata are different
    const metaChanged =
      editTitle !== editingProduct.title ||
      editSku !== editingProduct.sku ||
      editDescription !== (editingProduct.description || "") ||
      editTags !== (editingProduct.tags ? editingProduct.tags.join(", ") : "");
      
    // Check if images array list matches exactly (length, order, and active state)
    if (metaChanged) return true;
    if (!editingProduct.images || editImages.length !== editingProduct.images.length) return true;
    
    for (let i = 0; i < editImages.length; i++) {
      if (editImages[i].url !== editingProduct.images[i].url) return true;
      if (editImages[i].active !== editingProduct.images[i].active) return true;
    }
    return false;
  };

  const handleCloseAttempt = () => {
    if (checkUnsavedChanges()) {
      setShowExitConfirm(true);
    } else {
      setEditingProduct(null);
    }
  };

  const saveEdit = () => {
    if (!editTitle.trim()) return;

    // The primary thumbnail is the first active image in the list, or fallback to first image
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

  const filteredProducts = products.filter(p => {
    const matchesTab = p.status === filterTab;
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f1f0ff] to-[#a09cb0] bg-clip-text text-transparent">
            Etsy Listings Envanteri
          </h1>
          <p className="text-sm mt-0.5 text-[#a09cb0]">
            Etsy mağazanızdaki aktif ve inaktif ürünleri listeleyin, istatistikleri takip edin ve listelemelerinizi yönetin.
          </p>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#5e5a72] block uppercase font-bold tracking-wider">Aktif Ürünler</span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {products.filter(p => p.status === "Active").length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Package size={18} />
          </div>
        </div>

        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#5e5a72] block uppercase font-bold tracking-wider">İnaktif Ürünler</span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {products.filter(p => p.status === "Inactive").length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <EyeOff size={18} />
          </div>
        </div>

        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#5e5a72] block uppercase font-bold tracking-wider">Toplam Envanter Cirosu</span>
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
            <span className="text-[10px] text-[#5e5a72] block uppercase font-bold tracking-wider">Net Envanter Kârı</span>
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
            { id: "Active", label: "Aktif Ürünler" },
            { id: "Inactive", label: "İnaktif Ürünler" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as "Active" | "Inactive")}
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
            placeholder="Başlık veya SKU ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-white/[0.08] bg-[#16161e] text-xs text-white placeholder-[#5e5a72] focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Listing Stack / Rows */}
      <div className="space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center border border-white/[0.05] bg-black/5 rounded-xl space-y-2">
            <EyeOff className="w-8 h-8 text-[#5e5a72] mx-auto" />
            <p className="text-xs text-[#a09cb0]">Seçilen kategoride listelenecek ürün bulunamadı.</p>
          </div>
        ) : (
          filteredProducts.map(p => (
            <div 
              key={p.id}
              className="bg-[#16161e] border border-white/[0.05] hover:border-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              {/* Product Info Block */}
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

              {/* Stats Section Inline */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:flex md:items-center md:justify-around md:flex-1 text-center md:text-left px-2">
                
                {/* Sales */}
                <div className="space-y-0.5">
                  <span className="text-[9px] text-[#5e5a72] uppercase font-bold tracking-wider block">Satış</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1 justify-center md:justify-start">
                    <ShoppingBag size={11} className="text-purple-400" />
                    <span>{p.salesCount}</span>
                  </span>
                </div>

                {/* In Carts */}
                <div className="space-y-0.5">
                  <span className="text-[9px] text-[#5e5a72] uppercase font-bold tracking-wider block">Sepet</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1 justify-center md:justify-start">
                    <ShoppingCart size={11} className="text-blue-400" />
                    <span>{p.cartCount}</span>
                  </span>
                </div>

                {/* Favorites */}
                <div className="space-y-0.5">
                  <span className="text-[9px] text-[#5e5a72] uppercase font-bold tracking-wider block">Favori</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1 justify-center md:justify-start">
                    <Heart size={11} className="text-pink-400" />
                    <span>{p.favoritesCount}</span>
                  </span>
                </div>

                {/* Revenue */}
                <div className="space-y-0.5">
                  <span className="text-[9px] text-[#5e5a72] uppercase font-bold tracking-wider block">Ciro</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5 justify-center md:justify-start">
                    <span>${p.revenue.toLocaleString()}</span>
                  </span>
                </div>

                {/* Profit */}
                <div className="space-y-0.5">
                  <span className="text-[9px] text-[#5e5a72] uppercase font-bold tracking-wider block">Kâr</span>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5 justify-center md:justify-start">
                    <span>${p.profit.toLocaleString()}</span>
                  </span>
                </div>

              </div>

              {/* Actions Dropdown Button Menu */}
              <div className="relative self-end md:self-auto shrink-0 z-20">
                <button
                  onClick={() => setOpenDropdownId(openDropdownId === p.id ? null : p.id)}
                  className="w-8 h-8 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 flex items-center justify-center text-[#a09cb0] hover:text-white cursor-pointer"
                >
                  <MoreVertical size={16} />
                </button>

                {openDropdownId === p.id && (
                  <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-[#16161e] border border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.5)] p-1.5 space-y-1">
                    <button
                      onClick={() => startEdit(p)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-[11px] text-white font-semibold cursor-pointer text-left"
                    >
                      <Edit2 size={12} className="text-[#a09cb0]" />
                      <span>Düzenle</span>
                    </button>

                    {p.status === "Active" ? (
                      <button
                        onClick={() => handleDeactivate(p.id)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-amber-500/10 hover:text-amber-400 text-[11px] text-white font-semibold cursor-pointer text-left"
                      >
                        <EyeOff size={12} className="text-amber-400" />
                        <span>İnaktif Yap</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivate(p.id)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 text-[11px] text-white font-semibold cursor-pointer text-left"
                      >
                        <Eye size={12} className="text-emerald-400" />
                        <span>Aktif Et</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-[11px] text-white font-semibold cursor-pointer text-left"
                    >
                      <Trash2 size={12} className="text-red-400" />
                      <span>Sil</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Edit Product Modal Dialog */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-[#16161e] border border-white/[0.08] w-full max-w-xl rounded-2xl p-5 shadow-[0_16px_48px_rgba(0,0,0,0.6)] space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit2 size={14} className="text-purple-400" />
                <span>Ürünü Düzenle</span>
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
              
              {/* 1. Ürün Görseli Değiştirme (Visual Grid Reorder & Toggle) */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider block">Ürün Görselleri (Sürükleme ve Düzenleme)</label>
                
                {/* Large Preview Panel */}
                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/[0.06] bg-neutral-950 flex items-center justify-center">
                  <img src={largePreviewUrl} alt="Large preview" className="h-full object-contain" />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/75 rounded-lg text-[9px] text-white/80 font-medium">
                    Büyük Önizleme
                  </div>
                </div>

                {/* Side-by-side Images Grid */}
                <div className="grid grid-cols-4 gap-2.5 pt-1">
                  {editImages.map((img, index) => {
                    const isPrimary = index === 0;
                    const isSelected = largePreviewUrl === img.url;
                    return (
                      <div
                        key={img.id}
                        className={`relative group rounded-xl overflow-hidden border transition-all duration-300 aspect-square bg-neutral-900 ${
                          isSelected
                            ? "border-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.4)]"
                            : img.active
                              ? isPrimary
                                ? "border-purple-500/50"
                                : "border-white/[0.08]"
                              : "border-white/[0.04]"
                        }`}
                      >
                        {/* Clickable image — tıklanınca büyük önizlemeyi günceller */}
                        <button
                          type="button"
                          onClick={() => setLargePreviewUrl(img.url)}
                          className="absolute inset-0 w-full h-full cursor-pointer z-0"
                        >
                          <img
                            src={img.url}
                            alt={`Listing thumbnail ${index}`}
                            className={`w-full h-full object-cover transition-[filter,opacity] duration-300 ease-in-out ${
                              img.active ? "grayscale-0 opacity-100" : "grayscale opacity-30"
                            }`}
                          />
                        </button>

                        {/* Top badges — pointer-events-none so they don't block click */}
                        <div className="absolute top-1 left-1.5 flex gap-1 z-20 pointer-events-none">
                          {isPrimary && img.active && (
                            <span className="text-[8px] font-bold text-white bg-purple-500 px-1 py-0.5 rounded leading-none">
                              ANA
                            </span>
                          )}
                          {!img.active && (
                            <span className="text-[8px] font-bold text-white/80 bg-black/60 px-1 py-0.5 rounded leading-none uppercase">
                              Pasif
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-[8px] font-bold text-white bg-purple-500/80 px-1 py-0.5 rounded leading-none">
                              ●
                            </span>
                          )}
                        </div>

                        {/* Hover control bar — only appears on hover, positioned at top and bottom edges */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                          <div className="absolute inset-0 bg-black/50 pointer-events-none" />

                          {/* Top row: left/right arrows */}
                          <div className="absolute top-1 right-1 flex gap-1 pointer-events-auto">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleMoveImageLeft(index); }}
                              disabled={index === 0}
                              className="w-5 h-5 bg-black/60 hover:bg-black/90 rounded flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <ChevronLeft size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleMoveImageRight(index); }}
                              disabled={index === editImages.length - 1}
                              className="w-5 h-5 bg-black/60 hover:bg-black/90 rounded flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <ChevronRight size={12} />
                            </button>
                          </div>

                          {/* Bottom row: star + eye toggle */}
                          <div className="absolute bottom-1 right-1 flex gap-1 pointer-events-auto">
                            {img.active && (
                              <button
                                type="button"
                                title="Ana Görsel Yap"
                                onClick={(e) => { e.stopPropagation(); handleMakePrimary(index); }}
                                className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-colors ${
                                  isPrimary ? "bg-purple-500 text-white" : "bg-black/60 hover:bg-purple-500 text-white"
                                }`}
                              >
                                <Star size={11} className={isPrimary ? "fill-white" : ""} />
                              </button>
                            )}
                            <button
                              type="button"
                              title={img.active ? "Gizle (İnaktif Yap)" : "Göster (Aktif Et)"}
                              onClick={(e) => { e.stopPropagation(); handleToggleImageActive(index); }}
                              className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-colors ${
                                img.active
                                  ? "bg-black/60 hover:bg-white/20 text-white"
                                  : "bg-white/10 hover:bg-emerald-500/60 text-white/60 hover:text-white"
                              }`}
                            >
                              {img.active ? <Eye size={11} /> : <EyeOff size={11} />}
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Ürün Başlığı Değişme */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider">Ürün Başlığı</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>

              {/* SKU code input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider">SKU Kodu</label>
                <input
                  type="text"
                  value={editSku}
                  onChange={(e) => setEditSku(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>

              {/* 3. Ürün Açıklaması Değişme */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider">Ürün Açıklaması</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50 resize-none leading-relaxed"
                />
              </div>

              {/* 4. Ürün Tag Değiştirme */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider">Ürün Tagleri (Virgülle Ayırın)</label>
                <input
                  type="text"
                  placeholder="örneğin: tote, canvas, wildflowers"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.04]">
              <button
                type="button"
                onClick={handleCloseAttempt}
                className="px-4 py-2 border border-white/[0.06] hover:bg-white/5 text-[#a09cb0] hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:brightness-110 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-500/10"
              >
                <CheckCircle size={12} />
                <span>Onayla</span>
              </button>
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
              <h4 className="text-sm font-bold text-white">Kaydedilmemiş Değişiklikler Var</h4>
              <p className="text-xs text-[#a09cb0] leading-relaxed px-2">
                Düzenlemeden çıkmak istediğinize emin misiniz? Yaptığınız tüm değişiklikler kaybolacaktır.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  setEditingProduct(null); // Discards edits
                }}
                className="px-4 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                İptal Et (Çık)
              </button>
              <button
                onClick={() => setShowExitConfirm(false)} // Returns to editing
                className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Devam Et (Düzenle)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
