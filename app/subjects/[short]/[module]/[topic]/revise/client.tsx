// app/subjects/[short]/[module]/[topic]/revise/client.tsx
// Revise phase screen: ts-fsrs flashcards for the topic.

"use client";

import Link from "next/link";
import { useState } from "react";
import { PhaseShell } from "../phase-shell";
import { RevisePhase } from "../flow";
import {
  getModuleLocal,
  getSubjectLocal,
  getTopicBySlug,
} from "../../../../../../lib/study";

export function ReviseClient({
  short,
  num,
  slug,
}: {
  short: string;
  num: string;
  slug: string;
}) {
  const [progress, setProgress] = useState(0);

  const subject = getSubjectLocal(short);
  const mod = subject ? getModuleLocal(subject, num) : undefined;
  const topic = mod ? getTopicBySlug(mod, slug) : undefined;
  if (!subject || !mod || !topic) return null;

  const base = `/subjects/${short}/${num}/${slug}`;

  return (
    <PhaseShell
      short={short}
      num={num}
      slug={slug}
      phase={3}
      backHref={`${base}/test`}
      backLabel="Test"
      progress={progress}
    >
      <RevisePhase
        short={subject.short}
        num={mod.num}
        slug={slug}
        topic={topic}
        questions={topic.questions}
        onProgress={setProgress}
      />
      <Link
        href={`/subjects/${short}/${num}`}
        className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-[var(--track)] px-6 text-[15px] font-semibold text-[var(--text)] active:opacity-80"
      >
        Back to topics
      </Link>
    </PhaseShell>
  );
}
