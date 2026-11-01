export interface Question {
  q: string;
  tags: string[];
  tagBase: "SURE MARK" | "REPEATED" | "IMPORTANT";
  years: string | null;
  a: string[];
  /** Optional exam hint, e.g. "This is a combined-mean problem…". Shown as a small note above the answer, never as the main answer. */
  hint?: string;
  /** Optional figure shown with the model answer in Practice/Test. */
  figure?: FigureSpec;
}

export interface Topic {
  title: string;
  points: string[];
  questions: Question[];
  /** Optional figures shown in Learn after the theory points. */
  figures?: FigureSpec[];
}

/** A data table rendered inside a Figure block. Cells may contain "\n" for line breaks. */
export interface FigureTable {
  headers: string[];
  rows: string[][];
  note?: string;
}

/** Either an SVG diagram or a data table, rendered as a labeled Figure block. */
export interface FigureSpec {
  kind: "svg" | "table";
  caption: string;
  /** SVG only: path under /diagrams/, e.g. "/diagrams/sf-1-waterfall.svg". */
  src?: string;
  /** SVG only: alt text. Falls back to caption. */
  alt?: string;
  /** Table only. */
  table?: FigureTable;
}

export interface Module {
  num: string;
  title: string;
  examPattern: string | null;
  topics: Topic[];
}

export interface Subject {
  short: string;
  name: string;
  exam: string;
  examPattern: string | null;
  modules: Module[];
}

