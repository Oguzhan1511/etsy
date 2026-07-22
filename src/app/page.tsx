"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Zap, Palette, ChevronRight, BarChart3, Box, CheckCircle2 } from "lucide-react";

// Intersection Observer Hook for Scroll Animations
function useOnScreen(ref: React.RefObject<Element>, rootMargin = "0px") {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIntersecting(true);
      },
      { rootMargin }
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

const JourneyStep = ({ index, title, description, icon: Icon, children, reversed = false }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref, "-100px");

  return (
    <div ref={ref} className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24 py-20 relative opacity-0 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'translate-y-24'}`}>
      
      {/* Connecting Line (Desktop) */}
      <div className={`hidden md:block absolute top-1/2 ${reversed ? 'right-1/2' : 'left-1/2'} w-24 h-0.5 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 -z-10`} />

      {/* Text Side */}
      <div className="flex-1 space-y-6 w-full">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/30">
            {index}
          </div>
          <span className="text-sm font-bold tracking-widest uppercase text-foreground/80">Adım {index}</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">{title}</h2>
        <p className="text-lg text-foreground/60 leading-relaxed max-w-lg">{description}</p>
      </div>

      {/* UI Mockup Side */}
      <div className="flex-1 w-full relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-fuchsia-600/10 blur-[80px] -z-10 rounded-full" />
        <div className="rounded-[32px] border border-border bg-card shadow-2xl overflow-hidden group hover:border-violet-500/30 transition-colors">
          <div className="h-12 border-b border-border bg-surface/50 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
            <div className="flex-1 flex justify-center">
              <div className="w-32 h-4 rounded-full bg-white/5" />
            </div>
          </div>
          <div className="p-6 bg-background relative overflow-hidden h-[320px]">
            {children}
          </div>
        </div>
      </div>
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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-violet-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="PrintySell" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
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
            Ürün araştırmasından tasarım üretimine, sipariş yönetiminden Printify entegrasyonuna kadar her şeyi tek bir panelden yönetin.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-lg shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] transition-all flex items-center justify-center gap-2 group"
            >
              Ücretsiz Denemeye Başla
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Seller's Journey Section */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[120px]" />
          <div className="absolute top-[60%] right-[10%] w-[40vw] h-[40vw] bg-orange-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">Başarıya Giden Yolculuk</h2>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">Sıfırdan zirveye giden Etsy satıcısının yol haritası. İhtiyacınız olan her şey PrintySell'de adım adım kurgulandı.</p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <JourneyStep 
              index="1" 
              title="Pazarı Analiz Edin" 
              description="Hangi nişlerin kârlı olduğunu ve neyin sattığını verilerle görün. Akıllı Fırsat Puanı (Opportunity Score) sayesinde sadece kazanacak ürünlere odaklanın."
            >
              <div className="h-full flex flex-col justify-center space-y-4">
                <div className="flex items-end gap-4 h-32 w-full px-4 border-b border-border pb-4">
                  {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-violet-600/50 to-fuchsia-400/50 rounded-t-sm transition-all duration-1000 animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <div className="flex justify-between items-center px-4">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-white/10 rounded-md" />
                    <div className="h-3 w-16 bg-white/5 rounded-md" />
                  </div>
                  <div className="px-4 py-2 bg-emerald-500/20 text-emerald-400 font-bold rounded-xl text-sm border border-emerald-500/30 flex items-center gap-2">
                    <TrendingUp size={16} />
                    Fırsat Skoru: 95/100
                  </div>
                </div>
              </div>
            </JourneyStep>

            {/* Step 2 */}
            <JourneyStep 
              index="2" 
              title="Yapay Zeka ile Tasarlayın" 
              description="Fikrinizi saniyeler içinde gerçeğe dönüştürün. Sadece hayal edin ve yazın, yapay zeka sizin için en çok satan tasarımları çizsin."
              reversed
            >
              <div className="h-full relative flex items-center justify-center group">
                <div className="absolute inset-4 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 bg-white/[0.02]">
                  <Palette size={48} className="text-fuchsia-400 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                  <div className="h-10 w-3/4 bg-white/5 rounded-full border border-white/10 overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-2/3 bg-gradient-to-r from-violet-600/50 to-fuchsia-600/50 animate-pulse" />
                  </div>
                  <span className="text-xs text-foreground/40 font-mono">/imagine vintage sunset retro car design</span>
                </div>
                {/* Generated Image Illusion */}
                <div className="absolute inset-8 rounded-xl bg-gradient-to-br from-orange-400/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl">
                   <Sparkles className="text-white w-12 h-12 animate-spin-slow" />
                </div>
              </div>
            </JourneyStep>

            {/* Step 3 */}
            <JourneyStep 
              index="3" 
              title="Otomatik Yayınlayın" 
              description="Tasarımınızı tek tıkla tişörtlere ve kupalara giydirin. Printify entegrasyonu ile anında Etsy mağazanızda satışa sunun."
            >
              <div className="h-full flex items-center justify-center gap-6">
                <div className="w-32 h-40 rounded-xl bg-white/5 border border-border flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80')] bg-cover bg-center opacity-30 grayscale" />
                   <Box size={32} className="text-white/50 relative z-10" />
                </div>
                <div className="flex flex-col items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
                   <div className="w-16 h-[1px] bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                </div>
                <div className="w-32 h-40 rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 flex flex-col items-center justify-center gap-3 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                   <CheckCircle2 size={32} className="text-fuchsia-400" />
                   <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-widest">Etsy'de Yayında</span>
                </div>
              </div>
            </JourneyStep>

            {/* Step 4 */}
            <JourneyStep 
              index="4" 
              title="Yönetin ve Büyüyün" 
              description="Arkanıza yaslanın. Siparişlerinizi takip edin, gelirlerinizi analiz edin ve mağazanızı tek bir kokpitten yönetin."
              reversed
            >
              <div className="h-full flex flex-col p-6 gap-4">
                 <div className="flex justify-between items-end mb-2">
                    <div className="space-y-1">
                      <p className="text-xs text-foreground/50 uppercase tracking-wider">Aylık Ciro</p>
                      <h4 className="text-3xl font-black text-white">$12,450.00</h4>
                    </div>
                    <BarChart3 size={32} className="text-violet-400" />
                 </div>
                 <div className="space-y-3 flex-1 overflow-hidden">
                    {[1,2,3].map(i => (
                      <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                             <TrendingUp size={14} className="text-green-400" />
                           </div>
                           <div className="space-y-1">
                             <div className="h-3 w-20 bg-white/20 rounded-md" />
                             <div className="h-2 w-12 bg-white/10 rounded-md" />
                           </div>
                        </div>
                        <div className="text-sm font-bold text-white">+$24.99</div>
                      </div>
                    ))}
                 </div>
              </div>
            </JourneyStep>
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
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="PrintySell" className="w-6 h-6 object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
            <span className="font-bold opacity-50">PrintySell</span>
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
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
