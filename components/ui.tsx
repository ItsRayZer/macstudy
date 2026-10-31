// components/ui.tsx
// MacStudy shared UI kit (liquid glass, mobile-first, thumb-friendly).
//
// WORKER CONTRACT (stable API - do not rename):
//   GlassCard({ className, children })
//   Pill({ variant, children })            variant: 'sure' | 'repeated' | 'important' | 'default'
//   ProgressBar({ value, className })      value: 0-100
//   SegmentedTabs({ options, value, onChange })
//   BottomNav()                            fixed bottom tab bar (Home, Subjects, Revise, Profile)
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

// -------------------------------------------------------------------- Pill ---

export type PillVariant = "sure" | "repeated" | "important" | "default";

const PILL_STYLES: Record<PillVariant, string> = {
  sure: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  repeated:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  important: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  default:
    "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
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
        className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] transition-[width] duration-500"
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
                ? "bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white shadow-lg shadow-violet-900/30"
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
  { href: "/revise", label: "Revise", Icon: ReviseIcon },
  { href: "/profile", label: "Profile", Icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50" aria-label="Primary">
      <div className="mx-auto w-full max-w-[480px] px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))] pt-2">
        <div className="glass-strong flex items-stretch rounded-3xl px-2 py-2 shadow-[var(--shadow)]">
          {TABS.map(({ href, label, Icon: TabIcon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex min-h-[60px] min-w-[64px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl"
              >
                <span
                  className={`flex h-9 w-14 items-center justify-center rounded-full transition-all ${
                    active
                      ? "bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white shadow-lg shadow-violet-900/40"
                      : "text-[var(--text-faint)]"
                  }`}
                >
                  <TabIcon className="h-5 w-5" />
                </span>
                <span
                  className={`text-[11px] leading-none ${
                    active
                      ? "font-semibold text-[var(--text)]"
                      : "text-[var(--text-faint)]"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
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
