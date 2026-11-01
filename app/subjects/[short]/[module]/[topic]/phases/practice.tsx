// app/subjects/[short]/[module]/[topic]/phases/practice.tsx
// Practice phase (lazy-loaded by the practice page via next/dynamic).
//
// ANSWER MODES (per subject/question):
//   QT numerical questions get a stepped working pad (Step 1, 2, ...) in
//   monospace; table/frequency-distribution questions get a row-based table
//   pad. Python programming questions get a code pad with in-browser Run.
//   Everything else keeps the typed-answer textarea.
// GRADING: key-term matching from the model answer, plus number matching
//   (with rounding tolerance) for QT, plus output comparison for code.
//   A silent background check can refine the verdict; the UI never mentions
//   it and works fully when it is unavailable.
// QUEUE: SURE MARK, then REPEATED, then IMPORTANT, untagged filler last. The
//   "PYQ only" toggle limits the session to tagged questions.
// Wrong/skipped questions repeat at the end. Finishing persists a 50%
// milestone so progress survives a reload.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnswerBlock,
  BookmarkIcon,
  NextButton,
  PyqOnlyToggle,
  TagPill,
} from "../flow";
import { GlassCard } from "../../../../../../components/ui";
import { getDB } from "../../../../../../lib/db";
import { markPhaseProgress } from "../../../../../../lib/progress";
import { verifyRemotely } from "../../../../../../lib/verify";
import {
  expectedNumbers,
  extractKeyTerms,
  gradeAnswer,
  gradeNumbers,
  gradeScore,
  type GradedTerm,
} from "../../../../../../lib/grade";
import { priorityOrder } from "../../../../../../lib/question-priority";
import {
  CodePad,
  TablePad,
  WorkingPad,
  emptyTable,
  flattenTable,
  isProgrammingQuestion,
  type CodePadHandle,
} from "../answer-pads";
import type { Question, Topic } from "@/src/content/types";

export type TagFilter = "ALL" | "SURE MARK" | "REPEATED" | "IMPORTANT";

