// app/subjects/[short]/[module]/view.tsx
// Module (chapter) detail (client): numbered topic rows, expandable via
// chevron. An expanded topic reveals its video row (when a video slot
// matches) plus Learn / Practice / Test entry rows that deep-link into the
// single-flow topic page. A "Start here" bubble marks the first uncompleted
// item and moves as the student progresses.

"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  ChevronRightIcon,
  GlassCard,
  Pill,
  ProgressBar,
} from "../../../../components/ui";
import { getDB } from "../../../../lib/db";
import {
  getModuleLocal,
  getSubjectLocal,
  isTopicUnlocked,
  matchVideoSlot,
  QUIZ_PASS_SCORE,
  summarizeExamPattern,
  topicHref,
} from "../../../../lib/study";
import { subjects } from "@/src/content/subjects";
import type { Topic } from "@/src/content/types";

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

function PlayIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <polygon points="6 3 20 12 6 21 6 3" />
    </Icon>
  );
}

function BookOpenIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </Icon>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </Icon>
  );
}

function CheckSquareIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="m9 11 3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </Icon>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}

interface TopicRowState {
  unlocked: boolean;
  completed: boolean;
  percent: number;
  quizBest: number;
}

type ItemKey = "video" | "learn" | "practice" | "test";

function StartHereBubble() {
  return (
    <span className="pointer-events-none absolute -top-3 right-3 z-10">
      <span className="block rounded-full bg-[var(--text)] px-3 py-1 text-[11px] font-bold text-[var(--bg)] shadow-lg">
        Start here
      </span>
      <span
        aria-hidden="true"
        className="mx-auto block h-2 w-2 rotate-45 bg-[var(--text)]"
        style={{ marginTop: -4, marginLeft: "auto", marginRight: 18 }}
      />
    </span>
  );
}

