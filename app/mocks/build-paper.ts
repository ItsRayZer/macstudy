// app/mocks/build-paper.ts
// Mock-test paper builder. Papers are sampled from the real question bank:
//   Part A (short): sampled across all modules, IMPORTANT first.
//   Part B (medium): REPEATED first.
//   Part C (long): SURE MARK first.
// Counts and durations follow each subject's real exam pattern; QT uses the
// 80-mark B.Com pattern as a flagged estimate.

import { getSubject, allQuestions, type LocatedQuestion } from "../../lib/content";

export type TagBase = "IMPORTANT" | "REPEATED" | "SURE MARK";

export interface MockPartConfig {
  id: "A" | "B" | "C";
  title: string;
  count: number;
  marks: number;
  prefer: TagBase[];
  hint: string;
}

export interface MockConfig {
  short: string;
  name: string;
  totalMarks: number;
  durationMin: number;
  summary: string;
  /** True when the pattern is an estimate, not the confirmed paper. */
  estimate: boolean;
  parts: MockPartConfig[];
}

export const MOCK_CONFIGS: Record<string, MockConfig> = {
  DBMS: {
    short: "DBMS",
    name: "Database Management Systems",
    totalMarks: 70,
    durationMin: 120,
    summary:
      "70 marks, 2 hours. Part A 5 x 2 (short, all modules), Part B any 5 of 6-mark questions, Part C any 2 of 15-mark essays (COMPANY ER, Normal Forms, anomalies).",
    estimate: false,
    parts: [
      { id: "A", title: "Short questions", count: 5, marks: 2, prefer: ["IMPORTANT", "REPEATED", "SURE MARK"], hint: "2 marks each" },
      { id: "B", title: "Medium questions", count: 5, marks: 6, prefer: ["REPEATED", "IMPORTANT", "SURE MARK"], hint: "6 marks each" },
      { id: "C", title: "Long essays", count: 2, marks: 15, prefer: ["SURE MARK", "REPEATED", "IMPORTANT"], hint: "15 marks each" },
    ],
  },
  DAA: {
    short: "DAA",
    name: "Design and Analysis of Algorithms",
    totalMarks: 50,
    durationMin: 90,
    summary:
      "50 marks, 1 hour 30 minutes. Part A 10 x 2 (all compulsory, all modules), Part B 3 x 5, Part C 1 x 15 (MST, knapsack, Floyd-Warshall, N-Queens hotspots).",
    estimate: false,
    parts: [
      { id: "A", title: "Short questions", count: 10, marks: 2, prefer: ["IMPORTANT", "REPEATED", "SURE MARK"], hint: "2 marks each" },
      { id: "B", title: "Medium questions", count: 3, marks: 5, prefer: ["REPEATED", "IMPORTANT", "SURE MARK"], hint: "5 marks each" },
      { id: "C", title: "Long essay", count: 1, marks: 15, prefer: ["SURE MARK", "REPEATED", "IMPORTANT"], hint: "15 marks" },
    ],
  },
  SF: {
    short: "SF",
    name: "Software Engineering",
    totalMarks: 50,
    durationMin: 90,
    summary:
      "50 marks, 1 hour 30 minutes. Part A 10 x 2 (all compulsory), Part B any 3 of 5 x 5, Part C any 1 of 2 x 15 (requirements elicitation, system testing).",
    estimate: false,
    parts: [
      { id: "A", title: "Short questions", count: 10, marks: 2, prefer: ["IMPORTANT", "REPEATED", "SURE MARK"], hint: "2 marks each" },
      { id: "B", title: "Medium questions", count: 3, marks: 5, prefer: ["REPEATED", "IMPORTANT", "SURE MARK"], hint: "5 marks each" },
      { id: "C", title: "Long essay", count: 1, marks: 15, prefer: ["SURE MARK", "REPEATED", "IMPORTANT"], hint: "15 marks" },
    ],
  },
  PYTHON: {
    short: "PYTHON",
    name: "Python Programming",
    totalMarks: 50,
    durationMin: 90,
    summary:
      "50 marks, 1 hour 30 minutes (MGU Honours model paper). Part A 10 x 2 (answer all, every module), Part B any 3 of 5 x 5, Part C any 1 of 2 x 15.",
    estimate: false,
    parts: [
      { id: "A", title: "Short questions", count: 10, marks: 2, prefer: ["IMPORTANT", "REPEATED", "SURE MARK"], hint: "2 marks each" },
      { id: "B", title: "Medium questions", count: 3, marks: 5, prefer: ["REPEATED", "IMPORTANT", "SURE MARK"], hint: "5 marks each" },
      { id: "C", title: "Long essay", count: 1, marks: 15, prefer: ["SURE MARK", "REPEATED", "IMPORTANT"], hint: "15 marks" },
    ],
  },
  FE: {
    short: "FE",
    name: "Feature Engineering",
    totalMarks: 35,
    durationMin: 60,
    summary:
      "35 marks, 1 hour (MGU Honours model paper). Part A 10 x 2, Part B any 3 of 5 x 5. The exact choice rule is unverified, confirm from the paper.",
    estimate: false,
    parts: [
      { id: "A", title: "Short questions", count: 10, marks: 2, prefer: ["IMPORTANT", "REPEATED", "SURE MARK"], hint: "2 marks each" },
      { id: "B", title: "Medium questions", count: 3, marks: 5, prefer: ["REPEATED", "IMPORTANT", "SURE MARK"], hint: "5 marks each" },
    ],
  },
  QT: {
    short: "QT",
    name: "Quantitative Techniques",
    totalMarks: 80,
    durationMin: 180,
    summary:
      "PATTERN ESTIMATE: 80 marks, 3 hours, based on MGU B.Com Quantitative Techniques for Business papers (overlapping statistics syllabus). Part A 10 x 2, Part B 6 x 5, Part C 2 x 15 (combined mean/SD/CV two-firm problem, Bayes theorem). The real Honours pattern is unconfirmed.",
    estimate: true,
    parts: [
      { id: "A", title: "Short questions", count: 10, marks: 2, prefer: ["IMPORTANT", "REPEATED", "SURE MARK"], hint: "2 marks each" },
      { id: "B", title: "Medium questions", count: 6, marks: 5, prefer: ["REPEATED", "IMPORTANT", "SURE MARK"], hint: "5 marks each" },
      { id: "C", title: "Long numericals", count: 2, marks: 15, prefer: ["SURE MARK", "REPEATED", "IMPORTANT"], hint: "15 marks each" },
    ],
  },
};

