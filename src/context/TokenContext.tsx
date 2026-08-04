"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type PlanType = "Standard" | "Pro" | "Premium" | "none";

export const PLAN_LIMITS: Record<PlanType, number> = {
  Standard: 10,
  Pro: 50,
  Premium: 100,
  none: 0,
};

interface TokenContextType {
  planType: PlanType;
  availableTokens: number;
  totalEverGranted: number;
  useToken: () => boolean; // returns false if no tokens left
  addTokens: (amount: number) => void;
  isLoaded: boolean;
  refreshTokens: () => Promise<void>;
}

const TokenContext = createContext<TokenContextType | null>(null);

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [planType, setPlanType] = useState<PlanType>("none");
  const [availableTokens, setAvailableTokens] = useState(0);
  const [totalEverGranted, setTotalEverGranted] = useState(30);

  const refreshTokens = useCallback(async () => {
    try {
      let headers: Record<string, string> = {};
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("printysell-auth-user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.id) {
              headers["x-user-id"] = parsed.id;
            }
          } catch {}
        }
      }

      const res = await fetch("/api/user/tokens", { headers });
      if (res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (typeof data.tokens === "number") {
            setAvailableTokens(data.tokens);
          }
          if (data.plan) {
            setPlanType(data.plan as PlanType);
            setTotalEverGranted(PLAN_LIMITS[data.plan as PlanType] || 5000);
          }
        } catch {
          console.error("Token API returned invalid JSON:", text);
        }
      }
    } catch (error) {
      console.error("Failed to fetch tokens", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshTokens();
  }, [refreshTokens]);

  const useToken = useCallback(() => {
    if (availableTokens <= 0) return false;
    // Optimistic UI update, actual deduction happens on the backend API side
    setAvailableTokens((prev) => prev - 1);
    return true;
  }, [availableTokens]);

  const addTokens = useCallback(
    (amount: number) => {
      // Optimistic UI update, actual addition happens on backend (e.g. via Stripe webhook)
      setAvailableTokens((prev) => prev + amount);
    },
    []
  );

  return (
    <TokenContext.Provider
      value={{
        planType,
        availableTokens,
        totalEverGranted,
        useToken,
        addTokens,
        isLoaded,
        refreshTokens,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}

export function useTokens() {
  const ctx = useContext(TokenContext);
  if (!ctx) throw new Error("useTokens must be used inside TokenProvider");
  return ctx;
}
