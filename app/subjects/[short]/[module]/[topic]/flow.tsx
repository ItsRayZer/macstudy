// app/subjects/[short]/[module]/[topic]/flow.tsx
// Single continuous topic flow: LEARN -> PRACTICE -> TEST -> REVISE on one
// page with "Next" advancement (client).
//
// LEARN    course-style chapter: video section, structured theory (definition
//          callout, lead, key points, examples), ultra-minimal exam footnote.
// PRACTICE tap-to-reveal full-mark answers, tag pills, bookmarks.
// TEST     QuizSession self-check: one question at a time, reveal, mark
//          right/wrong, full answer, Next. Wrong ones repeat at the end and
//          land in the mistake deck. XP: IMPORTANT 10, REPEATED 15, SURE 20.
// REVISE   ts-fsrs flashcards, card state local-only.
//
// Monochrome AMOLED theme, big readable type, zero emojis.

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  EmptyState,
  GlassCard,
  Pill,
  ProgressBar,
} from "../../../../../components/ui";
import { getDB } from "../../../../../lib/db";
import { useAppStore } from "../../../../../lib/store";
import {
  matchVideoSlot,
  QUIZ_PASS_SCORE,
  summarizeExamPattern,
} from "../../../../../lib/study";
import { QuizSession, xpForTag, type QuizFinal } from "../../../../../lib/quiz";
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

// -------------------------------------------------------------- answer view ---

/**
 * Renders an answer (string array) as paragraphs. Lines indented with 4
 * spaces are code and render as monospace blocks.
 */
