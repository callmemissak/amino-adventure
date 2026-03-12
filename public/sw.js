// Peptide Atlas Service Worker
const CACHE_NAME = "peptide-atlas-v1";
const RUNTIME_CACHE = "peptide-atlas-runtime-v1";

// Core assets to pre-cache on install
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
];

// Install: pre-cache core shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        cacheNames.filter((name) => !currentCaches.includes(name))
      )
      .then((toDelete) =>
        Promise.all(toDelete.map((name) => caches.delete(name)))
      )
      .then(() => self.clients.claim())
  );
});

// Fetch strategy:
// - Navigation requests: Network-first, fall back to cache, then offline page
// - API requests: Network-first with cache fallback
// - Static assets (_next/static, icons, fonts): Cache-first
// - Everything else: Network-first
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin && !url.hostname.includes("fonts.googleapis.com") && !url.hostname.includes("fonts.gstatic.com")) return;

  // Google Fonts: cache-first (they never change once versioned)
  if (url.hostname.includes("fonts.googleapis.com") || url.hostname.includes("fonts.gstatic.com")) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  // Static Next.js assets: cache-first
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  // API requests: network-first with cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) =>
        fetch(request)
          .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cache.match(request))
      )
    );
    return;
  }

  // Navigation / page requests: network-first
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => {
            if (cached) return cached;
            // Fallback offline page
            return caches.match("/").then((home) => {
              if (home) return home;
              return new Response(offlineHTML(), {
                headers: { "Content-Type": "text/html" },
              });
            });
          })
        )
    );
    return;
  }

  // Everything else: network-first
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

function offlineHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Peptide Atlas — Offline</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=JetBrains+Mono:wght@400&display=swap');
    body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; background:#08080f; color:#e2ddd5; font-family:'Lato',sans-serif; }
    .c { text-align:center; padding:40px; max-width:420px; }
    h1 { font-family:'Playfair Display',serif; font-size:32px; margin-bottom:12px; }
    p { color:rgba(226,221,213,0.5); font-size:14px; line-height:1.7; margin-bottom:24px; }
    button { background:#e2ddd5; color:#08080f; border:none; padding:10px 24px; font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; border-radius:3px; cursor:pointer; }
  </style>
</head>
<body>
  <div class="c">
    <h1>You're Offline</h1>
    <p>Peptide Atlas requires an internet connection to load research data. Please check your connection and try again.</p>
    <button onclick="window.location.reload()">Retry Connection</button>
  </div>
</body>
</html>`;
}
