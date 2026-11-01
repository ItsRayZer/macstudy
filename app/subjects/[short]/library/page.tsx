// app/subjects/[short]/library/page.tsx
// Library: PYQ papers, complete PDF, module PDFs. Simple tap-to-open list.

import { notFound } from "next/navigation";
import { LibraryClient } from "./client";
import { subjects } from "@/src/content/subjects";

export async function generateStaticParams() {
  return subjects.map((s) => ({ short: s.short }));
}

export default async function LibraryPage({
  params,
}: {
  params: Promise<{ short: string }>;
}) {
  const { short } = await params;
  const subject = subjects.find(
    (s) => s.short.toLowerCase() === short.toLowerCase()
  );
  if (!subject) notFound();
  return <LibraryClient short={subject.short} name={subject.name} />;
}
