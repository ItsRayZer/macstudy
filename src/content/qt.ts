import type { Subject } from "./types";
import { qtModulesA } from "./qt-a";
import { qtModulesB } from "./qt-b";
import { qtModulesC } from "./qt-c";

export const qt: Subject = {
  "short": "QT",
  "name": "Quantitative Techniques",
  "exam": "4 Nov 2026",
  "examPattern": "EXAM PATTERN (QT, MG3CCRBCA200, official MGU syllabus): 70 marks, 2 hours. Part A: answer any 5 of 8 x 2 marks = 10 (short theory and one-line questions from all modules). Part B: answer any 5 of 8 x 6 marks = 30 (medium theory and numericals). Part C: answer any 2 of 4 x 15 marks = 30 (long numericals and essays). Hotspots: combined mean/SD/CV two-firm problem, Bayes theorem.",
  "modules": [
    ...qtModulesA,
    ...qtModulesB,
    ...qtModulesC,
  ]
};
