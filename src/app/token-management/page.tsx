"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTokens, PLAN_LIMITS, PlanType } from "@/context/TokenContext";
import {
  Zap,
  Star,
  Crown,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ShoppingCart,
  Flame,
  Package,
  ChevronRight,
} from "lucide-react";

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-emerald-500/30 bg-gradient-to-r from-emerald-900/90 to-emerald-800/90 backdrop-blur-xl text-emerald-200 text-sm font-semibold transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
      {message}
    </div>
  );
}

// ─── Animated Progress Bar ────────────────────────────────────────────────────
function TokenProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${pct}%`;
    }
  }, [pct]);

  const color =
    pct > 50
      ? "from-violet-500 via-purple-500 to-fuchsia-500"
      : pct > 20
      ? "from-amber-500 via-orange-500 to-yellow-500"
      : "from-red-600 via-rose-500 to-pink-500";

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted font-medium">Kalan Bakiye</span>
        <span className="font-bold text-foreground">
          <span className="text-lg text-violet-300">{current}</span>
          <span className="text-muted"> / {total} Token</span>
        </span>
      </div>
      <div className="relative h-4 bg-black/40 rounded-full overflow-hidden border border-white/5">
        {/* Glow base */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-900/30 to-fuchsia-900/20" />
        {/* Animated bar */}
        <div
          ref={barRef}
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out relative overflow-hidden shadow-[0_0_12px_rgba(139,92,246,0.6)]`}
          style={{ width: "0%" }}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
      <div className="flex justify-between text-[10px] text-muted">
        <span>{Math.round(pct)}% kullanılabilir</span>
        <span>{total - current} Token kullanıldı</span>
      </div>
    </div>
  );
}

// ─── Plan Badge ───────────────────────────────────────────────────────────────
const PLAN_ICONS: Record<PlanType, React.ReactNode> = {
  Standard: <Package size={20} className="text-blue-400" />,
  Pro: <Zap size={20} className="text-violet-400" />,
  Premium: <Crown size={20} className="text-amber-400" />,
  none: <Sparkles size={20} className="text-gray-400" />,
};

const PLAN_COLORS: Record<PlanType, string> = {
  Standard: "from-blue-600/20 to-blue-500/10 border-blue-500/30",
  Pro: "from-violet-600/20 to-purple-500/10 border-violet-500/30",
  Premium: "from-amber-600/20 to-yellow-500/10 border-amber-500/30",
  none: "from-gray-600/20 to-gray-500/10 border-gray-500/30",
};

const PLAN_BADGE_COLORS: Record<PlanType, string> = {
  Standard: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  Pro: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  Premium: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  none: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
};

