// app/subjects/[short]/[module]/view.tsx
// Module topic list (client). Locked topics show a lock; the unlock rule is:
// topic N+1 unlocks when topic N is completed or its quiz was passed (>= 60).
// The module's first topic is always unlocked.

"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  ChevronRightIcon,
  GlassCard,
  Pill,
} from "../../../../components/ui";
import { getDB } from "../../../../lib/db";
import {
  getModuleLocal,
  getSubjectLocal,
  isTopicUnlocked,
  QUIZ_PASS_SCORE,
  topicHref,
} from "../../../../lib/study";
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  );
}

interface TopicRowState {
  unlocked: boolean;
  completed: boolean;
  quizBest: number;
}

export function ModuleView({ short, num }: { short: string; num: string }) {
  const subject = getSubjectLocal(short) ?? subjects[0];
  const mod = getModuleLocal(subject, num) ?? subject.modules[0];
  const [rows, setRows] = useState<Record<number, TopicRowState>>({});

  useEffect(() => {
    let live = true;
    (async () => {
      const db = getDB();
      const entries = await Promise.all(
        mod.topics.map(async (t, i) => {
          const [unlocked, p] = await Promise.all([
            isTopicUnlocked(subject.short, mod, i),
            db.getTopicProgress(subject.short, mod.num, t.title),
          ]);
          return [
            i,
            {
              unlocked,
              completed: p?.completed ?? false,
              quizBest: p?.quizBest ?? 0,
            },
          ] as const;
        }),
      );
      if (live) setRows(Object.fromEntries(entries));
    })().catch(() => {});
    return () => {
      live = false;
    };
  }, [subject, mod]);

  const pattern = mod.examPattern ?? subject.examPattern;

  return (
    <main className="flex flex-col gap-4">
      <header>
        <Link
          href={`/subjects/${subject.short}`}
          className="inline-flex min-h-[44px] items-center text-sm font-medium text-[var(--text-dim)]"
        >
          ← {subject.name}
        </Link>
        <h1 className="mt-1 text-[24px] font-bold leading-tight">
          Module {mod.num} · {mod.title}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-dim)]">
          {mod.topics.length} topics ·{" "}
          {mod.topics.reduce((n, t) => n + t.questions.length, 0)} questions
        </p>
      </header>

      {pattern ? (
        <GlassCard>
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-dim)]">
            Exam pattern
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-dim)]">
            {pattern}
          </p>
        </GlassCard>
      ) : null}

      <div className="flex flex-col gap-3">
        {mod.topics.map((t, i) => {
          const r = rows[i] ?? { unlocked: i === 0, completed: false, quizBest: 0 };
          const href = topicHref(subject.short, mod.num, t);
          const inner = (
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${
                  r.completed
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                    : r.unlocked
                      ? "bg-[var(--text)] text-[var(--bg)]"
                      : "bg-[var(--track)] text-[var(--text-faint)]"
                }`}
              >
                {r.completed ? (
                  <CheckIcon className="h-5 w-5" />
                ) : r.unlocked ? (
                  i + 1
                ) : (
                  <LockIcon className="h-5 w-5" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold text-[var(--text)]">
                  {t.title}
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-dim)]">
                  {t.questions.length} questions
                  {r.quizBest > 0 ? (
                    <Pill
                      variant={
                        r.quizBest >= QUIZ_PASS_SCORE ? "sure" : "default"
                      }
                    >
                      Best {r.quizBest}%
                    </Pill>
                  ) : null}
                </span>
              </span>
              {r.unlocked ? (
                <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
              ) : (
                <LockIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
              )}
            </div>
          );
          return r.unlocked ? (
            <Link
              key={t.title}
              href={href}
              className="block min-h-[44px]"
              aria-label={`${t.title}${r.completed ? ", completed" : ""}`}
            >
              <GlassCard className="transition-transform active:scale-[0.99]">
                {inner}
              </GlassCard>
            </Link>
          ) : (
            <GlassCard
              key={t.title}
              className="opacity-70"
              aria-label={`${t.title}, locked`}
            >
              {inner}
              <p className="mt-2 text-xs text-[var(--text-faint)]">
                Finish the previous topic to unlock this one.
              </p>
            </GlassCard>
          );
        })}
      </div>
    </main>
  );
}
