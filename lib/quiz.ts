// lib/quiz.ts
// Quiz engine for the topic TEST tab (owned by the study/topic worker).
//
// Two modes:
// - Guided mode (default): missed questions are re-queued and repeat at the
//   end of the round until answered correctly.
// - Exam mode (opts.examMode): single pass, no repeats, no skips. A wrong
//   pick records a mistake and moves on. Used by the TEST phase's exam mode.
//
// XP RULES (match lib/gamify.ts): IMPORTANT = 10, REPEATED = 15,
// SURE MARK = 20. XP is awarded for first-attempt correct answers only,
// computed here and banked at finalize through the gamification worker's
// recordQuizResult(), which persists via getDB().addXP(), touches the streak,
// bumps quiz counters, and evaluates achievements. Missed marks are recorded
// as mistakes via getDB().addMistake() immediately.

import { getDB } from "./db";
import { QUIZ_PASS_SCORE } from "./study";
import { recordQuizResult, type AchievementDef } from "./gamify";
import type { Question } from "@/src/content/types";

export const XP_WEIGHTS: Record<Question["tagBase"], number> = {
  IMPORTANT: 10,
  REPEATED: 15,
  "SURE MARK": 20,
};

export function xpForTag(tagBase: Question["tagBase"]): number {
  return XP_WEIGHTS[tagBase] ?? 10;
}

export interface QuizMeta {
  subject: string;
  module: string;
  /** Topic TITLE (the DB topic key). */
  topic: string;
}

export interface QuizSummary {
  total: number;
  knownFirstTry: number;
  /** First-pass known rate, 0-100. */
  accuracy: number;
  /** XP banked for this quiz. */
  xpEarned: number;
  seconds: number;
  /** Question indices missed at least once. */
  weakIndices: number[];
  passed: boolean;
}

export interface QuizFinal {
  summary: QuizSummary;
  passed: boolean;
  newlyUnlocked: AchievementDef[];
}

export class QuizSession {
  readonly total: number;
  private readonly questions: Question[];
  private readonly meta: QuizMeta;
  private queue: number[] = [];
  private firstAttempt: boolean[] = [];
  private requeue: number[] = [];
  private pos = 0;
  private round = 1;
  private known: boolean[];
  private everMissed = new Set<number>();
  private startedAt = Date.now();
  private revealed = false;
  private readonly examMode: boolean;

  constructor(
    questions: Question[],
    meta: QuizMeta,
    opts?: { examMode?: boolean },
  ) {
    this.questions = questions;
    this.meta = meta;
    this.examMode = opts?.examMode ?? false;
    this.total = questions.length;
    this.queue = questions.map((_, i) => i);
    this.firstAttempt = questions.map(() => true);
    this.known = questions.map(() => false);
  }

  /** Current question index, or null when the quiz is finished. */
  get current(): number | null {
    return this.pos < this.queue.length ? this.queue[this.pos] : null;
  }

  get done(): boolean {
    return this.pos >= this.queue.length;
  }

  get isRevealed(): boolean {
    return this.revealed;
  }

  /** 1-based round number (repeats bump it). */
  get roundNumber(): number {
    return this.round;
  }

  /** Position inside the current round, 1-based. */
  get roundPos(): number {
    return Math.min(this.pos + 1, this.queue.length);
  }

  get roundTotal(): number {
    return this.queue.length;
  }

  /** Progress bar value 0-100. Repeat rounds pin at 100 with a label. */
  get progressPct(): number {
    if (this.done) return 100;
    if (this.round > 1) return 100;
    return this.total === 0 ? 0 : (this.pos / this.total) * 100;
  }

  get currentQuestion(): Question | null {
    const c = this.current;
    return c == null ? null : this.questions[c];
  }

  revealAnswer(): void {
    if (this.current != null) this.revealed = true;
  }

  /**
   * Mark the current question known. Returns the XP this mark is worth
   * (banked at finalize; 0 on repeat rounds so repeats can't farm XP).
   */
  async markKnown(): Promise<{ xp: number }> {
    const idx = this.current;
    if (idx == null || !this.revealed) return { xp: 0 };
    let xp = 0;
    if (this.firstAttempt[this.pos]) {
      this.known[idx] = true;
      xp = xpForTag(this.questions[idx].tagBase);
    }
    this.advance();
    return { xp };
  }

  /** Mark the current question missed: mistake recorded; re-queued at round
   * end in guided mode, single pass in exam mode. */
  async markMissed(): Promise<void> {
    const idx = this.current;
    if (idx == null || !this.revealed) return;
    this.everMissed.add(idx);
    await getDB().addMistake(
      this.meta.subject,
      this.meta.module,
      this.meta.topic,
      idx,
    );
    if (!this.examMode) this.requeue.push(idx);
    this.advance();
  }

  /**
   * MCQ answer path: no separate reveal step. A correct pick banks XP
   * exactly like markKnown; a wrong pick records a mistake and re-queues
   * exactly like markMissed.
   */
  async answerOption(correct: boolean): Promise<{ xp: number }> {
    if (this.current == null) return { xp: 0 };
    this.revealed = true;
    if (correct) return this.markKnown();
    await this.markMissed();
    return { xp: 0 };
  }

  private advance(): void {
    this.revealed = false;
    this.pos += 1;
    if (
      !this.examMode &&
      this.pos >= this.queue.length &&
      this.requeue.length > 0
    ) {
      // Guided mode: missed questions repeat at the end until answered
      // correctly. Exam mode never re-queues: one pass, then done.
      this.queue = this.requeue;
      this.requeue = [];
      this.firstAttempt = this.queue.map(() => false);
      this.pos = 0;
      this.round += 1;
    }
  }

  private buildSummary(xpEarned: number): QuizSummary {
    const knownFirstTry = this.known.filter(Boolean).length;
    const accuracy =
      this.total === 0 ? 0 : Math.round((knownFirstTry / this.total) * 100);
    return {
      total: this.total,
      knownFirstTry,
      accuracy,
      xpEarned,
      seconds: Math.max(1, Math.round((Date.now() - this.startedAt) / 1000)),
      weakIndices: [...this.everMissed].sort((a, b) => a - b),
      passed: accuracy >= QUIZ_PASS_SCORE,
    };
  }

  /**
   * Finish the quiz: bank XP for first-pass known answers (via the
   * gamification worker, persisted with getDB().addXP), touch the streak,
   * update quiz counters / achievements, and record topic progress.
   * Pass (>= 60%) marks the topic completed, which unlocks the next topic.
   */
  async finalize(): Promise<QuizFinal> {
    const result = await recordQuizResult(this.questions, this.known);
    const summary = this.buildSummary(result.xpGained);
    const db = getDB();
    const prev = await db.getTopicProgress(
      this.meta.subject,
      this.meta.module,
      this.meta.topic,
    );
    await db.setTopicProgress(this.meta.subject, this.meta.module, this.meta.topic, {
      completed: summary.passed ? true : undefined,
      quizBest: summary.accuracy,
      percent: summary.passed
        ? 100
        : Math.max(prev?.percent ?? 0, summary.accuracy),
    });
    return { summary, passed: summary.passed, newlyUnlocked: result.newlyUnlocked };
  }
}
