// lib/question-priority.ts
// Question queue priority for Practice and Test.
//
// Tags are earned from real PYQ frequency analysis: SURE MARK appeared 3+
// times, REPEATED 2+, IMPORTANT is PYQ-derived. The queue always serves
// SURE MARK first, then REPEATED, then IMPORTANT, and untagged filler last,
// so tagged questions are never stuck behind filler. The optional "PYQ only"
// filter keeps just the tagged questions.

import type { Question } from "@/src/content/types";
import { isMultiConcept } from "./mcq";

const TAG_RANK: Record<string, number> = {
  "SURE MARK": 0,
  "REPEATED": 1,
  "IMPORTANT": 2,
};

/** Lower = earlier in the queue. Untagged filler always goes last. */
export function tagRank(q: Question): number {
  const r = TAG_RANK[q.tagBase];
  return r != null ? r : 3;
}

/** True when the question carries a real PYQ-derived tag. */
export function isTagged(q: Question): boolean {
  return q.tagBase in TAG_RANK && q.tags.length > 0;
}

/**
 * Question indices in priority order (stable inside each tag band).
 * With pyqOnly, untagged filler is dropped from the session entirely.
 */
export function priorityOrder(
  questions: Question[],
  pyqOnly: boolean,
): number[] {
  return questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => !pyqOnly || isTagged(q))
    .sort((a, b) => tagRank(a.q) - tagRank(b.q) || a.i - b.i)
    .map(({ i }) => i);
}

/**
 * Test-phase queue: same priority order, but multi-concept questions are
 * excluded entirely. They cannot be fair MCQs (their answer defines
 * several things, so no single option is "the" correct one). They still
 * appear in Learn and Practice as reading material.
 */
export function testableOrder(
  questions: Question[],
  pyqOnly: boolean,
): number[] {
  return priorityOrder(questions, pyqOnly).filter(
    (i) => !isMultiConcept(questions[i]),
  );
}
