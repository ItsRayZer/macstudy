// lib/pyq.ts
// Subject-wise PYQ practice: every PYQ-tagged question in a subject,
// ordered SURE MARK first, then REPEATED, then IMPORTANT (stable).
//
// PYQ_MODULE / PYQ_TOPIC namespace the progress + bookmark rows for this
// mode in the same topic_progress store. They are not a real module/topic,
// so they never leak into subject/module completion math.

import { allQuestions, getSubject } from "./content";
import { isTagged, tagRank } from "./question-priority";
import type { Question } from "./content";

export const PYQ_MODULE = "pyq";
export const PYQ_TOPIC = "PYQ Practice";

export interface PyqItem {
  question: Question;
  moduleNum: string;
  moduleTitle: string;
  topicTitle: string;
}

/** All PYQ-tagged questions of a subject, tag-priority ordered. */
export function getSubjectPyqQuestions(short: string): PyqItem[] {
  const subject = getSubject(short);
  if (!subject) return [];
  return allQuestions(subject)
    .filter((lq) => isTagged(lq.question))
    .sort((a, b) => tagRank(a.question) - tagRank(b.question))
    .map((lq) => ({
      question: lq.question,
      moduleNum: lq.module,
      moduleTitle: lq.moduleTitle,
      topicTitle: lq.topic,
    }));
}

/** Honest PYQ count for a subject, computed from content, never hardcoded. */
export function countSubjectPyq(short: string): number {
  return getSubjectPyqQuestions(short).length;
}
