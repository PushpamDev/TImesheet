self.addEventListener("install", (event) => {
    console.log("Service Worker installing.");
    event.waitUntil(
        caches.open("static-v1").then((cache) => {
            return cache.addAll(["/"]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    console.log("Fetching:", event.request.url);
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
