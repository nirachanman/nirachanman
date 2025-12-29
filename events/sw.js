const CACHE_NAME = "kawaguchi-gym-v1";
const URLS_TO_CACHE = [
  "./calendar-gym2.html",
  "./",        // ルート
  // 必要なら CSS や JS もここに追加
];

// インストール時にキャッシュ
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

// オフライン時はキャッシュから返す
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
