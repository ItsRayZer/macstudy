// app/subjects/[short]/[module]/[topic]/tabs.tsx
// The four topic tabs: LEARN | PRACTICE | TEST | REVISE (client).
//
// LEARN    key points, exam pattern note, honest "video coming soon" slot.
// PRACTICE tap-to-reveal answers, tag pills, bookmarks, "I got this wrong".
// TEST     QuizSession self-check flow with XP, repeats, and a report.
// REVISE   ts-fsrs flashcards, card state local-only.

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  EmptyState,
  GlassCard,
  Pill,
  ProgressBar,
  type PillVariant,
} from "../../../../../components/ui";
import { getDB } from "../../../../../lib/db";
import { useAppStore } from "../../../../../lib/store";
import { matchVideoSlot, QUIZ_PASS_SCORE } from "../../../../../lib/study";
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
    <div className="flex flex-col gap-2">
      {blocks.map((b, i) =>
        b.code ? (
          <pre
            key={i}
            className="overflow-x-auto rounded-2xl bg-[var(--track)] p-3 font-mono text-[13px] leading-relaxed text-[var(--text)]"
          >
            {b.text.join("\n")}
          </pre>
        ) : (
          b.text.map((t, j) => (
            <p
              key={`${i}-${j}`}
              className="text-sm leading-relaxed text-[var(--text-dim)]"
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

const TAG_VARIANT: Record<Question["tagBase"], PillVariant> = {
  "SURE MARK": "sure",
  REPEATED: "repeated",
  IMPORTANT: "important",
};

const IMPORTANT_BLUE =
  "inline-flex min-h-[28px] items-center rounded-full border px-3 py-1 text-xs font-semibold border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300";

export function TagPill({
  tagBase,
  years,
}: {
  tagBase: Question["tagBase"];
  years: string | null;
}) {
  const label = (
    <>
      {tagBase}
      {years ? ` · ${years}` : ""}
    </>
  );
  // Spec: SURE MARK green, REPEATED orange, IMPORTANT blue. The shared Pill's
  // "important" variant is rose, so IMPORTANT renders its own blue pill here.
  if (tagBase === "IMPORTANT") {
    return <span className={IMPORTANT_BLUE}>{label}</span>;
  }
  return <Pill variant={TAG_VARIANT[tagBase] ?? "default"}>{label}</Pill>;
}

// ------------------------------------------------------------------- LEARN ---

export function LearnTab({
  subject,
  mod,
  topic,
}: {
  subject: Subject;
  mod: Module;
  topic: Topic;
}) {
  const slot = matchVideoSlot(subject.short, mod.num, topic);
  const pattern = mod.examPattern ?? subject.examPattern;

  return (
    <div className="flex flex-col gap-4">
      {slot ? (
        <GlassCard>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--track)] text-[var(--text-dim)]">
              <VideoIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text)]">
                Video coming soon
              </p>
              <p className="truncate text-xs text-[var(--text-dim)]">
                {slot.topicHint}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[var(--text-faint)]">
            A short explainer video for this topic is on the way. The key
            points and questions below cover everything you need for now.
          </p>
        </GlassCard>
      ) : null}

      <GlassCard>
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-dim)]">
          Key points
        </p>
        <ol className="mt-3 flex flex-col gap-3">
          {topic.points.map((pt, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-[var(--text)]">{pt}</p>
            </li>
          ))}
        </ol>
      </GlassCard>

      {pattern ? (
        <GlassCard>
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-dim)]">
            Exam pattern
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-dim)]">
            {pattern}
          </p>
        </GlassCard>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------- PRACTICE ---

