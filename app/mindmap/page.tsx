// app/mindmap/page.tsx
// Mind map subject picker: choose a subject to open its syllabus mind map.

import Link from "next/link";
import { ChevronRightIcon, TabBarSpacer } from "../../components/ui";
import { subjects } from "@/src/content/subjects";

export default function MindMapIndexPage() {
  return (
    <main className="flex flex-col gap-5">
      <header>
        <h1 className="text-[28px] font-bold leading-tight text-[var(--text)]">
          Mind maps
        </h1>
        <p className="mt-1 text-sm text-[var(--text-dim)]">
          Pick a subject to see its full syllabus as an expandable tree.
        </p>
      </header>
      <div className="flex flex-col gap-2">
        {subjects.map((s) => {
          const topicCount = s.modules.reduce(
            (n, m) => n + m.topics.length,
            0,
          );
          return (
            <Link
              key={s.short}
              href={`/subjects/${s.short}/mindmap`}
              className="glass flex min-h-[68px] items-center gap-4 rounded-3xl p-4 transition-transform active:scale-[0.99]"
              aria-label={`${s.name} mind map`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--neon-dim)] text-[15px] font-bold text-[var(--neon-soft)]">
                {s.short.slice(0, 2)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold text-[var(--text)]">
                  {s.name}
                </span>
                <span className="block truncate text-[12px] text-[var(--text-faint)]">
                  {s.modules.length} chapters · {topicCount} topics
                </span>
              </span>
              <ChevronRightIcon className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />
            </Link>
          );
        })}
      </div>
      <TabBarSpacer />
    </main>
  );
}
