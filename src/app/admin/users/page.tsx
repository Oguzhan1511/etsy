"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  MoreVertical, 
  Zap, 
  ShieldCheck, 
  Crown,
  Loader2,
  Flame,
  Wallet,
  TrendingDown,
  Sparkles,
  Layers,
  FileText,
  Clock,
  ArrowUpRight
} from "lucide-react";

interface TokenUsageRecord {
  id: string;
  amount: number;
  actionType: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  tokens: number;
  spentTokens: number;
  estimatedCostTL: number;
  estimatedCostUSD: number;
  usageBreakdown: Record<string, number>;
  recentUsages: TokenUsageRecord[];
  paymentStatus: boolean;
  isVerified: boolean;
  createdAt: string;
  discountCode?: string | null;
}

interface SummaryData {
  totalUsers: number;
  totalTokensSpent: number;
  totalTokensRemaining: number;
  totalEstimatedCostTL: number;
  totalEstimatedCostUSD: number;
}

const ACTION_LABELS: Record<string, { label: string; icon: any; color: string }> = {
  mockup_generation: { label: "Mockup Stüdyosu", icon: Layers, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  ai_design_studio: { label: "AI Tasarım Stüdyosu", icon: Sparkles, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  ai_product_details: { label: "Etsy SEO / Başlık", icon: FileText, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [addTokenAmount, setAddTokenAmount] = useState(50);
  const [activeModalTab, setActiveModalTab] = useState<"usage" | "manage">("usage");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        if (data.summary) {
          setSummary(data.summary);
        }
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.discountCode && u.discountCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddTokens = async () => {
    if (!selectedUser) return;
    setIsActionLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD_TOKENS", userId: selectedUser.id, amount: addTokenAmount })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, tokens: u.tokens + addTokenAmount } : u));
        setSelectedUser({ ...selectedUser, tokens: selectedUser.tokens + addTokenAmount });
      }
    } catch (err) {
      console.error("Failed to add tokens", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSetPlan = async (newPlan: string) => {
    if (!selectedUser) return;
    setIsActionLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SET_PLAN", userId: selectedUser.id, newPlan })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, plan: newPlan, paymentStatus: newPlan !== 'none' } : u));
        setSelectedUser({ ...selectedUser, plan: newPlan, paymentStatus: newPlan !== 'none' });
      }
    } catch (err) {
      console.error("Failed to set plan", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    if (!window.confirm(`${selectedUser.name} adlı kullanıcıyı tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;
    
    setIsActionLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DELETE_USER", userId: selectedUser.id })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter(u => u.id !== selectedUser.id));
        if (summary) {
          setSummary({ ...summary, totalUsers: summary.totalUsers - 1 });
        }
        setSelectedUser(null);
      } else {
        alert("Silme işlemi başarısız: " + data.error);
      }
    } catch (err) {
      console.error("Failed to delete user", err);
      alert("Bir hata oluştu.");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  const avgSpentPerUser = summary && summary.totalUsers > 0 
    ? (summary.totalTokensSpent / summary.totalUsers).toFixed(1) 
    : "0";

  return (
    <div className="space-y-8 animate-fade-in relative pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-400" />
            Kullanıcılar & Token Tüketimi
          </h1>
          <p className="text-white/50 mt-1">Kullanıcıların harcadığı token miktarlarını, API maliyetlerini ve cüzdan bakiyelerini takip edin.</p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="Kullanıcı ara (email, isim)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 bg-white/5 border border-white/10 text-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-white/30 text-sm"
          />
        </div>
      </div>

      {/* Top Metric Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Toplam Kullanıcı</p>
                <h4 className="text-2xl font-extrabold text-white mt-1">{summary.totalUsers}</h4>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-white/40 mt-3">Ön kayıt & aktif satıcılar</p>
          </div>

          <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-rose-300/60 uppercase tracking-wider">Harcanan Token</p>
                <h4 className="text-2xl font-extrabold text-rose-400 mt-1 flex items-center gap-1.5">
                  <Flame className="w-5 h-5 text-rose-400" />
                  {summary.totalTokensSpent.toLocaleString('tr-TR')}
                </h4>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-rose-300/50 mt-3">
              Tahmini OpenAI Gideri: <strong className="text-rose-300 font-semibold">₺{summary.totalEstimatedCostTL}</strong> (~${summary.totalEstimatedCostUSD})
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-300/60 uppercase tracking-wider">Kalan Bakiye (Havuz)</p>
                <h4 className="text-2xl font-extrabold text-emerald-400 mt-1 flex items-center gap-1.5">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  {summary.totalTokensRemaining.toLocaleString('tr-TR')}
                </h4>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-emerald-300/50 mt-3">Kullanıcı hesaplarındaki aktif tokenlar</p>
          </div>

          <div className="p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-300/60 uppercase tracking-wider">Ortalama Harcama</p>
                <h4 className="text-2xl font-extrabold text-blue-400 mt-1">{avgSpentPerUser} <span className="text-sm font-normal text-white/50">Token / Kişi</span></h4>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-blue-300/50 mt-3">Kullanıcı başına ortalama tüketim</p>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase bg-white/5 border-b border-white/10 text-white/50 tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Kullanıcı</th>
                <th className="px-6 py-4 font-semibold">Paket Durumu</th>
                <th className="px-6 py-4 font-semibold">Kullanılan Kod</th>
                <th className="px-6 py-4 font-semibold">Harcanan Token</th>
                <th className="px-6 py-4 font-semibold">Kalan Cüzdan</th>
                <th className="px-6 py-4 font-semibold">Kayıt Tarihi</th>
                <th className="px-6 py-4 text-right font-semibold">Detay & İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  onClick={() => setSelectedUser(user)}
                >
                  {/* User Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex items-center justify-center border border-white/10 font-bold text-white shadow-inner">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2 group-hover:text-purple-300 transition-colors">
                          {user.name}
                          {user.role === 'ADMIN' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <ShieldCheck className="w-3 h-3" /> ADMIN
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-white/40">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Plan */}
                  <td className="px-6 py-4">
                    {user.plan === 'none' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-white/50 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                        Ön Kayıt
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-purple-400 text-xs font-semibold bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                        <Crown className="w-3.5 h-3.5" />
                        {user.plan.toUpperCase()}
                      </span>
                    )}
                  </td>

                  {/* Discount Code */}
                  <td className="px-6 py-4">
                    {user.discountCode ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                        {user.discountCode}
                      </span>
                    ) : (
                      <span className="text-xs text-white/20">-</span>
                    )}
                  </td>

                  {/* Spent Tokens (Maliyet) */}
                  <td className="px-6 py-4 font-mono">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 font-bold text-rose-400">
                        <Flame className="w-4 h-4 text-rose-400 fill-rose-400/20" />
                        <span>{user.spentTokens} Token</span>
                      </div>
                      <span className="text-[11px] text-white/40 font-normal">
                        ≈ ₺{user.estimatedCostTL} (${user.estimatedCostUSD})
                      </span>
                    </div>
                  </td>

                  {/* Remaining Tokens */}
                  <td className="px-6 py-4 font-mono">
                    <div className="inline-flex items-center gap-1.5 font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                      <Wallet className="w-3.5 h-3.5" />
                      {user.tokens} Token
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-xs text-white/40">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-600/20 hover:text-purple-300 border border-white/10 hover:border-purple-500/30 text-xs font-medium transition-all"
                    >
                      İncele & Yönet
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    Arama kriterine uygun kullanıcı bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced User Detail & Token Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in-fast">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden bg-[#0e0e14] max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                  {selectedUser.role === 'ADMIN' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/40 mt-0.5">{selectedUser.email}</p>
              </div>

              {/* Tabs */}
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setActiveModalTab("usage")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeModalTab === "usage" 
                      ? "bg-purple-600 text-white shadow" 
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Token Analizi
                </button>
                <button
                  onClick={() => setActiveModalTab("manage")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeModalTab === "manage" 
                      ? "bg-purple-600 text-white shadow" 
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Bakiye & Paket
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-1 custom-scrollbar">
              
              {activeModalTab === "usage" ? (
                <>
                  {/* Token Stat Summary Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                      <p className="text-[11px] font-medium text-rose-300/70 uppercase">Toplam Harcanan</p>
                      <h4 className="text-xl font-bold text-rose-400 mt-0.5">{selectedUser.spentTokens} Token</h4>
                      <p className="text-[10px] text-white/40 mt-1">≈ ₺{selectedUser.estimatedCostTL}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <p className="text-[11px] font-medium text-emerald-300/70 uppercase">Kalan Bakiye</p>
                      <h4 className="text-xl font-bold text-emerald-400 mt-0.5">{selectedUser.tokens} Token</h4>
                      <p className="text-[10px] text-white/40 mt-1">Cüzdan bakiyesi</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                      <p className="text-[11px] font-medium text-purple-300/70 uppercase">Tahmini Maliyet</p>
                      <h4 className="text-xl font-bold text-purple-400 mt-0.5">${selectedUser.estimatedCostUSD}</h4>
                      <p className="text-[10px] text-white/40 mt-1">OpenAI API gideri</p>
                    </div>
                  </div>

                  {/* Usage Breakdown by Action */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                    <h5 className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      İşlem Kırılımı (Kullanım Dağılımı)
                    </h5>
                    
                    <div className="space-y-2">
                      {Object.keys(ACTION_LABELS).map((actionKey) => {
                        const config = ACTION_LABELS[actionKey];
                        const count = selectedUser.usageBreakdown?.[actionKey] || 0;
                        const Icon = config.icon;
                        const percentage = selectedUser.spentTokens > 0 
                          ? Math.round((count / selectedUser.spentTokens) * 100) 
                          : 0;

                        return (
                          <div key={actionKey} className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                            <div className="flex items-center gap-2.5">
                              <div className={`p-1.5 rounded-md border ${config.color}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs font-medium text-white/90">{config.label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono font-bold text-white">{count} Token</span>
                              <span className="text-[10px] text-white/40 w-10 text-right">%{percentage}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Usage Logs */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      Son Harcama Geçmişi (Loglar)
                    </h5>

                    {selectedUser.recentUsages && selectedUser.recentUsages.length > 0 ? (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {selectedUser.recentUsages.map((usage) => {
                          const conf = ACTION_LABELS[usage.actionType] || { label: usage.actionType, color: "text-white/60 bg-white/5 border-white/10" };
                          return (
                            <div key={usage.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${conf.color}`}>
                                  {conf.label}
                                </span>
                                <span className="text-white/40 text-[11px]">
                                  {new Date(usage.createdAt).toLocaleString('tr-TR', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <span className="font-mono font-bold text-rose-400">-{usage.amount} Token</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-white/40">
                        Bu kullanıcı henüz hiç token harcaması yapmamış.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Management Tab (Token Gifting & Plans) */
                <div className="space-y-5">
                  {/* Token Gifting */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <h4 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      Token Yükle / Hediye Et
                    </h4>
                    
                    {/* Quick Select Buttons */}
                    <div className="flex gap-2">
                      {[20, 50, 100, 250].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setAddTokenAmount(amt)}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                            addTokenAmount === amt 
                              ? "bg-purple-600/30 border-purple-500 text-purple-300" 
                              : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          +{amt}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <input 
                        type="number" 
                        value={addTokenAmount}
                        onChange={(e) => setAddTokenAmount(Number(e.target.value))}
                        className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                      />
                      <button 
                        onClick={handleAddTokens}
                        disabled={isActionLoading}
                        className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-purple-600/30"
                      >
                        {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        Yükle
                      </button>
                    </div>
                  </div>

                  {/* Plan Assignment */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <h4 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                      <Crown className="w-4 h-4 text-purple-400" />
                      Paket Ata
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button 
                        onClick={() => handleSetPlan('none')} 
                        className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                          selectedUser.plan === 'none' 
                            ? 'bg-white/10 border-white/30 text-white font-bold' 
                            : 'border-white/5 text-white/40 hover:bg-white/5'
                        }`}
                      >
                        Ücretsiz / Ön Kayıt
                      </button>
                      <button 
                        onClick={() => handleSetPlan('starter')} 
                        className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                          selectedUser.plan === 'starter' 
                            ? 'bg-purple-500/20 border-purple-500 text-purple-400 font-bold' 
                            : 'border-white/5 text-white/40 hover:bg-white/5'
                        }`}
                      >
                        Starter (₺299/ay)
                      </button>
                      <button 
                        onClick={() => handleSetPlan('pro')} 
                        className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                          selectedUser.plan === 'pro' 
                            ? 'bg-purple-500/20 border-purple-500 text-purple-400 font-bold' 
                            : 'border-white/5 text-white/40 hover:bg-white/5'
                        }`}
                      >
                        Pro (₺599/ay)
                      </button>
                      <button 
                        onClick={() => handleSetPlan('agency')} 
                        className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                          selectedUser.plan === 'agency' 
                            ? 'bg-purple-500/20 border-purple-500 text-purple-400 font-bold' 
                            : 'border-white/5 text-white/40 hover:bg-white/5'
                        }`}
                      >
                        Agency (₺1.299/ay)
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-3 mt-4">
                    <h4 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
                      Tehlikeli İşlemler
                    </h4>
                    <p className="text-xs text-rose-300/60">Bu kullanıcıyı ve hesapla ilişkili tüm verileri kalıcı olarak siler.</p>
                    <button 
                      onClick={handleDeleteUser}
                      disabled={isActionLoading}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 w-full shadow-lg shadow-rose-600/20"
                    >
                      {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Kullanıcıyı Sil
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="border-t border-white/10 pt-4 mt-4 flex justify-end">
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold text-white transition-colors"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
