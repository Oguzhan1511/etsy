"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  MoreVertical, 
  Zap, 
  ShieldCheck, 
  Crown,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  tokens: number;
  paymentStatus: boolean;
  isVerified: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [addTokenAmount, setAddTokenAmount] = useState(50);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        // Update local state
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, tokens: u.tokens + addTokenAmount } : u));
        setSelectedUser(null);
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
        setSelectedUser(null);
      }
    } catch (err) {
      console.error("Failed to set plan", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            Kullanıcı Yönetimi
          </h1>
          <p className="text-white/50 mt-1">Sistemdeki tüm üyeleri görüntüleyin, paket ve token atamaları yapın.</p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="Kullanıcı ara (email, isim)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 bg-white/5 border border-white/10 text-white rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Kullanıcı</th>
                <th className="px-6 py-4 font-semibold">Durum</th>
                <th className="px-6 py-4 font-semibold">Paket</th>
                <th className="px-6 py-4 font-semibold">Bakiye (Token)</th>
                <th className="px-6 py-4 font-semibold">Kayıt Tarihi</th>
                <th className="px-6 py-4 text-right font-semibold">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10">
                        <span className="font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          {user.name}
                          {user.role === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <div className="text-xs text-white/40">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Onaylı
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        <XCircle className="w-3.5 h-3.5" />
                        Bekliyor
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.plan === 'none' ? (
                      <span className="text-white/40">Ücretsiz</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-purple-400 font-semibold bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                        <Crown className="w-3.5 h-3.5" />
                        {user.plan}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono font-medium">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-yellow-500" />
                      {user.tokens}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/40">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-white/40">
                    Kullanıcı bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-fast">
          <div className="w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden bg-[#11111a]">
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-1">Kullanıcı Yönetimi</h3>
              <p className="text-xs text-white/40">{selectedUser.email}</p>
            </div>

            <div className="space-y-6">
              {/* Token Gifting */}
              <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <h4 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Token Hediye Et
                </h4>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    value={addTokenAmount}
                    onChange={(e) => setAddTokenAmount(Number(e.target.value))}
                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                  <button 
                    onClick={handleAddTokens}
                    disabled={isActionLoading}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    Yükle
                  </button>
                </div>
              </div>

              {/* Plan Assignment */}
              <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <h4 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-purple-400" />
                  Paket Ata
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleSetPlan('none')} className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${selectedUser.plan === 'none' ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-white/40 hover:bg-white/5'}`}>Ücretsiz</button>
                  <button onClick={() => handleSetPlan('starter')} className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${selectedUser.plan === 'starter' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'border-white/5 text-white/40 hover:bg-white/5'}`}>Starter</button>
                  <button onClick={() => handleSetPlan('pro')} className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${selectedUser.plan === 'pro' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'border-white/5 text-white/40 hover:bg-white/5'}`}>Pro</button>
                  <button onClick={() => handleSetPlan('agency')} className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${selectedUser.plan === 'agency' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'border-white/5 text-white/40 hover:bg-white/5'}`}>Agency</button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold text-white transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
