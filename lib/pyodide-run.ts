// lib/pyodide-run.ts
// Lazy in-browser Python execution via Pyodide (WASM), loaded from CDN only
// when the learner first taps Run. Everything runs locally in the page:
// no code ever leaves the device. The module is a singleton so the ~10MB
// runtime downloads once per session.

export interface RunResult {
  output: string;
  error: string | null;
}

let loadPromise: Promise<any> | null = null;
let pyodide: any = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-pyodide]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.dataset.pyodide = "1";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("pyodide script failed"));
    document.head.appendChild(s);
  });
}

async function getPyodide(): Promise<any> {
  if (pyodide) return pyodide;
  if (!loadPromise) {
    loadPromise = (async () => {
      await loadScript(
        "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js",
      );
      const w = window as any;
      if (!w.loadPyodide) throw new Error("pyodide missing");
      pyodide = await w.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
      });
      return pyodide;
    })().catch((e) => {
      loadPromise = null;
      throw e;
    });
  }
  return loadPromise;
}

/** True while the runtime is still downloading / initializing. */
export function pyodideLoading(): boolean {
  return loadPromise != null && pyodide == null;
}

/**
 * Run Python source and capture stdout. Returns { output, error }.
 * Rejects only when the runtime itself cannot load (caller falls back to
 * the local grader silently).
 */
export async function runPython(source: string): Promise<RunResult> {
  const py = await getPyodide();
  const chunks: string[] = [];
  py.setStdout({ batched: (t: string) => chunks.push(t) });
  py.setStderr({ batched: (t: string) => chunks.push(t) });
  try {
    const exec = (async () => {
      await py.runPythonAsync(source);
    })();
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timed out")), 15000),
    );
    await Promise.race([exec, timeout]);
    return { output: chunks.join(""), error: null };
  } catch (e: any) {
    const msg = String(e?.message ?? e ?? "error").split("\n").slice(-1)[0];
    return { output: chunks.join(""), error: msg };
  }
}

/** Normalize program output for comparison: trim trailing blank lines. */
export function normOutput(s: string): string {
  return s.replace(/\s+$/g, "").replace(/\r\n/g, "\n");
}
