"use client";

import React, { useState, useEffect } from "react";
import { Tag, Plus, Check, X, Trash2, Power } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Discount = {
  id: string;
  code: string;
  discountPct: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    users: number;
  };
};

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState("");
  const [newPct, setNewPct] = useState(20);
  const [isCreating, setIsCreating] = useState(false);

  const fetchDiscounts = async () => {
    try {
      const res = await fetch("/api/admin/discounts");
      const data = await res.json();
      if (data.discounts) {
        setDiscounts(data.discounts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || newPct <= 0 || newPct > 100) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: newCode.trim(), discountPct: newPct }),
      });
      const data = await res.json();
      if (data.discount) {
        setNewCode("");
        setNewPct(20);
        fetchDiscounts();
      } else {
        alert(data.error || "Hata oluştu");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/admin/discounts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      fetchDiscounts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu indirim kodunu silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/admin/discounts/${id}`, {
        method: "DELETE",
      });
      fetchDiscounts();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="p-8 text-white/50">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f1f0ff] to-[#a09cb0] bg-clip-text text-transparent">
          İndirim Kodları
        </h1>
        <p className="text-sm mt-0.5 text-secondary">
          Kullanıcıların ödeme yaparken kullanabileceği indirim kodlarını yönetin.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
          <Plus size={20} className="text-emerald-400" />
          Yeni İndirim Kodu Oluştur
        </h2>
        <form onSubmit={handleCreate} className="flex items-end gap-4">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-bold text-muted uppercase tracking-wider block">İndirim Kodu</label>
            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="Örn: YUSUF20"
              className="w-full px-3 py-2 rounded-xl border border-border bg-black/20 text-sm text-foreground focus:outline-none focus:border-purple-500/50 uppercase"
              required
            />
          </div>
          <div className="w-32 space-y-1.5">
            <label className="text-xs font-bold text-muted uppercase tracking-wider block">İndirim Oranı (%)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={newPct}
              onChange={(e) => setNewPct(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-border bg-black/20 text-sm text-foreground focus:outline-none focus:border-purple-500/50"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold disabled:opacity-50 transition-colors"
          >
            {isCreating ? "Oluşturuluyor..." : "Oluştur"}
          </button>
        </form>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 border-b border-white/5">
                <th className="py-4 px-6 text-xs font-bold text-muted uppercase tracking-wider">Kod</th>
                <th className="py-4 px-6 text-xs font-bold text-muted uppercase tracking-wider">İndirim Oranı</th>
                <th className="py-4 px-6 text-xs font-bold text-muted uppercase tracking-wider">Kullanım Sayısı</th>
                <th className="py-4 px-6 text-xs font-bold text-muted uppercase tracking-wider">Durum</th>
                <th className="py-4 px-6 text-xs font-bold text-muted uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-purple-400" />
                      <span className="font-mono font-bold text-foreground bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        {discount.code}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-emerald-400">%{discount.discountPct}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-secondary font-medium">{discount._count.users} kişi</span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggle(discount.id, discount.isActive)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                        discount.isActive
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                      }`}
                    >
                      {discount.isActive ? <Check size={12} /> : <X size={12} />}
                      {discount.isActive ? "Aktif" : "Pasif"}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(discount.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {discounts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 px-6 text-center text-secondary text-sm">
                    Henüz indirim kodu oluşturulmamış.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
