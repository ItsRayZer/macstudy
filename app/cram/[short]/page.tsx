// app/cram/[short]/page.tsx
// Cram mode: exam-date-driven urgent review. Shows SURE MARK + REPEATED
// questions sorted by marks (15-mark first) for last-minute prep.

import { notFound } from "next/navigation";
import { CramClient } from "./client";
import { subjects } from "../../../lib/content";

export async function generateStaticParams() {
  return subjects.map((s) => ({ short: s.short }));
}

export default async function CramPage({
  params,
}: {
  params: Promise<{ short: string }>;
}) {
  const { short } = await params;
  const subject = subjects.find(
    (s) => s.short.toLowerCase() === short.toLowerCase()
  );
  if (!subject) notFound();

  return <CramClient short={subject.short} name={subject.name} />;
}
