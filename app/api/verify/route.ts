// app/api/verify/route.ts
// Silent background answer checker. The client calls this to get a smarter
// second opinion on typed/worked/coded answers; it never surfaces in the UI.
// Tries OpenRouter first, then Groq, using server-side keys only. When keys
// are missing or anything fails, it returns { ok: false } and the client
// quietly falls back to the local grader. No error text is ever shown.

interface VerifyBody {
  question?: string;
  modelAnswer?: string[];
  userAnswer?: string;
  subject?: string;
}

const SYSTEM_PROMPT =
  "You are a strict exam grader. You get a question, the model answer, and " +
  "the student's answer. Reply with ONLY valid JSON, no other text: " +
  '{"verdict":"correct"} if the student answer captures the key facts, ' +
  "numbers, or output of the model answer, else " +
  '{"verdict":"wrong"}. Be lenient about wording and formatting, strict ' +
  "about wrong numbers, wrong code output, or missing core points.";

function parseVerdict(text: string): "correct" | "wrong" | null {
  const m = text.match(/\{\s*"verdict"\s*:\s*"(correct|wrong)"\s*\}/i);
  if (!m) return null;
  return m[1].toLowerCase() === "correct" ? "correct" : "wrong";
}

async function tryProvider(
  url: string,
  key: string,
  model: string,
  userContent: string,
): Promise<"correct" | "wrong" | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "HTTP-Referer": "https://easybca.vercel.app",
        "X-Title": "BcaAce",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        max_tokens: 40,
        temperature: 0,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text: string =
      data?.choices?.[0]?.message?.content ?? "";
    return parseVerdict(text);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as VerifyBody;
    const userAnswer = (body.userAnswer ?? "").trim();
    const modelLines = Array.isArray(body.modelAnswer) ? body.modelAnswer : [];
    if (!userAnswer || modelLines.length === 0) {
      return Response.json({ ok: false, verdict: "unknown" });
    }
    const userContent =
      `Question: ${body.question ?? ""}\n` +
      `Model answer:\n${modelLines.join("\n")}\n` +
      `Student answer:\n${userAnswer}`;

    const openrouterKey = process.env.OPENROUTER_API_KEY ?? "";
    if (openrouterKey) {
      const v = await tryProvider(
        "https://openrouter.ai/api/v1/chat/completions",
        openrouterKey,
        "meta-llama/llama-3.3-70b-instruct",
        userContent,
      );
      if (v) return Response.json({ ok: true, verdict: v });
    }
    const groqKey = process.env.GROQ_API_KEY ?? "";
    if (groqKey) {
      const v = await tryProvider(
        "https://api.groq.com/openai/v1/chat/completions",
        groqKey,
        "llama-3.3-70b-versatile",
        userContent,
      );
      if (v) return Response.json({ ok: true, verdict: v });
    }
    return Response.json({ ok: false, verdict: "unknown" });
  } catch {
    return Response.json({ ok: false, verdict: "unknown" });
  }
}