export function PracticeTab({
  short,
  num,
  topicTitle,
  questions,
}: {
  short: string;
  num: string;
  topicTitle: string;
  questions: Question[];
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
    <div className="flex flex-col gap-3">
      {questions.map((q, i) => (
        <GlassCard key={i}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-[15px] font-semibold leading-snug text-[var(--text)]">
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

          <div className="mt-2 flex flex-wrap gap-2">
            <TagPill tagBase={q.tagBase} years={q.years} />
          </div>

          <button
            type="button"
            onClick={() => toggleReveal(i)}
            aria-expanded={Boolean(revealed[i])}
            className="mt-3 flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-[var(--track)] text-sm font-semibold text-[var(--text)] active:opacity-80"
          >
            {revealed[i] ? "Hide answer" : "Show answer"}
          </button>

          {revealed[i] ? (
            <div className="mt-3">
              <AnswerBlock lines={q.a} />
            </div>
          ) : null}

          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => markWrong(i)}
              className="flex min-h-[44px] items-center rounded-2xl px-4 text-sm font-medium text-[var(--text-dim)] active:bg-[var(--track)]"
            >
              I got this wrong
            </button>
            {wrongNote === i ? (
              <span className="text-xs font-medium text-amber-600 dark:text-amber-300">
                Added to mistake deck
              </span>
            ) : null}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

// -------------------------------------------------------------------- TEST ---

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function TestTab({
  short,
  num,
  topicTitle,
  questions,
}: {
  short: string;
  num: string;
  topicTitle: string;
  questions: Question[];
}) {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [final, setFinal] = useState<QuizFinal | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [, setTick] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current != null) window.clearTimeout(timer.current);
    },
    [],
  );

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
  };

  const finish = async (s: QuizSession) => {
    const f = await s.finalize();
    setFinal(f);
    setFeedback(null);
    setBusy(false);
    // Keep the global XP / streak displays fresh.
    useAppStore.getState().refreshFromDB().catch(() => {});
    rerender();
  };

  const settle = (s: QuizSession) => {
    timer.current = window.setTimeout(() => {
      if (s.done) {
        void finish(s);
      } else {
        setBusy(false);
        setFeedback(null);
        rerender();
      }
    }, 850);
  };

  const onKnown = async () => {
    if (!session || busy || !session.isRevealed) return;
    setBusy(true);
    const { xp } = await session.markKnown();
    setFeedback(xp > 0 ? `+${xp} XP` : "Correct");
    rerender();
    settle(session);
  };

  const onMissed = async () => {
    if (!session || busy || !session.isRevealed) return;
    setBusy(true);
    await session.markMissed();
    setFeedback("Marked wrong, it will repeat at the end");
    rerender();
    settle(session);
  };

  if (final) {
    const s = final.summary;
    return (
      <div className="flex flex-col gap-4">
        <GlassCard>
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-dim)]">
            Lesson complete
          </p>
          <h2 className="mt-2 text-xl font-bold text-[var(--text)]">
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
                <div className="text-gradient text-xl font-bold tabular-nums">
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
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-dim)]">
                Achievements unlocked
              </p>
              <div className="mt-2 flex flex-col gap-2">
                {final.newlyUnlocked.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-2xl bg-[var(--track)] px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-[var(--text)]">
                      {a.name}
                    </p>
                    <p className="text-xs text-[var(--text-dim)]">{a.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-dim)]">
              Weak spots
            </p>
            {s.weakIndices.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--text-dim)]">
                Clean run, nothing missed.
              </p>
            ) : (
              <ul className="mt-2 flex flex-col gap-2">
                {s.weakIndices.map((qi) => (
                  <li
                    key={qi}
                    className="rounded-2xl bg-[var(--track)] px-4 py-3 text-sm leading-snug text-[var(--text-dim)]"
                  >
                    {questions[qi]?.q ?? `Question ${qi + 1}`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={start}
            className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] font-semibold text-white active:opacity-90"
          >
            <RefreshIcon className="h-5 w-5" />
            Retake quiz
          </button>
        </GlassCard>
      </div>
    );
  }

  if (!session) {
    return (
      <GlassCard>
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-dim)]">
          Self-check quiz
        </p>
        <h2 className="mt-2 text-xl font-bold text-[var(--text)]">
          {questions.length} questions
        </h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-[var(--text-dim)]">
          <li>Read each question, reveal the answer, then mark honestly.</li>
          <li>
            Pass at {QUIZ_PASS_SCORE}% to complete the topic and unlock the
            next one.
          </li>
          <li>Missed questions repeat at the end until you get them right.</li>
          <li>
            XP per correct answer: SURE MARK {xpForTag("SURE MARK")} · REPEATED{" "}
            {xpForTag("REPEATED")} · IMPORTANT {xpForTag("IMPORTANT")}.
          </li>
        </ul>
        <button
          type="button"
          onClick={start}
          className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] font-semibold text-white active:opacity-90"
        >
          <PlayIcon className="h-5 w-5" />
          Start quiz
        </button>
      </GlassCard>
    );
  }

  const q = session.currentQuestion;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between text-xs text-[var(--text-dim)]">
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
          <p className="mt-3 text-[17px] font-semibold leading-snug text-[var(--text)]">
            {q.q}
          </p>

          {!session.isRevealed ? (
            <button
              type="button"
              onClick={() => {
                session.revealAnswer();
                rerender();
              }}
              className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] font-semibold text-white active:opacity-90"
            >
              Reveal answer
            </button>
          ) : (
            <>
              <div className="mt-4">
                <AnswerBlock lines={q.a} />
              </div>
              {feedback ? (
                <p
                  className="mt-3 text-center text-sm font-semibold text-[var(--text)]"
                  role="status"
                >
                  {feedback}
                </p>
              ) : null}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onMissed}
                  disabled={busy}
                  className="flex min-h-[52px] items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 font-semibold text-rose-600 disabled:opacity-50 dark:text-rose-300"
                >
                  I missed it
                </button>
                <button
                  type="button"
                  onClick={onKnown}
                  disabled={busy}
                  className="flex min-h-[52px] items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3 font-semibold text-white disabled:opacity-50"
                >
                  I knew it
                </button>
              </div>
            </>
          )}
        </GlassCard>
      ) : null}
    </div>
  );
}

