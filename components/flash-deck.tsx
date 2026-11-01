// components/flash-deck.tsx
// Shared premium flashcard deck: 3D Y-axis flip, swipe right = got it,
// swipe left = still learning, next-two-card stack peek, ts-fsrs review
// wiring, shuffle, restart. Extracted from the per-topic RevisePhase so
// topic decks and subject-wide decks share the exact same UI and logic.
//
// The caller builds raw FlashCards (with stable SRS keys) and passes them
// in; this component filters to due/new cards, sorts by due date, and
// calls onDeckDone once when the whole deck is reviewed.

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnswerBlock, ClockIcon, RefreshIcon } from "../app/subjects/[short]/[module]/[topic]/flow";
import {
  EmptyState,
  GlassCard,
  ProgressBar,
} from "./ui";
import {
  BookmarkButton,
  type BookmarkRef,
} from "./bookmarks";
import {
  Rating,
  hasReviews,
  isCardDue,
  loadCard,
  reviewCard,
} from "../lib/srs";

export interface FlashCard {
  /** Stable SRS storage key (macstudy:srs: namespace). */
  key: string;
  front: string;
  frontSub: string;
  back: string[];
  /** "THEORY" or the question tagBase. */
  tag: string;
  /** When set, a bookmark toggle shows for this card. */
  bookmark?: BookmarkRef | null;
}

export function FlashDeck({
  cards,
  onDeckDone,
  onProgress,
  headerExtra,
  title = "Revise flashcards",
}: {
  cards: FlashCard[];
  onDeckDone?: () => void;
  onProgress?: (fraction: number) => void;
  headerExtra?: ReactNode;
  title?: string;
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

  const deckDone =
    deck != null && deck.length > 0 && pos >= deck.length && requeue.length === 0;
  const doneFired = useRef(false);
  useEffect(() => {
    if (deckDone && !doneFired.current) {
      doneFired.current = true;
      onDeckDone?.();
    }
  }, [deckDone, onDeckDone]);

  // "Still learning" cards cycle back in for another round.
  useEffect(() => {
    if (deck && pos >= deck.length && requeue.length > 0) {
      setDeck((d) => (d ? [...d, ...requeue] : d));
      setRequeue([]);
    }
  }, [deck, pos, requeue]);

  const buildDeck = () => {
    const now = new Date();
    const entries = cards
      .map((c) => ({ ...c, card: loadCard(c.key) }))
      .filter((e) => !hasReviews(e.card) || isCardDue(e.card, now))
      .sort((a, b) => a.card.due.getTime() - b.card.due.getTime())
      .map(({ key, front, frontSub, back, tag, bookmark }) => ({
        key,
        front,
        frontSub,
        back,
        tag,
        bookmark,
      }));
    setDeck(entries);
    setPos(0);
    setFlipped(false);
    setDragDx(null);
    setExiting(null);
    setRequeue([]);
    doneFired.current = false;
    onProgress?.(entries.length === 0 ? 1 : 0);
  };

  useEffect(buildDeck, [cards, onProgress]);

  useEffect(() => {
    if (deck) onProgress?.(deck.length === 0 ? 1 : pos / deck.length);
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
        subtitle="No flashcards are due right now. Come back later for spaced review."
      />
    );
  }

  if (pos >= deck.length) {
    return (
      <section aria-label="Flashcards done" className="flex flex-col gap-4">
        {headerExtra}
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
              <RefreshIcon className="h-4 w-4" />
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
      {headerExtra}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[20px] font-bold text-[var(--text)]">{title}</h2>
        <span className="text-[13px] tabular-nums text-[var(--text-dim)]">
          {shown} / {deck.length}
        </span>
      </div>
      <ProgressBar value={Math.round((pos / deck.length) * 100)} className="h-1" />
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-faint)]">
          {entry.tag}
        </span>
        {entry.bookmark ? (
          <BookmarkButton
            key={entry.key}
            target={entry.bookmark}
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
