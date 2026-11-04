"use client";

import { useEffect, useState } from "react";
import { getDB } from "../lib/db";

export interface UserInsight {
  /** Subject the user studies most, by topic progress entries. */
  topSubject: string | null;
  /** Last studied topic, for "continue where you left off". */
  lastTopic: {
    subject: string;
    module: string;
    topic: string;
    percent: number;
  } | null;
  /** Total topics with any progress. */
  topicsStarted: number;
  /** Total completed topics. */
  topicsCompleted: number;
}

const LAST_TOPIC_KEY = "macstudy:last-topic";

/** Remember the last opened topic so the app can resume it. */
export function rememberTopic(subject: string, module: string, topic: string) {
  try {
    window.localStorage.setItem(
      LAST_TOPIC_KEY,
      JSON.stringify({ subject, module, topic, at: Date.now() }),
    );
  } catch {}
}

/**
 * Reads the user's stored progress (their "cookies") and derives
 * personal insights: what they study most, where they left off,
 * and how far along they are. Used to personalize the home screen.
 */
export async function getUserInsights(): Promise<UserInsight> {
  const insight: UserInsight = {
    topSubject: null,
    lastTopic: null,
    topicsStarted: 0,
    topicsCompleted: 0,
  };
  try {
    if (typeof window === "undefined") return insight;
    const db = getDB();

    // Last topic from the lightweight cookie.
    try {
      const raw = window.localStorage.getItem(LAST_TOPIC_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          subject: string;
          module: string;
          topic: string;
        };
        if (parsed.subject && parsed.module && parsed.topic) {
          const tp = await db.getTopicProgress(
            parsed.subject,
            parsed.module,
            parsed.topic,
          );
          insight.lastTopic = {
            subject: parsed.subject,
            module: parsed.module,
            topic: parsed.topic,
            percent: tp?.percent ?? 0,
          };
        }
      }
    } catch {}

    // Scan localStorage topic-progress directly: fast, no per-topic queries.
    // Key shape: "macstudy:topic-progress" -> { "SUBJ::MOD::TOP": {...} }
    let all: Record<string, { percent: number; completed: boolean }> = {};
    try {
      const raw = window.localStorage.getItem("macstudy:topic-progress");
      if (raw) all = JSON.parse(raw);
    } catch {}
    const bySubject: Record<string, number> = {};
    for (const [key, tp] of Object.entries(all)) {
      if (!tp || (tp.percent <= 0 && !tp.completed)) continue;
      insight.topicsStarted++;
      if (tp.completed) insight.topicsCompleted++;
      const subject = key.split("::")[0];
      if (subject) bySubject[subject] = (bySubject[subject] ?? 0) + 1;
    }
    let best: string | null = null;
    let bestCount = 0;
    for (const [s, c] of Object.entries(bySubject)) {
      if (c > bestCount) {
        best = s;
        bestCount = c;
      }
    }
    insight.topSubject = best;
  } catch {}
  return insight;
}

/** Hook version for components. */
export function useUserInsights() {
  const [insight, setInsight] = useState<UserInsight | null>(null);
  useEffect(() => {
    let cancelled = false;
    getUserInsights().then((i) => {
      if (!cancelled) setInsight(i);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return insight;
}
