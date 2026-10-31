// app/subjects/[short]/[module]/[topic]/page.tsx
// Topic page (server): resolves subject + module + topic slug, prerenders
// every topic page at build time, hands off to the client view.

import { notFound } from "next/navigation";
import { subjects } from "@/src/content/subjects";
import {
  getSubjectLocal,
  getModuleLocal,
  getTopicBySlug,
  slugify,
} from "../../../../../lib/study";
import { TopicView } from "./view";

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
  return <TopicView short={subject.short} num={mod.num} slug={topic} />;
}
