// app/subjects/[short]/[module]/[topic]/answer-pads.tsx
// Practice-mode answer inputs beyond the plain textarea.
//
// WorkingPad  stepped monospace rows for QT numerical working (Step 1, 2, ...)
// TablePad    row-based table input for table/frequency-distribution questions
// CodePad     Python editor with line numbers + in-browser Run (Pyodide)
//
// All pads are controlled: the parent owns the value and resets it per
// question with key={qIdx}. Zero emojis, mobile-first, neon on Apple blacks.

"use client";

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { gradeAnswer, gradeScore } from "../../../../../lib/grade";
import {
  normOutput,
  runPython,
} from "../../../../../lib/pyodide-run";

// ------------------------------------------------------------ working pad ---

export function WorkingPad({
  steps,
  onChange,
}: {
  steps: string[];
  onChange: (steps: string[]) => void;
}) {
  const setStep = (i: number, v: string) => {
    const next = steps.slice();
    next[i] = v;
    onChange(next);
  };
  return (
    <div className="mt-2 flex flex-col gap-2">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-[12px] font-bold tabular-nums text-[var(--text-faint)]">
            Step {i + 1}
          </span>
          <input
            type="text"
            value={s}
            onChange={(e) => setStep(i, e.target.value)}
            placeholder={i === 0 ? "Write each step of your working…" : ""}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="min-h-[48px] w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] px-4 font-mono text-[15px] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--text-dim)]"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...steps, ""])}
        className="mt-1 flex min-h-[48px] items-center justify-center rounded-2xl bg-[var(--track)] text-[14px] font-semibold text-[var(--text-dim)] active:opacity-80"
      >
        + Add step
      </button>
    </div>
  );
}

// -------------------------------------------------------------- table pad ---

const TABLE_COLS = 3;

