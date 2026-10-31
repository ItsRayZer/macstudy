// lib/exams.ts
// MGU BCA 3rd Sem exam timetable, Nov 2026 (IST). Times are the usual
// 9:30 AM session start; dates match the content worker's subject records.

export interface ExamInfo {
  short: string;
  name: string;
  /** ISO string with +05:30 offset. */
  at: string;
}

export const EXAMS: ExamInfo[] = [
  { short: "QT", name: "Quantitative Techniques", at: "2026-11-04T09:30:00+05:30" },
  { short: "DBMS", name: "Database Management Systems", at: "2026-11-06T09:30:00+05:30" },
  { short: "SF", name: "Software Engineering", at: "2026-11-10T09:30:00+05:30" },
  { short: "DAA", name: "Design and Analysis of Algorithms", at: "2026-11-12T09:30:00+05:30" },
  { short: "PYTHON", name: "Python Programming", at: "2026-11-16T09:30:00+05:30" },
  { short: "FE", name: "Feature Engineering", at: "2026-11-18T09:30:00+05:30" },
];

/** The next exam that has not started yet, or null when the session is over. */
export function nearestExam(now: Date = new Date()): ExamInfo | null {
  const t = now.getTime();
  for (const exam of EXAMS) {
    if (new Date(exam.at).getTime() > t) return exam;
  }
  return null;
}
