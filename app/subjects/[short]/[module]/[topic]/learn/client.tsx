// app/subjects/[short]/[module]/[topic]/learn/client.tsx
// Learn phase screen: video-first, paginated course theory, ultra-minimal
// exam footnote. "Next" finishes Learn, unlocks Practice, and moves on.

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { saveTopicPhase, getTopicPhase, clearTopicPhase, type TopicPhase } from "../../../../../../lib/topic-resume";
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
  const [savedPhase, setSavedPhase] = useState<TopicPhase | null>(null);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    // Check saved phase BEFORE overwriting. If user was on practice/test/revise,
    // offer Continue/Restart.
    const prev = getTopicPhase(short, num, slug);
    if (prev && prev !== "learn") {
      setSavedPhase(prev);
      setShowResume(true);
    } else {
      saveTopicPhase(short, num, slug, "learn");
    }
  }, [short, num, slug]);

  const subject = getSubjectLocal(short);
  const mod = subject ? getModuleLocal(subject, num) : undefined;
  const topic = mod ? getTopicBySlug(mod, slug) : undefined;
  if (!subject || !mod || !topic) return null;

  const base = `/subjects/${short}/${num}/${slug}`;

  const handleContinue = () => {
    setShowResume(false);
    if (savedPhase) router.push(`${base}/${savedPhase}`);
  };

  const handleRestart = () => {
    clearTopicPhase(short, num, slug);
    saveTopicPhase(short, num, slug, "learn");
    setShowResume(false);
  };

  if (showResume && savedPhase) {
    const phaseLabel = savedPhase.charAt(0).toUpperCase() + savedPhase.slice(1);
    return (
      <div className="mx-auto max-w-2xl px-4 pb-32 pt-12">
        <div className="glass rounded-3xl p-6 text-center">
          <h2 className="text-[20px] font-bold text-[var(--text)]">
            Welcome back
          </h2>
          <p className="mt-2 text-[14px] text-[var(--text-dim)]">
            You left off at {phaseLabel} for this topic.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleContinue}
              className="cta-neon w-full rounded-2xl py-4 text-[15px] font-bold"
            >
              Continue {phaseLabel}
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="w-full rounded-2xl bg-[var(--track)] py-4 text-[15px] font-semibold text-[var(--text)]"
            >
              Restart from Learn
            </button>
          </div>
        </div>
      </div>
    );
  }

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
