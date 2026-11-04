// lib/db.ts
// BcaEasy shared progress database.
//
// WORKER CONTRACT (stable API - do not rename methods or change signatures):
//   getDB(): ProgressDB   singleton. Returns SupabaseDB only when
//                         NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
//                         are both set; otherwise returns LocalDB.
//   isCloud(): boolean    true when the Supabase env vars are configured.
//
// ProgressDB methods (every method is async):
//   Topic progress : getTopicProgress, setTopicProgress
//   Bookmarks      : getBookmarks, toggleBookmark
//   Mistake deck   : getMistakes, addMistake, resolveMistake
//   XP             : getXP, addXP, getDailyXP
//   Streak         : getStreak, touchStreak
//   Achievements   : getAchievements, unlockAchievement
//
// LocalDB persists to localStorage under the "macstudy:" namespace and is safe
// to call during SSR (it returns defaults when window is unavailable).
// SupabaseDB uses @supabase/supabase-js against the tables in
// supabase/schema.sql. When Supabase is configured but no user is signed in
// yet, SupabaseDB transparently falls back to LocalDB (offline-first); the
// auth worker wires sign-in and sync later. Achievements always stay local
// because schema v1 has no achievements table.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------- types ---

export interface TopicProgress {
  percent: number; // 0-100
  quizBest: number; // best quiz score recorded for the topic
  completed: boolean;
  updatedAt: string; // ISO timestamp
}

export interface Bookmark {
  subject: string;
  module: string;
  topic: string;
  qIndex: number;
  createdAt: string;
}

export interface MistakeEntry {
  subject: string;
  module: string;
  topic: string;
  qIndex: number;
  wrongCount: number;
  nextReview: string; // YYYY-MM-DD (local)
  createdAt: string;
}

export interface StreakInfo {
  current: number;
  longest: number;
  lastDay: string | null; // YYYY-MM-DD (local)
  freezes: number;
}

export interface Achievement {
  id: string;
  unlockedAt: string;
}

export interface ProgressDB {
  // topic progress
  getTopicProgress(
    subject: string,
    module: string,
    topic: string,
  ): Promise<TopicProgress | null>;
  setTopicProgress(
    subject: string,
    module: string,
    topic: string,
    data: Partial<Omit<TopicProgress, "updatedAt">>,
  ): Promise<TopicProgress>;
  // bookmarks
  getBookmarks(subject?: string): Promise<Bookmark[]>;
  toggleBookmark(
    subject: string,
    module: string,
    topic: string,
    qIndex: number,
  ): Promise<boolean>; // true when the item is now bookmarked
  // mistake deck (spaced repetition)
  getMistakes(dueOnly?: boolean): Promise<MistakeEntry[]>;
  addMistake(
    subject: string,
    module: string,
    topic: string,
    qIndex: number,
  ): Promise<MistakeEntry>;
  resolveMistake(
    subject: string,
    module: string,
    topic: string,
    qIndex: number,
  ): Promise<void>;
  // xp
  getXP(): Promise<number>; // lifetime total
  addXP(amount: number, reason?: string): Promise<number>; // returns new total
  getDailyXP(date?: string): Promise<number>; // YYYY-MM-DD, defaults to today
  // streak
  getStreak(): Promise<StreakInfo>;
  touchStreak(): Promise<StreakInfo>; // records today, extends or resets
  // achievements
  getAchievements(): Promise<Achievement[]>;
  unlockAchievement(id: string): Promise<boolean>; // true when newly unlocked
}

// ------------------------------------------------------------- helpers ---

