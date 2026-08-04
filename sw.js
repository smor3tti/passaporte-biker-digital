const CACHE = "rota-biker-v1";
const CORE_ASSETS = ["./", "./index.html", "./app.bundle.js", "./manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// network-first para HTML/JS (pra sempre pegar versao nova quando online),
// cache-first como fallback offline
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE).then((c) => c.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
