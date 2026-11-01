// app/subjects/page.tsx
// Subjects tab: one card per subject with name, exam date, progress % and a
// countdown chip. Progress comes from lib/progress.ts (completed topics over
// total topics); exam times from lib/exams.ts.

"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import {
  ChevronRightIcon,
  GlassCard,
  Pill,
  ProgressBar,
  TabBarSpacer,
} from "../../components/ui";
import { computeSubjectProgress } from "../../lib/progress";
import { EXAMS } from "../../lib/exams";
import { subjects } from "@/src/content/subjects";

interface RowState {
  done: number;
  total: number;
  percent: number;
  countdown: { label: string; urgent: boolean } | null;
}

function countdownLabel(at: string, now: number): { label: string; urgent: boolean } {
  const days = Math.ceil((new Date(at).getTime() - now) / 86_400_000);
  if (days < 0) return { label: "Done", urgent: false };
  if (days === 0) return { label: "Today", urgent: true };
  return { label: `${days}d left`, urgent: days <= 3 };
}

const EMPTY_ROW: RowState = { done: 0, total: 0, percent: 0, countdown: null };

export default function SubjectsPage() {
  const [progress, setProgress] = useState<Record<string, RowState>>({});

  useEffect(() => {
    let live = true;
    (async () => {
      // Clock reads stay in the effect: reading the time during render
      // breaks static prerendering.
      const now = Date.now();
      const rows = await Promise.all(
        subjects.map(async (s) => {
          const p = await computeSubjectProgress(s.short);
          const exam = EXAMS.find((e) => e.short === s.short);
          return [
            s.short,
            {
              done: p?.completedTopics ?? 0,
              total: p?.totalTopics ?? 0,
              percent: p?.percent ?? 0,
              countdown: exam ? countdownLabel(exam.at, now) : null,
            },
          ] as const;
        }),
      );
      if (live) setProgress(Object.fromEntries(rows));
    })().catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  return (
    <main className="flex flex-col gap-4">
      <header>
        <h1 className="text-[28px] font-bold leading-tight">Subjects</h1>
        <p className="mt-1 text-sm text-[var(--text-dim)]">
          MGU BCA 3rd Sem syllabus
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {subjects.map((s, i) => {
          const p = progress[s.short] ?? EMPTY_ROW;
          const cd = p.countdown;
          return (
            <Link
              key={s.short}
              href={`/subjects/${s.short}`}
              className="rise-in block min-h-[44px]"
              style={
                { "--rise-delay": `${Math.min(i, 5) * 60}ms` } as CSSProperties
              }
              aria-label={`${s.name}, ${p.percent}% complete`}
            >
              <GlassCard className="transition-transform active:scale-[0.99]">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-base font-semibold text-[var(--text)]">
                        {s.name}
                      </h2>
                      {cd ? (
                        <Pill variant={cd.urgent ? "repeated" : "default"}>
                          {cd.label}
                        </Pill>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-[var(--text-dim)]">
                      Exam {s.exam} · {p.done}/{p.total} topics · {p.percent}%
                    </p>
                    <ProgressBar value={p.percent} className="mt-2" />
                  </div>
                  <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
      <TabBarSpacer />
    </main>
  );
}
