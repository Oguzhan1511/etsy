"use client";

import React, { useState } from "react";
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
  AlertCircle
} from "lucide-react";

interface ListingProduct {
  id: string;
  title: string;
  sku: string;
  image: string;
  salesCount: number;
  cartCount: number;
  favoritesCount: number;
  revenue: number;
  profit: number;
  status: "Active" | "Inactive";
  description: string;
  tags: string[];
}

const initialProducts: ListingProduct[] = [
  {
    id: "1",
    title: "Wildflower Garden Custom Canvas Tote Bag",
    sku: "SKU: TOTE-WF-GARDEN",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=150&q=80",
    salesCount: 142,
    cartCount: 14,
    favoritesCount: 410,
    revenue: 3550,
    profit: 1980,
    status: "Active",
    description: "High quality organic cotton canvas tote bag featuring a beautiful wildflower print. Durable handles and spacious design perfect for daily grocery shopping, beach outings, or travel.",
    tags: ["tote bag", "canvas tote", "wildflowers", "custom bag", "eco friendly"]
  },
  {
    id: "2",
    title: "Golden Meadows Fine Art Accent Mug 11oz",
    sku: "SKU: MUG-GM-ACC-11",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=150&q=80",
    salesCount: 96,
    cartCount: 8,
    favoritesCount: 196,
    revenue: 1440,
    profit: 820,
    status: "Active",
    description: "Beautiful golden wildflower printed mug. 11oz capacity, ceramic construction, microwave and dishwasher safe. A perfect morning coffee companion.",
    tags: ["wildflower mug", "ceramic mug", "coffee mug", "gift for her", "golden meadows"]
  },
  {
    id: "3",
    title: "Retro Custom Botanical Unisex Tee",
    sku: "SKU: TEE-RET-BOT-M",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80",
    salesCount: 84,
    cartCount: 12,
    favoritesCount: 284,
    revenue: 2100,
    profit: 1150,
    status: "Active",
    description: "Super soft Bella+Canvas 3001 unisex t-shirt featuring a retro botanical print. Available in multiple colors and sizes. Made with premium lightweight ringspun cotton.",
    tags: ["botanical tee", "unisex shirt", "retro t-shirt", "bella canvas", "floral graphic"]
  },
  {
    id: "4",
    title: "Funny Sarcastic Soy Wax Jar Candle - Golden Meadows",
    sku: "SKU: CAND-SARC-SOY",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=150&q=80",
    salesCount: 38,
    cartCount: 6,
    favoritesCount: 410,
    revenue: 760,
    profit: 420,
    status: "Active",
    description: "100% natural soy wax jar candle with a humorous sarcastic label. Hand-poured with premium scent oils and a clean-burning cotton wick.",
    tags: ["soy candle", "funny candle", "scented candle", "jar candle", "gift candle"]
  },
  {
    id: "5",
    title: "Vintage Art Deco Accent Mug 15oz",
    sku: "SKU: MUG-VINT-DECO-15",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=150&q=80",
    salesCount: 12,
    cartCount: 3,
    favoritesCount: 78,
    revenue: 204,
    profit: 110,
    status: "Inactive",
    description: "15oz accent mug with an elegant vintage art deco geometric pattern. Premium ceramic coating, extra large size perfect for tea and hot cocoa lovers.",
    tags: ["art deco mug", "vintage mug", "15oz mug", "accent mug", "retro kitchen"]
  }
];

// Mock gallery presets for easy image swapping
const presetImages = [
  { name: "Tote Bag", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=150&q=80" },
  { name: "Mug", url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=150&q=80" },
  { name: "Tee", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80" },
  { name: "Candle", url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=150&q=80" }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ListingProduct[]>(initialProducts);
  const [filterTab, setFilterTab] = useState<"Active" | "Inactive">("Active");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<ListingProduct | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSku, setEditSku] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editImage, setEditImage] = useState("");

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
    setEditImage(product.image);
    setOpenDropdownId(null);
    setShowExitConfirm(false);
  };

  const checkUnsavedChanges = () => {
    if (!editingProduct) return false;
    const hasChanges =
      editTitle !== editingProduct.title ||
      editSku !== editingProduct.sku ||
      editDescription !== (editingProduct.description || "") ||
      editTags !== (editingProduct.tags ? editingProduct.tags.join(", ") : "") ||
      editImage !== editingProduct.image;
    return hasChanges;
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
    setProducts(prev =>
      prev.map(p =>
        p.id === editingProduct?.id
          ? {
              ...p,
              title: editTitle,
              sku: editSku,
              description: editDescription,
              image: editImage,
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
          <div className="bg-[#16161e] border border-white/[0.08] w-full max-w-lg rounded-2xl p-5 shadow-[0_16px_48px_rgba(0,0,0,0.6)] space-y-4 animate-scale-up">
            
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit2 size={14} className="text-purple-400" />
                <span>Ürünü Düzenle</span>
              </h3>
              <button 
                onClick={handleCloseAttempt}
                className="w-6 h-6 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#a09cb0] hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* 1. Ürün Görseli Değiştirme */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider block">Ürün Görseli</label>
                <div className="flex items-center gap-4">
                  {/* Current image preview */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-neutral-900 shrink-0 flex items-center justify-center">
                    <img src={editImage} alt="Edit preview" className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Preset quick swapping icons */}
                  <div className="space-y-1.5 flex-1">
                    <input
                      type="text"
                      placeholder="Görsel URL veya galeri şablonu seçin"
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-white/[0.08] bg-black/20 text-[11px] text-white focus:outline-none focus:border-purple-500/50"
                    />
                    <div className="flex gap-2">
                      {presetImages.map(img => (
                        <button
                          key={img.name}
                          type="button"
                          onClick={() => setEditImage(img.url)}
                          className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all border cursor-pointer ${
                            editImage === img.url
                              ? "bg-purple-500/20 border-purple-500/40 text-white"
                              : "bg-white/[0.02] border-white/[0.05] text-[#a09cb0] hover:text-white"
                          }`}
                        >
                          {img.name}
                        </button>
                      ))}
                    </div>
                  </div>
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
                  placeholder="örneğin: mug, coffee, ceramic, handmade"
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
