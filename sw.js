const cacheName = 'site-static-v23-09' // need to update version with changes
const dynamicCacheName = 'site-dynamic-v6-02' // need to update version with changes
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/sidebar.js',
  '/image/icon-192.png',
  '/image/mtb-image.jpg',
  '/image/tracking-image.png',
  '/css/main.css',
  '/routes/fallback.html'

]

// Limit cache size
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size))
      }
    })
  })
}

// install service worker
self.addEventListener('install', (event) => {
  // console.log('service worker has been installed')
  // This method waits for the assets to be fetched
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('caching shell assets')
      cache.addAll(assets)
  }))
  
})

// activation event
self.addEventListener('activate', (event) => {
  // console.log('service worker has been activated')
  //waitUntil() extends the life of the event
  event.waitUntil(
    caches.keys().then(keys => {
      // console.log(keys)
      return Promise.all(keys
        .filter(key => key !== cacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      )
    })
  )
})

// fetch event
self.addEventListener('fetch', (event) => {
  // console.log('fetch event', event)
  //pauses the fetch request and redirects it
  event.respondWith(
    // if the returned object has the fetched items in the cache, 
    // return that object otherwise continue with the fetch
    caches.match(event.request).then(cacheRes => {
      return cacheRes || fetch(event.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(event.request.url, fetchRes.clone());
          limitCacheSize(dynamicCacheName, 6)
          return fetchRes;
        })
      })
    }).catch(() => {
      if(event.request.url.indexOf('html') > -1) {
        return caches.match('/routes/fallback.html')
      }
    })
  )
})