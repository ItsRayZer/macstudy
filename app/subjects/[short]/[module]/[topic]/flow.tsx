// app/subjects/[short]/[module]/[topic]/flow.tsx
// Topic flow shared module: icons, answer view, tag pills, exam footnote,
// the smart YouTube video section, Learn-phase course structure, LearnPhase,
// PyqOnlyToggle, and NextButton.
//
// PRACTICE / TEST / REVISE live in ./phases/ and are lazy-loaded by their
// pages via next/dynamic so Learn paints fast and the initial bundle stays
// lean.
//
// LEARN    course-style chapter: video section, structured theory (definition
//          callout, lead, key points, examples), ultra-minimal exam footnote.
//          Finishing Learn persists a 25% milestone for the topic.
// PRACTICE typed answers in the learner's own words (QT: stepped working pad
//          or table pad; Python programs: code pad with in-browser run),
//          auto-graded against key terms from the model answer, tap-to-reveal
//          full-mark answers, tag pills, bookmarks. Queue: SURE MARK first,
//          then REPEATED, then IMPORTANT, filler last; "PYQ only" toggle
//          limits the session to tagged questions. Wrong/skipped repeat at
//          the end. Finishing Practice persists a 50% milestone.
// TEST     EXAM MODE: single pass of 4-option MCQs, no skip, no repeats.
//          Optional 30s per-question timer (thin ring), instant right/wrong
//          flash, correct option highlighted. Same PYQ priority queue as
//          Practice. Results: score %, XP earned (IMPORTANT 10 / REPEATED 15
//          / SURE MARK 20), pass/fail vs 60%, and a review list of misses
//          WITH full answers. Passing persists 100% + completed.
// REVISE   ts-fsrs flashcards, card state local-only. Reviewing the deck
//          persists a 75% milestone.
//
// Monochrome AMOLED theme, big readable type, zero emojis.

"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  EmptyState,
  GlassCard,
  Pill,
  ProgressBar,
} from "../../../../../components/ui";
import { getDB } from "../../../../../lib/db";
import {
  BookmarkButton,
  questionBookmarkRef,
} from "../../../../../components/bookmarks";
import Link from "next/link";
import {
  Inline,
  RichText,
  looksLikeFormula,
} from "../../../../../components/rich-text";
import { getModuleFormulas } from "@/src/content/formulas";
import { FormulaCard } from "../../../../../components/formula-card";
import { useAppStore } from "../../../../../lib/store";
import {
  matchVideoSlot,
  QUIZ_PASS_SCORE,
  summarizeExamPattern,
} from "../../../../../lib/study";
import { markPhaseProgress } from "../../../../../lib/progress";
import { QuizSession, xpForTag, type QuizFinal } from "../../../../../lib/quiz";
import { buildMcq, type Mcq } from "../../../../../lib/mcq";
import {
  extractKeyTerms,
  gradeAnswer,
  gradeScore,
  type GradedTerm,
} from "../../../../../lib/grade";
import {
  GRADE_BUTTONS,
  Rating,
  hasReviews,
  isCardDue,
  loadCard,
  reviewCard,
  srsKey,
} from "../../../../../lib/srs";
import type {
  FigureSpec,
  Module,
  Question,
  Subject,
  Topic,
  VideoSlot,
} from "@/src/content/types";
import { Figure } from "@/components/figure";

// ------------------------------------------------------------------- icons ---

function Icon({
  children,
  className = "h-6 w-6",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </Icon>
  );
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </Icon>
  );
}

export function BookmarkIcon({
  className,
  filled,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <Icon className={className}>
      <path
        d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"
        fill={filled ? "currentColor" : "none"}
      />
    </Icon>
  );
}

export function PlayIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <polygon points="6 3 20 12 6 21 6 3" />
    </Icon>
  );
}

export function ClockIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Icon>
  );
}

export function RefreshIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </Icon>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Icon>
  );
}

export function BackNavIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </Icon>
  );
}

export function FlipIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
      <path d="M21 3v5h-5" />
    </Icon>
  );
}

// -------------------------------------------------------------- answer view ---

