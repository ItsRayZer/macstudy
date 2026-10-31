// lib/store.ts
// BcaEasy global UI store (zustand).
//
// WORKER CONTRACT (stable API - do not rename):
//   useAppStore((s) => s.theme)            'dark' | 'light' (persisted)
//   s.setTheme('dark' | 'light')           set the theme (updates data-theme)
//   s.toggleTheme()                        flip the theme
//   useAppStore((s) => s.xpToday)          XP earned today (from the DB)
//   s.setXpToday(n)
//   useAppStore((s) => s.streak)           current study streak in days
//   s.setStreak(n)
//   s.refreshFromDB()                      reload xpToday + streak from getDB()
//
// Only theme is persisted to localStorage ("macstudy-store"). xpToday and
// streak are session state refreshed from the DB on demand.

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getDB } from "./db";

export type Theme = "dark" | "light";

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  xpToday: number;
  setXpToday: (n: number) => void;
  streak: number;
  setStreak: (n: number) => void;
  refreshFromDB: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set({ theme: get().theme === "dark" ? "light" : "dark" }),
      xpToday: 0,
      setXpToday: (xpToday) => set({ xpToday }),
      streak: 0,
      setStreak: (streak) => set({ streak }),
      refreshFromDB: async () => {
        const db = getDB();
        const [xpToday, streakInfo] = await Promise.all([
          db.getDailyXP(),
          db.getStreak(),
        ]);
        set({ xpToday, streak: streakInfo.current });
      },
    }),
    {
      name: "macstudy-store",
      partialize: (s) => ({ theme: s.theme }),
    },
  ),
);
