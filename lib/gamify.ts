// lib/gamify.ts
// MacStudy gamification: weighted XP for quizzes, streak touches, daily XP
// goal storage, and the achievement engine.
//
// XP RULES
//   - Quiz questions award XP by tag weight when self-marked correct:
//       IMPORTANT = 10, REPEATED = 15, SURE MARK = 20 (unknown tags = 5).
//   - XP is recorded through getDB().addXP and the streak is touched through
//     getDB().touchStreak on every scored quiz or mock.
//   - Achievements unlock through getDB().unlockAchievement.
//
// All DB access goes through getDB() from lib/db.ts (async).

import { getDB } from "./db";
import { subjects } from "./content";

export const XP_WEIGHTS: Record<string, number> = {
  IMPORTANT: 10,
  REPEATED: 15,
  "SURE MARK": 20,
};

const FALLBACK_WEIGHT = 5;

// ------------------------------------------------------------ daily goal ---

const GOAL_KEY = "macstudy:daily-goal";
export const DEFAULT_DAILY_GOAL = 100;

function canStore(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

export function getDailyGoal(): number {
  if (!canStore()) return DEFAULT_DAILY_GOAL;
  try {
    const raw = window.localStorage.getItem(GOAL_KEY);
    const n = raw == null ? NaN : Number(raw);
    return Number.isFinite(n) && n > 0 ? Math.round(n) : DEFAULT_DAILY_GOAL;
  } catch {
    return DEFAULT_DAILY_GOAL;
  }
}

export function setDailyGoal(n: number): void {
  if (!canStore()) return;
  try {
    const v = Math.max(10, Math.min(1000, Math.round(n)));
    window.localStorage.setItem(GOAL_KEY, String(v));
  } catch {
    // storage blocked: goal stays session-only
  }
}

// ---------------------------------------------------------------- counters ---

interface GamifyCounters {
  quizCount: number;
  sureCorrect: number;
}

const COUNTERS_KEY = "macstudy:gamify-counters";

function readCounters(): GamifyCounters {
  const fallback: GamifyCounters = { quizCount: 0, sureCorrect: 0 };
  if (!canStore()) return fallback;
  try {
    const raw = window.localStorage.getItem(COUNTERS_KEY);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw) as Partial<GamifyCounters>;
    return {
      quizCount: Number(parsed.quizCount) || 0,
      sureCorrect: Number(parsed.sureCorrect) || 0,
    };
  } catch {
    return fallback;
  }
}

function writeCounters(c: GamifyCounters): void {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(COUNTERS_KEY, JSON.stringify(c));
  } catch {
    // ignore: counters are best-effort
  }
}

/** Public read of the local gamification counters (profile page). */
export function getGamifyCounters(): GamifyCounters {
  return readCounters();
}

// ------------------------------------------------------------------ stats ---

export interface GamifyStats {
  totalXP: number;
  streakCurrent: number;
  streakLongest: number;
  topicsCompleted: number;
  modulesCompleted: number;
  subjectsFullyDone: number;
  quizCount: number;
  sureMarksCorrect: number;
  /** Local hour of day (0-23) at collection time. */
  hour: number;
}

/** Collect everything achievement checks need. */
export async function collectStats(): Promise<GamifyStats> {
  const db = getDB();
  const [totalXP, streak, counters] = await Promise.all([
    db.getXP(),
    db.getStreak(),
    Promise.resolve(readCounters()),
  ]);

  let topicsCompleted = 0;
  let modulesCompleted = 0;
  let subjectsFullyDone = 0;

  for (const subject of subjects) {
    let subjectDone = true;
    for (const mod of subject.modules) {
      let moduleDone = true;
      for (const topic of mod.topics) {
        const p = await db.getTopicProgress(
          subject.short,
          mod.num,
          topic.title,
        );
        const done = p != null && (p.completed || p.percent >= 100);
        if (done) {
          topicsCompleted += 1;
        } else {
          moduleDone = false;
          subjectDone = false;
        }
      }
      if (moduleDone) modulesCompleted += 1;
    }
    if (subjectDone) subjectsFullyDone += 1;
  }

  return {
    totalXP,
    streakCurrent: streak.current,
    streakLongest: streak.longest,
    topicsCompleted,
    modulesCompleted,
    subjectsFullyDone,
    quizCount: counters.quizCount,
    sureMarksCorrect: counters.sureCorrect,
    hour: new Date().getHours(),
  };
}