/**
 * Renders an answer (string array) in the study-friendly format: ONLY the
 * first line (the main full-mark answer) shows, rendered BOLD (the bold
 * styling alone carries it, no label).
 *
 * mode="collapsed" (default): a small subtle "Show full explanation" button
 * below toggles the remaining lines (normal weight) open or closed. Used in
 * Practice, Test, flashcards, and mistake review.
 * mode="full": the full detailed explanation renders directly below the
 * bold main answer, always visible, no button. Used in Learn theory
 * deep-dive Q&A blocks.
 *
 * Single-line answers render bold with no button in both modes.
 */
export function AnswerBlock({
  lines,
  mode = "collapsed",
  figure,
}: {
  lines: string[];
  mode?: "full" | "collapsed";
  figure?: FigureSpec;
}) {
  const [open, setOpen] = useState(false);
  const firstIdx = lines.findIndex((l) => l.trim().length > 0);
  if (firstIdx === -1) return null;
  const main = [lines[firstIdx]];
  const rest = lines.slice(firstIdx + 1).filter((l) => l.trim().length > 0);
  const mainView = (
    <div className="font-semibold text-[var(--text)]">
      <RichText lines={main} />
    </div>
  );
  const figureView = figure ? (
    <div className="mt-3">
      <Figure spec={figure} />
    </div>
  ) : null;
  if (rest.length === 0)
    return (
      <>
        {mainView}
        {figureView}
      </>
    );
  if (mode === "full") {
    return (
      <div className="flex flex-col gap-3">
        {mainView}
        <RichText lines={rest} />
        {figureView}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {mainView}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="self-start rounded-full border border-[var(--neon)]/30 px-3 py-1.5 text-[12px] font-medium text-[var(--neon)] transition-colors active:scale-95"
        aria-expanded={open}
      >
        {open ? "Hide explanation" : "Show full explanation"}
      </button>
      {open && (
        <>
          <RichText lines={rest} />
          {figureView}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- tag pill ---

const TAG_VARIANT: Record<Question["tagBase"], "sure" | "repeated" | "important"> = {
  "SURE MARK": "sure",
  REPEATED: "repeated",
  IMPORTANT: "important",
};

export function TagPill({
  tagBase,
  years,
}: {
  tagBase: Question["tagBase"];
  years: string | null;
}) {
  return (
    <Pill variant={TAG_VARIANT[tagBase] ?? "important"}>
      {tagBase}
      {years ? ` · ${years}` : ""}
    </Pill>
  );
}

// ------------------------------------------------------------- exam footnote ---

/** Ultra-minimal exam pattern: a tiny label + one clean line, like a footnote. */
export function ExamFootnote({ pattern }: { pattern: string | null }) {
  const line = summarizeExamPattern(pattern);
  if (!line) return null;
  return (
    <p className="text-[12px] leading-relaxed text-[var(--text-faint)]">
      <span className="font-semibold uppercase tracking-widest">
        Exam pattern
      </span>
      <span className="mx-2" aria-hidden="true">
        ·
      </span>
      {line}
    </p>
  );
}

// ------------------------------------------------------------ video section ---

function youtubeEmbedId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i,
  );
  return m?.[1] ?? null;
}

/**
 * Smart YouTube player: tries the in-app iframe embed first (fullscreen
 * allowed). When the video owner disabled embedding, the player API reports
 * an error and we automatically swap to the tap-to-watch card. A load
 * timeout also falls back to the card, so a dead iframe never stays on
 * screen. Never invents URLs.
 */
function SmartYoutube({
  id,
  url,
  title,
  duration,
}: {
  id: string;
  url: string;
  title: string;
  duration: string | null;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let player: { destroy?: () => void } | null = null;
    const timer = setTimeout(() => {
      if (!cancelled && !ready) setBlocked(true);
    }, 9000);

    const mount = () => {
      if (cancelled || !mountRef.current) return;
      const YT = (window as unknown as { YT?: any }).YT;
      if (!YT?.Player) {
        setBlocked(true);
        return;
      }
      try {
        player = new YT.Player(mountRef.current, {
          videoId: id,
          playerVars: { rel: 0, modestbranding: 1 },
          events: {
            onReady: () => {
              if (!cancelled) {
                clearTimeout(timer);
                setReady(true);
              }
            },
            onError: () => {
              if (!cancelled) {
                clearTimeout(timer);
                setBlocked(true);
              }
            },
          },
        });
      } catch {
        if (!cancelled) {
          clearTimeout(timer);
          setBlocked(true);
        }
      }
    };

    const w = window as unknown as {
      YT?: any;
      onYouTubeIframeAPIReady?: () => void;
    };
    if (w.YT?.Player) {
      mount();
    } else {
      const prev = w.onYouTubeIframeAPIReady;
      w.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        mount();
      };
      if (!document.querySelector("script[data-yt-iframe-api]")) {
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        s.dataset.ytIframeApi = "1";
        s.onerror = () => {
          if (!cancelled) {
            clearTimeout(timer);
            setBlocked(true);
          }
        };
        document.head.appendChild(s);
      }
    }
    return () => {
      cancelled = true;
      clearTimeout(timer);
      try {
        player?.destroy?.();
      } catch {
        // player teardown is best-effort
      }
    };
  }, [id, ready]);

  if (blocked) {
    return <YoutubeTapCard url={url} id={id} title={title} duration={duration} />;
  }

  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="relative aspect-video w-full bg-black">
        {!ready ? (
          <div className="absolute inset-0 animate-pulse bg-[var(--track)]" />
        ) : null}
        <div ref={mountRef} className="absolute inset-0 h-full w-full" />
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <p className="min-w-0 flex-1 truncate text-[15px] font-semibold text-[var(--text)]">
          {title}
        </p>
        {duration ? (
          <span className="shrink-0 rounded-md bg-[var(--track)] px-2 py-0.5 text-[12px] font-semibold tabular-nums text-[var(--text-dim)]">
            {duration}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** Tap-to-watch fallback card (used when embedding is blocked). */
function YoutubeTapCard({
  url,
  id,
  title,
  duration,
}: {
  url: string;
  id: string;
  title: string;
  duration: string | null;
}) {
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video w-full bg-black"
        aria-label={`Watch video: ${title}, opens in YouTube`}
      >
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--neon)] text-black shadow-[0_8px_30px_rgba(57,255,20,0.35)] transition-transform active:scale-95">
            <PlayIcon className="ml-0.5 h-6 w-6" />
          </span>
        </span>
        {duration ? (
          <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-0.5 text-[12px] font-semibold text-white">
            {duration}
          </span>
        ) : null}
      </a>
      <div className="flex items-center justify-between gap-3 p-4">
        <p className="min-w-0 flex-1 truncate text-[15px] font-semibold text-[var(--text)]">
          {title}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-2xl bg-[var(--neon)] px-5 text-[14px] font-bold text-black active:opacity-80"
        >
          Watch on YouTube
          <ExternalIcon className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

/**
 * Learn-phase video section. YouTube renders the smart player (in-app embed
 * with automatic fallback to a tap-to-watch card when the owner blocks
 * embedding). NotebookLM renders a link-out (no embed code exists).
 * Null/empty renders an honest quiet "coming soon" row. Never invents URLs.
 */
export function VideoSection({ slot }: { slot: VideoSlot | undefined }) {
  const url = slot?.videoUrl ?? null;
  const source = slot?.videoSource ?? null;

  if (url && source === "youtube") {
    const id = youtubeEmbedId(url);
    if (id) {
      const title = slot?.topicTitle ?? slot?.topicHint ?? "Video lesson";
      return (
        <SmartYoutube
          id={id}
          url={url}
          title={title}
          duration={slot?.duration ?? null}
        />
      );
    }
  }

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="glass flex min-h-[64px] items-center gap-4 rounded-3xl p-4 active:opacity-80"
        aria-label={`Watch video overview${source === "notebooklm" ? ", opens in NotebookLM" : ""}`}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--text)] text-[var(--bg)]">
          <PlayIcon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[16px] font-semibold text-[var(--text)]">
            Watch video overview
          </span>
          <span className="block truncate text-[13px] text-[var(--text-dim)]">
            {source === "notebooklm" ? "Opens in NotebookLM" : "Opens in YouTube"}
          </span>
        </span>
        <ExternalIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl px-1 py-2">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--track)] text-[var(--text-dim)]">
        <VideoIcon className="h-5 w-5" />
      </span>
      <p className="text-[13px] text-[var(--text-faint)]">
        Video coming soon
        {slot?.topicHint ? ` · ${slot.topicHint}` : ""}
      </p>
    </div>
  );
}

