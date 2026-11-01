// components/formula-card.tsx
// Premium formula card: dark elevated card, large clear monospace formula
// with neon-green operators, a compact "where:" legend, and tap-to-copy.
// Used by the formula chart page and inline theory formula blocks.

"use client";

import { useRef, useState, type ReactNode } from "react";

/** Wrap ASCII operators in neon so the structure of the formula pops. */
function highlightOperators(text: string): ReactNode[] {
  const parts = text.split(/([=+\-*/^()<>|])/g);
  return parts.map((p, i) =>
    p.length === 1 && /=|\+|-|\*|\/|\^|\(|\)|<|>|\|/.test(p) ? (
      <span key={i} className="text-[var(--neon-soft)]">
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function CopyIcon({ className }: { className?: string }) {
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
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function FormulaCard({
  label,
  formula,
  where,
  index,
}: {
  /** One-line label: what this computes. */
  label?: string;
  /** The formula in plain ASCII. */
  formula: string;
  /** Compact "where:" legend defining the symbols. */
  where?: string;
  /** When set, shows an F-number badge (F1, F2...) for revision reference. */
  index?: number;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(formula);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = formula;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* clipboard unavailable */
      }
      ta.remove();
    }
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1500);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      void copy();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Copy formula: ${label ?? formula}`}
      onClick={() => void copy()}
      onKeyDown={onKeyDown}
      className="tap cursor-pointer rounded-3xl border border-[var(--glass-border)] bg-[var(--bg-elev)] p-5 shadow-[var(--shadow)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {label ? (
            <p className="text-[13px] font-semibold text-[var(--text-dim)]">
              {label}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {index != null ? (
            <span className="rounded-lg bg-[var(--neon-dim)] px-2 py-1 font-mono text-[11px] font-bold text-[var(--neon-soft)]">
              F{index}
            </span>
          ) : null}
          <span
            aria-hidden="true"
            className={`flex min-h-[32px] min-w-[32px] items-center justify-center rounded-xl ${
              copied ? "text-[var(--neon-soft)]" : "text-[var(--text-faint)]"
            }`}
          >
            {copied ? (
              <span className="text-[11px] font-bold">Copied</span>
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </span>
        </div>
      </div>
      <p className="mt-3 overflow-x-auto whitespace-nowrap pb-1 font-mono text-[17px] leading-[1.8] tracking-wide text-[var(--text)]">
        {highlightOperators(formula)}
      </p>
      {where ? (
        <p className="mt-2 text-[12px] leading-[1.6] text-[var(--text-faint)]">
          <span className="font-semibold text-[var(--text-dim)]">where: </span>
          {where}
        </p>
      ) : null}
    </div>
  );
}
