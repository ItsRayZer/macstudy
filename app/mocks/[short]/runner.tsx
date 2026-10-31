// app/mocks/[short]/page.tsx
// Timed mock test runner.
//   ready   - pattern summary, start button
//   running - paper with countdown timer, answers hidden
//   marking - self-check: reveal model answer, mark each correct/wrong
//   report  - score, XP, achievements, weak topics into the mistake deck

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronRightIcon,
  EmptyState,
  GlassCard,
  Pill,
} from "../../../components/ui";
import { AchievementBadge } from "../../../components/dashboard/AchievementBadge";
import { getDB } from "../../../lib/db";
import {
  recordQuizResult,
  type AchievementDef,
} from "../../../lib/gamify";
import {
  buildPaper,
  getMockConfig,
  type MockConfig,
  type PaperQuestion,
} from "../build-paper";

type Phase = "ready" | "running" | "marking" | "report";

function fmtClock(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

const PART_TITLES: Record<string, string> = {
  A: "Part A - Short questions",
  B: "Part B - Medium questions",
  C: "Part C - Long questions",
};

export function MockRunner({ short }: { short: string }) {
  const config: MockConfig | undefined = useMemo(
    () => getMockConfig(short),
    [short],
  );

  const [phase, setPhase] = useState<Phase>("ready");
  const [paper, setPaper] = useState<PaperQuestion[]>([]);
  const [remaining, setRemaining] = useState(0);
  const [marks, setMarks] = useState<(boolean | null)[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [xpGained, setXpGained] = useState(0);
  const [newAchievements, setNewAchievements] = useState<AchievementDef[]>([]);
  const [deckAdded, setDeckAdded] = useState(false);
  const deadlineRef = useRef(0);

  const maxScore = useMemo(
    () => paper.reduce((n, q) => n + q.marks, 0),
    [paper],
  );
  const score = useMemo(
    () =>
      paper.reduce(
        (n, q, i) => n + (marks[i] === true ? q.marks : 0),
        0,
      ),
    [paper, marks],
  );
  const wrongIndices = useMemo(
    () =>
      paper
        .map((q, i) => ({ q, i }))
        .filter(({ i }) => marks[i] === false)
        .map(({ i }) => i),
    [paper, marks],
  );
  const weakTopics = useMemo(() => {
    const map = new Map<
      string,
      { module: string; topic: string; count: number }
    >();
    for (const i of wrongIndices) {
      const q = paper[i];
      const k = `${q.module}::${q.topic}`;
      const cur = map.get(k) ?? { module: q.module, topic: q.topic, count: 0 };
      cur.count += 1;
      map.set(k, cur);
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [paper, wrongIndices]);

  // Countdown: auto-submits when the clock hits zero.
  useEffect(() => {
    if (phase !== "running") return;
    const id = window.setInterval(() => {
      const left = Math.max(
        0,
        Math.round((deadlineRef.current - Date.now()) / 1000),
      );
      setRemaining(left);
      if (left <= 0) {
        window.clearInterval(id);
        setPhase("marking");
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  function startMock() {
    const fresh = buildPaper(short);
    if (!fresh || fresh.length === 0 || !config) return;
    setPaper(fresh);
    setMarks(new Array(fresh.length).fill(null));
    setRevealed(new Array(fresh.length).fill(false));
    setNewAchievements([]);
    setDeckAdded(false);
    setXpGained(0);
    deadlineRef.current = Date.now() + config.durationMin * 60_000;
    setRemaining(config.durationMin * 60);
    setPhase("running");
  }

  async function finishMarking() {
    if (!paper.every((_, i) => marks[i] !== null)) return;
    const result = await recordQuizResult(
      paper.map((q) => ({ tagBase: q.question.tagBase })),
      marks.map((m) => m === true),
    );
    setXpGained(result.xpGained);
    setNewAchievements(result.newlyUnlocked);
    setPhase("report");
  }

  async function addWeakToDeck() {
    const db = getDB();
    for (const i of wrongIndices) {
      const q = paper[i];
      await db.addMistake(q.subject, q.module, q.topic, q.qIndex);
    }
    setDeckAdded(true);
  }

  if (!config) {
    return (
      <main>
        <EmptyState
          title="Unknown subject"
          subtitle="This mock test does not exist."
          action={
            <Link
              href="/mocks"
              className="flex min-h-[44px] items-center rounded-2xl bg-[var(--text)] text-[var(--bg)] px-6 text-sm font-semibold text-white"
            >
              Back to mocks
            </Link>
          }
        />
      </main>
    );
  }

  // ------------------------------------------------------------ ready ---

  if (phase === "ready") {
    return (
      <main className="flex flex-col gap-5">
        <header>
          <Link
            href="/mocks"
            className="flex min-h-[44px] w-fit items-center gap-1 px-1 text-sm font-medium text-[var(--text-dim)]"
          >
            <ChevronRightIcon className="h-4 w-4 rotate-180" />
            All mocks
          </Link>
          <h1 className="mt-2 text-[28px] font-bold leading-tight">
            {config.short}{" "}
            <span className="text-gradient">mock test</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--text-dim)]">{config.name}</p>
        </header>

        <GlassCard className="p-5">
          <div className="flex flex-wrap gap-2">
            <Pill variant="default">{config.totalMarks} marks</Pill>
            <Pill variant="default">{config.durationMin} min</Pill>
            {config.estimate ? (
              <Pill variant="important">Pattern estimate</Pill>
            ) : null}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-dim)]">
            {config.summary}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {config.parts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-2xl bg-[var(--track)] px-4 py-3"
              >
                <span className="text-sm font-semibold">
                  Part {p.id} - {p.title}
                </span>
                <span className="text-sm tabular-nums text-[var(--text-dim)]">
                  {p.count} x {p.marks} = {p.count * p.marks}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-sm font-semibold">How it works</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--text-dim)]">
            <li>The timer starts the moment you begin. Write answers on paper.</li>
            <li>When time ends, or you finish early, mark yourself honestly.</li>
            <li>Reveal each model answer, then tap Correct or Wrong.</li>
            <li>Wrong answers feed your mistake deck for spaced revision.</li>
          </ol>
        </GlassCard>

        <button
          type="button"
          onClick={startMock}
          className="flex min-h-[52px] items-center justify-center rounded-2xl bg-[var(--text)] text-[var(--bg)] text-base font-semibold text-white active:scale-[0.98]"
        >
          Start timed mock
        </button>
      </main>
    );
  }

  // ----------------------------------------------------------- running ---

  if (phase === "running") {
    return (
      <main className="flex flex-col gap-5">
        <div className="glass-strong sticky top-4 z-10 rounded-3xl p-4 shadow-[var(--shadow)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-dim)]">
                {config.short} mock - {config.totalMarks} marks
              </p>
              <p
                className={`text-2xl font-bold tabular-nums ${
                  remaining < 300 ? "text-rose-500" : "text-gradient"
                }`}
                role="timer"
                aria-label="Time remaining"
              >
                {fmtClock(remaining)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPhase("marking")}
              className="flex min-h-[44px] items-center rounded-2xl bg-[var(--text)] text-[var(--bg)] px-5 text-sm font-semibold text-white"
            >
              Finish and mark
            </button>
          </div>
        </div>

        {(["A", "B", "C"] as const).map((partId) => {
          const items = paper
            .map((q, i) => ({ q, i }))
            .filter(({ q }) => q.part === partId);
          if (items.length === 0) return null;
          return (
            <section key={partId} aria-label={PART_TITLES[partId]}>
              <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-[var(--text-dim)]">
                {PART_TITLES[partId]}
              </h2>
              <div className="flex flex-col gap-3">
                {items.map(({ q, i }) => (
                  <GlassCard key={i} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[15px] font-semibold leading-snug">
                        <span className="text-[var(--text-faint)]">
                          Q{i + 1}.{" "}
                        </span>
                        {q.question.q}
                      </p>
                      <Pill variant="default" className="shrink-0">
                        {q.marks}m
                      </Pill>
                    </div>
                    <p className="mt-2 text-xs text-[var(--text-faint)]">
                      Module {q.module} - {q.topic}
                      {q.question.years ? ` · ${q.question.years}` : ""}
                    </p>
                  </GlassCard>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    );
  }

  // ----------------------------------------------------------- marking ---

  if (phase === "marking") {
    const markedCount = marks.filter((m) => m !== null).length;
    return (
      <main className="flex flex-col gap-5">
        <header>
          <p className="text-sm text-[var(--text-dim)]">Be honest, it counts</p>
          <h1 className="mt-1 text-[28px] font-bold leading-tight">
            Mark <span className="text-gradient">yourself</span>
          </h1>
          <p className="mt-1 text-sm tabular-nums text-[var(--text-dim)]">
            {markedCount} of {paper.length} marked
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {paper.map((q, i) => (
            <GlassCard key={i} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[15px] font-semibold leading-snug">
                  <span className="text-[var(--text-faint)]">Q{i + 1}. </span>
                  {q.question.q}
                </p>
                <Pill variant="default" className="shrink-0">
                  {q.marks}m
                </Pill>
              </div>

              <button
                type="button"
                onClick={() =>
                  setRevealed((r) => {
                    const next = [...r];
                    next[i] = !next[i];
                    return next;
                  })
                }
                className="mt-3 flex min-h-[44px] items-center text-sm font-semibold text-[var(--text-dim)]"
                aria-expanded={revealed[i]}
              >
                {revealed[i] ? "Hide model answer" : "Show model answer"}
                <ChevronRightIcon
                  className={`h-4 w-4 transition-transform ${
                    revealed[i] ? "rotate-90" : ""
                  }`}
                />
              </button>
              {revealed[i] ? (
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[var(--text-dim)]">
                  {q.question.a.map((line, li) => (
                    <li key={li}>{line}</li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setMarks((m) => {
                      const next = [...m];
                      next[i] = true;
                      return next;
                    })
                  }
                  className={`flex min-h-[48px] items-center justify-center rounded-2xl text-sm font-semibold transition-all ${
                    marks[i] === true
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-900/30"
                      : "bg-[var(--track)] text-[var(--text-dim)] active:bg-[var(--track)]"
                  }`}
                  aria-pressed={marks[i] === true}
                >
                  Correct
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMarks((m) => {
                      const next = [...m];
                      next[i] = false;
                      return next;
                    })
                  }
                  className={`flex min-h-[48px] items-center justify-center rounded-2xl text-sm font-semibold transition-all ${
                    marks[i] === false
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-900/30"
                      : "bg-[var(--track)] text-[var(--text-dim)] active:bg-[var(--track)]"
                  }`}
                  aria-pressed={marks[i] === false}
                >
                  Wrong
                </button>
              </div>
            </GlassCard>
          ))}
        </div>

        <button
          type="button"
          onClick={finishMarking}
          disabled={markedCount < paper.length}
          className="flex min-h-[52px] items-center justify-center rounded-2xl bg-[var(--text)] text-[var(--bg)] text-base font-semibold text-white disabled:opacity-40 active:scale-[0.98]"
        >
          See my score ({markedCount}/{paper.length})
        </button>
      </main>
    );
  }

  // ------------------------------------------------------------ report ---

  const pct = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);
  const verdict =
    pct >= 80
      ? "Exam ready. Keep this form."
      : pct >= 60
        ? "Solid base. Fix the weak topics below."
        : pct >= 40
          ? "Shaky. Re-study the weak topics, then retake."
          : "Back to the notes. The weak topics list is your battle plan.";

  return (
    <main className="flex flex-col gap-5">
      <header>
        <p className="text-sm text-[var(--text-dim)]">{config.short} mock result</p>
        <h1 className="mt-1 text-[28px] font-bold leading-tight">
          <span className="text-gradient tabular-nums">
            {score}/{maxScore}
          </span>{" "}
          <span className="tabular-nums">({pct}%)</span>
        </h1>
        <p className="mt-1 text-sm text-[var(--text-dim)]">{verdict}</p>
      </header>

      <GlassCard className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">XP earned</span>
          <span className="text-xl font-bold tabular-nums text-gradient">
            +{xpGained}
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--text-faint)]">
          IMPORTANT 10 · REPEATED 15 · SURE MARK 20 per correct answer.
        </p>
      </GlassCard>

      {newAchievements.length > 0 ? (
        <GlassCard className="p-5">
          <p className="text-sm font-semibold">Achievements unlocked</p>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {newAchievements.map((a) => (
              <AchievementBadge
                key={a.id}
                icon={a.icon}
                name={a.name}
                desc={a.desc}
                unlocked
              />
            ))}
          </div>
        </GlassCard>
      ) : null}

      <section aria-label="Weak topics">
        <h2 className="mb-2 text-base font-semibold">Weak topics</h2>
        {weakTopics.length === 0 ? (
          <GlassCard className="p-5">
            <p className="text-sm text-[var(--text-dim)]">
              Flawless paper. Nothing to add to the mistake deck.
            </p>
          </GlassCard>
        ) : (
          <div className="flex flex-col gap-2">
            {weakTopics.map((w) => (
              <GlassCard key={`${w.module}-${w.topic}`} className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{w.topic}</p>
                    <p className="text-xs text-[var(--text-faint)]">
                      Module {w.module}
                    </p>
                  </div>
                  <Pill variant="important">
                    {w.count} {w.count === 1 ? "miss" : "misses"}
                  </Pill>
                </div>
              </GlassCard>
            ))}
            <button
              type="button"
              onClick={addWeakToDeck}
              disabled={deckAdded}
              className="flex min-h-[48px] items-center justify-center rounded-2xl border border-[var(--glass-border)] bg-[var(--track)] text-sm font-semibold disabled:opacity-50"
            >
              {deckAdded
                ? "Added to mistake deck"
                : `Send ${wrongIndices.length} to mistake deck`}
            </button>
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setPhase("ready");
            setPaper([]);
          }}
          className="flex min-h-[52px] items-center justify-center rounded-2xl border border-[var(--glass-border)] bg-[var(--track)] text-sm font-semibold"
        >
          Retake
        </button>
        <Link
          href="/mocks"
          className="flex min-h-[52px] items-center justify-center rounded-2xl bg-[var(--text)] text-[var(--bg)] text-sm font-semibold text-white"
        >
          All mocks
        </Link>
      </div>
    </main>
  );
}
