// app/revise/page.tsx
// Revision hub: tabbed, minimalistic. One tool visible at a time.
// Tabs: Practice (per subject → per module), Flashcards, Formulas, Mistakes, Saved.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronRightIcon,
  EmptyState,
  GlassCard,
  Pill,
  TabBarSpacer,
} from "../../components/ui";
import { getDB, type Bookmark, type MistakeEntry } from "../../lib/db";
import {
  isPaperBookmark,
  type BookmarkRef,
} from "../../components/bookmarks";
import { PAPERS_BY_SUBJECT, type PaperFile } from "../../lib/pyq-papers";
import {
  getModuleLocal,
  getSubjectLocal,
  getTopicBySlug,
  topicHref,
} from "../../lib/study";
import {
  countDueFlashcards,
  countSubjectFlashcards,
} from "../../lib/flashcards";
import { subjects } from "@/src/content/subjects";
import type { Question } from "@/src/content/types";
import { TagPill } from "../subjects/[short]/[module]/[topic]/flow";
import { useWindowed, WindowSentinel } from "../../components/windowed";
import { modulesWithFormulas } from "@/src/content/formulas";

type Tab = "practice" | "flashcards" | "formulas" | "mistakes" | "saved";

const TABS: { id: Tab; label: string }[] = [
  { id: "practice", label: "Practice" },
  { id: "flashcards", label: "Flashcards" },
  { id: "formulas", label: "Formulas" },
  { id: "mistakes", label: "Mistakes" },
  { id: "saved", label: "Saved" },
];

interface DeckRow {
  key: string;
  short: string;
  num: string;
  topicTitle: string;
  qIndex: number;
  question: Question;
  wrongCount?: number;
  nextReview?: string;
}

interface PaperRow {
  key: string;
  short: string;
  paper: PaperFile;
}

function findPaper(subject: string, paperId: string): PaperFile | null {
  const list = PAPERS_BY_SUBJECT[subject] ?? [];
  return list.find((p) => p.id === paperId) ?? null;
}

function resolveEntry(
  subject: string,
  module: string,
  topic: string,
  qIndex: number,
): DeckRow | null {
  const subj = getSubjectLocal(subject);
  const mod = subj ? getModuleLocal(subj, module) : undefined;
  const top =
    mod?.topics.find((t) => t.title === topic) ??
    (mod ? getTopicBySlug(mod, topic) : undefined);
  if (!subj || !mod || !top) return null;
  const question = top.questions[qIndex];
  if (!question) return null;
  return {
    key: `${subject}::${module}::${topic}::${qIndex}`,
    short: subj.short,
    num: mod.num,
    topicTitle: top.title,
    qIndex,
    question,
  };
}

// ---------------------------------------------------------------------------
// Practice tab: pick a subject, then a module, then practice.
// ---------------------------------------------------------------------------

