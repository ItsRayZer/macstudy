// app/subjects/[short]/[module]/[topic]/view.tsx
// Topic page shell (client): header, unlock gate, and the single continuous
// LEARN -> PRACTICE -> TEST -> REVISE flow with a pinned progress bar.
// The bottom tab menu hides automatically on topic pages (see BottomNav).

"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EmptyState, Pill, ProgressBar } from "../../../../../components/ui";
import { getDB } from "../../../../../lib/db";
import {
  getModuleLocal,
  getSubjectLocal,
  getTopicBySlug,
  isTopicUnlocked,
  QUIZ_PASS_SCORE,
} from "../../../../../lib/study";
import { LearnPhase, PracticePhase, RevisePhase, TestPhase } from "./flow";

const PHASES = ["Learn", "Practice", "Test", "Revise"] as const;

export function TopicView({
  short,
  num,
  slug,
}: {
  short: string;
  num: string;
  slug: string;
}) {
  return (
    <Suspense
      fallback={
        <main className="flex flex-col gap-4">
          <div className="h-8 w-2/3 animate-pulse rounded-xl bg-[var(--track)]" />
          <div className="h-40 animate-pulse rounded-3xl bg-[var(--track)]" />
        </main>
      }
    >
      <TopicContent short={short} num={num} slug={slug} />
    </Suspense>
  );
}

function TopicContent({
  short,
  num,
  slug,
}: {
  short: string;
  num: string;
  slug: string;
}) {
  const searchParams = useSearchParams();
  const initialStage = (() => {
    const p = searchParams.get("phase");
    if (p === "practice") return 1;
    if (p === "test") return 2;
    if (p === "revise") return 3;
    return 0;
  })();
  const [stage, setStage] = useState(initialStage);
  const [fractions, setFractions] = useState<[number, number, number, number]>([
    0, 0, 0, 0,
  ]);
  const [gate, setGate] = useState<{
    unlocked: boolean;
    completed: boolean;
    quizBest: number;
  } | null>(null);

  const practiceRef = useRef<HTMLDivElement>(null);
  const testRef = useRef<HTMLDivElement>(null);
  const reviseRef = useRef<HTMLDivElement>(null);

  const subject = getSubjectLocal(short);
  const mod = subject ? getModuleLocal(subject, num) : undefined;
  const topic = mod ? getTopicBySlug(mod, slug) : undefined;

  useEffect(() => {
    if (!subject || !mod || !topic) return;
    let live = true;
    (async () => {
      const index = mod.topics.indexOf(topic);
      const [unlocked, p] = await Promise.all([
        isTopicUnlocked(subject.short, mod, index),
        getDB().getTopicProgress(subject.short, mod.num, topic.title),
      ]);
      if (live)
        setGate({
          unlocked,
          completed: p?.completed ?? false,
          quizBest: p?.quizBest ?? 0,
        });
    })().catch(() => {});
    return () => {
      live = false;
    };
  }, [subject, mod, topic]);

  const setFraction = useCallback((i: number, f: number) => {
    setFractions((prev) => {
      if (prev[i] === f) return prev;
      const next = [...prev] as [number, number, number, number];
      next[i] = Math.max(0, Math.min(1, f));
      return next;
    });
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    window.setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const advanceTo = (nextStage: number) => {
    setFraction(nextStage - 1, 1);
    setStage(nextStage);
    if (nextStage === 1) scrollTo(practiceRef);
    else if (nextStage === 2) scrollTo(testRef);
    else if (nextStage === 3) scrollTo(reviseRef);
  };

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

  if (gate && !gate.unlocked) {
    return (
      <main className="flex flex-col gap-4">
        <header>
          <Link
            href={`/subjects/${subject.short}/${mod.num}`}
            className="inline-flex min-h-[44px] items-center text-[15px] font-medium text-[var(--text-dim)]"
          >
            ← Module {mod.num}
          </Link>
        </header>
        <EmptyState
          title="Topic locked"
          subtitle="Finish the previous topic (or pass its quiz) to unlock this one."
          action={
            <Link
              href={`/subjects/${subject.short}/${mod.num}`}
              className="inline-flex min-h-[44px] items-center rounded-2xl bg-[var(--text)] px-6 font-semibold text-[var(--bg)]"
            >
              Back to topics
            </Link>
          }
        />
      </main>
    );
  }

  const overall = (fractions[0] + fractions[1] + fractions[2] + fractions[3]) / 4 * 100;

  return (
    <main className="flex flex-col gap-6">
      <div className="sticky top-0 z-40 -mx-4 bg-[var(--bg)]/95 px-4 pb-3 pt-4 backdrop-blur">
        <div className="flex items-center justify-between text-[12px] font-medium text-[var(--text-dim)]">
          {PHASES.map((p, i) => (
            <span
              key={p}
              className={
                i <= stage ? "text-[var(--text)]" : "text-[var(--text-faint)]"
              }
            >
              {p}
            </span>
          ))}
        </div>
        <ProgressBar value={overall} className="mt-2 h-1.5" />
      </div>

      <header>
        <Link
          href={`/subjects/${subject.short}/${mod.num}`}
          className="inline-flex min-h-[44px] items-center text-[15px] font-medium text-[var(--text-dim)]"
        >
          ← Module {mod.num} · {mod.title}
        </Link>
        <h1 className="mt-1 text-[26px] font-bold leading-tight text-[var(--text)]">
          {topic.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Pill>{topic.questions.length} questions</Pill>
          {gate?.completed ? (
            <Pill variant="sure">Completed</Pill>
          ) : gate && gate.quizBest > 0 ? (
            <Pill variant={gate.quizBest >= QUIZ_PASS_SCORE ? "sure" : "default"}>
              Best {gate.quizBest}%
            </Pill>
          ) : null}
        </div>
      </header>

      <LearnPhase
        subject={subject}
        mod={mod}
        topic={topic}
        onNext={() => advanceTo(1)}
      />

      {stage >= 1 ? (
        <div ref={practiceRef} className="scroll-mt-24">
          <PracticePhase
            short={subject.short}
            num={mod.num}
            topicTitle={topic.title}
            questions={topic.questions}
            onProgress={(f) => setFraction(1, f)}
            onNext={() => advanceTo(2)}
          />
        </div>
      ) : null}

      {stage >= 2 ? (
        <div ref={testRef} className="scroll-mt-24">
          <TestPhase
            short={subject.short}
            num={mod.num}
            topicTitle={topic.title}
            questions={topic.questions}
            onProgress={(f) => setFraction(2, f)}
            onNext={() => advanceTo(3)}
          />
        </div>
      ) : null}

      {stage >= 3 ? (
        <div ref={reviseRef} className="scroll-mt-24">
          <RevisePhase
            short={subject.short}
            num={mod.num}
            slug={slug}
            questions={topic.questions}
            onProgress={(f) => setFraction(3, f)}
          />
        </div>
      ) : null}
    </main>
  );
}
