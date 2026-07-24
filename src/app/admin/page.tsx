"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  AlertTriangle,
  Loader2 
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

interface StatsData {
  totalUsers: number;
  premiumUsers: number;
  totalRevenue: number;
  tokensSpentToday: number;
  chartData: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!stats) return <div className="text-red-400">Veriler yüklenemedi. Yetkiniz olmayabilir.</div>;

  const statCards = [
    {
      title: "Toplam Gelir",
      value: `₺${stats.totalRevenue.toLocaleString("tr-TR")}`,
      icon: CreditCard,
      color: "from-emerald-600 to-teal-400",
      iconColor: "text-emerald-400",
      bgClass: "bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "Toplam Kullanıcı",
      value: stats.totalUsers.toLocaleString("tr-TR"),
      subValue: `${stats.premiumUsers} Premium`,
      icon: Users,
      color: "from-blue-600 to-cyan-400",
      iconColor: "text-blue-400",
      bgClass: "bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "Günlük Token Kullanımı",
      value: stats.tokensSpentToday.toLocaleString("tr-TR"),
      icon: TrendingUp,
      color: "from-purple-600 to-fuchsia-400",
      iconColor: "text-purple-400",
      bgClass: "bg-purple-500/10 border-purple-500/20"
    },
    {
      title: "Çözülmemiş Hatalar",
      value: "0",
      icon: AlertTriangle,
      color: "from-red-600 to-orange-400",
      iconColor: "text-red-400",
      bgClass: "bg-red-500/10 border-red-500/20"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Sistem İstatistikleri
        </h1>
        <p className="text-white/50 mt-1">Platformunuzun genel durumunu ve gelir analizini canlı izleyin.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx}
              className={`p-6 rounded-2xl border ${card.bgClass} backdrop-blur-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">{card.title}</p>
                  <h3 className="text-3xl font-bold text-white">{card.value}</h3>
                  {card.subValue && <p className="text-xs text-white/40 mt-1">{card.subValue}</p>}
                </div>
                <div className={`p-3 rounded-xl bg-black/40 border border-white/5 shadow-inner`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
              
              {/* Decorative Gradient Blob */}
              <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${card.color} rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Son 30 Günlük Gelir Tablosu</h3>
            <p className="text-xs text-white/40">Günlük bazda toplam paket satışı cirosu (₺)</p>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  tickMargin={10}
                  tickFormatter={(val) => val.split(" ")[0]} // Sadece günü göster
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10}
                  tickFormatter={(val) => `₺${val}`} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                  formatter={(value: number) => [`₺${value}`, "Gelir"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Token Usage Bar Chart */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Token Yakımı</h3>
            <p className="text-xs text-white/40">Kullanıcıların harcadığı günlük tokenlar</p>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData.slice(-7)} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  tickFormatter={(val) => val.split(" ")[0]} 
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="tokens" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
