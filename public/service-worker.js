var CACHE_NAME = "birds-eye-view-v1";
var urlsToCache = ["/", "/static/js/bundle.js"];
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // Open a cache and cache our files
      return cache.addAll(urlsToCache);
    })
  );
});