export function AnswerBlock({ lines }: { lines: string[] }) {
  const blocks: { code: boolean; text: string[] }[] = [];
  for (const line of lines) {
    const code = line.startsWith("    ");
    const text = code ? line.slice(4) : line;
    const last = blocks[blocks.length - 1];
    if (last && last.code === code) last.text.push(text);
    else blocks.push({ code, text: [text] });
  }
  return (
    <div className="flex flex-col gap-3">
      {blocks.map((b, i) =>
        b.code ? (
          <pre
            key={i}
            className="overflow-x-auto rounded-2xl bg-[var(--track)] p-4 font-mono text-[14px] leading-relaxed text-[var(--text)]"
          >
            {b.text.join("\n")}
          </pre>
        ) : (
          b.text.map((t, j) => (
            <p
              key={`${i}-${j}`}
              className="text-[16px] leading-[1.75] text-[var(--text-dim)]"
            >
              {t}
            </p>
          ))
        ),
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
 * Learn-phase video section. Supports YouTube embeds and NotebookLM
 * link-outs (NotebookLM offers no embed code). Null/empty renders an honest
 * quiet "coming soon" row. Never invents URLs.
 */
export function VideoSection({ slot }: { slot: VideoSlot | undefined }) {
  const url = slot?.videoUrl ?? null;
  const source = slot?.videoSource ?? null;

  if (url && source === "youtube") {
    const id = youtubeEmbedId(url);
    if (id) {
      return (
        <div className="overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-black">
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}`}
              title="Topic video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
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

// ------------------------------------------------------------------- LEARN ---

export function LearnPhase({
  subject,
  mod,
  topic,
  onNext,
}: {
  subject: Subject;
  mod: Module;
  topic: Topic;
  onNext: () => void;
}) {
  const slot = matchVideoSlot(subject.short, mod.num, topic);
  const pattern = mod.examPattern ?? subject.examPattern;
  const blocks = structurePoints(topic.points, topic.title);

  return (
    <section aria-label="Learn" className="flex flex-col gap-6">
      <VideoSection slot={slot} />

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
                  {b.text}
                </p>
              </div>
            );
          }
          if (b.kind === "lead") {
            return (
              <p
                key={i}
                className="text-[18px] leading-[1.75] text-[var(--text)]"
              >
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
                        {pt}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }
          return (
            <div key={i}>
              <h2 className="text-[20px] font-bold text-[var(--text)]">
                Examples
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {b.items.map((pt, j) => (
                  <div
                    key={j}
                    className="rounded-2xl bg-[var(--track)] p-4"
                  >
                    <p className="text-[16px] leading-[1.75] text-[var(--text-dim)]">
                      {pt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {blocks.length === 0 ? (
          <p className="text-[16px] leading-[1.75] text-[var(--text-dim)]">
            Work through the practice questions below, they cover this topic
            end to end.
          </p>
        ) : null}
      </article>

      <ExamFootnote pattern={pattern} />

      <NextButton label={`Practice · ${topic.questions.length} questions`} onClick={onNext} />
    </section>
  );
}

// ---------------------------------------------------------------- PRACTICE ---

export function PracticePhase({
  short,
  num,
  topicTitle,
  questions,
  onProgress,
  onNext,
}: {
  short: string;
  num: string;
  topicTitle: string;
  questions: Question[];
  onProgress: (fraction: number) => void;
  onNext: () => void;
}) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});
  const [wrongNote, setWrongNote] = useState<number | null>(null);

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

  useEffect(() => {
    const count = Object.values(revealed).filter(Boolean).length;
    onProgress(questions.length === 0 ? 1 : count / questions.length);
  }, [revealed, questions.length, onProgress]);

  const toggleReveal = (i: number) =>
    setRevealed((r) => ({ ...r, [i]: !r[i] }));

  const toggleBookmark = async (i: number) => {
    try {
      const now = await getDB().toggleBookmark(short, num, topicTitle, i);
      setBookmarked((m) => ({ ...m, [i]: now }));
    } catch {
      // keep the UI usable when storage fails
    }
  };

  const markWrong = async (i: number) => {
    try {
      await getDB().addMistake(short, num, topicTitle, i);
      setWrongNote(i);
      window.setTimeout(() => {
        setWrongNote((n) => (n === i ? null : n));
      }, 2000);
    } catch {
      // keep the UI usable when storage fails
    }
  };

  return (
    <section aria-label="Practice" className="flex flex-col gap-4">
      <h2 className="text-[20px] font-bold text-[var(--text)]">
        Practice questions
      </h2>
      {questions.map((q, i) => (
        <GlassCard key={i}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-[17px] font-semibold leading-[1.6] text-[var(--text)]">
              <span className="text-[var(--text-faint)]">Q{i + 1}. </span>
              {q.q}
            </p>
            <button
              type="button"
              onClick={() => toggleBookmark(i)}
              aria-label={bookmarked[i] ? "Remove bookmark" : "Bookmark question"}
              aria-pressed={Boolean(bookmarked[i])}
              className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-2xl text-[var(--text-dim)] active:bg-[var(--track)]"
            >
              <BookmarkIcon
                className="h-5 w-5"
                filled={Boolean(bookmarked[i])}
              />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <TagPill tagBase={q.tagBase} years={q.years} />
          </div>

          <button
            type="button"
            onClick={() => toggleReveal(i)}
            aria-expanded={Boolean(revealed[i])}
            className="mt-4 flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80"
          >
            {revealed[i] ? "Hide answer" : "Show answer"}
          </button>

          {revealed[i] ? (
            <div className="mt-4">
              <AnswerBlock lines={q.a} />
            </div>
          ) : null}

          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => markWrong(i)}
              className="flex min-h-[44px] items-center rounded-2xl px-4 text-[15px] font-medium text-[var(--text-dim)] active:bg-[var(--track)]"
            >
              I got this wrong
            </button>
            {wrongNote === i ? (
              <span className="text-[13px] font-medium text-amber-600 dark:text-amber-300">
                Added to mistake deck
              </span>
            ) : null}
          </div>
        </GlassCard>
      ))}
      <NextButton label="Take the quiz" onClick={onNext} />
    </section>
  );
}

// -------------------------------------------------------------------- TEST ---

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function TestPhase({
  short,
  num,
  topicTitle,
  questions,
  onProgress,
  onNext,
}: {
  short: string;
  num: string;
  topicTitle: string;
  questions: Question[];
  onProgress: (fraction: number) => void;
  onNext: () => void;
}) {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [final, setFinal] = useState<QuizFinal | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [, setTick] = useState(0);

  const rerender = () => setTick((t) => t + 1);

  const start = () => {
    if (questions.length === 0) return;
    setFinal(null);
    setFeedback(null);
    setBusy(false);
    setSession(
      new QuizSession(questions, {
        subject: short,
        module: num,
        topic: topicTitle,
      }),
    );
    onProgress(0);
  };

  const finish = async (s: QuizSession) => {
    const f = await s.finalize();
    setFinal(f);
    setFeedback(null);
    setBusy(false);
    onProgress(1);
    // Keep the global XP / streak displays fresh.
    useAppStore.getState().refreshFromDB().catch(() => {});
    rerender();
  };

  const onKnown = async () => {
    if (!session || busy || !session.isRevealed) return;
    setBusy(true);
    const { xp } = await session.markKnown();
    setFeedback(xp > 0 ? `Correct · +${xp} XP` : "Correct");
    setBusy(false);
    onProgress(session.done ? 1 : session.progressPct / 100);
    rerender();
  };

  const onMissed = async () => {
    if (!session || busy || !session.isRevealed) return;
    setBusy(true);
    await session.markMissed();
    setFeedback("Wrong · added to mistake deck, it will repeat");
    setBusy(false);
    onProgress(session.done ? 1 : session.progressPct / 100);
    rerender();
  };

  const onNextQuestion = () => {
    if (!session) return;
    setFeedback(null);
    if (session.done) void finish(session);
    else rerender();
  };

  if (final) {
    const s = final.summary;
    return (
      <section aria-label="Quiz results" className="flex flex-col gap-4">
        <GlassCard>
          <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
            Quiz complete
          </p>
          <h2 className="mt-2 text-[22px] font-bold text-[var(--text)]">
            {final.passed
              ? "Topic complete, next topic unlocked"
              : "Not yet, review and retry"}
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { v: `+${s.xpEarned}`, l: "XP earned" },
              { v: `${s.accuracy}%`, l: "Accuracy" },
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

          {final.newlyUnlocked.length > 0 ? (
            <div className="mt-4">
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
                    <p className="text-[13px] text-[var(--text-dim)]">{a.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-4">
            <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
              Weak spots
            </p>
            {s.weakIndices.length === 0 ? (
              <p className="mt-2 text-[15px] text-[var(--text-dim)]">
                Clean run, nothing missed.
              </p>
            ) : (
              <ul className="mt-2 flex flex-col gap-2">
                {s.weakIndices.map((qi) => (
                  <li
                    key={qi}
                    className="rounded-2xl bg-[var(--track)] px-4 py-3 text-[15px] leading-snug text-[var(--text-dim)]"
                  >
                    {questions[qi]?.q ?? `Question ${qi + 1}`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <button
              type="button"
              onClick={start}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80"
            >
              <RefreshIcon className="h-5 w-5" />
              Retake quiz
            </button>
            <NextButton label="Revise flashcards" onClick={onNext} />
          </div>
        </GlassCard>
      </section>
    );
  }

  if (!session) {
    return (
      <section aria-label="Quiz" className="flex flex-col gap-4">
        <GlassCard>
          <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
            Self-check quiz
          </p>
          <h2 className="mt-2 text-[22px] font-bold text-[var(--text)]">
            {questions.length} questions
          </h2>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-[1.7] text-[var(--text-dim)]">
            <li>Read each question, show the answer, then mark honestly.</li>
            <li>
              Pass at {QUIZ_PASS_SCORE}% to complete the topic and unlock the
              next one.
            </li>
            <li>Missed questions repeat at the end until you get them right.</li>
            <li>
              XP per correct answer: SURE MARK {xpForTag("SURE MARK")} ·
              REPEATED {xpForTag("REPEATED")} · IMPORTANT{" "}
              {xpForTag("IMPORTANT")}.
            </li>
          </ul>
          <button
            type="button"
            onClick={start}
            className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--text)] text-[15px] font-semibold text-[var(--bg)] active:opacity-90"
          >
            <PlayIcon className="h-5 w-5" />
            Start quiz
          </button>
        </GlassCard>
      </section>
    );
  }

  const q = session.currentQuestion;

  return (
    <section aria-label="Quiz" className="flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between text-[13px] text-[var(--text-dim)]">
          <span>
            {session.roundNumber > 1
              ? `Review round ${session.roundNumber} · ${session.roundPos} of ${session.roundTotal} missed`
              : `Question ${session.roundPos} of ${session.roundTotal}`}
          </span>
          <span className="tabular-nums">
            {Math.round(session.progressPct)}%
          </span>
        </div>
        <ProgressBar value={session.progressPct} className="mt-2" />
      </div>

      {q ? (
        <GlassCard>
          <div className="flex flex-wrap gap-2">
            <TagPill tagBase={q.tagBase} years={q.years} />
          </div>
          <p className="mt-3 text-[18px] font-semibold leading-[1.6] text-[var(--text)]">
            {q.q}
          </p>

          {!session.isRevealed ? (
            <button
              type="button"
              onClick={() => {
                session.revealAnswer();
                rerender();
              }}
              className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[var(--text)] text-[15px] font-semibold text-[var(--bg)] active:opacity-90"
            >
              Show answer
            </button>
          ) : (
            <>
              <div className="mt-4">
                <AnswerBlock lines={q.a} />
              </div>
              {feedback ? (
                <p
                  className="mt-3 text-center text-[15px] font-semibold text-[var(--text)]"
                  role="status"
                >
                  {feedback}
                </p>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={onMissed}
                    disabled={busy}
                    className="flex min-h-[52px] items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 text-[15px] font-semibold text-rose-600 disabled:opacity-50 dark:text-rose-300"
                  >
                    I got it wrong
                  </button>
                  <button
                    type="button"
                    onClick={onKnown}
                    disabled={busy}
                    className="flex min-h-[52px] items-center justify-center rounded-2xl bg-[var(--text)] px-3 text-[15px] font-semibold text-[var(--bg)] disabled:opacity-50"
                  >
                    I got it right
                  </button>
                </div>
              )}
              {feedback ? (
                <button
                  type="button"
                  onClick={onNextQuestion}
                  className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--text)] text-[15px] font-semibold text-[var(--bg)] active:opacity-90"
                >
                  Next question
                  <ArrowIcon className="h-5 w-5" />
                </button>
              ) : null}
            </>
          )}
        </GlassCard>
      ) : null}
    </section>
  );
}

// ------------------------------------------------------------------ REVISE ---

interface DeckEntry {
  index: number;
  key: string;
}

export function RevisePhase({
  short,
  num,
  slug,
  questions,
  onProgress,
}: {
  short: string;
  num: string;
  slug: string;
  questions: Question[];
  onProgress: (fraction: number) => void;
}) {
  const [deck, setDeck] = useState<DeckEntry[] | null>(null);
  const [pos, setPos] = useState(0);
  // 0 = front, 1 = preview (first 3 answer lines), 2 = full answer.
  const [flip, setFlip] = useState<0 | 1 | 2>(0);

  const buildDeck = () => {
    const now = new Date();
    const entries = questions
      .map((_, i) => {
        const key = srsKey(short, num, slug, i);
        return { index: i, key, card: loadCard(key) };
      })
      .filter((e) => !hasReviews(e.card) || isCardDue(e.card, now))
      .sort((a, b) => a.card.due.getTime() - b.card.due.getTime())
      .map(({ index, key }) => ({ index, key }));
    setDeck(entries);
    setPos(0);
    setFlip(0);
    onProgress(entries.length === 0 ? 1 : 0);
  };

  useEffect(buildDeck, [short, num, slug, questions, onProgress]);

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
          <button
            type="button"
            onClick={buildDeck}
            className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80"
          >
            <RefreshIcon className="h-5 w-5" />
            Check again
          </button>
        </GlassCard>
      </section>
    );
  }

  const entry = deck[pos];
  const q = questions[entry.index];

  const grade = (rating: Rating) => {
    reviewCard(entry.key, rating);
    setFlip(0);
    setPos((p) => p + 1);
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
        <span>{q.tagBase}</span>
      </div>

      <button
        type="button"
        onClick={() => setFlip((f) => ((f + 1) % 3) as 0 | 1 | 2)}
        aria-label={flip === 0 ? "Flip card" : "Show more of the answer"}
        className="block w-full text-left"
      >
        <GlassCard className="min-h-[220px] transition-transform active:scale-[0.99]">
          {flip === 0 ? (
            <div className="flex min-h-[188px] flex-col justify-center gap-3">
              <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
                Question
              </p>
              <p className="text-[18px] font-semibold leading-[1.6] text-[var(--text)]">
                {q.q}
              </p>
              <p className="text-[13px] text-[var(--text-faint)]">
                Tap to flip
              </p>
            </div>
          ) : flip === 1 ? (
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
                Answer
              </p>
              <AnswerBlock lines={q.a.slice(0, 3)} />
              <p className="text-[13px] font-medium text-[var(--text-faint)]">
                Tap for the full answer
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
                Full answer
              </p>
              <AnswerBlock lines={q.a} />
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
      className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--text)] text-[16px] font-semibold text-[var(--bg)] active:opacity-90"
    >
      {label}
      <ArrowIcon className="h-5 w-5" />
    </button>
  );
}
