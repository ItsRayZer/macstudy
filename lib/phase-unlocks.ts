// lib/phase-unlocks.ts
// Per-topic phase unlock flow: finishing Learn unlocks Practice, finishing
// Practice unlocks Test, finishing Test unlocks Revise. Persisted in
// localStorage so the flow survives reloads. Learn (phase 0) is always
// unlocked for a topic the chapter gate already opened.

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const PHASES = ["Learn", "Practice", "Test", "Revise"] as const;
export type PhaseIndex = 0 | 1 | 2 | 3;

export function topicKey(short: string, num: string, slug: string): string {
  return `${short}::${num}::${slug}`;
}

interface PhaseUnlockState {
  /** topicKey -> highest unlocked phase index (0..3). */
  unlocked: Record<string, number>;
  /** Mark a phase finished: unlocks the next one. */
  markPhaseDone: (key: string, phase: PhaseIndex) => void;
  /** Highest unlocked phase for a topic (0 when nothing recorded). */
  highestUnlocked: (key: string) => number;
}

export const usePhaseUnlocks = create<PhaseUnlockState>()(
  persist(
    (set, get) => ({
      unlocked: {},
      markPhaseDone: (key, phase) =>
        set((s) => ({
          unlocked: {
            ...s.unlocked,
            [key]: Math.max(s.unlocked[key] ?? 0, Math.min(3, phase + 1)),
          },
        })),
      highestUnlocked: (key) => get().unlocked[key] ?? 0,
    }),
    { name: "macstudy-phase-unlocks" },
  ),
);