/** Local calendar day as YYYY-MM-DD. Exported for workers that need it. */
export function localDay(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function shiftDay(day: string, n: number): string {
  const [y, m, d] = day.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return localDay(dt);
}

// ---------------------------------------------------------------- LocalDB ---

const NS = "macstudy:";

function canStore(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

function read<T>(key: string, fallback: T): T {
  if (!canStore()) return fallback;
  try {
    const raw = window.localStorage.getItem(NS + key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    // storage full or blocked: keep the app usable, data stays in memory only
  }
}

interface XpEvent {
  date: string; // YYYY-MM-DD
  amount: number;
  reason: string;
  at: string; // ISO timestamp
}

export class LocalDB implements ProgressDB {
  private topicKey(subject: string, module: string, topic: string): string {
    return [subject, module, topic].join("::");
  }

  private mistakeKey(
    subject: string,
    module: string,
    topic: string,
    qIndex: number,
  ): string {
    return [subject, module, topic, qIndex].join("::");
  }

  async getTopicProgress(
    subject: string,
    module: string,
    topic: string,
  ): Promise<TopicProgress | null> {
    const all = read<Record<string, TopicProgress>>("topic-progress", {});
    return all[this.topicKey(subject, module, topic)] ?? null;
  }

  async setTopicProgress(
    subject: string,
    module: string,
    topic: string,
    data: Partial<Omit<TopicProgress, "updatedAt">>,
  ): Promise<TopicProgress> {
    const all = read<Record<string, TopicProgress>>("topic-progress", {});
    const k = this.topicKey(subject, module, topic);
    const prev = all[k] ?? {
      percent: 0,
      quizBest: 0,
      completed: false,
      updatedAt: new Date(0).toISOString(),
    };
    const next: TopicProgress = {
      percent: data.percent ?? prev.percent,
      quizBest: Math.max(prev.quizBest, data.quizBest ?? prev.quizBest),
      completed: data.completed ?? prev.completed,
      updatedAt: new Date().toISOString(),
    };
    all[k] = next;
    write("topic-progress", all);
    return next;
  }

  async getBookmarks(subject?: string): Promise<Bookmark[]> {
    const all = read<Bookmark[]>("bookmarks", []);
    return subject ? all.filter((b) => b.subject === subject) : all;
  }

  async toggleBookmark(
    subject: string,
    module: string,
    topic: string,
    qIndex: number,
  ): Promise<boolean> {
    const all = read<Bookmark[]>("bookmarks", []);
    const i = all.findIndex(
      (b) =>
        b.subject === subject &&
        b.module === module &&
        b.topic === topic &&
        b.qIndex === qIndex,
    );
    if (i >= 0) {
      all.splice(i, 1);
      write("bookmarks", all);
      return false;
    }
    all.push({
      subject,
      module,
      topic,
      qIndex,
      createdAt: new Date().toISOString(),
    });
    write("bookmarks", all);
    return true;
  }

  async getMistakes(dueOnly = false): Promise<MistakeEntry[]> {
    const all = read<MistakeEntry[]>("mistakes", []);
    if (!dueOnly) return all;
    const t = localDay();
    return all.filter((m) => m.nextReview <= t);
  }

  async addMistake(
    subject: string,
    module: string,
    topic: string,
    qIndex: number,
  ): Promise<MistakeEntry> {
    const all = read<MistakeEntry[]>("mistakes", []);
    const k = this.mistakeKey(subject, module, topic, qIndex);
    const i = all.findIndex(
      (m) => this.mistakeKey(m.subject, m.module, m.topic, m.qIndex) === k,
    );
    const now = new Date().toISOString();
    let entry: MistakeEntry;
    if (i >= 0) {
      entry = {
        ...all[i],
        wrongCount: all[i].wrongCount + 1,
        nextReview: shiftDay(localDay(), 1),
      };
      all[i] = entry;
    } else {
      entry = {
        subject,
        module,
        topic,
        qIndex,
        wrongCount: 1,
        nextReview: shiftDay(localDay(), 1),
        createdAt: now,
      };
      all.push(entry);
    }
    write("mistakes", all);
    return entry;
  }

  async resolveMistake(
    subject: string,
    module: string,
    topic: string,
    qIndex: number,
  ): Promise<void> {
    const all = read<MistakeEntry[]>("mistakes", []);
    const k = this.mistakeKey(subject, module, topic, qIndex);
    write(
      "mistakes",
      all.filter(
        (m) => this.mistakeKey(m.subject, m.module, m.topic, m.qIndex) !== k,
      ),
    );
  }

  async getXP(): Promise<number> {
    return read<number>("xp-total", 0);
  }

  async addXP(amount: number, reason = ""): Promise<number> {
    const total = read<number>("xp-total", 0) + amount;
    write("xp-total", total);
    const hist = read<XpEvent[]>("xp-history", []);
    hist.push({
      date: localDay(),
      amount,
      reason,
      at: new Date().toISOString(),
    });
    write("xp-history", hist);
    return total;
  }

  async getDailyXP(date: string = localDay()): Promise<number> {
    const hist = read<XpEvent[]>("xp-history", []);
    return hist
      .filter((h) => h.date === date)
      .reduce((sum, h) => sum + h.amount, 0);
  }

  async getStreak(): Promise<StreakInfo> {
    return read<StreakInfo>("streak", {
      current: 0,
      longest: 0,
      lastDay: null,
      freezes: 0,
    });
  }

  async touchStreak(): Promise<StreakInfo> {
    const s = await this.getStreak();
    const today = localDay();
    if (s.lastDay === today) return s;
    const next: StreakInfo =
      s.lastDay === shiftDay(today, -1)
        ? {
            ...s,
            current: s.current + 1,
            longest: Math.max(s.longest, s.current + 1),
            lastDay: today,
          }
        : {
            ...s,
            current: 1,
            longest: Math.max(s.longest, 1),
            lastDay: today,
          };
    write("streak", next);
    return next;
  }

  async getAchievements(): Promise<Achievement[]> {
    return read<Achievement[]>("achievements", []);
  }

  async unlockAchievement(id: string): Promise<boolean> {
    const all = read<Achievement[]>("achievements", []);
    if (all.some((a) => a.id === id)) return false;
    all.push({ id, unlockedAt: new Date().toISOString() });
    write("achievements", all);
    return true;
  }
}

// ------------------------------------------------------------- SupabaseDB ---

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True only when both Supabase env vars are configured. */
export function isCloud(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export class SupabaseDB implements ProgressDB {
  private client: SupabaseClient;
  private fallback = new LocalDB();

  constructor() {
    if (!isCloud()) {
      throw new Error(
        "Supabase env vars are not set. Use getDB() instead of constructing SupabaseDB directly.",
      );
    }
    this.client = createClient(
      SUPABASE_URL as string,
      SUPABASE_ANON_KEY as string,
    );
  }

  private async uid(): Promise<string | null> {
    try {
      const { data } = await this.client.auth.getUser();
      return data.user?.id ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Runs the cloud query when a user is signed in, otherwise delegates to the
   * local offline store. Cloud errors propagate; they never silently fall back.
   */
  private async cloud<T>(
    fn: (uid: string) => Promise<T>,
    localFn: () => Promise<T>,
  ): Promise<T> {
    const id = await this.uid();
    if (!id) return localFn();
    return fn(id);
  }

  async getTopicProgress(
    subject: string,
    module: string,
    topic: string,
  ): Promise<TopicProgress | null> {
    return this.cloud(
      async (uid) => {
        const { data, error } = await this.client
          .from("topic_progress")
          .select("percent, quiz_best, completed, updated_at")
          .eq("user_id", uid)
          .eq("subject", subject)
          .eq("module", module)
          .eq("topic", topic)
          .maybeSingle();
        if (error) throw error;
        if (!data) return null;
        return {
          percent: data.percent,
          quizBest: data.quiz_best,
          completed: data.completed,
          updatedAt: data.updated_at,
        };
      },
      () => this.fallback.getTopicProgress(subject, module, topic),
    );
  }

  async setTopicProgress(
    subject: string,
    module: string,
    topic: string,
    data: Partial<Omit<TopicProgress, "updatedAt">>,
  ): Promise<TopicProgress> {
    return this.cloud(
      async (uid) => {
        const prev = await this.fallback.getTopicProgress(subject, module, topic);
        const row = {
          user_id: uid,
          subject,
          module,
          topic,
          percent: data.percent ?? prev?.percent ?? 0,
          quiz_best: Math.max(prev?.quizBest ?? 0, data.quizBest ?? prev?.quizBest ?? 0),
          completed: data.completed ?? prev?.completed ?? false,
          updated_at: new Date().toISOString(),
        };
        const { error } = await this.client
          .from("topic_progress")
          .upsert(row, { onConflict: "user_id,subject,module,topic" });
        if (error) throw error;
        return {
          percent: row.percent,
          quizBest: row.quiz_best,
          completed: row.completed,
          updatedAt: row.updated_at,
        };
      },
      () => this.fallback.setTopicProgress(subject, module, topic, data),
    );
  }

  async getBookmarks(subject?: string): Promise<Bookmark[]> {
    return this.cloud(
      async (uid) => {
        let q = this.client
          .from("bookmarks")
          .select("subject, module, topic, q_index, created_at")
          .eq("user_id", uid)
          .order("created_at", { ascending: false });
        if (subject) q = q.eq("subject", subject);
        const { data, error } = await q;
        if (error) throw error;
        return (data ?? []).map((r) => ({
          subject: r.subject,
          module: r.module,
          topic: r.topic,
          qIndex: r.q_index,
          createdAt: r.created_at,
        }));
      },
      () => this.fallback.getBookmarks(subject),
    );
  }

  async toggleBookmark(
    subject: string,
    module: string,
    topic: string,
    qIndex: number,
  ): Promise<boolean> {
    return this.cloud(
      async (uid) => {
        const match = {
          user_id: uid,
          subject,
          module,
          topic,
          q_index: qIndex,
        };
        const { data, error: readError } = await this.client
          .from("bookmarks")
          .select("q_index")
          .match(match)
          .maybeSingle();
        if (readError) throw readError;
        if (data) {
          const { error } = await this.client
            .from("bookmarks")
            .delete()
            .match(match);
          if (error) throw error;
          return false;
        }
        const { error } = await this.client.from("bookmarks").insert(match);
        if (error) throw error;
        return true;
      },
      () => this.fallback.toggleBookmark(subject, module, topic, qIndex),
    );
  }

  async getMistakes(dueOnly = false): Promise<MistakeEntry[]> {
    return this.cloud(
      async (uid) => {
        let q = this.client
          .from("mistake_deck")
          .select(
            "subject, module, topic, q_index, wrong_count, next_review, created_at",
          )
          .eq("user_id", uid)
          .order("next_review", { ascending: true });
        if (dueOnly) q = q.lte("next_review", localDay());
        const { data, error } = await q;
        if (error) throw error;
        return (data ?? []).map((r) => ({
          subject: r.subject,
          module: r.module,
          topic: r.topic,
          qIndex: r.q_index,
          wrongCount: r.wrong_count,
          nextReview: r.next_review,
          createdAt: r.created_at,
        }));
      },
      () => this.fallback.getMistakes(dueOnly),
    );
  }

  async addMistake(
    subject: string,
    module: string,
    topic: string,
    qIndex: number,
  ): Promise<MistakeEntry> {
    return this.cloud(
      async (uid) => {
        const match = {
          user_id: uid,
          subject,
          module,
          topic,
          q_index: qIndex,
        };
        const { data, error: readError } = await this.client
          .from("mistake_deck")
          .select("wrong_count, created_at")
          .match(match)
          .maybeSingle();
        if (readError) throw readError;
        const row = {
          ...match,
          wrong_count: (data?.wrong_count ?? 0) + 1,
          next_review: shiftDay(localDay(), 1),
          created_at: data?.created_at ?? new Date().toISOString(),
        };
        const { error } = await this.client
          .from("mistake_deck")
          .upsert(row, { onConflict: "user_id,subject,module,topic,q_index" });
        if (error) throw error;
        return {
          subject,
          module,
          topic,
          qIndex,
          wrongCount: row.wrong_count,
          nextReview: row.next_review,
          createdAt: row.created_at,
        };
      },
      () => this.fallback.addMistake(subject, module, topic, qIndex),
    );
  }

  async resolveMistake(
    subject: string,
    module: string,
    topic: string,
    qIndex: number,
  ): Promise<void> {
    return this.cloud(
      async (uid) => {
        const { error } = await this.client.from("mistake_deck").delete().match({
          user_id: uid,
          subject,
          module,
          topic,
          q_index: qIndex,
        });
        if (error) throw error;
      },
      () => this.fallback.resolveMistake(subject, module, topic, qIndex),
    );
  }

  async getXP(): Promise<number> {
    return this.cloud(
      async (uid) => {
        const { data, error } = await this.client
          .from("xp_history")
          .select("amount")
          .eq("user_id", uid);
        if (error) throw error;
        const cloudTotal = (data ?? []).reduce(
          (sum, r) => sum + (r.amount ?? 0),
          0,
        );
        // Never lose local XP: take the higher of cloud and local.
        const localTotal = await this.fallback.getXP();
        return Math.max(cloudTotal, localTotal);
      },
      () => this.fallback.getXP(),
    );
  }

  async addXP(amount: number, reason = ""): Promise<number> {
    return this.cloud(
      async (uid) => {
        const { error } = await this.client
          .from("xp_history")
          .insert({ user_id: uid, amount, reason });
        if (error) throw error;
        // Keep local in sync so XP survives sign-out and offline.
        await this.fallback.addXP(amount, reason);
        const total = await this.getXP();
        return total;
      },
      () => this.fallback.addXP(amount, reason),
    );
  }

  async getDailyXP(date: string = localDay()): Promise<number> {
    return this.cloud(
      async (uid) => {
        const { data, error } = await this.client
          .from("xp_history")
          .select("amount")
          .eq("user_id", uid)
          .gte("created_at", `${date}T00:00:00`)
          .lt("created_at", `${shiftDay(date, 1)}T00:00:00`);
        if (error) throw error;
        return (data ?? []).reduce((sum, r) => sum + (r.amount ?? 0), 0);
      },
      () => this.fallback.getDailyXP(date),
    );
  }

  async getStreak(): Promise<StreakInfo> {
    return this.cloud(
      async (uid) => {
        const { data, error } = await this.client
          .from("streaks")
          .select("current, longest, last_day, freezes")
          .eq("user_id", uid)
          .maybeSingle();
        if (error) throw error;
        if (!data)
          return { current: 0, longest: 0, lastDay: null, freezes: 0 };
        return {
          current: data.current,
          longest: data.longest,
          lastDay: data.last_day,
          freezes: data.freezes,
        };
      },
      () => this.fallback.getStreak(),
    );
  }

  async touchStreak(): Promise<StreakInfo> {
    return this.cloud(
      async (uid) => {
        const s = await this.getStreak();
        const today = localDay();
        if (s.lastDay === today) return s;
        const next: StreakInfo =
          s.lastDay === shiftDay(today, -1)
            ? {
                ...s,
                current: s.current + 1,
                longest: Math.max(s.longest, s.current + 1),
                lastDay: today,
              }
            : {
                ...s,
                current: 1,
                longest: Math.max(s.longest, 1),
                lastDay: today,
              };
        const { error } = await this.client.from("streaks").upsert(
          {
            user_id: uid,
            current: next.current,
            longest: next.longest,
            last_day: next.lastDay,
            freezes: next.freezes,
          },
          { onConflict: "user_id" },
        );
        if (error) throw error;
        return next;
      },
      () => this.fallback.touchStreak(),
    );
  }

  // Schema v1 has no achievements table, so achievements stay local for now.
  async getAchievements(): Promise<Achievement[]> {
    return this.fallback.getAchievements();
  }

  async unlockAchievement(id: string): Promise<boolean> {
    return this.fallback.unlockAchievement(id);
  }
}

// ------------------------------------------------------------------ getDB ---

let instance: ProgressDB | null = null;

/** Singleton. SupabaseDB when cloud env vars are set, LocalDB otherwise. */
export function getDB(): ProgressDB {
  if (!instance) {
    instance = isCloud() ? new SupabaseDB() : new LocalDB();
  }
  return instance;
}

// ------------------------------------------------------- migrateLocalToCloud ---

const MIGRATED_KEY = "macstudy:cloud-migrated";

/**
 * Uploads all local progress to the signed-in user's cloud account.
 * Called once after the first Google sign-in. Safe to call repeatedly:
 * it skips when already migrated for this device, and only uploads
 * when a cloud user is actually signed in.
 */
export async function migrateLocalToCloud(): Promise<{
  migrated: boolean;
  counts: Record<string, number>;
}> {
  const counts: Record<string, number> = {
    topics: 0,
    bookmarks: 0,
    mistakes: 0,
    xp: 0,
  };
  try {
    if (typeof window === "undefined") return { migrated: false, counts };
    if (window.localStorage.getItem(MIGRATED_KEY) === "1") {
      return { migrated: false, counts };
    }
    if (!isCloud()) return { migrated: false, counts };

    const local = new LocalDB();
    const cloud = getDB();
    // getDB() returns SupabaseDB when cloud is configured; its `cloud()`
    // helper falls back to local when nobody is signed in. We need to know
    // a user is actually signed in before uploading.
    if (!(cloud instanceof SupabaseDB)) return { migrated: false, counts };
    const uid = await (cloud as SupabaseDB)["uid"]();
    if (!uid) return { migrated: false, counts };

    // --- topic progress: read every local topic, upsert to cloud ---
    const allTopics = read<Record<string, TopicProgress>>("topic-progress", {});
    for (const [key, tp] of Object.entries(allTopics)) {
      const [subject, module, topic] = key.split("::");
      if (!subject || !module || !topic) continue;
      // Only upload topics with real progress.
      if (tp.percent <= 0 && !tp.completed && tp.quizBest <= 0) continue;
      await cloud.setTopicProgress(subject, module, topic, {
        percent: tp.percent,
        quizBest: tp.quizBest,
        completed: tp.completed,
      });
      counts.topics++;
    }

    // --- bookmarks ---
    const bookmarks = await local.getBookmarks();
    for (const b of bookmarks) {
      // toggleBookmark would remove existing ones; use direct upsert via
      // setTopicProgress-free path: check then add.
      const existing = await cloud.getBookmarks();
      const found = existing.some(
        (e) =>
          e.subject === b.subject &&
          e.module === b.module &&
          e.topic === b.topic &&
          e.qIndex === b.qIndex,
      );
      if (!found) {
        await cloud.toggleBookmark(b.subject, b.module, b.topic, b.qIndex);
        counts.bookmarks++;
      }
    }

    // --- mistake deck ---
    const mistakes = await local.getMistakes(false);
    for (const m of mistakes) {
      const existing = await cloud.getMistakes(false);
      const found = existing.some(
        (e) =>
          e.subject === m.subject &&
          e.module === m.module &&
          e.topic === m.topic &&
          e.qIndex === m.qIndex,
      );
      if (!found) {
        await cloud.addMistake(m.subject, m.module, m.topic, m.qIndex);
        counts.mistakes++;
      }
    }

    // --- XP: replay local xp history as a single grant ---
    const localXP = await local.getXP();
    if (localXP > 0) {
      const cloudXP = await cloud.getXP();
      if (cloudXP < localXP) {
        await cloud.addXP(localXP - cloudXP, "migrated from device");
        counts.xp = localXP - cloudXP;
      }
    }

    // --- streak: keep the better one ---
    const localStreak = await local.getStreak();
    const cloudStreak = await cloud.getStreak();
    if (
      localStreak.current > cloudStreak.current ||
      localStreak.longest > cloudStreak.longest
    ) {
      // touchStreak only increments; directly upsert via client when better.
      // Fall back to keeping cloud when local is not better.
      const sb = cloud as SupabaseDB;
      const client = (sb as unknown as { client: SupabaseClient }).client;
      await client.from("streaks").upsert(
        {
          user_id: uid,
          current: Math.max(localStreak.current, cloudStreak.current),
          longest: Math.max(localStreak.longest, cloudStreak.longest),
          last_day: localStreak.lastDay ?? cloudStreak.lastDay,
          freezes: Math.max(localStreak.freezes, cloudStreak.freezes),
        },
        { onConflict: "user_id" },
      );
    }

    window.localStorage.setItem(MIGRATED_KEY, "1");
    return { migrated: true, counts };
  } catch {
    return { migrated: false, counts };
  }
}
