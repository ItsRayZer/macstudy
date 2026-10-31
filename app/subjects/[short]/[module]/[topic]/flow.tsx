// app/subjects/[short]/[module]/[topic]/flow.tsx
// Single continuous topic flow: LEARN -> PRACTICE -> TEST -> REVISE on one
// page with "Next" advancement (client).
//
// LEARN    course-style chapter: video section, structured theory (definition
//          callout, lead, key points, examples), ultra-minimal exam footnote.
// PRACTICE tap-to-reveal full-mark answers, tag pills, bookmarks.
// TEST     EXAM MODE: single pass of 4-option MCQs, no skip, no repeats.
//          Optional 30s per-question timer (thin ring), instant right/wrong
//          flash, correct option highlighted. Results: score %, XP earned
//          (IMPORTANT 10 / REPEATED 15 / SURE MARK 20), pass/fail vs 60%,
//          and a review list of misses WITH full answers.
// REVISE   ts-fsrs flashcards, card state local-only.
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
import { Inline, RichText } from "../../../../../components/rich-text";
import { useAppStore } from "../../../../../lib/store";
import {
  matchVideoSlot,
  QUIZ_PASS_SCORE,
  summarizeExamPattern,
} from "../../../../../lib/study";
import { QuizSession, xpForTag, type QuizFinal } from "../../../../../lib/quiz";
import { buildMcq, type Mcq } from "../../../../../lib/mcq";
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
  Module,
  Question,
  Subject,
  Topic,
  VideoSlot,
} from "@/src/content/types";

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

function BookmarkIcon({
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

function PlayIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <polygon points="6 3 20 12 6 21 6 3" />
    </Icon>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Icon>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </Icon>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Icon>
  );
}

function BackNavIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </Icon>
  );
}

