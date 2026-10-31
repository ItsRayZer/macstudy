// components/windowed.tsx
// Intersection-based windowing for long lists: renders the first page of
// items, then appends more as the learner scrolls near the end. Keeps long
// pages (mistake deck, bookmarks) at 60fps on mid-range Android by bounding
// the live DOM instead of mounting hundreds of glass cards at once.

"use client";

import { useEffect, useRef, useState } from "react";

export function useWindowed<T>(items: T[], pageSize = 20) {
  const [count, setCount] = useState(pageSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Restart windowing when the list itself changes.
  useEffect(() => {
    setCount(pageSize);
  }, [items, pageSize]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || count >= items.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setCount((c) => Math.min(c + pageSize, items.length));
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [count, items.length, pageSize]);

  return {
    visible: items.slice(0, count),
    sentinelRef,
    hasMore: count < items.length,
  };
}

/** Sentinel div that triggers the next page. Render after the list. */
export function WindowSentinel({
  sentinelRef,
  hasMore,
}: {
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  hasMore: boolean;
}) {
  if (!hasMore) return null;
  return <div ref={sentinelRef} aria-hidden="true" className="h-1" />;
}