export function PracticePhase({
  short,
  num,
  topicTitle,
  topic,
  questions,
  onProgress,
  onNext,
  mode = "topic",
  resumeKey,
}: {
  short: string;
  num: string;
  topicTitle: string;
  topic: Topic;
  questions: Question[];
  onProgress: (fraction: number) => void;
  onNext: () => void;
  /** "pyq": subject-wide PYQ mode - tag filter chips, 100% on finish. */
  mode?: "topic" | "pyq";
  /** When set, the session position is saved to localStorage; returning offers Continue / Restart. */
  resumeKey?: string;
}) {
  const isPyq = mode === "pyq";
  // Question priority: PYQ tags first, filler last. Toggle limits the
  // session to tagged questions only. In PYQ mode the chips filter by tag.
  const [pyqOnly, setPyqOnly] = useState(false);
  const [tagFilter, setTagFilter] = useState<TagFilter>("ALL");

  const computeOrder = (only: boolean, filter: TagFilter): number[] => {
    const o = priorityOrder(questions, only);
    if (filter === "ALL") return o;
    return o.filter((i) => questions[i]?.tagBase === filter);
  };

  const order = useMemo(
    () => computeOrder(isPyq ? false : pyqOnly, isPyq ? tagFilter : "ALL"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, pyqOnly, tagFilter, isPyq],
  );
  const total = order.length;

  const [queue, setQueue] = useState<number[]>(() =>
    computeOrder(false, "ALL"),
  );
  const [pos, setPos] = useState(0);
  const [round, setRound] = useState(1);
  const [repeat, setRepeat] = useState<number[]>([]);
  const [step, setStep] = useState<"answer" | "graded" | "revealed">("answer");
  const [draft, setDraft] = useState("");
  const [steps, setSteps] = useState<string[]>(["", ""]);
  const [table, setTable] = useState<string[][]>(() => emptyTable());
  const [code, setCode] = useState("");
  const [graded, setGraded] = useState<GradedTerm[] | null>(null);
  const [verdictOk, setVerdictOk] = useState(false);
  const [checking, setChecking] = useState(false);
  const [finished, setFinished] = useState(false);
  const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});
  const codePadRef = useRef<CodePadHandle | null>(null);
  // Resume: saved { queue, pos } in localStorage; returning offers Continue / Restart.
  const [resumeOffer, setResumeOffer] = useState<{ pos: number; total: number; queue: number[] } | null>(null);
  const resumeStorageKey = resumeKey ? `macstudy:resume:${resumeKey}` : null;
  const clearResume = () => {
    if (!resumeStorageKey) return;
    try {
      localStorage.removeItem(resumeStorageKey);
    } catch {}
  };

  // Persist session position for resume.
  useEffect(() => {
    if (!resumeStorageKey || queue.length === 0 || resumeOffer !== null || finished) return;
    try {
      localStorage.setItem(
        resumeStorageKey,
        JSON.stringify({ queue, pos, round, ts: Date.now() })
      );
    } catch {}
  }, [resumeStorageKey, queue, pos, round, resumeOffer, finished]);

  // On mount, offer to resume a previous session if the queue still matches.
  useEffect(() => {
    if (!resumeStorageKey) return;
    try {
      const raw = localStorage.getItem(resumeStorageKey);
      if (!raw) return;
      const saved = JSON.parse(raw) as { queue?: number[]; pos?: number; round?: number };
      if (
        saved.round === 1 &&
        typeof saved.pos === "number" &&
        saved.pos > 0 &&
        Array.isArray(saved.queue) &&
        saved.queue.length === queue.length &&
        saved.queue.every((v, i) => v === queue[i]) &&
        saved.pos < saved.queue.length
      ) {
        setResumeOffer({ pos: saved.pos, total: saved.queue.length, queue: saved.queue });
      } else {
        localStorage.removeItem(resumeStorageKey);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeStorageKey]);

  // Session finished: clear any saved resume state.
  useEffect(() => {
    if (finished) clearResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const qIdx = queue[pos];
  const q = qIdx != null ? questions[qIdx] : null;

  // Answer mode for the current question.
  const isQT = short === "QT";
  const isTableQ = isQT && q != null && /form a|construct|prepare|draw up|complete the|fill in the|make a|frequency distribution from/i.test(q.q);
  // Working pad only for numerical QT questions: a digit in the question, or a
  // numerical keyword. Pure theory questions get the normal answer textarea.
  const isNumericalQ =
    isQT &&
    !isTableQ &&
    q != null &&
    (/\d/.test(q.q) ||
      /calculat|comput|find|determin|mean|median|mode|deviation|variance|regression|correlation|probab/i.test(
        q.q,
      ));
  const isCodeQ =
    short === "PYTHON" && q != null && isProgrammingQuestion(q.q, q.a);

  // Key terms for the current question, from the model answer only.
  const keyTerms = useMemo(
    () => (q ? extractKeyTerms(q.a) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [qIdx],
  );

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

  // Finishing Practice persists the milestone (never downgrades): 50% for a
  // topic session, 100% for a full subject-wide PYQ run.
  const practiceSaved = useRef(false);
  useEffect(() => {
    if (finished && !practiceSaved.current) {
      practiceSaved.current = true;
      markPhaseProgress(short, num, topicTitle, isPyq ? 100 : 50).catch(
        () => {},
      );
    }
  }, [finished, short, num, topicTitle, isPyq]);

  const reportProgress = (p: number, r: number, qLen: number) => {
    if (total === 0) {
      onProgress(1);
      return;
    }
    // Round 1 covers the first pass (0-85%); the review round reports
    // proportional progress through its own queue instead of jumping to 1.
    if (r === 1) onProgress(0.85 * (p / total));
    else onProgress(0.85 + 0.15 * (qLen === 0 ? 1 : p / qLen));
  };

  const resetStep = () => {
    setStep("answer");
    setDraft("");
    setSteps(["", ""]);
    setTable(emptyTable());
    setCode("");
    setGraded(null);
    setVerdictOk(false);
    setChecking(false);
  };

  const resetSession = (only: boolean, filter: TagFilter = "ALL") => {
    const o = computeOrder(only, filter);
    setQueue(o);
    setPos(0);
    setRound(1);
    setRepeat([]);
    resetStep();
    setFinished(false);
    practiceSaved.current = false;
    onProgress(0);
  };

  const togglePyqOnly = () => {
    const next = !pyqOnly;
    setPyqOnly(next);
    resetSession(next, "ALL");
  };

  const changeTagFilter = (f: TagFilter) => {
    setTagFilter(f);
    resetSession(false, f);
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

  /** Text the learner produced, whatever pad they used. */
  const currentUserText = (): string => {
    if (q == null) return "";
    if (isCodeQ) return code;
    if (isTableQ) return flattenTable(table);
    if (isNumericalQ) return steps.filter((s) => s.trim()).join("\n");
    return draft;
  };

  const hasInput = (): boolean => currentUserText().trim().length > 0;

  /**
   * Silent enhancement layer: a background check refines the local verdict.
   * Never throws, never shows anything by itself; the UI just shows the
   * final verdict. Null (unavailable) keeps the local verdict untouched.
   */
  const enhanceWithRemote = async (
    qi: number,
    qq: Question,
    text: string,
    localOk: boolean,
  ) => {
    try {
      const v = await verifyRemotely({
        question: qq.q,
        modelAnswer: qq.a,
        userAnswer: text,
        subject: short,
      });
      if (v == null) return;
      const remoteOk = v === "correct";
      if (remoteOk !== localOk) {
        setVerdictOk(remoteOk);
        if (remoteOk) dequeueRepeat(qi);
        else enqueueRepeat(qi);
      }
    } catch {
      // local verdict stands
    }
  };

  const onCheck = async () => {
    if (qIdx == null || q == null || !hasInput() || checking) return;
    const qi = qIdx;
    const qq = q;

    // Code questions: run the program and verify its output.
    if (isCodeQ && codePadRef.current) {
      setChecking(true);
      try {
        const v = await codePadRef.current.runAndVerify();
        const g = gradeAnswer(keyTerms, v.userText);
        setGraded(g);
        setVerdictOk(v.ok);
        if (!v.ok) enqueueRepeat(qi);
        setStep("graded");
        void enhanceWithRemote(qi, qq, v.userText, v.ok);
      } finally {
        setChecking(false);
      }
      return;
    }

    const text = currentUserText();
    const g = gradeAnswer(keyTerms, text);
    let score = gradeScore(g);
    if (isNumericalQ || isTableQ) {
      // Numerical/table questions: numbers must match too (rounding-tolerant).
      const nums = expectedNumbers(qq.a);
      if (nums.length > 0) score = 0.5 * score + 0.5 * gradeNumbers(nums, text);
    }
    const ok = score >= 0.6;
    setGraded(g);
    setVerdictOk(ok);
    if (!ok) enqueueRepeat(qi);
    setStep("graded");
    void enhanceWithRemote(qi, qq, text, ok);
  };

  const onShowAnswer = () => {
    // Skipped the attempt: queue for the repeat round.
    if (qIdx != null) enqueueRepeat(qIdx);
    setStep("revealed");
  };

  const onNextQ = (repeatAfter: number[]) => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const np = pos + 1;
    if (np < queue.length) {
      setPos(np);
      resetStep();
      reportProgress(np, round, queue.length);
      return;
    }
    // End of this pass: repeat the missed/skipped ones, else finish.
    // (No nested setState: updaters must stay pure. repeatAfter is the
    // post-click list passed by the caller, never a stale closure read.)
    if (repeatAfter.length > 0) {
      setQueue(repeatAfter);
      setRepeat([]);
      setPos(0);
      setRound((r) => r + 1);
      resetStep();
      reportProgress(0, 2, repeatAfter.length);
    } else {
      setFinished(true);
      onProgress(1);
    }
  };

  const answerHint = isCodeQ
    ? "Write the program, run it, then check."
    : isTableQ
      ? "Fill the table the way you'd write it in the exam."
      : isNumericalQ
        ? "Show your working step by step."
        : "Type the answer in your own words - no options here.";

  const answerLabel = isCodeQ
    ? "Your program"
    : isTableQ
      ? "Your table"
      : isNumericalQ
        ? "Your working"
        : "Your answer";

  if (total === 0) {
    return (
      <section aria-label="Practice" className="flex flex-col gap-4">
        <h2 className="text-[20px] font-bold text-[var(--text)]">Practice</h2>
        <p className="text-[15px] text-[var(--text-dim)]">
          {pyqOnly
            ? "No tagged questions for this topic yet. Head to the test."
            : "No practice questions for this topic yet. Head to the test."}
        </p>
        <NextButton label="Take the test" onClick={onNext} />
      </section>
    );
  }

  if (finished) {
    return (
      <section aria-label="Practice complete" className="flex flex-col gap-4">
        <GlassCard>
          <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
            {isPyq ? "PYQ Practice complete" : "Practice complete"}
          </p>
          <h2 className="mt-2 text-[22px] font-bold text-[var(--text)]">
            {isPyq
              ? "You worked through every PYQ"
              : "Nice, you worked through every question"}
          </h2>
          <p className="mt-2 text-[15px] leading-[1.7] text-[var(--text-dim)]">
            {round > 1
              ? `Including a review round for the tricky ones.`
              : `Clean pass, nothing needed a second look.`}{" "}
            Practice is safe to fail - the test is where you prove it.
          </p>
          <div className="mt-5">
            <NextButton
              label={isPyq ? "Back to subject" : "Take the test"}
              onClick={onNext}
            />
          </div>
        </GlassCard>
      </section>
    );
  }

  if (!q || qIdx == null) return null;

  const hits = graded?.filter((g) => g.hit).length ?? 0;
  const totalTerms = graded?.length ?? 0;
  const written = currentUserText().trim();

  return (
    <section aria-label="Practice" className="flex flex-col gap-4">
      {resumeOffer ? (
        <GlassCard>
          <p className="text-[12px] font-medium uppercase tracking-widest text-[var(--text-dim)]">
            Continue where you left off
          </p>
          <h2 className="mt-2 text-[22px] font-bold text-[var(--text)]">
            Question {resumeOffer.pos + 1} of {resumeOffer.total}
          </h2>
          <p className="mt-2 text-[15px] text-[var(--text-dim)]">
            You were partway through this session. Pick up where you stopped, or start over.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                clearResume();
                setResumeOffer(null);
              }}
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80"
            >
              Restart
            </button>
            <button
              type="button"
              onClick={() => {
                setQueue(resumeOffer.queue);
                setPos(resumeOffer.pos);
                setRound(1);
                resetStep();
                reportProgress(resumeOffer.pos, 1, resumeOffer.total);
                setResumeOffer(null);
              }}
              className="cta-neon flex min-h-[52px] w-full items-center justify-center rounded-2xl text-[15px] font-bold"
            >
              Continue
            </button>
          </div>
        </GlassCard>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[20px] font-bold text-[var(--text)]">
          {isPyq ? "PYQ Practice" : "Practice"}
        </h2>
        <div className="flex items-center gap-2">
          {pos > 0 ? (
            <button
              type="button"
              onClick={() => {
                const np = pos - 1;
                setPos(np);
                resetStep();
                reportProgress(np, round, queue.length);
              }}
              className="flex min-h-[36px] items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-3.5 text-[13px] font-semibold text-[var(--text)] active:opacity-70"
              aria-label="Previous question"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Previous
            </button>
          ) : null}
          <span className="text-[13px] tabular-nums text-[var(--text-dim)]">
            {round > 1
              ? `Review round · ${pos + 1} of ${queue.length}`
              : `Question ${pos + 1} of ${total}`}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="-mt-2 text-[13px] text-[var(--text-faint)]">
          {answerHint}
        </p>
        {isPyq ? (
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter questions by PYQ tag"
          >
            {(
              [
                ["ALL", "All"],
                ["SURE MARK", "Sure mark"],
                ["REPEATED", "Repeated"],
                ["IMPORTANT", "Important"],
              ] as [TagFilter, string][]
            ).map(([f, label]) => (
              <button
                key={f}
                type="button"
                onClick={() => changeTagFilter(f)}
                aria-pressed={tagFilter === f}
                className={`flex min-h-[40px] items-center rounded-full px-4 text-[13px] font-semibold transition-colors active:opacity-80 ${
                  tagFilter === f
                    ? "bg-[var(--neon)] text-[#04140a]"
                    : "bg-[var(--track)] text-[var(--text-dim)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <PyqOnlyToggle value={pyqOnly} onChange={togglePyqOnly} />
        )}
      </div>
      {isTableQ || isNumericalQ ? (
        <p className="-mt-2 text-[12px] text-[var(--text-faint)]">
          SURE MARK first, then REPEATED, then IMPORTANT.
        </p>
      ) : null}

      <GlassCard key={qIdx} className="rise-in">
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

        {step === "answer" ? (
          <>
            <p className="mt-4 block text-[12px] font-semibold uppercase tracking-widest text-[var(--text-dim)]">
              {answerLabel}
            </p>
            {isCodeQ ? (
              <CodePad
                ref={codePadRef}
                code={code}
                onChange={setCode}
                modelAnswer={q.a}
              />
            ) : null}
            {isTableQ ? (
              <TablePad table={table} onChange={setTable} />
            ) : null}
            {isNumericalQ ? (
              <WorkingPad steps={steps} onChange={setSteps} />
            ) : null}
            {!isCodeQ && !isTableQ && !isNumericalQ ? (
              <textarea
                id="practice-answer"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={5}
                placeholder="Explain it the way you'd write it in the exam…"
                className="mt-2 min-h-[130px] w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] p-4 text-[15px] leading-[1.7] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--text-dim)]"
              />
            ) : null}
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => void onCheck()}
                disabled={!hasInput() || checking}
                className="cta-neon flex min-h-[52px] w-full items-center justify-center rounded-2xl text-[15px] font-bold disabled:opacity-40"
              >
                {checking ? "Checking…" : "Check answer"}
              </button>
              <button
                type="button"
                onClick={onShowAnswer}
                className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-[var(--track)] text-[14px] font-semibold text-[var(--text-dim)] active:opacity-80"
              >
                Show answer
              </button>
              <button
                type="button"
                onClick={() => {
                  const nr = qIdx != null && !repeat.includes(qIdx) ? [...repeat, qIdx] : repeat;
                  setRepeat(nr);
                  onNextQ(nr);
                }}
                className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-[var(--track)] text-[14px] font-semibold text-[var(--text-dim)] active:opacity-80"
              >
                Skip question
              </button>
            </div>
          </>
        ) : null}

        {step === "graded" && graded ? (
          <>
            <div
              className={`mt-4 rounded-2xl p-4 ${
                verdictOk ? "bg-[var(--neon)]/10" : "bg-[var(--track)]"
              }`}
              role="status"
            >
              <p
                className={`text-[15px] font-bold ${
                  verdictOk ? "text-[var(--neon-soft)]" : "text-[var(--text)]"
                }`}
              >
                {verdictOk
                  ? `Solid - you hit ${hits} of ${totalTerms} key points`
                  : `Almost - you hit ${hits} of ${totalTerms} key points`}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {graded.map((g) => (
                  <span
                    key={g.term}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold ${
                      g.hit
                        ? "bg-[var(--neon)]/15 text-[var(--neon-soft)]"
                        : "bg-[var(--glass)] text-[var(--text-faint)] line-through decoration-[var(--text-faint)]/50"
                    }`}
                  >
                    {g.hit ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : null}
                    {g.term}
                  </span>
                ))}
              </div>
              {!verdictOk ? (
                <p className="mt-3 text-[13px] text-[var(--text-dim)]">
                  Compare with the model answer below, then try it again in
                  the review round.
                </p>
              ) : null}
            </div>

            {written ? (
              <div className="mt-4">
                <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-dim)]">
                  What you wrote
                </p>
                <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-[var(--glass)] p-4 font-mono text-[14px] leading-[1.7] text-[var(--text-dim)]">
                  {written}
                </p>
              </div>
            ) : null}

            <div className="mt-4 rounded-2xl bg-[var(--track)] p-4">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-dim)]">
                Model answer
              </p>
              <div className="mt-2">
                <AnswerBlock lines={q.a} mode="collapsed" hint={q.hint} figure={q.figure} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const nr = qIdx != null ? repeat.filter((x) => x !== qIdx) : repeat;
                  setRepeat(nr);
                  onNextQ(nr);
                }}
                className="cta-neon flex min-h-[52px] w-full items-center justify-center rounded-2xl text-[15px] font-bold"
              >
                I got it
              </button>
              <button
                type="button"
                onClick={() => {
                  const nr = qIdx != null && !repeat.includes(qIdx) ? [...repeat, qIdx] : repeat;
                  setRepeat(nr);
                  onNextQ(nr);
                }}
                className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80"
              >
                Skip
              </button>
            </div>
          </>
        ) : null}

        {step === "revealed" ? (
          <>
            {written ? (
              <div className="mt-4">
                <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-dim)]">
                  What you wrote
                </p>
                <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-[var(--glass)] p-4 font-mono text-[14px] leading-[1.7] text-[var(--text-dim)]">
                  {written}
                </p>
              </div>
            ) : null}
            <div className="mt-4 rounded-2xl bg-[var(--track)] p-4">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-dim)]">
                Model answer
              </p>
              <div className="mt-2">
                <AnswerBlock lines={q.a} mode="collapsed" hint={q.hint} figure={q.figure} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const nr = qIdx != null ? repeat.filter((x) => x !== qIdx) : repeat;
                  setRepeat(nr);
                  onNextQ(nr);
                }}
                className="cta-neon flex min-h-[52px] w-full items-center justify-center rounded-2xl text-[15px] font-bold"
              >
                I got it
              </button>
              <button
                type="button"
                onClick={() => {
                  const nr = qIdx != null && !repeat.includes(qIdx) ? [...repeat, qIdx] : repeat;
                  setRepeat(nr);
                  onNextQ(nr);
                }}
                className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[var(--track)] text-[15px] font-semibold text-[var(--text)] active:opacity-80"
              >
                Skip
              </button>
            </div>
          </>
        ) : null}
      </GlassCard>
    </section>
  );
}
