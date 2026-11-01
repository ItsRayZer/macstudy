// app/subjects/[short]/mindmap/client.tsx
// Subject mind map: one expandable tree per subject - Subject (root) ->
// Modules (branches) -> Topics (leaves). Every topic shows its real status
// from the progress store; tapping a topic jumps to its Learn page.
// Monochrome + neon green, liquid glass, zero emojis.

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EmptyState, ProgressBar, TabBarSpacer } from "../../../../components/ui";
import { getDB } from "../../../../lib/db";
import {
  getSubjectLocal,
  topicHref,
} from "../../../../lib/study";
import { subjects } from "@/src/content/subjects";

function BackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className={className ?? "h-6 w-6"} aria-hidden="true">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function ChevronIcon({ className, open }: { className?: string; open?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round"
      className={`${className ?? "h-5 w-5"} transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}
      strokeLinecap="round" strokeLinejoin="round" className={className ?? "h-4 w-4"} aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

interface TopicState {
  completed: boolean;
  percent: number;
}

export function MindMapClient({ short }: { short: string }) {
  const subject = getSubjectLocal(short) ?? subjects[0];
  const [states, setStates] = useState<Record<string, TopicState>>({});
  const [openMods, setOpenMods] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      const db = getDB();
      const entries: [string, TopicState][] = [];
      for (const m of subject.modules) {
        const rows = await Promise.all(
          m.topics.map(async (t) => {
            const p = await db.getTopicProgress(subject.short, m.num, t.title);
            return [t.title, { completed: p?.completed ?? false, percent: p?.percent ?? 0 }] as [string, TopicState];
          }),
        );
        entries.push(...rows.map(([title, st]) => [`${m.num}::${title}`, st] as [string, TopicState]));
      }
      if (!live) return;
      const map = Object.fromEntries(entries);
      setStates(map);
      // Default-expand the module holding the next recommended topic.
      const firstOpen = subject.modules.find((m) =>
        m.topics.some((t) => !map[`${m.num}::${t.title}`]?.completed),
      );
      setOpenMods(firstOpen ? { [firstOpen.num]: true } : {});
      setLoaded(true);
    })().catch(() => {
      if (live) setLoaded(true);
    });
    return () => {
      live = false;
    };
  }, [subject]);

  const flat = useMemo(() => {
    const list: { modNum: string; title: string }[] = [];
    for (const m of subject.modules)
      for (const t of m.topics) list.push({ modNum: m.num, title: t.title });
    return list;
  }, [subject]);

  const hereIdx = flat.findIndex(
    (f) => !states[`${f.modNum}::${f.title}`]?.completed,
  );

  const doneCount = flat.filter(
    (f) => states[`${f.modNum}::${f.title}`]?.completed,
  ).length;

  const toggle = (num: string) =>
    setOpenMods((o) => ({ ...o, [num]: !o[num] }));

  return (
    <main className="flex flex-col gap-5">
      <header>
        <Link
          href={`/subjects/${subject.short}`}
          className="mb-4 flex min-h-[48px] w-full items-center gap-2 rounded-2xl bg-[var(--track)] px-4 text-[15px] font-semibold text-[var(--text)] active:opacity-80"
          aria-label={`Back to ${subject.name}`}
        >
          <BackIcon />
          {subject.short}
        </Link>
        <h1 className="mt-1 text-[26px] font-bold leading-tight text-[var(--text)]">
          Mind map
        </h1>
        <p className="mt-1 text-[14px] text-[var(--text-dim)]">
          {subject.name} · {doneCount}/{flat.length} topics done
        </p>
        <ProgressBar
          value={flat.length === 0 ? 0 : (doneCount / flat.length) * 100}
          className="mt-3"
        />
      </header>

      {!loaded ? (
        <div className="flex flex-col gap-3">
          <div className="h-20 animate-pulse rounded-3xl bg-[var(--track)]" />
          <div className="h-20 animate-pulse rounded-3xl bg-[var(--track)]" />
          <div className="h-20 animate-pulse rounded-3xl bg-[var(--track)]" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {subject.modules.map((m, mi) => {
            const open = !!openMods[m.num];
            const topics = m.topics;
            const done = topics.filter(
              (t) => states[`${m.num}::${t.title}`]?.completed,
            ).length;
            return (
              <div key={m.num} className="glass rounded-3xl">
                <button
                  type="button"
                  onClick={() => toggle(m.num)}
                  aria-expanded={open}
                  className="flex min-h-[64px] w-full items-center gap-3 p-4 text-left"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--neon-dim)] text-[15px] font-bold text-[var(--neon-soft)]">
                    {mi + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[16px] font-bold text-[var(--text)]">
                      {m.title}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-[var(--text-faint)]">
                      {done}/{topics.length} topics
                    </span>
                    <ProgressBar
                      value={topics.length === 0 ? 0 : (done / topics.length) * 100}
                      className="mt-2 h-1"
                    />
                  </span>
                  <ChevronIcon open={open} className="h-5 w-5 shrink-0 text-[var(--text-dim)]" />
                </button>

                {open ? (
                  <div className="flex flex-col gap-1 px-3 pb-3">
                    {topics.map((t) => {
                      const st = states[`${m.num}::${t.title}`] ?? {
                        completed: false,
                        percent: 0,
                      };
                      const globalIdx = flat.findIndex(
                        (f) => f.modNum === m.num && f.title === t.title,
                      );
                      const isHere = globalIdx === hereIdx;
                      return (
                        <Link
                          key={t.title}
                          href={`${topicHref(subject.short, m.num, t)}/learn`}
                          className="flex min-h-[52px] items-center gap-3 rounded-2xl px-3 py-2 active:bg-[var(--track)]"
                          aria-label={`Start ${t.title} from Learn`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                              st.completed
                                ? "border-[var(--neon)] bg-[var(--neon)] text-[#04140a]"
                                : st.percent > 0
                                  ? "border-[var(--neon)]/60 text-[var(--neon-soft)]"
                                  : "border-[var(--glass-border)] text-transparent"
                            }`}
                            aria-hidden="true"
                          >
                            <CheckIcon className="h-3.5 w-3.5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block truncate text-[15px] font-medium ${
                                st.completed
                                  ? "text-[var(--text)]"
                                  : st.percent > 0
                                    ? "text-[var(--text)]"
                                    : "text-[var(--text-dim)]"
                              }`}
                            >
                              {t.title}
                            </span>
                          </span>
                          {isHere ? (
                            <span className="shrink-0 rounded-full bg-[var(--neon)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#04140a]">
                              You're here
                            </span>
                          ) : st.completed ? (
                            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-[var(--neon-soft)]">
                              Done
                            </span>
                          ) : st.percent > 0 ? (
                            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">
                              {Math.round(st.percent)}%
                            </span>
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {loaded && flat.length === 0 ? (
        <EmptyState
          title="No topics"
          subtitle="This subject has no topics yet."
        />
      ) : null}
      <TabBarSpacer />
    </main>
  );
}
