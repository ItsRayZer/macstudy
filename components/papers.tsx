// components/papers.tsx
// Shared question-paper cards: view in browser + download. Files are bundled
// with the app under public/pyq/ - no external dependency.

"use client";

import { GlassCard, Pill } from "./ui";
import { BookmarkButton, paperBookmarkRef } from "./bookmarks";
import type { PaperFile } from "../lib/pyq-papers";

function DocIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13h6M9 17h6" strokeLinecap="round" />
    </svg>
  );
}

export function PaperCard({
  paper,
  subject,
}: {
  paper: PaperFile;
  subject?: string;
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--track)] text-[var(--text)]">
          <DocIcon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Pill variant={paper.kind === "model" ? "sure" : "default"}>
              {paper.label}
            </Pill>
            {subject ? (
              <BookmarkButton
                target={paperBookmarkRef(subject, paper.id)}
                label="paper"
              />
            ) : null}
          </div>
          <h3 className="mt-1.5 text-[15px] font-semibold leading-snug text-[var(--text)]">
            {paper.title}
          </h3>
          {paper.note ? (
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-dim)]">
              {paper.note}
            </p>
          ) : null}
          <div className="mt-3 flex gap-2">
            <a
              href={paper.file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[var(--text)] px-4 text-sm font-semibold text-[var(--bg)] transition-transform active:scale-[0.98]"
            >
              View
            </a>
            <a
              href={paper.file}
              download
              className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)] transition-transform active:scale-[0.98]"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export function PaperSection({
  title,
  subtitle,
  papers,
}: {
  title: string;
  subtitle?: string;
  papers: PaperFile[];
}) {
  if (papers.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-lg font-bold text-[var(--text)]">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-[var(--text-dim)]">{subtitle}</p>
        ) : null}
      </div>
      {papers.map((p) => (
        <PaperCard key={p.id} paper={p} />
      ))}
    </section>
  );
}
