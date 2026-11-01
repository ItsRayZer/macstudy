// lib/math-format.ts
// Convert plain-text math notation to proper Unicode superscripts/subscripts.

const SUPERSCRIPTS: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾",
  "n": "ⁿ", "x": "ˣ",
};

const SUBSCRIPTS: Record<string, string> = {
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
  "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
  "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎",
  "a": "ₐ", "e": "ₑ", "o": "ₒ", "x": "ₓ",
};

/** Convert ^2, ^n etc to superscripts, _1, _2 etc to subscripts. */
export function formatMath(text: string): string {
  // ^ followed by chars -> superscript
  let out = text.replace(/\^([0-9+\-=()nx]+)/g, (_, chars: string) =>
    chars.split("").map((c) => SUPERSCRIPTS[c] ?? c).join("")
  );
  // _ followed by chars -> subscript
  out = out.replace(/_([0-9+\-=()aexo]+)/g, (_, chars: string) =>
    chars.split("").map((c) => SUBSCRIPTS[c] ?? c).join("")
  );
  // Common math symbols for readability
  out = out.replace(/\bx\b/g, "×");  // multiplication x -> × (word boundary)
  out = out.replace(/<=/g, "≤");
  out = out.replace(/>=/g, "≥");
  out = out.replace(/!=/g, "≠");
  out = out.replace(/->/g, "→");
  return out;
}

/** Format a single answer line, preserving readability. */
export function formatAnswerLine(line: string): string {
  return formatMath(line);
}
