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

  const [checkoutHtml, setCheckoutHtml] = useState("");

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (user.paymentStatus) {
      router.replace("/");
    } else {
      // Sadece Pro plan var olarak varsayıyoruz, gerçeğinde plan seçimi dinamikleşebilir.
      initIyzico("Pro");
    }
  }, [user, router]);

  const initIyzico = async (plan: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/iyzico/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      
      const data = await res.json();
      if (res.ok && data.checkoutFormContent) {
        setCheckoutHtml(data.checkoutFormContent);
      } else {
        alert("Ödeme başlatılırken hata oluştu: " + (data.error || "Bilinmeyen Hata"));
      }
    } catch (err) {
      console.error(err);
      alert("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  // React dangerouslySetInnerHTML scriptleri çalıştırmaz. O yüzden manuel execute ediyoruz.
  useEffect(() => {
    if (checkoutHtml) {
      const scriptContentMatch = checkoutHtml.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      if (scriptContentMatch && scriptContentMatch[1]) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML = scriptContentMatch[1];
        document.body.appendChild(script);
      }
    }
  }, [checkoutHtml]);

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
              <span className="text-foreground font-bold">299.00 TL</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-green-400 text-sm">Güvenli Altyapı</span>
              <span className="text-green-400 font-bold">İyzico</span>
            </div>
            <div className="border-t border-border pt-4 mt-4 flex justify-between items-center">
              <span className="text-foreground font-semibold">Toplam Ödenecek</span>
              <span className="text-2xl font-black text-foreground">299.00 TL</span>
            </div>
            <p className="text-xs text-foreground/40 mt-6 flex items-start gap-2">
              <Lock size={14} className="shrink-0" />
              İşlemleriniz İyzico'nun %100 güvenli 3D Secure altyapısı ile korunmaktadır.
            </p>
          </div>
        </div>

        {/* Iyzico Payment Form Container */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col justify-center min-h-[400px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center gap-4 text-violet-500">
               <Loader2 className="animate-spin" size={48} />
               <p className="text-sm font-semibold">Güvenli Ödeme Ekranı Yükleniyor...</p>
             </div>
          ) : checkoutHtml ? (
            <div id="iyzi-container" dangerouslySetInnerHTML={{ __html: checkoutHtml }} />
          ) : (
            <div className="text-center text-foreground/60">Ödeme formu yüklenemedi.</div>
          )}
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
