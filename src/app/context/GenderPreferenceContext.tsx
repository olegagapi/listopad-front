"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

export type GenderPreference = "female" | "male" | null;

const STORAGE_KEY = "listopad-gender-preference";

interface GenderPreferenceContextType {
  gender: GenderPreference;
  setGender: (gender: GenderPreference) => void;
}

const GenderPreferenceContext = createContext<GenderPreferenceContextType | undefined>(undefined);

export function useGenderPreference(): GenderPreferenceContextType {
  const context = useContext(GenderPreferenceContext);
  if (!context) {
    throw new Error("useGenderPreference must be used within a GenderPreferenceProvider");
  }
  return context;
}

export function GenderPreferenceProvider({ children }: { children: React.ReactNode }) {
  const [gender, setGenderState] = useState<GenderPreference>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "female" || stored === "male" ? stored : null;
  });

  const setGender = useCallback((value: GenderPreference) => {
    setGenderState(value);
    if (value) {
      localStorage.setItem(STORAGE_KEY, value);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return (
    <GenderPreferenceContext.Provider value={{ gender, setGender }}>
      {children}
    </GenderPreferenceContext.Provider>
  );
}
