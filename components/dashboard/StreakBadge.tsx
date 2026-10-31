// components/dashboard/StreakBadge.tsx
// Streak flame with the current day count and the freeze balance.

"use client";

import { FlameIcon, GlassCard } from "../ui";

export function StreakBadge({
  current,
  freezes,
}: {
  current: number;
  freezes: number;
}) {
  return (
    <GlassCard className="flex items-center gap-3 p-4">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
        style={{
          background: "color-mix(in srgb, var(--gold) 18%, transparent)",
          color: "var(--gold)",
        }}
      >
        <FlameIcon className="h-5 w-5" />
      </span>
      <span>
        <span
          className="block text-xl font-bold tabular-nums"
          style={{ color: "var(--gold)" }}
        >
          {current}
        </span>
        <span className="block text-xs text-[var(--text-dim)]">
          day streak
          <span className="text-[var(--text-faint)]">
            {" · "}
            {freezes} {freezes === 1 ? "freeze" : "freezes"}
          </span>
        </span>
      </span>
    </GlassCard>
  );
}
