"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type PlanType = "Standard" | "Pro" | "Premium" | "none";

interface TokenContextType {
  planType: PlanType;
  availableTokens: number;
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

  const refreshTokens = useCallback(async () => {
    try {
      const res = await fetch("/api/user/tokens");
      if (res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setAvailableTokens(data.tokens);
          setPlanType(data.plan as PlanType);
        } catch (e) {
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