// ------------------------------------------------------------ achievements ---

export type AchievementIconName =
  | "target"
  | "flame"
  | "book"
  | "star"
  | "trophy"
  | "moon"
  | "sunrise";

export interface AchievementDef {
  id: string;
  name: string;
  desc: string;
  icon: AchievementIconName;
  check: (stats: GamifyStats) => boolean | Promise<boolean>;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first-quiz",
    name: "First Quiz",
    desc: "Score your first quiz or mock test.",
    icon: "target",
    check: (s) => s.quizCount >= 1,
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    desc: "Reach a 7-day study streak.",
    icon: "flame",
    check: (s) => s.streakLongest >= 7,
  },
  {
    id: "module-complete",
    name: "Module Master",
    desc: "Finish every topic in any module.",
    icon: "book",
    check: (s) => s.modulesCompleted >= 1,
  },
  {
    id: "sure-100",
    name: "Sure Shot",
    desc: "Answer 100 SURE MARK questions correctly.",
    icon: "star",
    check: (s) => s.sureMarksCorrect >= 100,
  },
  {
    id: "subject-complete",
    name: "Subject Slayer",
    desc: "Complete every topic in one subject.",
    icon: "trophy",
    check: (s) => s.subjectsFullyDone >= 1,
  },
  {
    id: "night-owl",
    name: "Night Owl",
    desc: "Study after 10 PM.",
    icon: "moon",
    check: (s) => s.hour >= 22,
  },
  {
    id: "early-bird",
    name: "Early Bird",
    desc: "Study before 7 AM.",
    icon: "sunrise",
    check: (s) => s.hour < 7,
  },
];

export interface QuizResult {
  xpGained: number;
  totalXP: number;
  newlyUnlocked: AchievementDef[];
}

/**
 * Score a self-checked quiz or mock.
 * questions: the bank questions in order (only tagBase is read).
 * knownFlags: parallel array, true when the learner marked it correct.
 */
export async function recordQuizResult(
  questions: { tagBase: string }[],
  knownFlags: boolean[],
): Promise<QuizResult> {
  const db = getDB();
  let xpGained = 0;
  let sureCorrect = 0;

  questions.forEach((q, i) => {
    if (!knownFlags[i]) return;
    xpGained += XP_WEIGHTS[q.tagBase] ?? FALLBACK_WEIGHT;
    if (q.tagBase === "SURE MARK") sureCorrect += 1;
  });

  const totalXP =
    xpGained > 0
      ? await db.addXP(xpGained, "quiz")
      : await db.getXP();
  await db.touchStreak();

  const counters = readCounters();
  counters.quizCount += 1;
  counters.sureCorrect += sureCorrect;
  writeCounters(counters);

  const newlyUnlocked = await evaluateAchievements();

  return { xpGained, totalXP, newlyUnlocked };
}

/** Check every achievement against fresh stats and unlock the newly earned. */
export async function evaluateAchievements(): Promise<AchievementDef[]> {
  const db = getDB();
  const [stats, unlocked] = await Promise.all([
    collectStats(),
    db.getAchievements(),
  ]);
  const have = new Set(unlocked.map((a) => a.id));
  const newly: AchievementDef[] = [];
  for (const def of ACHIEVEMENTS) {
    if (have.has(def.id)) continue;
    const earned = await def.check(stats);
    if (earned) {
      const fresh = await db.unlockAchievement(def.id);
      if (fresh) newly.push(def);
    }
  }
  return newly;
}
