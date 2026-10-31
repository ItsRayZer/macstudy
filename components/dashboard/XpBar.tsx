// components/dashboard/XpBar.tsx
// XP earned today against the daily goal, with a monochrome progress bar.

"use client";

import { GlassCard, ProgressBar, ZapIcon } from "../ui";

export function XpBar({ today, goal }: { today: number; goal: number }) {
  const pct = goal > 0 ? Math.min(100, Math.round((today / goal) * 100)) : 0;
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--text)] text-[var(--bg)]">
            <ZapIcon className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold">XP today</span>
        </span>
        <span className="text-sm tabular-nums text-[var(--text-dim)]">
          <span className="font-bold text-[var(--text)]">{today}</span>
          {" / "}
          {goal}
        </span>
      </div>
      <ProgressBar value={pct} className="mt-3" />
      <p className="mt-2 text-xs text-[var(--text-faint)]">
        {today >= goal
          ? "Daily goal smashed. Take the win."
          : `${goal - today} XP to hit today's goal.`}
      </p>
    </GlassCard>
  );
}
