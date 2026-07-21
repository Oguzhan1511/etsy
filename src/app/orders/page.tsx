"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Search
} from "lucide-react";

interface Order {
  id: string;
  orderId: string;
  buyerName: string;
  email: string;
  product: string;
  image: string;
  price: string;
  orderedTime: string;
  shipBy: string;
  status: "Processing" | "Ready to Ship" | "Shipped" | "Cancelled";
  shippingAddress: string;
}

export default function OrdersPage() {
  const [filter, setFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/etsy/orders')
      .then(res => res.json())
      .then(data => {
        if (!data.error && Array.isArray(data)) {
          const formatted = data.map((rawItem: unknown) => {
            const item = rawItem as Record<string, unknown>;
            const txs = item.transactions as Array<Record<string, unknown>>;
            const transaction = txs && txs[0] ? txs[0] : null;
            const status = item.is_shipped ? "Shipped" : "Processing";
            const createdTimestamp = item.created_timestamp as number;
            const orderedTime = new Date(createdTimestamp * 1000).toLocaleString();
            
            return {
              id: String(item.receipt_id),
              orderId: `#ET-${item.receipt_id}`,
              buyerName: String(item.name || "Unknown"),
              email: item.buyer_email ? String(item.buyer_email) : "N/A",
              product: transaction ? String(transaction.title) : "Unknown Product",
              image: "", // Orders endpoint does not easily include images without a lot of extra calls, leaving blank or placeholder for now
              price: `$${(Number((item.grandtotal as Record<string, number>)?.amount) / Number((item.grandtotal as Record<string, number>)?.divisor)).toFixed(2)}`,
              orderedTime,
              shipBy: "Pending",
              status: status as Order["status"],
              shippingAddress: String(item.formatted_address),
            };
          });
          setOrders(formatted);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleShipOrder = (id: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status: "Shipped", shipBy: "Completed" } : o))
    );
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === "All" || o.status === filter;
    const matchesSearch =
      o.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.product.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f1f0ff] to-[#a09cb0] bg-clip-text text-transparent">
            Etsy Sipariş Yönetimi
          </h1>
          <p className="text-sm mt-0.5 text-[#a09cb0]">
            Track customer orders, generate shipping labels, and manage listing dispatch status.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#5e5a72] block uppercase font-bold tracking-wider">Aktif Siparişler</span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {orders.filter(o => o.status !== "Shipped" && o.status !== "Cancelled").length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <ShoppingBag size={18} />
          </div>
        </div>

        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#5e5a72] block uppercase font-bold tracking-wider">Kargoya Hazır</span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {orders.filter(o => o.status === "Ready to Ship").length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Truck size={18} />
          </div>
        </div>

        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#5e5a72] block uppercase font-bold tracking-wider">Kargolananlar</span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {orders.filter(o => o.status === "Shipped").length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle size={18} />
          </div>
        </div>

        <div className="bg-[#16161e] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#5e5a72] block uppercase font-bold tracking-wider">Ortalama Gönderim Süresi</span>
            <span className="text-2xl font-bold text-white mt-1 block">1.2 Gün</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Clock size={18} />
          </div>
        </div>
      </div>

      {/* Control panel & Filter tabs */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-black/10 p-3 rounded-xl border border-white/[0.03]">
        <div className="flex flex-wrap bg-white/[0.02] p-1 rounded-lg border border-white/[0.05] self-start">
          {["All", "Processing", "Ready to Ship", "Shipped"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                filter === status
                  ? "bg-purple-500/20 border border-purple-500/35 text-white"
                  : "text-[#a09cb0] hover:text-white"
              }`}
            >
              {status === "All" ? "Hepsi" : status === "Processing" ? "Hazırlanıyor" : status === "Ready to Ship" ? "Kargoya Hazır" : "Gönderildi"}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5e5a72]" />
          <input
            type="text"
            placeholder="Sipariş, isim veya model ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-white/[0.08] bg-[#16161e] text-xs text-white placeholder-[#5e5a72] focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Orders List / Cards Stack */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center border border-white/[0.05] bg-black/5 rounded-xl space-y-2">
            <AlertCircle className="w-8 h-8 text-[#5e5a72] mx-auto" />
            <p className="text-xs text-[#a09cb0]">Herhangi bir aktif sipariş bulunamadı.</p>
          </div>
        ) : (
          filteredOrders.map(o => (
            <div
              key={o.id}
              className="bg-[#16161e] border border-white/[0.05] hover:border-white/10 rounded-xl p-5 space-y-4 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 font-mono text-xs font-bold uppercase shrink-0">
                    {o.buyerName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{o.buyerName}</span>
                      <span className="text-xs text-[#5e5a72] font-mono">({o.email})</span>
                    </h3>
                    <span className="text-[10px] text-[#a09cb0] mt-0.5 block font-mono">{o.orderId}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    o.status === "Shipped" 
                      ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" 
                      : o.status === "Ready to Ship"
                      ? "text-blue-400 bg-blue-500/5 border-blue-500/10"
                      : "text-purple-400 bg-purple-500/5 border-purple-500/10"
                  }`}>
                    {o.status === "Processing" ? "Hazırlanıyor" : o.status === "Ready to Ship" ? "Kargoya Hazır" : "Gönderildi"}
                  </span>
                  
                  {o.status === "Ready to Ship" && (
                    <button
                      onClick={() => handleShipOrder(o.id)}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:brightness-110 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Truck size={12} />
                      <span>Kargola</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Order item details */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                    <img src={o.image} alt={o.product} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-normal max-w-[280px] sm:max-w-md">
                      {o.product}
                    </h4>
                    <div className="flex items-center gap-3 text-[10px] text-[#5e5a72] mt-1 font-mono">
                      <span>Price: <strong className="text-white">{o.price}</strong></span>
                      <span>•</span>
                      <span>Ship By: <strong className={o.shipBy === "Completed" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>{o.shipBy}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-left md:text-right border-l md:border-l-0 md:border-r border-white/[0.04] pl-3 md:pl-0 md:pr-4 py-0.5 space-y-1">
                  <span className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider block">Fatura Adresi</span>
                  <p className="text-xs text-[#a09cb0] max-w-[240px] leading-relaxed truncate md:whitespace-normal" title={o.shippingAddress}>
                    {o.shippingAddress}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
