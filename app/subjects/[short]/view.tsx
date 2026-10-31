// app/subjects/[short]/view.tsx
// Subject chapter list (client): numbered module rows with big numerals,
// thin progress bars, "x/y Completed" counts and lock states. Modules unlock
// in order: module N+1 unlocks when module N is fully completed.

"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  BookIcon,
  GlassCard,
  ProgressBar,
} from "../../../components/ui";
import {
  computeModuleProgress,
  isModuleUnlocked,
} from "../../../lib/progress";
import { EXAMS } from "../../../lib/exams";
import { getSubjectLocal, summarizeExamPattern } from "../../../lib/study";
import { subjects } from "@/src/content/subjects";

function Icon({
  children,
  className = "h-6 w-6",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Icon>
  );
}

function BackIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </Icon>
  );
}

interface ModuleRow {
  done: number;
  total: number;
  percent: number;
  unlocked: boolean;
}

export function SubjectView({ short }: { short: string }) {
  const subject = getSubjectLocal(short) ?? subjects[0];
  const [rows, setRows] = useState<Record<string, ModuleRow>>({});

  useEffect(() => {
    let live = true;
    (async () => {
      const entries = await Promise.all(
        subject.modules.map(async (m, i) => {
          const [p, unlocked] = await Promise.all([
            computeModuleProgress(subject.short, m.num),
            isModuleUnlocked(subject.short, i),
          ]);
          return [
            m.num,
            {
              done: p?.completedTopics ?? 0,
              total: p?.totalTopics ?? 0,
              percent: p?.percent ?? 0,
              unlocked,
            },
          ] as const;
        }),
      );
      if (live) setRows(Object.fromEntries(entries));
    })().catch(() => {});
    return () => {
      live = false;
    };
  }, [subject]);

  const exam = EXAMS.find((e) => e.short === subject.short);
  const patternLine = summarizeExamPattern(subject.examPattern);

  return (
    <main className="flex flex-col gap-5">
      <header>
        <div className="flex items-center justify-between">
          <Link
            href="/subjects"
            aria-label="Back to subjects"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl text-[var(--text)] active:bg-[var(--track)]"
          >
            <BackIcon className="h-6 w-6" />
          </Link>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--track)] text-[var(--text)]">
            <BookIcon className="h-5 w-5" />
          </span>
        </div>
        <h1 className="mt-2 text-[26px] font-bold leading-tight text-[var(--text)]">
          {subject.name}
        </h1>
        <p className="mt-1 text-[14px] text-[var(--text-dim)]">
          {exam ? `Exam ${subject.exam}` : `${subject.modules.length} chapters`}
          {patternLine ? (
            <>
              <span className="mx-2" aria-hidden="true">
                ·
              </span>
              <span className="text-[12px] text-[var(--text-faint)]">
                {patternLine}
              </span>
            </>
          ) : null}
        </p>
      </header>

      <div className="flex flex-col gap-2">
        {subject.modules.map((m, i) => {
          const r = rows[m.num] ?? {
            done: 0,
            total: 0,
            percent: 0,
            unlocked: i === 0,
          };
          const row = (
            <div className="flex items-center gap-4 px-2 py-3">
              <span
                className={`w-9 shrink-0 text-[30px] font-bold tabular-nums leading-none ${
                  r.unlocked ? "text-[var(--text)]" : "text-[var(--text-faint)]"
                }`}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={`block truncate text-[16px] font-semibold ${
                    r.unlocked ? "text-[var(--text)]" : "text-[var(--text-faint)]"
                  }`}
                >
                  {m.title}
                </span>
                <ProgressBar value={r.percent} className="mt-2 h-1" />
                <span className="mt-1.5 block text-[12px] text-[var(--text-faint)]">
                  {r.done}/{r.total} Completed
                </span>
              </span>
              {r.unlocked ? (
                <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--text)]" aria-hidden="true" />
              ) : (
                <LockIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
              )}
            </div>
          );
          return r.unlocked ? (
            <Link
              key={m.num}
              href={`/subjects/${subject.short}/${m.num}`}
              className="block min-h-[44px] rounded-2xl active:bg-[var(--track)]"
              aria-label={`Chapter ${i + 1}, ${m.title}, ${r.done} of ${r.total} completed`}
            >
              {row}
            </Link>
          ) : (
            <div
              key={m.num}
              className="rounded-2xl opacity-60"
              aria-label={`Chapter ${i + 1}, ${m.title}, locked`}
              aria-disabled="true"
            >
              {row}
            </div>
          );
        })}
      </div>

      <p className="px-2 text-[12px] text-[var(--text-faint)]">
        Finish a chapter to unlock the next one.
      </p>
    </main>
  );
}
