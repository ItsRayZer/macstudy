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
  { short: "DBMS", name: "Database Management Systems", url: "https://notebooklm.google.com/notebook/2a273154-b356-4c10-88cb-32c547a85285" },
  { short: "SF", name: "Software Engineering", url: "https://notebooklm.google.com/notebook/cd9b8670-f4b6-4710-90dd-7cc8cfc137e2" },
  { short: "DAA", name: "Design and Analysis of Algorithms", url: "https://notebooklm.google.com/notebook/c3d428b0-7b40-4e8f-a4a8-8beb947551ee" },
  { short: "PYTHON", name: "Python Programming", url: "https://notebooklm.google.com/notebook/b0ca5153-df9c-4ad0-bbea-72d1c7537b4e" },
  { short: "FE", name: "Feature Engineering", url: "https://notebooklm.google.com/notebook/c5167634-3ef3-483f-be62-7d50ef6b54a6" },
];
