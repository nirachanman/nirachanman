self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("gym-calendar-cache-v1").then((cache) => {
      return cache.addAll([
        "./calendar-gym.html",
        "./manifest-gym.json"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
