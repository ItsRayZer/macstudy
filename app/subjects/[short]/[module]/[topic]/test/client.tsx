// app/subjects/[short]/[module]/[topic]/test/client.tsx
// Test phase screen: 4-option MCQ quiz. Next moves to Revise.

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PhaseShell } from "../phase-shell";
import { TestPhase } from "../flow";
import {
  getModuleLocal,
  getSubjectLocal,
  getTopicBySlug,
} from "../../../../../../lib/study";

export function TestClient({
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
      phase={2}
      backHref={`${base}/practice`}
      backLabel="Practice"
      progress={progress}
    >
      <TestPhase
        short={subject.short}
        num={mod.num}
        topicTitle={topic.title}
        topic={topic}
        questions={topic.questions}
        onProgress={setProgress}
        onNext={() => {
          router.push(`${base}/revise`);
        }}
      />
    </PhaseShell>
  );
}
