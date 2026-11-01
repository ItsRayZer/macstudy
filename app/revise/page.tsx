// app/revise/page.tsx
// Revision hub: the due mistake deck and the bookmark list. Every row
// resolves to its question through the syllabus content and jumps to the
// topic (practice tab).

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

/** Resolve a bookmark / mistake entry to its question; null when stale. */
function resolveEntry(
  subject: string,
  module: string,
  topic: string,
  qIndex: number,
): DeckRow | null {
  const subj = getSubjectLocal(subject);
  const mod = subj ? getModuleLocal(subj, module) : undefined;
  // DB topic keys are titles; fall back to slug lookup for robustness.
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
  // Windowed rendering: long decks mount in pages as you scroll.
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
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-[var(--text)]">
                      {r.question.q}
                    </p>
                    <p className="mt-1 truncate text-xs text-[var(--text-dim)]">
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

export default function RevisePage() {
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

  return (
    <main className="flex flex-col gap-6">
      <header>
        <h1 className="text-[28px] font-bold leading-tight">Revise</h1>
        <p className="mt-1 text-sm text-[var(--text-dim)]">
          Spaced repetition for your mistakes and bookmarks
        </p>
      </header>

      <section aria-label="Flashcards" className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">Flashcards</h2>
            <p className="text-xs text-[var(--text-dim)]">
              Subject-wide decks, every topic
            </p>
          </div>
          <Pill>{subjects.length} decks</Pill>
        </div>
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
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--neon)]/15 text-[15px] font-bold text-[var(--neon-soft)]">
                      {s.short.slice(0, 2)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-[var(--text)]">
                        {s.name}
                      </p>
                      <p className="truncate text-xs tabular-nums text-[var(--text-dim)]">
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
      </section>

      <section aria-label="Mind maps" className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-[var(--text)]">Mind maps</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {subjects.map((s) => (
            <Link
              key={s.short}
              href={`/subjects/${s.short}/mindmap`}
              className="flex min-h-[44px] shrink-0 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-5 text-[14px] font-semibold text-[var(--text)] active:opacity-80"
              aria-label={`${s.name} mind map`}
            >
              {s.short}
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="Formula charts" className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-[var(--text)]">Formula charts</h2>
        <div className="flex flex-col gap-2">
          {modulesWithFormulas().map(({ short, num }) => {
            const subj = subjects.find((s) => s.short === short);
            const mod = subj?.modules.find((m) => m.num === num);
            if (!subj || !mod) return null;
            return (
              <Link
                key={`${short}-${num}`}
                href={`/subjects/${short}/${num}/formulas`}
                className="block min-h-[44px]"
                aria-label={`Formula chart: ${subj.name} chapter ${num}`}
              >
                <GlassCard className="transition-transform active:scale-[0.99]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--neon)]/15 font-mono text-[15px] font-bold text-[var(--neon-soft)]">
                      fx
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-[var(--text)]">
                        {subj.name}
                      </p>
                      <p className="truncate text-xs text-[var(--text-dim)]">
                        Chapter {num} · {mod.title}
                      </p>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </section>

      {!loaded ? (
        <div className="flex flex-col gap-3">
          <div className="h-24 animate-pulse rounded-3xl bg-[var(--track)]" />
          <div className="h-24 animate-pulse rounded-3xl bg-[var(--track)]" />
        </div>
      ) : (
        <>
          <DeckList
            title="Mistakes due"
            subtitle="Questions you got wrong, due for review"
            rows={mistakes}
            emptyTitle="No mistakes due"
            emptySubtitle="Questions you mark wrong while studying will appear here for smart revision."
          />
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
        </>
      )}
      <TabBarSpacer />
    </main>
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
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill>{r.short}</Pill>
                    <Pill variant="default">{r.paper.label}</Pill>
                  </div>
                  <p className="mt-1.5 truncate text-[15px] font-semibold text-[var(--text)]">
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
