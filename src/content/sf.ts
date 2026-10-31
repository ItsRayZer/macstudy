import type { Subject } from "./types";
import { sfModulesA } from "./sf-a";
import { sfModulesB } from "./sf-b";
import { sfModulesC } from "./sf-c";

export const sf: Subject = {
  "short": "SF",
  "name": "Software Engineering",
  "exam": "10 Nov 2026",
  "examPattern": null,
  "modules": [
    ...sfModulesA,
    ...sfModulesB,
    ...sfModulesC,
  ]
};
