self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("sos-cache").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./script.js"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request);
    })
  );
});
