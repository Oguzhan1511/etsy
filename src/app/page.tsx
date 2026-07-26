"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, TrendingUp, Zap, Palette, BarChart3, Box, CheckCircle2, ChevronRight, Layers } from "lucide-react";

// Intersection Observer Hook for Scroll Animations
function useOnScreen(ref: any, rootMargin = "0px") {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIntersecting(true);
      },
      { rootMargin, threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, rootMargin]);
  return isIntersecting;
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroVisible = useOnScreen(heroRef);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-violet-500/30 overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/10 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-600/10 blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-blue-600/5 blur-[120px] mix-blend-screen" />
      </div>

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#09090b]/80 backdrop-blur-md border-b border-white/10 py-4 shadow-lg shadow-black/50" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative flex items-center justify-center">
              <Image src="/logo.png" alt="PrintySell Logo" width={40} height={40} className="object-contain drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
            </div>
            <span className="text-xl font-black tracking-tight text-white drop-shadow-md">PrintySell</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Giriş Yap
            </Link>
            <Link
              href="/waitlist"
              className="text-sm font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24">
        {/* Hero Section */}
        <section ref={heroRef} className="max-w-7xl mx-auto px-6 text-center pt-10 pb-20">
          <div className={`transition-all duration-1000 transform ${isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 font-medium text-sm mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(139,92,246,0.15)]">
              <Sparkles size={16} className="text-violet-400 animate-pulse" />
              <span>Yeni Nesil AI Print on Demand</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
              Etsy Mağazanı <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">Yapay Zeka</span> ile Büyüt.
            </h1>
            
            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Trendleri analiz et, tek tıkla muazzam tasarımlar üret ve Printify entegrasyonuyla anında Etsy'de satışa başla. İşin tüm zorluğunu yapay zekaya bırak.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
              <Link
                href="/waitlist"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-lg shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:shadow-[0_0_60px_rgba(139,92,246,0.6)] transition-all flex items-center justify-center gap-2 group"
              >
                Hemen Ücretsiz Başla
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Floating Hero Screenshot */}
            <div className="relative max-w-5xl mx-auto">
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-[2.5rem] blur-2xl opacity-30 animate-pulse" />
              <div className="relative rounded-[2rem] p-2 bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="rounded-[1.75rem] overflow-hidden bg-[#18181b] border border-white/5 flex items-center justify-center min-h-[400px]">
                  <Image 
                    src="/screenshots/screenshot1.png" 
                    alt="PrintySell Dashboard" 
                    width={1200} 
                    height={800} 
                    className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Her Şey Tek Platformda</h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Tasarım stüdyosundan trend analizine, sipariş yönetiminden akıllı yayınlamaya kadar ihtiyacınız olan tüm araçlar tek bir modern arayüzde.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Feature 1 (Large) */}
            <div className="md:col-span-2 rounded-[2rem] bg-zinc-900/50 border border-white/10 p-8 flex flex-col justify-between overflow-hidden relative group hover:border-violet-500/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-4 border border-violet-500/30">
                  <Palette className="text-violet-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">AI Tasarım Stüdyosu</h3>
                <p className="text-zinc-400">gpt-image-1 ve DALL-E 3 entegrasyonları ile saniyeler içinde benzersiz tasarımlar üretin. Arka planı otomatik kaldırın.</p>
              </div>
              <div className="relative mt-8 -mx-8 -mb-8 h-48 overflow-hidden rounded-t-[2rem]">
                 <Image src="/screenshots/screenshot2.png" alt="AI Design Studio" width={800} height={400} className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
              </div>
            </div>

            {/* Feature 2 (Small) */}
            <div className="rounded-[2rem] bg-zinc-900/50 border border-white/10 p-8 flex flex-col justify-between relative group hover:border-fuchsia-500/50 transition-colors">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center mb-4 border border-fuchsia-500/30">
                  <TrendingUp className="text-fuchsia-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Trend Analizi</h3>
                <p className="text-zinc-400 text-sm">Etsy'de en çok satan ürünleri keşfedin ve popüler temaları kopyalayın.</p>
              </div>
            </div>

            {/* Feature 3 (Small) */}
            <div className="rounded-[2rem] bg-zinc-900/50 border border-white/10 p-8 flex flex-col justify-between relative group hover:border-blue-500/50 transition-colors">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 border border-blue-500/30">
                  <Zap className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Tek Tıkla Yayınla</h3>
                <p className="text-zinc-400 text-sm">Beğendiğiniz tasarımları doğrudan Printify'a gönderin ve mockup'larla Etsy'de yayınlayın.</p>
              </div>
            </div>

            {/* Feature 4 (Large) */}
            <div className="md:col-span-2 rounded-[2rem] bg-zinc-900/50 border border-white/10 p-8 flex flex-col justify-between overflow-hidden relative group hover:border-emerald-500/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4 border border-emerald-500/30">
                  <Layers className="text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Tasarım Kütüphanesi</h3>
                <p className="text-zinc-400">Ürettiğiniz tüm başarılı tasarımları tek bir yerde güvenle saklayın. İsterseniz daha sonra farklı ürünlere uygulayın.</p>
              </div>
              <div className="relative mt-8 -mx-8 -mb-8 h-48 overflow-hidden rounded-t-[2rem]">
                 {/* Fallback to third screenshot or use a placeholder */}
                 <Image src="/screenshots/screenshot3.jpg" alt="Design Library" width={800} height={400} className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(139,92,246,0.15),transparent)] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-white">Yolculuğa Başlamaya Hazır mısın?</h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Hemen kaydolun ve PrintySell'in yapay zeka gücüyle Etsy mağazanızı satışa doyurun.
            </p>
            <Link
              href="/waitlist"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-white text-black font-bold text-xl shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:scale-105 transition-all"
            >
              Hemen Başla
              <ArrowRight size={24} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="PrintySell Logo" width={24} height={24} className="opacity-50 hover:opacity-100 transition-opacity" />
            <span className="font-bold text-zinc-500">PrintySell</span>
          </div>
          <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} PrintySell Inc. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-zinc-600 hover:text-zinc-300 text-sm transition-colors">Kullanım Şartları</Link>
            <Link href="#" className="text-zinc-600 hover:text-zinc-300 text-sm transition-colors">Gizlilik</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
