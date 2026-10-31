// lib/progress.ts
// Progress aggregation over the syllabus content and the progress DB.
//
// Topic keys in the DB are (subject short, module num, topic title) - the same
// keys the study/topic worker writes. A topic counts as complete when its
// stored percent is >= 100 or its completed flag is set.
//
// All DB access goes through getDB() from lib/db.ts (async).

import { getDB } from "./db";
import { subjects, getSubject } from "./content";
import { EXAMS } from "./exams";

export interface SubjectProgress {
  short: string;
  name: string;
  totalTopics: number;
  completedTopics: number;
  percent: number; // 0-100
}

export interface ModuleProgress {
  short: string;
  num: string;
  title: string;
  totalTopics: number;
  completedTopics: number;
  percent: number;
}

export type TopicStatus = "done" | "in-progress" | "todo";

export interface TopicState {
  moduleNum: string;
  moduleTitle: string;
  topicTitle: string;
  percent: number;
  completed: boolean;
  status: TopicStatus;
}

async function topicDone(
  db: ReturnType<typeof getDB>,
  short: string,
  num: string,
  title: string,
): Promise<{ percent: number; completed: boolean }> {
  const p = await db.getTopicProgress(short, num, title);
  if (p == null) return { percent: 0, completed: false };
  const completed = p.completed || p.percent >= 100;
  return { percent: Math.max(0, Math.min(100, p.percent)), completed };
}

/** Per-subject completion across all modules. */
export async function computeSubjectProgress(
  short: string,
): Promise<SubjectProgress | null> {
  const subject = getSubject(short);
  if (!subject) return null;
  const db = getDB();
  let total = 0;
  let done = 0;
  for (const mod of subject.modules) {
    for (const topic of mod.topics) {
      total += 1;
      const t = await topicDone(db, subject.short, mod.num, topic.title);
      if (t.completed) done += 1;
    }
  }
  return {
    short: subject.short,
    name: subject.name,
    totalTopics: total,
    completedTopics: done,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

/** Per-module completion. */
export async function computeModuleProgress(
  short: string,
  num: string,
): Promise<ModuleProgress | null> {
  const subject = getSubject(short);
  const mod = subject?.modules.find((m) => m.num === num);
  if (!subject || !mod) return null;
  const db = getDB();
  let done = 0;
  for (const topic of mod.topics) {
    const t = await topicDone(db, subject.short, mod.num, topic.title);
    if (t.completed) done += 1;
  }
  const total = mod.topics.length;
  return {
    short: subject.short,
    num: mod.num,
    title: mod.title,
    totalTopics: total,
    completedTopics: done,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

/**
 * Module (chapter) unlock rule: the first module is always unlocked; module
 * N+1 unlocks when module N is fully completed (every topic done).
 */
export async function isModuleUnlocked(
  short: string,
  moduleIndex: number,
): Promise<boolean> {
  if (moduleIndex <= 0) return true;
  const subject = getSubject(short);
  const prev = subject?.modules[moduleIndex - 1];
  if (!subject || !prev) return false;
  const p = await computeModuleProgress(subject.short, prev.num);
  return Boolean(
    p && p.totalTopics > 0 && p.completedTopics >= p.totalTopics,
  );
}

export interface SubjectAbility {
  short: string;
  name: string;
  /** 0-100. Mean over topics of 0.6 * quizBest + 0.4 * percent. */
  ability: number;
  completedTopics: number;
  totalTopics: number;
}

/**
 * Per-subject ability scores, computed from real topic data only:
 * quiz scores blended with completion percent. 0 when nothing is done yet.
 */
export async function subjectAbilities(): Promise<SubjectAbility[]> {
  const db = getDB();
  return Promise.all(
    subjects.map(async (s) => {
      const perTopic = await Promise.all(
        s.modules.flatMap((m) =>
          m.topics.map(async (t) => {
            const p = await db.getTopicProgress(s.short, m.num, t.title);
            const quiz = p?.quizBest ?? 0;
            const pct = p?.percent ?? 0;
            return {
              score: 0.6 * quiz + 0.4 * pct,
              done: p?.completed ?? pct >= 100,
            };
          }),
        ),
      );
      const n = perTopic.length;
      const ability =
        n === 0 ? 0 : Math.round(perTopic.reduce((a, b) => a + b.score, 0) / n);
      return {
        short: s.short,
        name: s.name,
        ability: Math.max(0, Math.min(100, ability)),
        completedTopics: perTopic.filter((t) => t.done).length,
        totalTopics: n,
      };
    }),
  );
}

export interface OverallStats {
  totalTopics: number;
  completedTopics: number;
  avgPercent: number;
  totalXP: number;
  streak: number;
  streakLongest: number;
}

/** Whole-syllabus roll-up for the dashboard and profile. */
export async function overallStats(): Promise<OverallStats> {
  const db = getDB();
  const progresses = await Promise.all(
    subjects.map((s) => computeSubjectProgress(s.short)),
  );
  const totalTopics = progresses.reduce(
    (n, p) => n + (p?.totalTopics ?? 0),
    0,
  );
  const completedTopics = progresses.reduce(
    (n, p) => n + (p?.completedTopics ?? 0),
    0,
  );
  const [totalXP, streak] = await Promise.all([
    db.getXP(),
    db.getStreak(),
  ]);
  return {
    totalTopics,
    completedTopics,
    avgPercent:
      totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100),
    totalXP,
    streak: streak.current,
    streakLongest: streak.longest,
  };
}

export interface ContinueTarget {
  subjectShort: string;
  subjectName: string;
  moduleNum: string;
  moduleTitle: string;
  topicTitle: string;
  percent: number;
}

/**
 * First incomplete topic, ordered by nearest upcoming exam so the learner
 * always resumes where it matters most. Null when everything is done.
 */
export async function firstIncompleteTopic(): Promise<ContinueTarget | null> {
  const db = getDB();
  const now = Date.now();
  const ordered = [...EXAMS]
    .filter((e) => new Date(e.at).getTime() > now)
    .map((e) => e.short);
  // Subjects whose exams already passed go last.
  for (const e of EXAMS) {
    if (!ordered.includes(e.short)) ordered.push(e.short);
  }

  for (const short of ordered) {
    const subject = getSubject(short);
    if (!subject) continue;
    for (const mod of subject.modules) {
      for (const topic of mod.topics) {
        const t = await topicDone(db, subject.short, mod.num, topic.title);
        if (!t.completed) {
          return {
            subjectShort: subject.short,
            subjectName: subject.name,
            moduleNum: mod.num,
            moduleTitle: mod.title,
            topicTitle: topic.title,
            percent: t.percent,
          };
        }
      }
    }
  }
  return null;
}

/** Per-topic state for the mastery map (done / in-progress / todo). */
export async function topicStates(short: string): Promise<TopicState[]> {
  const subject = getSubject(short);
  if (!subject) return [];
  const db = getDB();
  const out: TopicState[] = [];
  for (const mod of subject.modules) {
    for (const topic of mod.topics) {
      const t = await topicDone(db, subject.short, mod.num, topic.title);
      out.push({
        moduleNum: mod.num,
        moduleTitle: mod.title,
        topicTitle: topic.title,
        percent: t.percent,
        completed: t.completed,
        status: t.completed
          ? "done"
          : t.percent > 0
            ? "in-progress"
            : "todo",
      });
    }
  }
  return out;
}
