"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

interface User {
  name: string;
  email: string;
  plan: string;
  initials: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
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

  // Single dispatch call inside effect — no cascading setState issue
  useEffect(() => {
    const stored = localStorage.getItem("bot-etsy-user");
    let parsed: User | null = null;
    if (stored) {
      try {
        parsed = JSON.parse(stored) as User;
      } catch {
        localStorage.removeItem("bot-etsy-user");
      }
    }
    dispatch({ type: "INIT", payload: parsed });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email.trim() || !password.trim()) return false;

    const namePart = email.split("@")[0];
    const displayName = namePart
      .split(/[._-]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const initials = displayName
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

    const newUser: User = {
      name: displayName,
      email: email.toLowerCase(),
      plan: "Pro Plan",
      initials,
    };

    localStorage.setItem("bot-etsy-user", JSON.stringify(newUser));
    dispatch({ type: "LOGIN", payload: newUser });
    return true;
  };

  const logout = () => {
    localStorage.removeItem("bot-etsy-user");
    dispatch({ type: "LOGOUT" });
    // Sidebar's useEffect handles redirect to /login
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        login,
        logout,
        isLoading: state.isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
