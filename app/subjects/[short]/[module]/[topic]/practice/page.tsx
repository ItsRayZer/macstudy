// app/subjects/[short]/[module]/[topic]/practice/page.tsx
// Practice phase page (server): prerenders every topic, hands off to client.

import { notFound } from "next/navigation";
import { subjects } from "@/src/content/subjects";
import {
  getSubjectLocal,
  getModuleLocal,
  getTopicBySlug,
  slugify,
} from "../../../../../../lib/study";
import { PracticeClient } from "./client";

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

export default async function PracticePage({
  params,
}: {
  params: Promise<{ short: string; module: string; topic: string }>;
}) {
  const { short, module, topic } = await params;
  const subject = getSubjectLocal(short);
  const mod = subject ? getModuleLocal(subject, module) : undefined;
  const top = mod ? getTopicBySlug(mod, topic) : undefined;
  if (!subject || !mod || !top) notFound();
  return <PracticeClient short={subject.short} num={mod.num} slug={topic} />;
}
