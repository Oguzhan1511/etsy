"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Search, Palette, Globe, CheckCircle2 } from "lucide-react";

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
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Giriş Yap
            </Link>
            <Link
              href="/waitlist"
              className="text-sm font-bold bg-white text-black px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-transform hover:scale-105"
            >
              Hemen Başla
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

            <div className="flex justify-center mb-16">
              <Link
                href="/waitlist"
                className="px-8 py-4 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-lg transition-transform hover:scale-105 flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                Ücretsiz 50 Jeton ile Başla
                <ArrowRight size={20} />
              </Link>
            </div>
          </FadeInContent>

          <FadeInContent delay={200}>
            <div className="relative max-w-6xl mx-auto mt-8">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-violet-600/20 blur-[120px] rounded-full -z-10" />
              
              <div className="rounded-2xl border border-white/10 bg-[#18181b] p-2 shadow-2xl shadow-black">
                <Image 
                  src="/screenshots/screenshot1.png" 
                  alt="PrintySell Ana Ekranı" 
                  width={1400} 
                  height={900} 
                  className="rounded-xl w-full h-auto object-cover border border-white/5"
                  priority
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
            <div className="flex-1 relative w-full">
              <FadeInContent delay={200}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-violet-500/10 blur-[80px] rounded-full -z-10" />
                <Image 
                  src="/screenshots/screenshot3.jpg" 
                  alt="Yapay Zeka Tasarım Stüdyosu" 
                  width={800} height={600} 
                  className="rounded-2xl border border-white/10 shadow-2xl w-full h-auto"
                />
              </FadeInContent>
            </div>
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
                  src="/screenshots/screenshot4.jpg" 
                  alt="Printify Yayınlama Ekranı" 
                  width={800} height={600} 
                  className="rounded-2xl border border-white/10 shadow-2xl w-full h-auto"
                />
              </FadeInContent>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-4xl mx-auto px-6 py-32 text-center mt-20">
          <FadeInContent>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Satış Yapmaya Bugünden Başlayın</h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Zamanınızı tasarımla değil, işinizi büyütmekle harcayın. PrintySell ile otomasyonun gücünü keşfedin.
            </p>
            <Link
              href="/waitlist"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xl transition-transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Hemen Ön Kayıt Ol
              <ArrowRight size={20} />
            </Link>
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
