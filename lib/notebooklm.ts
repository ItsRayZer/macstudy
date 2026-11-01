// lib/notebooklm.ts
// NotebookLM public links per subject. RayZer pastes the public share URLs here.

export interface NotebookLink {
  short: string;
  name: string;
  /** Public NotebookLM share URL. Empty = not yet shared. */
  url: string;
}

export const NOTEBOOK_LINKS: NotebookLink[] = [
  { short: "QT", name: "Quantitative Techniques", url: "" },
  { short: "DBMS", name: "Database Management Systems", url: "" },
  { short: "SF", name: "Software Engineering", url: "" },
  { short: "DAA", name: "Design and Analysis of Algorithms", url: "" },
  { short: "PYTHON", name: "Python Programming", url: "" },
  { short: "FE", name: "Feature Engineering", url: "" },
];
