"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Settings,
  CreditCard,
  Camera,
  Save,
  Check,
  Bell,
  Moon,
  Globe,
  Lock,
  Zap,
  Shield,
  ChevronRight,
  LogOut,
} from "lucide-react";

type Tab = "profile" | "settings" | "plan";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile form state
  const [name, setName] = useState(user?.name ?? "");
  const [email] = useState(user?.email ?? "");
  const [bio, setBio] = useState("Etsy satıcısı ve girişimci.");
  const [saved, setSaved] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  // Settings toggles
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("Türkçe");
  const [twoFactor, setTwoFactor] = useState(false);
  const [etsyConnected, setEtsyConnected] = useState(false);
  const [printifyConnected, setPrintifyConnected] = useState(false);

  const handleSaveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSavePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      alert("Yeni şifreler eşleşmiyor!");
      return;
    }
    setPasswordSaved(true);
    setTimeout(() => {
      setPasswordSaved(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 2000);
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profil", icon: User },
    { id: "settings", label: "Ayarlar", icon: Settings },
    { id: "plan", label: "Plan", icon: CreditCard },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 animate-fade-in">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f1f0ff] to-[#a09cb0] bg-clip-text text-transparent">
          Hesap & Ayarlar
        </h1>
        <p className="text-sm mt-0.5 text-[#a09cb0]">
          Profilinizi, tercihlerinizi ve plan bilgilerinizi buradan yönetebilirsiniz.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/[0.05] self-start w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === id
                ? "bg-purple-500/20 border border-purple-500/35 text-white"
                : "text-[#a09cb0] hover:text-white"
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {activeTab === "profile" && (
        <div className="space-y-4">
          {/* Avatar Section */}
          <div className="bg-[#16161e] border border-white/[0.05] rounded-2xl p-5 flex items-center gap-5">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg"
                style={{ background: "linear-gradient(135deg, #7c6af7 0%, #a855f7 100%)", color: "#fff" }}
              >
                {user?.initials}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#1e1e2a] border border-white/10 rounded-full flex items-center justify-center text-[#a09cb0] hover:text-white cursor-pointer transition-colors">
                <Camera size={11} />
              </button>
            </div>
            <div>
              <p className="text-sm font-bold text-white">{user?.name}</p>
              <p className="text-xs text-[#5e5a72] mt-0.5">{user?.email}</p>
              <span
                className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(124,106,247,0.12)",
                  color: "#9d8df5",
                  border: "1px solid rgba(124,106,247,0.2)",
                }}
              >
                {user?.plan}
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-[#16161e] border border-white/[0.05] rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-[#5e5a72] uppercase tracking-wider">Kişisel Bilgiler</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider block">Ad Soyad</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider block">E-posta</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-3 py-2 rounded-xl border border-white/[0.05] bg-black/10 text-xs text-[#5e5a72] cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider block">Biyografi</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-colors resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleSaveProfile}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  saved
                    ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                    : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:brightness-110 shadow-lg shadow-purple-500/10"
                }`}
              >
                {saved ? <Check size={12} /> : <Save size={12} />}
                {saved ? "Kaydedildi!" : "Kaydet"}
              </button>
            </div>
          </div>

          {/* Password Change */}
          <div className="bg-[#16161e] border border-white/[0.05] rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-[#5e5a72] uppercase tracking-wider flex items-center gap-2">
              <Lock size={12} /> Şifre Değiştir
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider block">Mevcut Şifre</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Eski şifrenizi girin"
                  className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider block">Yeni Şifre</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Yeni şifrenizi girin"
                    className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider block">Yeni Şifre (Tekrar)</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Yeni şifrenizi tekrar girin"
                    className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleSavePassword}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  passwordSaved
                    ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                }`}
              >
                {passwordSaved ? <Check size={12} /> : <Save size={12} />}
                {passwordSaved ? "Şifre Güncellendi!" : "Şifreyi Güncelle"}
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#16161e] border border-red-500/15 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-red-400/80 uppercase tracking-wider">Tehlikeli Alan</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Oturumu Kapat</p>
                <p className="text-[10px] text-[#5e5a72] mt-0.5">Hesabınızdan çıkış yapın</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer"
              >
                <LogOut size={12} />
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SETTINGS TAB ── */}
      {activeTab === "settings" && (
        <div className="space-y-4">
          {/* Notifications */}
          <div className="bg-[#16161e] border border-white/[0.05] rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#5e5a72] uppercase tracking-wider flex items-center gap-2">
              <Bell size={12} /> Bildirimler
            </h3>
            <SettingRow
              label="E-posta Bildirimleri"
              description="Sipariş ve mesaj bildirimlerini e-posta ile al"
              checked={emailNotifications}
              onToggle={() => setEmailNotifications(!emailNotifications)}
            />
          </div>

          {/* Appearance */}
          <div className="bg-[#16161e] border border-white/[0.05] rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#5e5a72] uppercase tracking-wider flex items-center gap-2">
              <Moon size={12} /> Görünüm
            </h3>
            <SettingRow
              label="Karanlık Mod"
              description="Arayüzü koyu tema ile kullan"
              checked={darkMode}
              onToggle={() => setDarkMode(!darkMode)}
            />
            <div className="pt-2 border-t border-white/[0.04] space-y-1.5">
              <label className="text-[10px] font-bold text-[#5e5a72] uppercase tracking-wider flex items-center gap-2">
                <Globe size={11} /> Dil
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 rounded-xl border border-white/[0.08] bg-black/20 text-xs text-white focus:outline-none focus:border-purple-500/50 cursor-pointer"
              >
                <option value="Türkçe">Türkçe</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          {/* Security */}
          <div className="bg-[#16161e] border border-white/[0.05] rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#5e5a72] uppercase tracking-wider flex items-center gap-2">
              <Lock size={12} /> Güvenlik
            </h3>
            <SettingRow
              label="İki Faktörlü Doğrulama"
              description="Hesabınızı ekstra bir güvenlik katmanıyla koruyun"
              checked={twoFactor}
              onToggle={() => setTwoFactor(!twoFactor)}
            />
          </div>

          {/* Integrations */}
          <div className="bg-[#16161e] border border-white/[0.05] rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-[#5e5a72] uppercase tracking-wider flex items-center gap-2">
              <Globe size={12} /> Entegrasyonlar
            </h3>
            
            <div className="space-y-3">
              {/* Etsy Integration */}
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/[0.05]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F56400] flex items-center justify-center font-serif font-bold text-white text-lg">
                    E
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Etsy</h4>
                    <p className="text-[10px] text-[#a09cb0]">Etsy mağazanızı bağlayın</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEtsyConnected(!etsyConnected)}
                    className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      etsyConnected 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30" 
                        : "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                    }`}
                  >
                    {etsyConnected ? "Bağlantıyı Kes" : "Bağla"}
                  </button>
                  <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px] ${etsyConnected ? 'bg-emerald-400 shadow-emerald-400/80' : 'bg-red-500 shadow-red-500/80'}`} />
                </div>
              </div>

              {/* Printify Integration */}
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/[0.05]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#39b75d] flex items-center justify-center font-sans font-bold text-white text-xl">
                    P
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Printify</h4>
                    <p className="text-[10px] text-[#a09cb0]">Printify hesabınızı bağlayın</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPrintifyConnected(!printifyConnected)}
                    className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      printifyConnected 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30" 
                        : "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                    }`}
                  >
                    {printifyConnected ? "Bağlantıyı Kes" : "Bağla"}
                  </button>
                  <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px] ${printifyConnected ? 'bg-emerald-400 shadow-emerald-400/80' : 'bg-red-500 shadow-red-500/80'}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PLAN TAB ── */}
      {activeTab === "plan" && (
        <div className="space-y-4">
          {/* Current Plan */}
          <div
            className="rounded-2xl p-5 border space-y-3 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(124,106,247,0.12) 0%, rgba(168,85,247,0.06) 100%)",
              borderColor: "rgba(124,106,247,0.25)",
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-500/5 blur-2xl pointer-events-none" />
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Mevcut Plan</span>
                <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
                  <Zap size={18} className="text-purple-400" />
                  Pro Plan
                </h2>
                <p className="text-xs text-[#a09cb0] mt-1">Tüm premium özelliklere tam erişim</p>
              </div>
              <span className="text-2xl font-bold text-white">₺299<span className="text-xs text-[#5e5a72] font-normal">/ay</span></span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {["Sınırsız ürün", "AI Design Studio", "Gerçek zamanlı analiz", "Öncelikli destek"].map((f) => (
                <div key={f} className="flex items-center gap-1.5 text-[11px] text-[#a09cb0]">
                  <Check size={10} className="text-purple-400 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Plan Options */}
          <div className="space-y-2">
            {[
              { name: "Starter", price: "₺99", desc: "Yeni başlayanlar için", features: ["50 ürün", "Temel analiz", "E-posta destek"] },
              { name: "Pro", price: "₺299", desc: "Büyüyen satıcılar için", features: ["Sınırsız ürün", "AI Design Studio", "Öncelikli destek"], current: true },
              { name: "Business", price: "₺699", desc: "Ekipler ve profesyoneller için", features: ["Her şey dahil", "Çoklu hesap", "Özel entegrasyon"] },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`bg-[#16161e] border rounded-xl p-4 flex items-center justify-between transition-all ${
                  plan.current ? "border-purple-500/40" : "border-white/[0.05] hover:border-white/10"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{plan.name}</span>
                    {plan.current && (
                      <span className="text-[9px] font-bold bg-purple-500/20 border border-purple-500/30 text-purple-400 px-1.5 py-0.5 rounded-full">
                        AKTİF
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#5e5a72]">{plan.desc}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {plan.features.map((f) => (
                      <span key={f} className="text-[9px] text-[#a09cb0] flex items-center gap-1">
                        <Check size={8} className="text-purple-400" />{f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-base font-bold text-white">{plan.price}<span className="text-[10px] text-[#5e5a72] font-normal">/ay</span></p>
                  {!plan.current && (
                    <button className="mt-2 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/[0.06] hover:border-purple-500/30 text-[10px] font-bold text-[#a09cb0] hover:text-white transition-all cursor-pointer">
                      Yükselt <ChevronRight size={10} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 text-[10px] text-[#5e5a72] justify-center pt-1">
            <Shield size={11} />
            Ödemeler SSL ile güvence altındadır
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable toggle row
function SettingRow({
  label,
  description,
  checked,
  onToggle,
}: {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold text-white">{label}</p>
        <p className="text-[10px] text-[#5e5a72] mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative w-9 h-5 rounded-full transition-all duration-200 cursor-pointer shrink-0 ${
          checked ? "bg-purple-500" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
