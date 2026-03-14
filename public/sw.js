// PeptaBase Service Worker
const CACHE_NAME = "peptabase-v1";
const RUNTIME_CACHE = "peptabase-runtime-v1";

const PRECACHE_URLS = ["/", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => cacheNames.filter((name) => !currentCaches.includes(name)))
      .then((toDelete) => Promise.all(toDelete.map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (
    url.origin !== self.location.origin &&
    !url.hostname.includes("fonts.googleapis.com") &&
    !url.hostname.includes("fonts.gstatic.com")
  ) {
    return;
  }

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
            return caches.match("/").then((home) => {
              if (home) return home;
              return new Response(offlineHTML(), {
                headers: { "Content-Type": "text/html" }
              });
            });
          })
        )
    );
    return;
  }

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
  <title>PeptaBase - Offline</title>
  <style>
    body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0A0F1C; color:#E6EDF3; font-family:Georgia, serif; }
    .c { text-align:center; padding:40px; max-width:420px; }
    h1 { font-size:32px; margin-bottom:12px; }
    p { color:rgba(230,237,243,0.72); font-size:14px; line-height:1.7; margin-bottom:24px; }
    button { background:#36E6D4; color:#031216; border:none; padding:10px 24px; font-family:"Courier New", monospace; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; border-radius:999px; cursor:pointer; }
  </style>
</head>
<body>
  <div class="c">
    <h1>You're Offline</h1>
    <p>PeptaBase requires an internet connection to load live research and cloud-synced data. Please check your connection and try again.</p>
    <button onclick="window.location.reload()">Retry Connection</button>
  </div>
</body>
</html>`;
}
