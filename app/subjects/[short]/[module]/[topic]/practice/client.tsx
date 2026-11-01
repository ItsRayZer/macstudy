// app/subjects/[short]/[module]/[topic]/practice/client.tsx
// Practice phase screen: guided single-question flow. Next moves to Test.

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PhaseShell } from "../phase-shell";
import dynamic from "next/dynamic";

const PracticePhase = dynamic(() => import("../phases/practice").then((m) => ({ default: m.PracticePhase } )), {
  loading: () => (
    <div className="flex flex-col gap-4" aria-label="Loading">
  <div className="h-7 w-40 animate-pulse rounded-xl bg-[var(--track)]" />
  <div className="glass rounded-3xl p-6">
    <div className="h-5 w-3/4 animate-pulse rounded-lg bg-[var(--track)]" />
    <div className="mt-3 h-5 w-1/2 animate-pulse rounded-lg bg-[var(--track)]" />
  </div>
</div>
  ),
});
import {
  getModuleLocal,
  getSubjectLocal,
  getTopicBySlug,
} from "../../../../../../lib/study";

export function PracticeClient({
  short,
  num,
  slug,
}: {
  short: string;
  num: string;
  slug: string;
}) {
  const router = useRouter();
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
      phase={1}
      backHref={`${base}/learn`}
      backLabel="Learn"
      progress={progress}
      hideBottomSkip
    >
      <PracticePhase
        short={subject.short}
        num={mod.num}
        topicTitle={topic.title}
        topic={topic}
        questions={topic.questions}
        onProgress={setProgress}
        resumeKey={`practice:${short}:${num}:${slug}`}
        onNext={() => {
          router.push(`${base}/test`);
        }}
      />
    </PhaseShell>
  );
}