export function TablePad({
  table,
  onChange,
}: {
  table: string[][];
  onChange: (table: string[][]) => void;
}) {
  const setCell = (r: number, c: number, v: string) => {
    const next = table.map((row) => row.slice());
    next[r][c] = v;
    onChange(next);
  };
  return (
    <div className="mt-2 flex flex-col gap-2">
      <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-dim)]">
        Fill the table row by row
      </p>
      {table.map((row, r) => (
        <div key={r} className="flex items-center gap-2">
          <span className="w-10 shrink-0 text-[12px] font-bold tabular-nums text-[var(--text-faint)]">
            R{r + 1}
          </span>
          <div className="grid flex-1 grid-cols-3 gap-2">
            {row.map((cell, c) => (
              <input
                key={c}
                type="text"
                value={cell}
                onChange={(e) => setCell(r, c, e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                inputMode="decimal"
                aria-label={`Row ${r + 1} column ${c + 1}`}
                className="min-h-[48px] w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3 font-mono text-[15px] text-[var(--text)] outline-none focus:border-[var(--text-dim)]"
              />
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([...table, Array<string>(TABLE_COLS).fill("")])
        }
        className="mt-1 flex min-h-[48px] items-center justify-center rounded-2xl bg-[var(--track)] text-[14px] font-semibold text-[var(--text-dim)] active:opacity-80"
      >
        + Add row
      </button>
    </div>
  );
}

/** Flatten a table pad into text for grading. */
export function flattenTable(table: string[][]): string {
  return table
    .map((row) => row.map((c) => c.trim()).filter(Boolean).join(" "))
    .filter(Boolean)
    .join("\n");
}

export function emptyTable(rows = 2): string[][] {
  return Array.from({ length: rows }, () =>
    Array<string>(TABLE_COLS).fill(""),
  );
}

// ---------------------------------------------------------------- code pad ---

export interface CodeVerdict {
  ok: boolean;
  userText: string;
  ran: boolean;
}

export interface CodePadHandle {
  /** Run the code if needed and verify the output. Never throws. */
  runAndVerify: () => Promise<CodeVerdict>;
}

/** Pull runnable code lines out of a mixed prose/code model answer. */
export function extractModelCode(answerLines: string[]): string {
  const code: string[] = [];
  for (const line of answerLines) {
    const t = line.trim();
    if (t.length === 0) continue;
    if (/^(example|program)\s*:?\s*$/i.test(t)) continue;
    if (/^output\s*:?/i.test(t)) break;
    if (/^\s/.test(line)) {
      code.push(line);
      continue;
    }
    if (
      /^(print|def |for |while |if |elif |else|import |from |return\b|try:|except|with |class )/.test(
        t,
      )
    ) {
      code.push(line);
      continue;
    }
    if (/^[A-Za-z_][A-Za-z0-9_]*\s*=[^=]/.test(t)) {
      code.push(line);
    }
  }
  return code.join("\n");
}

/** Heuristic: is this a write-the-program question? */
export function isProgrammingQuestion(q: string, a: string[]): boolean {
  if (/program|write.*code|code it|implement/i.test(q)) return true;
  return extractModelCode(a).split("\n").filter((l) => l.trim()).length >= 2;
}

export const CodePad = forwardRef<
  CodePadHandle,
  {
    code: string;
    onChange: (code: string) => void;
    modelAnswer: string[];
  }
>(function CodePad({ code, onChange, modelAnswer }, ref) {
  const [runState, setRunState] = useState<
    "idle" | "loading" | "running" | "done"
  >("idle");
  const [output, setOutput] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [lastRunCode, setLastRunCode] = useState<string | null>(null);
  const [lastOutput, setLastOutput] = useState<string | null>(null);
  const expectedCache = useRef<string | null | undefined>(undefined);
  const runSeq = useRef(0);

  const lineCount = useMemo(() => code.split("\n").length, [code]);

  const doRun = async (): Promise<{ output: string; error: string | null }> => {
    const seq = ++runSeq.current;
    setRunState("loading");
    setRunError(null);
    try {
      setRunState("running");
      const r = await runPython(code);
      if (seq !== runSeq.current) return r;
      setOutput(r.output);
      setRunError(r.error);
      setLastRunCode(code);
      setLastOutput(r.output);
      setRunState("done");
      return r;
    } catch {
      if (seq !== runSeq.current) return { output: "", error: "unavailable" };
      setRunState("done");
      setRunError("Could not start the runner. Your code is still saved.");
      return { output: "", error: "unavailable" };
    }
  };

  const expectedOutput = async (): Promise<string | null> => {
    if (expectedCache.current !== undefined) return expectedCache.current;
    const modelCode = extractModelCode(modelAnswer);
    if (!modelCode.trim()) {
      expectedCache.current = null;
      return null;
    }
    try {
      const r = await runPython(modelCode);
      if (r.error) {
        expectedCache.current = null;
        return null;
      }
      expectedCache.current = r.output;
      return r.output;
    } catch {
      expectedCache.current = null;
      return null;
    }
  };

  useImperativeHandle(ref, () => ({
    runAndVerify: async (): Promise<CodeVerdict> => {
      let userOut = lastOutput;
      let ran = lastRunCode === code && lastOutput != null;
      if (!ran) {
        const r = await doRun();
        if (r.error === "unavailable") {
          // Runner unavailable: fall back to key-term grading on the code.
          const { extractKeyTerms } = await import(
            "../../../../../lib/grade"
          );
          const terms = gradeAnswer(extractKeyTerms(modelAnswer), code);
          return {
            ok: gradeScore(terms) >= 0.6,
            userText: code,
            ran: false,
          };
        }
        userOut = r.output;
        ran = r.error == null;
      }
      if (!ran || userOut == null) {
        return { ok: false, userText: code, ran: false };
      }
      const expected = await expectedOutput();
      if (expected == null) {
        const { extractKeyTerms } = await import(
          "../../../../../lib/grade"
        );
        const terms = gradeAnswer(extractKeyTerms(modelAnswer), code);
        return { ok: gradeScore(terms) >= 0.6, userText: code, ran: true };
      }
      return {
        ok: normOutput(userOut) === normOutput(expected),
        userText: code,
        ran: true,
      };
    },
  }));

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)]">
        <div className="flex items-stretch">
          <div
            aria-hidden="true"
            className="flex w-10 shrink-0 select-none flex-col items-end gap-0 bg-[var(--track)] px-2 py-3 font-mono text-[13px] leading-[1.7] tabular-nums text-[var(--text-faint)]"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i} className="h-[1.7em]">
                {i + 1}
              </span>
            ))}
          </div>
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            rows={Math.max(6, Math.min(14, lineCount + 1))}
            placeholder={'Write your program here…\nprint("hello")'}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Your program"
            className="w-full resize-y bg-transparent p-3 font-mono text-[14px] leading-[1.7] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => void doRun()}
        disabled={runState === "loading" || runState === "running"}
        className="cta-neon flex min-h-[52px] items-center justify-center rounded-2xl text-[15px] font-bold disabled:opacity-40"
      >
        {runState === "loading"
          ? "Loading Python…"
          : runState === "running"
            ? "Running…"
            : "Run"}
      </button>
      {output != null || runError ? (
        <div className="rounded-2xl bg-[var(--inset,#0A0A0C)] p-4">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-dim)]">
            Output
          </p>
          {runError && runError !== "unavailable" ? (
            <p className="mt-2 font-mono text-[13px] text-red-400">{runError}</p>
          ) : null}
          <pre className="mt-2 overflow-x-auto font-mono text-[13px] leading-[1.6] text-[var(--text)]">
            {output || "(no output)"}
          </pre>
        </div>
      ) : null}
    </div>
  );
});
