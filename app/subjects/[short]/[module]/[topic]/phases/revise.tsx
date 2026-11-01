// ------------------------------------------------------------------ REVISE ---
// Spaced-repetition flashcards (ts-fsrs), card state local-only.
// Reviewing the whole deck persists a 75% milestone so progress survives a
// reload. Lazy-loaded by the revise page via next/dynamic.

"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnswerBlock,
  ClockIcon,
  RefreshIcon,
} from "../flow";
import {
  EmptyState,
  GlassCard,
  ProgressBar,
} from "../../../../../../components/ui";
import {
  BookmarkButton,
  questionBookmarkRef,
} from "../../../../../../components/bookmarks";
import { markPhaseProgress } from "../../../../../../lib/progress";
import {
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
  // Premium deck interaction: 3D flip, swipe, stack.
  const [flipped, setFlipped] = useState(false);
  const [dragDx, setDragDx] = useState<number | null>(null);
  const [exiting, setExiting] = useState<1 | -1 | null>(null);
  const [requeue, setRequeue] = useState<FlashCard[]>([]);
  const [shuffled, setShuffled] = useState(false);
  const dragStart = useRef<{ x: number; moved: boolean } | null>(null);
  const dxRef = useRef(0);
  const exitTimer = useRef<number | null>(null);

  // Reviewing the whole deck counts as finishing Revise: persist the 75%
  // milestone so progress survives a reload. Never downgrades. Cards marked
  // "still learning" cycle back in, so the deck is done only when the
  // requeue is empty too.
  const reviseSaved = useRef(false);
  const deckDone =
    deck != null && deck.length > 0 && pos >= deck.length && requeue.length === 0;
  useEffect(() => {
    if (deckDone && !reviseSaved.current) {
      reviseSaved.current = true;
      markPhaseProgress(short, num, topic.title, 75).catch(() => {});
    }
  }, [deckDone, short, num, topic.title]);

  // "Still learning" cards cycle back in for another round.
  useEffect(() => {
    if (deck && pos >= deck.length && requeue.length > 0) {
      setDeck((d) => (d ? [...d, ...requeue] : d));
      setRequeue([]);
    }
  }, [deck, pos, requeue]);

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
    setFlipped(false);
    setDragDx(null);
    setExiting(null);
    setRequeue([]);
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

  // --- deck actions -------------------------------------------------------
  const advance = () => {
    setFlipped(false);
    setDragDx(null);
    setExiting(null);
    dxRef.current = 0;
    setPos((p) => p + 1);
  };

  /** Fly the card off in a direction, then run the follow-up. */
  const flyAndAdvance = (dir: 1 | -1, fn: () => void) => {
    if (exiting || !entry) return;
    setExiting(dir);
    setDragDx(null);
    if (exitTimer.current) window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => {
      fn();
      advance();
    }, 260);
  };

  const markKnown = () => {
    const e = entry;
    if (!e) return;
    flyAndAdvance(1, () => reviewCard(e.key, Rating.Good));
  };

  const markLearning = () => {
    const e = entry;
    if (!e) return;
    flyAndAdvance(-1, () => {
      reviewCard(e.key, Rating.Again);
      setRequeue((r) => [...r, e]);
    });
  };

  const restartDeck = () => {
    if (exitTimer.current) window.clearTimeout(exitTimer.current);
    buildDeck();
  };

  const toggleShuffle = () => {
    const next = !shuffled;
    setShuffled(next);
    if (next) {
      setDeck((d) => {
        if (!d) return d;
        const done = d.slice(0, pos);
        const rest = d.slice(pos);
        for (let i = rest.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [rest[i], rest[j]] = [rest[j], rest[i]];
        }
        return [...done, ...rest];
      });
    }
  };

  // --- swipe / tap ----------------------------------------------------------
  const onPointerDown = (e: React.PointerEvent) => {
    if (exiting) return;
    dragStart.current = { x: e.clientX, moved: false };
    dxRef.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = dragStart.current;
    if (!s || exiting) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 8) s.moved = true;
    dxRef.current = dx;
    setDragDx(dx);
  };
  const endDrag = () => {
    const s = dragStart.current;
    dragStart.current = null;
    if (!s || exiting) return;
    const dx = dxRef.current;
    dxRef.current = 0;
    setDragDx(null);
    if (!s.moved) {
      setFlipped((f) => !f);
      return;
    }
    if (dx > 110) markKnown();
    else if (dx < -110) markLearning();
  };

  const dragStyle: React.CSSProperties | undefined = exiting
    ? {
        transform: `translateX(${exiting * 480}px) rotate(${exiting * 22}deg)`,
        opacity: 0,
      }
    : dragDx != null && dragDx !== 0
      ? {
          transform: `translateX(${dragDx}px) rotate(${dragDx * 0.06}deg)`,
        }
      : undefined;

  const shown = Math.min(pos + 1, deck.length);

  return (
    <section aria-label="Revise" className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[20px] font-bold text-[var(--text)]">
          Revise flashcards
        </h2>
        <span className="text-[13px] tabular-nums text-[var(--text-dim)]">
          {shown} / {deck.length}
        </span>
      </div>
      <ProgressBar value={Math.round((pos / deck.length) * 100)} className="h-1" />
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-faint)]">
          {entry.tag}
        </span>
        {entry.qIndex != null ? (
          <BookmarkButton
            key={entry.key}
            target={questionBookmarkRef(short, num, topic.title, entry.qIndex)}
            label="question"
            className="-mr-2"
          />
        ) : null}
      </div>

      {/* Card stack: the next two cards peek from behind. */}
      <div className="relative">
        {[2, 1].map((offset) => {
          const peek = deck[pos + offset];
          if (!peek) return null;
          const scale = offset === 1 ? 0.95 : 0.9;
          return (
            <div
              key={peek.key}
              aria-hidden="true"
              className="glass absolute inset-x-3 top-0 rounded-3xl"
              style={{
                transform: `translateY(${offset * 12}px) scale(${scale})`,
                opacity: 0.45,
                bottom: 0,
              }}
            />
          );
        })}

        {/* Top card: drag layer outside, 3D flip inside. */}
        <div
          className={`flash-drag flash-scene relative ${exiting ? "flash-fly" : ""}`}
          style={dragStyle}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          role="button"
          tabIndex={0}
          aria-label={
            flipped ? "Answer shown. Tap to flip back." : "Tap to flip the card."
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          }}
        >
          <div
            className={`flash-flip-inner grid ${flipped ? "flash-flipped" : ""}`}
          >
            <div className="flash-face col-start-1 row-start-1">
              <div className="glass flash-edge flex min-h-[260px] flex-col justify-center rounded-3xl p-6 pl-7">
                <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--neon-soft)]">
                  {entry.tag === "THEORY" ? "Recall" : "Question"}
                </p>
                <p className="mt-4 text-[22px] font-bold leading-[1.5] text-[var(--text)]">
                  {entry.front}
                </p>
                <p className="mt-4 text-[13px] text-[var(--text-faint)]">
                  {entry.frontSub}
                </p>
                <p className="mt-6 text-[12px] font-medium text-[var(--text-faint)]">
                  Tap to flip
                </p>
              </div>
            </div>
            <div className="flash-face flash-face-back col-start-1 row-start-1">
              <div className="glass flash-edge flex min-h-[260px] flex-col rounded-3xl p-6 pl-7">
                <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--neon-soft)]">
                  Answer
                </p>
                <div className="mt-4 flex-1">
                  <AnswerBlock lines={entry.back} />
                </div>
                <p className="mt-4 text-[12px] text-[var(--text-faint)]">
                  Swipe right if you got it, left if not
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {flipped ? (
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Grade this card">
          <button
            type="button"
            onClick={markLearning}
            className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80"
          >
            Still learning
          </button>
          <button
            type="button"
            onClick={markKnown}
            className="cta-neon flex min-h-[52px] w-full items-center justify-center rounded-2xl text-[15px] font-bold"
          >
            Got it
          </button>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={shuffled}
          onClick={toggleShuffle}
          className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full bg-[var(--track)] px-4 text-[13px] font-semibold text-[var(--text-dim)] active:opacity-80"
        >
          <span
            aria-hidden="true"
            className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
              shuffled ? "bg-[var(--neon)]" : "bg-[var(--glass-border)]"
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                shuffled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </span>
          Shuffle
        </button>
        <button
          type="button"
          onClick={restartDeck}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--track)] px-4 text-[13px] font-semibold text-[var(--text-dim)] active:opacity-80"
        >
          <RefreshIcon className="h-4 w-4" />
          Restart deck
        </button>
      </div>
    </section>
  );
}
