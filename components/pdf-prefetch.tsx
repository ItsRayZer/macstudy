// components/pdf-prefetch.tsx
// Background PDF prefetch: loads PDFs into the service worker cache
// so they open instantly and work offline.
// LAZY: only runs when the user actually opens a PDF page, never on
// homepage load. The old version fetched 6 PDFs on every visit.

"use client";

import { useEffect } from "react";

const PDFS = [
  "/pdfs/QT-Complete.pdf",
  "/pdfs/DBMS-Complete.pdf",
  "/pdfs/SF-Complete.pdf",
  "/pdfs/DAA-Complete.pdf",
  "/pdfs/PYTHON-Complete.pdf",
  "/pdfs/FE-Complete.pdf",
];

export function PdfPrefetch() {
  useEffect(() => {
    // Only prefetch on slow networks never; on fast connections wait
    // until the user is idle AND has been on the page 10s. This keeps
    // the first tap instant.
    if (typeof navigator !== "undefined" && "connection" in navigator) {
      const conn = (navigator as any).connection;
      if (conn && (conn.saveData || conn.effectiveType === "2g" || conn.effectiveType === "slow-2g")) {
        return;
      }
    }
    const t = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(
          () => {
            for (const url of PDFS) {
              fetch(url, { mode: "no-cors" }).catch(() => {});
            }
          },
          { timeout: 15000 },
        );
      }
    }, 10000);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
