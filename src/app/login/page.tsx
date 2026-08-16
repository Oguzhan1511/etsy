"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Globe, User, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

type Mode = "login" | "register" | "forgot_password" | "reset_sent" | "verify_code";

export default function LoginPage() {
  const { login, googleLogin, registerUser, user, isLoading } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      if (mode === "register" && !termsAccepted) {
        setError("Devam etmek için Kullanıcı Sözleşmesini kabul etmelisiniz.");
        return;
      }
      setSubmitting(true);
      setError("");
      const res = await googleLogin(credentialResponse.credential);
      if (res.success && res.user) {
        router.replace("/dashboard");
      } else {
        setError(res.error || "Google girişi başarısız.");
        setSubmitting(false);
      }
    }
  };

  // Water Ripple Effect
  useEffect(() => {
    let lastTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime > 150) {
        const target = e.target as HTMLElement;
        // Do not spawn ripples if hovering over the main card
        if (target.closest('.no-ripple-zone')) return;

        lastTime = now;
        const newRipple = { x: e.clientX, y: e.clientY, id: now };
        setRipples(prev => [...prev.slice(-12), newRipple]);
        
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 2000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (mode === "forgot_password") {
      // Simulate sending a reset password link
      setTimeout(() => {
        setSubmitting(false);
        setMode("reset_sent");
      }, 1500);
      return;
    }

    if (mode === "register") {
      if (!termsAccepted) {
        setError("Devam etmek için Kullanıcı Sözleşmesini kabul etmelisiniz.");
        setSubmitting(false);
        return;
      }
      const res = await registerUser(name, email, password);
      setSubmitting(false);
      if (res.success) {
        setMode("verify_code");
      } else {
        setError(res.error || "Kayıt başarısız.");
      }
      return;
    }

    if (mode === "verify_code") {
      try {
        const verifyRes = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token: verificationCode }),
        });
        const verifyData = await verifyRes.json();
        
        if (verifyRes.ok && verifyData.success) {
          // If verified successfully, log them in!
          const loginRes = await login(email, password);
          setSubmitting(false);
          if (loginRes.success) {
             router.replace("/dashboard");
          } else {
             setError("Onaylandı ancak otomatik giriş yapılamadı. Lütfen giriş yapın.");
             setMode("login");
          }
        } else {
          setSubmitting(false);
          setError(verifyData.error || "Geçersiz veya hatalı kod.");
        }
      } catch {
        setSubmitting(false);
        setError("Sunucu hatası, lütfen tekrar deneyin.");
      }
      return;
    }

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success && res.user) {
      router.replace("/dashboard");
    } else {
      setError(res.error || t("login.errorEmpty") || "E-posta ve şifre boş bırakılamaz.");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Animated Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-violet-600/10 blur-[120px] mix-blend-screen animate-blob pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-fuchsia-600/10 blur-[120px] mix-blend-screen animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/5 blur-[100px] mix-blend-screen animate-blob animation-delay-4000 pointer-events-none" />

      {/* Water Ripples */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {ripples.map(r => (
          <div
            key={r.id}
            className="absolute border border-border-hover rounded-full animate-ripple"
            style={{
              left: r.x - 50,
              top: r.y - 50,
              width: 100,
              height: 100,
            }}
          />
        ))}
      </div>

      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="absolute top-6 right-6 flex items-center justify-center w-12 h-10 rounded-xl transition-all duration-300 font-bold text-xs shadow-lg z-50 cursor-pointer border border-border bg-white/5 backdrop-blur-md text-foreground/70 hover:bg-white/10 hover:text-foreground"
        title={t("common.language")}
      >
        <Globe size={14} className="mr-1 opacity-70" />
        {language === "tr" ? "TR" : "EN"}
      </button>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-4 group">
          <div className="w-24 h-24 flex items-center justify-center relative overflow-visible shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <img src="/logo.png" alt="PrintySell Logo" className="w-full h-full object-contain z-10" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">PrintySell</h1>
            <p className="text-sm text-foreground/50 mt-1">
              {mode === "login" && (t("login.welcome") || "Hoş Geldiniz")}
              {mode === "register" && (t("login.createAccount") || "Yeni Hesap Oluşturun")}
              {(mode === "forgot_password" || mode === "reset_sent") && (t("login.forgotPassword") || "Şifremi Unuttum")}
              {mode === "verify_code" && "Hesabınızı Onaylayın"}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="w-full rounded-[24px] p-8 space-y-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-border bg-white/[0.02] backdrop-blur-2xl relative overflow-hidden no-ripple-zone">
          
          {/* Inner subtle glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

          {/* Mode Toggle (Hidden in forgot password mode) */}
          {(mode === "login" || mode === "register") && (
            <div className="relative flex items-center bg-black/40 rounded-xl p-1 border border-border">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-lg shadow-sm transition-all duration-300 ease-out border border-border ${mode === "login" ? "left-1" : "left-[calc(50%+3px)]"}`}
              />
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); }}
                className={`flex-1 relative z-10 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer ${mode === "login" ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"}`}
              >
                {t("login.loginTab") || "Giriş Yap"}
              </button>
              <button
                type="button"
                onClick={() => { setMode("register"); setError(""); }}
                className={`flex-1 relative z-10 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer ${mode === "register" ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"}`}
              >
                {t("login.registerTab") || "Kayıt Ol"}
              </button>
            </div>
          )}

          {/* Forgot Password Description */}
          {mode === "forgot_password" && (
            <p className="text-sm text-center text-foreground/70 mb-4 px-2">
              {t("login.forgotPasswordDesc") || "E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim."}
            </p>
          )}

          {/* Reset Sent Message */}
          {(mode === "reset_sent") ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-4 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <CheckCircle2 size={32} className="text-green-400" />
              </div>
              <p className="text-sm text-center text-foreground/80 leading-relaxed px-4">
                {t("login.resetSent") || "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."}
              </p>
              <button
                type="button"
                onClick={() => setMode("login")}
                className="flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors mt-2"
              >
                <ArrowLeft size={14} />
                {t("login.backToLogin") || "Giriş Ekranına Dön"}
              </button>
            </div>
          ) : mode === "verify_code" ? (
            <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in zoom-in duration-500">
              <div className="flex flex-col items-center justify-center space-y-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                  <Mail size={32} className="text-violet-400" />
                </div>
                <h2 className="text-xl font-bold text-foreground">E-posta Doğrulama</h2>
                <p className="text-sm text-center text-foreground/70 px-2">
                  Lütfen <b>{email}</b> adresine gönderilen 4 haneli onay kodunu girin.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 -z-10" />
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="••••"
                    className="w-full text-center tracking-[1em] py-4 rounded-xl text-2xl font-bold text-foreground placeholder-white/20 outline-none transition-all duration-300 bg-black/40 border border-border focus:border-violet-500/50 focus:bg-black/60"
                  />
                </div>
              </div>

              {error && (
                <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || verificationCode.length !== 4}
                className="w-full group relative flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-foreground transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-4 overflow-hidden bg-white/5 border border-border hover:border-violet-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2">
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>Doğrula ve Giriş Yap</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); setVerificationCode(""); }}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-foreground/50 hover:text-foreground transition-colors mt-2"
              >
                <ArrowLeft size={14} />
                Giriş Ekranına Dön
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name (Only for Register) */}
              <div className={`space-y-1.5 transition-all duration-500 ease-in-out overflow-hidden ${mode === "register" ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}>
                <label className="text-[11px] font-semibold text-foreground/50 uppercase tracking-wider block ml-1">
                  {t("login.name") || "Ad Soyad"}
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 -z-10" />
                  <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-violet-400 transition-colors duration-300" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-foreground placeholder-white/20 outline-none transition-all duration-300 bg-black/40 border border-border focus:border-violet-500/50 focus:bg-black/60"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-foreground/50 uppercase tracking-wider block ml-1">
                  {t("login.email")}
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 -z-10" />
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-violet-400 transition-colors duration-300" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-foreground placeholder-white/20 outline-none transition-all duration-300 bg-black/40 border border-border focus:border-violet-500/50 focus:bg-black/60"
                  />
                </div>
              </div>

              {/* Password (Hidden in forgot_password mode) */}
              <div className={`space-y-1.5 transition-all duration-500 ease-in-out overflow-hidden ${(mode === "login" || mode === "register") ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[11px] font-semibold text-foreground/50 uppercase tracking-wider block">
                    {t("login.password")}
                  </label>
                  {mode === "login" && (
                    <button 
                      type="button" 
                      onClick={() => { setMode("forgot_password"); setError(""); }}
                      className="text-[11px] font-medium text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
                    >
                      {t("login.forgotPassword") || "Şifremi Unuttum"}
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 -z-10" />
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-violet-400 transition-colors duration-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required={mode !== "forgot_password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-xl text-sm text-foreground placeholder-white/20 outline-none transition-all duration-300 bg-black/40 border border-border focus:border-violet-500/50 focus:bg-black/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/80 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox (Only for Register) */}
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${mode === "register" ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="flex items-start gap-3 px-1 mt-2">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border border-border rounded-md bg-black/40 checked:bg-violet-500 checked:border-violet-500 transition-colors cursor-pointer"
                    />
                    <CheckCircle2 size={14} className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <label htmlFor="terms" className="text-xs text-foreground/70 leading-relaxed cursor-pointer select-none">
                    <button type="button" onClick={(e) => { e.preventDefault(); setIsTermsModalOpen(true); }} className="text-violet-400 hover:text-violet-300 hover:underline inline-block">Kullanıcı ve Abonelik Sözleşmesi</button>'ni okudum ve kabul ediyorum.
                  </label>
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
                disabled={submitting || (mode === "register" && !termsAccepted)}
                className="w-full group relative flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-foreground transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-4 overflow-hidden bg-white/5 border border-border hover:border-violet-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,white_0%,transparent_100%)] transition-opacity duration-500" />
                
                <div className="relative flex items-center gap-2">
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>
                        {mode === "login" && t("login.submit")}
                        {mode === "register" && (t("login.registerSubmit") || "Hesap Oluştur")}
                        {mode === "forgot_password" && (t("login.resetPassword") || "Şifreyi Sıfırla")}
                      </span>
                      {mode !== "forgot_password" && (
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                      )}
                    </>
                  )}
                </div>
              </button>

              {/* Back to Login (Only in forgot password) */}
              {mode === "forgot_password" && (
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(""); }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm text-foreground/50 hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={14} />
                  {t("login.backToLogin") || "Giriş Ekranına Dön"}
                </button>
              )}
            </form>
          )}

          {/* Google Login Separator */}
          {(mode === "login" || mode === "register") && (
            <>
              <div className="flex items-center gap-3 my-6 opacity-30">
                <div className="h-[1px] flex-1 bg-border" />
                <span className="text-xs uppercase tracking-wider font-semibold">VEYA</span>
                <div className="h-[1px] flex-1 bg-border" />
              </div>
              
              <div className="flex justify-center mb-4 relative">
                {mode === "register" && !termsAccepted && (
                  <div 
                    className="absolute inset-0 z-20 cursor-not-allowed" 
                    onClick={() => setError("Google ile kayıt olmadan önce Kullanıcı Sözleşmesini kabul etmelisiniz.")}
                  />
                )}
                <div className={`transition-opacity ${mode === "register" && !termsAccepted ? "opacity-50" : "opacity-100"}`}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      setError("Google ile giriş yapılamadı.");
                    }}
                    theme="filled_black"
                    shape="pill"
                    size="large"
                    text={mode === "register" ? "signup_with" : "signin_with"}
                  />
                </div>
              </div>
            </>
          )}

          {/* Hint */}
          {(mode === "login" || mode === "register") && (
            <div className="pt-2">
              <p className="text-center text-[11px] text-foreground/40 bg-black/20 rounded-lg p-3 border border-border">
                {t("login.hint")}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-foreground/30 mt-8 font-medium tracking-wide uppercase">
          © {new Date().getFullYear()} PRINTYSELL — {t("login.rights")}
        </p>
      </div>

      {/* Terms of Service Modal */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsTermsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
              <h2 className="text-lg font-bold text-white">Kullanıcı ve Abonelik Sözleşmesi</h2>
              <button 
                onClick={() => setIsTermsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-white/70 leading-relaxed font-sans custom-scrollbar">

              <section>
                <h3 className="text-base font-semibold text-white mb-2">1. Taraflar</h3>
                <p className="mb-2">
                  İşbu Kullanıcı ve Abonelik Sözleşmesi ("Sözleşme"), PrintySell platformunu ("Platform") işleten [Şirket Unvanı / Ticaret Sicil No / MERSİS No / Adres] ("Şirket") ile Platform'a üye olan veya Platform'u kullanan gerçek veya tüzel kişi ("Kullanıcı") arasında, Kullanıcı'nın Platform'a kayıt olması ve işbu Sözleşme'yi elektronik ortamda onaylaması anında akdedilmiş ve yürürlüğe girmiştir.
                </p>
                <p>
                  <strong>1.1 Ehliyet ve Yaş Sınırı:</strong> Kullanıcı, işbu Sözleşme'yi onaylayarak on sekiz (18) yaşını doldurduğunu ve/veya Platform'u bir tüzel kişi adına kullanıyorsa o tüzel kişiyi temsile yetkili olduğunu beyan ve taahhüt eder. Reşit olmayan kişilerin Platform'u kullanması yasaktır; bu durumun tespiti halinde Şirket ilgili hesabı askıya alabilir.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">2. Hizmetin Kapsamı ve Tanımı</h3>
                <p>
                  PrintySell, Kullanıcılarına yapay zekâ destekli görsel tasarım oluşturma, mockup (örnek ürün görseli) üretme, Etsy ve benzeri pazar yerleri ile entegrasyon sağlama ve ürün listeleme gibi e-ticaret ve tasarım süreçlerini kolaylaştıran bir hizmet yazılımı (SaaS) sunar. İşbu hizmetlerin ifası sırasında üçüncü taraf API'ler ve servisler kullanılabilir.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">3. Üyelik, Abonelikler ve Otomatik Yenileme</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Kullanıcı, hesap güvenliğinden, şifresinin gizliliğinden ve hesabında yapılan tüm işlemlerden bizzat sorumludur. Hesabın yetkisiz kişilerce kullanımı sonucu doğacak zararlardan Şirket sorumlu tutulamaz.</li>
                  <li>Platform üzerindeki hizmetler, farklı özelliklere sahip aylık veya yıllık abonelik paketleri ("Paketler") şeklinde sunulur.</li>
                  <li><strong>Otomatik Yenileme:</strong> Abonelikler, Kullanıcı iptal etmediği sürece seçilen faturalandırma dönemi sonunda aynı paket üzerinden otomatik olarak yenilenir.</li>
                  <li><strong>İptal Süreci:</strong> Kullanıcı, aboneliğini dilediği zaman hesap ayarları üzerinden iptal edebilir. İptal işlemi bir sonraki faturalandırma dönemi itibarıyla geçerli olur.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">4. Token (Kredi) Sistemi ve Kullanım Koşulları</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Platform içerisindeki yapay zeka görsel oluşturma ve benzeri işlemler, "Token" (Kredi) harcanarak gerçekleştirilir. Token tahsisi, seçilen abonelik paketine göre aylık olarak tanımlanır.</li>
                  <li><strong>Kullanım Ömrü ve Devir:</strong> Kullanılmayan tokenlar bir sonraki faturalandırma ayına devretmez ve silinir.</li>
                  <li><strong>Abonelik İptali ve Token Durumu:</strong> Kullanıcı aboneliğini iptal ettiğinde veya yenilemediğinde hesabı "Demo" statüsüne düşer. <strong>Abonelik pasif duruma (Demo) düştüğü anda, Kullanıcının hesabında önceden kalan kullanılmamış tokenlar tamamen silinir ve kullanılamaz.</strong> Token kullanımı yalnızca aktif ücretli aboneliği bulunan Kullanıcılar için geçerlidir.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">5. Ücretlendirme, Faturalandırma ve Ödeme Başarısızlığı</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Şirket, paket içeriklerinde ve fiyatlarda değişiklik yapma hakkını saklı tutar. Fiyat artışları mevcut abonelik döneminin sonunda uygulanır ve Kullanıcı'ya en az 15 gün önceden bildirilir. Kullanıcı güncel fiyatı kabul etmezse dönem sonunda aboneliğini cezasız sonlandırabilir.</li>
                  <li><strong>Ödeme Başarısızlığı:</strong> Otomatik yenileme sırasında kredi kartından tahsilat yapılamaması durumunda, sistem tahsilatı [örn: 3 gün] boyunca aralıklarla dener. Bu süre sonunda tahsilat yapılamazsa abonelik iptal edilerek hesap Demo statüsüne çekilir ve mevcut tokenlar sıfırlanır.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">6. Cayma Hakkı ve İade Politikası</h3>
                <p className="mb-2">
                  Dijital hizmetlerin anlık ifası (yapay zekâ model tüketimi, sunucu kaynak kullanımı ve token tahsisi) nedeniyle, Mesafeli Sözleşmeler Yönetmeliği m.15 (ğ) bendi uyarınca, elektronik ortamda anında ifa edilen hizmetlerde tüketici cayma hakkını kullanamaz.
                </p>
                <p>
                  Kullanıcı, abonelik satın alıp hesabına token tanımlandığı andan itibaren cayma hakkının ortadan kalktığını kabul, beyan ve taahhüt eder. Satın alınan paketlerin, aboneliklerin veya kısmen/tamamen kullanılmış token'ların iadesi yapılmamaktadır. Sistemsel bir hata nedeniyle mükerrer tahsilat yapılması halinde 10 iş günü içinde iade gerçekleştirilir.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">7. Yapay Zeka Çıktıları, Fikri Mülkiyet ve Ticari Kullanım</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Kullanım İzni ve Sınırlar:</strong> Şirket, Kullanıcı'nın PrintySell üzerinden ürettiği görseller için Kullanıcı'ya ticari kullanım hakkı (lisansı) verir. Ancak yapay zeka ile üretilen görsellerin hukuki olarak mutlak ve münhasır bir "telif hakkı" oluşturup oluşturmadığı uluslararası hukuka ve 3. taraf AI servis sağlayıcılarının şartlarına tabidir.</li>
                  <li>Kullanıcı ürettiği bu içerikleri Etsy gibi platformlarda satabilir. Ancak Şirket, bu görsellerin telif hakkı ihlaline sebep olmayacağını, özgünlüğünü veya ticari başarısını garanti etmez.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">8. Kullanıcı İçeriği, Sorumluluğu ve Tazminat (Indemnification)</h3>
                <p className="mb-2">
                  Kullanıcı; sisteme yüklediği referans görsellerin, yazdiği komutların (prompt) ve oluşturduğu ürünlerin hiçbir şekilde üçüncü şahıslara ait marka (ör: logolar), telif hakları, patent, ticari sır veya kişisel verileri ihlal etmediğini garanti eder.
                </p>
                <p>
                  <strong>Tazminat:</strong> Kullanıcının yüklediği veya ürettiği içerikler nedeniyle Şirket'e yöneltilebilecek her türlü yasal iddia, dava, idari para cezası durumunda Kullanıcı; Şirket'in uğrayacağı tüm maddi ve manevi zararları ile avukatlık ücretlerini ilk talepte derhal ve nakden Şirket'e tazmin etmekle yükümlüdür.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">9. Etsy ve Üçüncü Taraf Entegrasyonları</h3>
                <p className="mb-2">
                  PrintySell platformunun merkezinde yer alan Etsy entegrasyonu "olduğu gibi" sunulur. Şirket, Etsy, Inc. şirketinin veya bağlı kuruluşlarının resmi bir ortağı değildir.
                </p>
                <p>
                  Aşağıdaki durumlardan Şirket sorumlu tutulamaz:
                  <br/>- Etsy'nin API yapısını değiştirmesi veya erişimi kesmesi,
                  <br/>- Kullanıcı'nın Etsy mağazasının, Etsy politikaları ihlali sebebiyle uyarılması, askıya alınması veya kapatılması,
                  <br/>- Kullanıcı tarafından PrintySell üzerinden aktarılan ürün açıklamaları veya görsellerindeki hatalar.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">10. Üçüncü Taraf Yapay Zeka Servisleri</h3>
                <p>
                  PrintySell; görsel üretimi, analiz ve benzeri işlemler için OpenAI, Fal AI, Google vb. bağımsız 3. taraf yapay zeka sağlayıcılarının altyapılarını kullanmaktadır. Bu servis sağlayıcıların:
                  API kesintileri yaşamasından, içerik filtreleme (NSFW vb.) politikalarını değiştirmesinden, belirli komutları reddetmesinden veya hizmeti durdurmasından Şirket sorumlu tutulamaz. Bu kesintiler iade veya tazminat sebebi oluşturmaz.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">11. Yasaklı Kullanımlar ve Hesabın Kapatılması</h3>
                <p className="mb-2">
                  Kullanıcı, Platform'u; tersine mühendislik yapmak, siber saldırı düzenlemek, yetkisiz veri kazımak (scraping) veya diğer kullanıcılara zarar vermek amacıyla kullanamaz. 
                </p>
                <p>
                  Şirket, Platform'un kötüye kullanıldığını veya bu Sözleşme'nin ağır şekilde ihlal edildiğini tespit ederse, Kullanıcı'nın hesabını derhal askıya alma veya kapatma hakkına sahiptir. Kapatılan hesaplarda, mevzuattan doğan yasal iade yükümlülükleri saklı kalmak kaydıyla ücret ve token iadesi yapılmaz.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">12. Sorumluluk Sınırlaması ve Hizmet Düzeyi (Uptime)</h3>
                <p>
                  Platform SaaS tabanlı olup, bakım, güncelleme veya plansız teknik arızalar sebebiyle kısa süreli erişim kesintileri yaşanabilir. Şirket %100 kesintisiz hizmet (uptime) garantisi vermez. Şirketin, kasıt veya ağır ihmali dışında kalan her türlü performans düşüklüğü veya dolaylı zarardan kaynaklanan tazminat yükümlülüğü, Kullanıcının son 12 ay içerisinde Şirket'e ödediği toplam hizmet bedeli ile sınırlıdır.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">13. Mücbir Sebep</h3>
                <p>
                  Doğal afet, savaş, siber saldırı, genel altyapı ve internet çöküşleri, salgın hastalık, idari veya yasal kısıtlamalar mücbir sebep sayılır. Mücbir sebep süresince Şirket'in edim yükümlülükleri askıya alınır.
                </p>
              </section>
              
              <section>
                <h3 className="text-base font-semibold text-white mb-2">14. Kişisel Verilerin Korunması (KVKK)</h3>
                <p>
                  Şirket, Kullanıcı'ya ait kişisel verileri 6698 sayılı Kişisel Verilerin Korunması Kanunu ve ilgili mevzuata uygun olarak işler. Veri işleme şartları, kayıt sırasında kullanıcıya sunulan <strong>Aydınlatma Metni</strong> ve <strong>Gizlilik Politikası</strong> (bu sözleşmeden bağımsız ayrı belgelerdir) içerisinde düzenlenmiştir.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-white mb-2">15. Sözleşme Değişiklikleri</h3>
                <p>
                  Şirket, ilgili mevzuata uygun olmak ve aleyhte değişiklikleri en az 15 gün önceden e-posta ile bildirmek kaydıyla Sözleşme şartlarını değiştirebilir. Güncel sözleşmeyi kabul etmeyen Kullanıcı aboneliğini sonlandırma hakkına sahiptir.
                </p>
              </section>
              
              <section>
                <h3 className="text-base font-semibold text-white mb-2">16. Uyuşmazlıkların Çözümü</h3>
                <p>
                  İşbu Sözleşme'den doğabilecek uyuşmazlıklarda Türkiye Cumhuriyeti kanunları uygulanır. Tüketici sıfatına haiz Kullanıcılar bakımından, parasal sınırlar dahilinde Kullanıcı'nın veya Şirket'in yerleşim yerindeki Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir. Tüketici olmayan Kullanıcılar ile yaşanacak uyuşmazlıklarda İstanbul (Merkez) Mahkemeleri münhasıran yetkilidir.
                </p>
              </section>
            </div>
            
            <div className="p-5 border-t border-white/10 bg-white/5 flex justify-end">
              <button 
                onClick={() => {
                  setTermsAccepted(true);
                  setIsTermsModalOpen(false);
                }}
                className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition-colors"
              >
                Kabul Et ve Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes ripple-effect {
          0% { transform: scale(0); opacity: 0.6; border-width: 4px; }
          100% { transform: scale(3); opacity: 0; border-width: 0px; }
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
        .animate-ripple {
          animation: ripple-effect 2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
      `}</style>
    </div>
    </GoogleOAuthProvider>
  );
}
