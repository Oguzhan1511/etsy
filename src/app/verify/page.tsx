"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Hesabınız doğrulanıyor, lütfen bekleyin...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Geçersiz link. Doğrulama kodu eksik.");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          setMessage(data.message || "Hesabınız başarıyla onaylandı!");
        } else {
          setStatus("error");
          setMessage(data.error || "Doğrulama başarısız oldu.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Sunucuyla bağlantı kurulamadı.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Animated Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-violet-600/10 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-fuchsia-600/10 blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        
        {/* Card */}
        <div className="w-full rounded-[24px] p-8 space-y-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-border bg-white/[0.02] backdrop-blur-2xl relative overflow-hidden flex flex-col items-center text-center">
          
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 size={48} className="text-violet-500 animate-spin" />
              <h2 className="text-xl font-bold text-foreground">Doğrulanıyor</h2>
              <p className="text-foreground/60 text-sm">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4 py-4 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)] mb-2">
                <CheckCircle2 size={40} className="text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Harika!</h2>
              <p className="text-foreground/70 text-sm mb-4">{message}</p>
              
              <Link href="/login" className="w-full group relative flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-foreground transition-all duration-300 overflow-hidden bg-white/5 border border-border hover:border-violet-500/50">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Giriş Yap</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4 py-4 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)] mb-2">
                <XCircle size={40} className="text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Hata</h2>
              <p className="text-foreground/70 text-sm mb-4">{message}</p>
              
              <Link href="/login" className="w-full group relative flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-foreground transition-all duration-300 overflow-hidden bg-white/5 border border-border hover:border-white/30">
                <span className="relative z-10">Giriş Ekranına Dön</span>
              </Link>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
