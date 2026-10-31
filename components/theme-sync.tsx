// components/theme-sync.tsx
// Keeps document.documentElement[data-theme] in sync with the zustand store.
// The first paint is handled by the inline script in app/layout.tsx (no FOUC).

"use client";

import { useEffect } from "react";
import { useAppStore } from "../lib/store";

export function ThemeSync() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}
