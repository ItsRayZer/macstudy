import type { Subject } from "./types";
import { feModulesA } from "./fe-a";
import { feModulesB } from "./fe-b";

export const fe: Subject = {
  "short": "FE",
  "name": "Feature Engineering",
  "exam": "18 Nov 2026",
  "examPattern": null,
  "modules": [
    ...feModulesA,
    ...feModulesB,
  ]
};
