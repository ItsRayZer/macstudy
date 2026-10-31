// app/profile/page.tsx
// Profile = analytics dashboard: header, Daily Effort Tracker (gauge),
// Ability Tracker (per-subject bars), Syllabus Tracker (ring + rows), then
// the existing lifetime stats, daily goal, appearance, achievements and
// cloud sync. Every number is computed from real stored data, never invented.

"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  FlameIcon,
  GlassCard,
  ProgressBar,
  SegmentedTabs,
  UserIcon,
} from "../../components/ui";
import { StatCard } from "../../components/dashboard/StatCard";
import { AchievementBadge } from "../../components/dashboard/AchievementBadge";
import { useAppStore, type Theme } from "../../lib/store";
import { getDB, type StreakInfo } from "../../lib/db";
import {
  ACHIEVEMENTS,
  getDailyGoal,
  setDailyGoal,
  getGamifyCounters,
  DEFAULT_DAILY_GOAL,
} from "../../lib/gamify";
import {
  overallStats,
  subjectAbilities,
  type OverallStats,
  type SubjectAbility,
} from "../../lib/progress";

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
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function CoinIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
    </Icon>
  );
}

const MOTIVATION = [
  "Small steps, big marks.",
  "Consistency beats intensity.",
  "One more topic today.",
  "Show up. That is the whole trick.",
  "Your future self is watching.",
  "Slow progress is still progress.",
  "Exams reward the steady.",
];

function motivationForToday(): string {
  const now = new Date();
  const day =
    Math.floor(now.getTime() / 86_400_000) % MOTIVATION.length;
  return MOTIVATION[day];
}

