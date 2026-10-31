// app/page.tsx
// Home dashboard: greeting, nearest-exam countdown, XP vs daily goal, streak,
// continue-learning, per-subject progress, mastery map, achievements.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRightIcon,
  Countdown,
  EmptyState,
  GlassCard,
} from "../components/ui";
import { StatCard } from "../components/dashboard/StatCard";
import { XpBar } from "../components/dashboard/XpBar";
import { StreakBadge } from "../components/dashboard/StreakBadge";
import { AchievementBadge } from "../components/dashboard/AchievementBadge";
import { SubjectProgressRow } from "../components/dashboard/SubjectProgressRow";
import { useAppStore } from "../lib/store";
import { getDB, type StreakInfo } from "../lib/db";
import {
  ACHIEVEMENTS,
  getDailyGoal,
  DEFAULT_DAILY_GOAL,
} from "../lib/gamify";
import {
  computeSubjectProgress,
  firstIncompleteTopic,
  overallStats,
  topicStates,
  type ContinueTarget,
  type SubjectProgress,
  type TopicState,
} from "../lib/progress";
import { subjects } from "../lib/content";
import { nearestExam, type ExamInfo } from "../lib/exams";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const DOT_STYLES: Record<TopicState["status"], string> = {
  done: "bg-emerald-500",
  "in-progress": "bg-amber-500",
  todo: "bg-[var(--track)] border border-[var(--glass-border)]",
};

