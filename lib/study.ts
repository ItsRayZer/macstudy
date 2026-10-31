// lib/study.ts
// Study-experience helpers (owned by the study/topic worker).
//
// Slug + lookup utilities for the subject / module / topic routes, video-slot
// matching, the topic unlock rule, and the quiz pass threshold.
//
// DB KEY CONVENTION: every getDB() topic call uses the topic TITLE as the
// topic key (subject short, module num, topic title), matching lib/progress.ts
// and lib/gamify.ts. The URL slug is only for routing and is reversible via
// getTopicBySlug().

import { subjects } from "@/src/content/subjects";
import { VIDEO_SLOTS } from "@/src/content/videos";
import type { Module, Topic, VideoSlot } from "@/src/content/types";
import { getDB } from "./db";

/** Quiz score (percent) needed to pass a topic and unlock the next one. */
export const QUIZ_PASS_SCORE = 60;

/**
 * Shrink a long examPattern paragraph into one ultra-minimal footnote line,
 * e.g. "70 marks · 2 hrs · 5×2 + any 5×6 + any 2×15".
 * Returns null when nothing usable can be extracted. Never invents figures:
 * everything comes from the source text, and unconfirmed patterns are
 * labeled as such.
 */
export function summarizeExamPattern(raw: string | null): string | null {
  if (!raw) return null;
  const text = raw.replace(/\s+/g, " ").trim();
  const marks = text.match(/(\d+)\s*marks/i)?.[1] ?? null;

  let hours: string | null = null;
  if (/1\s*hour\s*30\s*minutes/i.test(text)) {
    hours = "1.5 hrs";
  } else {
    const hMatch = text.match(/(\d+(?:\.\d+)?)\s*hours?/i);
    if (hMatch) {
      const h = parseFloat(hMatch[1]);
      hours = `${h} hr${h === 1 ? "" : "s"}`;
    }
  }

  const parts: string[] = [];
  for (const m of text.matchAll(/part\s+([abc])\s*:\s*([^.;]+)/gi)) {
    const body = m[2];
    const nx =
      body.match(/(\d+)\s*[x×]\s*(\d+)/i) ??
      body.match(/(\d+)\s+of\s+(\d+)[-\s]?mark/i);
    if (!nx) continue;
    // "answer any 3 of 5" + "5 x 5 marks" -> "any 3×5".
    const anyN = body.match(/answer any\s+(\d+)/i)?.[1];
    if (anyN) parts.push(`any ${anyN}×${nx[2]}`);
    else parts.push(`${/any\s+\d+/i.test(body) ? "any " : ""}${nx[1]}×${nx[2]}`);
  }

  const segs = [
    marks ? `${marks} marks` : null,
    hours,
    parts.length > 0 ? parts.join(" + ") : null,
  ].filter((s): s is string => s !== null);
  if (segs.length === 0) return null;
  const prefix = /pattern is unknown/i.test(text)
    ? "Pattern unconfirmed · "
    : "";
  return prefix + segs.join(" · ");
}

/** Lowercase, non-alphanumerics become "-", trimmed. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function topicSlug(topic: Topic): string {
  return slugify(topic.title);
}

export function getSubjectLocal(short: string) {
  const s = short.trim().toUpperCase();
  return subjects.find((x) => x.short.toUpperCase() === s);
}

export function getModuleLocal(
  subject: { modules: Module[] },
  num: string,
): Module | undefined {
  return subject.modules.find((m) => m.num === num);
}

/** Reversible slug lookup: the first topic whose slugified title matches. */
export function getTopicBySlug(
  module: Module,
  slug: string,
): Topic | undefined {
  return module.topics.find((t) => topicSlug(t) === slug);
}

export function topicHref(
  short: string,
  moduleNum: string,
  topic: Topic,
): string {
  return `/subjects/${short}/${moduleNum}/${topicSlug(topic)}`;
}

// -------------------------------------------------------------- video slot ---

const STOP_WORDS = new Set([
  "and",
  "are",
  "for",
  "from",
  "its",
  "the",
  "with",
  "your",
]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
}

/**
 * Match a VIDEO_SLOTS entry by subject + module + significant word overlap
 * between the slot's topicHint and the topic title. Returns the slot metadata
 * as-is; youtubeId is null for every slot right now, so callers must render
 * an honest "coming soon" placeholder and never invent a video ID.
 */
export function matchVideoSlot(
  short: string,
  moduleNum: string,
  topic: Topic,
): VideoSlot | undefined {
  const titleTokens = new Set(tokens(topic.title));
  return VIDEO_SLOTS.find((v) => {
    if (v.subject !== short || v.module !== moduleNum) return false;
    const hint = v.topicHint.toLowerCase();
    return (
      tokens(v.topicHint).some((w) => titleTokens.has(w)) ||
      [...titleTokens].some((w) => hint.includes(w))
    );
  });
}

// -------------------------------------------------------------- unlock rule ---

/**
 * Unlock rule: the module's first topic is always unlocked. Topic N+1 is
 * unlocked when topic N is completed or its quiz was passed (>= 60).
 */
export async function isTopicUnlocked(
  short: string,
  module: Module,
  index: number,
): Promise<boolean> {
  if (index <= 0) return true;
  const prev = module.topics[index - 1];
  const p = await getDB().getTopicProgress(short, module.num, prev.title);
  return Boolean(p && (p.completed || p.quizBest >= QUIZ_PASS_SCORE));
}
