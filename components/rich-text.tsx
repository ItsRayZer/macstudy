// components/rich-text.tsx
// Rich answer/theory renderer: turns the existing plain-text answer format
// (line breaks, "Example:"/"Step" markers, numbered items) into structured
// blocks: paragraphs with breathing room, real bullet/numbered lists, bold
// key terms, stepped working, monospace formulas, example boxes.
// Code blocks get a Run button that executes them in-browser (Pyodide).
// Never dumps raw text in one <p>. Monochrome, zero emojis.

"use client";

import { useRef, useState, type ReactNode } from "react";
import { runPython } from "../lib/pyodide-run";
import { FormulaCard } from "./formula-card";
import { formatMath } from "../lib/math-format";

export type RichBlock =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string; example: boolean }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "steps"; items: string[] }
  | { kind: "code"; text: string; lang: "python" | "other" }
  | { kind: "formula"; text: string };

const KNOWN_FUNCS = new Set([
  "sin",
  "cos",
  "tan",
  "log",
  "ln",
  "sqrt",
  "mean",
  "sum",
  "min",
  "max",
  "mod",
]);

/** Heuristic: does this line read as a pure equation/expression? */
export function looksLikeFormula(line: string): boolean {
  const t = line.trim();
  if (!t.includes("=") || t.length > 80) return false;
  const words = t.split(/[^A-Za-z]+/).filter(Boolean);
  return words.every(
    (w) =>
      w.length <= 2 || KNOWN_FUNCS.has(w.toLowerCase()) || /^\d+$/.test(w),
  );
}

