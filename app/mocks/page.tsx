// app/mocks/page.tsx
// Mock test hub: one card per subject with its real exam pattern summary
// and a link into the timed mock runner.

import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRightIcon,
  GlassCard,
  Pill,
} from "../../components/ui";
import { MOCK_CONFIGS } from "./build-paper";

export const metadata: Metadata = {
  title: "Mock Tests",
  description:
    "Timed mock tests per subject, built from the real question bank.",
};

function fmtDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

export default function MocksPage() {
  const configs = Object.values(MOCK_CONFIGS);
  return (
    <main className="flex flex-col gap-5">
      <header>
        <p className="text-sm text-[var(--text-dim)]">Exam hall mode</p>
        <h1 className="mt-1 text-[28px] font-bold leading-tight">
          Mock <span className="text-gradient">tests</span>
        </h1>
        <p className="mt-1 text-sm text-[var(--text-dim)]">
          Timed papers sampled from the question bank. Mark yourself honestly
          when the timer ends.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {configs.map((c) => (
          <Link
            key={c.short}
            href={`/mocks/${c.short.toLowerCase()}`}
            className="block"
            aria-label={`Start ${c.name} mock test`}
          >
            <GlassCard className="p-5 transition-transform active:scale-[0.98]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-xl bg-[var(--text)] text-[var(--bg)] px-2.5 py-1 text-xs font-bold text-white">
                      {c.short}
                    </span>
                    {c.estimate ? (
                      <Pill variant="important">Pattern estimate</Pill>
                    ) : null}
                  </div>
                  <h2 className="mt-2 text-base font-semibold leading-snug">
                    {c.name}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-dim)]">
                    {c.summary}
                  </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill variant="default">{c.totalMarks} marks</Pill>
                <Pill variant="default">{fmtDuration(c.durationMin)}</Pill>
                {c.parts.map((p) => (
                  <Pill key={p.id} variant="default">
                    Part {p.id}: {p.count} x {p.marks}
                  </Pill>
                ))}
              </div>
              <span className="mt-4 flex min-h-[44px] items-center justify-center rounded-2xl bg-[var(--text)] text-[var(--bg)] text-sm font-semibold text-white">
                Start mock
              </span>
            </GlassCard>
          </Link>
        ))}
      </div>
    </main>
  );
}
