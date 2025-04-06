self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
    console.log('Service Worker activated.');
});

self.addEventListener('fetch', (event) => {
    if (
        event.request.url.startsWith(
            'https://firebasestorage.googleapis.com/v0/b/cv-cherkas-db.appspot.com/',
        )
    ) {
        event.respondWith(
            caches.open('firebase-images').then((cache) => {
                return cache.match(event.request).then((response) => {
                    if (response) {
                        console.log('Serving from cache:', event.request.url);
                        fetch(event.request).then((newResponse) => {
                            if (newResponse.ok) {
                                cache.put(event.request, newResponse.clone());
                            }
                        });
                        return response;
                    } else {
                        return fetch(event.request).then((newResponse) => {
                            if (newResponse.ok) {
                                cache.put(event.request, newResponse.clone());
                            }
                            return newResponse;
                        });
                    }
                });
            }),
        );
    } else {
        event.respondWith(fetch(event.request));
    }
});
