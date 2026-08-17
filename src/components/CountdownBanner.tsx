"use client";
import React, { useState, useEffect } from 'react';

export default function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // 15 days from Aug 17, 2026 -> Sept 1, 2026
    const targetDate = new Date("2026-09-01T23:59:59").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;

      setTimeLeft({ months, days: remainingDays, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null;

  return (
    <div className="w-full z-[100] relative shadow-[0_4px_20px_rgba(139,92,246,0.3)]">
      {/* Top Row: Countdown (Narrower) */}
      <div className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 text-white py-1 px-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 border-b border-white/10">
        <div className="font-bold tracking-wider uppercase text-xs md:text-sm flex items-center gap-2">
          <span className="animate-pulse">🚀</span> 
          PrintySell Tam Sürüm Açılışına Kalan Süre
        </div>
        
        <div className="flex items-center gap-1 font-mono">
          <div className="flex items-baseline gap-1 bg-black/30 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
            <span className="text-sm font-bold leading-none">{timeLeft.months}</span>
            <span className="text-[8px] uppercase tracking-wider text-white/70">Ay</span>
          </div>
          <span className="text-white/50 font-bold text-xs">:</span>
          <div className="flex items-baseline gap-1 bg-black/30 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
            <span className="text-sm font-bold leading-none">{timeLeft.days}</span>
            <span className="text-[8px] uppercase tracking-wider text-white/70">Gün</span>
          </div>
          <span className="text-white/50 font-bold text-xs">:</span>
          <div className="flex items-baseline gap-1 bg-black/30 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
            <span className="text-sm font-bold leading-none">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="text-[8px] uppercase tracking-wider text-white/70">Saat</span>
          </div>
          <span className="text-white/50 font-bold text-xs">:</span>
          <div className="flex items-baseline gap-1 bg-black/30 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
            <span className="text-sm font-bold leading-none">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="text-[8px] uppercase tracking-wider text-white/70">Dk</span>
          </div>
          <span className="text-white/50 font-bold text-xs">:</span>
          <div className="flex items-baseline gap-1 bg-black/30 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
            <span className="text-sm font-bold leading-none text-orange-200">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className="text-[8px] uppercase tracking-wider text-white/70">Sn</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Scrolling Marquee */}
      <div className="w-full bg-black/80 border-b border-white/5 text-gray-300 py-1 overflow-hidden whitespace-nowrap flex items-center">
        <div className="animate-marquee inline-block text-xs font-medium tracking-wide">
          <span className="mx-4">🔔 BİLDİRİM: Yeni özellikler yakında sizlerle...</span>
          <span className="mx-4 text-violet-400">•</span>
          <span className="mx-4">🔔 BİLDİRİM: PrintySell v2.0 için geri sayım başladı...</span>
          <span className="mx-4 text-violet-400">•</span>
          <span className="mx-4">🔔 BİLDİRİM: Hazırlıklarımız tüm hızıyla sürüyor...</span>
          {/* Duplicate for seamless loop */}
          <span className="mx-4">🔔 BİLDİRİM: Yeni özellikler yakında sizlerle...</span>
          <span className="mx-4 text-violet-400">•</span>
          <span className="mx-4">🔔 BİLDİRİM: PrintySell v2.0 için geri sayım başladı...</span>
          <span className="mx-4 text-violet-400">•</span>
          <span className="mx-4">🔔 BİLDİRİM: Hazırlıklarımız tüm hızıyla sürüyor...</span>
        </div>
      </div>
    </div>
  );
}
