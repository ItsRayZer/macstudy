// app/subjects/[short]/flashcards/client.tsx
// Subject-wide flashcard deck: a topic chip row (All + each topic) filters
// the deck to that topic's cards (theory points + its PYQ-tagged
// questions). The premium 3D deck UI is shared with the topic Revise tab.

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronRightIcon,
  GlassCard,
  TabBarSpacer,
} from "../../../../components/ui";
import {
  FlashDeck,
  type FlashCard,
} from "../../../../components/flash-deck";
import {
  FLASH_MODULE,
  FLASH_TOPIC,
  getSubjectFlashGroups,
} from "../../../../lib/flashcards";
import { markPhaseProgress } from "../../../../lib/progress";
import { getSubjectLocal } from "../../../../lib/study";

function BackIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

export function FlashcardsClient({ short }: { short: string }) {
  const subject = getSubjectLocal(short);
  const groups = useMemo(() => getSubjectFlashGroups(short), [short]);
  const [active, setActive] = useState<string>("all");

  const cards: FlashCard[] = useMemo(() => {
    if (active === "all") return groups.flatMap((g) => g.cards);
    const g = groups.find((x) => x.topicSlug === active);
    return g ? g.cards : [];
  }, [groups, active]);

  const activeCount = cards.length;

  if (!subject) return null;

  // Reviewing the whole subject deck counts as finishing: persist the 75%
  // milestone under the flashcards namespace. Never downgrades.
  const handleDeckDone = () => {
    markPhaseProgress(short, FLASH_MODULE, FLASH_TOPIC, 75).catch(() => {});
  };

  const chips = (
    <nav
      aria-label="Filter by topic"
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <button
        key="all"
        type="button"
        onClick={() => setActive("all")}
        aria-pressed={active === "all"}
        className={`flex min-h-[44px] shrink-0 items-center justify-center rounded-full px-5 text-[14px] font-semibold active:opacity-80 ${
          active === "all"
            ? "bg-[var(--neon)] text-black"
            : "border border-[var(--glass-border)] bg-[var(--glass)] text-[var(--text)]"
        }`}
      >
        All
      </button>
      {groups.map((g) => (
        <button
          key={g.topicSlug}
          type="button"
          onClick={() => setActive(g.topicSlug)}
          aria-pressed={active === g.topicSlug}
          title={`Ch ${g.moduleNum} · ${g.topicTitle}`}
          className={`flex min-h-[44px] max-w-[220px] shrink-0 items-center justify-center rounded-full px-5 text-[14px] font-semibold active:opacity-80 ${
            active === g.topicSlug
              ? "bg-[var(--neon)] text-black"
              : "border border-[var(--glass-border)] bg-[var(--glass)] text-[var(--text)]"
          }`}
        >
          <span className="truncate">{g.topicTitle}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <main className="flex flex-col gap-4">
      <header>
        <Link
          href={`/subjects/${subject.short}`}
          aria-label={`Back to ${subject.name}`}
          className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-medium text-[var(--text-dim)]"
        >
          <BackIcon className="h-5 w-5" />
          {subject.name}
        </Link>
        <h1 className="mt-1 text-[26px] font-bold leading-tight text-[var(--text)]">
          Flashcards
        </h1>
        <p className="mt-1 text-[14px] text-[var(--text-dim)]">
          {active === "all"
            ? `Every card in ${subject.name}`
            : (groups.find((g) => g.topicSlug === active)?.topicTitle ?? "")}
          {" · "}
          <span className="tabular-nums">{activeCount}</span> card
          {activeCount === 1 ? "" : "s"}
        </p>
      </header>

      <FlashDeck
        cards={cards}
        onDeckDone={handleDeckDone}
        headerExtra={chips}
        title="Subject flashcards"
      />

      <Link
        href={`/subjects/${subject.short}/pyq-practice`}
        className="block min-h-[44px]"
        aria-label={`${subject.name} PYQ practice`}
      >
        <GlassCard className="transition-transform active:scale-[0.99]">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-[var(--text)]">
                Practice PYQs
              </p>
              <p className="truncate text-[12px] text-[var(--text-faint)]">
                Drill every PYQ question in writing
              </p>
            </div>
            <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
          </div>
        </GlassCard>
      </Link>

      <TabBarSpacer />
    </main>
  );
}
