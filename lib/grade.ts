// lib/grade.ts
// Auto-grading for the PRACTICE typed-answer mode.
//
// Key terms are extracted from the model answer text only: meaningful words
// (proper nouns, numbers, formulas, long content words) with stopwords
// stripped. Nothing is invented. Matching is case-insensitive with light
// plural stemming so minor variations still count.

const STOPWORDS = new Set([
  "the", "and", "for", "with", "from", "that", "this", "these", "those",
  "which", "what", "when", "where", "how", "why", "are", "was", "were",
  "has", "have", "had", "will", "would", "can", "could", "should", "shall",
  "may", "might", "must", "not", "but", "its", "his", "her", "their",
  "our", "your", "you", "they", "them", "his", "into", "over", "under",
  "between", "through", "during", "such", "than", "then", "also", "each",
  "both", "few", "more", "most", "other", "some", "any", "all", "one",
  "two", "first", "second", "new", "used", "use", "using", "used", "called",
  "known", "given", "like", "well", "much", "many", "get", "got", "make",
  "made", "take", "part", "example", "following", "define",
  "defined", "definition", "explain", "briefly", "short", "note", "notes",
  "answer", "question", "mark", "marks", "step", "steps", "thus", "hence",
  "therefore", "however", "while", "because", "since", "about", "above",
  "below", "after", "before", "does", "did", "doing", "done", "been",
  "being", "its", "per", "via", "etc", "ie", "eg", "vs",
  // Generic academic filler that dilutes key-term lists.
  // NOTE: exam terms like data, set, formula, table, time, form are NOT
  // stopwords (Claude review fix) - they carry real meaning in answers.
  "number", "numbers", "value", "values",
  "gives", "give", "equal", "equals", "total", "find",
  "found", "calculate", "calculated", "computation", "compute", "result",
  "results", "figure", "shown", "shows", "show", "way", "ways",
  "often", "always", "never", "every", "without", "within",
]);

/** Light stemming: plural -> singular. */
function stem(w: string): string {
  if (w.length > 4) {
    if (w.endsWith("ies")) return w.slice(0, -3) + "y";
    if (/(s|x|z|ch|sh)es$/.test(w)) return w.slice(0, -2);
    if (w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  }
  return w;
}

export interface GradedTerm {
  term: string;
  hit: boolean;
}

/**
 * Extract up to `max` key terms from model answer lines. Prefers tokens with
 * digits (numbers/formulas), capitalized tokens (names), and longer words.
 */
export function extractKeyTerms(answerLines: string[], max = 12): string[] {
  const text = answerLines.join(" ");
  const raw = text.match(/[A-Za-z0-9][A-Za-z0-9+_./-]*/g) ?? [];
  const freq = new Map<string, number>();
  for (const tok of raw) {
    const t = tok.toLowerCase().replace(/^[./-]+|[./-]+$/g, "");
    if (t.length >= 3 && !STOPWORDS.has(t)) {
      const key = stem(t);
      freq.set(key, (freq.get(key) ?? 0) + 1);
    }
  }
  const scored = new Map<string, { score: number; label: string }>();
  for (const tok of raw) {
    const t = tok.toLowerCase().replace(/^[./-]+|[./-]+$/g, "");
    if (t.length < 3 && !/\d/.test(t)) continue;
    if (STOPWORDS.has(t)) continue;
    const key = stem(t);
    let score = t.length;
    if (/\d/.test(t)) score += 6;
    if (/[A-Z]/.test(tok[0] ?? "") && t.length > 1) score += 3;
    if (t.length >= 7) score += 2;
    score += Math.min(4, (freq.get(key) ?? 1) - 1) * 2; // repeated terms matter
    const prev = scored.get(key);
    if (!prev || score > prev.score) scored.set(key, { score, label: t });
  }
  return [...scored.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((v) => v.label);
}

/** Match extracted terms against the user's typed text (case-insensitive). */
export function gradeAnswer(terms: string[], userText: string): GradedTerm[] {
  const norm = userText.toLowerCase();
  const words = new Set(norm.match(/[a-z0-9]+/g) ?? []);
  const stemmedWords = new Set([...words].map(stem));
  return terms.map((term) => {
    const t = term.toLowerCase();
    let hit = norm.includes(t);
    if (!hit) {
      const parts = t
        .split(/[^a-z0-9]+/)
        .filter((p) => p.length > 0)
        .map(stem);
      hit = parts.length > 0 && parts.every((p) => stemmedWords.has(p));
    }
    return { term, hit };
  });
}

/** Fraction of terms hit, 0..1. */
export function gradeScore(graded: GradedTerm[]): number {
  if (graded.length === 0) return 0;
  return graded.filter((g) => g.hit).length / graded.length;
}

// ------------------------------------------------------------- numbers ---

/** Extract every number (int or decimal, optional sign) from free text. */
export function extractNumbers(text: string): number[] {
  // Claude review fix: don't treat "-" as negative when it follows a digit
  // (e.g. "3-4" is a range, not 3 and -4).
  const m = text.match(/(?<![\d.])-?\d+(?:\.\d+)?/g) ?? [];
  return m.map(Number).filter((n) => Number.isFinite(n));
}

/**
 * Deduplicated numbers from the model answer, capped at `max`. These are the
 * expected figures for numerical questions (final results and key steps).
 */
export function expectedNumbers(answerLines: string[], max = 10): number[] {
  const seen = new Set<string>();
  const out: number[] = [];
  for (const n of extractNumbers(answerLines.join(" "))) {
    const k = String(n);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(n);
    if (out.length >= max) break;
  }
  return out;
}

/**
 * Fraction of expected numbers present in the user's working, within a small
 * relative tolerance (1%) or an absolute 0.011 for tiny values, so rounding
 * differences do not fail a correct solution. Returns 0 when there is
 * nothing to compare.
 */
export function gradeNumbers(expected: number[], userText: string): number {
  if (expected.length === 0) return 0;
  const userNums = extractNumbers(userText);
  if (userNums.length === 0) return 0;
  let hits = 0;
  for (const e of expected) {
    const tol = Math.max(Math.abs(e) * 0.01, 0.011);
    if (userNums.some((u) => Math.abs(u - e) <= tol)) hits += 1;
  }
  return hits / expected.length;
}