export function ModuleView({ short, num }: { short: string; num: string }) {
  const subject = getSubjectLocal(short) ?? subjects[0];
  const mod = getModuleLocal(subject, num) ?? subject.modules[0];
  const [rows, setRows] = useState<Record<number, TopicRowState>>({});
  const [expanded, setExpanded] = useState<number | null>(null);

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
              percent: p?.percent ?? 0,
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

  const patternLine = summarizeExamPattern(mod.examPattern ?? subject.examPattern);
  const doneCount = mod.topics.filter(
    (_, i) => rows[i]?.completed,
  ).length;

  // First unlocked, uncompleted topic = where the student should begin.
  const startIndex = mod.topics.findIndex(
    (_, i) => (rows[i]?.unlocked ?? i === 0) && !rows[i]?.completed,
  );

  const nextItem = (topic: Topic, r: TopicRowState): ItemKey => {
    if (r.percent <= 0) return "learn";
    if (r.quizBest <= 0) return "practice";
    if (!r.completed && r.quizBest < QUIZ_PASS_SCORE) return "test";
    return "learn";
  };

  return (
    <main className="flex flex-col gap-5">
      <header>
        <div className="flex items-center justify-between">
          <Link
            href={`/subjects/${subject.short}`}
            aria-label={`Back to ${subject.name}`}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl text-[var(--text)] active:bg-[var(--track)]"
          >
            <BackIcon className="h-6 w-6" />
          </Link>
          <Pill>
            {doneCount}/{mod.topics.length} Completed
          </Pill>
        </div>
        <p className="mt-2 text-[13px] font-medium uppercase tracking-widest text-[var(--text-faint)]">
          Chapter {mod.num}
        </p>
        <h1 className="mt-1 text-[26px] font-bold leading-tight text-[var(--text)]">
          {mod.title}
        </h1>
        <ProgressBar
          value={
            mod.topics.length === 0
              ? 0
              : (doneCount / mod.topics.length) * 100
          }
          className="mt-3"
        />
        {patternLine ? (
          <p className="mt-2 text-[12px] text-[var(--text-faint)]">
            <span className="font-semibold uppercase tracking-widest">
              Exam pattern
            </span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            {patternLine}
          </p>
        ) : null}
      </header>

      <div className="flex flex-col gap-2">
        {mod.topics.map((t, i) => {
          const r = rows[i] ?? {
            unlocked: i === 0,
            completed: false,
            percent: 0,
            quizBest: 0,
          };
          const isOpen = expanded === i;
          const isStart = i === startIndex && startIndex !== -1;
          const slot = matchVideoSlot(subject.short, mod.num, t);
          const href = topicHref(subject.short, mod.num, t);
          const item = nextItem(t, r);

          const topicRow = (
            <div className="relative flex items-center gap-4 px-2 py-3">
              {isStart && !isOpen ? <StartHereBubble /> : null}
              <span
                className={`w-9 shrink-0 text-[26px] font-bold tabular-nums leading-none ${
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
                  {t.title}
                </span>
                <span className="mt-1 block text-[12px] text-[var(--text-faint)]">
                  {r.completed
                    ? "Completed"
                    : r.quizBest > 0
                      ? `Best ${r.quizBest}%`
                      : r.percent > 0
                        ? "In progress"
                        : `${t.questions.length} questions`}
                </span>
              </span>
              {!r.unlocked ? (
                <LockIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
              ) : isOpen ? (
                <ChevronDownIcon className="h-5 w-5 shrink-0 text-[var(--text-dim)]" />
              ) : (
                <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
              )}
            </div>
          );

          const entryRow = (
            key: ItemKey,
            icon: ReactNode,
            label: string,
            sub: string,
            target: string,
            showBubble: boolean,
          ) => (
            <Link
              key={key}
              href={target}
              className="relative flex min-h-[56px] items-center gap-3 rounded-2xl px-3 active:bg-[var(--track)]"
              aria-label={`${label} - ${t.title}`}
            >
              {showBubble ? <StartHereBubble /> : null}
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--track)] text-[var(--text)]">
                {icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-[var(--text)]">
                  {label}
                </span>
                <span className="block truncate text-[12px] text-[var(--text-faint)]">
                  {sub}
                </span>
              </span>
              <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
            </Link>
          );

          return (
            <div key={t.title}>
              {r.unlocked ? (
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-label={`${t.title}${r.completed ? ", completed" : ""}`}
                  className="block w-full rounded-2xl text-left active:bg-[var(--track)]"
                >
                  {topicRow}
                </button>
              ) : (
                <div
                  className="rounded-2xl opacity-60"
                  aria-label={`${t.title}, locked`}
                >
                  {topicRow}
                  <p className="px-2 pb-2 pl-[52px] text-[12px] text-[var(--text-faint)]">
                    Finish the previous topic to unlock.
                  </p>
                </div>
              )}

              {isOpen && r.unlocked ? (
                <div className="ml-[52px] flex flex-col gap-1 border-l border-[var(--glass-border)] py-2 pl-2">
                  {slot ? (
                    <>
                      {entryRow(
                        "video",
                        <PlayIcon className="h-5 w-5" />,
                        "Video overview",
                        slot.topicHint,
                        href,
                        false,
                      )}
                      <div className="flex items-center gap-2 px-3">
                        <span className="rounded-full border border-[var(--glass-border)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--text-faint)]">
                          {slot.duration ?? "soon"}
                        </span>
                      </div>
                    </>
                  ) : null}
                  {entryRow(
                    "learn",
                    <BookOpenIcon className="h-5 w-5" />,
                    "Learn",
                    r.percent > 0 ? "Continue reading" : "Start the chapter",
                    `${href}?phase=learn`,
                    isStart && item === "learn",
                  )}
                  {entryRow(
                    "practice",
                    <TargetIcon className="h-5 w-5" />,
                    "Practice",
                    `${t.questions.length} questions`,
                    `${href}?phase=practice`,
                    isStart && item === "practice",
                  )}
                  {entryRow(
                    "test",
                    <CheckSquareIcon className="h-5 w-5" />,
                    "Test",
                    r.quizBest > 0 ? `Best ${r.quizBest}%` : "Self-check quiz",
                    `${href}?phase=test`,
                    isStart && item === "test",
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </main>
  );
}
