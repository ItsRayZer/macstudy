// app/subjects/[short]/pyq-practice/client.tsx
// Subject-wise PYQ practice screen: every PYQ-tagged question in the subject,
// SURE MARK first, then REPEATED, then IMPORTANT. Reuses the Practice phase
// UI and logic exactly (typed answers, code/working pads, grading, the
// wrong-and-skipped repeat round). Progress is stored per subject and shown
// on the subject page card.

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GlassCard,
  ProgressBar,
  TabBarSpacer,
} from "../../../../components/ui";
import { PracticePhase } from "../[module]/[topic]/phases/practice";
import {
  PYQ_MODULE,
  PYQ_TOPIC,
  getSubjectPyqQuestions,
} from "../../../../lib/pyq";
import { getSubjectLocal } from "../../../../lib/study";
import type { Topic } from "@/src/content/types";

function BackIcon({ className }: { className?: string }) {
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
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

export function PyqPracticeClient({ short }: { short: string }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const subject = getSubjectLocal(short);
  const items = useMemo(() => getSubjectPyqQuestions(short), [short]);
  if (!subject) return null;

  const questions = items.map((i) => i.question);
  const topic: Topic = { title: PYQ_TOPIC, points: [], questions };

  return (
    <main className="flex flex-col gap-4">
      <header>
        <Link
          href={`/subjects/${subject.short}`}
          aria-label={`Back to ${subject.name}`}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center self-start rounded-2xl text-[var(--text)] active:bg-[var(--track)]"
        >
          <BackIcon className="h-6 w-6" />
        </Link>
        <p className="mt-1 text-[12px] font-semibold uppercase tracking-widest text-[var(--text-dim)]">
          PYQ Practice
        </p>
        <h1 className="mt-1 text-[26px] font-bold leading-tight text-[var(--text)]">
          {subject.name}
        </h1>
        <p className="mt-1 text-[14px] text-[var(--text-dim)]">
          {questions.length} PYQ questions across {subject.modules.length}{" "}
          chapters
        </p>
        <ProgressBar value={Math.round(progress * 100)} className="mt-3 h-1.5" />
      </header>

      {questions.length === 0 ? (
        <GlassCard>
          <p className="text-[15px] text-[var(--text-dim)]">
            No PYQ questions for this subject yet.
          </p>
        </GlassCard>
      ) : (
        <PracticePhase
          short={subject.short}
          num={PYQ_MODULE}
          topicTitle={PYQ_TOPIC}
          topic={topic}
          questions={questions}
          mode="pyq"
          onProgress={setProgress}
          onNext={() => router.push(`/subjects/${subject.short}`)}
        />
      )}

      <TabBarSpacer />
    </main>
  );
}
