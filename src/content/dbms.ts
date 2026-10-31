import type { Subject } from "./types";
import { dbmsModulesA } from "./dbms-a";
import { dbmsModulesB } from "./dbms-b";
import { dbmsModulesC } from "./dbms-c";
import { dbmsModulesD } from "./dbms-d";

export const dbms: Subject = {
  "short": "DBMS",
  "name": "Database Management Systems",
  "exam": "6 Nov 2026",
  "examPattern": "MGU BCA Honours DBMS (MG3CCRBCA201): 70 marks, 2 hours. Part A: 5 x 2 marks, short questions from all modules. Part B: answer any 5 of 6-mark questions. Part C: answer any 2 of 15-mark essays. Old CBCS papers (2019-2021): 80 marks, 3 hours, any-10 x 2 + any-6 x 5 + any-2 x 15. Part C hotspots: COMPANY ER diagram, Normal Forms essay, anomalies.",
  "modules": [
    ...dbmsModulesA,
    ...dbmsModulesB,
    ...dbmsModulesC,
    ...dbmsModulesD,
  ]
};