export function getMockConfig(short: string): MockConfig | undefined {
  return MOCK_CONFIGS[short.trim().toUpperCase()];
}

export interface PaperQuestion extends LocatedQuestion {
  part: "A" | "B" | "C";
  marks: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Sample `count` questions for one part, spread across modules round-robin,
 * preferring the part's tag order. Falls back to any remaining bank question
 * when a tag or module runs dry.
 */
export function samplePart(
  pool: LocatedQuestion[],
  count: number,
  prefer: TagBase[],
  used: Set<string>,
): LocatedQuestion[] {
  const key = (q: LocatedQuestion) =>
    `${q.module}::${q.topic}::${q.qIndex}`;

  const rank = (q: LocatedQuestion): number => {
    const i = prefer.indexOf(q.question.tagBase as TagBase);
    return i === -1 ? prefer.length : i;
  };

  // Rank every available question, shuffle ties, then take round-robin
  // across modules so the paper spreads over the whole syllabus.
  const ranked = pool
    .filter((q) => !used.has(key(q)))
    .map((q) => ({ q, r: rank(q) }))
    .sort((a, b) => a.r - b.r);
  const shuffledRanked: LocatedQuestion[] = [];
  {
    let i = 0;
    while (i < ranked.length) {
      let j = i;
      while (j < ranked.length && ranked[j].r === ranked[i].r) j++;
      const bucket = shuffle(ranked.slice(i, j).map((x) => x.q));
      shuffledRanked.push(...bucket);
      i = j;
    }
  }

  const picked: LocatedQuestion[] = [];
  const pickedKeys = new Set<string>();
  // Round-robin across modules for spread.
  const modules = [...new Set(shuffledRanked.map((q) => q.module))].sort();
  let guard = 0;
  while (picked.length < count && guard < count * 20 + modules.length * 2) {
    guard++;
    let progressed = false;
    for (const m of modules) {
      if (picked.length >= count) break;
      const next = shuffledRanked.find(
        (q) => q.module === m && !pickedKeys.has(key(q)),
      );
      if (next) {
        picked.push(next);
        pickedKeys.add(key(next));
        progressed = true;
      }
    }
    if (!progressed) break;
  }
  // Fill any remainder from whatever is left.
  for (const q of shuffledRanked) {
    if (picked.length >= count) break;
    if (!pickedKeys.has(key(q))) {
      picked.push(q);
      pickedKeys.add(key(q));
    }
  }
  for (const q of picked) used.add(key(q));
  return picked;
}

/** Build a full paper for a subject. Returns null when the subject is unknown. */
export function buildPaper(short: string): PaperQuestion[] | null {
  const config = getMockConfig(short);
  const subject = getSubject(short);
  if (!config || !subject) return null;
  const pool = allQuestions(subject);
  const used = new Set<string>();
  const paper: PaperQuestion[] = [];
  for (const part of config.parts) {
    const sampled = samplePart(pool, part.count, part.prefer, used);
    for (const q of sampled) {
      paper.push({ ...q, part: part.id, marks: part.marks });
    }
  }
  return paper;
}
