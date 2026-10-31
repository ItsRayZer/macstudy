// components/bookmarks.tsx
// Shared bookmark toggle: filled vs outline icon, instant state, persists via
// the existing bookmarks store (Supabase with localStorage fallback).
//
// Two kinds of targets reuse the same Bookmark record shape:
//   - question: { subject, module, topic: topicTitle, qIndex }
//   - paper:    { subject, module: "__paper__", topic: paperId, qIndex: -1 }
//
// Monochrome, zero emojis.

"use client";

import { useEffect, useState } from "react";
import { getDB } from "../lib/db";

export interface BookmarkRef {
  subject: string;
  module: string;
  topic: string;
  qIndex: number;
}

export function questionBookmarkRef(
  subject: string,
  module: string,
  topicTitle: string,
  qIndex: number,
): BookmarkRef {
  return { subject, module, topic: topicTitle, qIndex };
}

export function paperBookmarkRef(
  subject: string,
  paperId: string,
): BookmarkRef {
  return { subject, module: "__paper__", topic: paperId, qIndex: -1 };
}

export function isPaperBookmark(ref: BookmarkRef): boolean {
  return ref.module === "__paper__" && ref.qIndex === -1;
}

function matches(a: BookmarkRef, b: BookmarkRef): boolean {
  return (
    a.subject === b.subject &&
    a.module === b.module &&
    a.topic === b.topic &&
    a.qIndex === b.qIndex
  );
}

export function BookmarkButton({
  target,
  label = "question",
  className = "",
}: {
  target: BookmarkRef;
  label?: string;
  className?: string;
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let live = true;
    getDB()
      .getBookmarks(target.subject)
      .then((all) => {
        if (!live) return;
        setOn(all.some((b) => matches(target, b)));
      })
      .catch(() => {});
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.subject, target.module, target.topic, target.qIndex]);

  const click = async () => {
    try {
      const now = await getDB().toggleBookmark(
        target.subject,
        target.module,
        target.topic,
        target.qIndex,
      );
      setOn(now);
    } catch {
      // keep the UI usable when storage fails
    }
  };

  return (
    <button
      type="button"
      onClick={click}
      aria-label={on ? `Remove bookmark for this ${label}` : `Bookmark this ${label}`}
      aria-pressed={on}
      title={on ? "Bookmarked" : "Bookmark"}
      className={`flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-2xl transition-colors active:bg-[var(--track)] ${
        on ? "text-[var(--text)]" : "text-[var(--text-dim)]"
      } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={on ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </svg>
    </button>
  );
}
