// app/subjects/[short]/view.tsx
// Subject chapter list (client): numbered module rows with big numerals,
// thin progress bars, "x/y Completed" counts and lock states. Modules unlock
// in order: module N+1 unlocks when module N is fully completed.

"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  BookIcon,
  RowCard,
  TabBarSpacer,
  ZapIcon,
} from "../../../components/ui";
import {
  computeModuleProgress,
  getPyqPracticeProgress,
} from "../../../lib/progress";
import { EXAMS } from "../../../lib/exams";
import { getSubjectLocal, summarizeExamPattern } from "../../../lib/study";
import { countSubjectPyq } from "../../../lib/pyq";
import { countSubjectFlashcards } from "../../../lib/flashcards";
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

function MindMapIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="5" cy="5" r="1.8" />
      <circle cx="19" cy="5" r="1.8" />
      <circle cx="5" cy="19" r="1.8" />
      <circle cx="19" cy="19" r="1.8" />
      <path d="m6.3 6.3 4-4M17.7 6.3l-4-4M6.3 17.7l4 4M17.7 17.7l-4 4" />
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

function CardDeckIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <rect x="8" y="7" width="12" height="14" rx="2.5" />
      <path d="M5.5 4.5h10a2.5 2.5 0 0 1 2.5 2.5v.5" />
    </Icon>
  );
}

interface ModuleRow {
  done: number;
  total: number;
  percent: number;
}

export function SubjectView({ short }: { short: string }) {
  const subject = getSubjectLocal(short) ?? subjects[0];
  const [rows, setRows] = useState<Record<string, ModuleRow>>({});
  const [pyqPercent, setPyqPercent] = useState(0);
  const pyqCount = countSubjectPyq(subject.short);
  const flashCount = countSubjectFlashcards(subject.short);

  useEffect(() => {
    let live = true;
    (async () => {
      const entries = await Promise.all(
        subject.modules.map(async (m, i) => {
          const p = await computeModuleProgress(subject.short, m.num);
          return [
            m.num,
            {
              done: p?.completedTopics ?? 0,
              total: p?.totalTopics ?? 0,
              percent: p?.percent ?? 0,
            },
          ] as const;
        }),
      );
      const pyq = await getPyqPracticeProgress(subject.short);
      if (live) {
        setRows(Object.fromEntries(entries));
        setPyqPercent(pyq);
      }
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
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center self-start rounded-2xl text-[var(--text)] active:bg-[var(--track)]"
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
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/subjects/${subject.short}/mindmap`}
            className="glass flex flex-col gap-2 rounded-3xl p-3 transition-transform active:scale-[0.99]"
            aria-label={`${subject.name} mind map`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--neon-dim)] text-[var(--neon-soft)]">
              <MindMapIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-bold text-[var(--text)]">
                Mind map
              </span>
              <span className="block truncate text-[11px] text-[var(--text-faint)]">
                Syllabus at a glance
              </span>
            </span>
          </Link>
          <Link
            href={`/subjects/${subject.short}/practice`}
            className="glass flex flex-col gap-2 rounded-3xl p-3 transition-transform active:scale-[0.99]"
            aria-label={`${subject.name} practice hub`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--neon-dim)] text-[var(--neon-soft)]">
              <ZapIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-bold text-[var(--text)]">
                Practice
              </span>
              <span className="block truncate text-[11px] tabular-nums text-[var(--text-faint)]">
                Mock, PYQs, cram
              </span>
            </span>
          </Link>
          <Link
            href={`/subjects/${subject.short}/flashcards`}
            className="glass flex flex-col gap-2 rounded-3xl p-3 transition-transform active:scale-[0.99]"
            aria-label={`${subject.name} flashcards`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--neon-dim)] text-[var(--neon-soft)]">
              <CardDeckIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-bold text-[var(--text)]">
                Flashcards
              </span>
              <span className="block truncate text-[11px] tabular-nums text-[var(--text-faint)]">
                {flashCount} cards
              </span>
            </span>
          </Link>
          <Link
            href={`/subjects/${subject.short}/library`}
            className="glass flex flex-col gap-2 rounded-3xl p-3 transition-transform active:scale-[0.99]"
            aria-label={`${subject.name} library`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--neon-dim)] text-[var(--neon-soft)]">
              <BookIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-bold text-[var(--text)]">
                Library
              </span>
              <span className="block truncate text-[11px] text-[var(--text-faint)]">
                Papers, notes, modules
              </span>
            </span>
          </Link>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {subject.modules.map((m, i) => {
          const r = rows[m.num] ?? { done: 0, total: 0, percent: 0 };
          return (
            <Link
              key={m.num}
              href={`/subjects/${subject.short}/${m.num}`}
              className="block"
              aria-label={`Chapter ${i + 1}, ${m.title}, ${r.done} of ${r.total} completed`}
            >
              <RowCard
                icon={
                  <span className="text-[14px] font-bold tabular-nums">
                    {i + 1}
                  </span>
                }
                title={m.title}
                subtitle={`${r.done}/${r.total} Completed · ${Math.round(r.percent)}%`}
                iconBg="track"
              />
            </Link>
          );
        })}
      </div>

      <TabBarSpacer />
    </main>
  );
}
