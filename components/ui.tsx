// components/ui.tsx
// BcaEasy shared UI kit (liquid glass, mobile-first, thumb-friendly).
//
// WORKER CONTRACT (stable API - do not rename):
//   GlassCard({ className, children })
//   Pill({ variant, children })            variant: 'sure' | 'repeated' | 'important' | 'default'
//   ProgressBar({ value, className })      value: 0-100
//   SegmentedTabs({ options, value, onChange })
//   BottomNav()                            fixed bottom tab bar (Home, Subjects, Mock Test, Revise, Profile);
//                                          hidden automatically on topic pages (the topic flow hides the menu)
//   Countdown({ target, label })           target: Date | ISO string
//   EmptyState({ title, subtitle, action })
//
// Every interactive element keeps a minimum 44px touch target.
// Icons are hand-written inline SVGs (lucide-style). Zero emojis.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

// ------------------------------------------------------------------ icons ---

function Icon({
  children,
  className = "h-6 w-6",
}: {
  children: ReactNode;
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

export function HomeIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </Icon>
  );
}

export function BookIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </Icon>
  );
}

export function ReviseIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </Icon>
  );
}

export function UserIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Icon>
  );
}

export function FlameIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </Icon>
  );
}

export function ZapIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </Icon>
  );
}

export function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="m9 18 6-6-6-6" />
    </Icon>
  );
}

export function SparkleIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </Icon>
  );
}

export function MockTestIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </Icon>
  );
}

// --------------------------------------------------------------- GlassCard ---

export function GlassCard({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`glass rounded-3xl p-5 shadow-[var(--shadow)] ${className}`}>
      {children}
    </div>
  );
}