// ─── Token Package Cards ──────────────────────────────────────────────────────
const TOKEN_PACKAGES = [
  {
    id: "starter",
    label: "Başlangıç Paketi",
    tokens: 50,
    price: 200,
    icon: <Zap size={22} className="text-blue-400" />,
    gradient: "from-blue-900/60 to-blue-800/30",
    border: "border-blue-500/20 hover:border-blue-400/50",
    glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
    badge: null,
    badgeColor: "",
    priceColor: "text-blue-300",
  },
  {
    id: "popular",
    label: "Avantajlı Paket",
    tokens: 100,
    price: 400,
    icon: <Flame size={22} className="text-violet-400" />,
    gradient: "from-violet-900/70 to-purple-800/40",
    border: "border-violet-500/40 hover:border-violet-400/70",
    glow: "hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]",
    badge: "En Popüler",
    badgeColor: "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white",
    priceColor: "text-violet-300",
  },
  {
    id: "mega",
    label: "Mega Paket",
    tokens: 250,
    price: 900,
    icon: <Crown size={22} className="text-amber-400" />,
    gradient: "from-amber-900/60 to-yellow-800/30",
    border: "border-amber-500/20 hover:border-amber-400/50",
    glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]",
    badge: "Maksimum Değer",
    badgeColor: "bg-gradient-to-r from-amber-500 to-yellow-500 text-black",
    priceColor: "text-amber-300",
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TokenManagementPage() {
  const { planType, availableTokens, totalEverGranted, addTokens, isLoaded } = useTokens();
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: "" }), 4000);
  };

  const handlePurchase = async (pkg: (typeof TOKEN_PACKAGES)[0]) => {
    setPurchasing(pkg.id);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 1200));
    addTokens(pkg.tokens);
    setPurchasing(null);
    showToast(`${pkg.tokens} Token hesabınıza yüklendi! 🎉`);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full pb-16 space-y-10">
      <Toast message={toast.message} visible={toast.visible} />

      {/* ── Header ── */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted text-xs font-semibold uppercase tracking-widest">
          <Zap size={12} className="text-violet-400" />
          <span>Ayarlar</span>
          <ChevronRight size={12} />
          <span className="text-violet-300">Token Yönetimi</span>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Token Yönetimi
        </h1>
        <p className="text-sm text-muted max-w-lg">
          Her yapay zeka tasarım üretimi 1 token tüketir. Bakiyenizi buradan takip edebilir ve ekstra token satın alabilirsiniz.
        </p>
      </div>

      {/* ── Status Card ── */}
      <div
        className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 ${PLAN_COLORS[planType]} shadow-[0_8px_40px_rgba(0,0,0,0.4)]`}
      >
        {/* Background decoration */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-fuchsia-500/10 blur-2xl pointer-events-none" />

        <div className="relative space-y-6">
          {/* Plan name row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center shadow-lg">
                {PLAN_ICONS[planType]}
              </div>
              <div>
                <p className="text-xs text-muted font-semibold uppercase tracking-wider">Mevcut Plan</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <h2 className="text-xl font-extrabold text-foreground">{planType} Plan</h2>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PLAN_BADGE_COLORS[planType]}`}>
                    {planType}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted font-medium">Aylık Limit</p>
              <p className="text-3xl font-black text-foreground mt-0.5">
                {PLAN_LIMITS[planType]}{" "}
                <span className="text-sm font-medium text-muted">Token</span>
              </p>
            </div>
          </div>

          {/* Big token number */}
          <div className="text-center py-4">
            <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-2">
              Mevcut Token Bakiyesi
            </p>
            <div className="flex items-end justify-center gap-3">
              <span
                className="font-black text-transparent bg-clip-text"
                style={{
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                  lineHeight: 1,
                  backgroundImage:
                    "linear-gradient(135deg, #a78bfa 0%, #c084fc 40%, #f0abfc 100%)",
                }}
              >
                {availableTokens}
              </span>
              <span className="text-2xl font-bold text-muted mb-2">Token</span>
            </div>
          </div>

          {/* Progress bar */}
          <TokenProgressBar current={availableTokens} total={totalEverGranted} />

          {/* Plan feature hints */}
          <div className="flex flex-wrap gap-3 pt-2">
            {[
              { icon: <Sparkles size={12} />, label: "1 Token = 1 AI Tasarım" },
              { icon: <TrendingUp size={12} />, label: "Her ay otomatik yenilenir" },
              { icon: <Star size={12} />, label: `Aylık ${PLAN_LIMITS[planType]} başlangıç Token` },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 text-[11px] text-muted bg-black/20 border border-white/5 px-3 py-1.5 rounded-full"
              >
                <span className="text-violet-400">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Purchase Section ── */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <ShoppingCart size={16} className="text-violet-400" />
            Ekstra Token Satın Al
          </div>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TOKEN_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl border bg-gradient-to-br ${pkg.gradient} ${pkg.border} ${pkg.glow} p-6 transition-all duration-300 flex flex-col`}
            >
              {/* Badge */}
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className={`text-[10px] font-black px-3 py-1 rounded-full shadow-lg ${pkg.badgeColor}`}
                  >
                    {pkg.badge}
                  </span>
                </div>
              )}

              <div className="flex-1 space-y-4">
                {/* Icon + Label */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center">
                    {pkg.icon}
                  </div>
                  <h3 className="font-bold text-foreground text-sm">{pkg.label}</h3>
                </div>

                {/* Token count */}
                <div>
                  <p className={`text-4xl font-black ${pkg.priceColor}`}>
                    {pkg.tokens}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {pkg.tokens} Yapay Zeka Tasarımı
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {[
                    `${pkg.tokens} Token anında yüklenir`,
                    "Süresi dolmaz",
                    "İstediğin zaman kullan",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price + Buy */}
              <div className="pt-5 space-y-3 border-t border-white/5 mt-5">
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-black ${pkg.priceColor}`}>
                    {pkg.price.toLocaleString("tr-TR")} ₺
                  </span>
                  <span className="text-xs text-muted">/ {pkg.tokens} token</span>
                </div>
                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={purchasing === pkg.id}
                  className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    purchasing === pkg.id
                      ? "opacity-60 cursor-not-allowed bg-white/5"
                      : pkg.id === "popular"
                      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:brightness-110 text-white shadow-lg shadow-violet-500/20"
                      : "bg-white/10 hover:bg-white/15 text-foreground border border-white/10"
                  }`}
                >
                  {purchasing === pkg.id ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={14} />
                      Satın Al
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Plan Comparison ── */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Star size={14} className="text-violet-400" />
          Abonelik Planları — Aylık Token Limitleri
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(["Standard", "Pro", "Premium"] as PlanType[]).map((plan) => (
            <div
              key={plan}
              className={`rounded-2xl border p-5 relative transition-all duration-200 bg-gradient-to-br ${PLAN_COLORS[plan]} ${
                planType === plan
                  ? "ring-2 ring-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                  : ""
              }`}
            >
              {planType === plan && (
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">
                    Aktif
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                {PLAN_ICONS[plan]}
                <span className="font-bold text-foreground text-sm">{plan}</span>
              </div>
              <p className="text-3xl font-black text-foreground">
                {PLAN_LIMITS[plan]}
              </p>
              <p className="text-xs text-muted mt-1">Token / ay</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shimmer keyframe via inline style */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}
