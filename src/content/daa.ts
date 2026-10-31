import type { Subject } from "./types";
import { daaModulesA } from "./daa-a";
import { daaModulesB } from "./daa-b";
import { daaModulesC } from "./daa-c";

export const daa: Subject = {
  "short": "DAA",
  "name": "Design and Analysis of Algorithms",
  "exam": "12 Nov 2026",
  "examPattern": "DAA Honours exam: 50 marks, 1 hour 30 minutes. Part A: 10 x 2 marks, all compulsory, short questions from all modules. Part B: 3 x 5 marks, focused explanations with examples. Part C: 1 x 15 marks, full algorithm trace or essay. Total: 20 + 15 + 15 = 50. Part C clusters on MST (Prim's/Kruskal's), knapsack, Floyd-Warshall, N-Queens.",
  "modules": [
    ...daaModulesA,
    ...daaModulesB,
    ...daaModulesC,
  ]
};
