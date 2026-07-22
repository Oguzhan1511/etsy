"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const plans = {
    standart: { name: "Standart Plan", price: "$6.00" },
    pro: { name: "Pro Plan", price: "$10.00" },
    plus: { name: "Plus Plan", price: "$18.00" },
  };

  const selectedPlan = plans[planId as keyof typeof plans] || plans.pro;

  // Protect route
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (user.paymentStatus) {
      router.replace("/");
    }
  }, [user, router]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      const res = await fetch("/api/auth/update-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, plan: selectedPlan.name }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Update local storage so the UI knows immediately
        if (user) {
          const updatedUser = { ...user, plan: selectedPlan.name, paymentStatus: true };
          localStorage.setItem("printysell-auth-user", JSON.stringify(updatedUser));
        }
        
        setSuccess(true);
        setTimeout(() => {
          // Hard reload to refresh layout and context
          window.location.href = "/";
        }, 1500);
      } else {
        alert("Ödeme alınırken bir hata oluştu: " + data.error);
        setLoading(false);
      }
    } catch (err) {
      alert("Bağlantı hatası.");
      setLoading(false);
    }
  };

  if (!user) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 animate-pulse">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Ödeme Başarılı!</h1>
        <p className="text-foreground/60">Panele yönlendiriliyorsunuz, lütfen bekleyin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 to-transparent pointer-events-none" />
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Order Summary */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Ödeme Ekranı</h1>
            <p className="text-foreground/60">Güvenli ödeme altyapısıyla aboneliğinizi başlatın.</p>
          </div>

          <div className="bg-white/[0.02] border border-border rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-4">Sipariş Özeti</h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-foreground/80">{selectedPlan.name} (Aylık)</span>
              <span className="text-foreground font-bold">{selectedPlan.price}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-green-400 text-sm">3 Günlük Ücretsiz Deneme</span>
              <span className="text-green-400 font-bold">-$0.00</span>
            </div>
            <div className="border-t border-border pt-4 mt-4 flex justify-between items-center">
              <span className="text-foreground font-semibold">Toplam Ödenecek (3 Gün Sonra)</span>
              <span className="text-2xl font-black text-foreground">{selectedPlan.price}</span>
            </div>
            <p className="text-xs text-foreground/40 mt-6 flex items-start gap-2">
              <Lock size={14} className="shrink-0" />
              İstediğiniz zaman iptal edebilirsiniz. 3 gün boyunca kartınızdan hiçbir ücret çekilmeyecektir.
            </p>
          </div>
        </div>

        {/* Payment Form (Mock) */}
        <form onSubmit={handleCheckout} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-8">
            <CreditCard className="text-violet-500" />
            <h2 className="text-xl font-semibold text-foreground">Kart Bilgileri</h2>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Kart Üzerindeki İsim</label>
              <input 
                required
                type="text" 
                defaultValue={user.name}
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-foreground placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="Örn: Oğuzhan Özdemir"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Kart Numarası</label>
              <input 
                required
                type="text" 
                maxLength={19}
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-foreground placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors font-mono"
                placeholder="0000 0000 0000 0000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Son Kul. Tarihi</label>
                <input 
                  required
                  type="text" 
                  maxLength={5}
                  className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-foreground placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors font-mono"
                  placeholder="AA/YY"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">CVC</label>
                <input 
                  required
                  type="text" 
                  maxLength={3}
                  className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-foreground placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors font-mono"
                  placeholder="123"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-foreground font-bold py-4 rounded-xl mt-8 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Lock size={18} />}
            <span>{loading ? "İşleniyor..." : "Aboneliği Başlat"}</span>
          </button>
        </form>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-violet-500" size={32} /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
