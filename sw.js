var cacheStorageKey = 'minimal-pwa-1'//缓存的key cashList为缓存的值

var cacheList = [
  '/',
  './sw.js',
  "./demo.html",
  "./logo.png",
  './timg.jpeg',
  './bg.jpg'
]
self.addEventListener('install', e => {
    console.log('SW状态：install')
    e.waitUntil(
      caches.open(cacheStorageKey)
      .then(cache => cache.addAll(cacheList))
      .then(() => self.skipWaiting())
    )
  })

  self.addEventListener('fetch', function(e) {
    console.log('SW状态：fetch')
    // 如果有cache则直接返回，否则通过fetch请求
    e.respondWith(
        caches.match(e.request).then(function (cache) {
            return cache || fetch(e.request);
        }).catch(function (err) {
            console.log(err);
            return fetch(e.request);
        })
    );
  })
  self.addEventListener('activate', function(e) {
    console.log('SW状态：activate')
    var cachePromise = caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (key) {
            if (key !== cacheStorageKey) {
                return caches.delete(key);
            }
        }));
    })
    e.waitUntil(cachePromise);
    return self.clients.claim();
  })