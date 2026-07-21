"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Globe, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect to home
  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Using login for both since we don't have a real backend registration yet
    const ok = await login(email, password);
    setSubmitting(false);

    if (ok) {
      router.replace("/");
    } else {
      setError(t("login.errorEmpty") || "E-posta ve şifre boş bırakılamaz.");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#030014]">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Animated Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-violet-600/10 blur-[120px] mix-blend-screen animate-blob pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-fuchsia-600/10 blur-[120px] mix-blend-screen animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/5 blur-[100px] mix-blend-screen animate-blob animation-delay-4000 pointer-events-none" />

      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="absolute top-6 right-6 flex items-center justify-center w-12 h-10 rounded-xl transition-all duration-300 font-bold text-xs shadow-lg z-50 cursor-pointer border border-white/10 bg-white/5 backdrop-blur-md text-white/70 hover:bg-white/10 hover:text-white"
        title={t("common.language")}
      >
        <Globe size={14} className="mr-1 opacity-70" />
        {language === "tr" ? "TR" : "EN"}
      </button>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-4 group">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-black/40 border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.2)] relative overflow-hidden shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-fuchsia-500/20 to-transparent" />
            <span className="font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 z-10 text-3xl">
              PS
            </span>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">PrintySell</h1>
            <p className="text-sm text-white/50 mt-1">
              {mode === "login" ? t("login.welcome") || "Hoş Geldiniz" : t("login.createAccount") || "Yeni Hesap Oluşturun"}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="w-full rounded-[24px] p-8 space-y-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl relative overflow-hidden">
          
          {/* Inner subtle glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

          {/* Mode Toggle */}
          <div className="relative flex items-center bg-black/40 rounded-xl p-1 border border-white/5">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-lg shadow-sm transition-all duration-300 ease-out border border-white/10 ${mode === "login" ? "left-1" : "left-[calc(50%+3px)]"}`}
            />
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 relative z-10 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer ${mode === "login" ? "text-white" : "text-white/40 hover:text-white/70"}`}
            >
              {t("login.loginTab") || "Giriş Yap"}
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 relative z-10 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer ${mode === "register" ? "text-white" : "text-white/40 hover:text-white/70"}`}
            >
              {t("login.registerTab") || "Kayıt Ol"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name (Only for Register) */}
            <div className={`space-y-1.5 transition-all duration-500 ease-in-out overflow-hidden ${mode === "register" ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}>
              <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block ml-1">
                {t("login.name") || "Ad Soyad"}
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 -z-10" />
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-violet-400 transition-colors duration-300" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all duration-300 bg-black/40 border border-white/10 focus:border-violet-500/50 focus:bg-black/60"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block ml-1">
                {t("login.email")}
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 -z-10" />
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-violet-400 transition-colors duration-300" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all duration-300 bg-black/40 border border-white/10 focus:border-violet-500/50 focus:bg-black/60"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block">
                  {t("login.password")}
                </label>
                {mode === "login" && (
                  <a href="#" className="text-[11px] font-medium text-violet-400 hover:text-violet-300 transition-colors">
                    Şifremi Unuttum
                  </a>
                )}
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 -z-10" />
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-violet-400 transition-colors duration-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all duration-300 bg-black/40 border border-white/10 focus:border-violet-500/50 focus:bg-black/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full group relative flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-4 overflow-hidden bg-white/5 border border-white/10 hover:border-violet-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,white_0%,transparent_100%)] transition-opacity duration-500" />
              
              <div className="relative flex items-center gap-2">
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>{mode === "login" ? t("login.submit") : (t("login.registerSubmit") || "Hesap Oluştur")}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Hint */}
          <div className="pt-2">
            <p className="text-center text-[11px] text-white/40 bg-black/20 rounded-lg p-3 border border-white/5">
              {t("login.hint")}
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-white/30 mt-8 font-medium tracking-wide">
          © {new Date().getFullYear()} PRINTYSELL — {t("login.rights")?.toUpperCase() || "TÜM HAKLARI SAKLIDIR"}
        </p>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