// RowCardButton: identical to RowCard but renders as a <button> for accordion
// toggles. The chevron rotates 90deg when expanded.
export function RowCardButton({
  icon,
  title,
  subtitle,
  iconBg = "neon",
  expanded = false,
  onClick,
  ariaLabel,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  iconBg?: "neon" | "track";
  expanded?: boolean;
  onClick: () => void;
  ariaLabel?: string;
}) {
  const bg =
    iconBg === "neon"
      ? "bg-[var(--neon-dim)] text-[var(--neon-soft)]"
      : "bg-[var(--track)] text-[var(--text)]";
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full"
      aria-expanded={expanded}
      aria-label={ariaLabel}
    >
      <div className="glass flex items-center gap-3 rounded-3xl p-4 shadow-[var(--shadow)] transition-transform active:scale-[0.99]">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${bg}`}
        >
          {icon}
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate text-[14px] font-bold text-[var(--text)]">
            {title}
          </span>
          <span className="block truncate text-[12px] text-[var(--text-faint)]">
            {subtitle}
          </span>
        </span>
        <ChevronRightIcon
          className={`h-5 w-5 shrink-0 text-[var(--text-faint)] transition-transform ${expanded ? "rotate-90" : ""}`}
        />
      </div>
    </button>
  );
}

// -------------------------------------------------------------------- Pill ---

export type PillVariant = "sure" | "repeated" | "important" | "default";

const PILL_STYLES: Record<PillVariant, string> = {
  sure: "border-[var(--neon)]/40 bg-[var(--neon)]/10 text-[var(--neon-soft)]",
  repeated:
    "border-amber-400/30 bg-amber-400/10 text-amber-600 dark:text-amber-300",
  important:
    "border-[var(--text-dim)]/40 bg-transparent text-[var(--text-dim)]",
  default: "border-white/20 bg-white/5 text-[var(--text-dim)]",
};

export function Pill({
  variant = "default",
  children,
  className = "",
}: {
  variant?: PillVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex min-h-[28px] items-center rounded-full border px-3 py-1 text-xs font-semibold ${PILL_STYLES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

// ------------------------------------------------------------- ProgressBar ---

export function ProgressBar({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-[var(--track)] ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="gloss-fill h-full rounded-full transition-[width] duration-500"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

// ----------------------------------------------------------- SegmentedTabs ---

export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div
      className="glass flex rounded-2xl p-1"
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.id)}
            className={`min-h-[44px] flex-1 rounded-xl px-3 text-sm font-medium transition-all ${
              active
                ? "bg-[var(--text)] text-[var(--bg)]"
                : "text-[var(--text-dim)] active:bg-[var(--track)]"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// --------------------------------------------------------------- BottomNav ---

const TABS = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/subjects", label: "Subjects", Icon: BookIcon },
  { href: "/mocks", label: "Mock Test", Icon: MockTestIcon },
  { href: "/revise", label: "Revise", Icon: ReviseIcon },
  { href: "/profile", label: "Profile", Icon: UserIcon },
];

/** Topic pages (subject/module/topic) hide the bottom menu while open. */
const TOPIC_PAGE_RE = /^\/subjects\/[^/]+\/[^/]+\/[^/]+/;

export function BottomNav() {
  const pathname = usePathname();
  if (TOPIC_PAGE_RE.test(pathname)) return null;
  return (
    <nav
      className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50"
      aria-label="Primary"
    >
      <div className="glass-strong mx-auto grid w-full max-w-[420px] grid-cols-5 rounded-full px-3 py-1.5">
        {TABS.map(({ href, label, Icon: TabIcon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="flex min-h-[52px] flex-col items-center justify-center gap-1"
            >
              <TabIcon
                className={`h-[22px] w-[22px] ${
                  active ? "text-[var(--text)]" : "text-[var(--text-faint)]"
                }`}
              />
              <span
                className={`text-[10px] leading-none ${
                  active
                    ? "font-semibold text-[var(--text)]"
                    : "text-[var(--text-faint)]"
                }`}
              >
                {label}
              </span>
              <span
                aria-hidden="true"
                className={`h-1 w-1 rounded-full ${
                  active ? "bg-[var(--neon)]" : "bg-transparent"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ------------------------------------------------------------ TabBarSpacer ---

/**
 * Spacer that clears the floating bottom tab bar at the end of long pages,
 * so the last card never hides behind it. Includes the device safe area.
 */
export function TabBarSpacer() {
  return (
    <div
      aria-hidden="true"
      className="h-28 w-full shrink-0"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    />
  );
}

// --------------------------------------------------------------- Countdown ---

export function Countdown({
  target,
  label = "Countdown",
}: {
  target: string | Date;
  label?: string;
}) {
  const targetMs = new Date(target).getTime();
  // Deferred to an effect: reading the clock during render breaks prerendering.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = Math.max(0, targetMs - (now ?? targetMs));
  const units = [
    { v: Math.floor(diff / 86_400_000), l: "days" },
    { v: Math.floor(diff / 3_600_000) % 24, l: "hrs" },
    { v: Math.floor(diff / 60_000) % 60, l: "min" },
    { v: Math.floor(diff / 1_000) % 60, l: "sec" },
  ];

  return (
    <GlassCard>
      <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-dim)]">
        {label}
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2" role="timer">
        {units.map((u) => (
          <div
            key={u.l}
            className="rounded-2xl bg-[var(--track)] px-2 py-3 text-center"
          >
            <div className="text-gradient text-2xl font-bold tabular-nums">
              {String(u.v).padStart(2, "0")}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-[var(--text-faint)]">
              {u.l}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// -------------------------------------------------------------- EmptyState ---

export function EmptyState({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="glass flex h-16 w-16 items-center justify-center rounded-3xl">
        <SparkleIcon className="h-7 w-7 text-[var(--text-faint)]" />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-[var(--text)]">{title}</h2>
      {subtitle ? (
        <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-[var(--text-dim)]">
          {subtitle}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

// --------------------------------------------------------------- RowCard ---
// Standard list row card: icon + title + subtitle + chevron.
// Used by Practice, Library, Revise, NotebookLM for identical ratios.

export function RowCard({
  icon,
  title,
  subtitle,
  iconBg = "neon",
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  iconBg?: "neon" | "track";
}) {
  const bg =
    iconBg === "neon"
      ? "bg-[var(--neon-dim)] text-[var(--neon-soft)]"
      : "bg-[var(--track)] text-[var(--text)]";
  return (
    <div className="glass flex items-center gap-3 rounded-3xl p-4 shadow-[var(--shadow)] transition-transform active:scale-[0.99]">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${bg}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-bold text-[var(--text)]">
          {title}
        </span>
        <span className="block truncate text-[12px] text-[var(--text-faint)]">
          {subtitle}
        </span>
      </span>
      <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
    </div>
  );
}