function FlipIcon({ className }: { className?: string }) {
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
 * Renders an answer (string array) as paragraphs. Lines indented with 4
 * spaces are code and render as monospace blocks.
 */
export function AnswerBlock({ lines }: { lines: string[] }) {
  // Rich structured rendering everywhere answers appear: Practice reveal,
  // Test full-answer, flashcards, mistake review.
  return <RichText lines={lines} />;
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
 * Learn-phase video section. YouTube renders a tap-to-watch card (embeds are
 * blocked by video owners) with thumbnail, title, duration and a
 * "Watch on YouTube" button. NotebookLM renders a link-out (no embed code
 * exists). Null/empty renders an honest quiet "coming soon" row.
 * Never invents URLs.
 */
export function VideoSection({ slot }: { slot: VideoSlot | undefined }) {
  const url = slot?.videoUrl ?? null;
  const source = slot?.videoSource ?? null;

  if (url && source === "youtube") {
    const id = youtubeEmbedId(url);
    if (id) {
      const title = slot?.topicTitle ?? slot?.topicHint ?? "Video lesson";
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
            {slot?.duration ? (
              <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-0.5 text-[12px] font-semibold text-white">
                {slot.duration}
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
  | { kind: "examples"; items: string[] };

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
 * Chunk theory blocks into 2-4 pager pages: head (definition/lead) first,
 * key points in chunks, examples last. Never more than 4 pages.
 */
function paginateLearn(blocks: PointBlock[]): PointBlock[][] {
  if (blocks.length === 0) return [[]];
  const pages: PointBlock[][] = [[blocks[0]]];
  let items: string[] = [];
  let exItems: string[] = [];
  for (const b of blocks.slice(1)) {
    if (b.kind === "points") items = items.concat(b.items);
    else if (b.kind === "examples") exItems = exItems.concat(b.items);
  }
  const exPages = exItems.length > 0 ? 1 : 0;
  const pointPages = Math.max(1, 3 - exPages);
  const chunk = Math.max(4, Math.ceil(items.length / pointPages));
  for (let i = 0; i < items.length; i += chunk) {
    pages.push([{ kind: "points", items: items.slice(i, i + chunk) }]);
  }
  if (exItems.length > 0) pages.push([{ kind: "examples", items: exItems }]);
  return pages.slice(0, 4);
}

function LearnBlocks({ blocks }: { blocks: PointBlock[] }) {
  return (
    <article className="flex flex-col gap-6">
      {blocks.map((b, i) => {
        if (b.kind === "definition") {
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
              <ul className="mt-4 flex flex-col gap-4">
                {b.items.map((pt, j) => (
                  <li key={j} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--text-dim)]"
                    />
                    <p className="text-[16px] leading-[1.75] text-[var(--text-dim)]">
                      <Inline text={pt} />
                    </p>
                  </li>
                ))}
              </ul>
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
    () => paginateLearn(structurePoints(topic.points, topic.title)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subject.short, mod.num, topic.title],
  );
  const [page, setPage] = useState(0);
  const totalPages = pages.length;
  const isLast = page === totalPages - 1;

  useEffect(() => {
    onProgress(totalPages === 0 ? 1 : (page + 1) / totalPages);
  }, [page, totalPages, onProgress]);

  return (
    <section aria-label="Learn" className="flex flex-col gap-6">
      <VideoSection slot={slot} />

      <LearnBlocks blocks={pages[page] ?? []} />

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

// ---------------------------------------------------------------- PRACTICE ---

export function PracticePhase({
  short,
  num,
  topicTitle,
  topic,
  questions,
  onProgress,
  onNext,
}: {
  short: string;
  num: string;
  topicTitle: string;
  topic: Topic;
  questions: Question[];
  onProgress: (fraction: number) => void;
  onNext: () => void;
}) {
  const total = questions.length;
  const [queue, setQueue] = useState<number[]>(() =>
    questions.map((_, i) => i),
  );
  const [pos, setPos] = useState(0);
  const [round, setRound] = useState(1);
  const [repeat, setRepeat] = useState<number[]>([]);
  const [repeatTotal, setRepeatTotal] = useState(0);
  // prompt: Answer / Skip / I don't know · options: 4 choices · result: feedback
  const [step, setStep] = useState<"prompt" | "options" | "result">("prompt");
  const [mcq, setMcq] = useState<Mcq | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [showFull, setShowFull] = useState(false);
  const [finished, setFinished] = useState(false);
  const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});

  const qIdx = queue[pos];
  const q = qIdx != null ? questions[qIdx] : null;

  useEffect(() => {
    let live = true;
    getDB()
      .getBookmarks(short)
      .then((all) => {
        if (!live) return;
        const map: Record<number, boolean> = {};
        for (const b of all) {
          if (b.module === num && b.topic === topicTitle) map[b.qIndex] = true;
        }
        setBookmarked(map);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [short, num, topicTitle]);

  const reportProgress = (
    p: number,
    r: number,
    repDone: number,
    repAll: number,
  ) => {
    if (total === 0) {
      onProgress(1);
      return;
    }
    if (r === 1) onProgress(0.85 * (p / total));
    else onProgress(0.85 + 0.15 * (repAll === 0 ? 1 : repDone / repAll));
  };

  const resetStep = () => {
    setStep("prompt");
    setMcq(null);
    setPicked(null);
    setShowFull(false);
  };

  const enqueueRepeat = (idx: number) => {
    setRepeat((r) => (r.includes(idx) ? r : [...r, idx]));
  };

  const dequeueRepeat = (idx: number) => {
    setRepeat((r) => r.filter((x) => x !== idx));
  };

  const toggleBookmark = async () => {
    if (qIdx == null) return;
    try {
      const now = await getDB().toggleBookmark(short, num, topicTitle, qIdx);
      setBookmarked((m) => ({ ...m, [qIdx]: now }));
    } catch {
      // keep the UI usable when storage fails
    }
  };

  const onAnswer = () => {
    if (q == null || qIdx == null) return;
    setMcq(buildMcq(q, topic, qIdx));
    setStep("options");
  };

  const onSkip = (mark: boolean) => {
    // Skip / I don't know: queue for the repeat round. The full answer
    // appears ONLY on explicit tap.
    if (qIdx != null && mark) enqueueRepeat(qIdx);
    setPicked(null);
    setShowFull(false);
    setStep("result");
  };

  const onChoose = (oi: number) => {
    if (!mcq || picked != null || qIdx == null) return;
    setPicked(oi);
    const correct = oi === mcq.correctIndex;
    // Wrong = they need to learn it: auto-show the full answer.
    // Correct = brief success only. Skip path uses an explicit button.
    setShowFull(!correct);
    if (!correct) enqueueRepeat(qIdx);
    setStep("result");
  };

  const onNextQ = () => {
    const np = pos + 1;
    if (np < queue.length) {
      setPos(np);
      resetStep();
      reportProgress(np, round, 0, 0);
      return;
    }
    // End of this pass: repeat the mistaken/skipped ones, else finish.
    setRepeat((rep) => {
      if (rep.length > 0) {
        setQueue(rep);
        setRepeatTotal(rep.length);
        setPos(0);
        setRound((r) => r + 1);
        resetStep();
        reportProgress(0, 2, 0, rep.length);
      } else {
        setFinished(true);
        onProgress(1);
      }
      return [];
    });
  };

  if (total === 0) {
    return (
      <section aria-label="Practice" className="flex flex-col gap-4">
        <h2 className="text-[20px] font-bold text-[var(--text)]">Practice</h2>
        <p className="text-[15px] text-[var(--text-dim)]">
          No practice questions for this topic yet. Head to the quiz.
        </p>
        <NextButton label="Take the quiz" onClick={onNext} />
      </section>
    );
  }

  if (finished) {
    return (
      <section aria-label="Practice complete" className="flex flex-col gap-4">
        <GlassCard>
          <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
            Practice complete
          </p>
          <h2 className="mt-2 text-[22px] font-bold text-[var(--text)]">
            Nice, you worked through every question
          </h2>
          <p className="mt-2 text-[15px] leading-[1.7] text-[var(--text-dim)]">
            {round > 1
              ? `Including a review round for the tricky ones.`
              : `Clean pass, nothing needed a second look.`}{" "}
            Practice is safe to fail, the quiz is where you prove it.
          </p>
          <div className="mt-5">
            <NextButton label="Take the quiz" onClick={onNext} />
          </div>
        </GlassCard>
      </section>
    );
  }

  if (!q || qIdx == null) return null;

  return (
    <section aria-label="Practice" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-[var(--text)]">Practice</h2>
        <span className="text-[13px] tabular-nums text-[var(--text-dim)]">
          {round > 1
            ? `Review round · ${pos + 1} of ${queue.length}`
            : `Question ${pos + 1} of ${total}`}
        </span>
      </div>

      <GlassCard>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <TagPill tagBase={q.tagBase} years={q.years} />
          </div>
          <button
            type="button"
            onClick={toggleBookmark}
            aria-label={bookmarked[qIdx] ? "Remove bookmark" : "Bookmark question"}
            aria-pressed={Boolean(bookmarked[qIdx])}
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-2xl text-[var(--text-dim)] active:bg-[var(--track)]"
          >
            <BookmarkIcon className="h-5 w-5" filled={Boolean(bookmarked[qIdx])} />
          </button>
        </div>
        <p className="mt-3 text-[18px] font-semibold leading-[1.6] text-[var(--text)]">
          {q.q}
        </p>

        {step === "prompt" ? (
          <div className="mt-5 flex flex-col gap-2">
            <button
              type="button"
              onClick={onAnswer}
              className="cta-neon flex min-h-[52px] w-full items-center justify-center rounded-2xl text-[15px] font-bold"
            >
              Answer
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSkip(true)}
                className="flex min-h-[48px] items-center justify-center rounded-2xl bg-[var(--track)] text-[14px] font-semibold text-[var(--text-dim)] active:opacity-80"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={() => onSkip(true)}
                className="flex min-h-[48px] items-center justify-center rounded-2xl bg-[var(--track)] text-[14px] font-semibold text-[var(--text-dim)] active:opacity-80"
              >
                I don&apos;t know
              </button>
            </div>
          </div>
        ) : null}

        {step === "options" && mcq ? (
          <div
            className="mt-4 flex flex-col gap-2"
            role="radiogroup"
            aria-label="Answer options"
          >
            {mcq.options.map((opt, oi) => {
              const isCorrect = oi === mcq.correctIndex;
              const isPicked = oi === picked;
              const style =
                picked == null
                  ? "border-[var(--glass-border)] bg-[var(--glass)]"
                  : isCorrect
                    ? "border-emerald-500/60 bg-emerald-500/10"
                    : isPicked
                      ? "border-rose-500/60 bg-rose-500/10"
                      : "border-[var(--glass-border)] opacity-50";
              return (
                <button
                  key={oi}
                  type="button"
                  role="radio"
                  aria-checked={isPicked}
                  disabled={picked != null}
                  onClick={() => onChoose(oi)}
                  className={`flex min-h-[56px] w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors active:opacity-80 disabled:cursor-default ${style}`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold ${
                      picked != null && isCorrect
                        ? "bg-emerald-500 text-white"
                        : picked != null && isPicked
                          ? "bg-rose-500 text-white"
                          : "bg-[var(--track)] text-[var(--text)]"
                    }`}
                    aria-hidden="true"
                  >
                    {String.fromCharCode(65 + oi)}
                  </span>
                  <span className="text-[15px] leading-[1.6] text-[var(--text)]">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}

        {step === "result" ? (
          <>
            {picked != null && mcq && picked === mcq.correctIndex ? (
              <>
                <p className="mt-4 text-center text-[15px] font-semibold text-[var(--neon-soft)]" role="status">
                  Correct, nicely done
                </p>
                <button
                  type="button"
                  onClick={onNextQ}
                  className="cta-neon mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-bold"
                >
                  Next
                  <ArrowIcon className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                {picked != null ? (
                  <p className="mt-4 text-center text-[15px] font-semibold text-[var(--text-dim)]" role="status">
                    Not quite, the correct option is highlighted
                  </p>
                ) : null}
                {showFull ? (
                  <>
                    <div className="mt-4 rounded-2xl bg-[var(--track)] p-4">
                      <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-dim)]">
                        Full answer
                      </p>
                      <div className="mt-2">
                        <AnswerBlock lines={q.a} />
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          // "I got it": self-declared known, never penalizes.
                          if (qIdx != null) dequeueRepeat(qIdx);
                          onNextQ();
                        }}
                        className="cta-neon flex min-h-[52px] w-full items-center justify-center rounded-2xl text-[15px] font-bold"
                      >
                        I got it
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // "Skip": queue for the end-of-phase repeat round.
                          if (qIdx != null) enqueueRepeat(qIdx);
                          onNextQ();
                        }}
                        className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80"
                      >
                        Skip
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowFull(true)}
                    className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] text-[15px] font-semibold text-[var(--text)] active:opacity-80"
                  >
                    Show full answer
                  </button>
                )}
              </>
            )}
          </>
        ) : null}
      </GlassCard>
    </section>
  );
}

// -------------------------------------------------------------------- TEST ---
// EXAM MODE: single pass over all questions as 4-option MCQs. No skip, no
// repeats, no mid-test full answers. Optional 30s per-question timer shown
// as a thin ring; time-out counts as wrong. Instant right/wrong flash with
// the correct option highlighted. The last question shows a prominent
// "Finish Test" button leading to results: score %, XP earned
// (IMPORTANT 10 / REPEATED 15 / SURE MARK 20), pass/fail vs 60%, and a
// review list of misses WITH their full answers.

const EXAM_SECONDS_PER_QUESTION = 30;

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function TimerRing({ seconds, total }: { seconds: number; total: number }) {
  const r = 13;
  const c = 2 * Math.PI * r;
  const frac = Math.max(0, Math.min(1, seconds / total));
  const urgent = seconds <= 10;
  return (
    <span
      className="relative flex h-11 w-11 shrink-0 items-center justify-center"
      role="timer"
      aria-label={`${seconds} seconds left`}
    >
      <svg
        viewBox="0 0 32 32"
        className="absolute inset-0 h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="16"
          cy="16"
          r={r}
          fill="none"
          stroke="var(--track)"
          strokeWidth="3"
        />
        <circle
          cx="16"
          cy="16"
          r={r}
          fill="none"
          stroke={urgent ? "#f43f5e" : "var(--neon)"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
          style={{
            transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
          }}
        />
      </svg>
      <span
        className={`text-[11px] font-bold tabular-nums ${
          urgent ? "text-rose-400" : "text-[var(--text)]"
        }`}
      >
        {seconds}
      </span>
    </span>
  );
}

function ScoreRing({ pct, passed }: { pct: number; passed: boolean }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const frac = Math.max(0, Math.min(1, pct / 100));
  return (
    <span
      className="relative flex h-28 w-28 shrink-0 items-center justify-center"
      role="img"
      aria-label={`Score ${pct} percent${passed ? ", passed" : ", not passed"}`}
    >
      <svg
        viewBox="0 0 84 84"
        className="absolute inset-0 h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke="var(--track)"
          strokeWidth="7"
        />
        <circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke={passed ? "var(--neon)" : "#f43f5e"}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <span className="text-center">
        <span className="block text-[24px] font-bold tabular-nums text-[var(--text)]">
          {pct}%
        </span>
        <span
          className={`block text-[10px] font-bold uppercase tracking-widest ${
            passed ? "text-[var(--neon-soft)]" : "text-rose-400"
          }`}
        >
          {passed ? "Pass" : "Fail"}
        </span>
      </span>
    </span>
  );
}

export function TestPhase({
  short,
  num,
  topicTitle,
  topic,
  questions,
  onProgress,
  onNext,
}: {
  short: string;
  num: string;
  topicTitle: string;
  topic: Topic;
  questions: Question[];
  onProgress: (fraction: number) => void;
  onNext: () => void;
}) {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [final, setFinal] = useState<QuizFinal | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [timerOn, setTimerOn] = useState(true);
  const [timeLeft, setTimeLeft] = useState(EXAM_SECONDS_PER_QUESTION);
  const [flash, setFlash] = useState<{
    kind: "right" | "wrong";
    key: number;
  } | null>(null);
  // Snapshot of the last answered card so the screen never goes blank while
  // the result is being computed.
  const [lastCard, setLastCard] = useState<{
    q: Question;
    mcq: Mcq;
    qi: number;
  } | null>(null);
  const answeredRef = useRef(false);

  const mcq = useMemo(() => {
    const qq = session?.currentQuestion;
    const qi = session?.current;
    if (!session || qq == null || qi == null) return null;
    return buildMcq(qq, topic, qi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, tick]);

  const start = () => {
    if (questions.length === 0) return;
    setFinal(null);
    setPicked(null);
    setTimedOut(false);
    setFeedback(null);
    setBusy(false);
    setFinishing(false);
    setFinishError(null);
    setFlash(null);
    setLastCard(null);
    setTick(0);
    answeredRef.current = false;
    setSession(
      new QuizSession(
        questions,
        {
          subject: short,
          module: num,
          topic: topicTitle,
        },
        { examMode: true },
      ),
    );
    onProgress(0);
  };

  const doFinish = async () => {
    if (!session || finishing) return;
    setFinishing(true);
    setFinishError(null);
    try {
      const f = await session.finalize();
      setFinal(f);
    } catch {
      setFinishError(
        "Could not save your result. Check your connection and try again.",
      );
    } finally {
      setFinishing(false);
    }
    onProgress(1);
    // Keep the global XP / streak displays fresh.
    useAppStore.getState().refreshFromDB().catch(() => {});
  };

  const recordAnswer = async (oi: number | null) => {
    // oi === null means the per-question timer ran out.
    if (!session || !mcq || busy || finishing) return;
    if (answeredRef.current) return;
    answeredRef.current = true;
    const qq = session.currentQuestion;
    const qi = session.current;
    if (qq && qi != null) setLastCard({ q: qq, mcq, qi });
    setBusy(true);
    const correct = oi != null && oi === mcq.correctIndex;
    const { xp } = await session.answerOption(correct);
    setPicked(oi);
    setTimedOut(oi == null);
    setFlash({ kind: correct ? "right" : "wrong", key: Date.now() });
    setFeedback(
      oi == null
        ? "Time's up · the right answer is highlighted"
        : correct
          ? xp > 0
            ? `Correct · +${xp} XP`
            : "Correct"
          : "Wrong · the right answer is highlighted",
    );
    setBusy(false);
    onProgress(session.done ? 1 : session.progressPct / 100);
    window.setTimeout(() => setFlash(null), 700);
  };

  const choose = (oi: number) => {
    void recordAnswer(oi);
  };

  // Re-arm the answered guard whenever the question changes.
  useEffect(() => {
    answeredRef.current = false;
  }, [session, tick]);

  // Per-question countdown. Clears the moment the question is answered.
  useEffect(() => {
    if (!session || final || finishing || !timerOn) return;
    if (picked != null || timedOut) return;
    setTimeLeft(EXAM_SECONDS_PER_QUESTION);
    const iv = window.setInterval(() => {
      setTimeLeft((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    const to = window.setTimeout(() => {
      if (!answeredRef.current) void recordAnswer(null);
    }, EXAM_SECONDS_PER_QUESTION * 1000);
    return () => {
      window.clearInterval(iv);
      window.clearTimeout(to);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, tick, final, finishing, timerOn, picked, timedOut]);

  const nextQuestion = () => {
    if (!session || finishing) return;
    if (session.done) {
      void doFinish();
      return;
    }
    setPicked(null);
    setTimedOut(false);
    setFeedback(null);
    setTick((t) => t + 1);
  };

  if (questions.length === 0) {
    return (
      <section aria-label="Test" className="flex flex-col gap-4">
        <GlassCard>
          <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
            Exam mode
          </p>
          <h2 className="mt-2 text-[22px] font-bold text-[var(--text)]">
            No test questions yet
          </h2>
          <p className="mt-2 text-[15px] text-[var(--text-dim)]">
            This topic has no test questions. Move on to the flashcards.
          </p>
          <div className="mt-5">
            <NextButton label="Revise flashcards" onClick={onNext} />
          </div>
        </GlassCard>
      </section>
    );
  }

  if (final) {
    const s = final.summary;
    return (
      <section aria-label="Test results" className="flex flex-col gap-4">
        <GlassCard>
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--neon-soft)]">
            Exam complete
          </p>
          <h2 className="mt-2 text-[22px] font-bold text-[var(--text)]">
            {s.passed ? "Passed · topic complete" : "Not yet · review and retry"}
          </h2>

          <div className="mt-5 flex items-center gap-4">
            <ScoreRing pct={s.accuracy} passed={s.passed} />
            <div className="grid flex-1 grid-cols-2 gap-2 text-center">
              {[
                { v: `+${s.xpEarned}`, l: "XP earned" },
                { v: formatTime(s.seconds), l: "Time" },
              ].map((stat) => (
                <div
                  key={stat.l}
                  className="rounded-2xl bg-[var(--track)] px-2 py-3"
                >
                  <div className="text-[20px] font-bold tabular-nums text-[var(--text)]">
                    {stat.v}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-[var(--text-faint)]">
                    {stat.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-[13px] text-[var(--text-dim)]">
            {s.knownFirstTry} of {s.total} correct · pass mark{" "}
            {QUIZ_PASS_SCORE}%
          </p>

          {s.weakIndices.length > 0 ? (
            <div className="mt-5">
              <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
                Review your misses
              </p>
              <div className="mt-2 flex flex-col gap-3">
                {s.weakIndices.map((qi) => {
                  const wq = questions[qi];
                  if (!wq) return null;
                  return (
                    <div
                      key={qi}
                      className="rounded-2xl bg-[var(--track)] p-4"
                    >
                      <p className="text-[15px] font-semibold leading-[1.6] text-[var(--text)]">
                        {wq.q}
                      </p>
                      <div className="mt-3 border-t border-[var(--glass-border)] pt-3">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-faint)]">
                          Full answer
                        </p>
                        <div className="mt-2">
                          <AnswerBlock lines={wq.a} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-[15px] font-semibold text-[var(--neon-soft)]">
              Flawless run · nothing missed
            </p>
          )}

          {final.newlyUnlocked.length > 0 ? (
            <div className="mt-5">
              <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
                Achievements unlocked
              </p>
              <div className="mt-2 flex flex-col gap-2">
                {final.newlyUnlocked.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-2xl bg-[var(--track)] px-4 py-3"
                  >
                    <p className="text-[15px] font-semibold text-[var(--text)]">
                      {a.name}
                    </p>
                    <p className="text-[13px] text-[var(--text-dim)]">
                      {a.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-3">
            <button
              type="button"
              onClick={start}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80"
            >
              <RefreshIcon className="h-5 w-5" />
              Retake test
            </button>
            <NextButton label="Revise flashcards" onClick={onNext} />
          </div>
        </GlassCard>
      </section>
    );
  }

  if (!session) {
    return (
      <section aria-label="Exam mode" className="flex flex-col gap-4">
        <GlassCard>
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--neon-soft)]">
            Exam mode
          </p>
          <h2 className="mt-2 text-[22px] font-bold text-[var(--text)]">
            {questions.length} questions · one shot each
          </h2>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-[1.7] text-[var(--text-dim)]">
            <li>Pick the right option out of 4. No skipping, no repeats.</li>
            <li>
              {EXAM_SECONDS_PER_QUESTION} seconds per question — run out of
              time and it counts as wrong.
            </li>
            <li>Score {QUIZ_PASS_SCORE}% or more to pass the topic.</li>
            <li>
              XP per correct answer: SURE MARK {xpForTag("SURE MARK")} ·
              REPEATED {xpForTag("REPEATED")} · IMPORTANT{" "}
              {xpForTag("IMPORTANT")}.
            </li>
            <li>Full answers for your misses appear in the review at the end.</li>
          </ul>

          <button
            type="button"
            role="switch"
            aria-checked={timerOn}
            onClick={() => setTimerOn((v) => !v)}
            className="mt-4 flex min-h-[52px] w-full items-center justify-between rounded-2xl bg-[var(--track)] px-4 active:opacity-80"
          >
            <span className="text-[15px] font-semibold text-[var(--text)]">
              {EXAM_SECONDS_PER_QUESTION}s timer per question
            </span>
            <span
              aria-hidden="true"
              className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors ${
                timerOn ? "bg-[var(--neon)]" : "bg-[var(--glass-border)]"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  timerOn ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </span>
          </button>

          <button
            type="button"
            onClick={start}
            className="cta-neon mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-bold"
          >
            <PlayIcon className="h-5 w-5" />
            Start exam
          </button>
        </GlassCard>
      </section>
    );
  }

  // Active question. Falls back to the last answered card while the result
  // is being computed so the screen never goes blank.
  const q = session.currentQuestion ?? lastCard?.q ?? null;
  const activeMcq = mcq ?? lastCard?.mcq ?? null;
  const answered = picked != null || timedOut;
  const isLast = session.done;
  const pos = Math.min(session.roundPos, session.roundTotal);

  return (
    <section aria-label="Exam" className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--neon-soft)]">
            Exam mode
          </p>
          <p className="mt-1 text-[15px] font-bold tabular-nums text-[var(--text)]">
            Question {pos} of {session.roundTotal}
          </p>
        </div>
        {timerOn ? (
          <TimerRing seconds={timeLeft} total={EXAM_SECONDS_PER_QUESTION} />
        ) : null}
      </div>
      <ProgressBar
        value={session.done ? 100 : session.progressPct}
        className="h-1.5"
      />

      {q && activeMcq ? (
        <div className="relative">
          {flash ? (
            <div
              key={flash.key}
              aria-hidden="true"
              className={`exam-flash exam-flash-${flash.kind} pointer-events-none absolute inset-0 z-10 rounded-3xl`}
            />
          ) : null}
          <GlassCard>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <TagPill tagBase={q.tagBase} years={q.years} />
              {session.current != null ? (
                <BookmarkButton
                  key={`q-${session.current}-${tick}`}
                  target={questionBookmarkRef(
                    short,
                    num,
                    topicTitle,
                    session.current,
                  )}
                  label="question"
                />
              ) : null}
            </div>
            <p className="mt-3 text-[18px] font-semibold leading-[1.6] text-[var(--text)]">
              {q.q}
            </p>

            <div
              className="mt-4 flex flex-col gap-2"
              role="radiogroup"
              aria-label="Answer options"
            >
              {activeMcq.options.map((opt, oi) => {
                const isCorrect = oi === activeMcq.correctIndex;
                const isPicked = oi === picked;
                const style = !answered
                  ? "border-[var(--glass-border)] bg-[var(--glass)]"
                  : isCorrect
                    ? "border-emerald-500/60 bg-emerald-500/10"
                    : isPicked
                      ? "border-rose-500/60 bg-rose-500/10"
                      : "border-[var(--glass-border)] opacity-50";
                return (
                  <button
                    key={oi}
                    type="button"
                    role="radio"
                    aria-checked={isPicked}
                    disabled={answered || busy || finishing}
                    onClick={() => choose(oi)}
                    className={`flex min-h-[56px] w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors active:opacity-80 disabled:cursor-default ${style}`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold ${
                        answered && isCorrect
                          ? "bg-emerald-500 text-white"
                          : answered && isPicked
                            ? "bg-rose-500 text-white"
                            : "bg-[var(--track)] text-[var(--text)]"
                      }`}
                      aria-hidden="true"
                    >
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span className="text-[15px] leading-[1.6] text-[var(--text)]">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {answered ? (
              <>
                <p
                  className={`mt-4 text-center text-[15px] font-semibold ${
                    activeMcq && picked === activeMcq.correctIndex
                      ? "text-[var(--neon-soft)]"
                      : "text-[var(--text)]"
                  }`}
                  role="status"
                >
                  {feedback}
                </p>
                {/* Exam mode: no full answer mid-test. Misses are reviewed
                    with full answers on the results screen. */}
                {finishError ? (
                  <p
                    className="mt-3 rounded-2xl bg-rose-500/10 px-4 py-3 text-center text-[14px] font-medium text-rose-300"
                    role="alert"
                  >
                    {finishError}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={nextQuestion}
                  disabled={finishing}
                  className="cta-neon mt-4 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-bold disabled:opacity-60"
                >
                  {finishing ? (
                    <>
                      <span
                        className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black"
                        aria-hidden="true"
                      />
                      Checking your answers…
                    </>
                  ) : isLast ? (
                    <>
                      Finish Test · See Results
                      <ArrowIcon className="h-5 w-5" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowIcon className="h-5 w-5" />
                    </>
                  )}
                </button>
              </>
            ) : null}
          </GlassCard>
        </div>
      ) : null}
    </section>
  );
}

// ------------------------------------------------------------------ REVISE ---

interface FlashCard {
  key: string;
  front: string;
  frontSub: string;
  back: string[];
  tag: string;
  /** Index into the topic's questions for question-derived cards, else null. */
  qIndex: number | null;
}

export function RevisePhase({
  short,
  num,
  slug,
  topic,
  questions,
  onProgress,
}: {
  short: string;
  num: string;
  slug: string;
  topic: Topic;
  questions: Question[];
  onProgress: (fraction: number) => void;
}) {
  const [deck, setDeck] = useState<FlashCard[] | null>(null);
  const [pos, setPos] = useState(0);
  // 0 = front, 1 = preview (first 3 back lines), 2 = full back.
  const [flip, setFlip] = useState<0 | 1 | 2>(0);

  const buildDeck = () => {
    const now = new Date();
    const cards: FlashCard[] = [];
    // Every theory point becomes a recall card.
    topic.points.forEach((pt, i) => {
      cards.push({
        key: srsKey(short, num, `${slug}-pt`, i),
        front: topic.title,
        frontSub: `Key point ${i + 1} of ${topic.points.length} · recall it`,
        back: [pt],
        tag: "THEORY",
        qIndex: null,
      });
    });
    // SURE MARK and IMPORTANT questions become Q&A cards.
    questions.forEach((q, i) => {
      if (q.tagBase !== "SURE MARK" && q.tagBase !== "IMPORTANT") return;
      cards.push({
        key: srsKey(short, num, `${slug}-q`, i),
        front: q.q,
        frontSub: `${q.tagBase}${q.years ? ` · ${q.years}` : ""}`,
        back: q.a,
        tag: q.tagBase,
        qIndex: i,
      });
    });
    const entries = cards
      .map((c) => ({ ...c, card: loadCard(c.key) }))
      .filter((e) => !hasReviews(e.card) || isCardDue(e.card, now))
      .sort((a, b) => a.card.due.getTime() - b.card.due.getTime())
      .map(({ key, front, frontSub, back, tag, qIndex }) => ({
        key,
        front,
        frontSub,
        back,
        tag,
        qIndex,
      }));
    setDeck(entries);
    setPos(0);
    setFlip(0);
    onProgress(entries.length === 0 ? 1 : 0);
  };

  useEffect(buildDeck, [short, num, slug, topic, questions, onProgress]);

  useEffect(() => {
    if (deck) onProgress(deck.length === 0 ? 1 : pos / deck.length);
  }, [deck, pos, onProgress]);

  if (deck === null) {
    return (
      <GlassCard>
        <div className="h-24 animate-pulse rounded-2xl bg-[var(--track)]" />
      </GlassCard>
    );
  }

  if (deck.length === 0) {
    return (
      <EmptyState
        title="All caught up"
        subtitle="No flashcards are due for this topic right now. Come back later for spaced review."
      />
    );
  }

  if (pos >= deck.length) {
    return (
      <section aria-label="Flashcards done" className="flex flex-col gap-4">
        <GlassCard>
          <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
            Flashcards done
          </p>
          <h2 className="mt-2 text-[22px] font-bold text-[var(--text)]">
            Reviewed {deck.length} card{deck.length === 1 ? "" : "s"}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-[15px] text-[var(--text-dim)]">
            <ClockIcon className="h-4 w-4" />
            Spaced repetition keeps them coming back right on time.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPos(deck.length - 1)}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80"
            >
              <BackNavIcon className="h-5 w-5" />
              Back
            </button>
            <button
              type="button"
              onClick={buildDeck}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80"
            >
              <RefreshIcon className="h-5 w-5" />
              Check again
            </button>
          </div>
        </GlassCard>
      </section>
    );
  }

  const entry = deck[pos];

  const grade = (rating: Rating) => {
    reviewCard(entry.key, rating);
    setFlip(0);
    setPos((p) => p + 1);
  };

  const goFlip = () => setFlip((f) => ((f + 1) % 3) as 0 | 1 | 2);
  const goNext = () => {
    setFlip(0);
    setPos((p) => Math.min(p + 1, deck.length));
  };
  const goBack = () => {
    setFlip(0);
    setPos((p) => Math.max(p - 1, 0));
  };

  // Swipe left/right to move through the deck without grading.
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 48) return;
    if (dx < 0) goNext();
    else goBack();
  };

  return (
    <section aria-label="Revise" className="flex flex-col gap-4">
      <h2 className="text-[20px] font-bold text-[var(--text)]">
        Revise flashcards
      </h2>
      <div className="flex items-center justify-between text-[13px] text-[var(--text-dim)]">
        <span>
          Card {pos + 1} of {deck.length}
        </span>
        <span className="flex items-center gap-2">
          <span>{entry.tag}</span>
          {entry.qIndex != null ? (
            <BookmarkButton
              key={entry.key}
              target={questionBookmarkRef(short, num, topic.title, entry.qIndex)}
              label="question"
              className="-mr-2"
            />
          ) : null}
        </span>
      </div>

      <button
        type="button"
        onClick={goFlip}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-label={flip === 0 ? "Flip card" : "Show more of the answer"}
        className="block w-full text-left"
      >
        <GlassCard className="min-h-[220px] transition-transform active:scale-[0.99]">
          {flip === 0 ? (
            <div className="flex min-h-[188px] flex-col justify-center gap-3">
              <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
                {entry.tag === "THEORY" ? "Recall" : "Question"}
              </p>
              <p className="text-[18px] font-semibold leading-[1.6] text-[var(--text)]">
                {entry.front}
              </p>
              <p className="text-[13px] text-[var(--text-faint)]">
                {entry.frontSub} · Tap to flip
              </p>
            </div>
          ) : flip === 1 ? (
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
                Answer
              </p>
              <AnswerBlock lines={entry.back.slice(0, 3)} />
              <p className="text-[13px] font-medium text-[var(--text-faint)]">
                Tap for the full answer
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
                Full answer
              </p>
              <AnswerBlock lines={entry.back} />
            </div>
          )}
        </GlassCard>
      </button>

      {flip >= 1 ? (
        <div className="grid grid-cols-4 gap-2" role="group" aria-label="Grade this card">
          {GRADE_BUTTONS.map((g) => (
            <button
              key={g.label}
              type="button"
              onClick={() => grade(g.rating)}
              className="glass flex min-h-[52px] flex-col items-center justify-center rounded-2xl text-[15px] font-semibold text-[var(--text)] active:opacity-80"
            >
              {g.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Card navigation">
        <button
          type="button"
          onClick={goBack}
          disabled={pos === 0}
          className="flex min-h-[52px] items-center justify-center gap-1 rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80 disabled:opacity-40"
        >
          <BackNavIcon className="h-5 w-5" />
          Back
        </button>
        <button
          type="button"
          onClick={goFlip}
          className="flex min-h-[52px] items-center justify-center gap-1 rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80"
        >
          <FlipIcon className="h-5 w-5" />
          Flip
        </button>
        <button
          type="button"
          onClick={goNext}
          className="cta-neon flex min-h-[52px] items-center justify-center gap-1 rounded-2xl text-[15px] font-bold"
        >
          Next
          <ArrowIcon className="h-5 w-5" />
        </button>
      </div>
      <p className="text-center text-[12px] text-[var(--text-faint)]">
        Swipe left or right to move through the deck
      </p>
    </section>
  );
}

// --------------------------------------------------------------- next button ---

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
