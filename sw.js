const cacheName = 'site-static-v2'
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/image/icon-192.png',
  '/css/main.css',
  '/poems/poem1.html',
  '/poems/poem2.html'

]
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
})

// fetch event
self.addEventListener('fetch', (event) => {
  // console.log('fetch event', event)
  //pauses the fetch request and redirects it
  event.respondWith(
    // if the returned object has the fetched items in the cache, 
    // return that object otherwise continue with the fetch
    caches.match(event.request).then(cacheRes => {
      return cacheRes || fetch(event.request)
    })
  )
})