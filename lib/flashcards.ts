// lib/flashcards.ts
// Subject-wide flashcards: every theory point and every PYQ-tagged
// question (SURE MARK, REPEATED, IMPORTANT) in a subject, grouped by
// topic. SRS keys reuse the per-topic slug scheme, so reviewing a card
// in the subject deck updates the same schedule as the topic Revise tab.
//
// FLASH_MODULE / FLASH_TOPIC namespace the completion milestone in the
// same topic_progress store. They are not a real module/topic, so they
// never leak into subject/module completion math.

import { getSubject } from "./content";
import { subjects } from "../src/content/subjects";
import { isTagged } from "./question-priority";
import { slugify } from "./study";
import { srsKey, loadCard, hasReviews, isCardDue } from "./srs";
import { questionBookmarkRef } from "../components/bookmarks";
import type { FlashCard } from "../components/flash-deck";

export const FLASH_MODULE = "flashcards";
export const FLASH_TOPIC = "Subject Flashcards";

export interface TopicFlashGroup {
  moduleNum: string;
  moduleTitle: string;
  topicTitle: string;
  topicSlug: string;
  cards: FlashCard[];
}

/** All flashcard groups of a subject, in syllabus order. */
export function getSubjectFlashGroups(short: string): TopicFlashGroup[] {
  const subject = getSubject(short);
  if (!subject) return [];
  const groups: TopicFlashGroup[] = [];
  for (const mod of subject.modules) {
    for (const topic of mod.topics) {
      const slug = slugify(topic.title);
      const cards: FlashCard[] = [];
      // Every theory point becomes a recall card (short main points only).
      topic.points.forEach((pt, i) => {
        cards.push({
          key: srsKey(short, mod.num, `${slug}-pt`, i),
          front: topic.title,
          frontSub: `Ch ${mod.num} · Key point ${i + 1} of ${topic.points.length} · recall it`,
          back: condenseFlashBack([pt]),
          tag: "THEORY",
        });
      });
      // PYQ-tagged questions become Q&A cards (short main points only).
      topic.questions.forEach((q, i) => {
        if (!isTagged(q)) return;
        cards.push({
          key: srsKey(short, mod.num, `${slug}-q`, i),
          front: q.q,
          frontSub: `${q.tagBase}${q.years ? ` · ${q.years}` : ""} · Ch ${mod.num}`,
          back: condenseFlashBack(q.a),
          tag: q.tagBase,
          bookmark: questionBookmarkRef(short, mod.num, topic.title, i),
        });
      });
      const unique = dedupeFlashCards(cards);
      if (unique.length > 0) {
        groups.push({
          moduleNum: mod.num,
          moduleTitle: mod.title,
          topicTitle: topic.title,
          topicSlug: slug,
          cards: unique,
        });
      }
    }
  }
  return groups;
}

/** Flat list of every flashcard in the subject (for the "All" filter). */
export function getSubjectFlashcards(short: string): FlashCard[] {
  return getSubjectFlashGroups(short).flatMap((g) => g.cards);
}

/** Honest total card count for a subject, computed from content. */
export function countSubjectFlashcards(short: string): number {
  return getSubjectFlashcards(short).length;
}

/** Total card count across every subject. */
export function countAllFlashcards(): number {
  return subjects.reduce(
    (n, s) => n + countSubjectFlashcards(s.short),
    0,
  );
}

/** Normalize card front text for duplicate detection. */
function normFront(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Condense a flashcard back to short, quick-recall main points.
 * Flattens answer lines into individual points, drops empties, keeps at
 * most the first 4 points, and caps the total at ~320 chars, cutting only
 * at point boundaries (never mid-word). Full answers live in Learn and
 * Practice; flashcards are for fast recall only.
 */
export function condenseFlashBack(back: string[]): string[] {
  const points: string[] = [];
  for (const line of back) {
    for (const part of String(line).split(/\n+/)) {
      const t = part.trim();
      if (t) points.push(t);
    }
  }
  if (points.length === 0) return [];
  const kept: string[] = [];
  let total = 0;
  for (const p of points.slice(0, 4)) {
    if (kept.length > 0 && total + p.length > 320) break;
    kept.push(p);
    total += p.length;
  }
  // A single oversized point: trim at a word boundary, never mid-word.
  if (kept.length === 1 && kept[0].length > 320) {
    const cut = kept[0].slice(0, 320);
    const atSpace = cut.lastIndexOf(" ");
    kept[0] = (atSpace > 200 ? cut.slice(0, atSpace) : cut).trimEnd() + " ...";
  }
  return kept;
}

/**
 * Drop duplicate flashcards. Exact duplicates (normalized front text) keep
 * the first card. Theory-vs-question overlap: when one normalized front
 * contains the other and the shorter is longer than 20 chars, keep the
 * question card (it carries the answer) and drop the theory one.
 */
export function dedupeFlashCards(cards: FlashCard[]): FlashCard[] {
  const isQuestion = (c: FlashCard) => c.tag !== "THEORY";
  const out: FlashCard[] = [];
  for (const c of cards) {
    const n = normFront(c.front);
    let drop = false;
    for (let i = 0; i < out.length; i++) {
      const k = out[i];
      const kn = normFront(k.front);
      const shorter = n.length <= kn.length ? n : kn;
      const longer = n.length <= kn.length ? kn : n;
      const exact = n === kn;
      const overlap = shorter.length > 20 && longer.includes(shorter);
      if (exact || overlap) {
        // Prefer the question card (it carries the answer) over the theory one.
        if (isQuestion(c) && !isQuestion(k)) out[i] = c;
        drop = true;
        break;
      }
    }
    if (!drop) out.push(c);
  }
  return out;
}

/**
 * Cards due (or never reviewed) for a subject. Client-side only: reads
 * the localStorage SRS schedules. Returns 0 on the server.
 */
export function countDueFlashcards(short: string): number {
  if (typeof window === "undefined") return 0;
  const now = new Date();
  let due = 0;
  for (const c of getSubjectFlashcards(short)) {
    try {
      const card = loadCard(c.key);
      if (!hasReviews(card) || isCardDue(card, now)) due += 1;
    } catch {
      due += 1;
    }
  }
  return due;
}
