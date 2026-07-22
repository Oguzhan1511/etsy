"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Zap, Palette, Globe, ChevronRight } from "lucide-react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-violet-500/30">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight">PrintySell</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden md:flex items-center justify-center px-5 py-2.5 text-sm font-bold text-foreground/80 hover:text-foreground transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold hover:scale-105 transition-transform"
            >
              Hemen Başla
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-full bg-violet-600/10 blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-fuchsia-600/5 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-violet-400 mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Etsy'nin Geleceği Burada
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Etsy Mağazanızı <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400">
              Yapay Zeka
            </span> ile Büyütün
          </h1>

          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Ürün araştırmasından tasarım üretimine, sipariş yönetiminden Printify entegrasyonuna kadar her şeyi tek bir panelden yönetin. Satışlarınızı roketleyin.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-lg shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] transition-all flex items-center justify-center gap-2 group"
            >
              Ücretsiz Denemeye Başla
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-surface border border-border hover:bg-hover text-foreground font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              Paneli İncele
            </Link>
          </div>
        </div>

        {/* Mockup Preview Area */}
        <div className="mt-20 relative w-full max-w-5xl mx-auto perspective-1000 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <div className="relative rounded-3xl border border-border bg-card shadow-2xl overflow-hidden aspect-video transform rotateX-[5deg] scale-95 hover:scale-100 hover:rotateX-0 transition-transform duration-700">
            {/* Fake Dashboard Header */}
            <div className="h-12 border-b border-border bg-surface flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <div className="ml-4 w-64 h-6 rounded-md bg-white/5" />
            </div>
            {/* Fake Dashboard Content */}
            <div className="p-6 grid grid-cols-3 gap-6 h-full bg-background">
              <div className="col-span-2 space-y-6">
                <div className="h-40 rounded-2xl bg-white/5 border border-border" />
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-32 rounded-2xl bg-white/5 border border-border" />
                  <div className="h-32 rounded-2xl bg-white/5 border border-border" />
                </div>
              </div>
              <div className="col-span-1 h-full rounded-2xl bg-white/5 border border-border" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Her Şey Tek Bir Yerde</h2>
            <p className="text-foreground/60 text-lg">Başarılı bir Etsy satıcısı olmak için onlarca farklı araca para ödemeyin. İhtiyacınız olan her şey PrintySell'de birleşti.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-8 rounded-3xl hover:border-violet-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                <TrendingUp className="text-blue-400 w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Ürün Araştırması</h3>
              <p className="text-foreground/60 leading-relaxed">Pazardaki açıkları bulun. Hangi ürünün ne kadar sattığını, trendleri ve fırsat puanlarını akıllı algoritmamızla analiz edin.</p>
            </div>

            <div className="bg-card border border-border p-8 rounded-3xl hover:border-fuchsia-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center mb-6">
                <Palette className="text-fuchsia-400 w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Tasarım Stüdyosu</h3>
              <p className="text-foreground/60 leading-relaxed">Sadece hayal edin ve yazın. Saniyeler içinde tişört, kupa veya posterlerinize basabileceğiniz eşsiz, yüksek çözünürlüklü tasarımlar üretin.</p>
            </div>

            <div className="bg-card border border-border p-8 rounded-3xl hover:border-orange-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                <Zap className="text-orange-400 w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Otomatik Yayınlama</h3>
              <p className="text-foreground/60 leading-relaxed">Tasarımlarınızı anında Printify üzerinden mockup'lara giydirin ve tek tıkla Etsy mağazanızda satışa sunun.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-900/20" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8">Etsy Mağazanızı Şaha Kaldırmaya Hazır Mısınız?</h2>
          <p className="text-xl text-foreground/60 mb-10">Hemen ücretsiz hesabınızı oluşturun ve yapay zekanın gücünü arkanıza alın.</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl bg-foreground text-background font-bold text-xl hover:scale-105 transition-transform"
          >
            Hemen Ücretsiz Başla
            <ChevronRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-violet-500 w-5 h-5" />
            <span className="font-bold">PrintySell</span>
          </div>
          <p className="text-foreground/40 text-sm">© {new Date().getFullYear()} PrintySell Inc. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-foreground/40 hover:text-foreground text-sm">Kullanım Şartları</Link>
            <Link href="#" className="text-foreground/40 hover:text-foreground text-sm">Gizlilik</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