export default function HomePage() {
  const xpToday = useAppStore((s) => s.xpToday);
  const streak = useAppStore((s) => s.streak);
  const refreshFromDB = useAppStore((s) => s.refreshFromDB);

  const [greet, setGreet] = useState("Welcome back");
  const [goal, setGoal] = useState(DEFAULT_DAILY_GOAL);
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [progresses, setProgresses] = useState<SubjectProgress[]>([]);
  const [continueTarget, setContinueTarget] =
    useState<ContinueTarget | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [mastery, setMastery] = useState<Record<string, TopicState[]>>({});
  const [totalXP, setTotalXP] = useState(0);
  const [examNow, setExamNow] = useState<ExamInfo | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Deferred to an effect so prerendering never reads the clock or storage
    // (same pattern as Countdown in components/ui.tsx).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreet(greeting());
    setGoal(getDailyGoal());
    setExamNow(nearestExam(new Date()));
    let cancelled = false;

    refreshFromDB().catch(() => {
      // DB unavailable: stats stay at zero, the shell still renders.
    });

    (async () => {
      try {
        const db = getDB();
        const [st, ach, cont, stats] = await Promise.all([
          db.getStreak(),
          db.getAchievements(),
          firstIncompleteTopic(),
          overallStats(),
        ]);
        const progs = await Promise.all(
          subjects.map((s) => computeSubjectProgress(s.short)),
        );
        const maps = await Promise.all(
          subjects.map((s) => topicStates(s.short)),
        );
        if (cancelled) return;
        setStreakInfo(st);
        setUnlockedIds(new Set(ach.map((a) => a.id)));
        setContinueTarget(cont);
        setProgresses(progs.filter((p): p is SubjectProgress => p != null));
        setTotalXP(stats.totalXP);
        const m: Record<string, TopicState[]> = {};
        subjects.forEach((s, i) => {
          m[s.short] = maps[i];
        });
        setMastery(m);
      } catch {
        // keep the honest empty shell
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshFromDB]);

  const examLabel = examNow
    ? `${examNow.short} exam begins in`
    : "Exam session";

  return (
    <main className="flex flex-col gap-5">
      <header>
        <p className="text-sm text-[var(--text-dim)]">{greet}</p>
        <h1 className="mt-1 text-[28px] font-bold leading-tight">
          Ready to <span className="text-gradient">study?</span>
        </h1>
        <p className="mt-1 text-sm text-[var(--text-dim)]">MGU BCA 3rd Sem</p>
      </header>

      <section className="grid grid-cols-2 gap-3" aria-label="Today">
        <StreakBadge current={streak} freezes={streakInfo?.freezes ?? 0} />
        <StatCard
          icon={
            <span className="text-lg font-bold text-white tabular-nums">
              {totalXP}
            </span>
          }
          iconClassName="bg-gradient-to-br from-[#7C3AED] to-[#06B6D4]"
          value={`${xpToday} XP`}
          label="earned today"
        />
      </section>

      <XpBar today={xpToday} goal={goal} />

      {examNow ? (
        <Countdown target={examNow.at} label={examLabel} />
      ) : (
        <GlassCard>
          <p className="text-sm font-semibold">All exams done</p>
          <p className="mt-1 text-sm text-[var(--text-dim)]">
            The Nov 2026 session is over. Keep the streak alive with revision.
          </p>
        </GlassCard>
      )}

      <section aria-label="Continue learning">
        {continueTarget ? (
          <Link
            href="/subjects"
            className="glass block min-h-[44px] rounded-3xl p-5 shadow-[var(--shadow)] transition-transform active:scale-[0.98]"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-dim)]">
              Continue learning
            </p>
            <p className="mt-2 text-base font-semibold leading-snug">
              {continueTarget.topicTitle}
            </p>
            <p className="mt-1 text-sm text-[var(--text-dim)]">
              {continueTarget.subjectShort} · Module {continueTarget.moduleNum}:{" "}
              {continueTarget.moduleTitle}
            </p>
            <span className="mt-3 flex min-h-[44px] items-center gap-1 text-sm font-semibold text-[var(--text)]">
              Pick up where you left off
              <ChevronRightIcon className="h-4 w-4" />
            </span>
          </Link>
        ) : loaded ? (
          <EmptyState
            title="Syllabus complete"
            subtitle="Every topic is done. Run a mock test to lock it in."
            action={
              <Link
                href="/mocks"
                className="flex min-h-[44px] items-center rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] px-6 text-sm font-semibold text-white"
              >
                Open mock tests
              </Link>
            }
          />
        ) : null}
      </section>

      <section aria-label="Subjects">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Subjects</h2>
          <Link
            href="/subjects"
            className="flex min-h-[44px] items-center gap-1 px-2 text-sm font-medium text-[var(--text-dim)]"
          >
            View all
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {progresses.map((p) => {
            const exam = subjects.find((s) => s.short === p.short)?.exam;
            return (
              <SubjectProgressRow
                key={p.short}
                short={p.short}
                name={p.name}
                exam={exam ?? ""}
                percent={p.percent}
                done={p.completedTopics}
                total={p.totalTopics}
                href="/subjects"
              />
            );
          })}
        </div>
      </section>

      <section aria-label="Mastery map">
        <h2 className="mb-1 text-base font-semibold">Mastery map</h2>
        <p className="mb-3 text-xs text-[var(--text-faint)]">
          One dot per topic: green done, amber in progress, gray not started.
        </p>
        <div className="flex flex-col gap-3">
          {subjects.map((s) => (
            <GlassCard key={s.short} className="p-4">
              <p className="text-xs font-bold tracking-wide text-[var(--text-dim)]">
                {s.short}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5" role="list">
                {(mastery[s.short] ?? []).map((t, i) => (
                  <span
                    key={`${t.moduleNum}-${i}`}
                    role="listitem"
                    title={`${s.short} M${t.moduleNum}: ${t.topicTitle} (${t.status.replace("-", " ")})`}
                    className={`h-3 w-3 rounded-full ${DOT_STYLES[t.status]}`}
                  />
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section aria-label="Achievements">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Achievements</h2>
          <Link
            href="/profile"
            className="flex min-h-[44px] items-center gap-1 px-2 text-sm font-medium text-[var(--text-dim)]"
          >
            {unlockedIds.size}/{ACHIEVEMENTS.length}
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <GlassCard className="p-4">
          <div className="grid grid-cols-4 gap-3">
            {ACHIEVEMENTS.map((a) => (
              <AchievementBadge
                key={a.id}
                icon={a.icon}
                name={a.name}
                desc={a.desc}
                unlocked={unlockedIds.has(a.id)}
              />
            ))}
          </div>
        </GlassCard>
      </section>

      <section aria-label="Mock tests shortcut">
        <Link
          href="/mocks"
          className="glass flex min-h-[44px] items-center justify-between rounded-3xl p-5 shadow-[var(--shadow)] transition-transform active:scale-[0.98]"
        >
          <span>
            <span className="block text-sm font-semibold">Mock tests</span>
            <span className="block text-xs text-[var(--text-dim)]">
              Timed papers built from the question bank
            </span>
          </span>
          <ChevronRightIcon className="h-5 w-5 text-[var(--text-faint)]" />
        </Link>
      </section>
    </main>
  );
}
