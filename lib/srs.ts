// lib/srs.ts
// Spaced-repetition wrapper around ts-fsrs (owned by the study/topic worker).
//
// Card state is local-only: persisted in localStorage under the
// "macstudy:srs:" namespace. No schema change, no cloud sync.

import { createEmptyCard, fsrs, Rating, type Card, type Grade } from "ts-fsrs";

const NS = "macstudy:srs:";

export { Rating };
export type { Card };

/** Storage key for one flashcard. The topic part is the URL slug. */
export function srsKey(
  subject: string,
  module: string,
  topicSlug: string,
  qIndex: number,
): string {
  return `${NS}${subject}::${module}::${topicSlug}::${qIndex}`;
}

function canStore(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

/** Revive a card from JSON, restoring Date instances ts-fsrs needs. */
function revive(raw: Record<string, unknown>): Card {
  const fresh = createEmptyCard();
  return {
    ...fresh,
    ...(raw as Partial<Card>),
    due: raw.due ? new Date(raw.due as string) : new Date(),
    last_review: raw.last_review ? new Date(raw.last_review as string) : undefined,
  };
}

/** Load a card's schedule, or a fresh card when never reviewed. */
export function loadCard(key: string): Card {
  if (!canStore()) return createEmptyCard();
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return createEmptyCard();
    return revive(JSON.parse(raw) as Record<string, unknown>);
  } catch {
    return createEmptyCard();
  }
}

function saveCard(key: string, card: Card): void {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(card));
  } catch {
    // Storage blocked or full: the review still counts for this session.
  }
}

/**
 * Grade a card and persist the new FSRS schedule.
 * Returns the updated card.
 */
export function reviewCard(key: string, rating: Rating): Card {
  const card = loadCard(key);
  const next = fsrs().repeat(card, new Date())[rating as Grade].card;
  saveCard(key, next);
  return next;
}

export function isCardDue(card: Card, now: Date = new Date()): boolean {
  return card.due.getTime() <= now.getTime();
}

export function hasReviews(card: Card): boolean {
  return card.reps > 0;
}

export interface GradeButton {
  rating: Rating;
  label: string;
}

export const GRADE_BUTTONS: GradeButton[] = [
  { rating: Rating.Again, label: "Again" },
  { rating: Rating.Hard, label: "Hard" },
  { rating: Rating.Good, label: "Good" },
  { rating: Rating.Easy, label: "Easy" },
];
