// app/subjects/[short]/view.tsx
// Subject detail view (client): module list with per-module progress and the
// subject's exam pattern note.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronRightIcon,
  GlassCard,
  Pill,
  ProgressBar,
} from "../../../components/ui";
import { computeModuleProgress } from "../../../lib/progress";
import { EXAMS } from "../../../lib/exams";
import { getSubjectLocal } from "../../../lib/study";
import { subjects } from "@/src/content/subjects";
import { PaperSection } from "../../../components/papers";
import { modelPapersFor, pyqPapersFor } from "../../../lib/pyq-papers";

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

  return (
    <main className="flex flex-col gap-4">
      <header>
        <Link
          href="/subjects"
          className="inline-flex min-h-[44px] items-center text-sm font-medium text-[var(--text-dim)]"
        >
          ← Subjects
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="text-[28px] font-bold leading-tight">
            {subject.name}
          </h1>
          {exam ? <Pill>Exam {subject.exam}</Pill> : null}
        </div>
        <p className="mt-1 text-sm text-[var(--text-dim)]">
          {subject.modules.length} modules
        </p>
      </header>

      {subject.examPattern ? (
        <GlassCard>
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-dim)]">
            Exam pattern
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-dim)]">
            {subject.examPattern}
          </p>
        </GlassCard>
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
                    <h2 className="truncate text-base font-semibold text-[var(--text)]">
                      Module {m.num} · {m.title}
                    </h2>
                    <p className="mt-1 text-xs text-[var(--text-dim)]">
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
    </main>
  );
}
