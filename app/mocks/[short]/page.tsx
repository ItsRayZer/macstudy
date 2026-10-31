// app/mocks/[short]/page.tsx
// Server wrapper: resolves the route param, prerenders known subjects,
// and hands off to the client-side MockRunner.

import { EmptyState } from "../../../components/ui";
import Link from "next/link";
import { getMockConfig } from "../build-paper";
import { MockRunner } from "./runner";

export async function generateStaticParams() {
  return ["qt", "dbms", "sf", "daa", "python", "fe"].map((short) => ({
    short,
  }));
}

export default async function MockSubjectPage({
  params,
}: {
  params: Promise<{ short: string }>;
}) {
  const { short } = await params;
  const config = getMockConfig(short);
  if (!config) {
    return (
      <main>
        <EmptyState
          title="Unknown subject"
          subtitle="This mock test does not exist."
          action={
            <Link
              href="/mocks"
              className="flex min-h-[44px] items-center rounded-2xl bg-[var(--text)] text-[var(--bg)] px-6 text-sm font-semibold text-white"
            >
              Back to mocks
            </Link>
          }
        />
      </main>
    );
  }
  return <MockRunner short={config.short} />;
}
