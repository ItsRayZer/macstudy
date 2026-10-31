// ------------------------------------------------------------------ REVISE ---
// Spaced-repetition flashcards (ts-fsrs), card state local-only.
// Reviewing the whole deck persists a 75% milestone so progress survives a
// reload. Lazy-loaded by the revise page via next/dynamic.

"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnswerBlock,
  ArrowIcon,
  BackNavIcon,
  ClockIcon,
  FlipIcon,
  RefreshIcon,
} from "../flow";
import { EmptyState, GlassCard } from "../../../../../../components/ui";
import {
  BookmarkButton,
  questionBookmarkRef,
} from "../../../../../../components/bookmarks";
import { markPhaseProgress } from "../../../../../../lib/progress";
import {
  GRADE_BUTTONS,
  Rating,
  hasReviews,
  isCardDue,
  loadCard,
  reviewCard,
  srsKey,
} from "../../../../../../lib/srs";
import type { Question, Topic } from "@/src/content/types";

interface FlashCard {
  key: string;
  front: string;
  frontSub: string;
  back: string[];
  tag: string;
  /** Index into the topic's questions for question-derived cards, else null. */
  qIndex: number | null;
}

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
  const [deck, setDeck] = useState<FlashCard[] | null>(null);
  const [pos, setPos] = useState(0);
  // 0 = front, 1 = preview (first 3 back lines), 2 = full back.
  const [flip, setFlip] = useState<0 | 1 | 2>(0);

  // Reviewing the whole deck counts as finishing Revise: persist the 75%
  // milestone so progress survives a reload. Never downgrades.
  const reviseSaved = useRef(false);
  const deckDone = deck != null && deck.length > 0 && pos >= deck.length;
  useEffect(() => {
    if (deckDone && !reviseSaved.current) {
      reviseSaved.current = true;
      markPhaseProgress(short, num, topic.title, 75).catch(() => {});
    }
  }, [deckDone, short, num, topic.title]);

  const buildDeck = () => {
    const now = new Date();
    const cards: FlashCard[] = [];
    // Every theory point becomes a recall card.
    topic.points.forEach((pt, i) => {
      cards.push({
        key: srsKey(short, num, `${slug}-pt`, i),
        front: topic.title,
        frontSub: `Key point ${i + 1} of ${topic.points.length} · recall it`,
        back: [pt],
        tag: "THEORY",
        qIndex: null,
      });
    });
    // SURE MARK and IMPORTANT questions become Q&A cards.
    questions.forEach((q, i) => {
      if (q.tagBase !== "SURE MARK" && q.tagBase !== "IMPORTANT") return;
      cards.push({
        key: srsKey(short, num, `${slug}-q`, i),
        front: q.q,
        frontSub: `${q.tagBase}${q.years ? ` · ${q.years}` : ""}`,
        back: q.a,
        tag: q.tagBase,
        qIndex: i,
      });
    });
    const entries = cards
      .map((c) => ({ ...c, card: loadCard(c.key) }))
      .filter((e) => !hasReviews(e.card) || isCardDue(e.card, now))
      .sort((a, b) => a.card.due.getTime() - b.card.due.getTime())
      .map(({ key, front, frontSub, back, tag, qIndex }) => ({
        key,
        front,
        frontSub,
        back,
        tag,
        qIndex,
      }));
    setDeck(entries);
    setPos(0);
    setFlip(0);
    onProgress(entries.length === 0 ? 1 : 0);
  };

  useEffect(buildDeck, [short, num, slug, topic, questions, onProgress]);

  useEffect(() => {
    if (deck) onProgress(deck.length === 0 ? 1 : pos / deck.length);
  }, [deck, pos, onProgress]);

  if (deck === null) {
    return (
      <GlassCard>
        <div className="h-24 animate-pulse rounded-2xl bg-[var(--track)]" />
      </GlassCard>
    );
  }

  if (deck.length === 0) {
    return (
      <EmptyState
        title="All caught up"
        subtitle="No flashcards are due for this topic right now. Come back later for spaced review."
      />
    );
  }

  if (pos >= deck.length) {
    return (
      <section aria-label="Flashcards done" className="flex flex-col gap-4">
        <GlassCard>
          <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
            Flashcards done
          </p>
          <h2 className="mt-2 text-[22px] font-bold text-[var(--text)]">
            Reviewed {deck.length} card{deck.length === 1 ? "" : "s"}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-[15px] text-[var(--text-dim)]">
            <ClockIcon className="h-4 w-4" />
            Spaced repetition keeps them coming back right on time.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPos(deck.length - 1)}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80"
            >
              <BackNavIcon className="h-5 w-5" />
              Back
            </button>
            <button
              type="button"
              onClick={buildDeck}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80"
            >
              <RefreshIcon className="h-5 w-5" />
              Check again
            </button>
          </div>
        </GlassCard>
      </section>
    );
  }

  const entry = deck[pos];

  const grade = (rating: Rating) => {
    reviewCard(entry.key, rating);
    setFlip(0);
    setPos((p) => p + 1);
  };

  const goFlip = () => setFlip((f) => ((f + 1) % 3) as 0 | 1 | 2);
  const goNext = () => {
    setFlip(0);
    setPos((p) => Math.min(p + 1, deck.length));
  };
  const goBack = () => {
    setFlip(0);
    setPos((p) => Math.max(p - 1, 0));
  };

  // Swipe left/right to move through the deck without grading.
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 48) return;
    if (dx < 0) goNext();
    else goBack();
  };

  return (
    <section aria-label="Revise" className="flex flex-col gap-4">
      <h2 className="text-[20px] font-bold text-[var(--text)]">
        Revise flashcards
      </h2>
      <div className="flex items-center justify-between text-[13px] text-[var(--text-dim)]">
        <span>
          Card {pos + 1} of {deck.length}
        </span>
        <span className="flex items-center gap-2">
          <span>{entry.tag}</span>
          {entry.qIndex != null ? (
            <BookmarkButton
              key={entry.key}
              target={questionBookmarkRef(short, num, topic.title, entry.qIndex)}
              label="question"
              className="-mr-2"
            />
          ) : null}
        </span>
      </div>

      <button
        type="button"
        onClick={goFlip}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-label={flip === 0 ? "Flip card" : "Show more of the answer"}
        className="block w-full text-left"
      >
        <GlassCard className="min-h-[220px] transition-transform active:scale-[0.99]">
          {flip === 0 ? (
            <div className="flex min-h-[188px] flex-col justify-center gap-3">
              <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
                {entry.tag === "THEORY" ? "Recall" : "Question"}
              </p>
              <p className="text-[18px] font-semibold leading-[1.6] text-[var(--text)]">
                {entry.front}
              </p>
              <p className="text-[13px] text-[var(--text-faint)]">
                {entry.frontSub} · Tap to flip
              </p>
            </div>
          ) : flip === 1 ? (
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
                Answer
              </p>
              <AnswerBlock lines={entry.back.slice(0, 3)} />
              <p className="text-[13px] font-medium text-[var(--text-faint)]">
                Tap for the full answer
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
                Full answer
              </p>
              <AnswerBlock lines={entry.back} />
            </div>
          )}
        </GlassCard>
      </button>

      {flip >= 1 ? (
        <div className="grid grid-cols-4 gap-2" role="group" aria-label="Grade this card">
          {GRADE_BUTTONS.map((g) => (
            <button
              key={g.label}
              type="button"
              onClick={() => grade(g.rating)}
              className="glass flex min-h-[52px] flex-col items-center justify-center rounded-2xl text-[15px] font-semibold text-[var(--text)] active:opacity-80"
            >
              {g.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Card navigation">
        <button
          type="button"
          onClick={goBack}
          disabled={pos === 0}
          className="flex min-h-[52px] items-center justify-center gap-1 rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80 disabled:opacity-40"
        >
          <BackNavIcon className="h-5 w-5" />
          Back
        </button>
        <button
          type="button"
          onClick={goFlip}
          className="flex min-h-[52px] items-center justify-center gap-1 rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80"
        >
          <FlipIcon className="h-5 w-5" />
          Flip
        </button>
        <button
          type="button"
          onClick={goNext}
          className="cta-neon flex min-h-[52px] items-center justify-center gap-1 rounded-2xl text-[15px] font-bold"
        >
          Next
          <ArrowIcon className="h-5 w-5" />
        </button>
      </div>
      <p className="text-center text-[12px] text-[var(--text-faint)]">
        Swipe left or right to move through the deck
      </p>
    </section>
  );
}
