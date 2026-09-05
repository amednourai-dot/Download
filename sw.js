const CACHE_NAME = "video-downloader-v3";

const FILES = [
"./",
"./index.html",
"./style.css",
"./script.js",
"./manifest.json",
"./icon.png"
];

self.addEventListener("install", event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => {
return cache.addAll(FILES);
})
);

self.skipWaiting();

});

self.addEventListener("activate", event => {
event.waitUntil(
caches.keys().then(keys => {
return Promise.all(
keys.map(key => {
if (key !== CACHE_NAME) {
return caches.delete(key);
}
})
);
})
);

self.clients.claim();

});

self.addEventListener("fetch", event => {
event.respondWith(
caches.match(event.request).then(response => {
return response || fetch(event.request);
})
);
});
