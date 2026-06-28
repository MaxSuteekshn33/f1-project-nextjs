"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "f1_goat_sim";
const SENNA_UNLOCK_AT = 4;

interface SimState {
  simCount: number;
  unlockedDrivers: string[];
  boostPoints: number;
  quizCompleted: boolean;
}

function loadState(): SimState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultState(), ...JSON.parse(raw) };
  } catch {}
  return defaultState();
}

function defaultState(): SimState {
  return { simCount: 0, unlockedDrivers: [], boostPoints: 0, quizCompleted: false };
}

export function useSimulation() {
  const [state, setState] = useState<SimState>(defaultState);

  // Load from localStorage on mount
  useEffect(() => {
    setState(loadState());
  }, []);

  // Persist on every change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const recordRun = useCallback(() => {
    setState(prev => {
      const newCount = prev.simCount + 1;
      const unlocked = [...prev.unlockedDrivers];
      if (newCount >= SENNA_UNLOCK_AT && !unlocked.includes("senna")) {
        unlocked.push("senna");
      }
      return { ...prev, simCount: newCount, unlockedDrivers: unlocked };
    });
  }, []);

  const addBoostPoints = useCallback((pts: number) => {
    setState(prev => ({ ...prev, boostPoints: prev.boostPoints + pts, quizCompleted: true }));
  }, []);

  const isUnlocked = useCallback(
    (key: string) => key !== "senna" || state.unlockedDrivers.includes("senna"),
    [state.unlockedDrivers]
  );

  const runsUntilSenna = Math.max(0, SENNA_UNLOCK_AT - state.simCount);

  return { ...state, recordRun, addBoostPoints, isUnlocked, runsUntilSenna };
}
