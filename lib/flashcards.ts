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
      // Every theory point becomes a recall card.
      topic.points.forEach((pt, i) => {
        cards.push({
          key: srsKey(short, mod.num, `${slug}-pt`, i),
          front: topic.title,
          frontSub: `Ch ${mod.num} · Key point ${i + 1} of ${topic.points.length} · recall it`,
          back: [pt],
          tag: "THEORY",
        });
      });
      // PYQ-tagged questions become Q&A cards.
      topic.questions.forEach((q, i) => {
        if (!isTagged(q)) return;
        cards.push({
          key: srsKey(short, mod.num, `${slug}-q`, i),
          front: q.q,
          frontSub: `${q.tagBase}${q.years ? ` · ${q.years}` : ""} · Ch ${mod.num}`,
          back: q.a,
          tag: q.tagBase,
          bookmark: questionBookmarkRef(short, mod.num, topic.title, i),
        });
      });
      if (cards.length > 0) {
        groups.push({
          moduleNum: mod.num,
          moduleTitle: mod.title,
          topicTitle: topic.title,
          topicSlug: slug,
          cards,
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
