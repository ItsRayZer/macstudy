// app/subjects/[short]/[module]/[topic]/phase-shell.tsx
// Shared shell for the four phase pages (Learn / Practice / Test / Revise):
// on-screen back arrow and the slim glass progress bar pinned at the top
// with tappable steps. Everything is unlocked: the student moves freely
// between phases with Next/Back. The bottom tab menu hides automatically on
// topic pages (see BottomNav).

"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { EmptyState, ProgressBar } from "../../../../../components/ui";
import {
  getModuleLocal,
  getSubjectLocal,
  getTopicBySlug,
} from "../../../../../lib/study";
import { PHASES, type PhaseIndex } from "../../../../../lib/phase-unlocks";
function BackArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-5 w-5"}
      aria-hidden="true"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

const PHASE_PATHS = ["learn", "practice", "test", "revise"] as const;

export function PhaseShell({
  short,
  num,
  slug,
  phase,
  backHref,
  backLabel,
  progress,
  children,
}: {
  short: string;
  num: string;
  slug: string;
  phase: PhaseIndex;
  backHref: string;
  backLabel: string;
  progress: number;
  children: ReactNode;
}) {
  const subject = getSubjectLocal(short);
  const mod = subject ? getModuleLocal(subject, num) : undefined;
  const topic = mod ? getTopicBySlug(mod, slug) : undefined;

  const base = `/subjects/${short}/${num}/${slug}`;

  // Phase progress reflects real progress across ALL phases (Learn 0-25%,
  // Practice 25-50%, Test 50-75%, Revise 75-100%). It must never show full
  // before the topic is complete.
  const clamped = Math.min(1, Math.max(0, progress));
  const overall = ((phase + clamped) / PHASES.length) * 100;

  if (!subject || !mod || !topic) {
    return (
      <main className="flex flex-col gap-4">
        <EmptyState
          title="Topic not found"
          subtitle="This topic does not exist in the syllabus."
          action={
            <Link
              href="/subjects"
              className="inline-flex min-h-[44px] items-center rounded-2xl bg-[var(--text)] px-6 font-semibold text-[var(--bg)]"
            >
              Back to subjects
            </Link>
          }
        />
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-6">
      <div className="sticky top-3 z-40 -mx-4 px-4">
        <div className="glass-strong rounded-3xl px-4 pb-3 pt-3">
          <div className="flex items-center justify-between">
            {PHASES.map((p, i) => {
              const isCurrent = i === phase;
              const step = (
                <span
                  className={
                    isCurrent
                      ? "font-bold text-[var(--text)] underline underline-offset-4"
                      : "text-[var(--text)]"
                  }
                >
                  {p}
                </span>
              );
              return !isCurrent ? (
                <Link
                  key={p}
                  replace
                  href={`${base}/${PHASE_PATHS[i as PhaseIndex]}`}
                  aria-label={`Go to ${p}`}
                  className="flex min-h-[36px] items-center text-[12px] font-medium"
                >
                  {step}
                </Link>
              ) : (
                <span
                  key={p}
                  aria-current={isCurrent ? "step" : undefined}
                  className="flex min-h-[36px] items-center text-[12px] font-medium"
                >
                  {step}
                </span>
              );
            })}
          </div>
          <ProgressBar value={overall} className="mt-1 h-1.5" />
        </div>
      </div>

      <header>
        <Link
          href={backHref}
          className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-medium text-[var(--text-dim)]"
          aria-label={backLabel}
        >
          <BackArrowIcon />
          {backLabel}
        </Link>
        <h1 className="mt-1 text-[26px] font-bold leading-tight text-[var(--text)]">
          {topic.title}
        </h1>
      </header>

      {children}
    </main>
  );
}
