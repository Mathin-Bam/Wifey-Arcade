"use client";

import { useState, useEffect } from "react";

const getTodayString = () => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export function useCompliments() {
  const [unlockedCompliments, setUnlockedCompliments] = useState<string[]>([]);
  const [dailyClaimsCount, setDailyClaimsCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // 1. Load unlocked compliments
      const stored = localStorage.getItem("hk_compliments");
      if (stored) {
        setUnlockedCompliments(JSON.parse(stored));
      }

      // 2. Load and validate daily claims
      const lastClaimDate = localStorage.getItem("hk_last_claim_date");
      const today = getTodayString();

      if (lastClaimDate !== today) {
        // New day, reset claims count
        localStorage.setItem("hk_last_claim_date", today);
        localStorage.setItem("hk_daily_claims_count", "0");
        setDailyClaimsCount(0);
      } else {
        const storedClaims = localStorage.getItem("hk_daily_claims_count");
        if (storedClaims) {
          setDailyClaimsCount(parseInt(storedClaims, 10));
        }
      }
    } catch (e) {
      console.error("Failed to load compliments state from local storage", e);
    }
    setIsLoaded(true);
  }, []);

  const addCompliment = (compliment: string) => {
    setUnlockedCompliments((prev) => {
      if (prev.includes(compliment)) return prev;
      const next = [...prev, compliment];
      try {
        localStorage.setItem("hk_compliments", JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save compliments to local storage", e);
      }
      return next;
    });
  };

  const incrementDailyClaims = () => {
    setDailyClaimsCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem("hk_daily_claims_count", next.toString());
        localStorage.setItem("hk_last_claim_date", getTodayString());
      } catch (e) {
        console.error("Failed to increment daily claims in local storage", e);
      }
      return next;
    });
  };

  const clearCompliments = () => {
    setUnlockedCompliments([]);
    setDailyClaimsCount(0);
    localStorage.removeItem("hk_compliments");
    localStorage.removeItem("hk_daily_claims_count");
    localStorage.removeItem("hk_last_claim_date");
  };

  return {
    unlockedCompliments,
    addCompliment,
    dailyClaimsCount,
    incrementDailyClaims,
    canClaimToday: dailyClaimsCount < 2,
    clearCompliments,
    isLoaded
  };
}
