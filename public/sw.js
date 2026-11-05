// Service Worker: cache-first for instant loads, network updates in background.
const CACHE = "bcaeasy-v2";

const PRECACHE = ["/", "/subjects"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // Only handle same-origin GET requests.
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;

  // PDFs, diagrams, manifests, JS/CSS: cache-first (they rarely change).
  if (
    url.pathname.startsWith("/pdfs/") ||
    url.pathname.startsWith("/pyq/") ||
    url.pathname.startsWith("/diagrams/") ||
    url.pathname.startsWith("/_next/static/")
  ) {
    e.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const hit = await cache.match(e.request);
        if (hit) return hit;
        const res = await fetch(e.request);
        if (res.ok) cache.put(e.request, res.clone());
        return res;
      })
    );
    return;
  }

  // Pages: stale-while-revalidate. Serve cache instantly, update in background.
  // This makes the app open with one tap even on slow networks.
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(e.request);
      const network = fetch(e.request)
        .then((res) => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        })
        .catch(() => null);
      if (hit) return hit;
      const res = await network;
      if (res) return res;
      return new Response("Offline", { status: 503 });
    })
  );
});
