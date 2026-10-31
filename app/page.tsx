// app/page.tsx
// Home: header (avatar + XP + streak), slim exam banner, search, subject
// tiles, Study Room cards, Resources cards. Monochrome AMOLED premium.

"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ChevronRightIcon,
  FlameIcon,
  ProgressBar,
} from "../components/ui";
import { useAppStore } from "../lib/store";
import { getDB } from "../lib/db";
import {
  computeSubjectProgress,
  firstIncompleteTopic,
  overallStats,
  type ContinueTarget,
  type SubjectProgress,
} from "../lib/progress";
import { subjects } from "../lib/content";
import { slugify, topicHref } from "../lib/study";
import { nearestExam, type ExamInfo } from "../lib/exams";

const DRIVE_NOTES_URL =
  "https://drive.google.com/drive/folders/1jObfJTckzgPktq9P0NkblruKsXN8-bak";

// ------------------------------------------------------------------- icons ---

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
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function CoinIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
    </Icon>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </Icon>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <polygon points="6 3 20 12 6 21 6 3" />
    </Icon>
  );
}

function MockIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </Icon>
  );
}

function LibraryIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 8v12" />
      <path d="M4 4v16" />
    </Icon>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </Icon>
  );
}

function CardsIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </Icon>
  );
}

function BookmarkRowIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </Icon>
  );
}

function MindMapRowIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="5" cy="5" r="1.8" />
      <circle cx="19" cy="5" r="1.8" />
      <circle cx="5" cy="19" r="1.8" />
      <circle cx="19" cy="19" r="1.8" />
      <path d="m6.3 6.3 4-4M17.7 6.3l-4-4M6.3 17.7l4 4M17.7 17.7l-4 4" />
    </Icon>
  );
}

// Minimal monochrome line icons, one per subject.
function SubjectGlyph({ short, className }: { short: string; className?: string }) {
  switch (short) {
    case "QT":
      return (
        <Icon className={className}>
          <rect width="16" height="20" x="4" y="2" rx="2" />
          <path d="M8 6h8" />
          <path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01" />
        </Icon>
      );
    case "DBMS":
      return (
        <Icon className={className}>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14a9 3 0 0 0 18 0V5" />
          <path d="M3 12a9 3 0 0 0 18 0" />
        </Icon>
      );
    case "SF":
      return (
        <Icon className={className}>
          <path d="m12 2 9 4.9-9 4.9-9-4.9Z" />
          <path d="m3 11.9 9 4.9 9-4.9" />
          <path d="m3 16.9 9 4.9 9-4.9" />
        </Icon>
      );
    case "DAA":
      return (
        <Icon className={className}>
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
        </Icon>
      );
    case "PYTHON":
      return (
        <Icon className={className}>
          <path d="m4 17 6-6-6-6" />
          <path d="M12 19h8" />
        </Icon>
      );
    default:
      return (
        <Icon className={className}>
          <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
          <path d="M1 14h6M9 8h6M17 16h6" />
        </Icon>
      );
  }
}

// ------------------------------------------------------------------ search ---

interface SearchHit {
  key: string;
  label: string;
  sub: string;
  href: string;
}

function searchAll(q: string): SearchHit[] {
  const needle = q.trim().toLowerCase();
  if (needle.length < 2) return [];
  const hits: SearchHit[] = [];
  for (const s of subjects) {
    if (
      s.short.toLowerCase().includes(needle) ||
      s.name.toLowerCase().includes(needle)
    ) {
      hits.push({
        key: `s-${s.short}`,
        label: s.name,
        sub: "Subject",
        href: `/subjects/${s.short}`,
      });
    }
    for (const m of s.modules) {
      for (const t of m.topics) {
        if (t.title.toLowerCase().includes(needle)) {
          hits.push({
            key: `t-${s.short}-${m.num}-${t.title}`,
            label: t.title,
            sub: `${s.short} · Module ${m.num}`,
            href: topicHref(s.short, m.num, t),
          });
        }
        if (hits.length >= 12) return hits;
      }
    }
  }
  return hits;
}

// -------------------------------------------------------------------- page ---