// ------------------------------------------------------- learn: structure ---

type PointBlock =
  | { kind: "definition"; text: string }
  | { kind: "lead"; text: string }
  | { kind: "points"; items: string[] }
  | { kind: "examples"; items: string[] }
  | { kind: "figures"; figures: FigureSpec[] }
  | { kind: "qa"; q: string; a: string[]; tagBase: Question["tagBase"]; years: string | null };

/**
 * Group raw points into headed course sections. Conservative heuristics only;
 * nothing is invented, points are only regrouped and relabeled.
 */
function structurePoints(points: string[], topicTitle: string): PointBlock[] {
  if (points.length === 0) return [];
  const firstWord = topicTitle
    .split(/[^a-zA-Z]+/)
    .filter((w) => w.length > 3)[0]
    ?.toLowerCase();
  const [first, ...rest] = points;
  const blocks: PointBlock[] = [];
  const isDef =
    /is defined as|refers to/i.test(first) ||
    (first.length <= 220 &&
      firstWord != null &&
      first.toLowerCase().startsWith(firstWord) &&
      new RegExp(`\\b${firstWord}\\b[^.]{0,80}\\b(is|are)\\b`, "i").test(first));
  blocks.push(
    isDef
      ? { kind: "definition", text: first }
      : { kind: "lead", text: first },
  );
  const keyPts: string[] = [];
  const examples: string[] = [];
  for (const p of rest) {
    if (/(^|[\s(])(for example|e\.g\.|example:)/i.test(p)) examples.push(p);
    else keyPts.push(p);
  }
  if (keyPts.length > 0) blocks.push({ kind: "points", items: keyPts });
  if (examples.length > 0) blocks.push({ kind: "examples", items: examples });
  return blocks;
}

/**
 * Chunk theory blocks into pager pages: head (definition/lead) first,
 * key points in chunks, examples next, then deep-dive Q&A (2 per page so
 * full-mark answers stay readable). Caps at 8 pages.
 */
function paginateLearn(blocks: PointBlock[]): PointBlock[][] {
  if (blocks.length === 0) return [[]];
  const pages: PointBlock[][] = [[blocks[0]]];
  let items: string[] = [];
  let exItems: string[] = [];
  const figBlocks: PointBlock[] = [];
  const qaBlocks: PointBlock[] = [];
  for (const b of blocks.slice(1)) {
    if (b.kind === "points") items = items.concat(b.items);
    else if (b.kind === "examples") exItems = exItems.concat(b.items);
    else if (b.kind === "figures") figBlocks.push(b);
    else if (b.kind === "qa") qaBlocks.push(b);
  }
  const exPages = exItems.length > 0 ? 1 : 0;
  const pointPages = Math.max(1, 3 - exPages);
  const chunk = Math.max(4, Math.ceil(items.length / pointPages));
  for (let i = 0; i < items.length; i += chunk) {
    pages.push([{ kind: "points", items: items.slice(i, i + chunk) }]);
  }
  if (exItems.length > 0) pages.push([{ kind: "examples", items: exItems }]);
  if (figBlocks.length > 0) pages.push(figBlocks);
  for (let i = 0; i < qaBlocks.length; i += 2) {
    pages.push(qaBlocks.slice(i, i + 2));
  }
  return pages.slice(0, 8);
}

/**
 * Full theory for a topic: structured points plus a deep-dive Q&A section
 * built from the topic's own exam questions and their full-mark answers.
 * Only existing repo data is used - nothing is invented. This guarantees
 * every practice/test question is answerable from the Learn theory.
 */
function structureLearn(topic: Topic): PointBlock[] {
  const blocks = structurePoints(topic.points, topic.title);
  if (topic.figures && topic.figures.length > 0) {
    blocks.push({ kind: "figures", figures: topic.figures });
  }
  for (const q of topic.questions) {
    blocks.push({ kind: "qa", q: q.q, a: q.a, tagBase: q.tagBase, years: q.years });
  }
  return blocks;
}

/**
 * A theory line that is a pure formula or equation: full-width monospace
 * block with horizontal scroll so it renders completely and never
 * truncates, plus a subtle link to the module's formula chart.
 */
function TheoryFormula({
  text,
  formulaHref,
}: {
  text: string;
  formulaHref: string | null;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FormulaCard formula={text} />
      {formulaHref ? (
        <Link
          href={formulaHref}
          className="self-end text-[12px] font-medium text-[var(--text-faint)] underline decoration-[var(--glass-border)] underline-offset-2 active:opacity-80"
        >
          Formula chart
        </Link>
      ) : null}
    </div>
  );
}

function LearnBlocks({
  blocks,
  formulaHref,
}: {
  blocks: PointBlock[];
  formulaHref: string | null;
}) {
  const firstQa = blocks.findIndex((b) => b.kind === "qa");
  return (
    <article className="flex flex-col gap-6">
      {blocks.map((b, i) => {
        if (b.kind === "figures") {
          return (
            <div key={i} className="flex flex-col gap-4">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-dim)]">
                Figures
              </p>
              {b.figures.map((f, j) => (
                <Figure key={j} spec={f} />
              ))}
            </div>
          );
        }
        if (b.kind === "qa") {
          return (
            <div key={i}>
              {i === firstQa ? (
                <>
                  <h2 className="text-[20px] font-bold text-[var(--text)]">
                    Deep dive
                  </h2>
                  <p className="mt-1 text-[13px] text-[var(--text-faint)]">
                    Straight from exam questions
                  </p>
                </>
              ) : null}
              <div className="mt-4 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass)] p-5">
                <div className="flex flex-wrap gap-2">
                  <TagPill tagBase={b.tagBase} years={b.years} />
                </div>
                <p className="mt-3 text-[16px] font-semibold leading-[1.6] text-[var(--text)]">
                  {b.q}
                </p>
                <div className="mt-3">
                  <AnswerBlock lines={b.a} mode="full" />
                </div>
              </div>
            </div>
          );
        }
        if (b.kind === "definition") {
          if (looksLikeFormula(b.text)) {
            return (
              <TheoryFormula key={i} text={b.text} formulaHref={formulaHref} />
            );
          }
          return (
            <div
              key={i}
              className="rounded-3xl border border-[var(--glass-border)] bg-[var(--glass)] p-5"
            >
              <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-dim)]">
                Definition
              </p>
              <p className="mt-2 text-[18px] font-medium leading-[1.7] text-[var(--text)]">
                <Inline text={b.text} />
              </p>
            </div>
          );
        }
        if (b.kind === "lead") {
          if (looksLikeFormula(b.text)) {
            return (
              <TheoryFormula key={i} text={b.text} formulaHref={formulaHref} />
            );
          }
          return (
            <p key={i} className="text-[18px] leading-[1.75] text-[var(--text)]">
              {b.text}
            </p>
          );
        }
        if (b.kind === "points") {
          return (
            <div key={i}>
              <h2 className="text-[20px] font-bold text-[var(--text)]">
                Key points
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {b.items.map((pt, j) =>
                  looksLikeFormula(pt) ? (
                    <TheoryFormula
                      key={j}
                      text={pt}
                      formulaHref={formulaHref}
                    />
                  ) : (
                    <div key={j} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--text-dim)]"
                      />
                      <p className="text-[16px] leading-[1.75] text-[var(--text-dim)]">
                        <Inline text={pt} />
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          );
        }
        return (
          <div key={i}>
            <h2 className="text-[20px] font-bold text-[var(--text)]">Examples</h2>
            <div className="mt-4 flex flex-col gap-3">
              {b.items.map((pt, j) => (
                <div key={j} className="rounded-2xl bg-[var(--track)] p-4">
                  <p className="text-[16px] leading-[1.75] text-[var(--text-dim)]">
                    <Inline text={pt} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {blocks.length === 0 ? (
        <p className="text-[16px] leading-[1.75] text-[var(--text-dim)]">
          Work through the practice questions below, they cover this topic end
          to end.
        </p>
      ) : null}
    </article>
  );
}

export function LearnPhase({
  subject,
  mod,
  topic,
  onProgress,
  onNext,
}: {
  subject: Subject;
  mod: Module;
  topic: Topic;
  onProgress: (fraction: number) => void;
  onNext: () => void;
}) {
  const slot = matchVideoSlot(subject.short, mod.num, topic);
  const pattern = mod.examPattern ?? subject.examPattern;
  const pages = useMemo(
    () => paginateLearn(structureLearn(topic)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subject.short, mod.num, topic.title],
  );
  const [page, setPage] = useState(0);
  const totalPages = pages.length;
  const isLast = page === totalPages - 1;

  useEffect(() => {
    onProgress(totalPages === 0 ? 1 : (page + 1) / totalPages);
  }, [page, totalPages, onProgress]);

  // New page = new content: bring the user back to the top, instantly
  // (CSS smooth-scroll stays for the rest of the app).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [page]);

  // Reaching the last Learn page counts as finishing Learn: persist the 25%
  // milestone so progress survives a reload. Never downgrades.
  const learnSaved = useRef(false);
  useEffect(() => {
    if (isLast && !learnSaved.current) {
      learnSaved.current = true;
      markPhaseProgress(subject.short, mod.num, topic.title, 25).catch(
        () => {},
      );
    }
  }, [isLast, subject.short, mod.num, topic.title]);

  return (
    <section aria-label="Learn" className="flex flex-col gap-6">
      <VideoSection slot={slot} />

      <LearnBlocks
        blocks={pages[page] ?? []}
        formulaHref={
          getModuleFormulas(subject.short, mod.num)
            ? `/subjects/${subject.short}/${mod.num}/formulas`
            : null
        }
      />

      {isLast ? <ExamFootnote pattern={pattern} /> : null}

      <div className="flex items-center justify-between gap-3">
        {page > 0 ? (
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="flex min-h-[52px] items-center rounded-2xl bg-[var(--track)] px-6 text-[15px] font-semibold text-[var(--text)] active:opacity-80"
          >
            Back
          </button>
        ) : (
          <span className="text-[13px] tabular-nums text-[var(--text-faint)]">
            Part 1 of {totalPages}
          </span>
        )}
        {page > 0 ? (
          <span className="text-[13px] tabular-nums text-[var(--text-faint)]">
            Part {page + 1} of {totalPages}
          </span>
        ) : null}
      </div>

      {isLast ? (
        <NextButton
          label={`Practice · ${topic.questions.length} questions`}
          onClick={onNext}
        />
      ) : (
        <NextButton label="Next" onClick={() => setPage((p) => p + 1)} />
      )}
    </section>
  );
}

// --------------------------------------------------------------- next button ---

/**
 * Small "PYQ only" switch for Practice/Test intros. When on, the session is
 * limited to tagged questions (SURE MARK / REPEATED / IMPORTANT); when off,
 * tagged questions still come first and untagged filler goes last.
 */
export function PyqOnlyToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label="PYQ only: limit the session to tagged questions"
      onClick={() => onChange(!value)}
      className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full bg-[var(--track)] px-4 text-[13px] font-semibold text-[var(--text-dim)] active:opacity-80"
    >
      <span
        aria-hidden="true"
        className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          value ? "bg-[var(--neon)]" : "bg-[var(--glass-border)]"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
      PYQ only
    </button>
  );
}

export function NextButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cta-neon flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-bold"
    >
      {label}
      <ArrowIcon className="h-5 w-5" />
    </button>
  );
}
