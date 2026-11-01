// components/pdf-prefetch.tsx
// Background PDF prefetch: loads PDFs into the service worker cache
// so they open instantly and work offline.

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
    // Wait for idle, then prefetch in background.
    const prefetch = () => {
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(() => {
          for (const url of PDFS) {
            fetch(url, { mode: "no-cors" }).catch(() => {});
          }
        });
      } else {
        setTimeout(() => {
          for (const url of PDFS) {
            fetch(url, { mode: "no-cors" }).catch(() => {});
          }
        }, 3000);
      }
    };
    prefetch();
  }, []);

  return null;
}
