"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Globe, User, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

type Mode = "login" | "register" | "forgot_password" | "reset_sent";

export default function LoginPage() {
  const { login, googleLogin, registerUser, user, isLoading } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      setSubmitting(true);
      setError("");
      const res = await googleLogin(credentialResponse.credential);
      if (res.success) {
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
      const res = await registerUser(name, email, password);
      setSubmitting(false);
      if (res.success) {
        setError("Kayıt başarılı! Lütfen e-posta kutunuzu kontrol edip hesabınızı onaylayın.");
        // We can optionally set a success state or just stay on register
      } else {
        setError(res.error || "Kayıt başarısız.");
      }
      return;
    }

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
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

          {/* Reset Sent Success Message */}
          {mode === "reset_sent" ? (
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
              
              <div className="flex justify-center mb-4">
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

      <style jsx global>{\`
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
      \`}</style>
    </div>
    </GoogleOAuthProvider>
  );
}