function PracticeTab() {
  const [openSubject, setOpenSubject] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {subjects.map((s) => {
        const subj = getSubjectLocal(s.short);
        const modules = subj?.modules ?? [];
        const isOpen = openSubject === s.short;
        return (
          <div key={s.short}>
            <button
              type="button"
              onClick={() => setOpenSubject(isOpen ? null : s.short)}
              className="w-full"
              aria-expanded={isOpen}
              aria-label={`${s.name} practice modules`}
            >
              <GlassCard className="flex items-center gap-3 p-4! transition-transform active:scale-[0.99]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--neon-dim)] text-[14px] font-bold text-[var(--neon-soft)]">
                  {s.short.slice(0, 2)}
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-[14px] font-bold text-[var(--text)]">
                    {s.name}
                  </span>
                  <span className="block text-[12px] text-[var(--text-faint)]">
                    {modules.length} modules
                  </span>
                </span>
                <span
                  className={`text-[var(--text-faint)] transition-transform ${isOpen ? "rotate-90" : ""}`}
                >
                  ›
                </span>
              </GlassCard>
            </button>
            {isOpen && (
              <div className="mt-2 flex flex-col gap-2 pl-4">
                {modules.map((m) => (
                  <Link
                    key={m.num}
                    href={`/subjects/${s.short}/${m.num}`}
                    aria-label={`Practice ${s.name} module ${m.num}`}
                  >
                    <GlassCard className="flex items-center gap-3 p-4! transition-transform active:scale-[0.99]">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--track)] text-[14px] font-bold text-[var(--text)]">
                        {m.num}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-bold text-[var(--text)]">
                          {m.title}
                        </span>
                        <span className="block text-[12px] text-[var(--text-faint)]">
                          Practice questions
                        </span>
                      </span>
                      <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
                    </GlassCard>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Flashcards tab: subject-wide decks.
// ---------------------------------------------------------------------------

function FlashcardsTab({ dueFlash }: { dueFlash: Record<string, number> }) {
  return (
    <div className="flex flex-col gap-2">
      {subjects.map((s) => {
        const total = countSubjectFlashcards(s.short);
        const due = dueFlash[s.short] ?? total;
        return (
          <Link
            key={s.short}
            href={`/subjects/${s.short}/flashcards`}
            className="block min-h-[44px]"
            aria-label={`${s.name} flashcards, ${total} cards, ${due} due`}
          >
            <GlassCard className="transition-transform active:scale-[0.99]">
              <div className="flex items-center gap-3 p-4!">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--neon-dim)] text-[14px] font-bold text-[var(--neon-soft)]">
                  {s.short.slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-[var(--text)]">
                    {s.name}
                  </p>
                  <p className="truncate text-[12px] tabular-nums text-[var(--text-faint)]">
                    {total} cards{due > 0 ? ` · ${due} due` : " · all caught up"}
                  </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
              </div>
            </GlassCard>
          </Link>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Formulas tab: grouped by subject, expandable.
// ---------------------------------------------------------------------------

function FormulasTab() {
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  const bySubject = new Map<string, { short: string; num: string }[]>();
  for (const f of modulesWithFormulas()) {
    const list = bySubject.get(f.short) ?? [];
    list.push(f);
    bySubject.set(f.short, list);
  }

  return (
    <div className="flex flex-col gap-2">
      {subjects.map((s) => {
        const mods = bySubject.get(s.short) ?? [];
        if (mods.length === 0) return null;
        const isOpen = openSubject === s.short;
        return (
          <div key={s.short}>
            <button
              type="button"
              onClick={() => setOpenSubject(isOpen ? null : s.short)}
              className="w-full"
              aria-expanded={isOpen}
              aria-label={`${s.name} formula charts`}
            >
              <GlassCard className="flex items-center gap-3 p-4! transition-transform active:scale-[0.99]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--neon-dim)] font-mono text-[14px] font-bold text-[var(--neon-soft)]">
                  fx
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-[14px] font-bold text-[var(--text)]">
                    {s.name}
                  </span>
                  <span className="block text-[12px] text-[var(--text-faint)]">
                    {mods.length} formula chart{mods.length === 1 ? "" : "s"}
                  </span>
                </span>
                <span
                  className={`text-[var(--text-faint)] transition-transform ${isOpen ? "rotate-90" : ""}`}
                >
                  ›
                </span>
              </GlassCard>
            </button>
            {isOpen && (
              <div className="mt-2 flex flex-col gap-2 pl-4">
                {mods.map(({ short, num }) => {
                  const subj = subjects.find((x) => x.short === short);
                  const mod = subj?.modules.find((m) => m.num === num);
                  return (
                    <Link
                      key={`${short}-${num}`}
                      href={`/subjects/${short}/${num}/formulas`}
                      aria-label={`Formula chart: ${subj?.name} module ${num}`}
                    >
                      <GlassCard className="flex items-center gap-3 p-4! transition-transform active:scale-[0.99]">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--track)] text-[14px] font-bold text-[var(--text)]">
                          {num}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] font-bold text-[var(--text)]">
                            {mod?.title ?? `Module ${num}`}
                          </span>
                          <span className="block text-[12px] text-[var(--text-faint)]">
                            Formula chart
                          </span>
                        </span>
                        <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
                      </GlassCard>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Deck lists (mistakes, bookmarks, papers).
// ---------------------------------------------------------------------------

function DeckList({
  title,
  subtitle,
  rows,
  emptyTitle,
  emptySubtitle,
}: {
  title: string;
  subtitle: string;
  rows: DeckRow[];
  emptyTitle: string;
  emptySubtitle: string;
}) {
  const { visible, sentinelRef, hasMore } = useWindowed(rows);
  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--text)]">{title}</h2>
          <p className="text-xs text-[var(--text-dim)]">{subtitle}</p>
        </div>
        {rows.length > 0 ? <Pill>{rows.length}</Pill> : null}
      </header>
      {rows.length === 0 ? (
        <EmptyState title={emptyTitle} subtitle={emptySubtitle} />
      ) : (
        visible.map((r) => {
          const subj = subjects.find((s) => s.short === r.short);
          const mod = subj?.modules.find((m) => m.num === r.num);
          const topic = mod?.topics.find((t) => t.title === r.topicTitle);
          const href = topic
            ? `${topicHref(subj!.short, mod!.num, topic)}/practice`
            : "#";
          return (
            <Link
              key={r.key}
              href={href}
              className="block min-h-[44px]"
              aria-label={`Revise: ${r.question.q}`}
            >
              <GlassCard className="transition-transform active:scale-[0.99]">
                <div className="flex items-center gap-3 p-4!">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold text-[var(--text)]">
                      {r.question.q}
                    </p>
                    <p className="mt-1 truncate text-[12px] text-[var(--text-faint)]">
                      {subj?.name} · Module {r.num} · {r.topicTitle}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <TagPill
                        tagBase={r.question.tagBase}
                        years={r.question.years}
                      />
                      {r.wrongCount != null && r.wrongCount > 1 ? (
                        <Pill variant="repeated">
                          Missed {r.wrongCount}x
                        </Pill>
                      ) : null}
                    </div>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
                </div>
              </GlassCard>
            </Link>
          );
        })
      )}
      <WindowSentinel sentinelRef={sentinelRef} hasMore={hasMore} />
    </section>
  );
}

function PaperBookmarkList({
  title,
  subtitle,
  rows,
  emptyTitle,
  emptySubtitle,
}: {
  title: string;
  subtitle: string;
  rows: PaperRow[];
  emptyTitle: string;
  emptySubtitle: string;
}) {
  const { visible, sentinelRef, hasMore } = useWindowed(rows);
  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--text)]">{title}</h2>
          <p className="text-xs text-[var(--text-dim)]">{subtitle}</p>
        </div>
        {rows.length > 0 ? <Pill>{rows.length}</Pill> : null}
      </header>
      {rows.length === 0 ? (
        <EmptyState title={emptyTitle} subtitle={emptySubtitle} />
      ) : (
        visible.map((r) => (
          <a
            key={r.key}
            href={r.paper.file}
            target="_blank"
            rel="noopener noreferrer"
            className="block min-h-[44px]"
            aria-label={`Open paper: ${r.paper.title}`}
          >
            <GlassCard className="transition-transform active:scale-[0.99]">
              <div className="flex items-center gap-3 p-4!">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill>{r.short}</Pill>
                    <Pill variant="default">{r.paper.label}</Pill>
                  </div>
                  <p className="mt-1.5 truncate text-[14px] font-bold text-[var(--text)]">
                    {r.paper.title}
                  </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
              </div>
            </GlassCard>
          </a>
        ))
      )}
      <WindowSentinel sentinelRef={sentinelRef} hasMore={hasMore} />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main page.
// ---------------------------------------------------------------------------

export default function RevisePage() {
  const [tab, setTab] = useState<Tab>("practice");
  const [mistakes, setMistakes] = useState<DeckRow[]>([]);
  const [bookmarks, setBookmarks] = useState<DeckRow[]>([]);
  const [paperBookmarks, setPaperBookmarks] = useState<PaperRow[]>([]);
  const [dueFlash, setDueFlash] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      const db = getDB();
      const [due, saved] = await Promise.all([
        db.getMistakes(true),
        db.getBookmarks(),
      ]);
      if (!live) return;
      const mRows: DeckRow[] = [];
      for (const m of due as MistakeEntry[]) {
        const row = resolveEntry(m.subject, m.module, m.topic, m.qIndex);
        if (row)
          mRows.push({
            ...row,
            wrongCount: m.wrongCount,
            nextReview: m.nextReview,
          });
      }
      const bRows: DeckRow[] = [];
      const pRows: PaperRow[] = [];
      for (const b of saved as Bookmark[]) {
        if (isPaperBookmark(b as BookmarkRef)) {
          const paper = findPaper(b.subject, b.topic);
          if (paper)
            pRows.push({
              key: `paper::${b.subject}::${b.topic}`,
              short: b.subject,
              paper,
            });
          continue;
        }
        const row = resolveEntry(b.subject, b.module, b.topic, b.qIndex);
        if (row) bRows.push(row);
      }
      setMistakes(mRows);
      setBookmarks(bRows);
      setPaperBookmarks(pRows);
      const flashDue: Record<string, number> = {};
      for (const s of subjects) flashDue[s.short] = countDueFlashcards(s.short);
      setDueFlash(flashDue);
      setLoaded(true);
    })().catch(() => {
      if (live) setLoaded(true);
    });
    return () => {
      live = false;
    };
  }, []);

  const mistakeCount = mistakes.length;
  const savedCount = bookmarks.length + paperBookmarks.length;

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-5 px-4 pb-32 pt-6">
      <header>
        <h1 className="text-[24px] font-bold leading-tight text-[var(--text)]">
          Revise
        </h1>
        <p className="mt-1 text-[14px] text-[var(--text-dim)]">
          Pick what to revise
        </p>
      </header>

      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Revision tools"
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          const badge =
            t.id === "mistakes" && mistakeCount > 0
              ? mistakeCount
              : t.id === "saved" && savedCount > 0
                ? savedCount
                : null;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`flex min-h-[44px] shrink-0 items-center gap-2 rounded-full px-5 text-[14px] font-semibold transition-colors ${
                active
                  ? "bg-[var(--neon)] text-black"
                  : "border border-[var(--glass-border)] bg-[var(--glass)] text-[var(--text)] active:opacity-80"
              }`}
            >
              {t.label}
              {badge != null ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-[12px] font-bold tabular-nums ${
                    active
                      ? "bg-black/20 text-black"
                      : "bg-[var(--track)] text-[var(--text)]"
                  }`}
                >
                  {badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Tab content — one tool at a time */}
      <div role="tabpanel">
        {tab === "practice" && <PracticeTab />}
        {tab === "flashcards" && <FlashcardsTab dueFlash={dueFlash} />}
        {tab === "formulas" && <FormulasTab />}
        {tab === "mistakes" &&
          (!loaded ? (
            <div className="flex flex-col gap-3">
              <div className="h-24 animate-pulse rounded-3xl bg-[var(--track)]" />
              <div className="h-24 animate-pulse rounded-3xl bg-[var(--track)]" />
            </div>
          ) : (
            <DeckList
              title="Mistakes due"
              subtitle="Questions you got wrong, due for review"
              rows={mistakes}
              emptyTitle="No mistakes due"
              emptySubtitle="Questions you mark wrong while studying will appear here for smart revision."
            />
          ))}
        {tab === "saved" &&
          (!loaded ? (
            <div className="flex flex-col gap-3">
              <div className="h-24 animate-pulse rounded-3xl bg-[var(--track)]" />
              <div className="h-24 animate-pulse rounded-3xl bg-[var(--track)]" />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <DeckList
                title="Bookmarks"
                subtitle="Questions you saved for later"
                rows={bookmarks}
                emptyTitle="No bookmarks yet"
                emptySubtitle="Bookmark any question while practicing to find it here."
              />
              <PaperBookmarkList
                title="Saved papers"
                subtitle="Question papers you bookmarked"
                rows={paperBookmarks}
                emptyTitle="No saved papers"
                emptySubtitle="Bookmark a paper from the PYQ hub to find it here."
              />
            </div>
          ))}
      </div>

      <TabBarSpacer />
    </main>
  );
}
