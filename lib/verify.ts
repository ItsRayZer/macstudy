// lib/verify.ts
// Client side of the silent background answer check.
//
// verifyRemotely() posts the question, model answer and the learner's answer
// to /api/verify and resolves to "correct" | "wrong" when the background
// check has a definite verdict, or null when it is unavailable (no keys,
// network failure, timeout). It NEVER throws and NEVER surfaces any message:
// callers treat null as "use the local grader". The UI must not mention this
// check at all.

export interface VerifyInput {
  question: string;
  modelAnswer: string[];
  userAnswer: string;
  subject: string;
}

export type RemoteVerdict = "correct" | "wrong";

export async function verifyRemotely(
  input: VerifyInput,
): Promise<RemoteVerdict | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (
        data?.ok === true &&
        (data.verdict === "correct" || data.verdict === "wrong")
      ) {
        return data.verdict as RemoteVerdict;
      }
      return null;
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return null;
  }
}
