// components/dashboard/AchievementBadge.tsx
// Achievement medallion: hand-drawn inline SVG per icon name, locked state
// dimmed with a lock ring. Zero emojis.

"use client";

import type { AchievementIconName } from "../../lib/gamify";

function Svg({
  children,
  className = "h-5 w-5",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function iconFor(name: AchievementIconName) {
  switch (name) {
    case "target":
      return (
        <Svg>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </Svg>
      );
    case "flame":
      return (
        <Svg>
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </Svg>
      );
    case "book":
      return (
        <Svg>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </Svg>
      );
    case "star":
      return (
        <Svg>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </Svg>
      );
    case "trophy":
      return (
        <Svg>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </Svg>
      );
    case "moon":
      return (
        <Svg>
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </Svg>
      );
    case "sunrise":
      return (
        <Svg>
          <path d="M12 2v8" />
          <path d="m4.93 10.93 1.41 1.41" />
          <path d="M2 18h2" />
          <path d="M20 18h2" />
          <path d="m19.07 10.93-1.41 1.41" />
          <path d="M22 22H2" />
          <path d="m8 6 4-4 4 4" />
          <path d="M16 18a4 4 0 0 0-8 0" />
        </Svg>
      );
  }
}

export function AchievementBadge({
  icon,
  name,
  desc,
  unlocked,
  size = "md",
}: {
  icon: AchievementIconName;
  name: string;
  desc: string;
  unlocked: boolean;
  size?: "md" | "lg";
}) {
  const dims = size === "lg" ? "h-16 w-16" : "h-12 w-12";
  return (
    <div
      className="flex min-w-0 flex-col items-center gap-1.5 text-center"
      title={unlocked ? `${name} - ${desc}` : `Locked: ${name} - ${desc}`}
    >
      <span
        className={`glass flex ${dims} shrink-0 items-center justify-center rounded-2xl ${
          unlocked
            ? "text-[#e3b341] shadow-[0_0_18px_rgba(227,179,65,0.25)]"
            : "text-[var(--text-faint)] opacity-50"
        }`}
        aria-label={unlocked ? `Unlocked: ${name}` : `Locked: ${name}`}
      >
        {iconFor(icon)}
      </span>
      <span
        className={`text-[11px] font-semibold leading-tight ${
          unlocked ? "text-[var(--text)]" : "text-[var(--text-faint)]"
        }`}
      >
        {name}
      </span>
    </div>
  );
}
