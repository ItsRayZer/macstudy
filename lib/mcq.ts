// lib/mcq.ts
// Deterministic 4-option MCQ builder for the topic TEST phase.
//
// The correct option is condensed from the question's real answer (first
// answer line, trimmed); correct answers are never changed. The 3
// distractors are drawn from the SAME topic's own content (other questions'
// answers, then theory points): real vocabulary from the chapter, plausible
// but wrong for this question. Nothing is invented outside the topic data.
// Shuffling is seeded per question so options are stable across renders.

import type { Question, Topic } from "@/src/content/types";

export interface Mcq {
  options: string[];
  correctIndex: number;
}

/** Seeded PRNG (mulberry32) for stable shuffles. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  const rand = rng(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function oneLine(s: string, max = 160): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 3).trimEnd() + "..." : t;
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/** Jaccard similarity over word sets; used to drop near-duplicate options. */
function similarity(a: string, b: string): number {
  const sa = new Set(norm(a).split(" ").filter((w) => w.length > 2));
  const sb = new Set(norm(b).split(" ").filter((w) => w.length > 2));
  if (sa.size === 0 || sb.size === 0) return 0;
  let inter = 0;
  for (const w of sa) if (sb.has(w)) inter++;
  return inter / Math.max(sa.size, sb.size);
}

export function buildMcq(
  q: Question,
  topic: Topic,
  qIndex: number,
): Mcq {
  const correct = oneLine(q.a[0] ?? q.q);

  // Candidate distractors: other questions' answers first, then theory points.
  const pool: string[] = [];
  topic.questions.forEach((other, oi) => {
    if (oi === qIndex) return;
    const line = oneLine(other.a[0] ?? "");
    if (line.length >= 24) pool.push(line);
  });
  for (const pt of topic.points) {
    const line = oneLine(pt);
    if (line.length >= 24) pool.push(line);
  }

  const seen = new Set<string>([norm(correct)]);
  const distractors: string[] = [];
  for (const cand of shuffled(pool, qIndex * 31 + 7)) {
    if (distractors.length >= 3) break;
    const n = norm(cand);
    if (!n || seen.has(n)) continue;
    // Drop candidates that are near-duplicates of the correct answer or of
    // an already chosen distractor (could be accidentally correct).
    if (similarity(cand, correct) > 0.65) continue;
    if (distractors.some((d) => similarity(cand, d) > 0.8)) continue;
    seen.add(n);
    distractors.push(cand);
  }
  // Last-resort generic options; only reachable on tiny topics. Three
  // distinct fallbacks so the pad always reaches 4 options.
  const fallbacks = [
    "None of the other statements fits this question.",
    "All of the other statements are incorrect here.",
    "The question cannot be answered from the given statements.",
  ];
  for (const fallback of fallbacks) {
    if (distractors.length >= 3) break;
    if (seen.has(norm(fallback))) continue;
    seen.add(norm(fallback));
    distractors.push(fallback);
  }

  const options = shuffled([correct, ...distractors], qIndex * 101 + 13);
  return { options, correctIndex: options.indexOf(correct) };
}
