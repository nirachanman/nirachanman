const CACHE_NAME = '🟩ﾆﾗﾁｬﾝﾏﾝＨＰ-v1';
// キャッシュする静的ファイル（オフラインでも表示する画面構成）
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// インストール時に静的ファイルをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// リクエスト時のキャッシュ優先＆ネットワークフォールバック制御
self.addEventListener('fetch', (event) => {
  // GAS APIへの通信（POST/GETデータ取得）はキャッシュせず常にネットワークを通す
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // HTMLや画面デザインはキャッシュから超高速読み込み
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
