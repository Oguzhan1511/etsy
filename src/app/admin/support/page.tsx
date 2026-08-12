"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, CheckCircle, Clock, XCircle, Send, Search, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Ticket { id: string; subject: string; status: string; createdAt: string; updatedAt: string; user?: { name: string, email: string } }
interface Message { id: string; message: string; isAdmin: boolean; createdAt: string; user?: { name: string } }

export default function AdminSupportPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeTicketIdRef = useRef<string | null>(null);

  useEffect(() => {
    activeTicketIdRef.current = selectedTicket?.id || null;
  }, [selectedTicket?.id]);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/admin/support");
      const data = await res.json();
      if (data.tickets) {
        setTickets(data.tickets);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/support/${id}`);
      const data = await res.json();
      if (data.ticket && data.ticket.messages && activeTicketIdRef.current === id) {
        setMessages(data.ticket.messages);
        setSelectedTicket(data.ticket);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedTicket?.id) {
      fetchMessages(selectedTicket.id);
      const interval = setInterval(() => fetchMessages(selectedTicket.id), 10000);
      return () => clearInterval(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTicket?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/support/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchTickets();
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!user || !selectedTicket || !newMessage.trim() || isSending) return;

    setIsSending(true);
    // Optimistic update
    const optimisticMessage = {
      id: "temp-" + Date.now(),
      message: newMessage,
      isAdmin: true,
      createdAt: new Date().toISOString(),
      user: { name: user.name }
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    const originalMessage = newMessage;
    setNewMessage("");

    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          message: newMessage,
          isAdmin: true,
        }),
      });
      const data = await res.json();
      if (data.message) {
        fetchMessages(selectedTicket.id);
        fetchTickets();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(search.toLowerCase()) || 
    (t.user?.email && t.user.email.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return <div className="text-white/60 p-8">Yükleniyor...</div>;
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Destek Talepleri</h1>
          <p className="text-white/50 mt-1">Kullanıcılardan gelen destek ve yardım taleplerini yönetin.</p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden min-h-[600px] max-h-[800px]">
        {/* Tickets List */}
        <div className="w-1/3 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col backdrop-blur-md overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text"
                placeholder="Konu veya email ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {filteredTickets.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  if (selectedTicket?.id !== t.id) {
                    setMessages([]); // Clear instantly for fast UI feedback
                    setSelectedTicket(t);
                  }
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedTicket?.id === t.id ? "bg-purple-500/10 border-purple-500/30" : "bg-black/20 border-white/5 hover:bg-white/5"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-medium truncate pr-2">{t.subject}</h3>
                  {t.status === "OPEN" && <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0">Açık</span>}
                  {t.status === "CLOSED" && <span className="bg-white/10 text-white/50 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0">Kapalı</span>}
                  {t.status === "IN_PROGRESS" && <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0">İşlemde</span>}
                </div>
                <div className="flex items-center gap-1.5 text-white/50 text-xs mb-2">
                  <User className="w-3 h-3" />
                  <span className="truncate">{t.user?.email}</span>
                </div>
                <div className="text-white/40 text-[10px] flex justify-between">
                  <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  <span>Son işlem: {new Date(t.updatedAt).toLocaleTimeString()}</span>
                </div>
              </button>
            ))}
            {filteredTickets.length === 0 && (
              <div className="p-8 text-center text-white/40 text-sm">
                Talep bulunamadı.
              </div>
            )}
          </div>
        </div>

        {/* Ticket Detail & Chat */}
        <div className="w-2/3 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col backdrop-blur-md overflow-hidden">
          {selectedTicket ? (
            <>
              <div className="p-6 border-b border-white/10 flex justify-between items-start bg-white/[0.01]">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedTicket.subject}</h2>
                  <div className="flex gap-4 mt-2 text-sm text-white/50">
                    <span className="flex items-center gap-1.5"><User className="w-4 h-4"/> {selectedTicket.user?.name} ({selectedTicket.user?.email})</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedTicket.status !== "OPEN" && (
                    <button 
                      onClick={() => handleStatusChange(selectedTicket.id, "OPEN")}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-xs font-medium transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Açık Yap
                    </button>
                  )}
                  {selectedTicket.status !== "CLOSED" && (
                    <button 
                      onClick={() => handleStatusChange(selectedTicket.id, "CLOSED")}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-medium transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Kapat
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.isAdmin ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-2xl p-4 ${m.isAdmin ? "bg-purple-600/20 border border-purple-500/20 text-purple-100 rounded-tr-sm" : "bg-white/5 border border-white/10 text-white/90 rounded-tl-sm"}`}>
                      <div className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-50">
                        {m.isAdmin ? "Admin" : m.user?.name || "Kullanıcı"}
                      </div>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {m.message}
                      </div>
                      <div className="text-[10px] opacity-40 mt-2 text-right">
                        {new Date(m.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-white/10 bg-black/20">
                {selectedTicket.status === "CLOSED" ? (
                  <div className="text-center text-white/40 text-sm py-2">
                    Bu talep kapatılmış. Yanıt göndermek için tekrar açın.
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Yanıtınızı buraya yazın..."
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors resize-none h-14"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || isSending}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-5 rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center"
                    >
                      {isSending ? <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : <Send className="w-5 h-5" />}
                    </button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white/30">
              <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
              <p>Görüntülemek için sol taraftan bir talep seçin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
