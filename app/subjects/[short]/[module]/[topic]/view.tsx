// app/subjects/[short]/[module]/[topic]/view.tsx
// Topic page shell (client): header, unlock gate, and the LEARN / PRACTICE /
// TEST / REVISE segmented tabs. Tab content lives in ./tabs.tsx.

"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EmptyState, Pill, SegmentedTabs } from "../../../../../components/ui";
import { getDB } from "../../../../../lib/db";
import {
  getModuleLocal,
  getSubjectLocal,
  getTopicBySlug,
  isTopicUnlocked,
  QUIZ_PASS_SCORE,
} from "../../../../../lib/study";
import { LearnTab, PracticeTab, ReviseTab, TestTab } from "./tabs";

const TAB_IDS = ["learn", "practice", "test", "revise"] as const;
type TabId = (typeof TAB_IDS)[number];

const TAB_OPTIONS = [
  { id: "learn" as TabId, label: "Learn" },
  { id: "practice" as TabId, label: "Practice" },
  { id: "test" as TabId, label: "Test" },
  { id: "revise" as TabId, label: "Revise" },
];

function isTabId(v: string | null): v is TabId {
  return (TAB_IDS as readonly string[]).includes(v ?? "");
}

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
  const [tab, setTab] = useState<TabId>(() =>
    isTabId(searchParams.get("tab")) ? (searchParams.get("tab") as TabId) : "learn",
  );
  const [gate, setGate] = useState<{
    unlocked: boolean;
    completed: boolean;
    quizBest: number;
  } | null>(null);

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

  if (!subject || !mod || !topic) {
    return (
      <main className="flex flex-col gap-4">
        <EmptyState
          title="Topic not found"
          subtitle="This topic does not exist in the syllabus."
          action={
            <Link
              href="/subjects"
              className="inline-flex min-h-[44px] items-center rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] px-6 font-semibold text-white"
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
            className="inline-flex min-h-[44px] items-center text-sm font-medium text-[var(--text-dim)]"
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
              className="inline-flex min-h-[44px] items-center rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] px-6 font-semibold text-white"
            >
              Back to topics
            </Link>
          }
        />
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-4">
      <header>
        <Link
          href={`/subjects/${subject.short}/${mod.num}`}
          className="inline-flex min-h-[44px] items-center text-sm font-medium text-[var(--text-dim)]"
        >
          ← Module {mod.num} · {mod.title}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="text-[24px] font-bold leading-tight">{topic.title}</h1>
        </div>
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

      <SegmentedTabs<TabId>
        ariaLabel="Topic study tabs"
        options={TAB_OPTIONS}
        value={tab}
        onChange={setTab}
      />

      {tab === "learn" ? (
        <LearnTab subject={subject} mod={mod} topic={topic} />
      ) : tab === "practice" ? (
        <PracticeTab
          short={subject.short}
          num={mod.num}
          topicTitle={topic.title}
          questions={topic.questions}
        />
      ) : tab === "test" ? (
        <TestTab
          short={subject.short}
          num={mod.num}
          topicTitle={topic.title}
          questions={topic.questions}
        />
      ) : (
        <ReviseTab
          short={subject.short}
          num={mod.num}
          slug={slug}
          questions={topic.questions}
        />
      )}
    </main>
  );
}
