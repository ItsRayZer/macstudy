// app/subjects/[short]/pyq-practice/page.tsx
// Subject-wise PYQ practice (server): prerenders every subject, hands off to client.

import { notFound } from "next/navigation";
import { subjects } from "@/src/content/subjects";
import { getSubjectLocal } from "../../../../lib/study";
import { PyqPracticeClient } from "./client";

export async function generateStaticParams() {
  return subjects.map((s) => ({ short: s.short }));
}

export default async function PyqPracticePage({
  params,
}: {
  params: Promise<{ short: string }>;
}) {
  const { short } = await params;
  const subject = getSubjectLocal(short);
  if (!subject) notFound();
  return <PyqPracticeClient short={subject.short} />;
}
