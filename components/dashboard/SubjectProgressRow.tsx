// components/dashboard/SubjectProgressRow.tsx
// One tappable subject row: code chip, name, exam date, progress bar.

"use client";

import Link from "next/link";
import { ChevronRightIcon, ProgressBar } from "../ui";

export function SubjectProgressRow({
  short,
  name,
  exam,
  percent,
  done,
  total,
  href,
}: {
  short: string;
  name: string;
  exam: string;
  percent: number;
  done: number;
  total: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="glass block min-h-[44px] rounded-3xl p-4 shadow-[var(--shadow)] transition-transform active:scale-[0.98]"
      aria-label={`${name}, ${percent}% complete`}
    >
      <div className="flex items-center gap-3">
        <span className="shrink-0 rounded-xl bg-[var(--text)] text-[var(--bg)] px-2.5 py-1 text-xs font-bold">
          {short}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold leading-snug">
            {name}
          </span>
          <span className="block text-xs text-[var(--text-faint)]">
            Exam {exam} · {done}/{total} topics
          </span>
        </span>
        <span className="shrink-0 text-sm font-bold tabular-nums text-[var(--text-dim)]">
          {percent}%
        </span>
        <ChevronRightIcon className="h-4 w-4 shrink-0 text-[var(--text-faint)]" />
      </div>
      <ProgressBar value={percent} className="mt-3" />
    </Link>
  );
}
