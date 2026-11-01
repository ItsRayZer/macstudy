// -------------------------------------------------------------------- TEST ---
// EXAM MODE: single pass over all questions as 4-option MCQs. No skip, no
// repeats, no mid-test full answers. Optional 30s per-question timer shown
// as a thin ring; time-out counts as wrong. Instant right/wrong flash with
// the correct option highlighted. The last question shows a prominent
// "Finish Test" button leading to results: score %, XP earned
// (IMPORTANT 10 / REPEATED 15 / SURE MARK 20), pass/fail vs 60%, and a
// review list of misses WITH their full answers.
// The queue serves SURE MARK, then REPEATED, then IMPORTANT, untagged filler
// last; the "PYQ only" toggle on the intro limits the exam to tagged
// questions. Lazy-loaded by the test page via next/dynamic.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnswerBlock,
  ArrowIcon,
  NextButton,
  PlayIcon,
  PyqOnlyToggle,
  RefreshIcon,
  TagPill,
} from "../flow";
import {
  EmptyState,
  GlassCard,
  ProgressBar,
} from "../../../../../../components/ui";
import {
  BookmarkButton,
  questionBookmarkRef,
} from "../../../../../../components/bookmarks";
import { getDB } from "../../../../../../lib/db";
import { useAppStore } from "../../../../../../lib/store";
import { QUIZ_PASS_SCORE } from "../../../../../../lib/study";
import {
  QuizSession,
  xpForTag,
  type QuizFinal,
} from "../../../../../../lib/quiz";
import { buildMcq, type Mcq } from "../../../../../../lib/mcq";
import { priorityOrder } from "../../../../../../lib/question-priority";
import type { Question, Topic } from "@/src/content/types";

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
  // PYQ priority: tagged questions first, filler last. The intro toggle
  // limits the exam to tagged questions only.
  const [pyqOnly, setPyqOnly] = useState(false);
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
    const order = priorityOrder(questions, pyqOnly);
    if (order.length === 0) return;
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
        { examMode: true, order },
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
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
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
            {priorityOrder(questions, pyqOnly).length} questions · one shot
            each
          </h2>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-[1.7] text-[var(--text-dim)]">
            <li>Pick the right option out of 4. No skipping, no repeats.</li>
            <li>
              {EXAM_SECONDS_PER_QUESTION} seconds per question - run out of
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

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <PyqOnlyToggle value={pyqOnly} onChange={setPyqOnly} />
          </div>
          <p className="mt-2 text-[12px] text-[var(--text-faint)]">
            {pyqOnly
              ? "Only SURE MARK, REPEATED and IMPORTANT questions."
              : "SURE MARK first, then REPEATED, then IMPORTANT."}
          </p>

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

  // Active question. While feedback shows, prefer the answered card so the
  // stem and options can never mismatch (the session already advanced).
  const answered = picked != null || timedOut;
  const q = answered
    ? (lastCard?.q ?? session.currentQuestion ?? null)
    : (session.currentQuestion ?? lastCard?.q ?? null);
  const activeMcq = answered ? (lastCard?.mcq ?? mcq) : (mcq ?? lastCard?.mcq);
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
