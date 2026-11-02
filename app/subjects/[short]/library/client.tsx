// app/subjects/[short]/library/client.tsx
// Library client: lists PYQ papers, complete PDF, module PDFs.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RowCard, TabBarSpacer } from "../../../../components/ui";
import { getSubjectLocal } from "../../../../lib/study";
import { NOTEBOOK_LINKS } from "../../../../lib/notebooklm";

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
    <div className="mx-auto max-w-2xl lg:max-w-4xl px-4 pb-32 pt-6">
      <Link
        href={`/subjects/${short}`}
        className="mb-4 flex min-h-[48px] w-full items-center gap-2 rounded-2xl bg-[var(--track)] px-4 text-[15px] font-semibold text-[var(--text)] active:opacity-80"
      >
        <span className="text-[18px]">←</span> Back to {name}
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
              <a key={p.url} href={p.url} target="_blank" rel="noopener" className="block"><RowCard icon={<DocIcon className="h-5 w-5" />} title={p.title} subtitle={p.sub} /></a>
            ))}
          </div>
        </>
      )}

      {/* Complete notes */}
      <h2 className="mt-6 text-[16px] font-bold text-[var(--text)]">
        Complete Notes
      </h2>
      <div className="mt-3">
        <a href={completeUrl} target="_blank" rel="noopener" className="block"><RowCard icon={<DocIcon className="h-5 w-5" />} title={`${name} - Complete`} subtitle="Full subject notes" /></a>
      </div>

      {/* NotebookLM */}
      {(() => {
        const nlm = NOTEBOOK_LINKS.find((n) => n.short === short);
        return nlm && nlm.url ? (
          <>
            <h2 className="mt-6 text-[16px] font-bold text-[var(--text)]">
              NotebookLM
            </h2>
            <div className="mt-3">
              <a href={nlm.url} target="_blank" rel="noopener noreferrer" className="block"><RowCard icon={<NlmIcon className="h-5 w-5" />} title={`${name} Notebook`} subtitle="Audio, mind map, chat" /></a>
            </div>
          </>
        ) : null;
      })()}

      {/* Module PDFs */}
      <h2 className="mt-6 text-[16px] font-bold text-[var(--text)]">
        Module Notes
      </h2>
      <div className="mt-3 flex flex-col gap-3">
        {modules.map((m) => (
          <a key={m.num} href={`/pdfs/${short}-M${m.num}.pdf`} target="_blank" rel="noopener" className="block"><RowCard icon={<span className="text-[14px] font-bold">{m.num}</span>} title={m.title} subtitle={`Module ${m.num} notes`} iconBg="track" /></a>
        ))}
      </div>

      <TabBarSpacer />
    </div>
  );
}