/** Semicircular gauge, 0-100. Monochrome. */
function EffortGauge({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  const r = 80;
  const len = Math.PI * r;
  return (
    <div className="relative mx-auto w-full max-w-[240px]">
      <svg viewBox="0 0 200 112" className="w-full" role="img" aria-label={`Effort ${Math.round(v)} percent`}>
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="var(--track)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="var(--text)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${(v / 100) * len} ${len}`}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <p className="text-[30px] font-bold tabular-nums leading-none text-[var(--text)]">
          {Math.round(v)}
          <span className="text-[16px] font-semibold text-[var(--text-dim)]">%</span>
        </p>
        <p className="mt-1 text-[11px] uppercase tracking-widest text-[var(--text-faint)]">
          Effort index
        </p>
      </div>
    </div>
  );
}

/** Full ring gauge, 0-100. Monochrome. */
function SyllabusRing({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-[140px] w-[140px] shrink-0">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90" role="img" aria-label={`Syllabus ${Math.round(v)} percent`}>
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="var(--track)"
          strokeWidth="12"
        />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="var(--text)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(v / 100) * c} ${c}`}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[26px] font-bold tabular-nums leading-none text-[var(--text)]">
          {Math.round(v)}%
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const xpToday = useAppStore((s) => s.xpToday);
  const streak = useAppStore((s) => s.streak);

  const [stats, setStats] = useState<OverallStats | null>(null);
  const [abilities, setAbilities] = useState<SubjectAbility[]>([]);
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [quizCount, setQuizCount] = useState(0);
  const [sureCorrect, setSureCorrect] = useState(0);
  const [goal, setGoal] = useState(DEFAULT_DAILY_GOAL);
  const [goalInput, setGoalInput] = useState(String(DEFAULT_DAILY_GOAL));
  const [goalSaved, setGoalSaved] = useState(false);
  const [motivation, setMotivation] = useState(MOTIVATION[0]);

  useEffect(() => {
    // Deferred to an effect so prerendering never touches localStorage.
    const g = getDailyGoal();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGoal(g);
    setGoalInput(String(g));
    setMotivation(motivationForToday());
    const counters = getGamifyCounters();
    setQuizCount(counters.quizCount);
    setSureCorrect(counters.sureCorrect);

    let cancelled = false;
    (async () => {
      try {
        const db = getDB();
        const [s, st, ach, ab] = await Promise.all([
          overallStats(),
          db.getStreak(),
          db.getAchievements(),
          subjectAbilities(),
        ]);
        if (cancelled) return;
        setStats(s);
        setStreakInfo(st);
        setUnlockedIds(new Set(ach.map((a) => a.id)));
        setAbilities(ab);
      } catch {
        // stats stay empty; the page still renders
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function saveGoal() {
    const n = Number(goalInput);
    if (!Number.isFinite(n) || n <= 0) return;
    setDailyGoal(n);
    const saved = getDailyGoal();
    setGoal(saved);
    setGoalInput(String(saved));
    setGoalSaved(true);
    window.setTimeout(() => setGoalSaved(false), 2000);
  }

  const effort = goal > 0 ? Math.min(100, (xpToday / goal) * 100) : 0;
  const syllabusPct =
    stats && stats.totalTopics > 0
      ? Math.round((stats.completedTopics / stats.totalTopics) * 100)
      : 0;

  return (
    <main className="flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--track)] text-[var(--text)]">
            <UserIcon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-[20px] font-bold leading-tight text-[var(--text)]">
              Student
            </h1>
            <p className="text-[12px] text-[var(--text-faint)]">
              MGU BCA 3rd Sem
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex min-h-[36px] items-center gap-1.5 rounded-full border border-[var(--neon)]/30 bg-[var(--neon)]/10 px-3">
            <CoinIcon className="h-4 w-4 text-[var(--neon-soft)]" />
            <span className="text-[13px] font-bold tabular-nums text-[var(--text)]">
              {stats?.totalXP ?? 0}
            </span>
          </span>
          <span className="flex min-h-[36px] items-center gap-1.5 rounded-full border border-[var(--neon)]/30 bg-[var(--neon)]/10 px-3">
            <FlameIcon className="h-4 w-4 text-[var(--neon-soft)]" />
            <span className="text-[13px] font-bold tabular-nums text-[var(--text)]">
              {streak}
            </span>
          </span>
        </div>
      </header>

      <section aria-label="Daily Effort Tracker">
        <GlassCard>
          <h2 className="text-[15px] font-bold text-[var(--text)]">
            Daily Effort Tracker
          </h2>
          <div className="mt-2">
            <EffortGauge value={effort} />
          </div>
          <p className="mt-2 text-center text-[13px] tabular-nums text-[var(--text-dim)]">
            {xpToday} / {goal} XP today
          </p>
          <p className="mt-2 text-center text-[14px] font-medium text-[var(--text-dim)]">
            {motivation}
          </p>
        </GlassCard>
      </section>

      <section aria-label="Ability Tracker">
        <GlassCard>
          <h2 className="text-[15px] font-bold text-[var(--text)]">
            Ability Tracker
          </h2>
          <p className="mt-1 text-[12px] text-[var(--text-faint)]">
            From quiz scores and completion, per subject.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
            {abilities.map((a) => (
              <div key={a.short}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-[13px] font-semibold text-[var(--text)]">
                    {a.short === "PYTHON" ? "Python" : a.short}
                  </p>
                  <p className="text-[13px] font-bold tabular-nums text-[var(--text)]">
                    {a.ability}%
                  </p>
                </div>
                <ProgressBar value={a.ability} className="mt-1.5 h-1" />
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section aria-label="Syllabus Tracker">
        <GlassCard>
          <h2 className="text-[15px] font-bold text-[var(--text)]">
            Syllabus Tracker
          </h2>
          <div className="mt-3 flex items-center gap-5">
            <SyllabusRing value={syllabusPct} />
            <div>
              <p className="text-[15px] font-bold tabular-nums text-[var(--text)]">
                {stats?.completedTopics ?? 0}/{stats?.totalTopics ?? 0}
              </p>
              <p className="text-[12px] text-[var(--text-faint)]">
                topics completed
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-[var(--glass-border)] pt-4">
            {abilities.map((a) => (
              <div key={a.short}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-[13px] font-medium text-[var(--text-dim)]">
                    {a.name}
                  </p>
                  <p className="shrink-0 text-[12px] tabular-nums text-[var(--text-faint)]">
                    {a.completedTopics}/{a.totalTopics}
                  </p>
                </div>
                <ProgressBar
                  value={
                    a.totalTopics === 0
                      ? 0
                      : (a.completedTopics / a.totalTopics) * 100
                  }
                  className="mt-1.5 h-1"
                />
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section aria-label="Lifetime stats">
        <h2 className="mb-3 text-base font-semibold">Lifetime stats</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<span className="text-lg font-bold">XP</span>}
            iconClassName="bg-[var(--text)] text-[var(--bg)]"
            value={stats?.totalXP ?? 0}
            label="total XP"
          />
          <StatCard
            icon={<span className="text-lg font-bold">D</span>}
            iconClassName="bg-[var(--track)] text-[var(--text)]"
            value={streakInfo?.current ?? 0}
            label="day streak"
          />
          <StatCard
            icon={<span className="text-lg font-bold">B</span>}
            iconClassName="bg-[var(--track)] text-[var(--text)]"
            value={streakInfo?.longest ?? 0}
            label="best streak (days)"
          />
          <StatCard
            icon={<span className="text-lg font-bold">T</span>}
            iconClassName="bg-[var(--track)] text-[var(--text)]"
            value={`${stats?.completedTopics ?? 0}/${stats?.totalTopics ?? 0}`}
            label="topics done"
          />
          <StatCard
            icon={<span className="text-lg font-bold">Q</span>}
            iconClassName="bg-[var(--track)] text-[var(--text)]"
            value={quizCount}
            label="quizzes taken"
          />
          <StatCard
            icon={<span className="text-lg font-bold">S</span>}
            iconClassName="bg-[var(--track)] text-[var(--text)]"
            value={sureCorrect}
            label="sure marks correct"
          />
        </div>
      </section>

      <section aria-label="Daily XP goal">
        <h2 className="mb-3 text-base font-semibold">Daily XP goal</h2>
        <GlassCard className="p-4">
          <p className="text-sm text-[var(--text-dim)]">
            Current goal:{" "}
            <span className="font-bold text-[var(--text)]">{goal} XP</span> per
            day.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={10}
              max={1000}
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              aria-label="Daily XP goal"
              className="min-h-[48px] w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--track)] px-4 text-base tabular-nums text-[var(--text)] outline-none focus:border-[var(--text-dim)]"
            />
            <button
              type="button"
              onClick={saveGoal}
              className="flex min-h-[48px] shrink-0 items-center rounded-2xl bg-[var(--text)] px-6 text-sm font-semibold text-[var(--bg)]"
            >
              {goalSaved ? "Saved" : "Set goal"}
            </button>
          </div>
        </GlassCard>
      </section>

      <section aria-label="Appearance">
        <h2 className="mb-3 text-base font-semibold">Appearance</h2>
        <SegmentedTabs<Theme>
          ariaLabel="Theme"
          options={[
            { id: "dark", label: "Dark" },
            { id: "light", label: "Light" },
          ]}
          value={theme}
          onChange={setTheme}
        />
      </section>

      <section aria-label="Achievements">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Achievements</h2>
          <p className="text-sm tabular-nums text-[var(--text-dim)]">
            {unlockedIds.size}/{ACHIEVEMENTS.length}
          </p>
        </div>
        <GlassCard className="p-4">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
            {ACHIEVEMENTS.map((a) => (
              <AchievementBadge
                key={a.id}
                icon={a.icon}
                name={a.name}
                desc={a.desc}
                unlocked={unlockedIds.has(a.id)}
                size="lg"
              />
            ))}
          </div>
        </GlassCard>
      </section>

      <section aria-label="Cloud sync">
        <h2 className="mb-3 text-base font-semibold">Cloud sync</h2>
        <GlassCard className="p-5">
          <p className="text-sm font-semibold">Cloud sync coming soon</p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-dim)]">
            Your progress lives on this device for now. Sign-in and sync will
            arrive later - nothing to set up yet.
          </p>
          <span
            className="mt-4 flex min-h-[48px] cursor-not-allowed items-center justify-center rounded-2xl bg-[var(--track)] text-sm font-semibold text-[var(--text-faint)]"
            aria-disabled="true"
          >
            Sign in later
          </span>
        </GlassCard>
      </section>
    </main>
  );
}
