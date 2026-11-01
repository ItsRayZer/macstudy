// app/subjects/[short]/flashcards/page.tsx
// Subject-wide flashcards (server): prerenders every subject, hands off to client.

import { notFound } from "next/navigation";
import { subjects } from "@/src/content/subjects";
import { getSubjectLocal } from "../../../../lib/study";
import { FlashcardsClient } from "./client";

export async function generateStaticParams() {
  return subjects.map((s) => ({ short: s.short }));
}

export default async function FlashcardsPage({
  params,
}: {
  params: Promise<{ short: string }>;
}) {
  const { short } = await params;
  const subject = getSubjectLocal(short);
  if (!subject) notFound();
  return <FlashcardsClient short={subject.short} />;
}
