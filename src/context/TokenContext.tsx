"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type PlanType = "Standard" | "Pro" | "Premium";

export const PLAN_LIMITS: Record<PlanType, number> = {
  Standard: 30,
  Pro: 90,
  Premium: 250,
};

interface TokenContextType {
  planType: PlanType;
  availableTokens: number;
  monthlyLimit: number;
  totalEverGranted: number; // for progress bar = monthlyLimit + purchased
  setPlanType: (plan: PlanType) => void;
  useToken: () => boolean; // returns false if no tokens left
  addTokens: (amount: number) => void;
  isLoaded: boolean;
}

const TokenContext = createContext<TokenContextType | null>(null);

const STORAGE_KEY = "printysell_token_data";

interface TokenData {
  planType: PlanType;
  availableTokens: number;
  totalEverGranted: number;
  lastResetMonth: string; // "YYYY-MM"
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [planType, setPlanTypeState] = useState<PlanType>("Pro");
  const [availableTokens, setAvailableTokens] = useState(90);
  const [totalEverGranted, setTotalEverGranted] = useState(90);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const data: TokenData = JSON.parse(raw);
        const currentMonth = getCurrentMonth();

        // Monthly reset logic
        if (data.lastResetMonth !== currentMonth) {
          const newLimit = PLAN_LIMITS[data.planType] || 90;
          const refreshed: TokenData = {
            planType: data.planType,
            availableTokens: newLimit,
            totalEverGranted: newLimit,
            lastResetMonth: currentMonth,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshed));
          setPlanTypeState(data.planType);
          setAvailableTokens(newLimit);
          setTotalEverGranted(newLimit);
        } else {
          setPlanTypeState(data.planType);
          setAvailableTokens(data.availableTokens);
          setTotalEverGranted(data.totalEverGranted);
        }
      } catch {
        // fallback
      }
    } else {
      // First time — write defaults
      const defaults: TokenData = {
        planType: "Pro",
        availableTokens: 90,
        totalEverGranted: 90,
        lastResetMonth: getCurrentMonth(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    }
    setIsLoaded(true);
  }, []);

  const persist = useCallback(
    (tokens: number, total: number, plan: PlanType) => {
      const data: TokenData = {
        planType: plan,
        availableTokens: tokens,
        totalEverGranted: total,
        lastResetMonth: getCurrentMonth(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
    []
  );

  const setPlanType = useCallback(
    (plan: PlanType) => {
      const newLimit = PLAN_LIMITS[plan];
      setPlanTypeState(plan);
      setAvailableTokens(newLimit);
      setTotalEverGranted(newLimit);
      persist(newLimit, newLimit, plan);
    },
    [persist]
  );

  const useToken = useCallback(() => {
    if (availableTokens <= 0) return false;
    const next = availableTokens - 1;
    setAvailableTokens(next);
    persist(next, totalEverGranted, planType);
    return true;
  }, [availableTokens, totalEverGranted, planType, persist]);

  const addTokens = useCallback(
    (amount: number) => {
      const next = availableTokens + amount;
      const nextTotal = totalEverGranted + amount;
      setAvailableTokens(next);
      setTotalEverGranted(nextTotal);
      persist(next, nextTotal, planType);
    },
    [availableTokens, totalEverGranted, planType, persist]
  );

  return (
    <TokenContext.Provider
      value={{
        planType,
        availableTokens,
        monthlyLimit: PLAN_LIMITS[planType],
        totalEverGranted,
        setPlanType,
        useToken,
        addTokens,
        isLoaded,
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
