// components/dashboard/StatCard.tsx
// Small icon + value + label card for the dashboard and profile.

"use client";

import type { ReactNode } from "react";
import { GlassCard } from "../ui";

export function StatCard({
  icon,
  iconClassName = "",
  value,
  label,
  valueClassName = "",
}: {
  icon: ReactNode;
  iconClassName?: string;
  value: string | number;
  label: string;
  valueClassName?: string;
}) {
  return (
    <GlassCard className="flex items-center gap-3 p-4">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span
          className={`block truncate text-xl font-bold tabular-nums ${valueClassName}`}
        >
          {value}
        </span>
        <span className="block text-xs text-[var(--text-dim)]">{label}</span>
      </span>
    </GlassCard>
  );
}
