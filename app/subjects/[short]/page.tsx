// app/subjects/[short]/page.tsx
// Subject page (server): resolves the subject, prerenders every subject at
// build time, and hands off to the client view for progress reads.

import { notFound } from "next/navigation";
import { subjects } from "@/src/content/subjects";
import { getSubjectLocal } from "../../../lib/study";
import { SubjectView } from "./view";

export async function generateStaticParams() {
  return subjects.map((s) => ({ short: s.short }));
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ short: string }>;
}) {
  const { short } = await params;
  const subject = getSubjectLocal(short);
  if (!subject) notFound();
  return <SubjectView short={subject.short} />;
}
