"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, TrendingUp, Zap, Palette, Layers } from "lucide-react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-fuchsia-500/30 overflow-x-hidden relative">
      {/* Grid Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #3f3f46 1px, transparent 1px),
            linear-gradient(to bottom, #3f3f46 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)'
        }}
      />

      <main className="relative z-10 max-w-[1400px] mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col">
        {/* Top Actions */}
        <div className="flex justify-end items-center gap-4 mb-8">
          <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Giriş Yap
          </Link>
          <Link
            href="/waitlist"
            className="text-sm font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Kayıt Ol
          </Link>
        </div>

        {/* BENTO GRID */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 auto-rows-[120px] md:auto-rows-[160px] transition-all duration-1000 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          
          {/* Logo & Brand Tile */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 row-span-1 bg-zinc-900/40 border border-white/5 rounded-3xl p-6 flex flex-col justify-center backdrop-blur-md group hover:border-white/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative flex items-center justify-center bg-black/50 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
                <Image src="/logo.png" alt="PrintySell Logo" width={32} height={32} className="object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">PrintySell</span>
            </div>
          </div>

          {/* Slogan / Hero Tile */}
          <div className="col-span-1 md:col-span-4 lg:col-span-6 row-span-2 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/10 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group hover:border-violet-500/40 transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-[80px] -z-10 group-hover:bg-fuchsia-500/30 transition-colors" />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10 text-zinc-300 font-medium text-xs w-max mb-6">
              <Sparkles size={14} className="text-violet-400" />
              <span>Yapay Zeka Destekli Print on Demand</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-4">
              Etsy Mağazanı <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Yapay Zeka</span> ile Yönet
            </h1>
            <p className="text-zinc-400 text-lg max-w-lg">
              Trendleri bul, AI ile tasarım yap ve saniyeler içinde Etsy'de satışa sun.
            </p>
          </div>

          {/* Main Screenshot Tile */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 row-span-3 bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden relative group hover:border-white/20 transition-all">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <div className="absolute bottom-6 left-6 z-20">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><Palette size={20} className="text-violet-400"/> AI Studio</h3>
            </div>
            <Image 
              src="/screenshots/screenshot1.png" 
              alt="Dashboard Preview" 
              fill
              className="object-cover object-left-top opacity-60 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105"
            />
          </div>

          {/* CTA Tile */}
          <Link href="/waitlist" className="col-span-1 md:col-span-2 lg:col-span-3 row-span-1 bg-white hover:bg-zinc-200 text-black rounded-3xl p-6 flex items-center justify-between group transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <div className="flex flex-col">
              <span className="font-bold text-xl">Hemen Başla</span>
              <span className="text-sm font-medium text-zinc-600">Ücretsiz 50 Jeton</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <ArrowRight />
            </div>
          </Link>

          {/* Small Feature Tile 1 */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 row-span-1 bg-zinc-900/40 border border-white/5 rounded-3xl p-6 flex flex-col justify-center group hover:border-fuchsia-500/30 transition-all overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp size={120} />
            </div>
            <TrendingUp className="text-fuchsia-400 mb-2" size={24}/>
            <h3 className="font-bold text-lg text-white">Trend Analizi</h3>
            <p className="text-sm text-zinc-500">Pazarı domine edin.</p>
          </div>

          {/* Screenshot 2 Tile */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 row-span-2 bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden relative group hover:border-white/20 transition-all">
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
             <div className="absolute bottom-6 left-6 z-20">
               <h3 className="text-lg font-bold text-white flex items-center gap-2"><Zap size={18} className="text-blue-400"/> Hızlı Yayın</h3>
             </div>
             <Image 
              src="/screenshots/screenshot3.jpg" 
              alt="Feature Preview" 
              fill
              className="object-cover opacity-50 group-hover:opacity-90 transition-opacity duration-700 group-hover:scale-105"
            />
          </div>

          {/* Screenshot 3 Tile */}
          <div className="col-span-1 md:col-span-4 lg:col-span-6 row-span-2 bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden relative group hover:border-white/20 transition-all">
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
             <div className="absolute bottom-6 left-6 z-20">
               <h3 className="text-2xl font-bold text-white flex items-center gap-2"><Layers size={24} className="text-emerald-400"/> Gelişmiş Kütüphane</h3>
               <p className="text-zinc-400 max-w-sm mt-2">Tasarımlarınızı kaydedin ve yönetin.</p>
             </div>
             <Image 
              src="/screenshots/screenshot2.png" 
              alt="Library Preview" 
              fill
              className="object-cover object-top opacity-50 group-hover:opacity-90 transition-opacity duration-700 group-hover:-translate-y-4"
            />
          </div>

        </div>
        
        {/* Footer */}
        <footer className="mt-auto pt-20 pb-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/5 opacity-60">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={20} height={20} className="grayscale" />
            <span className="text-sm font-medium">© {new Date().getFullYear()} PrintySell</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Kullanım Şartları</Link>
            <Link href="#" className="hover:text-white transition-colors">Gizlilik</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
