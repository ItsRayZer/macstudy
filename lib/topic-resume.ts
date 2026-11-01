// lib/topic-resume.ts
// Track last-visited phase per topic for Continue/Restart.

export type TopicPhase = "learn" | "practice" | "test" | "revise";

const key = (short: string, num: string, slug: string) =>
  `macstudy:topic-phase:${short}:${num}:${slug}`;

export function saveTopicPhase(short: string, num: string, slug: string, phase: TopicPhase) {
  try {
    localStorage.setItem(key(short, num, slug), phase);
  } catch {}
}

export function getTopicPhase(short: string, num: string, slug: string): TopicPhase | null {
  try {
    const v = localStorage.getItem(key(short, num, slug));
    if (v === "learn" || v === "practice" || v === "test" || v === "revise") return v;
  } catch {}
  return null;
}

export function clearTopicPhase(short: string, num: string, slug: string) {
  try {
    localStorage.removeItem(key(short, num, slug));
  } catch {}
}
