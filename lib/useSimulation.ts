"use client";
import { useState, useEffect, useCallback } from "react";
import { UNLOCK_THRESHOLDS } from "@/data/drivers";

const STORAGE_KEY = "f1_goat_sim_v2";

interface SimState {
  simCount: number;
  unlockedDrivers: string[];
  boostPoints: number;
  quizzesCompleted: string[];
  customStats: Record<string, Record<string, number>>;
}

function defaultState(): SimState {
  return { simCount: 0, unlockedDrivers: [], boostPoints: 0, quizzesCompleted: [], customStats: {} };
}

function loadState(): SimState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultState(), ...JSON.parse(raw) };
  } catch {}
  return defaultState();
}

function computeUnlocked(simCount: number, stored: string[]): string[] {
  const unlocked = new Set(stored);
  for (const [key, threshold] of Object.entries(UNLOCK_THRESHOLDS)) {
    if (simCount >= threshold) unlocked.add(key);
  }
  return [...unlocked];
}

export function useSimulation() {
  const [state, setState] = useState<SimState>(defaultState);

  useEffect(() => {
    const loaded = loadState();
    // recompute unlocked based on sim count in case thresholds changed
    loaded.unlockedDrivers = computeUnlocked(loaded.simCount, loaded.unlockedDrivers);
    setState(loaded);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const recordRun = useCallback(() => {
    setState(prev => {
      const newCount = prev.simCount + 1;
      const unlocked = computeUnlocked(newCount, prev.unlockedDrivers);
      return { ...prev, simCount: newCount, unlockedDrivers: unlocked };
    });
  }, []);

  const addBoostPoints = useCallback((pts: number, quizKey?: string) => {
    setState(prev => ({
      ...prev,
      boostPoints: prev.boostPoints + pts,
      quizzesCompleted: quizKey && !prev.quizzesCompleted.includes(quizKey)
        ? [...prev.quizzesCompleted, quizKey]
        : prev.quizzesCompleted,
    }));
  }, []);

  const setCustomStat = useCallback((driverKey: string, attr: string, value: number) => {
    setState(prev => ({
      ...prev,
      customStats: {
        ...prev.customStats,
        [driverKey]: { ...(prev.customStats[driverKey] || {}), [attr]: value },
      },
    }));
  }, []);

  const resetCustomStats = useCallback((driverKey: string) => {
    setState(prev => {
      const cs = { ...prev.customStats };
      delete cs[driverKey];
      return { ...prev, customStats: cs };
    });
  }, []);

  const isUnlocked = useCallback(
    (key: string) => {
      const { LOCKED_DRIVER_KEYS } = require("@/data/drivers");
      return !LOCKED_DRIVER_KEYS.has(key) || state.unlockedDrivers.includes(key);
    },
    [state.unlockedDrivers]
  );

  const runsUntilNext = (): { key: string; runs: number } | null => {
    for (const [key, threshold] of Object.entries(UNLOCK_THRESHOLDS).sort((a,b) => a[1]-b[1])) {
      if (!state.unlockedDrivers.includes(key)) {
        return { key, runs: Math.max(0, threshold - state.simCount) };
      }
    }
    return null;
  };

  return {
    ...state,
    recordRun,
    addBoostPoints,
    setCustomStat,
    resetCustomStats,
    isUnlocked,
    runsUntilNext: runsUntilNext(),
    lockedCount: Object.keys(UNLOCK_THRESHOLDS).filter(k => !state.unlockedDrivers.includes(k)).length,
    unlockedCount: 10 + state.unlockedDrivers.filter(k => Object.keys(UNLOCK_THRESHOLDS).includes(k)).length,
  };
}
