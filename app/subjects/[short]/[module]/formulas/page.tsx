// app/subjects/[short]/[module]/formulas/page.tsx
// Formula chart page (server): a clean premium formula sheet for the module,
// grouped by topic. Only modules with curated formulas get a page; the module
// view only links here when a chart exists.

import Link from "next/link";
import { notFound } from "next/navigation";
import { subjects } from "@/src/content/subjects";
import { getModuleFormulas } from "@/src/content/formulas";
import { getModuleLocal, getSubjectLocal } from "../../../../../lib/study";
import { TabBarSpacer } from "../../../../../components/ui";
import { FormulaCard } from "../../../../../components/formula-card";

function BackIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-6 w-6"}
      aria-hidden="true"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

export async function generateStaticParams() {
  return subjects.flatMap((s) =>
    s.modules
      .filter((m) => getModuleFormulas(s.short, m.num) != null)
      .map((m) => ({ short: s.short, module: m.num })),
  );
}

export default async function FormulasPage({
  params,
}: {
  params: Promise<{ short: string; module: string }>;
}) {
  const { short, module } = await params;
  const subject = getSubjectLocal(short);
  const mod = subject ? getModuleLocal(subject, module) : undefined;
  const chart = getModuleFormulas(short, module);
  if (!subject || !mod || !chart) notFound();

  return (
    <main className="flex flex-col gap-5">
      <header>
        <div className="flex items-center justify-between">
          <Link
            href={`/subjects/${subject.short}/${mod.num}`}
            aria-label={`Back to ${mod.title}`}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center self-start rounded-2xl text-[var(--text)] active:bg-[var(--track)]"
          >
            <BackIcon className="h-6 w-6" />
          </Link>
        </div>
        <p className="mt-2 text-[13px] font-medium uppercase tracking-widest text-[var(--text-faint)]">
          Formula chart · Chapter {mod.num}
        </p>
        <h1 className="mt-1 text-[26px] font-bold leading-tight text-[var(--text)]">
          {mod.title}
        </h1>
        <p className="mt-1 text-[13px] text-[var(--text-dim)]">
          Every formula in this chapter on one sheet. Made for last-day
          revision.
        </p>
      </header>

      {(() => {
        let n = 0;
        return chart.groups.map((g) => (
          <section
            key={g.topic}
            aria-label={g.topic}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <h2 className="shrink-0 text-[15px] font-bold text-[var(--text)]">
                {g.topic}
              </h2>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-[var(--glass-border)]"
              />
            </div>
            {g.items.map((item) => {
              n += 1;
              return (
                <FormulaCard
                  key={n}
                  index={n}
                  label={item.label}
                  formula={item.formula}
                  where={item.where}
                />
              );
            })}
          </section>
        ));
      })()}
      <TabBarSpacer />
    </main>
  );
}