/** Claude review fix: detect if a code block is Python (runnable) vs SQL/pseudocode. */
function detectCodeLang(text: string): "python" | "other" {
  const t = text.toUpperCase();
  // SQL keywords -> not Python
  if (/\b(SELECT|CREATE TABLE|INSERT INTO|UPDATE|DELETE FROM|ALTER TABLE)\b/.test(t)) {
    return "other";
  }
  // Python indicators
  if (/\b(def |import |print\(|if __name__|elif |except:|finally:)/.test(text)) {
    return "python";
  }
  // Pseudocode indicators (DAA) -> not Python
  if (/←|→|⟵|⟶/.test(text)) {
    return "other";
  }
  return "python";
}

function parseHeading(line: string): { term: string; rest: string } | null {
  const m = line.match(/^([A-Za-z][A-Za-z0-9 &'()/-]{0,40}):\s*(.*)$/);
  if (!m) return null;
  // Avoid treating prose like "Note that x: ..." as a heading: the term
  // before the colon must be short and title-like.
  if (m[1].length > 32 || /\b(and|the|with|from|that)\b/i.test(m[1]))
    return null;
  return { term: m[1].trim(), rest: m[2].trim() };
}

export function parseRichText(lines: string[]): RichBlock[] {
  const raw = lines.flatMap((l) => l.split("\n"));
  const blocks: RichBlock[] = [];
  let para: string[] = [];
  let code: string[] = [];

  const flushPara = () => {
    for (const p of para) {
      const t = p.trim();
      if (t) blocks.push({ kind: "p", text: t });
    }
    para = [];
  };
  const flushCode = () => {
    if (code.length > 0) {
      const text = code.join("\n");
      blocks.push({ kind: "code", text, lang: detectCodeLang(text) });
      code = [];
    }
  };
  const pushList = (kind: "ul" | "ol" | "steps", item: string) => {
    const last = blocks[blocks.length - 1];
    if (last && last.kind === kind) last.items.push(item);
    else blocks.push({ kind, items: [item] } as RichBlock);
  };

  for (const line of raw) {
    const trimmed = line.trim();

    if (trimmed === "") {
      flushPara();
      flushCode();
      continue;
    }

    // Code block: 4-space / tab indent (existing convention).
    if (/^(    |\t)/.test(line)) {
      flushPara();
      code.push(line.replace(/^(    |\t)/, ""));
      continue;
    }
    flushCode();

    // Stepped working: "Step 1: ..." / "Step 2. ..."
    const stepM = trimmed.match(/^step\s*(\d+)\s*[\).\:\-]?\s*(.*)$/i);
    if (stepM && stepM[2]) {
      flushPara();
      pushList("steps", stepM[2].trim());
      continue;
    }

    // Numbered list: "1. ..." / "2) ..."
    const olM = trimmed.match(/^(\d{1,2})[\.\)]\s+(.+)$/);
    if (olM) {
      flushPara();
      pushList("ol", olM[2].trim());
      continue;
    }

    // Bullet list: "- ..." / "* ..." / "• ..."
    const ulM = trimmed.match(/^[-*•]\s+(.+)$/);
    if (ulM) {
      flushPara();
      pushList("ul", ulM[1].trim());
      continue;
    }

    // Heading marker: "Example:" / "Definition:" / "Solution:" ...
    const head = parseHeading(trimmed);
    if (head) {
      flushPara();
      blocks.push({
        kind: "h",
        text: head.term,
        example: /^examples?$/i.test(head.term),
      });
      if (head.rest) para.push(head.rest);
      continue;
    }

    // Formula line.
    if (looksLikeFormula(trimmed)) {
      flushPara();
      blocks.push({ kind: "formula", text: trimmed });
      continue;
    }

    para.push(line);
  }
  flushPara();
  flushCode();
  return blocks;
}

// ------------------------------------------------------------ inline bits ---

/** Inline formatting: **bold**, `code`, and lead-term bolding ("Term: rest"). */
export function Inline({ text }: { text: string }) {
  const out: ReactNode[] = [];
  // Split on **bold** and `code` segments.
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let k = 0;
  const pushText = (t: string) => {
    if (t) out.push(<span key={`t${k++}`}>{t}</span>);
  };
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    pushText(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      out.push(
        <strong
          key={`b${k++}`}
          className="font-semibold text-[var(--text)]"
        >
          {tok.slice(2, -2)}
        </strong>,
      );
    } else {
      out.push(
        <code
          key={`c${k++}`}
          className="rounded-md bg-[var(--track)] px-1.5 py-0.5 font-mono text-[0.92em] text-[var(--text)]"
        >
          {tok.slice(1, -1)}
        </code>,
      );
    }
    last = m.index + tok.length;
  }
  pushText(text.slice(last));

  // Lead-term bolding for "Term: definition" prose (only when no markup hit).
  if (out.length === 1) {
    const lm = text.match(/^([A-Z][A-Za-z0-9 ,/'()-]{1,36}):\s+(.+)$/);
    if (lm && !/\b(and|the|with|from)\b/i.test(lm[1])) {
      return (
        <span>
          <strong className="font-semibold text-[var(--text)]">
            {lm[1]}:
          </strong>{" "}
          {lm[2]}
        </span>
      );
    }
  }
  return <>{out}</>;
}

// ------------------------------------------------------------------ render ---

function ExampleBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] p-4">
      <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-dim)]">
        Example
      </p>
      <div className="mt-2 flex flex-col gap-3">{children}</div>
    </div>
  );
}

export function RichText({ lines }: { lines: string[] }) {
  // Format math notation (superscripts, subscripts) for proper display.
  const formatted = lines.map((l) => formatMath(l));
  const blocks = parseRichText(formatted);

  const rendered: ReactNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.kind === "h" && b.example) {
      // Group the following body blocks into the example box.
      const inner: ReactNode[] = [];
      let j = i + 1;
      while (
        j < blocks.length &&
        blocks[j].kind !== "h" &&
        blocks[j].kind !== "ul" &&
        blocks[j].kind !== "ol" &&
        blocks[j].kind !== "steps"
      ) {
        inner.push(
          <RichBlockView key={`ex-${j}`} block={blocks[j]} />,
        );
        j++;
      }
      rendered.push(<ExampleBox key={i}>{inner}</ExampleBox>);
      i = j;
      continue;
    }
    rendered.push(<RichBlockView key={i} block={b} />);
    i++;
  }

  return <div className="flex flex-col gap-4">{rendered}</div>;
}

