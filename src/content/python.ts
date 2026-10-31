import type { Subject } from "./types";
import { pythonModulesA } from "./python-a";
import { pythonModulesB } from "./python-b";
import { pythonModulesC } from "./python-c";

export const python: Subject = {
  "short": "PYTHON",
  "name": "Python",
  "exam": "16 Nov 2026",
  "examPattern": null,
  "modules": [
    ...pythonModulesA,
    ...pythonModulesB,
    ...pythonModulesC,
  ]
};