function countdownText(exam: ExamInfo): string {
  const diff = Math.max(0, new Date(exam.at).getTime() - Date.now());
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor(diff / 3_600_000) % 24;
  const m = Math.floor(diff / 60_000) % 60;
  if (d > 0) return `${d}d ${h}h left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

export default function HomePage() {
  const xpToday = useAppStore((s) => s.xpToday);
  const streak = useAppStore((s) => s.streak);
  const refreshFromDB = useAppStore((s) => s.refreshFromDB);

  const [totalXP, setTotalXP] = useState(0);
  const [progresses, setProgresses] = useState<SubjectProgress[]>([]);
  const [continueTarget, setContinueTarget] =
    useState<ContinueTarget | null>(null);
  const [examNow, setExamNow] = useState<ExamInfo | null>(null);
  const [examLeft, setExamLeft] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const exam = nearestExam(new Date());
    setExamNow(exam);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExamLeft(exam ? countdownText(exam) : "");
    const id = window.setInterval(() => {
      const e = nearestExam(new Date());
      setExamNow(e);
      setExamLeft(e ? countdownText(e) : "");
    }, 60_000);
    refreshFromDB().catch(() => {});
    let cancelled = false;
    (async () => {
      try {
        const [stats, cont] = await Promise.all([
          overallStats(),
          firstIncompleteTopic(),
        ]);
        const progs = await Promise.all(
          subjects.map((s) => computeSubjectProgress(s.short)),
        );
        if (cancelled) return;
        setTotalXP(stats.totalXP);
        setContinueTarget(cont);
        setProgresses(progs.filter((p): p is SubjectProgress => p != null));
      } catch {
        // shell still renders
      }
    })();
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [refreshFromDB]);

  const hits = useMemo(() => searchAll(query), [query]);
  const practiceHref = continueTarget
    ? `/subjects/${continueTarget.subjectShort}/${continueTarget.moduleNum}/${slugify(continueTarget.topicTitle)}`
    : "/subjects";

  const studyRoom: { icon: ReactNode; title: string; sub: string; href: string }[] = [
    {
      icon: <PlayIcon className="h-6 w-6" />,
      title: "Practice",
      sub: continueTarget ? continueTarget.topicTitle : "Pick up where you left off",
      href: practiceHref,
    },
    {
      icon: <MockIcon className="h-6 w-6" />,
      title: "Mock Test",
      sub: "Timed exam papers",
      href: "/mocks",
    },
    {
      icon: <LibraryIcon className="h-6 w-6" />,
      title: "Question Library",
      sub: "All PYQ papers",
      href: "/pyqs",
    },
  ];

  const resources: { icon: ReactNode; title: string; sub: string; href: string; external?: boolean }[] = [
    {
      icon: <LibraryIcon className="h-6 w-6" />,
      title: "Chapter-wise PYQ",
      sub: "Past papers by subject",
      href: "/pyqs",
    },
    {
      icon: <FileIcon className="h-6 w-6" />,
      title: "Study Materials",
      sub: "PDF notes on Drive",
      href: DRIVE_NOTES_URL,
      external: true,
    },
    {
      icon: <CardsIcon className="h-6 w-6" />,
      title: "Flashcards",
      sub: "Spaced revision",
      href: "/revise",
    },
    {
      icon: <BookmarkRowIcon className="h-6 w-6" />,
      title: "Bookmarks",
      sub: "Saved questions & papers",
      href: "/revise",
    },
    {
      icon: <MindMapRowIcon className="h-6 w-6" />,
      title: "Mind Maps",
      sub: "Syllabus at a glance",
      href: "/mindmap",
    },
  ];

  return (
    <main className="flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[24px] font-extrabold tracking-tight text-[var(--neon)] drop-shadow-[0_0_12px_var(--neon)]">
            BcaAce
          </span>
          <p className="text-[12px] text-[var(--text-faint)]">
            MGU BCA 3rd Sem
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex min-h-[36px] items-center gap-1.5 rounded-full border border-[var(--neon)]/30 bg-[var(--neon)]/10 px-3">
            <CoinIcon className="h-4 w-4 text-[var(--neon-soft)]" />
            <span className="text-[13px] font-bold tabular-nums text-[var(--text)]">
              {totalXP}
            </span>
          </span>
          <span className="flex min-h-[36px] items-center gap-1.5 rounded-full border border-[var(--neon)]/30 bg-[var(--neon)]/10 px-3">
            <FlameIcon className="h-4 w-4 text-[var(--neon-soft)]" />
            <span className="text-[13px] font-bold tabular-nums text-[var(--text)]">
              {streak}
            </span>
          </span>
        </div>
      </header>

      {examNow ? (
        <div className="flex items-center justify-between rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-3">
          <span className="text-[14px] font-semibold text-[var(--text)]">
            {examNow.short} exam
          </span>
          <span className="text-[13px] tabular-nums text-[var(--text-dim)]">
            {examLeft}
          </span>
        </div>
      ) : null}

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-faint)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to learn?"
          aria-label="Search subjects and topics"
          className="min-h-[52px] w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] pl-12 pr-4 text-[15px] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--text-dim)]"
        />
      </div>

      {query.trim().length >= 2 ? (
        <section aria-label="Search results">
          <h2 className="mb-3 text-[17px] font-bold text-[var(--text)]">
            Results
          </h2>
          {hits.length === 0 ? (
            <p className="text-[14px] text-[var(--text-dim)]">
              Nothing found. Try a subject name or topic word.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {hits.map((h) => (
                <Link
                  key={h.key}
                  href={h.href}
                  className="glass block rounded-2xl p-4 active:opacity-80"
                >
                  <p className="truncate text-[15px] font-semibold text-[var(--text)]">
                    {h.label}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[var(--text-faint)]">
                    {h.sub}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <section aria-label="Subjects">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-[var(--text)]">
                Subjects
              </h2>
              <Link
                href="/subjects"
                className="flex min-h-[44px] items-center px-2 text-[13px] font-medium text-[var(--text-dim)]"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map((s) => {
                const p = progresses.find((x) => x.short === s.short);
                return (
                  <Link
                    key={s.short}
                    href={`/subjects/${s.short}`}
                    className="glass block rounded-3xl p-4 transition-transform active:scale-[0.98]"
                    aria-label={`${s.name}, ${p?.percent ?? 0}% complete`}
                  >
                    <SubjectGlyph
                      short={s.short}
                      className="h-7 w-7 text-[var(--text)]"
                    />
                    <p className="mt-3 text-[15px] font-bold text-[var(--text)]">
                      {s.short === "PYTHON" ? "Python" : s.short}
                    </p>
                    <p className="truncate text-[11px] text-[var(--text-faint)]">
                      {s.name}
                    </p>
                    <ProgressBar value={p?.percent ?? 0} className="mt-3 h-1" />
                    <p className="mt-1.5 text-[11px] tabular-nums text-[var(--text-faint)]">
                      {p?.percent ?? 0}%
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section aria-label="Study Room">
            <h2 className="mb-3 text-[17px] font-bold text-[var(--text)]">
              Study Room
            </h2>
            <div className="flex flex-col gap-2">
              {studyRoom.map((c) => (
                <Link
                  key={c.title}
                  href={c.href}
                  className="glass flex min-h-[68px] items-center gap-4 rounded-3xl p-4 transition-transform active:scale-[0.99]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--track)] text-[var(--text)]">
                    {c.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-bold text-[var(--text)]">
                      {c.title}
                    </span>
                    <span className="block truncate text-[12px] text-[var(--text-faint)]">
                      {c.sub}
                    </span>
                  </span>
                  <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
                </Link>
              ))}
            </div>
          </section>

          <section aria-label="Resources">
            <h2 className="mb-3 text-[17px] font-bold text-[var(--text)]">
              Resources
            </h2>
            <div className="flex flex-col gap-2">
              {resources.map((c) =>
                c.external ? (
                  <a
                    key={c.title}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass flex min-h-[68px] items-center gap-4 rounded-3xl p-4 transition-transform active:scale-[0.99]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--track)] text-[var(--text)]">
                      {c.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-bold text-[var(--text)]">
                        {c.title}
                      </span>
                      <span className="block truncate text-[12px] text-[var(--text-faint)]">
                        {c.sub}
                      </span>
                    </span>
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
                  </a>
                ) : (
                  <Link
                    key={c.title}
                    href={c.href}
                    className="glass flex min-h-[68px] items-center gap-4 rounded-3xl p-4 transition-transform active:scale-[0.99]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--track)] text-[var(--text)]">
                      {c.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-bold text-[var(--text)]">
                        {c.title}
                      </span>
                      <span className="block truncate text-[12px] text-[var(--text-faint)]">
                        {c.sub}
                      </span>
                    </span>
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
                  </Link>
                ),
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
