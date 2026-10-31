// app/subjects/[short]/[module]/[topic]/page.tsx
// Topic landing: renders the Learn phase directly (phases are separate
// pages; the bottom tab menu stays hidden on all of them).

import { notFound } from "next/navigation";
import { subjects } from "@/src/content/subjects";
import {
  getSubjectLocal,
  getModuleLocal,
  getTopicBySlug,
  slugify,
} from "../../../../../lib/study";
import { LearnClient } from "./learn/client";

export async function generateStaticParams() {
  return subjects.flatMap((s) =>
    s.modules.flatMap((m) =>
      m.topics.map((t) => ({
        short: s.short,
        module: m.num,
        topic: slugify(t.title),
      })),
    ),
  );
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ short: string; module: string; topic: string }>;
}) {
  const { short, module, topic } = await params;
  const subject = getSubjectLocal(short);
  const mod = subject ? getModuleLocal(subject, module) : undefined;
  const top = mod ? getTopicBySlug(mod, topic) : undefined;
  if (!subject || !mod || !top) notFound();
  return <LearnClient short={subject.short} num={mod.num} slug={topic} />;
}
