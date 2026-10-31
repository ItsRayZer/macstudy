// app/subjects/[short]/view.tsx
// Subject detail view (client): MODULES list first (the hero), then a
// prominent mock-test card, then the PYQ / model paper sections below.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronRightIcon,
  GlassCard,
  MockTestIcon,
  Pill,
  ProgressBar,
} from "../../../components/ui";
import { computeModuleProgress } from "../../../lib/progress";
import { EXAMS } from "../../../lib/exams";
import { getSubjectLocal, summarizeExamPattern } from "../../../lib/study";
import { subjects } from "@/src/content/subjects";
import { PaperSection } from "../../../components/papers";
import { modelPapersFor, pyqPapersFor } from "../../../lib/pyq-papers";
import { MOCK_CONFIGS } from "../../mocks/build-paper";

interface ModuleRow {
  done: number;
  total: number;
  percent: number;
}

export function SubjectView({ short }: { short: string }) {
  const subject = getSubjectLocal(short) ?? subjects[0];
  const [rows, setRows] = useState<Record<string, ModuleRow>>({});

  useEffect(() => {
    let live = true;
    (async () => {
      const entries = await Promise.all(
        subject.modules.map(async (m) => {
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
      if (live) setRows(Object.fromEntries(entries));
    })().catch(() => {});
    return () => {
      live = false;
    };
  }, [subject]);

  const exam = EXAMS.find((e) => e.short === subject.short);
  const mock = MOCK_CONFIGS[subject.short];
  const patternLine = summarizeExamPattern(subject.examPattern);

  return (
    <main className="flex flex-col gap-5">
      <header>
        <Link
          href="/subjects"
          className="inline-flex min-h-[44px] items-center text-[15px] font-medium text-[var(--text-dim)]"
        >
          ← Subjects
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="text-[28px] font-bold leading-tight text-[var(--text)]">
            {subject.name}
          </h1>
          {exam ? <Pill>Exam {subject.exam}</Pill> : null}
        </div>
        <p className="mt-1 text-[15px] text-[var(--text-dim)]">
          {subject.modules.length} modules
          {patternLine ? (
            <>
              <span className="mx-2" aria-hidden="true">
                ·
              </span>
              <span className="text-[13px] text-[var(--text-faint)]">
                {patternLine}
              </span>
            </>
          ) : null}
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {subject.modules.map((m) => {
          const r = rows[m.num] ?? { done: 0, total: 0, percent: 0 };
          return (
            <Link
              key={m.num}
              href={`/subjects/${subject.short}/${m.num}`}
              className="block min-h-[44px]"
              aria-label={`Module ${m.num}, ${m.title}, ${r.percent}% complete`}
            >
              <GlassCard className="transition-transform active:scale-[0.99]">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-[17px] font-semibold text-[var(--text)]">
                      Module {m.num} · {m.title}
                    </h2>
                    <p className="mt-1 text-[13px] text-[var(--text-dim)]">
                      {r.done}/{r.total} topics · {m.topics.reduce((n, t) => n + t.questions.length, 0)} questions
                    </p>
                    <ProgressBar value={r.percent} className="mt-2" />
                  </div>
                  <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>

      {mock ? (
        <Link
          href={`/mocks/${mock.short.toLowerCase()}`}
          className="block"
          aria-label={`Start ${mock.short} mock test`}
        >
          <div className="flex min-h-[76px] items-center gap-4 rounded-3xl bg-[var(--text)] p-5 text-[var(--bg)] transition-transform active:scale-[0.99]">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--bg)] text-[var(--text)]">
              <MockTestIcon className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-bold">
                Mock test · {mock.totalMarks} marks
              </span>
              <span className="block truncate text-[13px] opacity-70">
                {mock.summary}
              </span>
            </span>
            <ChevronRightIcon className="h-5 w-5 shrink-0 opacity-60" />
          </div>
        </Link>
      ) : null}

      <PaperSection
        title="Question papers"
        subtitle="Official MGU model papers for this subject"
        papers={modelPapersFor(subject.short)}
      />

      <PaperSection
        title="PYQ papers"
        subtitle="Real past papers, by year - view or download"
        papers={pyqPapersFor(subject.short)}
      />
    </main>
  );
}
