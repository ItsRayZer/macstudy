// app/subjects/[short]/practice/page.tsx
// Practice Hub: mock test, PYQ practice, cram mode in one place.

import { notFound } from "next/navigation";
import Link from "next/link";
import { subjects } from "@/src/content/subjects";
import { GlassCard, TabBarSpacer } from "../../../../components/ui";

export async function generateStaticParams() {
  return subjects.map((s) => ({ short: s.short }));
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

export default async function PracticeHubPage({
  params,
}: {
  params: Promise<{ short: string }>;
}) {
  const { short } = await params;
  const subject = subjects.find(
    (s) => s.short.toLowerCase() === short.toLowerCase()
  );
  if (!subject) notFound();

  const options = [
    {
      title: "Mock Test",
      sub: "Full exam simulation",
      href: `/mocks/${subject.short}`,
      icon: <TargetIcon className="h-5 w-5" />,
    },
    {
      title: "Practice PYQs",
      sub: "Previous year questions",
      href: `/subjects/${subject.short}/pyq-practice`,
      icon: <ZapIcon className="h-5 w-5" />,
    },
    {
      title: "Cram Mode",
      sub: "Hot questions only",
      href: `/cram/${subject.short}`,
      icon: <FlameIcon className="h-5 w-5" />,
    },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 pb-32 pt-6">
      <Link
        href={`/subjects/${subject.short}`}
        className="mb-4 inline-flex items-center gap-2 text-[14px] text-[var(--text-dim)]"
      >
        ← Back to {subject.name}
      </Link>

      <h1 className="text-[24px] font-bold text-[var(--text)]">Practice</h1>
      <p className="mt-1 text-[14px] text-[var(--text-dim)]">
        Test yourself for {subject.name}
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {options.map((o) => (
          <Link key={o.href} href={o.href}>
            <GlassCard className="flex items-center gap-3 p-4! transition-transform active:scale-[0.99]">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--neon-dim)] text-[var(--neon-soft)]">
                {o.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold text-[var(--text)]">
                  {o.title}
                </span>
                <span className="block text-[13px] text-[var(--text-faint)]">
                  {o.sub}
                </span>
              </span>
              <span className="text-[var(--text-faint)]">›</span>
            </GlassCard>
          </Link>
        ))}
      </div>

      <TabBarSpacer />
    </div>
  );
}
