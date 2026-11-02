// app/notebooklm/page.tsx
// NotebookLM: per-subject AI notebooks (audio overviews, mind maps, chat).

import Link from "next/link";
import { NOTEBOOK_LINKS } from "../../lib/notebooklm";
import { GlassCard, TabBarSpacer } from "../../components/ui";

function NlmIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3v3" />
      <path d="M18.4 5.6 16.3 7.7" />
      <path d="M21 12h-3" />
      <path d="M18.4 18.4l-2.1-2.1" />
      <path d="M12 18v3" />
      <path d="M7.7 16.3l-2.1 2.1" />
      <path d="M6 12H3" />
      <path d="M7.7 7.7 5.6 5.6" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  );
}

export default function NotebookLMPage() {
  return (
    <div className="mx-auto max-w-2xl lg:max-w-4xl px-4 pb-32 pt-6">
      <Link
        href="/"
        className="mb-4 flex min-h-[48px] w-full items-center gap-2 rounded-2xl bg-[var(--track)] px-4 text-[15px] font-semibold text-[var(--text)] active:opacity-80"
      >
        <span className="text-[18px]">←</span> Back to Home
      </Link>

      <h1 className="text-[24px] font-bold text-[var(--text)]">NotebookLM</h1>
      <p className="mt-1 text-[14px] text-[var(--text-dim)]">
        AI notebooks: audio overviews, mind maps, chat with your notes
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {NOTEBOOK_LINKS.map((n) => (
          n.url ? (
            <a key={n.short} href={n.url} target="_blank" rel="noopener noreferrer">
              <GlassCard className="flex items-center gap-3 p-4! transition-transform active:scale-[0.99]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--neon-dim)] text-[var(--neon-soft)]">
                  <NlmIcon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-[var(--text)]">
                    {n.name}
                  </span>
                  <span className="block text-[13px] text-[var(--text-faint)]">
                    Open in NotebookLM
                  </span>
                </span>
                <span className="text-[var(--text-faint)]">›</span>
              </GlassCard>
            </a>
          ) : (
            <GlassCard key={n.short} className="flex items-center gap-3 p-4! opacity-50">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--track)] text-[var(--text-dim)]">
                <NlmIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold text-[var(--text)]">
                  {n.name}
                </span>
                <span className="block text-[13px] text-[var(--text-faint)]">
                  Link coming soon
                </span>
              </span>
            </GlassCard>
          )
        ))}
      </div>

      <TabBarSpacer />
    </div>
  );
}
