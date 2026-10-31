// app/profile/page.tsx
// Profile: lifetime stats, achievement wall, theme toggle, daily XP goal,
// and an honest cloud-sync placeholder (no fake auth).

"use client";

import { useEffect, useState } from "react";
import {
  GlassCard,
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
import { overallStats, type OverallStats } from "../../lib/progress";

export default function ProfilePage() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  const [stats, setStats] = useState<OverallStats | null>(null);
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [quizCount, setQuizCount] = useState(0);
  const [sureCorrect, setSureCorrect] = useState(0);
  const [goal, setGoal] = useState(DEFAULT_DAILY_GOAL);
  const [goalInput, setGoalInput] = useState(String(DEFAULT_DAILY_GOAL));
  const [goalSaved, setGoalSaved] = useState(false);

  useEffect(() => {
    // Deferred to an effect so prerendering never touches localStorage.
    const g = getDailyGoal();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGoal(g);
    setGoalInput(String(g));
    const counters = getGamifyCounters();
    setQuizCount(counters.quizCount);
    setSureCorrect(counters.sureCorrect);

    let cancelled = false;
    (async () => {
      try {
        const db = getDB();
        const [s, st, ach] = await Promise.all([
          overallStats(),
          db.getStreak(),
          db.getAchievements(),
        ]);
        if (cancelled) return;
        setStats(s);
        setStreakInfo(st);
        setUnlockedIds(new Set(ach.map((a) => a.id)));
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

  return (
    <main className="flex flex-col gap-5">
      <header className="flex items-center gap-4">
        <span className="glass flex h-16 w-16 items-center justify-center rounded-3xl">
          <UserIcon className="h-8 w-8 text-[var(--text-dim)]" />
        </span>
        <div>
          <h1 className="text-[28px] font-bold leading-tight">Profile</h1>
          <p className="text-sm text-[var(--text-dim)]">
            MGU BCA 3rd Sem · Class of 2029
          </p>
        </div>
      </header>

      <section aria-label="Lifetime stats">
        <h2 className="mb-3 text-base font-semibold">Lifetime stats</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<span className="text-lg font-bold text-white">XP</span>}
            iconClassName="bg-[var(--text)] text-[var(--bg)]"
            value={stats?.totalXP ?? 0}
            label="total XP"
          />
          <StatCard
            icon={<span className="text-lg font-bold text-white">D</span>}
            iconClassName="bg-[var(--track)] text-[var(--text)]"
            value={streakInfo?.current ?? 0}
            label="day streak"
          />
          <StatCard
            icon={<span className="text-lg font-bold text-white">B</span>}
            iconClassName="bg-[var(--track)] text-[var(--text)]"
            value={streakInfo?.longest ?? 0}
            label="best streak (days)"
          />
          <StatCard
            icon={<span className="text-lg font-bold text-white">T</span>}
            iconClassName="bg-[var(--track)] text-[var(--text)]"
            value={`${stats?.completedTopics ?? 0}/${stats?.totalTopics ?? 0}`}
            label="topics done"
          />
          <StatCard
            icon={<span className="text-lg font-bold text-white">Q</span>}
            iconClassName="bg-[var(--track)] text-[var(--text)]"
            value={quizCount}
            label="quizzes taken"
          />
          <StatCard
            icon={<span className="text-lg font-bold text-white">S</span>}
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
              className="min-h-[48px] w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--track)] px-4 text-base tabular-nums text-[var(--text)] outline-none focus:border-[#7C3AED]"
            />
            <button
              type="button"
              onClick={saveGoal}
              className="flex min-h-[48px] shrink-0 items-center rounded-2xl bg-[var(--text)] text-[var(--bg)] px-6 text-sm font-semibold text-white"
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
