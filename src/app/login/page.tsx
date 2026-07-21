"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const router = useRouter();

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

    const ok = await login(email, password);
    setSubmitting(false);

    if (ok) {
      router.replace("/");
    } else {
      setError("E-posta ve şifre boş bırakılamaz.");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#09090b]">
        <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="absolute top-6 right-6 flex items-center justify-center w-12 h-10 rounded-xl transition-all duration-150 font-bold text-xs shadow-lg z-50 cursor-pointer"
        style={{
          background: "rgba(22, 22, 30, 0.8)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "var(--text-secondary)",
          backdropFilter: "blur(12px)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(124,106,247,0.15)";
          (e.currentTarget as HTMLElement).style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(22, 22, 30, 0.8)";
          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
        }}
        title={t("common.language")}
      >
        <Globe size={14} className="mr-1 opacity-70" />
        {language === "tr" ? "TR" : "EN"}
      </button>
      
      {/* Background glow blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full bg-violet-500/8 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#16161f] border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)] relative overflow-hidden shrink-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-400/10" />
            <span className="font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-purple-200 z-10" style={{ fontSize: '24px', lineHeight: 1 }}>
              PS
            </span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">PrintySell</h1>
            <p className="text-xs text-[#6b6880] mt-0.5">{t("login.title")}</p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-6 space-y-5 shadow-2xl"
          style={{
            background: "rgba(22, 22, 30, 0.95)",
            borderColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#6b6880] uppercase tracking-wider block">
                {t("login.email")}
              </label>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4760]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-[#3d3a52] outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(124,106,247,0.5)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,106,247,0.08)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#6b6880] uppercase tracking-wider block">
                {t("login.password")}
              </label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4760]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-white placeholder-[#3d3a52] outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(124,106,247,0.5)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,106,247,0.08)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4760] hover:text-[#a09cb0] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1"
              style={{
                background: "linear-gradient(135deg, #7c6af7 0%, #a855f7 100%)",
                boxShadow: "0 4px 20px rgba(124,106,247,0.25)",
              }}
              onMouseEnter={(e) => {
                if (!submitting) (e.currentTarget as HTMLElement).style.opacity = "0.88";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <span>{t("login.submit")}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Hint */}
          <p className="text-center text-[11px] text-[#4a4760]">
            {t("login.hint")}
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-[#3a3750] mt-6">
          © {new Date().getFullYear()} PrintySell — {t("login.rights")}
        </p>
      </div>
    </div>
  );
}
