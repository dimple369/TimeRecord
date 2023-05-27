self.addEventListener("install", function (e) {
  e.waitUntil(
    caches
      .open("timerecord")
      .then((cache) =>
        cache.addAll(["/", "/index.html", "/index.js", "/style.css"])
      )
  )
})
self.addEventListener("fetch", (e) => {
  console.log(e.request.url)
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  )
})
