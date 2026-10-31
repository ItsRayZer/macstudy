// app/subjects/[short]/[module]/page.tsx
// Module page (server): resolves subject + module, prerenders every
// module page at build time, hands off to the client view.

import { notFound } from "next/navigation";
import { subjects } from "@/src/content/subjects";
import { getSubjectLocal, getModuleLocal } from "../../../../lib/study";
import { ModuleView } from "./view";

export async function generateStaticParams() {
  return subjects.flatMap((s) =>
    s.modules.map((m) => ({ short: s.short, module: m.num })),
  );
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ short: string; module: string }>;
}) {
  const { short, module } = await params;
  const subject = getSubjectLocal(short);
  const mod = subject ? getModuleLocal(subject, module) : undefined;
  if (!subject || !mod) notFound();
  return <ModuleView short={subject.short} num={mod.num} />;
}
