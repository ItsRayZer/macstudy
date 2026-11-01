// ------------------------------------------------------------------ REVISE ---
// Spaced-repetition flashcards (ts-fsrs), card state local-only.
// Reviewing the whole deck persists a 75% milestone so progress survives a
// reload. Lazy-loaded by the revise page via next/dynamic.

"use client";

import { useMemo } from "react";
import { FlashDeck, type FlashCard } from "../../../../../../components/flash-deck";
import { questionBookmarkRef } from "../../../../../../components/bookmarks";
import { markPhaseProgress } from "../../../../../../lib/progress";
import { srsKey } from "../../../../../../lib/srs";
import { slugify } from "../../../../../../lib/study";
import type { Question, Topic } from "@/src/content/types";

export function RevisePhase({
  short,
  num,
  slug,
  topic,
  questions,
  onProgress,
}: {
  short: string;
  num: string;
  slug: string;
  topic: Topic;
  questions: Question[];
  onProgress: (fraction: number) => void;
}) {
  // Raw cards (stable SRS keys); FlashDeck filters to due/new and sorts.
  const cards = useMemo<FlashCard[]>(() => {
    const out: FlashCard[] = [];
    // Every theory point becomes a recall card.
    topic.points.forEach((pt, i) => {
      out.push({
        key: srsKey(short, num, `${slug}-pt`, i),
        front: topic.title,
        frontSub: `Key point ${i + 1} of ${topic.points.length} · recall it`,
        back: [pt],
        tag: "THEORY",
      });
    });
    // SURE MARK and IMPORTANT questions become Q&A cards.
    questions.forEach((q, i) => {
      if (q.tagBase !== "SURE MARK" && q.tagBase !== "IMPORTANT") return;
      out.push({
        key: srsKey(short, num, `${slug}-q`, i),
        front: q.q,
        frontSub: `${q.tagBase}${q.years ? ` · ${q.years}` : ""}`,
        back: q.a,
        tag: q.tagBase,
        bookmark: questionBookmarkRef(short, num, topic.title, i),
      });
    });
    return out;
  }, [short, num, slug, topic, questions]);

  // Reviewing the whole deck counts as finishing Revise: persist the 75%
  // milestone so progress survives a reload. Never downgrades.
  const handleDeckDone = () => {
    markPhaseProgress(short, num, topic.title, 75).catch(() => {});
  };

  return (
    <FlashDeck
      cards={cards}
      onDeckDone={handleDeckDone}
      onProgress={onProgress}
      title="Revise flashcards"
    />
  );
}