/**
 * Code block with an inline Run button: executes the snippet in-browser
 * with the shared Pyodide runner and shows the program output below.
 * Used in Learn theory examples and anywhere answers render code.
 */
function RunnableCode({ code }: { code: string }) {
  const [state, setState] = useState<"idle" | "loading" | "running" | "done">(
    "idle",
  );
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const seq = useRef(0);

  const doRun = async () => {
    const my = ++seq.current;
    setState("loading");
    setError(null);
    try {
      setState("running");
      const r = await runPython(code);
      if (my !== seq.current) return;
      setOutput(r.output);
      setError(r.error);
      setState("done");
    } catch {
      if (my !== seq.current) return;
      setState("done");
      setError("Could not start the runner. Try again.");
    }
  };

  const busy = state === "loading" || state === "running";

  return (
    <div className="flex flex-col gap-2">
      <pre className="overflow-x-auto rounded-2xl bg-[var(--track)] p-4 font-mono text-[14px] leading-[1.7] text-[var(--text)]">
        {code}
      </pre>
      <div>
        <button
          type="button"
          onClick={() => void doRun()}
          disabled={busy}
          className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-[var(--neon)] px-5 text-[14px] font-bold text-[var(--neon-soft)] active:opacity-80 disabled:opacity-40"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="currentColor"
            aria-hidden="true"
          >
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
          {state === "loading"
            ? "Loading Python…"
            : state === "running"
              ? "Running…"
              : "Run"}
        </button>
      </div>
      {state === "done" ? (
        <div className="rounded-2xl bg-[var(--inset,#0A0A0C)] p-4">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-dim)]">
            Output
          </p>
          {error ? (
            <p className="mt-2 font-mono text-[13px] text-red-400">{error}</p>
          ) : null}
          <pre className="mt-2 max-h-48 overflow-auto font-mono text-[13px] leading-[1.6] text-[var(--text)]">
            {output || "(no output)"}
          </pre>
        </div>
      ) : null}
    </div>
  );
}

function RichBlockView({ block }: { block: RichBlock }) {
  switch (block.kind) {
    case "p":
      return (
        <p className="text-[16px] leading-[1.8] text-[var(--text-dim)]">
          <Inline text={block.text} />
        </p>
      );
    case "h":
      return (
        <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--text)]">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul className="flex flex-col gap-2.5">
          {block.items.map((it, j) => (
            <li key={j} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--text-dim)]"
              />
              <p className="text-[16px] leading-[1.8] text-[var(--text-dim)]">
                <Inline text={it} />
              </p>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="flex list-decimal flex-col gap-2.5 pl-5">
          {block.items.map((it, j) => (
            <li
              key={j}
              className="text-[16px] leading-[1.8] text-[var(--text-dim)] marker:font-semibold marker:text-[var(--text)]"
            >
              <Inline text={it} />
            </li>
          ))}
        </ol>
      );
    case "steps":
      return (
        <div className="flex flex-col gap-2.5">
          {block.items.map((it, j) => (
            <div key={j} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--track)] px-2 text-[12px] font-bold text-[var(--text)]"
              >
                {j + 1}
              </span>
              <p className="text-[16px] leading-[1.8] text-[var(--text-dim)]">
                <Inline text={it} />
              </p>
            </div>
          ))}
        </div>
      );
    case "code":
      // Claude review fix: only Python blocks get the Run button.
      // SQL and pseudocode render as static code.
      if (block.lang === "python") {
        return <RunnableCode code={block.text} />;
      }
      return (
        <pre className="overflow-x-auto rounded-lg bg-[var(--surface)] p-4 text-[13px] leading-[1.6] text-[var(--text)]">
          <code>{block.text}</code>
        </pre>
      );
    case "formula":
      return <FormulaCard formula={block.text} />;
  }
}
