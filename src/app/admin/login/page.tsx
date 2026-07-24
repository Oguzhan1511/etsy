"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, User, Loader2, Zap } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh(); // Force refresh to apply middleware state
      } else {
        setError("Erişim reddedildi. Hatalı kullanıcı adı veya şifre.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Firewall Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      
      <div className="w-full max-w-md p-8 relative z-10 animate-fade-in-up">
        
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.4)] mb-6 border border-white/10">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">PrintySell Firewall</h1>
          <p className="text-white/40 text-sm text-center">Bu alan yalnızca yetkili sistem yöneticileri içindir. Lütfen master anahtarlarınızı girin.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-white/30 group-focus-within:text-red-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Kullanıcı Adı"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-all"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-white/30 group-focus-within:text-red-400 transition-colors" />
              </div>
              <input
                type="password"
                placeholder="Master Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden rounded-xl p-[1px] mt-6"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity blur-sm" />
            <div className="relative flex items-center justify-center gap-2 bg-black px-4 py-3.5 rounded-xl border border-white/10 group-hover:bg-transparent transition-all">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <>
                  <Zap className="w-5 h-5 text-white" />
                  <span className="font-bold text-white tracking-wide">Duvarı Aş</span>
                </>
              )}
            </div>
          </button>
        </form>
        
        <div className="mt-10 text-center">
          <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase">IP Kaydediliyor • Güvenli Bağlantı</p>
        </div>
      </div>
    </div>
  );
}
