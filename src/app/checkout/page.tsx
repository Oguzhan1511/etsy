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
  
  // Card form state
  const [cardHolder, setCardHolder] = useState(user?.name || "");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const plans = {
    standart: { name: "Standart Plan", price: "260 TL", priceNumber: 260, tokens: 10 },
    pro: { name: "Pro Plan", price: "480 TL", priceNumber: 480, tokens: 50 },
    premium: { name: "Premium Plan", price: "710 TL", priceNumber: 710, tokens: 100 },
    plus: { name: "Premium Plan", price: "710 TL", priceNumber: 710, tokens: 100 },
  };

  const selectedPlan = plans[planId as keyof typeof plans] || plans.pro;

  // Format card number as 0000 0000 0000 0000
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardNumber(formatted);
  };

  // Format expiry as MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) {
      setCardExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setCardExpiry(val);
    }
  };

  const handleStartTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/mock-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          planId: planId === "plus" ? "premium" : (planId || "pro"),
          cardNumber,
          cardHolder,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        if (data.user) {
          localStorage.setItem("printysell-auth-user", JSON.stringify(data.user));
        }
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        alert(data.error || "İşlem sırasında bir hata oluştu.");
        setLoading(false);
      }
    } catch (err) {
      alert("Sunucuya bağlanılamadı.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (user.paymentStatus) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (!user) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 animate-pulse">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">3 Günlük Ücretsiz Denemeniz Başladı!</h1>
        <p className="text-foreground/60">Panele yönlendiriliyorsunuz, dilediğiniz an Ayarlar sayfasından iptal edebilirsiniz...</p>
      </div>
    );
  }

  // Calculate trial end date: 3 days from today
  const trialEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 to-transparent pointer-events-none" />
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Order Summary & Trial Details */}
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              3 Gün Ücretsiz Deneme Fırsatı
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Abonelik & Deneme</h1>
            <p className="text-foreground/60 text-sm">
              İlk 3 gün tamamen ücretsiz kullanın. Deneme süresi boyunca istediğiniz an iptal edebilirsiniz.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-border rounded-2xl p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-3">Sipariş & Deneme Özeti</h2>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground/80">{selectedPlan.name}</span>
              <span className="text-foreground font-bold">{selectedPlan.price} / ay</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground/60">Dahil Edilen Token</span>
              <span className="text-violet-400 font-bold">{selectedPlan.tokens} Token / ay</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground/60">Deneme Bitiş Tarihi</span>
              <span className="text-foreground font-medium">{trialEndDate}</span>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-emerald-400">Bugün Çekilecek Tutar</p>
                <p className="text-[11px] text-emerald-400/80">3 gün boyunca sıfır risk</p>
              </div>
              <span className="text-2xl font-black text-emerald-400">0.00 ₺</span>
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between items-center text-xs text-foreground/60">
                <span>3 gün sonra (İptal edilmezse):</span>
                <span className="font-semibold text-foreground">{selectedPlan.price} / ay</span>
              </div>
              <div className="flex justify-between items-center text-xs text-foreground/60">
                <span>İptal Koşulu:</span>
                <span className="text-emerald-400 font-semibold">İstediğiniz an 1 tıkla iptal</span>
              </div>
            </div>

            <p className="text-xs text-foreground/40 mt-4 flex items-start gap-2 pt-2 border-t border-border/50">
              <Lock size={14} className="shrink-0 text-violet-400 mt-0.5" />
              <span>Kartınız güvenle doğrulanır ancak deneme süresi bitene kadar hiçbir ücret tahsil edilmez.</span>
            </p>
          </div>
        </div>

        {/* Card Details Form */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CreditCard className="text-violet-400" size={22} />
                <h3 className="text-lg font-bold text-foreground">Kart Bilgileri</h3>
              </div>
              <span className="text-[11px] bg-white/5 border border-border px-2 py-1 rounded-md text-foreground/60">
                256-Bit SSL Şifreleme
              </span>
            </div>

            <form onSubmit={handleStartTrial} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">Kart Üzerindeki İsim</label>
                <input
                  type="text"
                  required
                  placeholder="Ahmet Yılmaz"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-black/20 text-sm text-foreground focus:outline-none focus:border-violet-500/60 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">Kart Numarası</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-black/20 text-sm font-mono text-foreground focus:outline-none focus:border-violet-500/60 transition-colors tracking-wider"
                  />
                  <div className="absolute right-3 top-2.5 flex items-center gap-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-foreground/80">VISA</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-foreground/80">MC</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">Son Kullanma (AY/YIL)</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-black/20 text-sm font-mono text-foreground focus:outline-none focus:border-violet-500/60 transition-colors text-center"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">Güvenlik Kodu (CVV)</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-black/20 text-sm font-mono text-foreground focus:outline-none focus:border-violet-500/60 transition-colors text-center"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Doğrulanıyor...</span>
                    </>
                  ) : (
                    <span>3 Gün Ücretsiz Denemeyi Başlat (0.00 ₺)</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-[11px] text-foreground/40 mt-4">
            Aboneliğinizi dilediğiniz an <strong>Hesap & Ayarlar &gt; Plan</strong> menüsünden tek tıkla iptal edebilirsiniz.
          </p>
        </div>

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
