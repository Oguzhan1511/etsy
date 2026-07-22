"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, TrendingUp, Zap, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PlansPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "standart",
      name: "Standart",
      price: "$6",
      period: "/ay",
      description: "Yeni başlayan satıcılar için temel araçlar.",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-400",
      features: [
        "Etsy Mağaza Analizi",
        "Sipariş ve Ürün Takibi",
        "Ürün Analizi",
        "Aylık 1 Adet Yapay Zeka Tasarımı",
        "Printify Bağlantısı"
      ]
    },
    {
      id: "pro",
      name: "Pro",
      price: "$10",
      period: "/ay",
      description: "Büyümek isteyen profesyonel satıcılar için.",
      icon: Zap,
      color: "from-violet-500 to-fuchsia-500",
      popular: true,
      features: [
        "Etsy Mağaza Analizi",
        "Sipariş ve Ürün Takibi",
        "Ürün Analizi",
        "Aylık 10 Adet Yapay Zeka Tasarımı",
        "Printify Bağlantısı"
      ]
    },
    {
      id: "plus",
      name: "Plus",
      price: "$18",
      period: "/ay",
      description: "Sınırları zorlayan devasa mağazalar için.",
      icon: Sparkles,
      color: "from-amber-500 to-orange-500",
      features: [
        "Etsy Mağaza Analizi",
        "Sipariş ve Ürün Takibi",
        "Ürün Analizi",
        "Sınırsız Yapay Zeka Tasarımı",
        "Printify Bağlantısı"
      ]
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setLoadingPlan(planId);
    setTimeout(() => {
      router.push(`/checkout?plan=${planId}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-16 px-4 relative overflow-hidden flex flex-col items-center">
      {/* Background Animated Blobs */}
      <div className="fixed top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-violet-600/10 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-fuchsia-600/10 blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Mağazanız İçin En Uygun Planı Seçin
        </h1>
        <p className="text-foreground/60 text-lg">
          {user ? `Hoş geldin, ${user.name}! ` : ""}
          PrintySell ile satışlarınızı artırmak için ihtiyacınız olan araçlara hemen erişin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 
                ${plan.popular 
                  ? 'bg-white/5 border-violet-500/50 shadow-[0_0_40px_rgba(139,92,246,0.2)]' 
                  : 'bg-white/[0.02] border-border hover:border-white/30'} 
                border backdrop-blur-xl`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  En Çok Tercih Edilen
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${plan.color} bg-opacity-20`}>
                <Icon size={24} className="text-foreground" />
              </div>

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-foreground/50 text-sm mb-6 h-10">{plan.description}</p>
              
              <div className="flex items-end gap-1 mb-8">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-foreground/50 font-medium mb-1">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={18} className="text-violet-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loadingPlan !== null}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 group
                  ${plan.popular 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-white/10 text-foreground hover:bg-white/20'}`}
              >
                {loadingPlan === plan.id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>Bu Planı Seç</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-foreground/40 mt-4 font-medium uppercase tracking-wider">
                Her plan için 3 gün ücretsiz deneme hakkı var
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