// ------------------------------------------------------------------ REVISE ---

interface DeckEntry {
  index: number;
  key: string;
}

export function ReviseTab({
  short,
  num,
  slug,
  questions,
}: {
  short: string;
  num: string;
  slug: string;
  questions: Question[];
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
  };

  useEffect(buildDeck, [short, num, slug, questions]);

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
      <div className="flex flex-col gap-4">
        <GlassCard>
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-dim)]">
            Flashcards done
          </p>
          <h2 className="mt-2 text-xl font-bold text-[var(--text)]">
            Reviewed {deck.length} card{deck.length === 1 ? "" : "s"}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-[var(--text-dim)]">
            <ClockIcon className="h-4 w-4" />
            Spaced repetition keeps them coming back right on time.
          </p>
          <button
            type="button"
            onClick={buildDeck}
            className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--track)] font-semibold text-[var(--text)] active:opacity-80"
          >
            <RefreshIcon className="h-5 w-5" />
            Check again
          </button>
        </GlassCard>
      </div>
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-[var(--text-dim)]">
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
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-dim)]">
                Question
              </p>
              <p className="text-[17px] font-semibold leading-snug text-[var(--text)]">
                {q.q}
              </p>
              <p className="text-xs text-[var(--text-faint)]">
                Tap to flip
              </p>
            </div>
          ) : flip === 1 ? (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-dim)]">
                Answer
              </p>
              <AnswerBlock lines={q.a.slice(0, 3)} />
              <p className="text-xs font-medium text-[var(--text-faint)]">
                Tap for the full answer
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-dim)]">
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
              className="glass flex min-h-[52px] flex-col items-center justify-center rounded-2xl text-sm font-semibold text-[var(--text)] active:opacity-80"
            >
              {g.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
