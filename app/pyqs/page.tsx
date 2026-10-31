// app/pyqs/page.tsx
// PYQ paper hub: SUBJECT FIRST, then that subject's papers only.
// A clean subject selector at the top (QT default), one vertical paper list
// below. Bundled PDFs, view in browser or download.

"use client";

import { useMemo, useState } from "react";
import { PaperCard } from "../../components/papers";
import { TabBarSpacer } from "../../components/ui";
import { PAPERS_BY_SUBJECT } from "../../lib/pyq-papers";
import { subjects } from "@/src/content/subjects";

const ORDER = ["QT", "DBMS", "SF", "DAA", "PYTHON", "FE"];

function subjectName(short: string): string {
  return subjects.find((s) => s.short === short)?.name ?? short;
}

export default function PyqsPage() {
  const [active, setActive] = useState<string>(ORDER[0]);

  const papers = useMemo(
    () => PAPERS_BY_SUBJECT[active] ?? [],
    [active],
  );

  const total = ORDER.reduce(
    (n, s) => n + (PAPERS_BY_SUBJECT[s]?.length ?? 0),
    0,
  );

  return (
    <main className="flex flex-col gap-6">
      <header>
        <p className="text-sm text-[var(--text-dim)]">Real papers, real patterns</p>
        <h1 className="mt-1 text-[28px] font-bold leading-tight">
          PYQ papers
        </h1>
        <p className="mt-1 text-sm text-[var(--text-dim)]">
          {total} papers bundled in the app. Pick a subject, tap to view, or
          download for offline revision.
        </p>
      </header>

      <nav
        aria-label="Choose subject"
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ORDER.map((short) => {
          const selected = short === active;
          return (
            <button
              key={short}
              type="button"
              onClick={() => setActive(short)}
              aria-pressed={selected}
              className={`flex min-h-[44px] shrink-0 items-center justify-center rounded-full px-5 text-[14px] font-semibold transition-colors ${
                selected
                  ? "bg-[var(--text)] text-[var(--bg)]"
                  : "border border-[var(--border)] bg-[var(--glass)] text-[var(--text-dim)] active:opacity-80"
              }`}
            >
              {short}
            </button>
          );
        })}
      </nav>

      <section aria-label={`${subjectName(active)} papers`} className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-[var(--text)]">
            {subjectName(active)}
          </h2>
          <span className="text-[13px] tabular-nums text-[var(--text-dim)]">
            {papers.length} {papers.length === 1 ? "paper" : "papers"}
          </span>
        </div>
        {papers.map((p) => (
          <PaperCard key={p.id} paper={p} subject={active} />
        ))}
      </section>
      <TabBarSpacer />
    </main>
  );
}
