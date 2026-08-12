"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface Ticket { id: string; subject: string; status: string; updatedAt: string; }
interface Message { id: string; message: string; isAdmin: boolean; createdAt: string; user?: { name: string } }

export default function SupportWidget() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTickets = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/support/tickets?userId=${user.id}`);
      const data = await res.json();
      if (data.tickets) {
        setTickets(data.tickets);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/messages`);
      const data = await res.json();
      if (data.ticket && data.ticket.messages) {
        setMessages(data.ticket.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user && isOpen) {
      fetchTickets();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isOpen]);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket.id);
      const interval = setInterval(() => fetchMessages(selectedTicket.id), 10000);
      return () => clearInterval(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTicket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subject.trim() || !newMessage.trim()) return;

    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          subject,
          initialMessage: newMessage,
        }),
      });
      const data = await res.json();
      if (data.ticket) {
        setSubject("");
        setNewMessage("");
        setIsCreating(false);
        fetchTickets();
        setSelectedTicket(data.ticket);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedTicket || !newMessage.trim()) return;

    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          message: newMessage,
          isAdmin: false,
        }),
      });
      const data = await res.json();
      if (data.message) {
        setNewMessage("");
        fetchMessages(selectedTicket.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="bg-surface border border-border shadow-2xl rounded-2xl w-80 sm:w-96 flex flex-col h-[500px] overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {selectedTicket && (
                <button onClick={() => setSelectedTicket(null)} className="hover:bg-blue-700 p-1 rounded">
                  <ChevronDown className="rotate-90" size={20} />
                </button>
              )}
              <h3 className="font-bold">
                {selectedTicket ? selectedTicket.subject : "Destek Merkezi"}
              </h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 bg-background/50">
            {!selectedTicket && !isCreating && (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Yeni Talep Aç
                </button>
                {tickets.length > 0 ? (
                  <div className="flex flex-col gap-2 mt-4">
                    <h4 className="text-sm font-semibold text-secondary px-1">Geçmiş Talepler</h4>
                    {tickets.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTicket(t)}
                        className="text-left p-3 rounded-lg border border-border bg-surface hover:border-blue-500 transition-colors"
                      >
                        <div className="font-medium truncate">{t.subject}</div>
                        <div className="text-xs flex justify-between mt-1 text-secondary">
                          <span>{t.status === "OPEN" ? "Açık" : "Kapalı"}</span>
                          <span>{new Date(t.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-secondary text-sm mt-8">
                    Henüz bir destek talebiniz bulunmuyor.
                  </div>
                )}
              </div>
            )}

            {isCreating && (
              <form onSubmit={handleCreateTicket} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1">Konu</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2 text-sm border border-border rounded bg-surface focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1">Mesaj</label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={4}
                    className="w-full p-2 text-sm border border-border rounded bg-surface focus:outline-none focus:border-blue-500 resize-none"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="flex-1 py-2 text-sm border border-border rounded hover:bg-hover transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Gönder
                  </button>
                </div>
              </form>
            )}

            {selectedTicket && (
              <div className="flex flex-col gap-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      m.isAdmin
                        ? "bg-surface border border-border self-start rounded-tl-sm"
                        : "bg-blue-600 text-white self-end rounded-tr-sm"
                    }`}
                  >
                    {m.message}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Footer (Chat input) */}
          {selectedTicket && selectedTicket.status !== "CLOSED" && (
            <div className="p-3 border-t border-border bg-surface">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 p-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
