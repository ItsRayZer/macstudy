// app/subjects/[short]/library/client.tsx
// Library client: lists PYQ papers, complete PDF, module PDFs.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlassCard, TabBarSpacer } from "../../../../components/ui";
import { getSubjectLocal } from "../../../../lib/study";

interface PdfItem {
  title: string;
  sub: string;
  url: string;
}

function DocIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

export function LibraryClient({ short, name }: { short: string; name: string }) {
  const [pyqs, setPyqs] = useState<PdfItem[]>([]);
  const [modules, setModules] = useState<{ num: string; title: string }[]>([]);

  useEffect(() => {
    // PYQ papers: fetch directory listing via known filenames.
    // We probe the pyq folder manifest.
    fetch(`/pyq/${short.toLowerCase()}/manifest.json`)
      .then((r) => (r.ok ? r.json() : { files: [] }))
      .then((d) => {
        const files: string[] = d.files || [];
        setPyqs(
          files.map((f) => ({
            title: f.replace(/^PYQ-/, "").replace(/\.pdf$/, "").replace(/-/g, " "),
            sub: "Previous year paper",
            url: `/pyq/${short.toLowerCase()}/${f}`,
          }))
        );
      })
      .catch(() => setPyqs([]));

    const subject = getSubjectLocal(short);
    if (subject) {
      setModules(
        subject.modules.map((m, i) => ({
          num: String(i + 1),
          title: m.title,
        }))
      );
    }
  }, [short]);

  const completeUrl = `/pdfs/${short}-Complete.pdf`;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-32 pt-6">
      <Link
        href={`/subjects/${short}`}
        className="mb-4 inline-flex items-center gap-2 text-[14px] text-[var(--text-dim)]"
      >
        ← Back to {name}
      </Link>

      <h1 className="text-[24px] font-bold text-[var(--text)]">Library</h1>
      <p className="mt-1 text-[14px] text-[var(--text-dim)]">
        Papers, notes, everything for {name}
      </p>

      {/* Previous year papers */}
      {pyqs.length > 0 && (
        <>
          <h2 className="mt-6 text-[16px] font-bold text-[var(--text)]">
            Previous Year Papers
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {pyqs.map((p) => (
              <a key={p.url} href={p.url} target="_blank" rel="noopener">
                <GlassCard className="flex items-center gap-3 p-4!">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--neon-dim)] text-[var(--neon-soft)]">
                    <DocIcon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-bold text-[var(--text)]">
                      {p.title}
                    </span>
                    <span className="block text-[12px] text-[var(--text-faint)]">
                      {p.sub}
                    </span>
                  </span>
                  <span className="text-[var(--text-faint)]">›</span>
                </GlassCard>
              </a>
            ))}
          </div>
        </>
      )}

      {/* Complete notes */}
      <h2 className="mt-6 text-[16px] font-bold text-[var(--text)]">
        Complete Notes
      </h2>
      <div className="mt-3">
        <a href={completeUrl} target="_blank" rel="noopener">
          <GlassCard className="flex items-center gap-3 p-4!">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--neon-dim)] text-[var(--neon-soft)]">
              <DocIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-bold text-[var(--text)]">
                {name} - Complete
              </span>
              <span className="block text-[12px] text-[var(--text-faint)]">
                Full subject notes
              </span>
            </span>
            <span className="text-[var(--text-faint)]">›</span>
          </GlassCard>
        </a>
      </div>

      {/* Module PDFs */}
      <h2 className="mt-6 text-[16px] font-bold text-[var(--text)]">
        Module Notes
      </h2>
      <div className="mt-3 flex flex-col gap-3">
        {modules.map((m) => (
          <a
            key={m.num}
            href={`/pdfs/${short}-M${m.num}.pdf`}
            target="_blank"
            rel="noopener"
          >
            <GlassCard className="flex items-center gap-3 p-4!">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--track)] text-[16px] font-bold text-[var(--text)]">
                {m.num}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-bold text-[var(--text)]">
                  {m.title}
                </span>
                <span className="block text-[12px] text-[var(--text-faint)]">
                  Module {m.num} notes
                </span>
              </span>
              <span className="text-[var(--text-faint)]">›</span>
            </GlassCard>
          </a>
        ))}
      </div>

      <TabBarSpacer />
    </div>
  );
}
