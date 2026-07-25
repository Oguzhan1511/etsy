"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function WaitlistPage() {
  const router = useRouter();
  const { registerUser, googleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      setSubmitting(true);
      setError("");
      const res = await googleLogin(credentialResponse.credential);
      if (res.success && res.user) {
        setSuccess(true);
      } else {
        setError(res.error || "Google kaydı başarısız.");
        setSubmitting(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await registerUser(name, email, password);
    setSubmitting(false);
    
    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || "Kayıt başarısız.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent pointer-events-none" />

        <div className="w-full max-w-md z-10">
          <div className="text-center mb-10 animate-fade-in-up">
            <Link href="/" className="inline-block text-3xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500 hover:scale-105 transition-transform">
              PrintySell
            </Link>
            <h1 className="text-2xl font-bold text-foreground">
              Erken Erişim İçin Ön Kayıt Olun
            </h1>
            <p className="text-foreground/60 mt-2">
              Bekleme listesine katılın ve lansmanda 50 ücretsiz yapay zeka tokenı kazanın!
            </p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl shadow-black/50 relative overflow-hidden">
            
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="text-violet-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Ön Kaydınız Alındı!</h3>
                <p className="text-foreground/60">
                  Bekleme listesine başarıyla eklendiniz. 50 Token hesabınıza rezerve edildi. Sistem açıldığında e-posta adresinize haber vereceğiz!
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-block text-violet-400 hover:text-violet-300 transition-colors font-medium"
                >
                  Ana Sayfaya Dön
                </Link>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-foreground/80 mb-1.5 block">Ad Soyad</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                        placeholder="Adınız Soyadınız"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground/80 mb-1.5 block">E-posta</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                        placeholder="ornek@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground/80 mb-1.5 block">Şifre Belirle</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-foreground text-background font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Ön Kayıt Ol
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-4 text-foreground/40">Veya Google ile Kaydolun</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError("Google girişi başarısız.")}
                    theme="filled_black"
                    shape="pill"
                    text="continue_with"
                    size="large"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
