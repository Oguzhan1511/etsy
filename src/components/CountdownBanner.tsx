"use client";
import React, { useState, useEffect } from 'react';

// Custom SVGs to avoid Lucide barrel optimization errors on Vercel
const InstagramIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TelegramIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const TikTokIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

const TwitterIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const SocialLink = ({ href, icon: Icon, text }: { href: string, icon: any, text: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mx-6 hover:text-white transition-colors hover:scale-105 duration-200 cursor-pointer">
    <Icon size={14} />
    <span className="font-bold tracking-wider">{text}</span>
  </a>
);

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
      <div className="w-full bg-black/80 border-b border-white/5 text-gray-300 py-1.5 overflow-hidden whitespace-nowrap flex items-center group">
        <div className="animate-marquee group-hover:[animation-play-state:paused] inline-block text-xs font-medium tracking-wide">
          
          {/* First Set */}
          <SocialLink href="https://instagram.com/printy.sell" icon={InstagramIcon} text="printy.sell" />
          <span className="text-violet-400">•</span>
          <SocialLink href="https://t.me/+juc6xKkTS6c3NGJk" icon={TelegramIcon} text="printysell" />
          <span className="text-violet-400">•</span>
          <SocialLink href="https://tiktok.com/@printy.sell" icon={TikTokIcon} text="printy.sell" />
          <span className="text-violet-400">•</span>
          <SocialLink href="https://twitter.com/printy_sell" icon={TwitterIcon} text="printy_sell" />
          <span className="text-violet-400">•</span>

          {/* Second Set for Loop */}
          <SocialLink href="https://instagram.com/printy.sell" icon={InstagramIcon} text="printy.sell" />
          <span className="text-violet-400">•</span>
          <SocialLink href="https://t.me/+juc6xKkTS6c3NGJk" icon={TelegramIcon} text="printysell" />
          <span className="text-violet-400">•</span>
          <SocialLink href="https://tiktok.com/@printy.sell" icon={TikTokIcon} text="printy.sell" />
          <span className="text-violet-400">•</span>
          <SocialLink href="https://twitter.com/printy_sell" icon={TwitterIcon} text="printy_sell" />
          <span className="text-violet-400">•</span>
          
          {/* Third Set for Loop */}
          <SocialLink href="https://instagram.com/printy.sell" icon={InstagramIcon} text="printy.sell" />
          <span className="text-violet-400">•</span>
          <SocialLink href="https://t.me/+juc6xKkTS6c3NGJk" icon={TelegramIcon} text="printysell" />
          <span className="text-violet-400">•</span>
          <SocialLink href="https://tiktok.com/@printy.sell" icon={TikTokIcon} text="printy.sell" />
          <span className="text-violet-400">•</span>
          <SocialLink href="https://twitter.com/printy_sell" icon={TwitterIcon} text="printy_sell" />
          <span className="text-violet-400">•</span>
        </div>
      </div>
    </div>
  );
}
