const CACHE_NAME = "math-pwa-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./icon.png",
  "./expr",
  "./slx",
  "./family"
];

// Install: Cache files
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch: Serve from cache, fallback to network
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});