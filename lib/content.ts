// lib/content.ts
// Content adapter for the dashboard/gamification/mocks/PYQ worker.
//
// The canonical syllabus content lives at src/content/ (copied verbatim from
// /home/hatch/workspace/macstudy-content). This module is the single import
// point for all content reads. This module is read-only: it never modifies
// content files.

import { subjects } from "../src/content/subjects";
import type {
  Subject,
  Module,
  Topic,
  Question,
} from "../src/content/types";

export { subjects };
export type { Subject, Module, Topic, Question };

/** Find a subject by short code, case-insensitive. */
export function getSubject(short: string): Subject | undefined {
  const s = short.trim().toUpperCase();
  return subjects.find((sub) => sub.short.toUpperCase() === s);
}

/** All questions of a subject flattened with their location. */
export interface LocatedQuestion {
  subject: string;
  module: string;
  moduleTitle: string;
  topic: string;
  qIndex: number;
  question: Question;
}

export function allQuestions(subject: Subject): LocatedQuestion[] {
  const out: LocatedQuestion[] = [];
  for (const mod of subject.modules) {
    for (const topic of mod.topics) {
      topic.questions.forEach((question, qIndex) => {
        out.push({
          subject: subject.short,
          module: mod.num,
          moduleTitle: mod.title,
          topic: topic.title,
          qIndex,
          question,
        });
      });
    }
  }
  return out;
}
