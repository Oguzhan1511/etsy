"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  paymentStatus: boolean;
  initials: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

type AuthAction =
  | { type: "INIT"; payload: User | null }
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "INIT":
      return { user: action.payload, isLoading: false };
    case "LOGIN":
      return { user: action.payload, isLoading: false };
    case "LOGOUT":
      return { user: null, isLoading: false };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem("printysell-auth-user");
    let parsed: User | null = null;
    if (stored) {
      try { parsed = JSON.parse(stored) as User; } catch {}
    }
    
    // BYPASS: Provide a default guest user if no user is found
    if (!parsed) {
      parsed = {
        id: "guest_123",
        name: "Guest User",
        email: "guest@printysell.com",
        plan: "PRO",
        paymentStatus: true,
        initials: "GU"
      };
      localStorage.setItem("printysell-auth-user", JSON.stringify(parsed));
    }
    
    dispatch({ type: "INIT", payload: parsed });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        localStorage.setItem("printysell-auth-user", JSON.stringify(data.user));
        dispatch({ type: "LOGIN", payload: data.user });
        return { success: true };
      } else {
        return { success: false, error: data.error || "Giriş başarısız." };
      }
    } catch (err) {
      return { success: false, error: "Sunucu hatası." };
    }
  };

  const registerUser = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error || "Kayıt başarısız." };
      }
    } catch (err) {
      return { success: false, error: "Sunucu hatası." };
    }
  };

  const logout = () => {
    // BYPASS: Prevent actual logout to keep guest session
    // localStorage.removeItem("printysell-auth-user");
    // dispatch({ type: "LOGOUT" });
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user: state.user, login, registerUser, logout, isLoading: state.isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
