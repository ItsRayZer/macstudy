// app/pyqs/page.tsx
// PYQ paper hub: the 16 real past papers, bundled with the app.
// View in browser or download - no external links.

import type { Metadata } from "next";
import { Pill } from "../../components/ui";
import { PaperCard } from "../../components/papers";
import { PAPERS_BY_SUBJECT } from "../../lib/pyq-papers";
import { subjects } from "@/src/content/subjects";

export const metadata: Metadata = {
  title: "PYQ Papers",
  description: "Real MGU BCA past question papers, ready to view and download.",
};

const ORDER = ["QT", "DBMS", "SF", "DAA", "PYTHON", "FE"];

function subjectName(short: string): string {
  return subjects.find((s) => s.short === short)?.name ?? short;
}

export default function PyqsPage() {
  const total = ORDER.reduce(
    (n, s) => n + (PAPERS_BY_SUBJECT[s]?.length ?? 0),
    0,
  );
  return (
    <main className="flex flex-col gap-6">
      <header>
        <p className="text-sm text-[var(--text-dim)]">Real papers, real patterns</p>
        <h1 className="mt-1 text-[28px] font-bold leading-tight">
          PYQ <span className="text-gradient">papers</span>
        </h1>
        <p className="mt-1 text-sm text-[var(--text-dim)]">
          {total} papers bundled in the app. Tap to view, or download for
          offline revision.
        </p>
      </header>

      {ORDER.map((short) => {
        const papers = PAPERS_BY_SUBJECT[short] ?? [];
        if (papers.length === 0) return null;
        return (
          <section key={short} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Pill variant="default">{short}</Pill>
              <h2 className="text-base font-bold text-[var(--text)]">
                {subjectName(short)}
              </h2>
            </div>
            {papers.map((p) => (
              <PaperCard key={p.id} paper={p} />
            ))}
          </section>
        );
      })}
    </main>
  );
}
