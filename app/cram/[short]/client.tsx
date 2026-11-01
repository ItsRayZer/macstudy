// app/cram/[short]/client.tsx
// Cram mode client: SURE MARK + REPEATED questions, 15-mark first.

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getSubjectLocal } from "../../../lib/study";
import { AnswerBlock } from "../../subjects/[short]/[module]/[topic]/flow";
import { GlassCard, TabBarSpacer } from "../../../components/ui";
import { getDB } from "../../../lib/db";
import type { Question } from "@/src/content/types";

export function CramClient({ short, name }: { short: string; name: string }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [done, setDone] = useState<Set<number>>(new Set());

  const questions = useMemo(() => {
    const subject = getSubjectLocal(short);
    if (!subject) return [];
    const all: (Question & { topicTitle: string })[] = [];
    for (const mod of subject.modules) {
      for (const topic of mod.topics) {
        for (const q of topic.questions) {
          if (q.tagBase === "SURE MARK" || q.tagBase === "REPEATED") {
            all.push({ ...q, topicTitle: topic.title });
          }
        }
      }
    }
    // Sort: 15-mark first, then by tag priority
    return all.sort((a, b) => {
      if (b.marks !== a.marks) return b.marks - a.marks;
      if (a.tagBase === "SURE MARK" && b.tagBase !== "SURE MARK") return -1;
      if (b.tagBase === "SURE MARK" && a.tagBase !== "SURE MARK") return 1;
      return 0;
    });
  }, [short]);

  const toggleReveal = (idx: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const markDone = (idx: number) => {
    setDone((prev) => new Set(prev).add(idx));
    void getDB().addXP(2, "cram");
  };

  const doneCount = done.size;
  const total = questions.length;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-32 pt-6">
      <Link
        href={`/subjects/${short}`}
        className="mb-4 inline-flex items-center gap-2 text-[14px] text-[var(--text-dim)]"
      >
        ← Back to {name}
      </Link>

      <h1 className="text-[24px] font-bold text-[var(--text)]">Cram Mode</h1>
      <p className="mt-1 text-[14px] text-[var(--text-dim)]">
        {doneCount} of {total} reviewed · SURE MARK + REPEATED only
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--track)]">
        <div
          className="h-full rounded-full bg-[var(--neon)] transition-all"
          style={{ width: `${total > 0 ? (doneCount / total) * 100 : 0}%` }}
        />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {questions.map((q, idx) => {
          const isRevealed = revealed.has(idx);
          const isDone = done.has(idx);
          return (
            <GlassCard key={idx} className={isDone ? "opacity-60" : ""}>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[12px] font-semibold text-[var(--neon)]">
                  {q.tagBase} · {q.marks} marks
                </span>
                <span className="text-[12px] text-[var(--text-dim)]">
                  {q.topicTitle}
                </span>
              </div>
              <p className="mt-2 text-[16px] font-medium text-[var(--text)]">
                {q.q}
              </p>
              {!isRevealed ? (
                <button
                  type="button"
                  onClick={() => toggleReveal(idx)}
                  className="mt-3 w-full rounded-xl bg-[var(--track)] py-3 text-[14px] font-semibold text-[var(--text)]"
                >
                  Show Answer
                </button>
              ) : (
                <div className="mt-3">
                  <AnswerBlock lines={q.a} mode="full" />
                  {!isDone && (
                    <button
                      type="button"
                      onClick={() => markDone(idx)}
                      className="cta-neon mt-3 w-full rounded-xl py-3 text-[14px] font-bold"
                    >
                      Got it ✓
                    </button>
                  )}
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      <TabBarSpacer />
    </div>
  );
}
