"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, Loader2, ArrowUpRight } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  planName: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/admin/transactions");
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-emerald-400" />
            İşlemler (Gelir Tablosu)
          </h1>
          <p className="text-white/50 mt-1">Platform üzerinden yapılan tüm Iyzico ödemelerini ve paket satışlarını izleyin.</p>
        </div>
        
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
          <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">Toplam Ciro</div>
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            ₺{totalRevenue.toLocaleString('tr-TR')}
            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Müşteri</th>
                <th className="px-6 py-4 font-semibold">Paket</th>
                <th className="px-6 py-4 font-semibold">Tutar</th>
                <th className="px-6 py-4 font-semibold">Durum</th>
                <th className="px-6 py-4 text-right font-semibold">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{tx.user.name}</div>
                    <div className="text-xs text-white/40">{tx.user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 rounded-md text-xs font-semibold bg-white/5 text-white/80 border border-white/10 uppercase tracking-wider">
                      {tx.planName}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-white">
                    {tx.amount} {tx.currency}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Başarılı
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-white/40 font-mono text-xs">
                    {new Date(tx.createdAt).toLocaleString('tr-TR')}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-white/40">
                    Henüz hiç işlem (satın alma) bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
