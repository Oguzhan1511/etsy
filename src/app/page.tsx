"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Search, Palette, Globe, CheckCircle2, Loader2, TrendingUp } from "lucide-react";

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

const FadeInContent = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref, "-50px");

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const InteractiveStep2 = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    timerRef.current = setTimeout(() => {
      setIsGenerated(true);
    }, 1500); // 1.5 saniye sonra resmi göster
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsGenerated(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div 
      className="flex-1 relative w-full group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <FadeInContent delay={200}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-violet-500/10 blur-[80px] rounded-full -z-10 transition-all duration-700 group-hover:bg-violet-500/20" />
        
        {/* Base AI Studio Image */}
        <Image 
          src="/screenshots/step2_base.png" 
          alt="Yapay Zeka Tasarım Stüdyosu" 
          width={800} height={600} 
          className="rounded-2xl border border-white/10 shadow-2xl w-full h-auto relative z-10 transition-transform duration-500 group-hover:scale-[1.02]"
          unoptimized
        />

        {/* Dynamic Overlay Box */}
        <div className="absolute top-[30%] right-[7%] w-[40%] h-[60%] rounded-[10px] overflow-hidden z-20 shadow-inner flex items-center justify-center transition-all duration-300">
          
          {/* Default Empty State (Transparent) */}
          <div className={`absolute inset-0 bg-transparent transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />

          {/* Loading State */}
          <div className={`absolute inset-0 bg-[#0c0c0c]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ${isHovered && !isGenerated ? 'opacity-100' : 'opacity-0'}`}>
            <Loader2 size={32} className="text-violet-500 animate-spin" />
            <span className="text-violet-400 font-bold text-sm tracking-widest uppercase animate-pulse">Üretiliyor...</span>
          </div>

          {/* Generated Result State */}
          <div className={`absolute inset-0 transition-opacity duration-700 ${isGenerated ? 'opacity-100' : 'opacity-0'}`}>
            <Image 
              src="/screenshots/step2_overlay.jpg" 
              alt="AI Üretimi Çıktı" 
              fill
              className="object-cover"
              unoptimized
            />
            {/* Success Badge */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 shadow-lg">
              <Sparkles size={12} className="text-emerald-400" />
              <span className="text-white text-[10px] font-bold">Tasarım Hazır</span>
            </div>
          </div>
          
        </div>
      </FadeInContent>
    </div>
  );
};

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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-violet-500/30 overflow-x-hidden">
      
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#09090b]/90 backdrop-blur-md border-b border-white/5 py-4 shadow-lg shadow-black/50" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 relative z-20">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="PrintySell Logo" width={36} height={36} className="object-contain" />
            <span className="text-xl font-bold tracking-tight text-white">PrintySell</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-bold bg-white text-black px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Giriş Yap / Ücretsiz Dene
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 text-center">
          <FadeInContent>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 font-medium text-sm mb-8">
              <Sparkles size={16} className="text-violet-400" />
              <span>Yapay Zeka Destekli Print on Demand Otomasyonu</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1] max-w-4xl mx-auto">
              Etsy Mağazanı Yapay Zeka İle Otomatiğe Bağla
            </h1>
            
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Trendleri keşfet, yapay zeka ile saniyeler içinde benzersiz tasarımlar üret ve Printify üzerinden tek tıkla satışa başla. Tasarım yeteneğine ihtiyacın yok.
            </p>

            <div className="flex flex-col items-center justify-center mb-16 gap-4">
              <Link
                href="/login"
                className="px-8 py-4 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-lg transition-transform hover:scale-105 flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                Hemen Ücretsiz Denemeye Başla
                <ArrowRight size={20} />
              </Link>
              <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-900/50 border border-white/5 px-4 py-1.5 rounded-full">
                <Sparkles size={14} className="text-amber-400" />
                <span>Demo sürümünü <strong className="text-white">hemen keşfet!</strong></span>
              </div>
            </div>
          </FadeInContent>

          <FadeInContent delay={200}>
            <div className="relative max-w-7xl mx-auto mt-8">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] bg-violet-600/20 blur-[120px] rounded-full -z-10" />
              
              <div className="rounded-2xl border border-white/10 bg-[#09090b] shadow-[0_0_80px_rgba(139,92,246,0.15)]">
                <Image 
                  src="/screenshots/hero_diagram_v2.jpg" 
                  alt="PrintySell Otomasyon Akışı" 
                  width={1600} 
                  height={800} 
                  className="rounded-2xl w-full h-auto object-cover"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </FadeInContent>
        </section>

        {/* LOGOS OR SOCIAL PROOF (OPTIONAL) */}
        <section className="border-y border-white/5 bg-white/[0.02] py-10 mt-12 mb-24">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-12 text-zinc-500 font-medium">
             <span className="flex items-center gap-2"><CheckCircle2 size={20}/> Resmi Printify Entegrasyonu</span>
             <span className="flex items-center gap-2"><CheckCircle2 size={20}/> DALL-E 3 & gpt-image-1 Altyapısı</span>
             <span className="flex items-center gap-2"><CheckCircle2 size={20}/> Güvenli Etsy Bağlantısı</span>
          </div>
        </section>

        {/* HOW IT WORKS (Z-PATTERN) */}
        <section className="max-w-7xl mx-auto px-6 py-12 space-y-32">
          
          {/* STEP 1 */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <FadeInContent>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                  <Search className="text-blue-400" size={24} />
                </div>
                <h3 className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-2">Adım 1: Pazar Araştırması</h3>
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">Etsy'de Gerçekten Ne Satıyor Öğrenin</h2>
                <p className="text-lg text-zinc-400 leading-relaxed">
                  Satmayacak ürünlere zaman harcamayın. PrintySell, Etsy pazarını analiz ederek en trend nişleri, çok satan ürünleri ve fırsat skorlarını önünüze getirir. Hangi tasarımı yapmanız gerektiğini veriyle bulun.
                </p>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="text-blue-400" size={18}/> Karlı niş tespiti</li>
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="text-blue-400" size={18}/> Fırsat skoru analizi</li>
                </ul>
              </FadeInContent>
            </div>
            <div className="flex-1 relative w-full">
              <FadeInContent delay={200}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/10 blur-[80px] rounded-full -z-10" />
                <Image 
                  src="/screenshots/screenshot2_v2.png" 
                  alt="Trend Analizi Ekranı" 
                  width={800} height={600} 
                  className="rounded-2xl border border-white/10 shadow-2xl w-full h-auto"
                  unoptimized
                />
              </FadeInContent>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-6">
              <FadeInContent>
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
                  <Palette className="text-violet-400" size={24} />
                </div>
                <h3 className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-2">Adım 2: AI Tasarım Stüdyosu</h3>
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">Sadece Ne İstediğinizi Yazın, O Çizsin</h2>
                <p className="text-lg text-zinc-400 leading-relaxed">
                  Photoshop veya tasarım becerisine ihtiyacınız yok. Sisteme fikrinizi yazın, gelişmiş yapay zeka modellerimiz saniyeler içinde mükemmel, baskıya hazır (arka planı temizlenmiş) vektörel tasarımlar üretsin.
                </p>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="text-violet-400" size={18}/> DALL-E 3 & gpt-image-1 gücü</li>
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="text-violet-400" size={18}/> Otomatik arka plan silici</li>
                </ul>
              </FadeInContent>
            </div>
              <InteractiveStep2 />
          </div>

          {/* STEP 3 */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <FadeInContent>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                  <Globe className="text-emerald-400" size={24} />
                </div>
                <h3 className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-2">Adım 3: Tam Otomasyon</h3>
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">Tek Tıkla Printify ve Etsy'de Yayınlayın</h2>
                <p className="text-lg text-zinc-400 leading-relaxed">
                  Ürettiğiniz veya beğendiğiniz tasarımları tek bir butonla Printify ürünlerine uygulayın. Başlık, açıklama ve SEO etiketlerini AI sizin yerinize yazsın, Etsy mağazanızda anında satışa hazır olsun.
                </p>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="text-emerald-400" size={18}/> API ile otomatik yayınlama</li>
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="text-emerald-400" size={18}/> SEO uyumlu AI metin yazarlığı</li>
                </ul>
              </FadeInContent>
            </div>
            <div className="flex-1 relative w-full">
              <FadeInContent delay={200}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/10 blur-[80px] rounded-full -z-10" />
                <Image 
                  src="/screenshots/step3_dashboard.png" 
                  alt="Üretici Dashboard" 
                  width={800} height={600} 
                  className="rounded-2xl border border-white/10 shadow-2xl w-full h-auto"
                  unoptimized
                />
              </FadeInContent>
            </div>
          </div>
          {/* STEP 4 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16 mt-32">
            <div className="flex-1 space-y-6">
              <FadeInContent>
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-6">
                  <TrendingUp className="text-pink-400" size={24} />
                </div>
                <h3 className="text-xs font-bold tracking-widest text-pink-400 uppercase mb-2">Adım 4: Etsy Mağaza Analizi</h3>
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">Mağazanızı ve Satışlarınızı Büyütün</h2>
                <p className="text-lg text-zinc-400 leading-relaxed">
                  İleri düzey analitik paneli sayesinde mağaza performansınızı, siparişleri, gelirlerinizi ve karlılığınızı tek bir noktadan anlık olarak takip edin. Büyüme trendlerinizi öngörerek işinize yön verin.
                </p>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="text-pink-400" size={18}/> Detaylı ciro ve kar marjı hesaplamaları</li>
                  <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 className="text-pink-400" size={18}/> Etsy'e bağlı gerçek zamanlı analizler</li>
                </ul>
              </FadeInContent>
            </div>
            <div className="flex-1 relative w-full">
              <FadeInContent delay={200}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-pink-500/10 blur-[80px] rounded-full -z-10" />
                <Image 
                  src="/screenshots/step4_analysis.png" 
                  alt="Etsy Mağaza Analizi" 
                  width={800} height={600} 
                  className="rounded-2xl border border-white/10 shadow-2xl w-full h-auto"
                  unoptimized
                />
              </FadeInContent>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-4xl mx-auto px-6 py-32 text-center mt-20">
          <FadeInContent>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Demo Sürümünü Keşfet</h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Sistemimizi ücretsiz olarak test edebilir, Etsy mağazanı bağlayarak neler yapabileceğini hemen görebilirsin.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xl transition-transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                Ücretsiz Dene
                <ArrowRight size={20} />
              </Link>
              <span className="text-sm font-medium text-amber-400 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
                🚀 Kredi kartı gerekmez, anında giriş!
              </span>
            </div>
          </FadeInContent>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="PrintySell Logo" width={24} height={24} className="opacity-70" />
            <span className="font-bold text-zinc-400">PrintySell</span>
          </div>
          <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} PrintySell Inc. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Kullanım Şartları</Link>
            <Link href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Gizlilik</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
