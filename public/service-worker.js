const CACHE_NAME = "my-site-cache-v3";
const DATA_CACHE_NAME = "data-cache-v3";

const FILES_TO_CACHE = [
  "/index.html",
  "/css/styles.css",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",

];

self.addEventListener('fetch', e => {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(request => {
      return request || fetch(e.request)
    })
  )
})

self.addEventListener('install', evt => {
  console.log('Service worker installed');
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Your files were pre-cached!');
      return cache.addAll(FILES_TO_CACHE);
    })
  )

  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  console.log('Service worker activated');
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('Removing old cache data', key);
            return caches.delete(key);
          }
        })
      )
    })
  )

  self.clients.claim();
});