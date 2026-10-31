import type { Subject } from "./types";
import { qtModulesA } from "./qt-a";
import { qtModulesB } from "./qt-b";
import { qtModulesC } from "./qt-c";

export const qt: Subject = {
  "short": "QT",
  "name": "Quantitative Techniques",
  "exam": "4 Nov 2026",
  "examPattern": "EXAM PATTERN (QT): The real MG3CCRBCA200 paper pattern is UNKNOWN - no Honours model paper and no past BCA paper exists online (first exam 22-10-2025 was never published). Closest evidence: MGU B.Com 'Quantitative Techniques for Business' papers (same university, overlapping statistics syllabus) run 80 marks / 3 hours: Part A answer any 10 x 2 marks = 20 (short theory + one-line numericals), Part B answer any 6 x 5 marks = 30 (medium theory + numericals), Part C answer any 2 x 15 marks = 30 (long numericals: combined mean/SD/CV two-firm problem repeated 3x, Bayes theorem). QT is a 4-credit course, so the Honours paper may instead follow a 70-mark / 2-hour format (like DBMS) - this is NOT confirmed. Prepare every module: Part A 2-mark questions span all modules. ",
  "modules": [
    ...qtModulesA,
    ...qtModulesB,
    ...qtModulesC,
  ]
};
