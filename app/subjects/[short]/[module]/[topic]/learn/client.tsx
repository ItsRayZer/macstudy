// app/subjects/[short]/[module]/[topic]/learn/client.tsx
// Learn phase screen: video-first, paginated course theory, ultra-minimal
// exam footnote. "Next" finishes Learn, unlocks Practice, and moves on.

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PhaseShell } from "../phase-shell";
import { LearnPhase } from "../flow";
import {
  getModuleLocal,
  getSubjectLocal,
  getTopicBySlug,
} from "../../../../../../lib/study";

export function LearnClient({
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
      phase={0}
      backHref={`/subjects/${short}/${num}`}
      backLabel={`Module ${num}`}
      progress={progress}
    >
      <LearnPhase
        subject={subject}
        mod={mod}
        topic={topic}
        onProgress={setProgress}
        onNext={() => {
          router.push(`${base}/practice`);
        }}
      />
    </PhaseShell>
  );
}
